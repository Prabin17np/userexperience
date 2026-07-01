export interface ProductColor {
  name: string;
  hex: string;
}

export interface ProductSize {
  value: string;
  inStock: boolean;
}

export interface ProductAccordionItem {
  title: string;
  content: string;
}

export type ProductCategory =
  | 'Running'
  | 'Hiking'
  | 'Lifestyle'
  | 'Sport'
  | 'Basketball'
  | 'Training'
  | 'Casual'
  | 'Race';

export type ProductTag =
  | 'new-arrivals'
  | 'best-sellers'
  | 'featured'
  | 'sale'
  | 'limited-edition';

export type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'popular';

export interface ProductFilters {
  categories: ProductCategory[];
  priceRange: [number, number];
  sizes: string[];
  sortBy: SortOption;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: ProductCategory;
  collection: string;

  price: number;
  originalPrice?: number;

  description: string;
  images: string[];

  colors: ProductColor[];
  sizes: ProductSize[];

  badge?: 'NEW' | 'SALE';

  tags: ProductTag[];

  rating?: number;
  reviewCount?: number;

  // ✅ IMPORTANT: always array (no undefined ever)
  accordionItems: ProductAccordionItem[];
}