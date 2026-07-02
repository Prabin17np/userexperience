import axiosInstance from "./axios";
import { ENDPOINTS } from "./endpoint";
import { Product, ProductCategory } from "@/types/product";

//Backend shape
export interface BackendProduct {
  _id: string;
  name: string;
  brand: string;
  description: string;
  category: string;
  productCollection: string;
  price: number;
  originalPrice?: number;
  badge: "NEW" | "SALE" | "";
  isBestseller: boolean;
  sizes: string[];
  images: { url: string; publicId: string }[];
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface BackendPaginatedProducts {
  products: BackendProduct[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

// Frontend-facing paginated shape — Product[], not BackendProduct[]
export interface PaginatedProducts {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  sort?: string;
  category?: string;
  brand?: string;
  productCollection?: string;
  badge?: "NEW" | "SALE" | "";
  isBestseller?: boolean;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

// Mapper: backend → frontend Product type
export const mapBackendProduct = (p: BackendProduct): Product => ({
  id: p._id,
  slug: p.slug,
  name: p.name,
  brand: p.brand,
  description: p.description,
  category: p.category as ProductCategory,
  collection: p.productCollection,
  price: p.price,
  originalPrice: p.originalPrice,
  badge: (p.badge === "NEW" || p.badge === "SALE") ? p.badge : undefined,
  sizes: p.sizes.map((s) => ({ value: s, inStock: true })),
  images: p.images.map((img) => img.url),
  colors: [{ name: "Default", hex: "#111111" }],
  tags: p.isBestseller ? ["best-sellers"] : [],
  rating: undefined,
  reviewCount: undefined,
  accordionItems: [],
});

// API calls
export const productsApi = {
  getProducts: async (filters: ProductFilters = {}): Promise<PaginatedProducts> => {
    const params = new URLSearchParams();
    (Object.entries(filters) as [string, unknown][]).forEach(([key, value]) => {
      if (value !== undefined && value !== "") params.append(key, String(value));
    });
    const { data } = await axiosInstance.get(`${ENDPOINTS.PRODUCTS.BASE}?${params}`);
    const result = data.data as BackendPaginatedProducts;

    return {
      products: result.products.map(mapBackendProduct), // ← properly mapped
      total: result.total,
      page: result.page,
      totalPages: result.totalPages,
      limit: result.limit, // ← now included
    };
  },

  getProductBySlug: async (slug: string): Promise<Product> => {
    const { data } = await axiosInstance.get(ENDPOINTS.PRODUCTS.BY_SLUG(slug));
    return mapBackendProduct(data.data.product as BackendProduct);
  },

  searchProducts: async (query: string): Promise<Product[]> => {
    const { data } = await axiosInstance.get(
      `${ENDPOINTS.PRODUCTS.SEARCH}?q=${encodeURIComponent(query)}`
    );
    return (data.data.products as BackendProduct[]).map(mapBackendProduct);
  },

  // Admin only
createProduct: async (payload: FormData): Promise<BackendProduct> => {
  const { data } = await axiosInstance.post(ENDPOINTS.PRODUCTS.BASE, payload, {
    headers: { 'Content-Type': undefined },
  });
  return data.data.product;
},

updateProduct: async (id: string, payload: FormData): Promise<BackendProduct> => {
  const { data } = await axiosInstance.put(ENDPOINTS.PRODUCTS.BY_ID(id), payload, {
    headers: { 'Content-Type': undefined },
  });
  return data.data.product;
},

  deleteProduct: async (id: string): Promise<void> => {
    await axiosInstance.delete(ENDPOINTS.PRODUCTS.BY_ID(id));
  },
};