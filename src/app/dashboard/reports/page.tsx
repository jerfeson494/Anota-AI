'use client';

import { useState } from 'react';
import { Calendar, TrendingUp, DollarSign, ShoppingCart, Download } from 'lucide-react';
import { mockDailySales } from '@/lib/mock-data';
import { formatCurrency, formatDate } from '@/lib/utils-anota';

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'custom'>('today');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Relatórios</h1>
          <p className="text-gray-600">Análise detalhada de vendas e desempenho</p>
        </div>
        <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2">
          <Download className="w-5 h-5" />
          Exportar Relatório
        </button>
      </div>

      {/* Date Range Selector */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-gray-600" />
          <span className="font-semibold text-gray-900">Período</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'today', label: 'Hoje' },
            { value: 'week', label: 'Esta Semana' },
            { value: 'month', label: 'Este Mês' },
            { value: 'custom', label: 'Personalizado' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setDateRange(option.value as any)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                dateRange === option.value
                  ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {formatCurrency(mockDailySales.totalRevenue)}
          </div>
          <div className="text-sm text-gray-600">Receita Total</div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {mockDailySales.totalOrders}
          </div>
          <div className="text-sm text-gray-600">Total de Pedidos</div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {formatCurrency(mockDailySales.averageTicket)}
          </div>
          <div className="text-sm text-gray-600">Ticket Médio</div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">28</div>
          <div className="text-sm text-gray-600">Dias Ativos</div>
        </div>
      </div>

      {/* Top Items */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Itens Mais Vendidos</h2>
        <div className="space-y-4">
          {mockDailySales.topItems.map((item, index) => {
            const percentage = (item.revenue / mockDailySales.totalRevenue) * 100;
            return (
              <div key={item.itemId}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{item.itemName}</div>
                      <div className="text-sm text-gray-600">{item.quantity} vendidos</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">{formatCurrency(item.revenue)}</div>
                    <div className="text-sm text-gray-600">{percentage.toFixed(1)}%</div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-amber-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sales Chart Placeholder */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Vendas ao Longo do Tempo</h2>
        <div className="h-64 flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl">
          <div className="text-center">
            <TrendingUp className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <p className="text-gray-600 font-semibold">Gráfico de vendas em desenvolvimento</p>
            <p className="text-sm text-gray-500 mt-2">
              Integração com biblioteca de gráficos será adicionada
            </p>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Métodos de Pagamento</h2>
          <div className="space-y-4">
            {[
              { method: 'Cartão de Crédito', amount: 1850.0, percentage: 57 },
              { method: 'PIX', amount: 980.5, percentage: 30 },
              { method: 'Dinheiro', amount: 320.0, percentage: 10 },
              { method: 'Cartão de Débito', amount: 100.0, percentage: 3 },
            ].map((payment) => (
              <div key={payment.method}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900">{payment.method}</span>
                  <span className="font-bold text-gray-900">{formatCurrency(payment.amount)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-amber-600 h-2 rounded-full"
                    style={{ width: `${payment.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Tipos de Pedido</h2>
          <div className="space-y-4">
            {[
              { type: 'Mesa', count: 25, percentage: 55 },
              { type: 'Delivery', count: 15, percentage: 33 },
              { type: 'Balcão', count: 5, percentage: 12 },
            ].map((orderType) => (
              <div key={orderType.type}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900">{orderType.type}</span>
                  <span className="font-bold text-gray-900">{orderType.count} pedidos</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-amber-600 h-2 rounded-full"
                    style={{ width: `${orderType.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
