// Mock data for development - Replace with real API calls

import { 
  User, 
  Establishment, 
  Category, 
  MenuItem, 
  Order, 
  DailySales,
  KDSOrder,
  Table 
} from './types';

export const mockUser: User = {
  id: '1',
  name: 'Admin User',
  email: 'admin@restaurant.com',
  role: 'admin',
  establishmentId: '1',
  createdAt: new Date().toISOString(),
};

export const mockEstablishment: Establishment = {
  id: '1',
  name: 'Restaurante Exemplo',
  slug: 'restaurante-exemplo',
  address: 'Rua Exemplo, 123 - Centro',
  phone: '(11) 98765-4321',
  whatsapp: '5511987654321',
  subscriptionPlan: 'premium',
  createdAt: new Date().toISOString(),
};

export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Entradas',
    description: 'Aperitivos e entradas',
    order: 1,
    active: true,
    establishmentId: '1',
  },
  {
    id: '2',
    name: 'Pratos Principais',
    description: 'Pratos principais',
    order: 2,
    active: true,
    establishmentId: '1',
  },
  {
    id: '3',
    name: 'Bebidas',
    description: 'Bebidas e sucos',
    order: 3,
    active: true,
    establishmentId: '1',
  },
  {
    id: '4',
    name: 'Sobremesas',
    description: 'Doces e sobremesas',
    order: 4,
    active: true,
    establishmentId: '1',
  },
];

export const mockMenuItems: MenuItem[] = [
  {
    id: '1',
    categoryId: '1',
    name: 'Bruschetta',
    description: 'Pão italiano com tomate, manjericão e azeite',
    price: 18.90,
    available: true,
    preparationTime: 10,
    tags: ['vegetariano'],
    establishmentId: '1',
  },
  {
    id: '2',
    categoryId: '2',
    name: 'Filé Mignon',
    description: 'Filé mignon grelhado com batatas rústicas',
    price: 65.00,
    available: true,
    preparationTime: 25,
    variations: [
      { id: 'v1', name: 'Ao ponto', price: 65.00 },
      { id: 'v2', name: 'Bem passado', price: 65.00 },
      { id: 'v3', name: 'Mal passado', price: 65.00 },
    ],
    establishmentId: '1',
  },
  {
    id: '3',
    categoryId: '3',
    name: 'Suco Natural',
    description: 'Suco natural de frutas',
    price: 12.00,
    available: true,
    preparationTime: 5,
    variations: [
      { id: 'v4', name: 'Laranja', price: 12.00 },
      { id: 'v5', name: 'Limão', price: 12.00 },
      { id: 'v6', name: 'Morango', price: 14.00 },
    ],
    establishmentId: '1',
  },
];

export const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: '#001',
    establishmentId: '1',
    type: 'table',
    status: 'preparing',
    items: [
      {
        id: 'oi1',
        menuItemId: '1',
        menuItem: mockMenuItems[0],
        quantity: 2,
        unitPrice: 18.90,
        subtotal: 37.80,
      },
      {
        id: 'oi2',
        menuItemId: '2',
        menuItem: mockMenuItems[1],
        quantity: 1,
        variationId: 'v1',
        variation: { id: 'v1', name: 'Ao ponto', price: 65.00 },
        unitPrice: 65.00,
        subtotal: 65.00,
      },
    ],
    subtotal: 102.80,
    discount: 0,
    deliveryFee: 0,
    total: 102.80,
    paymentMethod: 'card',
    paymentStatus: 'pending',
    customerName: 'João Silva',
    tableNumber: '5',
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    orderNumber: '#002',
    establishmentId: '1',
    type: 'delivery',
    status: 'received',
    items: [
      {
        id: 'oi3',
        menuItemId: '3',
        menuItem: mockMenuItems[2],
        quantity: 2,
        variationId: 'v4',
        variation: { id: 'v4', name: 'Laranja', price: 12.00 },
        unitPrice: 12.00,
        subtotal: 24.00,
      },
    ],
    subtotal: 24.00,
    discount: 0,
    deliveryFee: 8.00,
    total: 32.00,
    paymentMethod: 'cash',
    paymentStatus: 'pending',
    customerName: 'Maria Santos',
    customerPhone: '(11) 91234-5678',
    customerAddress: 'Rua das Flores, 456 - Jardim',
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const mockDailySales: DailySales = {
  date: new Date().toISOString().split('T')[0],
  totalOrders: 45,
  totalRevenue: 3250.50,
  averageTicket: 72.23,
  topItems: [
    {
      itemId: '2',
      itemName: 'Filé Mignon',
      quantity: 18,
      revenue: 1170.00,
    },
    {
      itemId: '1',
      itemName: 'Bruschetta',
      quantity: 25,
      revenue: 472.50,
    },
    {
      itemId: '3',
      itemName: 'Suco Natural',
      quantity: 32,
      revenue: 384.00,
    },
  ],
};

export const mockKDSOrders: KDSOrder[] = mockOrders.map(order => ({
  id: order.id,
  orderNumber: order.orderNumber,
  type: order.type,
  tableNumber: order.tableNumber,
  items: order.items,
  status: order.status,
  createdAt: order.createdAt,
  elapsedTime: Math.floor((Date.now() - new Date(order.createdAt).getTime()) / 60000),
  priority: order.type === 'delivery' ? 'high' : 'medium',
}));

export const mockTables: Table[] = Array.from({ length: 12 }, (_, i) => ({
  id: `table-${i + 1}`,
  number: `${i + 1}`,
  capacity: i % 3 === 0 ? 6 : i % 2 === 0 ? 4 : 2,
  status: i < 3 ? 'occupied' : i < 5 ? 'reserved' : 'available',
  currentOrderId: i < 3 ? mockOrders[0].id : undefined,
  qrCode: `https://restaurant.com/menu/table/${i + 1}`,
}));
