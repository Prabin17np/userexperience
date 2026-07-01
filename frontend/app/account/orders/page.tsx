'use client';

import React, { useEffect } from 'react';
import { useOrderStore } from '@/store/useOrderStore';
import { OrderStatus } from '@/lib/api/orders';

const STATUS_COLORS: Record<OrderStatus, { bg: string; color: string }> = {
  'Order Placed':     { bg: '#EFF6FF', color: '#2563EB' },
  'Packing':          { bg: '#FFF7ED', color: '#C2410C' },
  'Shipped':          { bg: '#F0FDF4', color: '#15803D' },
  'Out for Delivery': { bg: '#FDF4FF', color: '#7E22CE' },
  'Delivered':        { bg: '#F0FDF4', color: '#166534' },
};

export default function MyOrdersPage() {
  const { orders, isLoading, fetchMyOrders } = useOrderStore();

  useEffect(() => {
    fetchMyOrders(1);
  }, []);

  return (
    <div>
      <h2 className="text-lg font-semibold text-[#111111] mb-6">My Orders</h2>

      {isLoading ? (
        <div className="border border-[#e5e5e5] rounded-md p-6 text-sm text-[#777777]">
          Loading your orders...
        </div>
      ) : orders.length === 0 ? (
        <div className="border border-[#e5e5e5] rounded-md p-6 text-sm text-[#777777]">
          You haven&apos;t placed any orders yet.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => {
            const sc = STATUS_COLORS[order.orderStatus];

            return (
              <div
                key={order._id}
                className="border border-[#e5e5e5] rounded-md p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                <div className="min-w-0">
                  {order.items.map((item, i) => (
                    <p key={i} className="text-sm font-semibold text-[#111111]">
                      {item.name} × {item.quantity}
                      <span className="font-normal text-[#777777] ml-1.5">
                        Size {item.size}
                      </span>
                    </p>
                  ))}
                  <p className="text-xs text-[#777777] mt-1">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-[#777777]">Order ID: {order._id}</p>
                </div>

                <div className="flex items-center gap-4 sm:flex-shrink-0">
                  <p className="text-base font-bold text-[#111111]">
                    ${order.totalAmount.toLocaleString()}
                  </p>
                  <span
                    className="text-xs font-semibold px-3 py-1.5 rounded-full"
                    style={{ background: sc.bg, color: sc.color }}
                  >
                    {order.orderStatus}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}