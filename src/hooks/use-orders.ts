'use client';

import { useState, useEffect } from 'react';
import { Order, OrderStatus } from '@/lib/types';
import { mockOrders } from '@/lib/mock-data';

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setOrders(mockOrders);
    setLoading(false);
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId
          ? { ...order, status, updatedAt: new Date().toISOString() }
          : order
      )
    );
  };

  const addOrder = (orderData: {
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    type: 'delivery' | 'table' | 'counter' | 'whatsapp';
    tableNumber: string;
    items: any[];
    subtotal: number;
    total: number;
  }) => {
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      orderNumber: `#${String(orders.length + 1).padStart(3, '0')}`,
      status: 'received',
      type: orderData.type,
      tableNumber: orderData.tableNumber || undefined,
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      customerAddress: orderData.customerAddress,
      items: orderData.items,
      subtotal: orderData.subtotal,
      discount: 0,
      deliveryFee: orderData.type === 'delivery' ? 5 : 0,
      total: orderData.total + (orderData.type === 'delivery' ? 5 : 0),
      paymentMethod: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setOrders(prev => [newOrder, ...prev]);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return {
    orders,
    loading,
    fetchOrders,
    updateOrderStatus,
    addOrder,
  };
}
