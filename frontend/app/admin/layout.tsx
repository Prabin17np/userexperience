'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

const NAV = [
  {
    href: '/admin/add',
    label: 'Add Items',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    ),
  },
  {
    href: '/admin/list',
    label: 'List Items',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <polyline points="9 11 12 14 22 4" />
      </svg>
    ),
  },
  {
    href: '/admin/orders',
    label: 'Orders',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <polyline points="9 11 12 14 22 4" />
      </svg>
    ),
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      {/* Top navbar */}
      <header
        className="h-[68px] flex items-center justify-between px-6 sm:px-8 flex-shrink-0 sticky top-0 z-50"
        style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}
      >
        <div>
          <div
            className="font-['Playfair_Display'] text-xl font-bold tracking-wide leading-none"
            style={{ color: 'var(--text)' }}
          >
            SOLE
          </div>
          <div
            className="text-[0.65rem] font-bold uppercase tracking-[0.18em] mt-0.5"
            style={{ color: 'var(--accent)' }}
          >
            Admin Panel
          </div>
        </div>

    <button
  onClick={handleLogout}
  className="
    px-8 py-4
    rounded-[var(--radius)]
    border-[1.5px] border-[var(--accent)]
    bg-[var(--accent)]
    text-[0.8rem] font-bold uppercase tracking-[0.15em]
    text-white
    shadow-[0_8px_20px_-8px_var(--accent)]
    transition-all duration-300
    hover:-translate-y-[1px]
    hover:brightness-90
  "
>
  Logout
</button>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className="w-[240px] flex-shrink-0 sticky top-[68px] h-[calc(100vh-68px)] overflow-y-auto"
          style={{ background: 'var(--surface)', borderRight: '1px solid var(--border)' }}
        >
          <nav className="p-4 flex flex-col gap-1.5 mt-2">
            {NAV.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
                  style={{
                    background: isActive ? 'var(--accent-light)' : 'transparent',
                    color: isActive ? 'var(--accent)' : 'var(--text2)',
                    border: isActive ? '1px solid var(--accent)' : '1px solid transparent',
                  }}
                >
                  <span style={{ color: isActive ? 'var(--accent)' : 'var(--text3)' }}>
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-8" style={{ background: 'var(--bg)' }}>
          {children}
        </main>
      </div>
    </div>
  );
}