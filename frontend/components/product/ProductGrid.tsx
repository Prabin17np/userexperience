import React from 'react';
import { Product } from '@/types/product';
import { ProductCard } from './ProductCard';

interface Props {
  products: Product[];
  columns?: 2 | 3 | 4;
}

export const ProductGrid: React.FC<Props> = ({ products, columns = 4 }) => {
  if (products.length === 0) {
    return (
      <div style={{ padding: '5rem 1rem', textAlign: 'center' }}>
        <p style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '1.5rem',
          fontWeight: 600,
          color: 'var(--text)',
          marginBottom: '0.5rem',
        }}>
          No products found
        </p>
        <p style={{ fontSize: '0.9rem', color: 'var(--text2)' }}>
          Try adjusting your filters
        </p>
      </div>
    );
  }

  const minWidth = columns === 2 ? '320px' : columns === 3 ? '280px' : '240px';

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(auto-fill, minmax(${minWidth}, 1fr))`,
      gap: '2rem',
    }}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};