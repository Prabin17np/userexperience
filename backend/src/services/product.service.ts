import { Types } from 'mongoose';
import Product from '../models/product.model';
import {
  IProduct,
  CreateProductBody,
  UpdateProductBody,
  ProductFilterQuery,
  ProductQueryParams,
  IProductImage,
} from '../types/product.types';
import { deleteMultipleFromCloudinary } from '../utils/upload';
import AppError from '../utils/AppError';

interface PaginatedProducts {
  products: IProduct[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

class ProductService {
  async createProduct(
    body: CreateProductBody,
    images: IProductImage[]
  ): Promise<IProduct> {
    const product = await Product.create({ ...body, images });
    return product;
  }

  async updateProduct(
    id: string,
    body: UpdateProductBody,
    newImages: IProductImage[]
  ): Promise<IProduct> {
    if (!Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid product ID.', 400);
    }

    const product = await Product.findById(id);
    if (!product) throw new AppError('Product not found.', 404);

    // Merge existing images (sent back from client) with newly uploaded ones
    const existingImages: IProductImage[] = body.existingImages ?? [];

    // Determine which old images were removed so we can delete from Cloudinary
    const existingPublicIds = new Set(existingImages.map((img) => img.publicId));
    const removedImages = product.images.filter(
      (img) => !existingPublicIds.has(img.publicId)
    );

    if (removedImages.length > 0) {
      await deleteMultipleFromCloudinary(
        removedImages.map((img) => img.publicId)
      );
    }

    const { existingImages: _ignored, ...updateData } = body;

    const updated = await Product.findByIdAndUpdate(
      id,
      {
        ...updateData,
        images: [...existingImages, ...newImages],
      },
      { new: true, runValidators: true }
    );

    if (!updated) throw new AppError('Product not found.', 404);
    return updated;
  }

  async deleteProduct(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid product ID.', 400);
    }

    const product = await Product.findById(id);
    if (!product) throw new AppError('Product not found.', 404);

    // Delete all images from Cloudinary
    if (product.images.length > 0) {
      await deleteMultipleFromCloudinary(
        product.images.map((img) => img.publicId)
      );
    }

    await product.deleteOne();
  }

  async getProducts(query: ProductQueryParams): Promise<PaginatedProducts> {
    const {
      page = '1',
      limit = '12',
      sort = '-createdAt',
      category,
      brand,
      productCollection,
      badge,
      isBestseller,
      minPrice,
      maxPrice,
      search,
    } = query;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const filter: ProductFilterQuery = {};

    if (category) filter.category = category.toLowerCase();
    if (brand) filter.brand = brand;
    if (productCollection) filter.productCollection = productCollection;
    if (badge) filter.badge = badge;
    if (isBestseller !== undefined) filter.isBestseller = isBestseller === 'true';

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sort).skip(skip).limit(limitNum).lean(),
      Product.countDocuments(filter),
    ]);

    return {
      products: products as unknown as IProduct[],
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      limit: limitNum,
    };
  }

  async getProductBySlug(slug: string): Promise<IProduct> {
    const product = await Product.findOne({ slug });
    if (!product) throw new AppError('Product not found.', 404);
    return product;
  }

  async searchProducts(query: string): Promise<IProduct[]> {
    if (!query || query.trim().length < 2) {
      throw new AppError('Search query must be at least 2 characters.', 400);
    }

    return Product.find(
      { $text: { $search: query } },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(20)
      .lean() as unknown as IProduct[];
  }
}

export default new ProductService();