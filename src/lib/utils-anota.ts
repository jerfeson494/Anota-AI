// Utility functions for Anota-like

import { OrderStatus, Order, KDSOrder } from './types';

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function formatTime(date: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function getOrderStatusLabel(status: OrderStatus): string {
  const labels: Record<OrderStatus, string> = {
    received: 'Recebido',
    preparing: 'Preparando',
    ready: 'Pronto',
    out_for_delivery: 'Saiu para entrega',
    delivered: 'Entregue',
    cancelled: 'Cancelado',
  };
  return labels[status];
}

export function getOrderStatusColor(status: OrderStatus): string {
  const colors: Record<OrderStatus, string> = {
    received: 'bg-blue-500',
    preparing: 'bg-yellow-500',
    ready: 'bg-green-500',
    out_for_delivery: 'bg-purple-500',
    delivered: 'bg-gray-500',
    cancelled: 'bg-red-500',
  };
  return colors[status];
}

export function calculateElapsedTime(createdAt: string): number {
  return Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000);
}

export function getOrderPriority(order: Order | KDSOrder): 'low' | 'medium' | 'high' {
  const elapsedTime = calculateElapsedTime(order.createdAt);
  
  if (order.type === 'delivery') return 'high';
  if (elapsedTime > 30) return 'high';
  if (elapsedTime > 15) return 'medium';
  return 'low';
}

export function getPriorityColor(priority: 'low' | 'medium' | 'high'): string {
  const colors = {
    low: 'border-green-500',
    medium: 'border-yellow-500',
    high: 'border-red-500',
  };
  return colors[priority];
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString().slice(-6);
  return `#${timestamp}`;
}

export function calculateOrderTotal(
  subtotal: number,
  discount: number = 0,
  deliveryFee: number = 0
): number {
  return subtotal - discount + deliveryFee;
}

export function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function validatePhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 11;
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  }
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
