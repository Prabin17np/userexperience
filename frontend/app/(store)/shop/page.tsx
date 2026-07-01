'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/product/ProductCard';
import { useProductStore } from '@/store/useProductStore';
import { ProductCategory, SortOption } from '@/types';

const ITEMS_PER_PAGE = 8;

const CATEGORIES: (ProductCategory | 'All')[] = [
  'All', 'Running', 'Hiking', 'Lifestyle', 'Sport',
  'Basketball', 'Training', 'Casual',
];

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: 'Newest',          value: 'newest' },
  { label: 'Price: Low–High', value: 'price-asc' },
  { label: 'Price: High–Low', value: 'price-desc' },
  { label: 'Most Popular',    value: 'popular' },
];

export default function ShopPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const category = (searchParams.get('category') as ProductCategory | null) || 'All';
  const sort     = (searchParams.get('sort') as SortOption) || 'newest';
  const query    = searchParams.get('query') || '';

  const {
    products, total, page, totalPages,
    isLoading, error,
    fetchProducts, searchProducts,
  } = useProductStore();

  useEffect(() => {
    if (query) {
      searchProducts(query);
    } else {
      fetchProducts({
        category: category !== 'All' ? category : undefined,
        sort:
          sort === 'price-asc'  ? 'price'    :
          sort === 'price-desc' ? '-price'   :
          sort === 'popular'    ? '-isBestseller' :
          '-createdAt',
        page: 1,
        limit: ITEMS_PER_PAGE,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, sort, query]);

  const handleCategory = (c: ProductCategory | 'All') => {
    if (c === 'All') router.push('/shop');
    else router.push(`/shop?category=${c}`);
  };

  const handleSort = (s: SortOption) => {
    router.push(`/shop?category=${category}&sort=${s}`);
  };

  const loadMore = () => {
    fetchProducts({
      category: category !== 'All' ? category : undefined,
      sort:
        sort === 'price-asc'  ? 'price'    :
        sort === 'price-desc' ? '-price'   :
        sort === 'popular'    ? '-isBestseller' :
        '-createdAt',
      page: page + 1,
      limit: ITEMS_PER_PAGE,
    });
  };

  const clearFilters = () => router.push('/shop');
  const isFilterActive = category !== 'All' || sort !== 'newest';

  const loadMoreBtnStyle: React.CSSProperties = {
    padding: '10px 20px',
    borderRadius: 10,
    border: '1px solid #ddd',
    background: 'transparent',
    cursor: 'pointer',
    fontWeight: 500,
    transition: 'all 0.2s ease',
  };

  return (
    <div style={{ minHeight: '100vh' }}>

      {/* HEADER */}
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 600 }}>All Products</h1>
        <p style={{ color: '#666' }}>Discover premium footwear collection</p>
      </div>

      {/* FILTER BAR */}
      <div style={{
        position: 'sticky', top: 64,
        background: '#fff', borderBottom: '1px solid #eee', zIndex: 10,
      }}>
        <div style={{
          maxWidth: 1400, margin: '0 auto', padding: '1rem 2rem',
          display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center',
        }}>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => handleCategory(c)}
              className="shop-category-btn"
              style={{
                padding: '8px 14px', borderRadius: 20, border: '1px solid #ddd',
                background: category === c ? '#111' : '#fff',
                color: category === c ? '#fff' : '#333', cursor: 'pointer',
                transition: 'background 0.2s ease, color 0.2s ease, border-color 0.2s ease, transform 0.2s ease',
              }}
            >
              {c}
            </button>
          ))}

          <div style={{ marginLeft: 'auto' }}>
            <select value={sort} onChange={(e) => handleSort(e.target.value as SortOption)}>
              {SORT_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          {isFilterActive && (
            <button onClick={clearFilters} style={{ marginLeft: 10 }}>Clear</button>
          )}
        </div>
      </div>

      {/* SHOWING TEXT */}
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '1rem 2rem' }}>
        <p style={{ fontSize: '0.9rem', color: '#666' }}>
          {isLoading
            ? 'Loading...'
            : error
            ? error
            : `Showing ${products.length} of ${total} styles`}
        </p>
      </div>

      {/* PRODUCTS */}
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '2rem' }}>
        {isLoading && products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem' }}>
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
            <h2>No styles found</h2>
            <p style={{ color: '#666', marginBottom: 20 }}>Try adjusting your filters</p>
            <button onClick={clearFilters}
              style={{ padding: '10px 16px', borderRadius: 10, border: '1px solid #ddd',
                background: '#111', color: '#fff', cursor: 'pointer' }}>
              Clear all filters
            </button>
          </div>
        ) : (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '2rem',
            }}>
              {products.map((p) => (
                <div key={p.id} className="shop-product-tile">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>

            {page < totalPages && (
              <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                <button
                  onClick={loadMore}
                  disabled={isLoading}
                  style={loadMoreBtnStyle}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = '#111';
                    (e.currentTarget as HTMLButtonElement).style.background = '#111';
                    (e.currentTarget as HTMLButtonElement).style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = '#ddd';
                    (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                    (e.currentTarget as HTMLButtonElement).style.color = '#000';
                  }}
                >
                  {isLoading ? 'Loading...' : 'Load More Styles'}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <style jsx>{`
        .shop-category-btn:hover {
          transform: translateY(-1px);
          border-color: #111;
        }
        .shop-product-tile {
          border-radius: 10px;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          animation: shopFadeIn 0.4s ease both;
        }
        .shop-product-tile:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
        }
        @keyframes shopFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}