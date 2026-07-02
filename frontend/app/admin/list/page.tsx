'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useProductStore } from '@/store/useProductStore';
import toast from 'react-hot-toast';

const CATEGORIES = ['All', 'Running', 'Hiking', 'Lifestyle', 'Sport', 'Basketball', 'Training', 'Casual', 'Race'];

export default function ListItemsPage() {
  const { products, isLoading, fetchProducts, deleteProduct } = useProductStore();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts({ limit: 100 });
  }, []);

  const filtered = products.filter((p) => {
    const matchCat = category === 'All' || p.category === category;
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await deleteProduct(id);
      toast.success('Product deleted');
    } catch {
      toast.error('Failed to delete product');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
        <h1 className="font-['Playfair_Display'] text-2xl font-bold" style={{ color: 'var(--text)' }}>
          All Products
        </h1>
        <Link href="/admin/add"
          className="px-5 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wide transition-all duration-200 hover:opacity-90"
          style={{ background: '#111111', color: '#ffffff' }}>
          + Add New
        </Link>
      </div>

      {/* Search + filter */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          className="px-4 py-2.5 rounded-xl text-sm outline-none flex-1 min-w-[200px]"
          style={{ background: 'var(--surface)', border: '1.5px solid var(--border2)', color: 'var(--text)' }}
          placeholder="Search by name or brand…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="px-4 py-2.5 rounded-xl text-sm outline-none"
          style={{ background: 'var(--surface)', border: '1.5px solid var(--border2)', color: 'var(--text)', fontFamily: 'inherit' }}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        {/* Header */}
        <div
          className="grid grid-cols-[80px_1fr_140px_100px_80px] gap-4 px-6 py-3.5 text-[0.7rem] font-bold uppercase tracking-wider"
          style={{ background: 'var(--surface2)', color: 'var(--text2)' }}
        >
          <span>Image</span>
          <span>Name</span>
          <span>Category</span>
          <span>Price</span>
          <span className="text-center">Action</span>
        </div>

        {isLoading ? (
          <div className="py-16 text-center text-sm" style={{ color: 'var(--text3)' }}>
            Loading products...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-sm" style={{ color: 'var(--text3)' }}>
            No products found
          </div>
        ) : (
          filtered.map((product, idx) => (
            <div
              key={product.id}
              className="grid grid-cols-[80px_1fr_140px_100px_80px] gap-4 px-6 py-4 items-center transition-colors duration-150"
              style={{ borderTop: idx === 0 ? 'none' : '1px solid var(--border)', background: 'var(--surface)' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface2)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--surface)')}
            >
              {/* Image */}
              <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0" style={{ background: 'var(--surface2)' }}>
                {product.images[0] ? (
                  <Image src={product.images[0]} alt={product.name} fill sizes="56px" className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs" style={{ color: 'var(--text3)' }}>No img</div>
                )}
              </div>

              {/* Name */}
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{product.name}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text3)' }}>
                  {product.brand} · {product.collection}
                </p>
              </div>

              {/* Category */}
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold w-fit"
                style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
                {product.category}
              </span>

              {/* Price */}
              <div>
                <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>${product.price}</span>
                {product.originalPrice && (
                  <span className="text-xs line-through ml-1.5" style={{ color: 'var(--text3)' }}>
                    ${product.originalPrice}
                  </span>
                )}
              </div>

              {/* Delete */}
              <div className="flex items-center justify-center">
                <button
                  onClick={() => handleDelete(product.id)}
                  disabled={deletingId === product.id}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-all duration-200 hover:bg-red-50 disabled:opacity-40"
                  style={{ color: 'var(--danger)' }}
                  title="Delete product"
                >
                  {deletingId === product.id ? (
                    <span className="text-xs animate-spin">⟳</span>
                  ) : '✕'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <p className="text-xs mt-4" style={{ color: 'var(--text3)' }}>
        Showing {filtered.length} of {products.length} products
      </p>
    </div>
  );
}