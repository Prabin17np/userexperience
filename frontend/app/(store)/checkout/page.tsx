'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCheckoutStore } from '@/store';
import { ShippingForm } from '@/components/checkout/ShippingForm';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import { CheckoutStepper } from '@/components/checkout/CheckoutStepper';

export default function CheckoutPage() {
  const step = useCheckoutStore((s) => s.step);
  const setStep = useCheckoutStore((s) => s.setStep);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  function handleContinue() {
    setStep(2);
    router.push('/checkout/payment');
  }

  function handleCtaClick() {
    formRef.current?.requestSubmit();
  }

  return (
    <div className="max-w-[1200px] mx-auto px-6 sm:px-8 py-8 sm:py-10">
      <Link
        href="/cart"
        className="inline-flex items-center gap-1.5 text-sm font-medium mb-4 transition-opacity hover:opacity-70"
        style={{ color: 'var(--text2)' }}
      >
        ← Back to Cart
      </Link>

      <CheckoutStepper currentStep={step} />

      <h1
        className="font-['Playfair_Display'] text-3xl sm:text-4xl font-bold mb-8 -mt-2"
        style={{ color: 'var(--text)' }}
      >
        Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 lg:gap-8 items-start">
        <ShippingForm ref={formRef} onContinue={handleContinue} />
        <OrderSummary ctaLabel="Continue to Payment" onCta={handleCtaClick} />
      </div>
    </div>
  );
}