export type CheckoutStep = 1 | 2 | 3;

export type ShippingMethod = 'standard' | 'express';

export type PaymentMethod = 'credit_card' | 'esewa' | 'fonepay';

export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  zipCode: string;
  phone: string;
}

export interface ShippingOption {
  id: ShippingMethod;
  label: string;
  description: string;
  price: number;
}

export interface CreditCardDetails {
  cardholderName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
}

export interface PaymentDetails {
  method: PaymentMethod;
  creditCard?: CreditCardDetails;
  billingAddressSameAsShipping: boolean;
}

export interface CheckoutState {
  step: CheckoutStep;
  shippingAddress: ShippingAddress;
  shippingMethod: ShippingMethod;
  paymentDetails: PaymentDetails;
  promoCode: string;
}