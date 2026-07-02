import { Request, Response } from 'express';
import productService from '../services/product.service';
import { uploadMultipleImages } from '../utils/upload';
import { sendSuccess, sendCreated } from '../utils/response';
import { asyncHandler } from '../middleware/error.middleware';
import { ProductQueryParams } from '../types/product.types';
import AppError from '../utils/AppError';

export const createProduct = asyncHandler(
  async (req: Request, res: Response) => {
    console.log('REQ BODY:', req.body);
   console.log('REQ FILES:', req.files);
    const files = req.files as Express.Multer.File[] | undefined;
    const images = files && files.length > 0
      ? await uploadMultipleImages(files)
      : [];

       const body = { ...req.body };
    if (typeof body.colors === 'string') {
      try {
        body.colors = JSON.parse(body.colors);
      } catch {
        body.colors = [];
      }
    }
    const product = await productService.createProduct(req.body, images);
    sendCreated(res, 'Product created successfully.', { product });
  }
);

export const updateProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[] | undefined;
    const newImages = files && files.length > 0
      ? await uploadMultipleImages(files)
      : [];

    const body = { ...req.body };
    if (typeof body.existingImages === 'string') {
      try {
        body.existingImages = JSON.parse(body.existingImages);
      } catch {
        body.existingImages = [];
      }
    }

    const product = await productService.updateProduct(
      req.params['id'] as string,
      body,
      newImages
    );
    sendSuccess(res, 'Product updated successfully.', { product });
  }
);

export const deleteProduct = asyncHandler(
  async (req: Request, res: Response) => {
    await productService.deleteProduct(req.params['id'] as string);
    sendSuccess(res, 'Product deleted successfully.');
  }
);

export const getProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const query = req.query as unknown as ProductQueryParams;
    const result = await productService.getProducts(query);
    sendSuccess(res, 'Products retrieved successfully.', result);
  }
);

export const getProductBySlug = asyncHandler(
  async (req: Request, res: Response) => {
    const product = await productService.getProductBySlug(req.params['slug'] as string);
    sendSuccess(res, 'Product retrieved successfully.', { product });
  }
);

export const searchProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const q = req.query.q as string;
    if (!q) throw new AppError('Search query (q) is required.', 400);
    const products = await productService.searchProducts(q);
    sendSuccess(res, 'Search results retrieved.', { products, total: products.length });
  }
);