import axiosInstance from './axios';

export interface EsewaFormData {
  amount: string;
  tax_amount: string;
  total_amount: string;
  transaction_uuid: string;
  product_code: string;
  product_service_charge: string;
  product_delivery_charge: string;
  success_url: string;
  failure_url: string;
  signed_field_names: string;
  signature: string;
}

export const paymentApi = {
  initiateEsewa: async (orderId: string) => {
    const { data } = await axiosInstance.post(`/payments/esewa/initiate/${orderId}`);
    return data.data as { paymentUrl: string; formData: EsewaFormData };
  },

  verifyEsewa: async (encodedData: string) => {
    const { data } = await axiosInstance.post('/payments/esewa/verify', {
      data: encodedData,
    });
    return data.data;
  },
};