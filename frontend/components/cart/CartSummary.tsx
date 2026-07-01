'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store';

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export function CartSummary() {
  const getSummary = useCartStore((s) => s.getSummary);
  const summary = getSummary();
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'success'>('idle');

  function handleCheckout() {
    setStatus('success');
    setTimeout(() => {
      router.push('/checkout');
    }, 700);
  }

  const isSuccess = status === 'success';

  return (
    // #summary card: light gray, subtle border + shadow
    <div className="bg-[#f3f4f6] border border-[#dcdcdc] rounded-2xl p-8 shadow-[0_4px_12px_rgba(0,0,0,0.05)]">

      {/* #section label */}
      <div className="text-[0.85rem] font-extrabold tracking-[0.15em] uppercase text-[var(--text)] mb-6">
        Summary
      </div>

      {/* #subtotal row */}
      <div className="flex justify-between items-center text-[0.92rem] text-[var(--text2)] py-[0.9rem] border-b border-gray-200">
        <span>Subtotal</span>
        <strong className="text-[var(--text)]">${summary.subtotal.toLocaleString()}</strong>
      </div>

      {/* #shipping row: FREE in accent color when zero */}
      <div className="flex justify-between items-center text-[0.92rem] text-[var(--text2)] py-[0.9rem] border-b border-gray-200">
        <span>Estimated Shipping</span>
        {summary.shipping === 0 ? (
          <strong className="text-[var(--accent)]">FREE</strong>
        ) : (
          <strong className="text-[var(--text)]">${summary.shipping.toFixed(2)}</strong>
        )}
      </div>

      {/* #tax row */}
      <div className="flex justify-between items-center text-[0.92rem] text-[var(--text2)] py-[0.9rem] border-b border-gray-200">
        <span>Tax</span>
        <strong className="text-[var(--text)]">${summary.tax.toFixed(2)}</strong>
      </div>

      {/* #divider before total */}
      <div className="border-t-2 border-gray-300 my-4" />

      {/* #total: larger, bold */}
      <div className="flex justify-between items-baseline text-[1.3rem] font-extrabold text-[var(--text)] py-2 pb-6">
        <span>Total</span>
        <span>${summary.total.toFixed(2)}</span>
      </div>

      {/* #checkout button: black idle → green success, lifts on hover */}
      <button
        type="button"
        onClick={handleCheckout}
        className={`w-full py-4 border-[1.5px] rounded-lg text-[0.85rem] font-bold tracking-[0.15em] uppercase cursor-pointer transition-all duration-200 active:scale-[0.98] ${
          isSuccess
            ? 'bg-[#27AE60] border-[#27AE60] text-white'
            : 'bg-black border-black text-white hover:-translate-y-px'
        }`}
      >
        {isSuccess ? (
          <span className="inline-flex items-center gap-2">
            <CheckIcon /> Order Confirmed
          </span>
        ) : (
          'Checkout Securely'
        )}
      </button>

    
      <div className="text-center text-[0.78rem] text-[var(--text3)] mt-4 flex items-center justify-center gap-1.5">
        🔒 Secure Payment via SSL
      </div>
    </div>
  );
}