'use client';

import { useRouter } from 'next/navigation';

export default function EsewaFailurePage() {
  const router = useRouter();
  return (
    <div className="text-center py-20">
      <p className="text-red-600 mb-4">Payment was cancelled or failed.</p>
      <button onClick={() => router.push('/checkout')}>Try Again</button>
    </div>
  );
}