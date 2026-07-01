// lib/esewaRedirect.ts
import { EsewaFormData } from './api/payment';

export const redirectToEsewa = (paymentUrl: string, formData: EsewaFormData) => {
  // If it's our mock page, use query params (GET) instead of form POST
  if (paymentUrl.includes('/checkout/esewa/mock')) {
    const params = new URLSearchParams(formData as unknown as Record<string, string>);
    window.location.href = `${paymentUrl}?${params.toString()}`;
    return;
  }

  // Real eSewa — POST form submission
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = paymentUrl;

  Object.entries(formData).forEach(([key, value]) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = value;
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
};