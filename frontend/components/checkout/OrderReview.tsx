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

const PAYMENT_INFO: Record<string, { label: string; icon: string }> = {
  credit_card: { label: 'Credit / Debit Card', icon: '💳' },
  esewa:       { label: 'eSewa',               icon: '🟢' },
  fonepay:     { label: 'FonePay',             icon: '📲' },
};

const Skeleton = ({ w = 'w-full', h = 'h-4', rounded = 'rounded' }: { w?: string; h?: string; rounded?: string }) => (
  <div className={`${w} ${h} ${rounded} animate-pulse`} style={{ background: '#F0EDE8' }} />
);

function SuccessScreen({ orderId, onReset }: { orderId: string | null; onReset: () => void }) {
  const router = useRouter();
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), 80); return () => clearTimeout(t); }, []);

  return (
    <div
      className="text-center py-16 px-6"
      style={{
        opacity: show ? 1 : 0,
        transform: show ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.5s ease, transform 0.5s ease',
      }}
    >
      <div
        className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8"
        style={{
          background: 'linear-gradient(135deg,#D1FAE5,#A7F3D0)',
          boxShadow: '0 8px 32px rgba(16,185,129,0.22)',
        }}
      >
        <svg width="42" height="42" viewBox="0 0 24 24" fill="none">
          <path
            d="M5 13l4 4L19 7"
            stroke="#059669"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: 30,
              strokeDashoffset: show ? 0 : 30,
              transition: 'stroke-dashoffset 0.5s ease 0.35s',
            }}
          />
        </svg>
      </div>

      <h2
        className="font-['Playfair_Display'] text-3xl font-semibold mb-2"
        style={{ color: '#1C1917', letterSpacing: '-0.02em' }}
      >
        Order Confirmed
      </h2>
      <p className="text-sm mb-4" style={{ color: '#78716C', lineHeight: 1.75 }}>
        Thank you for your purchase.<br />Your order is being prepared.
      </p>

      {orderId && (
        <div
          className="
inline-flex
items-center
rounded-full
bg-orange-100
text-orange-700
px-3
py-1.5
text-xs
font-semibold
"
        >
          Order #{orderId.slice(-8).toUpperCase()}
        </div>
      )}

      <p className="text-xs mb-10" style={{ color: '#C4BFB9' }}>
        A confirmation has been sent to your email address.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={() => { onReset(); router.push('/shop'); }}
          className="px-10 py-4 rounded-xl text-sm font-bold uppercase tracking-widest transition-all duration-200"
          style={{ background: '#C8460E', color: '#fff', boxShadow: '0 4px 16px rgba(200,70,14,0.28)' }}
          onMouseEnter={(e) => { (e.currentTarget.style.transform = 'translateY(-1px)'); (e.currentTarget.style.boxShadow = '0 8px 24px rgba(200,70,14,0.35)'); }}
          onMouseLeave={(e) => { (e.currentTarget.style.transform = 'translateY(0)'); (e.currentTarget.style.boxShadow = '0 4px 16px rgba(200,70,14,0.28)'); }}
        >
          Continue Shopping
        </button>
        <button
          onClick={() => router.push('/')}
          className="px-10 py-4 rounded-xl text-sm font-semibold uppercase tracking-widest transition-all duration-200 border-[1.5px]"
          style={{ borderColor: '#E7E5E4', color: '#78716C', background: 'transparent' }}
          onMouseEnter={(e) => { (e.currentTarget.style.borderColor = '#1C1917'); (e.currentTarget.style.color = '#1C1917'); }}
          onMouseLeave={(e) => { (e.currentTarget.style.borderColor = '#E7E5E4'); (e.currentTarget.style.color = '#78716C'); }}
        >
          Track Order
        </button>
      </div>
    </div>
  );
}

export function OrderReview({ onBack }: Props) {
  const router = useRouter();

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
  const items          = useCartStore((s) => s.items);

  const [mounted,      setMounted]      = useState(false);
  const [placed,       setPlaced]       = useState(false);
  const [redirecting,  setRedirecting]  = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [btnHover,     setBtnHover]     = useState(false);

  useEffect(() => setMounted(true), []);

  const { subtotal, shipping, tax, total } = mounted
    ? getOrderTotal()
    : { subtotal: 0, shipping: 0, tax: 0, total: 0 };

  async function handlePlaceOrder() {
    setPaymentError(null);
    try {
      await placeOrder();
      if (paymentDetails.method === 'esewa') {
        const newOrderId = useCheckoutStore.getState().orderId;
        if (!newOrderId) throw new Error('Order ID missing.');
        setRedirecting(true);
        const { paymentUrl, formData } = await paymentApi.initiateEsewa(newOrderId);
        redirectToEsewa(paymentUrl, formData);
        return;
      }
      setPlaced(true);
    } catch (err) {
      setRedirecting(false);
      setPaymentError(err instanceof Error ? err.message : 'Something went wrong');
    }
  }

  if (orderComplete || placed) return <SuccessScreen orderId={orderId} onReset={resetCheckout} />;

  if (redirecting) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-6 animate-pulse">💳</div>
        <h2 className="font-['Playfair_Display'] text-2xl font-semibold mb-3" style={{ color: '#1C1917' }}>
          Redirecting to eSewa
        </h2>
        <p className="text-sm" style={{ color: '#78716C' }}>
          Please wait while we take you to the payment gateway…
        </p>
        <div className="flex justify-center mt-6 gap-1.5">
          {[0,1,2].map((i) => (
            <div key={i} className="w-2 h-2 rounded-full" style={{ background: '#C8460E', animation: `pulse 1.2s ease-in-out ${i*0.2}s infinite` }} />
          ))}
        </div>
      </div>
    );
  }

  const payInfo = PAYMENT_INFO[paymentDetails.method] ?? PAYMENT_INFO.credit_card;

 const card =
  "rounded-2xl border p-6 mb-4 bg-[var(--surface-sunken)] border-[var(--border)]";

