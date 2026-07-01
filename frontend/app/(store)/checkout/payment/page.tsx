'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCheckoutStore } from '@/store/useCheckoutStore';
import { PaymentForm } from '@/components/checkout/PaymentForm';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import { CheckoutStepper } from '@/components/checkout/CheckoutStepper';

export default function CheckoutPaymentPage() {
  const step = useCheckoutStore((s) => s.step);
  const setStep = useCheckoutStore((s) => s.setStep);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  function handleContinue() {
    setStep(3);
    router.push('/checkout/review');
  }

  function handleCtaClick() {
    formRef.current?.requestSubmit();
  }

  function handleBack() {
    setStep(1);
    router.push('/checkout');
  }

  return (
    <div className="max-w-[1200px] mx-auto px-6 sm:px-8 py-8 sm:py-10">
      <button
        onClick={handleBack}
        className="inline-flex items-center gap-1.5 text-sm font-medium mb-4 transition-opacity hover:opacity-70"
        style={{ color: 'var(--text2)' }}
      >
        ← Back to Shipping
      </button>
      <CheckoutStepper currentStep={step} />
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 lg:gap-8 items-start mt-2">
        <PaymentForm ref={formRef} onContinue={handleContinue} />
        <OrderSummary ctaLabel="Review Order" onCta={handleCtaClick} />
      </div>
    </div>
  );
}