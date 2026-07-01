'use client';

import React, { useState } from 'react';
import { Product, ProductSize, ProductColor } from '@/types/product';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';

interface Props {
  product: Product;
}

const CartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
  </svg>
);

const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l7.78-7.78a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const ProductOptions: React.FC<Props> = ({ product }) => {
  // SAFE fallback (prevents crashes)
  const colors: ProductColor[] = product?.colors ?? [];
  const sizes: ProductSize[] = product?.sizes ?? [];

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState(colors[0]?.name ?? '');
  const [sizeError, setSizeError] = useState(false);
  const [added, setAdded] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const toggleItem = useWishlistStore((s) => s.toggleItem);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist(product.id));

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 600);
      return;
    }

    addItem({ product, selectedColor, selectedSize });

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="space-y-6 relative z-10">

      {/* COLOR */}
      <div>
        <p className="text-xs uppercase tracking-widest text-[var(--text2)] mb-3">
          Color — <span className="text-[var(--text)]">{selectedColor}</span>
        </p>

        <div className="flex gap-2 flex-wrap">
          {colors.map((c) => (
            <button
              key={c.name}
              onClick={() => setSelectedColor(c.name)}
              className={`w-7 h-7 rounded-full border transition-transform duration-200 hover:scale-110 ${
                selectedColor === c.name
                  ? 'ring-2 ring-[var(--text)]'
                  : 'border-transparent'
              }`}
              style={{ background: c.hex }}
            />
          ))}
        </div>
      </div>

      {/* SIZE */}
      <div>
        <p className={`text-xs uppercase tracking-widest mb-3 transition ${
          sizeError ? 'text-red-600' : 'text-[var(--text2)]'
        }`}>
          {sizeError ? 'Select a size' : 'Size (US)'}
        </p>

        <div className="flex flex-wrap gap-2">
          {sizes.map((s) => {
            const active = selectedSize === s.value;
            const sold = !s.inStock;

            return (
              <button
                key={s.value}
                disabled={sold}
                onClick={() => {
                  setSelectedSize(s.value);
                  setSizeError(false);
                }}
                className={`w-12 h-12 text-sm rounded-md border transition-all duration-200 ${
                  sold
                    ? 'opacity-30 line-through cursor-not-allowed'
                    : active
                    ? 'bg-black text-white border-black'
                    : 'hover:border-black'
                }`}
              >
                {s.value}
              </button>
            );
          })}
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex gap-3">
        <button
          onClick={handleAddToCart}
          className={`flex-1 py-3 rounded-md font-medium flex items-center justify-center gap-2 transition-all duration-200 ${
            added
              ? 'bg-green-600 text-white'
              : 'bg-black text-white hover:bg-gray-800'
          }`}
        >
          {added ? <><CheckIcon /> Added</> : <><CartIcon /> Add to Cart</>}
        </button>

        <button
          onClick={() => toggleItem(product)}
          className={`w-12 h-12 rounded-md border flex items-center justify-center transition ${
            isInWishlist
              ? 'bg-black text-white'
              : 'hover:border-black'
          }`}
        >
          <HeartIcon filled={isInWishlist} />
        </button>
      </div>

      {/* TRUST */}
      <div className="grid grid-cols-2 gap-2 text-xs text-[var(--text2)] bg-[var(--surface2)] p-4 rounded-md">
        <div>🌿 Sustainable materials</div>
        <div>🚚 Free shipping $150+</div>
        <div>↩️ 60-day returns</div>
        <div>🔒 Secure checkout</div>
      </div>

    </div>
  );
};