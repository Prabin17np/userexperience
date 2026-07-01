export const ENDPOINTS = {
  // Auth
  AUTH: {
    REGISTER:        '/auth/register',
    LOGIN:           '/auth/login',
    LOGOUT:          '/auth/logout',
    REFRESH_TOKEN:   '/auth/refresh-token',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD:  '/auth/reset-password',
  },

  // User
  USER: {
    ME:              '/users/me',
    CHANGE_PASSWORD: '/users/me/change-password',
  },

  // Products
  PRODUCTS: {
    BASE:            '/products',
    SEARCH:          '/products/search',
    BY_SLUG: (slug: string) => `/products/${slug}`,
    BY_ID:   (id: string)   => `/products/${id}`,
  },

  // Orders
  ORDERS: {
    BASE:            '/orders',
    MY_ORDERS:       '/orders/me',
    BY_ID:   (id: string)   => `/orders/${id}`,
  },

  // Admin
  ADMIN: {
    ALL_ORDERS:            '/admin/orders',
    UPDATE_ORDER_STATUS: (id: string) => `/admin/orders/${id}/status`,
  },
} as const;