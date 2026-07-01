'use client';

import { useState, useEffect } from 'react';
import { useOrderStore } from '@/store/useOrderStore';
import { OrderStatus } from '@/lib/api/orders';
import toast from 'react-hot-toast';

const STATUS_OPTIONS: OrderStatus[] = [
  'Order Placed', 'Packing', 'Shipped', 'Out for Delivery', 'Delivered',
];

const STATUS_COLORS: Record<OrderStatus, { bg: string; color: string }> = {
  'Order Placed':     { bg: '#EFF6FF', color: '#2563EB' },
  'Packing':          { bg: '#FFF7ED', color: '#C2410C' },
  'Shipped':          { bg: '#F0FDF4', color: '#15803D' },
  'Out for Delivery': { bg: '#FDF4FF', color: '#7E22CE' },
  'Delivered':        { bg: '#F0FDF4', color: '#166534' },
};

const PackageIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

export default function OrdersPage() {
  const { orders, total, isLoading, fetchAllOrders, updateOrderStatus } = useOrderStore();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | OrderStatus>('All');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchAllOrders(1);
  }, []);

  const filtered = orders.filter((o) => {
    const user = typeof o.user === 'object' ? o.user : null;
    const customerName = user ? user.name : '';
    const matchSearch =
      customerName.toLowerCase().includes(search.toLowerCase()) ||
      o._id.toLowerCase().includes(search.toLowerCase()) ||
      o.items.some((i) => i.name.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = filterStatus === 'All' || o.orderStatus === filterStatus;
    return matchSearch && matchStatus;
  });

  async function handleStatusChange(id: string, status: OrderStatus) {
    setUpdatingId(id);
    try {
      await updateOrderStatus(id, status);
      toast.success('Order status updated');
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
        <h1 className="font-['Playfair_Display'] text-2xl font-bold" style={{ color: 'var(--text)' }}>
          Orders
        </h1>
        <span className="text-sm" style={{ color: 'var(--text3)' }}>
          {total} total orders
        </span>
      </div>

      {/* Search + filter */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          className="px-4 py-2.5 rounded-xl text-sm outline-none flex-1 min-w-[200px]"
          style={{ background: 'var(--surface)', border: '1.5px solid var(--border2)', color: 'var(--text)' }}
          placeholder="Search by order ID, customer, or product…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="px-4 py-2.5 rounded-xl text-sm outline-none"
          style={{ background: 'var(--surface)', border: '1.5px solid var(--border2)', color: 'var(--text)', fontFamily: 'inherit' }}
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as 'All' | OrderStatus)}
        >
          <option value="All">All Statuses</option>
          {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Order cards */}
      <div className="flex flex-col gap-4">
        {isLoading ? (
          <div className="py-16 text-center text-sm rounded-2xl"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text3)' }}>
            Loading orders...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-sm rounded-2xl"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text3)' }}>
            No orders found
          </div>
        ) : (
          filtered.map((order) => {
            const sc = STATUS_COLORS[order.orderStatus];
            const user = typeof order.user === 'object' ? order.user : null;
            const addr = order.shippingAddress;

            return (
              <div
                key={order._id}
                className="rounded-2xl p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-[56px_1fr_180px_90px_180px] gap-4 sm:gap-5 items-center transition-shadow duration-200 hover:shadow-md"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
              >
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--surface2)', color: 'var(--text2)' }}>
                  <PackageIcon />
                </div>

                {/* Items + customer */}
                <div className="min-w-0">
                  <div className="flex flex-col gap-0.5 mb-2">
                    {order.items.map((item, i) => (
                      <p key={i} className="text-sm font-bold" style={{ color: 'var(--text)' }}>
                        {item.name} × {item.quantity}
                        <span className="font-normal ml-1.5" style={{ color: 'var(--text3)' }}>
                          Size {item.size}
                        </span>
                      </p>
                    ))}
                  </div>
                  {user && (
                    <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{user.name}</p>
                  )}
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text3)' }}>{addr.addressLine1}</p>
                  <p className="text-xs" style={{ color: 'var(--text3)' }}>
                    {addr.city}, {addr.state}, {addr.postalCode}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text3)' }}>{addr.phone}</p>
                </div>

                {/* Meta */}
                <div className="flex flex-col gap-1 text-xs" style={{ color: 'var(--text2)' }}>
                  <span>Items: {order.items.length}</span>
                  <span>Method: {order.paymentMethod}</span>
                  <span>
                    Payment:{' '}
                    <span style={{
                      color: order.paymentStatus === 'Paid'
                        ? 'var(--success)'
                        : order.paymentStatus === 'Failed'
                        ? 'var(--danger)'
                        : 'var(--accent)',
                      fontWeight: 600,
                    }}>
                      {order.paymentStatus}
                    </span>
                  </span>
                  <span>Date: {new Date(order.createdAt).toLocaleDateString()}</span>
                </div>

                {/* Amount */}
                <p className="font-['Playfair_Display'] text-lg font-bold" style={{ color: 'var(--text)' }}>
                  ${order.totalAmount.toLocaleString()}
                </p>

                {/* Status dropdown */}
                <select
                  value={order.orderStatus}
                  onChange={(e) => handleStatusChange(order._id, e.target.value as OrderStatus)}
                  disabled={updatingId === order._id}
                  className="px-3 py-2.5 rounded-xl text-sm font-semibold outline-none cursor-pointer transition-all duration-200 border-[1.5px] w-full disabled:opacity-60"
                  style={{
                    background: sc.bg,
                    color: sc.color,
                    borderColor: sc.color + '40',
                    fontFamily: 'inherit',
                  }}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s} style={{ background: '#fff', color: '#111' }}>{s}</option>
                  ))}
                </select>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}