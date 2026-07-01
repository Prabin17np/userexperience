'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';

const SearchIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const HeartIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.8 4.6c-1.5-1.4-4-1.4-5.5 0L12 7.9 8.7 4.6c-1.5-1.4-4-1.4-5.5 0-1.6 1.5-1.6 4 0 5.5L12 21l8.8-10.9c1.6-1.5 1.6-4 0-5.5z" />
  </svg>
);

const UserIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c1.5-4 6-6 8-6s6.5 2 8 6" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const CartIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
  </svg>
);

const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact Us', href: '/contact' },
];

export const Navbar: React.FC = () => {
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  const items = useCartStore((state) => state.items);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Close the account dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus the search input once it actually slides into view
  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;

    router.push(`/shop?query=${search}`);
    setSearchOpen(false);
    setSearch('');
  };

  const toggleSearch = () => {
    if (searchOpen) {
      setSearchOpen(false);
      setSearch('');
    } else {
      setSearchOpen(true);
    }
  };

  const handleUserIconClick = () => {
    if (isAuthenticated) {
      setAccountOpen((v) => !v);
    } else {
      router.push('/register');
    }
  };

  const handleLogout = async () => {
    setAccountOpen(false);
    await logout();
    router.push('/');
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full border-b border-zinc-100 bg-white transition-shadow duration-200 ${
        scrolled ? 'shadow-md' : ''
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-6 lg:px-8">

        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-black uppercase tracking-tighter text-zinc-950 transition-opacity duration-150 hover:opacity-80"
        >
          SOLE<span className="text-[#C84B11]">LY</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-10 md:flex" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-link relative text-xs font-bold uppercase tracking-[0.15em] text-zinc-600 transition-colors duration-200 hover:text-zinc-950"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-5">

          {/* SEARCH */}
          <div className="flex items-center">
            <div
              className={`overflow-hidden transition-all duration-300 ease-out ${
                searchOpen ? 'w-40 opacity-100 sm:w-48' : 'w-0 opacity-0'
              }`}
            >
              <form onSubmit={handleSearch} className="pr-2">
                <input
                  ref={searchInputRef}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products..."
                  className="w-full rounded-md border border-zinc-300 px-3 py-1.5 text-sm outline-none transition-colors duration-200 focus:border-zinc-950"
                />
              </form>
            </div>
            <button
              onClick={toggleSearch}
              className="text-zinc-600 transition-all duration-200 hover:scale-110 hover:text-zinc-950"
              aria-label={searchOpen ? 'Close search' : 'Search'}
            >
              {searchOpen ? <CloseIcon /> : <SearchIcon />}
            </button>
          </div>

          {/* WISHLIST */}
          <Link
            href="/wishlist"
            className="text-zinc-600 transition-all duration-200 hover:scale-110 hover:text-zinc-950"
            aria-label="Wishlist"
          >
            <HeartIcon />
          </Link>

          {/* USER / ACCOUNT */}
          <div className="relative" ref={accountRef}>
            <button
              onClick={handleUserIconClick}
              className="flex items-center gap-1 text-zinc-600 transition-all duration-200 hover:scale-110 hover:text-zinc-950"
              aria-label={mounted && isAuthenticated ? 'Account menu' : 'Login or register'}
              aria-expanded={accountOpen}
            >
              <UserIcon />
              {mounted && isAuthenticated && <ChevronDownIcon />}
            </button>

            {mounted && isAuthenticated && accountOpen && (
              <div className="nav-account-dropdown absolute right-0 top-full z-50 mt-3 w-56 rounded-xl border border-zinc-100 bg-white py-2 shadow-xl">
                <div className="border-b border-zinc-100 px-4 py-3">
                  <p className="truncate text-sm font-semibold text-zinc-950">
                    {user?.name}
                  </p>
                  <p className="truncate text-xs text-zinc-500">{user?.email}</p>
                </div>

                <Link
                  href="/account"
                  onClick={() => setAccountOpen(false)}
                  className="block px-4 py-2 text-sm text-zinc-600 transition-colors duration-150 hover:bg-zinc-50 hover:text-zinc-950"
                >
                  Account Overview
                </Link>
                <Link
                  href="/account/orders"
                  onClick={() => setAccountOpen(false)}
                  className="block px-4 py-2 text-sm text-zinc-600 transition-colors duration-150 hover:bg-zinc-50 hover:text-zinc-950"
                >
                  My Orders
                </Link>
                <Link
                  href="/account/addresses"
                  onClick={() => setAccountOpen(false)}
                  className="block px-4 py-2 text-sm text-zinc-600 transition-colors duration-150 hover:bg-zinc-50 hover:text-zinc-950"
                >
                  Addresses
                </Link>
                <Link
                  href="/account/settings"
                  onClick={() => setAccountOpen(false)}
                  className="block px-4 py-2 text-sm text-zinc-600 transition-colors duration-150 hover:bg-zinc-50 hover:text-zinc-950"
                >
                  Account Settings
                </Link>

                <div className="mt-1 border-t border-zinc-100 pt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm font-medium text-[#C84B11] transition-colors duration-150 hover:bg-zinc-50"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* CART */}
          <Link
            href="/cart"
            className="relative text-zinc-600 transition-all duration-200 hover:scale-110 hover:text-zinc-950"
            aria-label={`Cart, ${mounted ? totalItems : 0} items`}
          >
            <CartIcon />

            {mounted && totalItems > 0 && (
              <span className="nav-cart-badge absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#C84B11] text-[9px] font-bold text-white">
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </Link>

          {/* MOBILE MENU TOGGLE */}
          <button
            className="text-zinc-600 transition-colors duration-200 hover:text-zinc-950 md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </button>

        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <nav className="nav-mobile-menu flex flex-col border-t border-zinc-100 bg-white px-6 py-4 md:hidden">
          {NAV_LINKS.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`py-3 text-sm font-bold uppercase tracking-[0.1em] text-zinc-700 transition-colors duration-150 hover:text-zinc-950 ${
                i !== 0 ? 'border-t border-zinc-100' : ''
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}

      <style jsx>{`
        .nav-link::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -6px;
          height: 2px;
          width: 0;
          background: #111111;
          transition: width 0.25s ease;
        }
        .nav-link:hover::after {
          width: 100%;
        }
        .nav-account-dropdown {
          animation: navDropdownIn 0.18s ease both;
        }
        .nav-mobile-menu {
          animation: navMobileIn 0.2s ease both;
        }
        .nav-cart-badge {
          animation: navBadgePop 0.3s ease both;
        }
        @keyframes navDropdownIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes navMobileIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes navBadgePop {
          0%   { transform: scale(0); }
          70%  { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
      `}</style>
    </header>
  );
};