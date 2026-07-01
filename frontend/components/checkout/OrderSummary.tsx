'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useCartStore } from '@/store';
import { useCheckoutStore } from '@/store/useCheckoutStore';

interface Props {
  ctaLabel:    string;
  onCta:       () => void;
  ctaDisabled?: boolean;
  secureNote?:  string;
}

export function OrderSummary({
  ctaLabel,
  onCta,
  ctaDisabled  = false,
  secureNote   = 'Secure Encrypted Checkout',
}: Props) {
  const items          = useCartStore((s) => s.items);
  const getOrderTotal  = useCheckoutStore((s) => s.getOrderTotal);
  const shippingMethod = useCheckoutStore((s) => s.shippingMethod);

  const [mounted,   setMounted]   = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => setMounted(true), []);

  // Recalculates whenever shippingMethod or items change
  const { subtotal, shipping, tax, total } = getOrderTotal();

  function handleCta() {
    setConfirmed(true);
    setTimeout(() => {
      onCta();
      setConfirmed(false);
    }, 500);
  }

  if (!mounted) {
    return (
      <div className="bg-[#f3f4f6] border border-[#dcdcdc] rounded-2xl p-8 shadow-[0_4px_12px_rgba(0,0,0,0.05)] sticky top-24">
        <div className="text-[0.85rem] font-extrabold tracking-[0.15em] uppercase mb-6" style={{ color: 'var(--text)' }}>
          Order Summary
        </div>
        <div className="flex flex-col gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-16 h-16 rounded-xl flex-shrink-0 bg-[#e2e3e5]" />
              <div className="flex-1 flex flex-col gap-2 pt-1">
                <div className="h-3 rounded-full w-3/4 bg-[#e2e3e5]" />
                <div className="h-3 rounded-full w-1/2 bg-[#e2e3e5]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f3f4f6] border border-[#dcdcdc] rounded-2xl p-8 shadow-[0_4px_12px_rgba(0,0,0,0.05)] sticky top-24">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-[0.85rem] font-extrabold tracking-[0.15em] uppercase" style={{ color: 'var(--text)' }}>
          Order Summary
        </div>
        <span
          className="text-xs font-semibold px-2.5 py-1 rounded-full"
          style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
        >
          {items.length} {items.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      {/* Items */}
      <div className="flex flex-col gap-4 mb-6 pb-6 border-b border-gray-200">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3.5">
            <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-white">
              <Image
                src={item.product.images[0]}
                alt={item.product.name}
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <p className="text-sm font-bold leading-tight truncate" style={{ color: 'var(--text)' }}>
                {item.product.name}
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--text3)' }}>
                Size {item.selectedSize} · {item.selectedColor}
                {item.quantity > 1 && ` · Qty ${item.quantity}`}
              </p>
            </div>
            <p className="text-sm font-bold flex-shrink-0 self-center" style={{ color: 'var(--text)' }}>
              ${(item.product.price * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      {/* Totals — reactive to shipping method changes */}
      <div className="flex flex-col">
        <div className="flex justify-between items-center text-[0.92rem] text-[var(--text2)] py-[0.9rem] border-b border-gray-200">
          <span>Subtotal</span>
          <strong style={{ color: 'var(--text)' }}>${subtotal.toFixed(2)}</strong>
        </div>

        <div className="flex justify-between items-center text-[0.92rem] py-[0.9rem] border-b border-gray-200">
          <span style={{ color: 'var(--text2)' }}>
            Shipping
            <span className="ml-1.5 text-[0.7rem] font-semibold px-1.5 py-0.5 rounded" style={{ background: 'var(--surface2)', color: 'var(--text3)' }}>
              {shippingMethod === 'express' ? 'Express' : 'Standard'}
            </span>
          </span>
          <strong style={{ color: 'var(--text)' }}>${shipping.toFixed(2)}</strong>
        </div>

        <div className="flex justify-between items-center text-[0.92rem] text-[var(--text2)] py-[0.9rem] border-b border-gray-200">
          <span>Tax (8%)</span>
          <strong style={{ color: 'var(--text)' }}>${tax.toFixed(2)}</strong>
        </div>
      </div>

      {/* Total */}
      <div className="border-t-2 border-gray-300 my-4" />
      <div className="flex justify-between items-baseline text-[1.3rem] font-extrabold py-2 pb-6" style={{ color: 'var(--text)' }}>
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>

      {/* CTA */}
      <button
        type="button"
        onClick={handleCta}
        disabled={ctaDisabled || items.length === 0}
        className={`w-full py-4 border-[1.5px] rounded-lg text-[0.85rem] font-bold tracking-[0.15em] uppercase cursor-pointer transition-all duration-200 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 ${
          confirmed
            ? 'bg-[#27AE60] border-[#27AE60] text-white'
            : 'bg-black border-black text-white hover:-translate-y-px'
        }`}
      >
        {confirmed ? (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Confirmed
          </>
        ) : (
          <>{ctaLabel} →</>
        )}
      </button>

      <p className="text-center text-[0.78rem] mt-4 flex items-center justify-center gap-1.5" style={{ color: 'var(--text3)' }}>
        🔒 {secureNote}
      </p>
    </div>
  );
}