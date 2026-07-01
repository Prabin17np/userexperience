'use client';

import { useRouter } from 'next/navigation';
import { useCheckoutStore } from '@/store';
import { CheckoutStepper } from '@/components/checkout/CheckoutStepper';
import { OrderReview } from '@/components/checkout/OrderReview';

export default function CheckoutReviewPage() {
  const step = useCheckoutStore((s) => s.step);
  const setStep = useCheckoutStore((s) => s.setStep);
  const router = useRouter();

  function handleBack() {
    setStep(2);
    router.push('/checkout/payment');
  }

  return (
    <div className="max-w-[700px] mx-auto px-6 sm:px-8 py-10 sm:py-14">
      <CheckoutStepper currentStep={step} />
      <OrderReview onBack={handleBack} />
    </div>
  );
}