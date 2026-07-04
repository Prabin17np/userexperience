import React from 'react';
import { Product } from '@/types/product';
import { ProductOptions } from './ProductOptions';

interface Props {
  product: Product;
}

export const ProductDetails: React.FC<Props> = ({ product }) => {
  const accordionItems = product.accordionItems ?? []; 

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const fullStars = Math.floor(product.rating ?? 0);
  const hasHalf = (product.rating ?? 0) % 1 >= 0.5;

  return (
    <div className="space-y-6">

      {/* BRAND */}
      <div className="text-xs uppercase tracking-[0.15em] text-[var(--text3)] font-medium">
        {product.brand} · {product.category}
      </div>

      {/* TITLE */}
      <h1 className="text-[clamp(1.8rem,3vw,2.5rem)] font-semibold text-[var(--text)] leading-tight">
        {product.name}
      </h1>

      {/* RATING */}
      {product.rating && (
        <div className="flex items-center gap-2">
          <span className="text-[#C8A97E] text-sm">
            {'★'.repeat(fullStars)}{hasHalf ? '½' : ''}
          </span>
          <span className="text-sm text-[var(--text2)]">
            {product.rating} · {product.reviewCount?.toLocaleString()} reviews
          </span>
        </div>
      )}

      {/* PRICE */}
      <div className="flex items-center gap-3">
        <span className="text-3xl font-semibold text-[var(--text)]">
          Rs. {product.price.toLocaleString()}
        </span>

        {product.originalPrice && (
          <span className="text-lg line-through text-[var(--text3)]">
            Rs. {product.originalPrice.toLocaleString()}
          </span>
        )}

        {discountPercent && (
          <span className="bg-red-50 text-red-600 px-2 py-1 rounded-full text-xs">
            -{discountPercent}%
          </span>
        )}
      </div>

      {/* DESCRIPTION */}
      <p className="text-sm text-[var(--text2)] leading-relaxed">
        {product.description}
      </p>

      {/* OPTIONS */}
      <ProductOptions product={product} />

      {/* ACCORDION (NO CRASH) */}
      {accordionItems.length > 0 && (
        <div className="mt-10">

          <div className="border-t border-gray-200" />

          {accordionItems.map((item, i) => (
            <details key={i} className="py-5 border-b border-gray-200">
              <summary className="cursor-pointer font-medium text-[var(--text)]">
                {item.title}
              </summary>

              <p className="mt-3 text-sm text-[var(--text2)] leading-relaxed">
                {item.content}
              </p>
            </details>
          ))}

        </div>
      )}
    </div>
  );
};