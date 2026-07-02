'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useCartStore } from '@/store';
import { useProductStore } from '@/store/useProductStore';
import { CartItem } from '@/components/cart/CartItem';
import { CartSummary } from '@/components/cart/CartSummary';
import { ProductCard } from '@/components/product/ProductCard'; // ← add this

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const { products, fetchProducts } = useProductStore();

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts({ limit: 20 });
    }
  }, []);

  const cartProductIds = new Set(items.map((i) => i.product.id));
  const suggestions = products
    .filter((p) => !cartProductIds.has(p.id))
    .slice(0, 4);

  if (items.length === 0) {
    return (
      <div className="max-w-[1400px] mx-auto px-8 py-24 text-center">
        <div
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full"
          style={{ background: 'var(--text3)', opacity: 0.08 }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--text3)"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold uppercase tracking-tight mb-2 text-[var(--text)]">
          Your Bag is Empty
        </h1>
        <p className="text-sm mb-8 text-[var(--text2)]">
          Looks like you haven&apos;t added anything yet
        </p>
        <Link
          href="/shop"
          className="
            inline-flex items-center gap-2
            rounded-[var(--r)]
            border-[1.5px] border-[var(--accent)]
            bg-[var(--accent)]
            px-8 py-4
            text-[0.8rem] font-bold uppercase
            tracking-[0.15em]
            text-white
            no-underline
            shadow-[0_8px_20px_-8px_var(--accent)]
            transition-all duration-300
            ease-[cubic-bezier(0.4,0,0.2,1)]
            hover:-translate-y-[1px]
            hover:brightness-90
            hover:shadow-[0_12px_24px_-8px_var(--accent)]
            active:translate-y-0
          "
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-8 py-10 pb-20">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-6">
        <Link href="/" className="text-[var(--text3)] no-underline transition-colors duration-200 hover:text-[var(--accent)]">
          Home
        </Link>
        <span className="text-[var(--text3)] opacity-50">›</span>
        <span className="font-semibold text-[var(--text)]">Shopping Cart</span>
      </div>

      <h1
        className="text-5xl font-extrabold uppercase tracking-tight mb-10 text-[var(--text)]"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        Your Bag
      </h1>

      <div className="grid grid-cols-1 gap-10 items-start lg:grid-cols-[1fr_380px] lg:gap-16">
        <div>
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>
        <CartSummary />
      </div>

      {/* You Might Also Like — uses same ProductCard as shop page */}
      {suggestions.length > 0 && (
        <div className="mt-20">
          <h2 className="text-2xl font-extrabold uppercase tracking-tight mb-8 text-[var(--text)]">
            You Might Also Like
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '2rem',
            }}
          >
            {suggestions.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}