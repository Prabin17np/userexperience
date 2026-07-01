'use client';

import { forwardRef, useState } from 'react';
import { useCheckoutStore } from '@/store';
import { PaymentMethod, CreditCardDetails } from '@/types';

const PAYMENT_METHODS: { id: PaymentMethod; label: string; icon: string }[] = [
  { id: 'credit_card', label: 'Credit Card', icon: '💳' },
  { id: 'esewa', label: 'Esewa', icon: '📱' },
  { id: 'fonepay', label: 'FonePay', icon: '📲' },
];

interface Props {
  onContinue: () => void;
}

export const PaymentForm = forwardRef<HTMLFormElement, Props>(function PaymentForm({ onContinue }, ref) {
  const paymentDetails = useCheckoutStore((s) => s.paymentDetails);
  const setPaymentMethod = useCheckoutStore((s) => s.setPaymentMethod);
  const setPaymentDetails = useCheckoutStore((s) => s.setPaymentDetails);

  const [card, setCard] = useState<CreditCardDetails>(
    paymentDetails.creditCard ?? { cardholderName: '', cardNumber: '', expiry: '', cvv: '' }
  );
  const [billingSame, setBillingSame] = useState(paymentDetails.billingAddressSameAsShipping);
  const [errors, setErrors] = useState<Partial<Record<keyof CreditCardDetails, string>>>({});
  const [focused, setFocused] = useState<string | null>(null);

  function handleCardChange(field: keyof CreditCardDetails, value: string) {
    setCard((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate(): boolean {
    if (paymentDetails.method !== 'credit_card') return true;
    const next: Partial<Record<keyof CreditCardDetails, string>> = {};
    if (!card.cardholderName.trim()) next.cardholderName = 'Cardholder name is required';
    if (!/^\d{13,19}$/.test(card.cardNumber.replace(/\s/g, ''))) next.cardNumber = 'Enter a valid card number';
    if (!/^\d{2}\/\d{2}$/.test(card.expiry)) next.expiry = 'Use MM/YY format';
    if (!/^\d{3,4}$/.test(card.cvv)) next.cvv = 'Enter a valid CVV';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setPaymentDetails({ creditCard: card, billingAddressSameAsShipping: billingSame });
    onContinue();
  }

  function fieldStyle(field: string, hasError?: boolean) {
    return {
      background: '#ffffff',
      color: 'var(--text)',
      border: `1.5px solid ${hasError ? 'var(--danger)' : focused === field ? 'var(--accent)' : '#dcdcdc'}`,
      boxShadow: focused === field && !hasError ? '0 0 0 3px var(--accent-light)' : 'none',
    };
  }

  const inputClass = 'w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all duration-150 placeholder:opacity-50';
  const labelClass = 'block text-[0.7rem] font-bold uppercase tracking-wider mb-2.5';

  return (
    <form ref={ref} onSubmit={handleSubmit} className="flex flex-col gap-6">
      <h1
        className="font-['Playfair_Display'] text-3xl sm:text-4xl font-bold"
        style={{ color: 'var(--text)' }}
      >
        Payment Method
      </h1>

      {/* Method tiles */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {PAYMENT_METHODS.map((m) => {
          const selected = paymentDetails.method === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setPaymentMethod(m.id)}
              className={`flex flex-col items-center gap-2.5 py-6 rounded-2xl transition-all duration-200 border-[1.5px] active:scale-[0.98] ${
                selected
                  ? 'bg-[#27AE60] border-[#27AE60]'
                  : 'bg-[#f3f4f6] border-[#dcdcdc] hover:border-[var(--accent)]'
              }`}
            >
              <span className="text-2xl">{m.icon}</span>
              <span
                className="text-sm font-bold"
                style={{ color: selected ? '#fff' : 'var(--text)' }}
              >
                {m.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Credit card fields */}
      {paymentDetails.method === 'credit_card' && (
        <div className="bg-[#f3f4f6] border border-[#dcdcdc] rounded-2xl p-7 sm:p-8 flex flex-col gap-5 shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
          <div>
            <label className={labelClass} style={{ color: 'var(--text2)' }}>
              Cardholder Name
            </label>
            <input
              className={inputClass}
              style={fieldStyle('cardholderName', !!errors.cardholderName)}
              value={card.cardholderName}
              onChange={(e) => handleCardChange('cardholderName', e.target.value)}
              onFocus={() => setFocused('cardholderName')}
              onBlur={() => setFocused(null)}
              placeholder="Alex Rivera"
            />
            {errors.cardholderName && (
              <p className="text-xs mt-1.5 flex items-center gap-1" style={{ color: 'var(--danger)' }}>
                ⚠ {errors.cardholderName}
              </p>
            )}
          </div>

          <div>
            <label className={labelClass} style={{ color: 'var(--text2)' }}>
              Card Number
            </label>
            <div className="relative">
              <input
                className={inputClass}
                style={fieldStyle('cardNumber', !!errors.cardNumber)}
                value={card.cardNumber}
                onChange={(e) => handleCardChange('cardNumber', e.target.value)}
                onFocus={() => setFocused('cardNumber')}
                onBlur={() => setFocused(null)}
                placeholder="0000 0000 0000 0000"
                maxLength={19}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-base opacity-50 pointer-events-none">💳</span>
            </div>
            {errors.cardNumber && (
              <p className="text-xs mt-1.5 flex items-center gap-1" style={{ color: 'var(--danger)' }}>
                ⚠ {errors.cardNumber}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass} style={{ color: 'var(--text2)' }}>
                Expiry Date
              </label>
              <input
                className={inputClass}
                style={fieldStyle('expiry', !!errors.expiry)}
                value={card.expiry}
                onChange={(e) => handleCardChange('expiry', e.target.value)}
                onFocus={() => setFocused('expiry')}
                onBlur={() => setFocused(null)}
                placeholder="MM / YY"
                maxLength={5}
              />
              {errors.expiry && (
                <p className="text-xs mt-1.5 flex items-center gap-1" style={{ color: 'var(--danger)' }}>
                  ⚠ {errors.expiry}
                </p>
              )}
            </div>
            <div>
              <label className={labelClass} style={{ color: 'var(--text2)' }}>
                CVV
              </label>
              <div className="relative">
                <input
                  className={inputClass}
                  style={fieldStyle('cvv', !!errors.cvv)}
                  value={card.cvv}
                  onChange={(e) => handleCardChange('cvv', e.target.value)}
                  onFocus={() => setFocused('cvv')}
                  onBlur={() => setFocused(null)}
                  placeholder="***"
                  maxLength={4}
                />
                <span
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[0.65rem] font-bold rounded-full w-4 h-4 flex items-center justify-center border pointer-events-none"
                  style={{ borderColor: 'var(--text3)', color: 'var(--text3)' }}
                >
                  ?
                </span>
              </div>
              {errors.cvv && (
                <p className="text-xs mt-1.5 flex items-center gap-1" style={{ color: 'var(--danger)' }}>
                  ⚠ {errors.cvv}
                </p>
              )}
            </div>
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer select-none pt-1">
            <input
              type="checkbox"
              checked={billingSame}
              onChange={(e) => setBillingSame(e.target.checked)}
              className="w-[18px] h-[18px] rounded cursor-pointer"
              style={{ accentColor: 'var(--text)' }}
            />
            <span className="text-sm" style={{ color: 'var(--text2)' }}>Billing address same as shipping</span>
          </label>
        </div>
      )}

      {paymentDetails.method !== 'credit_card' && (
        <div className="bg-[#f3f4f6] border border-[#dcdcdc] rounded-2xl p-7 sm:p-8 text-sm flex items-center gap-3 shadow-[0_4px_12px_rgba(0,0,0,0.05)]" style={{ color: 'var(--text2)' }}>
          <span className="text-xl flex-shrink-0">
            {PAYMENT_METHODS.find((m) => m.id === paymentDetails.method)?.icon}
          </span>
          You'll be redirected to complete payment securely after reviewing your order.
        </div>
      )}

      {/* Trust badges */}
      <div
        className="flex items-center justify-center sm:justify-start gap-5 sm:gap-7 text-xs font-semibold uppercase tracking-wide py-2 flex-wrap"
        style={{ color: 'var(--text3)' }}
      >
        <span className="flex items-center gap-1.5">🛡️ SSL Encrypted</span>
        <span className="flex items-center gap-1.5">🔒 Secure Payments</span>
        <span className="flex items-center gap-1.5">↩️ 30-Day Returns</span>
      </div>

      <button type="submit" className="hidden" aria-hidden />
    </form>
  );
});