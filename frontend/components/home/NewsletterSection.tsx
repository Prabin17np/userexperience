'use client';
import React, { useState } from 'react';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // wire up to your existing newsletter action
  };

  return (
    <section className="bg-white py-20">
      <div className="max-w-[560px] mx-auto px-6 text-center">
        <h2 className="text-2xl lg:text-3xl font-black uppercase tracking-tight text-[var(--text)] mb-3">
          Stay in the Loop
        </h2>
        <p className="text-sm text-[var(--text-muted)] mb-8">
          Get early access to new drops and member-only offers.
        </p>

        <form onSubmit={handleSubmit} className="flex items-center border border-[var(--border)] bg-[var(--surface-sunken)]">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 bg-transparent px-4 py-3.5 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] outline-none"
          />
          <button
            type="submit"
            className="px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-white bg-[var(--surface-inverse)] hover:bg-[var(--accent)] transition-colors duration-300"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
};