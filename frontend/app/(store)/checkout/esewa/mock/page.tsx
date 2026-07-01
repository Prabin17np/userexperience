'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function MockEsewaPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const totalAmount = params.get('total_amount') ?? '0';
  const transactionUuid = params.get('transaction_uuid') ?? '';
  const productCode = params.get('product_code') ?? 'EPAYTEST';
  const successUrl = params.get('success_url') ?? '';
  const failureUrl = params.get('failure_url') ?? '';

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    // Simulate eSewa's test login check
    const validIds = ['9806800001', '9806800002', '9806800003', '9806800004', '9806800005'];
    if (!validIds.includes(id) || password !== 'Nepal@123') {
      setError('Invalid eSewa ID or password.');
      return;
    }

    setLoading(true);
    setTimeout(() => confirmPayment(), 800);
  }

  function confirmPayment() {
    // Build the same base64 payload real eSewa would send back
    const payload = {
      transaction_code: `MOCK-${Date.now()}`,
      status: 'COMPLETE',
      total_amount: totalAmount,
      transaction_uuid: transactionUuid,
      product_code: productCode,
      signed_field_names: 'transaction_code,status,total_amount,transaction_uuid,product_code',
    };
    const encoded = btoa(JSON.stringify(payload));
    window.location.href = `${successUrl}?data=${encoded}`;
  }

  function handleCancel() {
    window.location.href = failureUrl;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f4f6] px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8">

        {/* Mock banner */}
        <div className="mb-6 px-3 py-2 rounded-lg text-xs font-semibold text-center"
          style={{ background: '#FEF3C7', color: '#92400E' }}>
          ⚠ DEMO MODE — Simulated eSewa Gateway
        </div>

        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-3"
            style={{ background: '#60BB46' }}>
            💳
          </div>
          <h1 className="text-lg font-bold" style={{ color: '#111' }}>eSewa Login</h1>
          <p className="text-xs mt-1" style={{ color: '#666' }}>Pay NPR {totalAmount}</p>
        </div>

        {error && (
          <div className="mb-4 px-3 py-2 rounded-lg text-xs" style={{ background: '#FEF2F2', color: '#DC2626' }}>
            ⚠ {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: '#666' }}>
              eSewa ID / Mobile Number
            </label>
            <input
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="98XXXXXXXX"
              className="w-full px-3 py-2.5 rounded-lg text-sm border outline-none"
              style={{ borderColor: '#dcdcdc' }}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: '#666' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2.5 rounded-lg text-sm border outline-none"
              style={{ borderColor: '#dcdcdc' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg text-sm font-bold text-white disabled:opacity-60"
            style={{ background: '#60BB46' }}
          >
            {loading ? 'Processing…' : 'Login & Pay'}
          </button>

          <button
            type="button"
            onClick={handleCancel}
            className="text-xs font-medium text-center"
            style={{ color: '#999' }}
          >
            Cancel Payment
          </button>
        </form>

        <p className="text-[0.65rem] text-center mt-6" style={{ color: '#aaa' }}>
          Test ID: 9806800001 · Password: Nepal@123
        </p>
      </div>
    </div>
  );
}