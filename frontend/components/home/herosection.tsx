'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative w-full bg-white overflow-hidden min-h-[560px] lg:min-h-[640px] flex">
      {/* Left — copy */}
      <div className="relative z-10 w-full lg:w-1/2 flex items-center">
        <div className="max-w-[560px] mx-auto px-6 lg:px-12 py-16 flex flex-col gap-6">
          <span className="hero-fade hero-delay-1 text-xs font-bold uppercase tracking-[0.2em] text-[#c8460e]">
            New Season Arrivals
          </span>

          <h1 className="hero-fade hero-delay-2 text-5xl sm:text-6xl lg:text-7xl font-black uppercase leading-[0.9] tracking-tight text-[#111111]">
            Find Shoe<br />That<br />Matches<br />Your Style
          </h1>

          <p className="hero-fade hero-delay-3 text-sm text-[#666666] max-w-[300px] leading-relaxed">
            Premium sneakers designed for comfort, performance, and everyday style. Built for those who move differently.
          </p>

          <div className="hero-fade hero-delay-4 flex items-center gap-4">
            <Link
              href="/shop"
              className="group inline-flex items-center justify-center gap-2 h-12 px-8 bg-[#111111] text-white text-xs font-semibold uppercase tracking-widest hover:bg-[#2a2a2a] transition-colors duration-300"
            >
              Shop Now
              <ArrowRight size={14} strokeWidth={2.5} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/shop?collection=new"
              className="inline-flex items-center justify-center h-12 px-8 border border-[#111111] text-[#111111] text-xs font-semibold uppercase tracking-widest hover:bg-[#111111] hover:text-white transition-colors duration-300"
            >
              Explore
            </Link>
          </div>
        </div>
      </div>

      {/* Right — big image panel, clean edge */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <Image
          src="/images/hero1.jpg"
          alt="Trendy Slick Pro — featured shoe"
          fill
          className="object-cover"
          priority
          sizes="50vw"
        />

        {/* PRICE LABEL */}
        <div className="hero-fade hero-delay-5 absolute bottom-10 right-10 bg-white/90 backdrop-blur-md shadow-lg px-5 py-3 rounded-md">
          <p className="text-sm font-bold text-[#111111]">Trendy Slick Pro</p>
          <p className="text-sm text-[#888888] mt-0.5">₹ 3999.00</p>
        </div>
      </div>

      <style jsx>{`
        .hero-fade {
          opacity: 0;
          transform: translateY(16px);
          animation: heroFadeIn 0.7s ease forwards;
        }
        .hero-delay-1 { animation-delay: 0.05s; }
        .hero-delay-2 { animation-delay: 0.15s; }
        .hero-delay-3 { animation-delay: 0.28s; }
        .hero-delay-4 { animation-delay: 0.4s; }
        .hero-delay-5 { animation-delay: 0.6s; }

        @keyframes heroFadeIn {
          to { opacity: 1; transform: translateY(0); }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-fade { animation: none !important; opacity: 1 !important; transform: none !important; }
        }
      `}</style>
    </section>
  );
};