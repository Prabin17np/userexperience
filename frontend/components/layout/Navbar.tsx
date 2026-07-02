'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Heart, User, ChevronDown, ShoppingBag, Menu, X } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';

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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const initial = user?.name?.charAt(0)?.toUpperCase() ?? '?';

  return (
    <header
      className={`sticky top-0 z-40 w-full border-b bg-[var(--surface)] transition-all duration-200 ${
        scrolled
          ? 'border-[var(--border)] shadow-[0_1px_0_0_var(--border),0_8px_24px_-16px_rgba(10,10,10,0.25)]'
          : 'border-transparent'
      }`}
    >
      <div
        className={`mx-auto flex max-w-[1280px] items-center justify-between px-6 transition-[height] duration-200 lg:px-8 ${
          scrolled ? 'h-16' : 'h-20'
        }`}
      >
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-black uppercase tracking-tighter text-[var(--text)] transition-opacity duration-150 hover:opacity-70"
        >
          SOLE<span className="text-[var(--accent)]">LY</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-10 md:flex" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-link relative text-xs font-bold uppercase tracking-[0.15em] text-[var(--text-muted)] transition-colors duration-200 hover:text-[var(--text)]"
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
                searchOpen ? 'w-40 opacity-100 sm:w-56' : 'w-0 opacity-0'
              }`}
            >
              <form onSubmit={handleSearch} className="pr-2">
                <input
                  ref={searchInputRef}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products..."
                  className="w-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface-sunken)] px-3.5 py-2 text-sm text-[var(--text)] outline-none transition-all duration-200 placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:bg-[var(--surface)] focus:ring-2 focus:ring-[var(--accent-soft)]"
                />
              </form>
            </div>
            <button
              onClick={toggleSearch}
              className="text-[var(--text-muted)] transition-all duration-200 hover:scale-110 hover:text-[var(--text)]"
              aria-label={searchOpen ? 'Close search' : 'Search'}
            >
              {searchOpen ? <X size={19} strokeWidth={2} /> : <Search size={19} strokeWidth={2} />}
            </button>
          </div>

          {/* WISHLIST */}
          <Link
            href="/wishlist"
            className="text-[var(--text-muted)] transition-all duration-200 hover:scale-110 hover:text-[var(--text)]"
            aria-label="Wishlist"
          >
            <Heart size={19} strokeWidth={2} />
          </Link>

          {/* USER / ACCOUNT */}
          <div className="relative" ref={accountRef}>
            <button
              onClick={handleUserIconClick}
              className="flex items-center gap-1 text-[var(--text-muted)] transition-all duration-200 hover:scale-110 hover:text-[var(--text)]"
              aria-label={mounted && isAuthenticated ? 'Account menu' : 'Login or register'}
              aria-expanded={accountOpen}
            >
              <User size={19} strokeWidth={2} />
              {mounted && isAuthenticated && (
                <ChevronDown
                  size={13}
                  strokeWidth={2.5}
                  className={`transition-transform duration-200 ${accountOpen ? 'rotate-180' : ''}`}
                />
              )}
            </button>

            {mounted && isAuthenticated && accountOpen && (
              <div className="nav-account-dropdown absolute right-0 top-full z-50 mt-3 w-64 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] py-2 shadow-[0_16px_40px_-12px_rgba(10,10,10,0.18)]">
                <div className="flex items-center gap-3 border-b border-[var(--border)] px-4 py-3.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--surface-inverse)] text-sm font-bold text-[var(--text-inverse)]">
                    {initial}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[var(--text)]">{user?.name}</p>
                    <p className="truncate text-xs text-[var(--text-muted)]">{user?.email}</p>
                  </div>
                </div>

                <Link
                  href="/account"
                  onClick={() => setAccountOpen(false)}
                  className="block px-4 py-2.5 text-sm text-[var(--text-muted)] transition-colors duration-150 hover:bg-[var(--surface-sunken)] hover:text-[var(--text)]"
                >
                  Account Overview
                </Link>
                <Link
                  href="/account/orders"
                  onClick={() => setAccountOpen(false)}
                  className="block px-4 py-2.5 text-sm text-[var(--text-muted)] transition-colors duration-150 hover:bg-[var(--surface-sunken)] hover:text-[var(--text)]"
                >
                  My Orders
                </Link>
                <Link
                  href="/account/addresses"
                  onClick={() => setAccountOpen(false)}
                  className="block px-4 py-2.5 text-sm text-[var(--text-muted)] transition-colors duration-150 hover:bg-[var(--surface-sunken)] hover:text-[var(--text)]"
                >
                  Addresses
                </Link>
                <Link
                  href="/account/settings"
                  onClick={() => setAccountOpen(false)}
                  className="block px-4 py-2.5 text-sm text-[var(--text-muted)] transition-colors duration-150 hover:bg-[var(--surface-sunken)] hover:text-[var(--text)]"
                >
                  Account Settings
                </Link>

                <div className="mt-1 border-t border-[var(--border)] pt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2.5 text-left text-sm font-medium text-[var(--accent)] transition-colors duration-150 hover:bg-[var(--surface-sunken)]"
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
            className="relative text-[var(--text-muted)] transition-all duration-200 hover:scale-110 hover:text-[var(--text)]"
            aria-label={`Cart, ${mounted ? totalItems : 0} items`}
          >
            <ShoppingBag size={19} strokeWidth={2} />

            {mounted && totalItems > 0 && (
              <span className="nav-cart-badge absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--accent)] text-[9px] font-bold text-[var(--text-inverse)]">
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </Link>

          {/* MOBILE MENU TOGGLE */}
          <button
            className="text-[var(--text-muted)] transition-colors duration-200 hover:text-[var(--text)] md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} strokeWidth={2} /> : <Menu size={20} strokeWidth={2} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <nav className="nav-mobile-menu flex flex-col border-t border-[var(--border)] bg-[var(--surface)] px-6 py-4 md:hidden">
          {NAV_LINKS.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`py-3 text-sm font-bold uppercase tracking-[0.1em] text-[var(--text)] transition-colors duration-150 hover:text-[var(--accent)] ${
                i !== 0 ? 'border-t border-[var(--border)]' : ''
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
          background: var(--accent);
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