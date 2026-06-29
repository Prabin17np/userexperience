import { Document, Types } from 'mongoose';

export type ProductBadge = 'NEW' | 'SALE' | '';

export interface IProductImage {
  url: string;
  publicId: string;
}

export interface IProduct extends Document {
  _id: Types.ObjectId;
  name: string;
  brand: string;
  description: string;
  category: string;
  productCollection: string;
  price: number;
  originalPrice?: number;
  badge: ProductBadge;
  isBestseller: boolean;
  sizes: string[];
  images: IProductImage[];
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductFilterQuery {
  category?: string;
  brand?: string;
  productCollection?: string;
  badge?: ProductBadge;
  isBestseller?: boolean;
  price?: {
    $gte?: number;
    $lte?: number;
  };
  $or?: Array<Record<string, unknown>>;
}

export interface ProductQueryParams {
  page?: string;
  limit?: string;
  sort?: string;
  category?: string;
  brand?: string;
  productCollection?: string;
  badge?: ProductBadge;
  isBestseller?: string;
  minPrice?: string;
  maxPrice?: string;
  search?: string;
}

export interface CreateProductBody {
  name: string;
  brand: string;
  description: string;
  category: string;
  productCollection: string;
  price: number;
  originalPrice?: number;
  badge?: ProductBadge;
  isBestseller?: boolean;
  sizes: string[];
}

export interface UpdateProductBody extends Partial<CreateProductBody> {
  existingImages?: IProductImage[];
}