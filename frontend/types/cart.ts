import { Product } from './product';

export interface CartItem {
  id: string;
  product: Product;
  selectedColor: string;
  selectedSize: string;
  quantity: number;
}

export interface PromoCode {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
}

export interface Cart {
  items: CartItem[];
  promoCode?: PromoCode;
}

export interface CartSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
}