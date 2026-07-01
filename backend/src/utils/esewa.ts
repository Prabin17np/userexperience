import crypto from 'crypto';

const PRODUCT_CODE = process.env.ESEWA_PRODUCT_CODE!;
const SECRET_KEY = process.env.ESEWA_SECRET_KEY!;

export interface EsewaFormPayload {
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

export const generateEsewaSignature = (
  totalAmount: number,
  transactionUuid: string
): string => {
  const message = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${PRODUCT_CODE}`;
  return crypto
    .createHmac('sha256', SECRET_KEY)
    .update(message)
    .digest('base64');
};

export const buildEsewaPayload = (
  orderId: string,
  totalAmount: number,
  successUrl: string,
  failureUrl: string
): EsewaFormPayload => {
  const transactionUuid = `${orderId}-${Date.now()}`;
  const signature = generateEsewaSignature(totalAmount, transactionUuid);

  return {
    amount: String(totalAmount),
    tax_amount: '0',
    total_amount: String(totalAmount),
    transaction_uuid: transactionUuid,
    product_code: PRODUCT_CODE,
    product_service_charge: '0',
    product_delivery_charge: '0',
    success_url: successUrl,
    failure_url: failureUrl,
    signed_field_names: 'total_amount,transaction_uuid,product_code',
    signature,
  };
};

export const verifyEsewaStatus = async (
  totalAmount: number,
  transactionUuid: string
): Promise<{ status: string; ref_id?: string }> => {
  const url = `${process.env.ESEWA_STATUS_URL}?product_code=${PRODUCT_CODE}&total_amount=${totalAmount}&transaction_uuid=${transactionUuid}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('eSewa status check failed');
  return res.json();
};