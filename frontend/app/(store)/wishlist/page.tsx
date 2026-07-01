'use client';

import Link from 'next/link';
import { useWishlistStore } from '@/store';
import { ProductGrid } from '@/components/product/ProductGrid';

export default function WishlistPage() {
  const items = useWishlistStore((s) => s.items);
  const clearWishlist = useWishlistStore((s) => s.clearWishlist);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-[1400px] px-8 py-20 text-center">
        <div className="mb-4 text-6xl opacity-40">🤍</div>

        <h1
          className="mb-2 text-3xl font-extrabold uppercase tracking-tight"
          style={{ color: 'var(--text)' }}
        >
          Your Wishlist is Empty
        </h1>

        <p
          className="mb-8 text-sm"
          style={{ color: 'var(--text2)' }}
        >
          Save styles you love and find them here anytime
        </p>

        <Link
          href="/shop"
          className="
            inline-flex items-center gap-2
            rounded-[var(--r)]
            border-[1.5px] border-[var(--text)]
            bg-[var(--text)]
            px-8 py-4
            text-[0.8rem] font-bold uppercase
            tracking-[0.15em]
            text-[var(--bg)]
            no-underline
            transition-all duration-300
            ease-[cubic-bezier(0.4,0,0.2,1)]
            hover:-translate-y-[1px]
            hover:border-[var(--accent)]
            hover:bg-[var(--accent)]
            hover:text-white
          "
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-8 py-10 pb-20">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm">
        <Link
          href="/"
          className="
            text-[var(--text3)]
            no-underline
            transition-colors duration-200
            hover:text-[var(--accent)]
          "
        >
          Home
        </Link>

        <span
          className="opacity-50"
          style={{ color: 'var(--text3)' }}
        >
          ›
        </span>

        <span
          className="font-semibold"
          style={{ color: 'var(--text)' }}
        >
          Wishlist
        </span>
      </div>

      {/* Header */}
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1
            className="mb-2 text-5xl font-extrabold uppercase tracking-tight"
            style={{ color: 'var(--text)' }}
          >
            Your Wishlist
          </h1>

          <p
            className="text-sm"
            style={{ color: 'var(--text2)' }}
          >
            {items.length} saved style{items.length !== 1 ? 's' : ''}
          </p>
        </div>

        <button
          onClick={clearWishlist}
          className="
            cursor-pointer
            border-none
            bg-transparent
            p-0
            text-xs font-bold
            uppercase
            tracking-[0.12em]
            text-[var(--text3)]
            transition-colors duration-200
            hover:text-[var(--danger)]
          "
        >
          Clear Wishlist
        </button>
      </div>

      <ProductGrid products={items} />
    </div>
  );
}