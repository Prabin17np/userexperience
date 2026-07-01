'use client';

import React from 'react';
import Link from 'next/link';

export default function AccountOverviewPage() {
  return (
    <div>
      <h2 className="text-lg font-semibold text-[#111111] mb-6">Account Overview</h2>

      <div className="flex flex-col gap-4 max-w-md">
        <Link
          href="/account/orders"
          className="border border-[#e5e5e5] rounded-md p-5 hover:border-[#111111] transition-colors"
        >
          <p className="text-sm font-semibold text-[#111111] mb-1">My Orders</p>
          <p className="text-xs text-[#777777]">Track and review your past orders</p>
        </Link>

        <Link
          href="/account/addresses"
          className="border border-[#e5e5e5] rounded-md p-5 hover:border-[#111111] transition-colors"
        >
          <p className="text-sm font-semibold text-[#111111] mb-1">Addresses</p>
          <p className="text-xs text-[#777777]">Manage your saved shipping addresses</p>
        </Link>

        <Link
          href="/account/settings"
          className="border border-[#e5e5e5] rounded-md p-5 hover:border-[#111111] transition-colors"
        >
          <p className="text-sm font-semibold text-[#111111] mb-1">Account Settings</p>
          <p className="text-xs text-[#777777]">Update your name, email, or password</p>
        </Link>
      </div>
    </div>
  );
}