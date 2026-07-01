'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { paymentApi } from '@/lib/api/payment';

export default function EsewaSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');

  useEffect(() => {
    const data = searchParams.get('data');
    if (!data) {
      setStatus('error');
      return;
    }

    paymentApi
      .verifyEsewa(data)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'));
  }, [searchParams]);

  if (status === 'verifying') {
    return <div className="text-center py-20">Verifying your payment…</div>;
  }

  if (status === 'error') {
    return (
      <div className="text-center py-20">
        <p className="text-red-600 mb-4">Payment verification failed.</p>
        <button onClick={() => router.push('/cart')}>Back to Cart</button>
      </div>
    );
  }

  return (
    <div className="text-center py-20">
      <div className="text-5xl mb-4">✓</div>
      <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
      <button onClick={() => router.push('/shop')}>Continue Shopping</button>
    </div>
  );
}