// Core Types for Anota-like System

export type UserRole = 'admin' | 'cashier' | 'kitchen' | 'waiter';

export type OrderStatus = 
  | 'received' 
  | 'preparing' 
  | 'ready' 
  | 'out_for_delivery' 
  | 'delivered' 
  | 'cancelled';

export type OrderType = 'counter' | 'table' | 'delivery' | 'whatsapp';

export type PaymentMethod = 'cash' | 'card' | 'pix' | 'online';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  establishmentId: string;
  avatar?: string;
  createdAt: string;
}

export interface Establishment {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  address: string;
  phone: string;
  whatsapp?: string;
  subscriptionPlan: 'free' | 'basic' | 'premium' | 'enterprise';
  trialEndsAt?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  order: number;
  active: boolean;
  establishmentId: string;
}

export interface ItemVariation {
  id: string;
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  variations?: ItemVariation[];
  available: boolean;
  preparationTime?: number; // minutes
  tags?: string[];
  establishmentId: string;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  menuItem: MenuItem;
  quantity: number;
  variationId?: string;
  variation?: ItemVariation;
  unitPrice: number;
  subtotal: number;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  establishmentId: string;
  type: OrderType;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  tableNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface DailySales {
  date: string;
  totalOrders: number;
  totalRevenue: number;
  averageTicket: number;
  topItems: {
    itemId: string;
    itemName: string;
    quantity: number;
    revenue: number;
  }[];
}

export interface KDSOrder {
  id: string;
  orderNumber: string;
  type: OrderType;
  tableNumber?: string;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: string;
  elapsedTime: number; // minutes
  priority: 'low' | 'medium' | 'high';
}

export interface Table {
  id: string;
  number: string;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved';
  currentOrderId?: string;
  qrCode: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderValue?: number;
  maxDiscount?: number;
  validFrom: string;
  validUntil: string;
  usageLimit?: number;
  usageCount: number;
  active: boolean;
}
