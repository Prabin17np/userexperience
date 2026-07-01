'use client';

import { CheckoutStep } from '@/types';

interface Props {
  currentStep: CheckoutStep;
}

const STEPS: { number: CheckoutStep; label: string }[] = [
  { number: 1, label: 'Shipping' },
  { number: 2, label: 'Payment' },
  { number: 3, label: 'Review' },
];

export function CheckoutStepper({ currentStep }: Props) {
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3 py-8">
      {STEPS.map((s, i) => {
        const isActive = currentStep === s.number;
        const isDone = currentStep > s.number;
        return (
          <div key={s.number} className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2">
              <span
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all duration-300"
                style={{
                  background: isActive ? 'var(--text)' : isDone ? 'var(--accent)' : 'var(--surface2)',
                  color: isActive ? 'var(--bg)' : isDone ? '#fff' : 'var(--text3)',
                  border: !isActive && !isDone ? '1.5px solid var(--border2)' : 'none',
                  boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.12)' : 'none',
                }}
              >
                {isDone ? '✓' : s.number}
              </span>
              <span
                className="text-sm font-semibold transition-colors duration-300 hidden xs:inline"
                style={{ color: isActive ? 'var(--text)' : isDone ? 'var(--accent)' : 'var(--text3)' }}
              >
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className="w-8 sm:w-12 h-px transition-colors duration-300"
                style={{ background: isDone ? 'var(--accent)' : 'var(--border2)' }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}