const sectionLabel =
  "block mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--text-muted)]";

  return (
    <div style={{ fontFamily: 'Inter, Geist, system-ui, sans-serif' }}>

      {/* Header */}
      <div className="mb-7">
        <h2
        className="
font-['Playfair_Display']
text-3xl
font-semibold
tracking-tight
text-[var(--text)]
"
        >
          Review Your Order
        </h2>
        <p className="text-sm" style={{ color: '#A8A29E' }}>
          Please review the details below before completing your purchase.
        </p>
      </div>

      {/* Error */}
      {(error || paymentError) && (
        <div
          className="flex items-start gap-3 mb-5 p-4 rounded-xl"
          style={{ background: '#FFF5F5', border: '1px solid #FED7D7', borderLeft: '4px solid #E53E3E' }}
        >
          <span className="text-base flex-shrink-0">⚠️</span>
          <div>
            <p className="text-sm font-semibold mb-0.5" style={{ color: '#C53030' }}>Something went wrong</p>
            <p className="text-xs" style={{ color: '#E53E3E' }}>{error || paymentError}</p>
          </div>
        </div>
      )}

      {/* Card 1 — Items */}
      <div className={card}>
        <span className={sectionLabel}>
          Order Items {mounted && `· ${items.length} ${items.length === 1 ? 'item' : 'items'}`}
        </span>

        {!mounted ? (
          <div className="flex flex-col gap-5">
            {[1,2].map((i) => (
              <div key={i} className="flex gap-4 items-center">
                <Skeleton w="w-[72px]" h="h-[72px]" rounded="rounded-xl" />
                <div className="flex-1 flex flex-col gap-2">
                  <Skeleton w="w-3/4" h="h-3" />
                  <Skeleton w="w-1/2" h="h-3" />
                </div>
                <Skeleton w="w-14" h="h-4" />
              </div>
            ))}
          </div>
        ) : (
          items.map((item, idx) => (
            <div key={item.id}>
              <div className="flex gap-4 items-center py-4">
                <div
                  className="
relative
w-[72px]
h-[72px]
rounded-xl
overflow-hidden
bg-[var(--surface)]
"
                >
                  <Image src={item.product.images[0]} alt={item.product.name} fill sizes="72px" className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate mb-1" style={{ color: '#1C1917' }}>
                    {item.product.name}
                  </p>
                  <p className="text-sm text-[var(--text-muted)]">
                    Size {item.selectedSize} · {item.selectedColor} · Qty {item.quantity}
                  </p>
                </div>
              <div className="text-right flex-shrink-0">
  <p className="text-sm font-semibold text-[var(--text)]">
    Rs. {(item.product.price * item.quantity).toLocaleString()}
  </p>

  {item.quantity > 1 && (
    <p className="text-xs" style={{ color: '#C4BFB9' }}>
      Rs. {item.product.price.toLocaleString()} each
    </p>
  )}
</div>
              </div>
              {idx < items.length - 1 && <div style={{ height: 1, background: '#F0EDE8' }} />}
            </div>
          ))
        )}
      </div>

      {/* Card 2 — Shipping */}
      <div className={card}>
        <div className="flex items-start justify-between">
          <span className={sectionLabel}>Shipping Information</span>
          <button
            onClick={onBack}
            className="text-xs font-semibold transition-opacity duration-150 hover:opacity-60 -mt-1"
            style={{ color: '#C8460E' }}
          >
            Edit
          </button>
        </div>

        <p className="text-sm font-semibold mb-3" style={{ color: '#1C1917' }}>{address.fullName || '—'}</p>

        <div className="flex flex-col gap-2.5">
          {[
            { icon: '📍', value: address.address },
            { icon: '🏙️', value: address.city },
            { icon: '📞', value: address.phone },
            { icon: '✉️', value: address.email },
          ].filter(r => r.value).map(({ icon, value }) => (
            <div key={icon} className="flex items-center gap-2.5">
              <span className="text-sm flex-shrink-0" style={{ opacity: 0.45 }}>{icon}</span>
              <span className="text-sm" style={{ color: '#78716C' }}>{value}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4" style={{ borderTop: '1px solid #F0EDE8' }}>
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
            style={
              shippingMethod === 'express'
                ? { background: '#FEF3C7', color: '#92400E' }
                : { background: '#F0FDF4', color: '#166534' }
            }
          >
            {shippingMethod === 'express' ? '🚀 Express Shipping · 1–2 Days' : '📦 Standard Shipping · 3–5 Days'}
          </span>
        </div>
      </div>

      {/* Card 3 — Payment */}
     <div className={card}>
        <span className={sectionLabel}>Payment Method</span>
        {!mounted ? (
          <div className="flex items-center gap-3">
            <Skeleton w="w-10" h="h-10" rounded="rounded-xl" />
            <div className="flex flex-col gap-2"><Skeleton w="w-32" h="h-3" /><Skeleton w="w-20" h="h-3" /></div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ background: '#F5F5F4' }}>
              {payInfo.icon}
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: '#1C1917' }}>{payInfo.label}</p>
              {paymentDetails.method === 'credit_card' && paymentDetails.creditCard?.cardNumber && (
                <p className="text-xs text-[var(--text-muted)]">
                  Visa •••• {paymentDetails.creditCard.cardNumber.replace(/\s/g, '').slice(-4)}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Card 4 — Order Total (dark) */}
      <div className={card} style={{ background: '#2A2623', border: '1px solid rgba(255,255,255,0.06)', marginBottom: 0 }}>
        <span className={sectionLabel} style={{ color: '#57534E' }}>Order Summary</span>

        <div className="flex flex-col gap-3">
          {[
            { l: 'Subtotal', v: subtotal },
            { l: `Shipping (${shippingMethod === 'express' ? 'Express' : 'Standard'})`, v: shipping },
            { l: 'Tax (8%)', v: tax },
          ].map(({ l, v }) => (
            <div key={l} className="flex justify-between items-center">
              <span className="text-sm" style={{ color: '#78716C' }}>{l}</span>
              {mounted
                ? <span className="text-sm font-medium" style={{ color: '#D4CFCA' }}>Rs. {v.toLocaleString()}</span>
                : <Skeleton w="w-14" h="h-3" />
              }
            </div>
          ))}

          <div style={{ height: 1, background: '#292524', margin: '0.25rem 0' }} />

          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#57534E' }}>Total</span>
            {mounted
              ? <span className="font-['Playfair_Display'] font-semibold" style={{ color: '#C8460E', fontSize: '1.6rem', letterSpacing: '-0.01em' }}>Rs. {total.toLocaleString()}</span>
              : <Skeleton w="w-24" h="h-7" rounded="rounded-md" />
            }
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-5">
        <button
          type="button"
          onClick={onBack}
          disabled={isProcessing}
          className="px-7 py-4 rounded-xl text-sm font-semibold transition-all duration-200 border-[1.5px] disabled:opacity-40"
          style={{ borderColor: '#E7E5E4', color: '#78716C', background: 'transparent' }}
          onMouseEnter={(e) => { (e.currentTarget.style.borderColor = '#1C1917'); (e.currentTarget.style.color = '#1C1917'); }}
          onMouseLeave={(e) => { (e.currentTarget.style.borderColor = '#E7E5E4'); (e.currentTarget.style.color = '#78716C'); }}
        >
          ← Back
        </button>

        <button
          type="button"
          onClick={handlePlaceOrder}
          disabled={isProcessing || !mounted || items.length === 0}
          onMouseEnter={() => setBtnHover(true)}
          onMouseLeave={() => setBtnHover(false)}
          className="flex-1 py-4 rounded-xl text-sm font-bold uppercase tracking-widest transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2.5"
          style={{
            background: '#C8460E',
            color: '#fff',
            boxShadow: btnHover && !isProcessing ? '0 8px 28px rgba(200,70,14,0.38)' : '0 4px 14px rgba(200,70,14,0.22)',
            transform: btnHover && !isProcessing ? 'translateY(-1px)' : 'translateY(0)',
          }}
        >
          {isProcessing ? (
            <>
              <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              Processing…
            </>
          ) : (
            <>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Complete Purchase
            </>
          )}
        </button>
      </div>

      <p className="text-center text-xs mt-5" style={{ color: '#C4BFB9' }}>
        By completing your purchase you agree to our{' '}
        <span style={{ color: '#A8A29E', textDecoration: 'underline', cursor: 'pointer' }}>Terms</span>
        {' & '}
        <span style={{ color: '#A8A29E', textDecoration: 'underline', cursor: 'pointer' }}>Privacy Policy</span>.
      </p>
    </div>
  );
}