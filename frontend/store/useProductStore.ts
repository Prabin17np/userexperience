import { create } from 'zustand';
import { productsApi, ProductFilters, PaginatedProducts, mapBackendProduct } from '@/lib/api/products';
import { Product } from '@/types/product';
import {
  createProductAction,
  updateProductAction,
  deleteProductAction,
} from '@/lib/action/admin.action';

interface ProductStore {
  // Data
  products: Product[];
  currentProduct: Product | null;
  searchResults: Product[];
  total: number;
  page: number;
  totalPages: number;

  // Filters (your existing filter shape + API params merged)
  filters: ProductFilters & {
    categories: string[];
    priceRange: [number, number];
    sizes: string[];
    sortBy: string;
  };

  searchQuery: string;
  isLoading: boolean;
  error: string | null;

  // Fetch actions
  fetchProducts: (overrides?: Partial<ProductFilters>) => Promise<void>;
  fetchProductBySlug: (slug: string) => Promise<void>;
  searchProducts: (query: string) => Promise<void>;

  // Filter actions (keep your existing ones)
  setCategory: (categories: string[]) => void;
  toggleCategory: (category: string) => void;
  setPriceRange: (range: [number, number]) => void;
  toggleSize: (size: string) => void;
  setSortBy: (sort: string) => void;
  setSearchQuery: (query: string) => void;
  resetFilters: () => void;
  clearCurrentProduct: () => void;
  clearError: () => void;

  // Admin actions — take FormData, since that's what productsApi expects
  createProduct: (formData: FormData) => Promise<void>;
  updateProduct: (id: string, formData: FormData) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

const DEFAULT_FILTERS = {
  categories: [] as string[],
  priceRange: [0, 500] as [number, number],
  sizes: [] as string[],
  sortBy: 'newest',
  page: 1,
  limit: 12,
  sort: '-createdAt',
};

// Map your existing filter shape → API query params
const mapFiltersToQuery = (filters: ProductStore['filters']): ProductFilters => ({
  page: filters.page,
  limit: filters.limit,
  sort: filters.sortBy === 'newest'
    ? '-createdAt'
    : filters.sortBy === 'price-asc'
    ? 'price'
    : filters.sortBy === 'price-desc'
    ? '-price'
    : '-createdAt',
  category: filters.categories[0],
  minPrice: filters.priceRange[0] > 0 ? filters.priceRange[0] : undefined,
  maxPrice: filters.priceRange[1] < 500 ? filters.priceRange[1] : undefined,
});

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  currentProduct: null,
  searchResults: [],
  total: 0,
  page: 1,
  totalPages: 1,
  filters: DEFAULT_FILTERS,
  searchQuery: '',
  isLoading: false,
  error: null,

  fetchProducts: async (overrides = {}) => {
    set({ isLoading: true, error: null });
    try {
      const query = { ...mapFiltersToQuery(get().filters), ...overrides };
      const result: PaginatedProducts = await productsApi.getProducts(query);
      set({
        products: result.products,
        total: result.total,
        page: result.page,
        totalPages: result.totalPages,
        isLoading: false,
      });
    } catch (err) {
      set({ error: extractError(err), isLoading: false });
    }
  },

  fetchProductBySlug: async (slug) => {
    set({ isLoading: true, error: null, currentProduct: null });
    try {
      const product = await productsApi.getProductBySlug(slug);
      set({ currentProduct: product, isLoading: false });
    } catch (err) {
      set({ error: extractError(err), isLoading: false });
    }
  },

  searchProducts: async (query) => {
    set({ isLoading: true, error: null, searchQuery: query });
    try {
      const products = await productsApi.searchProducts(query);
      set({ searchResults: products, isLoading: false });
    } catch (err) {
      set({ error: extractError(err), isLoading: false });
    }
  },

 
  setCategory: (categories) =>
    set((s) => ({ filters: { ...s.filters, categories, page: 1 } })),

  toggleCategory: (category) => {
    const current = get().filters.categories;
    const updated = current.includes(category)
      ? current.filter((c) => c !== category)
      : [...current, category];
    set((s) => ({ filters: { ...s.filters, categories: updated, page: 1 } }));
  },

  setPriceRange: (range) =>
    set((s) => ({ filters: { ...s.filters, priceRange: range, page: 1 } })),

  toggleSize: (size) => {
    const current = get().filters.sizes;
    const updated = current.includes(size)
      ? current.filter((sz) => sz !== size)
      : [...current, size];
    set((s) => ({ filters: { ...s.filters, sizes: updated, page: 1 } }));
  },

  setSortBy: (sortBy) =>
    set((s) => ({ filters: { ...s.filters, sortBy, page: 1 } })),

  setSearchQuery: (query) => set({ searchQuery: query }),

  resetFilters: () =>
    set({ filters: DEFAULT_FILTERS, searchQuery: '', searchResults: [] }),

  clearCurrentProduct: () => set({ currentProduct: null }),
  clearError: () => set({ error: null }),

  //Admin
  createProduct: async (formData) => {
    set({ isLoading: true, error: null });
    try {
      const backendProduct = await createProductAction(formData);
      const product = mapBackendProduct(backendProduct);
      set((s) => ({ products: [product, ...s.products], isLoading: false }));
    } catch (err) {
      set({ error: extractError(err), isLoading: false });
      throw err;
    }
  },

  updateProduct: async (id, formData) => {
    set({ isLoading: true, error: null });
    try {
      const backendProduct = await updateProductAction(id, formData);
      const updated = mapBackendProduct(backendProduct);
      set((s) => ({
        products: s.products.map((p) => (p.id === id ? updated : p)),
        currentProduct: s.currentProduct?.id === id ? updated : s.currentProduct,
        isLoading: false,
      }));
    } catch (err) {
      set({ error: extractError(err), isLoading: false });
      throw err;
    }
  },

  deleteProduct: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await deleteProductAction(id);
      set((s) => ({
        products: s.products.filter((p) => p.id !== id),
        isLoading: false,
      }));
    } catch (err) {
      set({ error: extractError(err), isLoading: false });
      throw err;
    }
  },
}));

const extractError = (err: unknown): string => {
  if (
    err &&
    typeof err === 'object' &&
    'response' in err &&
    err.response &&
    typeof err.response === 'object' &&
    'data' in err.response
  ) {
    const d = err.response.data as { message?: string };
    return d.message || 'Something went wrong';
  }
  if (err instanceof Error) return err.message;
  return 'Something went wrong';
};