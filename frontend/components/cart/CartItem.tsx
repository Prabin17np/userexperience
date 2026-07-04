'use client';

import Image from 'next/image';
import { CartItem as CartItemType } from '@/store/useCartStore'; // ← from store, not @/types
import { useCartStore } from '@/store';
import { QuantityStepper } from './QuantityStepper';

const TrashIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
  </svg>
);

interface Props {
  item: CartItemType;
}

export function CartItem({ item }: Props) {
  const { product, selectedColor, selectedSize, quantity, id } = item;
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem    = useCartStore((s) => s.removeItem);

  return (
    <div className="flex gap-6 px-8 py-8 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 last:border-b-0">
      <div className="relative w-[120px] h-[150px] flex-shrink-0 rounded-xl overflow-hidden bg-[var(--surface)]">
        <Image
          src={product.images[0]}   // ← already a string 
          alt={product.name}
          fill
          sizes="120px"
          className="object-cover"
        />
      </div>

      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-extrabold uppercase tracking-tight leading-tight mb-1 text-[var(--text)]">
              {product.name}
            </h3>
            <p className="text-sm mb-2 text-[var(--text2)]">
              {product.category} · {selectedColor}
            </p>
            <p className="text-sm font-semibold text-[var(--text)]">
              Size: US {selectedSize}
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-lg font-bold text-[var(--text)]">
              Rs. {(product.price * quantity).toLocaleString()}
            </div>
            {product.originalPrice && (
              <div className="text-sm line-through text-[var(--text3)]">
               Rs. {(product.originalPrice * quantity).toLocaleString()}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto pt-4">
          <QuantityStepper
            quantity={quantity}
            onIncrease={() => updateQuantity(id, quantity + 1)}
            onDecrease={() => updateQuantity(id, quantity - 1)}
          />
          <button
            className="inline-flex items-center gap-1.5 text-[0.7rem] font-semibold tracking-widest uppercase text-[var(--text3)] bg-transparent border-none cursor-pointer p-0 transition-colors duration-200 hover:text-red-500"
            onClick={() => removeItem(id)}
          >
            <TrashIcon />
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}