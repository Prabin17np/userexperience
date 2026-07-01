import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative w-full bg-[#f7f7f7] overflow-hidden min-h-[480px] lg:min-h-[560px]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 h-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center py-16 lg:py-20">

          {/* Left — copy */}
          <div className="flex flex-col gap-6 relative z-10">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black uppercase leading-[0.92] tracking-tight text-[#111111]">
              Find Shoe<br />That<br />Matches<br />Your Style
            </h1>
            <p className="text-sm text-[#666666] max-w-[280px] leading-relaxed">
              Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit, Sed Do Eiusmod
            </p>
            <div>
              <Link
                href="/shop"
                className="inline-flex items-center justify-center h-12 px-8 bg-[#111111] text-white text-xs font-semibold uppercase tracking-widest hover:bg-[#2a2a2a] transition-colors duration-150"
              >
                Shop Now
              </Link>
            </div>
          </div>

          {/* Right — hero shoe + watermark */}
          <div className="relative flex items-center justify-center min-h-[320px] lg:min-h-[420px]">
            {/* ULTIMATE watermark */}
            <span
              className="absolute inset-0 flex items-center justify-center text-[140px] sm:text-[180px] lg:text-[220px] font-black uppercase tracking-tighter text-[#111111]/[0.04] select-none pointer-events-none leading-none"
              aria-hidden="true"
            >
              ULTIMATE
            </span>

            {/* Shoe image */}
            <div className="relative z-10 w-full max-w-[480px] aspect-[4/3]">
              <Image
  src="/images/hero-shoe.jpg"
  alt="Trendy Slick Pro — featured shoe"
  fill
  className="object-contain drop-shadow-2xl"
  priority
  sizes="(max-width: 1024px) 100vw, 50vw"
/>
            </div>

             {/* PRICE LABEL INSIDE IMAGE */}
    <div className="absolute bottom-10 right-10 bg-white/90 backdrop-blur-md shadow-lg px-5 py-3 rounded-md">
      <p className="text-sm font-bold text-[#111111]">
        Trendy Slick Pro
      </p>
      <p className="text-sm text-[#888888] mt-0.5">
        ₹ 3999.00
      </p>
    </div>
          </div>
        </div>
      </div>
    </section>
  );
};