'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  ShoppingBag, 
  DollarSign, 
  Users,
  Clock,
  CheckCircle2,
  Package,
  AlertCircle
} from 'lucide-react';
import { useOrders } from '@/hooks/use-orders';
import { formatCurrency } from '@/lib/utils-anota';

export default function DashboardPage() {
  const { orders } = useOrders();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  // Cálculos de estatísticas
  const activeOrders = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled');
  const todayOrders = orders.filter(o => {
    const orderDate = new Date(o.createdAt);
    const today = new Date();
    return orderDate.toDateString() === today.toDateString();
  });
  
  const todayRevenue = todayOrders.reduce((sum, order) => sum + order.total, 0);
  const averageOrderValue = todayOrders.length > 0 ? todayRevenue / todayOrders.length : 0;

  const stats = [
    {
      name: 'Pedidos Ativos',
      value: activeOrders.length,
      icon: ShoppingBag,
      color: 'from-orange-500 to-amber-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
    },
    {
      name: 'Faturamento Hoje',
      value: formatCurrency(todayRevenue),
      icon: DollarSign,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      name: 'Pedidos Hoje',
      value: todayOrders.length,
      icon: TrendingUp,
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      name: 'Ticket Médio',
      value: formatCurrency(averageOrderValue),
      icon: Users,
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
  ];

  const recentOrders = orders.slice(0, 5);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'received':
        return { label: 'Recebido', icon: AlertCircle, color: 'text-yellow-600 bg-yellow-50' };
      case 'preparing':
        return { label: 'Preparando', icon: Clock, color: 'text-blue-600 bg-blue-50' };
      case 'ready':
        return { label: 'Pronto', icon: CheckCircle2, color: 'text-green-600 bg-green-50' };
      case 'out_for_delivery':
        return { label: 'Em Entrega', icon: Package, color: 'text-purple-600 bg-purple-50' };
      case 'delivered':
        return { label: 'Entregue', icon: CheckCircle2, color: 'text-gray-600 bg-gray-50' };
      default:
        return { label: status, icon: AlertCircle, color: 'text-gray-600 bg-gray-50' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Visão geral do seu negócio</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">{stat.name}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Pedidos Recentes</h2>
          <p className="text-sm text-gray-600 mt-1">Últimos pedidos do sistema</p>
        </div>
        <div className="divide-y divide-gray-100">
          {recentOrders.length === 0 ? (
            <div className="p-12 text-center">
              <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Nenhum pedido ainda</p>
            </div>
          ) : (
            recentOrders.map((order) => {
              const statusInfo = getStatusInfo(order.status);
              const StatusIcon = statusInfo.icon;
              
              return (
                <div key={order.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center text-white font-bold">
                        {order.orderNumber.replace('#', '')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900">{order.customerName || 'Cliente'}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 ${statusInfo.color}`}>
                            <StatusIcon className="w-3 h-3" />
                            {statusInfo.label}
                          </span>
                          <span className="text-xs text-gray-500">
                            {order.items.length} {order.items.length === 1 ? 'item' : 'itens'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">{formatCurrency(order.total)}</p>
                      <p className="text-xs text-gray-500" suppressHydrationWarning>
                        {new Date(order.createdAt).toLocaleTimeString('pt-BR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <a
          href="/dashboard/orders"
          className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl p-6 text-white hover:shadow-xl transition-all group"
        >
          <ShoppingBag className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="text-lg font-bold mb-1">Ver Pedidos</h3>
          <p className="text-sm text-white/80">Gerencie todos os pedidos</p>
        </a>
        
        <a
          href="/dashboard/products"
          className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white hover:shadow-xl transition-all group"
        >
          <Package className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="text-lg font-bold mb-1">Produtos</h3>
          <p className="text-sm text-white/80">Gerencie seu cardápio</p>
        </a>
        
        <a
          href="/dashboard/customers"
          className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white hover:shadow-xl transition-all group"
        >
          <Users className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="text-lg font-bold mb-1">Clientes</h3>
          <p className="text-sm text-white/80">Veja seus clientes</p>
        </a>
      </div>
    </div>
  );
}
