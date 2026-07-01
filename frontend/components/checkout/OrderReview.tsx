'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCheckoutStore } from '@/store/useCheckoutStore';
import { useCartStore } from '@/store';
import { paymentApi } from '@/lib/api/payment';
import { redirectToEsewa } from '@/lib/esewaRedirect';

interface Props {
  onBack: () => void;
}

const PAYMENT_LABELS: Record<string, string> = {
  credit_card: 'Credit / Debit Card',
  esewa:       'eSewa',
  fonepay:     'FonePay',
};

export function OrderReview({ onBack }: Props) {
  const router = useRouter(); // ← moved to top, must run on every render

  const address        = useCheckoutStore((s) => s.address);
  const shippingMethod = useCheckoutStore((s) => s.shippingMethod);
  const paymentDetails = useCheckoutStore((s) => s.paymentDetails);
  const isProcessing   = useCheckoutStore((s) => s.isProcessing);
  const orderComplete  = useCheckoutStore((s) => s.orderComplete);
  const orderId        = useCheckoutStore((s) => s.orderId);
  const error          = useCheckoutStore((s) => s.error);
  const placeOrder     = useCheckoutStore((s) => s.placeOrder);
  const resetCheckout  = useCheckoutStore((s) => s.resetCheckout);
  const getOrderTotal  = useCheckoutStore((s) => s.getOrderTotal);

  const items = useCartStore((s) => s.items);

  const [mounted, setMounted]             = useState(false);
  const [placed, setPlaced]               = useState(false);
  const [redirecting, setRedirecting]     = useState(false);
  const [paymentError, setPaymentError]   = useState<string | null>(null);

  useEffect(() => setMounted(true), []);

  // Only compute totals after mount to avoid SSR mismatch
  const { subtotal, shipping, tax, total } = mounted
    ? getOrderTotal()
    : { subtotal: 0, shipping: 0, tax: 0, total: 0 };

  async function handlePlaceOrder() {
    setPaymentError(null);
    try {
      await placeOrder();

      // If eSewa was selected, redirect to the gateway instead of showing success
      if (paymentDetails.method === 'esewa') {
        const newOrderId = useCheckoutStore.getState().orderId;
        if (!newOrderId) throw new Error('Order ID missing — cannot start eSewa payment.');

        setRedirecting(true);
        const { paymentUrl, formData } = await paymentApi.initiateEsewa(newOrderId);
        redirectToEsewa(paymentUrl, formData);
        return; // browser is navigating away — don't setPlaced
      }

      setPlaced(true);
    } catch (err) {
      setRedirecting(false);
      const message = err instanceof Error ? err.message : 'Something went wrong';
      setPaymentError(message);
    }
  }

  //Success screen
  if (orderComplete || placed) {
    return (
      <div className="text-center py-16 px-4">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-3xl mx-auto mb-6"
          style={{ background: '#D1FAE5', color: '#065F46' }}
        >
          ✓
        </div>
        <h2
          className="font-['Playfair_Display'] text-3xl font-semibold mb-3"
          style={{ color: 'var(--text)' }}
        >
          Order Confirmed!
        </h2>
        <p className="text-sm mb-1" style={{ color: 'var(--text2)' }}>
          Thank you for your purchase. We&apos;ll get it ready soon.
        </p>
        {orderId && (
          <p className="text-sm font-semibold mt-2 mb-8" style={{ color: 'var(--accent)' }}>
            Order ID: #{orderId}
          </p>
        )}
        <button
          onClick={() => { resetCheckout(); router.push('/shop'); }}
          className="px-10 py-4 rounded-lg text-sm font-semibold uppercase tracking-wide transition-all duration-200 hover:opacity-90"
          style={{ background: 'var(--text)', color: 'var(--bg)' }}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  //Redirecting to eSewa screen
  if (redirecting) {
    return (
      <div className="text-center py-16 px-4">
        <div className="text-4xl mb-5 animate-pulse">💳</div>
        <h2 className="font-['Playfair_Display'] text-2xl font-semibold mb-2" style={{ color: 'var(--text)' }}>
          Redirecting to eSewa…
        </h2>
        <p className="text-sm" style={{ color: 'var(--text2)' }}>
          Please wait, you&apos;ll be redirected to complete your payment.
        </p>
      </div>
    );
  }

  // Totals skeleton while not mounted
  const TotalRow = ({ label, value, large }: { label: string; value: string; large?: boolean }) => (
    <div
      className={`flex justify-between ${large ? 'items-baseline text-base font-bold pt-3 mt-1' : ''}`}
      style={{
        color: large ? 'var(--text)' : 'var(--text2)',
        ...(large ? { borderTop: '1px solid var(--border2)' } : {}),
      }}
    >
      <span>{label}</span>
      {mounted ? (
        <span>${value}</span>
      ) : (
        <span className="w-16 h-4 rounded animate-pulse bg-gray-200 inline-block" />
      )}
    </div>
  );

  return (
    <div>
      <h2
        className="font-['Playfair_Display'] text-2xl font-semibold mb-6"
        style={{ color: 'var(--text)' }}
      >
        Review Your Order
      </h2>

      {/* Error — from order creation */}
      {error && (
        <div
          className="mb-5 px-4 py-3 rounded-xl text-sm flex items-center gap-2"
          style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}
        >
          ⚠ {error}
        </div>
      )}

      {/* Error — from eSewa initiation */}
      {paymentError && (
        <div
          className="mb-5 px-4 py-3 rounded-xl text-sm flex items-center gap-2"
          style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}
        >
          ⚠ {paymentError}
        </div>
      )}

      {/* Items */}
      <div className="rounded-2xl border-[1.5px] p-5 mb-5" style={{ borderColor: 'var(--border)' }}>
        <h3 className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: 'var(--text2)' }}>
          Items ({mounted ? items.length : '—'})
        </h3>
        {mounted ? (
          <div className="flex flex-col gap-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-3 items-center">
                <div
                  className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0"
                  style={{ background: 'var(--surface2)' }}
                >
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.name}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>
                    {item.product.name}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text3)' }}>
                    Size {item.selectedSize} · {item.selectedColor} · Qty {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-semibold flex-shrink-0" style={{ color: 'var(--text)' }}>
                  ${(item.product.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {[1, 2].map((i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="w-14 h-14 rounded-lg bg-gray-200 flex-shrink-0" />
                <div className="flex-1 flex flex-col gap-2 pt-1">
                  <div className="h-3 rounded w-3/4 bg-gray-200" />
                  <div className="h-3 rounded w-1/2 bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delivery info */}
      <div className="rounded-2xl border-[1.5px] p-5 mb-5" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text2)' }}>
            Delivery Details
          </h3>
          <button
            onClick={onBack}
            className="text-xs font-semibold transition-opacity hover:opacity-70"
            style={{ color: 'var(--accent)' }}
          >
            Edit
          </button>
        </div>
        <div className="flex flex-col gap-1 text-sm">
          <p className="font-semibold" style={{ color: 'var(--text)' }}>{address.fullName}</p>
          <p style={{ color: 'var(--text2)' }}>{address.address}</p>
          <p style={{ color: 'var(--text2)' }}>{address.city}</p>
          <p style={{ color: 'var(--text2)' }}>{address.phone}</p>
          <p style={{ color: 'var(--text2)' }}>{address.email}</p>
        </div>
        <p
          className="text-sm font-medium mt-3 pt-3"
          style={{ color: 'var(--text)', borderTop: '1px solid var(--border)' }}
        >
          {shippingMethod === 'express'
            ? '🚀 Express Shipping (1–2 days)'
            : '📦 Standard Shipping (3–5 days)'}
        </p>
      </div>

      {/* Payment */}
      <div className="rounded-2xl border-[1.5px] p-5 mb-5" style={{ borderColor: 'var(--border)' }}>
        <h3 className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--text2)' }}>
          Payment Method
        </h3>
        <p className="text-sm" style={{ color: 'var(--text)' }}>
          {PAYMENT_LABELS[paymentDetails.method] ?? paymentDetails.method}
          {paymentDetails.method === 'credit_card' && paymentDetails.creditCard?.cardNumber && (
            <span style={{ color: 'var(--text3)' }}>
              {' '}•••• {paymentDetails.creditCard.cardNumber.replace(/\s/g, '').slice(-4)}
            </span>
          )}
        </p>
      </div>

      {/* Order total */}
      <div
        className="rounded-2xl p-5 mb-8"
        style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}
      >
        <h3 className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: 'var(--text2)' }}>
          Order Total
        </h3>
        <div className="flex flex-col gap-2 text-sm">
          <TotalRow label="Subtotal"                        value={subtotal.toFixed(2)} />
          <TotalRow label={`Shipping (${shippingMethod})`}  value={shipping.toFixed(2)} />
          <TotalRow label="Tax (8%)"                         value={tax.toFixed(2)} />
          <TotalRow label="Total"                            value={total.toFixed(2)} large />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={isProcessing}
          className="px-8 py-4 rounded-lg text-sm font-semibold uppercase tracking-wide border-[1.5px] transition-all duration-200 hover:opacity-80 disabled:opacity-50"
          style={{ borderColor: 'var(--border2)', color: 'var(--text)' }}
        >
          ← Back
        </button>

        <button
          type="button"
          onClick={handlePlaceOrder}
          disabled={isProcessing || !mounted || items.length === 0}
          className="flex-1 px-10 py-4 rounded-lg text-sm font-semibold uppercase tracking-wide transition-all duration-200 hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
          style={{ background: 'var(--text)', color: 'var(--bg)' }}
        >
          {isProcessing ? (
            <><span className="inline-block animate-spin">⟳</span> Placing Order…</>
          ) : (
            'Place Order 🔒'
          )}
        </button>
      </div>

      <p className="text-center text-xs mt-5" style={{ color: 'var(--text3)' }}>
        By placing your order, you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  );
}