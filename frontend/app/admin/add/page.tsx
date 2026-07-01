'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { createProductAction } from '@/lib/action/admin.action';
import toast from 'react-hot-toast';

const CATEGORIES = ['Running', 'Hiking', 'Lifestyle', 'Sport', 'Basketball', 'Training', 'Casual', 'Race'];
const SIZES = ['6', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '12'];
const BADGE_OPTIONS = [{ value: '', label: 'None' }, { value: 'NEW', label: 'NEW' }, { value: 'SALE', label: 'SALE' }];

const UploadIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-40">
    <polyline points="16 16 12 12 8 16" />
    <line x1="12" y1="12" x2="12" y2="21" />
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
  </svg>
);

interface ImageSlot {
  preview: string | null;
  file: File | null;
}

export default function AddItemsPage() {
  const [images, setImages] = useState<ImageSlot[]>([
    { preview: null, file: null },
    { preview: null, file: null },
    { preview: null, file: null },
    { preview: null, file: null },
  ]);

  const [form, setForm] = useState({
    name: '',
    brand: 'SOLE',
    description: '',
    category: 'Running',
    collection: '',
    price: '',
    originalPrice: '',
    badge: '',
    isBestseller: false,
  });

  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileRefs = useRef<(HTMLInputElement | null)[]>([null, null, null, null]);

  function handleImageChange(idx: number, file: File | null) {
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setImages((prev) => {
      const next = [...prev];
      next[idx] = { preview, file };
      return next;
    });
  }

  function removeImage(idx: number) {
    setImages((prev) => {
      const next = [...prev];
      next[idx] = { preview: null, file: null };
      return next;
    });
  }

  function toggleSize(size: string) {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  }

  function validate() {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = 'Product name is required';
    if (!form.description.trim()) next.description = 'Description is required';
    if (!form.price || isNaN(Number(form.price))) next.price = 'Valid price is required';
    if (!form.collection.trim()) next.collection = 'Collection is required';
    if (selectedSizes.length === 0) next.sizes = 'Select at least one size';
    if (!images.some((i) => i.file)) next.images = 'Upload at least one image';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('brand', form.brand);
      formData.append('description', form.description);
      formData.append('category', form.category.toLowerCase());
      formData.append('productCollection', form.collection);
      formData.append('price', form.price);
      if (form.originalPrice) formData.append('originalPrice', form.originalPrice);
      formData.append('badge', form.badge);
      formData.append('isBestseller', String(form.isBestseller));
      selectedSizes.forEach((s) => formData.append('sizes', s));
      images.forEach((slot) => {
        if (slot.file) formData.append('images', slot.file);
      });

      await createProductAction(formData);

      setSuccess(true);
      toast.success('Product added successfully!');

      setTimeout(() => {
        setSuccess(false);
        setForm({ name: '', brand: 'SOLE', description: '', category: 'Running', collection: '', price: '', originalPrice: '', badge: '', isBestseller: false });
        setSelectedSizes([]);
        setImages([{ preview: null, file: null }, { preview: null, file: null }, { preview: null, file: null }, { preview: null, file: null }]);
        setErrors({});
      }, 2000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to add product';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass = 'w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-150 bg-[#f3f4f6] border-[1.5px] border-transparent focus:border-[var(--accent)] placeholder:text-[var(--text3)]';
  const labelClass = 'block text-xs font-bold uppercase tracking-wider mb-2';

  return (
    <div className="max-w-[800px]">
      <h1 className="font-['Playfair_Display'] text-2xl font-bold mb-8" style={{ color: 'var(--text)' }}>
        Add New Product
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-7">

        {/* Image upload */}
        <div>
          <label className={labelClass} style={{ color: 'var(--text2)' }}>Upload Images</label>
          <div className="grid grid-cols-4 gap-3">
            {images.map((slot, idx) => (
              <div key={idx} className="relative">
                <div
                  className="aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all duration-200 hover:border-[var(--accent)]"
                  style={{
                    borderColor: slot.preview ? 'var(--accent)' : 'var(--border2)',
                    background: slot.preview ? 'transparent' : 'var(--surface2)',
                  }}
                  onClick={() => fileRefs.current[idx]?.click()}
                >
                  {slot.preview ? (
                    <Image src={slot.preview} alt={`Upload ${idx + 1}`} fill className="object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-1.5">
                      <UploadIcon />
                      <span className="text-[0.65rem] font-medium" style={{ color: 'var(--text3)' }}>Upload</span>
                    </div>
                  )}
                  <input
                    ref={(el) => { fileRefs.current[idx] = el; }}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageChange(idx, e.target.files?.[0] ?? null)}
                  />
                </div>
                {slot.preview && (
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center z-10"
                    style={{ background: 'var(--danger)', color: '#fff' }}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
          {errors.images && <p className="text-xs mt-2" style={{ color: 'var(--danger)' }}>⚠ {errors.images}</p>}
        </div>

        {/* Name */}
        <div>
          <label className={labelClass} style={{ color: 'var(--text2)' }}>Product Name</label>
          <input className={inputClass} style={{ color: 'var(--text)' }} placeholder="e.g. Aether Runner Pro"
            value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          {errors.name && <p className="text-xs mt-1.5" style={{ color: 'var(--danger)' }}>⚠ {errors.name}</p>}
        </div>

        {/* Brand */}
        <div>
          <label className={labelClass} style={{ color: 'var(--text2)' }}>Brand</label>
          <input className={inputClass} style={{ color: 'var(--text)' }} placeholder="e.g. SOLE"
            value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
        </div>

        {/* Description */}
        <div>
          <label className={labelClass} style={{ color: 'var(--text2)' }}>Product Description</label>
          <textarea className={`${inputClass} resize-none`} style={{ color: 'var(--text)' }} rows={4}
            placeholder="Write product description here..."
            value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          {errors.description && <p className="text-xs mt-1.5" style={{ color: 'var(--danger)' }}>⚠ {errors.description}</p>}
        </div>

        {/* Category, Collection, Badge */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelClass} style={{ color: 'var(--text2)' }}>Category</label>
            <select className={inputClass} style={{ color: 'var(--text)' }}
              value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass} style={{ color: 'var(--text2)' }}>Collection</label>
            <input className={inputClass} style={{ color: 'var(--text)' }} placeholder="e.g. 2026 Spring"
              value={form.collection} onChange={(e) => setForm({ ...form, collection: e.target.value })} />
            {errors.collection && <p className="text-xs mt-1.5" style={{ color: 'var(--danger)' }}>⚠ {errors.collection}</p>}
          </div>
          <div>
            <label className={labelClass} style={{ color: 'var(--text2)' }}>Badge</label>
            <select className={inputClass} style={{ color: 'var(--text)' }}
              value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })}>
              {BADGE_OPTIONS.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
            </select>
          </div>
        </div>

        {/* Price, Original Price */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass} style={{ color: 'var(--text2)' }}>Product Price ($)</label>
            <input type="number" min="0" className={inputClass} style={{ color: 'var(--text)' }} placeholder="e.g. 219"
              value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            {errors.price && <p className="text-xs mt-1.5" style={{ color: 'var(--danger)' }}>⚠ {errors.price}</p>}
          </div>
          <div>
            <label className={labelClass} style={{ color: 'var(--text2)' }}>
              Original Price ($) <span className="font-normal normal-case tracking-normal" style={{ color: 'var(--text3)' }}>(optional)</span>
            </label>
            <input type="number" min="0" className={inputClass} style={{ color: 'var(--text)' }} placeholder="e.g. 259"
              value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: e.target.value })} />
          </div>
        </div>

        {/* Sizes */}
        <div>
          <label className={labelClass} style={{ color: 'var(--text2)' }}>Product Sizes (US)</label>
          <div className="flex flex-wrap gap-2 mt-1">
            {SIZES.map((size) => {
              const active = selectedSizes.includes(size);
              return (
                <button key={size} type="button" onClick={() => toggleSize(size)}
                  className="px-4 py-2 rounded-lg text-sm font-semibold border-[1.5px] transition-all duration-150 active:scale-95"
                  style={{
                    background: active ? '#27AE60' : 'var(--surface2)',
                    borderColor: active ? '#27AE60' : 'var(--border2)',
                    color: active ? '#fff' : 'var(--text2)',
                  }}>
                  {size}
                </button>
              );
            })}
          </div>
          {errors.sizes && <p className="text-xs mt-2" style={{ color: 'var(--danger)' }}>⚠ {errors.sizes}</p>}
        </div>

        {/* Bestseller */}
        <label className="flex items-center gap-2.5 cursor-pointer select-none w-fit">
          <input type="checkbox" className="w-4 h-4 rounded cursor-pointer" style={{ accentColor: 'var(--text)' }}
            checked={form.isBestseller} onChange={(e) => setForm({ ...form, isBestseller: e.target.checked })} />
          <span className="text-sm font-medium" style={{ color: 'var(--text2)' }}>Add to bestsellers</span>
        </label>

     {/* Submit */}
<div className="pt-2 pb-8">
  <button
    type="submit"
    disabled={submitting || success}
    className="px-10 py-4 rounded-xl text-sm font-bold uppercase tracking-widest transition-all duration-200 active:scale-[0.98] disabled:opacity-60 flex items-center gap-2"
    style={{
      background: success ? '#27AE60' : '#111111',  // ← hardcoded instead of var(--text)
      color: '#ffffff',
      minWidth: 140,
      justifyContent: 'center',
    }}
  >
    {submitting ? (
      <>
        <span className="animate-spin">⟳</span> Adding…
      </>
    ) : success ? (
      <>✓ Added</>
    ) : (
      'Add Product'
    )}
  </button>
</div>
      </form>
    </div>
  );
}