'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c1.5-4 6-6 8-6s6.5 2 8 6" />
  </svg>
);

const PackageIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 8l-9-5-9 5 9 5 9-5z" />
    <path d="M3 8v8l9 5 9-5V8" />
    <line x1="12" y1="13" x2="12" y2="21" />
  </svg>
);

const ListIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="4" y="3" width="16" height="18" rx="2" />
    <line x1="8" y1="8" x2="16" y2="8" />
    <line x1="8" y1="12" x2="16" y2="12" />
    <line x1="8" y1="16" x2="12" y2="16" />
  </svg>
);

const SlidersIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="4" y1="6" x2="14" y2="6" />
    <circle cx="17" cy="6" r="2" />
    <line x1="10" y1="12" x2="20" y2="12" />
    <circle cx="7" cy="12" r="2" />
    <line x1="4" y1="18" x2="14" y2="18" />
    <circle cx="17" cy="18" r="2" />
  </svg>
);

const NAV_ITEMS = [
  { label: 'Account Overview', href: '/account', icon: UserIcon },
  { label: 'My Orders', href: '/account/orders', icon: PackageIcon },
  { label: 'Addresses', href: '/account/addresses', icon: ListIcon },
  { label: 'Account Settings', href: '/account/settings', icon: SlidersIcon },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  React.useEffect(() => {
    if (hasHydrated && !isAuthenticated) {
      router.replace('/login');
    }
  }, [hasHydrated, isAuthenticated, router]);

  if (!hasHydrated) return null;
  if (!isAuthenticated) return null;

  return (
    <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold text-[#111111] mb-8">
        Hello, {user?.name}
      </h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-[260px] flex-shrink-0">
          <nav className="bg-[#F7F7F7] rounded-md p-2 flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm transition-colors ${
                    isActive
                      ? 'bg-white text-[#111111] font-semibold border-l-2 border-[#111111] shadow-sm'
                      : 'text-[#555555] hover:bg-white/60 hover:text-[#111111] border-l-2 border-transparent'
                  }`}
                >
                  <Icon />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}