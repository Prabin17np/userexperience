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
      <div className="max-w-[1400px] mx-auto px-8 py-20 text-center">
        <div className="text-6xl mb-4 opacity-40">🛍️</div>
        <h1 className="text-3xl font-extrabold uppercase tracking-tight mb-2 text-[var(--text)]">
          Your Bag is Empty
        </h1>
        <p className="text-sm mb-8 text-[var(--text2)]">
          Looks like you haven&apos;t added anything yet
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--text)] text-[var(--bg)] rounded-lg text-[0.8rem] font-bold tracking-[0.15em] uppercase no-underline transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-[var(--accent)] hover:-translate-y-px"
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