'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types/product';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';

interface ProductCardProps {
  product: Product;
  showBadge?: boolean;
}

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l7.78-7.78a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

export const ProductCard: React.FC<ProductCardProps> = ({ product, showBadge = true }) => {
  const addItem = useCartStore((s) => s.addItem);
  const toggleItem = useWishlistStore((s) => s.toggleItem);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist(product.id));

  const firstInStockSize = product.sizes.find((s) => s.inStock)?.value ?? product.sizes[0]?.value;
  const firstColor = product.colors[0]?.name ?? '';

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (firstInStockSize) {
      addItem({
        product,
        selectedColor: firstColor,
        selectedSize: firstInStockSize,
      });
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product);
  };

  return (
    <Link
      href={`/products/${product.slug}`}
      className="
        group block bg-[var(--surface)] rounded-[var(--r-xl)] overflow-hidden
        shadow-sm transition-all duration-300
        hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.01]
        cursor-pointer no-underline text-inherit
      "
    >
      {/* IMAGE SECTION */}
      <div className="relative aspect-square bg-[var(--surface2)] overflow-hidden group-hover:bg-[var(--accent-light)] transition-colors duration-300">

        {/* BADGES */}
        {showBadge && product.badge && (
          <span
            className={`absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-[0.7rem] font-semibold uppercase text-white ${
              product.badge === 'NEW'
                ? 'bg-[var(--text)]'
                : 'bg-[#C0392B]'
            }`}
          >
            {product.badge}
          </span>
        )}

        {discountPercent && (
          <span className="absolute top-3 left-14 z-10 px-2.5 py-1 rounded-full text-[0.7rem] font-semibold text-white bg-[#C0392B]">
            -{discountPercent}%
          </span>
        )}

        {/* WISHLIST */}
        <button
          onClick={handleWishlist}
          className={`
            absolute top-3 right-3 z-10 w-[34px] h-[34px] rounded-full flex items-center justify-center border transition
            ${
              isInWishlist
                ? 'opacity-100 bg-[var(--accent-light)] border-[var(--accent)] text-[var(--accent)]'
                : 'opacity-0 group-hover:opacity-100 bg-white border-[var(--border)] text-[var(--text2)] hover:bg-[var(--accent-light)] hover:text-[var(--accent)]'
            }
          `}
        >
          <HeartIcon filled={isInWishlist} />
        </button>

        {/* IMAGE */}
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </div>

      {/* INFO SECTION */}
      <div className="p-5">

        <div className="text-[0.75rem] uppercase tracking-[0.1em] text-[var(--text3)] mb-1">
          {product.brand}
        </div>

        <div className="text-base font-medium text-[var(--text)] mb-2 truncate">
          {product.name}
        </div>

        {/* PRICE + QUICK ACTION */}
        <div className="flex items-center justify-between">

          <div>
            <span className="text-[1.1rem] font-semibold text-[var(--text)]">
              Rs. {product.price.toLocaleString()}
            </span>

            {product.originalPrice && (
              <span className="text-[0.85rem] text-[var(--text3)] line-through ml-2">
               Rs. {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">

            {product.rating && (
              <div className="flex items-center gap-1 text-[0.78rem] text-[var(--text2)]">
                <span className="text-[#C8A97E]">★</span>
                {product.rating}
              </div>
            )}

            <button
              onClick={handleQuickAdd}
              className="
                w-9 h-9 rounded-full bg-[var(--text)] text-[var(--text-inverse)]
                flex items-center justify-center transition
                hover:bg-[var(--accent)] hover:scale-110
              "
            >
              <PlusIcon />
            </button>

          </div>
        </div>
      </div>
    </Link>
  );
};