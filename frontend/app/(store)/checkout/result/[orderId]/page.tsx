'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useCartStore } from '@/store';
import { ordersApi } from '@/lib/api/orders';

export default function CheckoutResultPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const searchParams = useSearchParams();
  const hintedFailure = searchParams.get('status') === 'failed';

  const clearCart = useCartStore((s) => s.clearCart);
  const [status, setStatus] = useState<'loading' | 'paid' | 'failed' | 'pending'>('loading');

  useEffect(() => {
    if (orderId === 'unknown' || hintedFailure) {
      setStatus('failed');
      return;
    }

    let attempts = 0;
    const poll = async () => {
      try {
        const order = await ordersApi.getOrderById(orderId);
        if (order.paymentStatus === 'Paid') {
          clearCart();
          setStatus('paid');
        } else if (order.paymentStatus === 'Failed') {
          setStatus('failed');
        } else if (attempts < 5) {
          attempts += 1;
          setTimeout(poll, 1200); // small buffer in case verify redirect lands a beat early
        } else {
          setStatus('pending');
        }
      } catch {
        setStatus('failed');
      }
    };
    poll();
  }, [orderId, hintedFailure, clearCart]);

  if (status === 'loading') {
    return <div className="py-24 text-center text-sm" style={{ color: 'var(--text2)' }}>Confirming your payment…</div>;
  }
  if (status === 'paid') {
    return (
      <div className="py-24 text-center">
        <h2 className="font-['Playfair_Display'] text-3xl font-semibold mb-3" style={{ color: 'var(--text)' }}>
          Order Confirmed!
        </h2>
        <p className="text-sm mb-8" style={{ color: 'var(--text2)' }}>Order #{orderId}</p>
        <Link href="/shop" className="px-10 py-4 rounded-lg text-sm font-semibold uppercase tracking-wide" style={{ background: 'var(--text)', color: 'var(--bg)' }}>
          Continue Shopping
        </Link>
      </div>
    );
  }
  if (status === 'pending') {
    return <div className="py-24 text-center text-sm" style={{ color: 'var(--text2)' }}>Still confirming — refresh in a moment.</div>;
  }
  return (
    <div className="py-24 text-center">
      <p className="text-sm" style={{ color: 'var(--danger)' }}>✗ Payment failed or was cancelled.</p>
      <Link href="/checkout/payment" className="underline text-sm mt-3 inline-block" style={{ color: 'var(--accent)' }}>
        Try again
      </Link>
    </div>
  );
}