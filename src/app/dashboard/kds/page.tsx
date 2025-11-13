'use client';

import { useState, useEffect } from 'react';
import { Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { mockKDSOrders } from '@/lib/mock-data';
import { KDSOrder, OrderStatus } from '@/lib/types';
import { getOrderStatusLabel, getPriorityColor, formatTime } from '@/lib/utils-anota';

export default function KDSPage() {
  const [orders, setOrders] = useState<KDSOrder[]>(mockKDSOrders);
  const [filter, setFilter] = useState<'all' | 'received' | 'preparing'>('all');

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setOrders((prev) =>
        prev.map((order) => ({
          ...order,
          elapsedTime: Math.floor((Date.now() - new Date(order.createdAt).getTime()) / 60000),
        }))
      );
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const filteredOrders = orders.filter((order) => {
    if (filter === 'all') return order.status !== 'delivered' && order.status !== 'cancelled';
    return order.status === filter;
  });

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status } : order))
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 -m-4 md:-m-6 lg:-m-8 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Kitchen Display System</h1>
            <p className="text-gray-400">Pedidos em tempo real para a cozinha</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-4 py-2 bg-green-500/20 text-green-400 rounded-xl font-semibold flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Sistema Online
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-3 rounded-xl font-bold text-lg whitespace-nowrap transition-all ${
              filter === 'all'
                ? 'bg-white text-gray-900'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Todos ({filteredOrders.length})
          </button>
          <button
            onClick={() => setFilter('received')}
            className={`px-6 py-3 rounded-xl font-bold text-lg whitespace-nowrap transition-all ${
              filter === 'received'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Recebidos ({orders.filter((o) => o.status === 'received').length})
          </button>
          <button
            onClick={() => setFilter('preparing')}
            className={`px-6 py-3 rounded-xl font-bold text-lg whitespace-nowrap transition-all ${
              filter === 'preparing'
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Preparando ({orders.filter((o) => o.status === 'preparing').length})
          </button>
        </div>
      </div>

      {/* Orders Grid */}
      {filteredOrders.length === 0 ? (
        <div className="bg-gray-800 rounded-3xl p-16 text-center">
          <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
          <h3 className="text-3xl font-bold text-white mb-4">Tudo pronto! 🎉</h3>
          <p className="text-xl text-gray-400">Nenhum pedido pendente no momento</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {filteredOrders.map((order) => {
            const priorityColor = getPriorityColor(order.priority);
            const isUrgent = order.elapsedTime > 20;

            return (
              <div
                key={order.id}
                className={`bg-gray-800 rounded-3xl p-6 border-4 ${priorityColor} ${
                  isUrgent ? 'animate-pulse' : ''
                } hover:scale-105 transition-transform`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="text-4xl font-black text-white mb-2">{order.orderNumber}</div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-gray-700 text-gray-300 text-sm font-bold rounded-lg capitalize">
                        {order.type === 'table' && `Mesa ${order.tableNumber}`}
                        {order.type === 'delivery' && 'Delivery'}
                        {order.type === 'counter' && 'Balcão'}
                      </span>
                      {order.priority === 'high' && (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                      <Clock className="w-5 h-5" />
                      <span className="text-sm font-semibold">{formatTime(order.createdAt)}</span>
                    </div>
                    <div
                      className={`text-3xl font-black ${
                        isUrgent ? 'text-red-500' : 'text-yellow-500'
                      }`}
                    >
                      {order.elapsedTime}'
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-3 mb-6">
                  {order.items.map((item) => (
                    <div key={item.id} className="bg-gray-900 rounded-2xl p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-orange-500 text-white rounded-xl flex items-center justify-center font-black text-xl flex-shrink-0">
                          {item.quantity}x
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xl font-bold text-white mb-1 break-words">
                            {item.menuItem.name}
                          </div>
                          {item.variation && (
                            <div className="text-base text-orange-400 font-semibold mb-1">
                              {item.variation.name}
                            </div>
                          )}
                          {item.notes && (
                            <div className="mt-2 p-2 bg-yellow-500/20 border-l-4 border-yellow-500 rounded">
                              <div className="text-xs text-yellow-400 font-bold mb-1">
                                OBSERVAÇÃO:
                              </div>
                              <div className="text-sm text-yellow-300 font-semibold break-words">
                                {item.notes}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  {order.status === 'received' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'preparing')}
                      className="w-full py-4 bg-yellow-500 hover:bg-yellow-600 text-white rounded-2xl font-black text-lg transition-colors"
                    >
                      INICIAR PREPARO
                    </button>
                  )}
                  {order.status === 'preparing' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'ready')}
                      className="w-full py-4 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-black text-lg transition-colors"
                    >
                      MARCAR COMO PRONTO
                    </button>
                  )}
                  {order.status === 'ready' && (
                    <div className="w-full py-4 bg-gray-700 text-gray-400 rounded-2xl font-black text-lg text-center">
                      AGUARDANDO RETIRADA
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
