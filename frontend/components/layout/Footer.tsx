'use client';
import React from 'react';
import Link from 'next/link';

const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
  </svg>
);

const TwitterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
  </svg>
);

const QUICK_LINKS = [
  { id: "home", label: "Home", href: "/" },
  { id: "shop", label: "Shop", href: "/shop" },
  { id: "collection", label: "Collection", href: "/shop?filter=collections" },
  { id: "contact", label: "Contact", href: "/contact" },
  { id: "privacy", label: "Privacy", href: "/privacy" },
];

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#111111] text-white">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand column */}
          <div className="flex flex-col gap-4">
            <span className="text-lg font-black uppercase tracking-tight">Solely</span>
            <p className="text-sm text-[#aaaaaa] leading-relaxed max-w-[240px]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
              incididunt ut labore et dolore magna aliqua.
            </p>
            <div className="flex items-center gap-3 mt-2">
              <a
                href="#"
                aria-label="Facebook"
                className="h-8 w-8 rounded-full border border-[#333333] flex items-center justify-center text-[#aaaaaa] hover:text-white hover:border-white transition-colors duration-150"
              >
                <FacebookIcon />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="h-8 w-8 rounded-full border border-[#333333] flex items-center justify-center text-[#aaaaaa] hover:text-white hover:border-white transition-colors duration-150"
              >
                <TwitterIcon />
              </a>
            </div>
          </div>

          {/* Newsletter column */}
          <div className="flex flex-col gap-4">
            <span className="text-sm font-semibold text-white uppercase tracking-widest">
              Subscribe to our newsletter
            </span>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex items-center border border-[#333333] bg-[#1a1a1a]"
            >
              <input
                type="email"
                placeholder="Enter Email..."
                aria-label="Email for newsletter"
                className="flex-1 bg-transparent text-sm text-white placeholder:text-[#666666] px-4 py-3 focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-3 text-xs font-semibold uppercase tracking-widest text-[#aaaaaa] hover:text-white transition-colors duration-150 border-l border-[#333333]"
              >
                Subscribe
              </button>
            </form>
          </div>

          {/* Quick links column */}
          <div className="flex flex-col gap-4">
            <span className="text-sm font-semibold text-white uppercase tracking-widest">
              Quick Links
            </span>
            <ul className="flex flex-col gap-2">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#aaaaaa] hover:text-white transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#222222]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-4 flex items-center justify-center">
          <p className="text-xs text-[#555555]">
            solely.com · all rights reserve
          </p>
        </div>
      </div>
    </footer>
  );
};