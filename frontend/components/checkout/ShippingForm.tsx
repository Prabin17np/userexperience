'use client';

import { forwardRef, useState } from 'react';
import { useCheckoutStore, CheckoutAddress, ShippingMethod, SHIPPING_COSTS } from '@/store/useCheckoutStore';

//Types

interface ShippingOption {
  id:          ShippingMethod;
  label:       string;
  description: string;
  price:       number;
}

interface Props {
  onContinue: () => void;
}

//Constants

const SHIPPING_OPTIONS: ShippingOption[] = [
  {
    id:          'standard',
    label:       'Standard Shipping',
    description: 'Estimated 3–5 business days',
    price:       SHIPPING_COSTS.standard,
  },
  {
    id:          'express',
    label:       'Express Shipping',
    description: 'Estimated 1–2 business days',
    price:       SHIPPING_COSTS.express,
  },
];

type FieldKey = keyof CheckoutAddress;

const FIELDS: {
  key:         FieldKey;
  label:       string;
  placeholder: string;
  type?:       string;
  required:    boolean;
  validate?:   (val: string) => string | null;
}[] = [
  {
    key:         'fullName',
    label:       'Full Name',
    placeholder: 'Johnathan Doe',
    required:    true,
    validate:    (v) => v.trim().length < 2 ? 'Full name must be at least 2 characters' : null,
  },
  {
    key:         'phone',
    label:       'Phone Number',
    placeholder: '+1 (555) 000-0000',
    type:        'tel',
    required:    true,
    validate:    (v) => !/^\+?[\d\s\-().]{7,}$/.test(v.trim()) ? 'Enter a valid phone number' : null,
  },
  {
    key:         'email',
    label:       'Email Address',
    placeholder: 'you@example.com',
    type:        'email',
    required:    true,
    validate:    (v) => !/^\S+@\S+\.\S+$/.test(v.trim()) ? 'Enter a valid email address' : null,
  },
  {
    key:         'city',
    label:       'City',
    placeholder: 'New York',
    required:    true,
    validate:    (v) => !v.trim() ? 'City is required' : null,
  },
  {
    key:         'address',
    label:       'Full Address',
    placeholder: '123 Performance Way, Apt 4B',
    required:    true,
    validate:    (v) => v.trim().length < 5 ? 'Enter your full delivery address' : null,
  },
];

//Component

export const ShippingForm = forwardRef<HTMLFormElement, Props>(
  function ShippingForm({ onContinue }, ref) {
    const storeAddress     = useCheckoutStore((s) => s.address);
    const shippingMethod   = useCheckoutStore((s) => s.shippingMethod);
    const setAddress       = useCheckoutStore((s) => s.setAddress);
    const setShippingMethod = useCheckoutStore((s) => s.setShippingMethod);
    const getOrderTotal    = useCheckoutStore((s) => s.getOrderTotal);

    const [form, setForm]     = useState<CheckoutAddress>({ ...storeAddress });
    const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});
    const [focused, setFocused] = useState<string | null>(null);

    const { subtotal, shipping, tax, total } = getOrderTotal();

    function handleChange(field: FieldKey, value: string) {
      setForm((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    function validate(): boolean {
      const next: Partial<Record<FieldKey, string>> = {};
      for (const field of FIELDS) {
        const value = form[field.key];
        if (!value.trim()) {
          next[field.key] = `${field.label} is required`;
          continue;
        }
        if (field.validate) {
          const err = field.validate(value);
          if (err) next[field.key] = err;
        }
      }
      setErrors(next);
      return Object.keys(next).length === 0;
    }

    function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
      if (!validate()) return;
      setAddress(form);
      onContinue();
    }

    function fieldStyle(key: string, hasError?: boolean) {
      return {
        background:  '#ffffff',
        color:       'var(--text)',
        border:      `1.5px solid ${
          hasError        ? 'var(--danger)'  :
          focused === key ? 'var(--accent)'  :
          '#dcdcdc'
        }`,
        boxShadow:
          focused === key && !hasError
            ? '0 0 0 3px var(--accent-light)'
            : 'none',
      };
    }

    const inputClass =
      'w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all duration-150 placeholder:opacity-50';
    const labelClass =
      'block text-[0.7rem] font-bold uppercase tracking-wider mb-2.5';

    return (
      <form ref={ref} onSubmit={handleSubmit} className="flex flex-col gap-6">

        {/*Section 1: Contact & Delivery*/}
        <div className="bg-[#f3f4f6] border border-[#dcdcdc] rounded-2xl p-7 sm:p-8 shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-3 mb-7">
            <span
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ background: '#ffffff', color: '#4d2c2c' }}
            >
              1
            </span>
            <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
              Contact & Delivery
            </h2>
          </div>

          <div className="flex flex-col gap-5">
            {FIELDS.map((field) => (
              <div key={field.key}>
                <label className={labelClass} style={{ color: 'var(--text2)' }}>
                  {field.label}
                  {!field.required && (
                    <span className="font-normal normal-case tracking-normal ml-1" style={{ color: 'var(--text3)' }}>
                      (optional)
                    </span>
                  )}
                </label>
                <input
                  type={field.type || 'text'}
                  className={inputClass}
                  style={fieldStyle(field.key, !!errors[field.key])}
                  value={form[field.key]}
                  placeholder={field.placeholder}
                  onChange={(e)  => handleChange(field.key, e.target.value)}
                  onFocus={() => setFocused(field.key)}
                  onBlur={()  => setFocused(null)}
                />
                {errors[field.key] && (
                  <p className="text-xs mt-1.5 flex items-center gap-1" style={{ color: 'var(--danger)' }}>
                    ⚠ {errors[field.key]}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/*Section 2: Shipping Method*/}
        <div className="bg-[#f3f4f6] border border-[#dcdcdc] rounded-2xl p-7 sm:p-8 shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-3 mb-6">
            <span
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ background: '#ffffff', color: 'var(--text2)', border: '1.5px solid #dcdcdc' }}
            >
              2
            </span>
            <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
              Shipping Method
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            {SHIPPING_OPTIONS.map((opt) => {
              const selected = shippingMethod === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setShippingMethod(opt.id)}
                  className={`flex items-center justify-between gap-4 px-5 py-4 rounded-xl text-left transition-all duration-200 border-[1.5px] active:scale-[0.99] ${
                    selected
                      ? 'bg-[#27AE60] border-[#27AE60]'
                      : 'bg-white border-[#dcdcdc] hover:border-[var(--accent)]'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <span
                      className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200"
                      style={{ borderColor: selected ? '#fff' : '#dcdcdc' }}
                    >
                      {selected && (
                        <span className="w-2.5 h-2.5 rounded-full bg-white" />
                      )}
                    </span>
                    <div>
                      <div
                        className="text-sm font-bold"
                        style={{ color: selected ? '#fff' : 'var(--text)' }}
                      >
                        {opt.label}
                      </div>
                      <div
                        className="text-xs mt-0.5"
                        style={{ color: selected ? 'rgba(255,255,255,0.8)' : 'var(--text3)' }}
                      >
                        {opt.description}
                      </div>
                    </div>
                  </div>
                <span
  className="text-sm font-bold flex-shrink-0"
  style={{ color: selected ? '#fff' : 'var(--text)' }}
>
  {opt.price === 0 ? 'Free' : `+RS ${opt.price.toLocaleString()}`}
</span>
                </button>
              );
            })}
          </div>

         
        </div>

        <button type="submit" className="hidden" aria-hidden />
      </form>
    );
  }
);