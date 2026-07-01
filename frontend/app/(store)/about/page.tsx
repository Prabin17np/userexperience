'use client';

import Link from 'next/link';
import Image from 'next/image';

const STATS = [
  { value: '14K+', label: 'Happy Customers' },
  { value: '60+', label: 'Exclusive Styles' },
  { value: '98%', label: 'Satisfaction Rate' },
  { value: '12', label: 'Countries Shipped' },
];

const FEATURES = [
  {
    icon: '🏆',
    title: 'Premium Quality',
    desc: 'Every pair is crafted from carefully sourced materials, tested for durability and comfort before it ever reaches your feet.',
  },
  {
    icon: '🌿',
    title: 'Sustainable Materials',
    desc: 'We use eco-conscious fabrics and recycled components wherever possible, without compromising on performance.',
  },
  {
    icon: '🚚',
    title: 'Fast, Free Shipping',
    desc: 'Orders over $150 ship free, and most arrive within 3–5 business days — express options available at checkout.',
  },
  {
    icon: '↩️',
    title: '60-Day Returns',
    desc: "Not the right fit? Send it back within 60 days, no questions asked. We'll make it right.",
  },
  {
    icon: '🔒',
    title: 'Secure Checkout',
    desc: 'Bank-level encryption protects every transaction, so you can shop with total confidence.',
  },
  {
    icon: '💬',
    title: 'Real Human Support',
    desc: "Our support team is made up of actual sneakerheads who know the product inside and out.",
  },
];

const VALUES = [
  { title: 'Craftsmanship', desc: 'We obsess over the details others overlook.' },
  { title: 'Integrity', desc: 'Honest pricing, honest materials, honest service.' },
  { title: 'Momentum', desc: 'Designed to move with you, not slow you down.' },
];

export default function AboutPage() {
  return (
    <div style={{ background: 'var(--bg)' }}>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-[1300px] mx-auto px-6 sm:px-8 pt-20 pb-16 sm:pt-28 sm:pb-24 text-center">
          <p
            className="text-xs font-bold uppercase tracking-[0.25em] mb-4"
            style={{ color: 'var(--accent)' }}
          >
            Our Story
          </p>
          <h1
            className="font-['Playfair_Display'] text-4xl sm:text-6xl font-bold leading-[1.1] mb-6"
            style={{ color: 'var(--text)' }}
          >
            Engineered for<br />
            <span style={{ color: 'var(--accent)' }}>Momentum.</span>
          </h1>
          <p
            className="text-base sm:text-lg max-w-xl mx-auto leading-relaxed"
            style={{ color: 'var(--text2)' }}
          >
            SOLE was founded on a simple idea — footwear should keep up with you, not the other way around.
            Every stitch, sole, and lace is designed with intention.
          </p>
        </div>
      </section>

      {/* Brand story */}
      <section className="max-w-[1300px] mx-auto px-6 sm:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div
            className="relative aspect-[4/5] rounded-3xl overflow-hidden order-2 lg:order-1"
            style={{ background: 'var(--surface2)' }}
          >
            <div className="absolute inset-0 flex items-center justify-center text-8xl">
              👟
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <p
              className="text-xs font-bold uppercase tracking-[0.2em] mb-3"
              style={{ color: 'var(--accent)' }}
            >
              Where It Started
            </p>
            <h2
              className="font-['Playfair_Display'] text-3xl sm:text-4xl font-bold mb-5"
              style={{ color: 'var(--text)' }}
            >
              Built by runners,<br />for everyone who moves.
            </h2>
            <p className="text-sm sm:text-base leading-relaxed mb-4" style={{ color: 'var(--text2)' }}>
              What began as a small workshop experimenting with cushion foam has grown into a brand trusted
              by thousands. We didn't set out to make the loudest shoe on the shelf — we set out to make
              the one you forget you're wearing.
            </p>
            <p className="text-sm sm:text-base leading-relaxed" style={{ color: 'var(--text2)' }}>
              Today, every SOLE release goes through hundreds of hours of wear-testing before it ever
              reaches a customer. That obsession with the details is the whole point.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 sm:py-20" style={{ background: 'var(--surface2)' }}>
        <div className="max-w-[900px] mx-auto px-6 sm:px-8 text-center">
          <p
            className="text-xs font-bold uppercase tracking-[0.2em] mb-3"
            style={{ color: 'var(--accent)' }}
          >
            Our Mission
          </p>
          <h2
            className="font-['Playfair_Display'] text-3xl sm:text-4xl font-bold mb-6"
            style={{ color: 'var(--text)' }}
          >
            Make every step count.
          </h2>
          <p className="text-base sm:text-lg leading-relaxed" style={{ color: 'var(--text2)' }}>
            We believe great footwear shouldn't be a luxury reserved for elite athletes. Our mission is to
            put performance-grade engineering into shoes that anyone — runner, hiker, commuter, or
            weekend wanderer — can afford and rely on every single day.
          </p>
        </div>
      </section>

      {/* Why choose us */}
      <section className="max-w-[1300px] mx-auto px-6 sm:px-8 py-16 sm:py-20">
        <div className="text-center mb-12">
          <p
            className="text-xs font-bold uppercase tracking-[0.2em] mb-3"
            style={{ color: 'var(--accent)' }}
          >
            Why Choose Us
          </p>
          <h2
            className="font-['Playfair_Display'] text-3xl sm:text-4xl font-bold"
            style={{ color: 'var(--text)' }}
          >
            What sets SOLE apart
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                style={{ background: 'var(--accent-light)' }}
              >
                {f.icon}
              </div>
              <h3 className="text-base font-bold mb-2" style={{ color: 'var(--text)' }}>
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text2)' }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 sm:py-20" style={{ background: 'var(--text)' }}>
        <div className="max-w-[1300px] mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-6 text-center">
            {STATS.map((s) => (
              <div key={s.label}>
                <div
                  className="font-['Playfair_Display'] text-3xl sm:text-5xl font-bold mb-2"
                  style={{ color: 'var(--accent)' }}
                >
                  {s.value}
                </div>
                <div
                  className="text-xs sm:text-sm font-medium uppercase tracking-wide"
                  style={{ color: 'rgba(255,255,255,0.65)' }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-[1300px] mx-auto px-6 sm:px-8 py-16 sm:py-20">
        <div className="text-center mb-12">
          <p
            className="text-xs font-bold uppercase tracking-[0.2em] mb-3"
            style={{ color: 'var(--accent)' }}
          >
            What We Stand For
          </p>
          <h2
            className="font-['Playfair_Display'] text-3xl sm:text-4xl font-bold"
            style={{ color: 'var(--text)' }}
          >
            Our Values
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
          {VALUES.map((v, i) => (
            <div
              key={v.title}
              className="rounded-2xl p-8 text-center"
              style={{ background: 'var(--surface2)' }}
            >
              <div
                className="font-['Playfair_Display'] text-4xl font-bold mb-4"
                style={{ color: 'var(--accent)' }}
              >
                0{i + 1}
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text)' }}>
                {v.title}
              </h3>
              <p className="text-sm" style={{ color: 'var(--text2)' }}>
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-[1300px] mx-auto px-6 sm:px-8 pb-20">
        <div
          className="rounded-3xl px-8 sm:px-16 py-14 sm:py-20 text-center relative overflow-hidden"
          style={{ background: 'var(--text)' }}
        >
          <p
            className="text-xs font-bold uppercase tracking-[0.25em] mb-4"
            style={{ color: 'var(--accent)' }}
          >
            Ready to Move?
          </p>
          <h2
            className="font-['Playfair_Display'] text-3xl sm:text-5xl font-bold mb-6"
            style={{ color: '#fff' }}
          >
            Find your next pair.
          </h2>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg text-sm font-bold uppercase tracking-wide transition-all duration-200 hover:-translate-y-0.5"
            style={{ background: 'var(--accent)', color: '#fff' }}
          >
            Shop the Collection →
          </Link>
        </div>
      </section>

    </div>
  );
}