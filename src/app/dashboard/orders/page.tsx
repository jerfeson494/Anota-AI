'use client';

import { useState, useEffect } from 'react';
import { Filter, Search, Clock, MapPin, Phone, User, Package, CheckCircle2, XCircle, AlertCircle, Plus, Minus, ShoppingCart } from 'lucide-react';
import { useOrders } from '@/hooks/use-orders';
import { OrderStatus } from '@/lib/types';
import { 
  formatCurrency, 
  formatDateTime, 
  getOrderStatusLabel, 
  getOrderStatusColor,
  calculateElapsedTime 
} from '@/lib/utils-anota';

type OrderStage = 'analysis' | 'production' | 'ready';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  active: boolean;
}

interface CartItem {
  product: Product;
  quantity: number;
}

export default function OrdersPage() {
  const { orders, updateOrderStatus, addOrder } = useOrders();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [stageFilter, setStageFilter] = useState<OrderStage | 'all'>('all');
  const [mounted, setMounted] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Mock de produtos do cardápio (em produção, viria de um contexto ou API)
  const [menuProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'X-Burger Clássico',
      description: 'Hambúrguer artesanal, queijo, alface, tomate e molho especial',
      price: 25.90,
      category: 'Hambúrgueres',
      active: true,
    },
    {
      id: '2',
      name: 'X-Bacon',
      description: 'Hambúrguer, bacon crocante, queijo e molho barbecue',
      price: 29.90,
      category: 'Hambúrgueres',
      active: true,
    },
    {
      id: '3',
      name: 'Refrigerante Lata',
      description: 'Coca-Cola, Guaraná ou Fanta 350ml',
      price: 5.00,
      category: 'Bebidas',
      active: true,
    },
    {
      id: '4',
      name: 'Batata Frita',
      description: 'Porção de batata frita crocante',
      price: 12.00,
      category: 'Acompanhamentos',
      active: true,
    },
  ]);

  const categories = ['all', ...Array.from(new Set(menuProducts.map(p => p.category)))];

  const filteredMenuProducts = menuProducts.filter((product) => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesCategory && product.active;
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filtra pedidos que NÃO estão finalizados
  const activeOrders = orders.filter(order => order.status !== 'delivered');

  const getOrderStage = (status: OrderStatus): OrderStage | null => {
    if (status === 'received') return 'analysis';
    if (status === 'preparing') return 'production';
    if (status === 'ready' || status === 'out_for_delivery') return 'ready';
    return null;
  };

  const filteredOrders = activeOrders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const orderStage = getOrderStage(order.status);
    const matchesStage = stageFilter === 'all' || orderStage === stageFilter;
    return matchesSearch && matchesStatus && matchesStage;
  });

  const statusOptions: { value: OrderStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'Todos' },
    { value: 'received', label: 'Recebidos' },
    { value: 'preparing', label: 'Preparando' },
    { value: 'ready', label: 'Prontos' },
    { value: 'out_for_delivery', label: 'Em entrega' },
  ];

  const stageOptions: { value: OrderStage | 'all'; label: string; color: string }[] = [
    { value: 'all', label: 'Todas as Etapas', color: 'bg-gray-100 text-gray-700' },
    { value: 'analysis', label: 'Em Análise', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'production', label: 'Em Produção', color: 'bg-blue-100 text-blue-700' },
    { value: 'ready', label: 'Prontos para Entrega', color: 'bg-green-100 text-green-700' },
  ];

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'received':
        return <AlertCircle className="w-4 h-4" />;
      case 'preparing':
        return <Clock className="w-4 h-4" />;
      case 'ready':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'out_for_delivery':
        return <Package className="w-4 h-4" />;
      case 'delivered':
        return <CheckCircle2 className="w-4 h-4" />;
      default:
        return <XCircle className="w-4 h-4" />;
    }
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === productId);
      if (existing && existing.quantity > 1) {
        return prev.map(item =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return prev.filter(item => item.product.id !== productId);
    });
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const handleAddOrder = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (cart.length === 0) {
      alert('Adicione pelo menos um item ao pedido!');
      return;
    }

    const newOrder = {
      customerName: formData.get('customerName') as string,
      customerPhone: formData.get('customerPhone') as string,
      customerAddress: formData.get('customerAddress') as string,
      type: formData.get('type') as 'delivery' | 'table' | 'counter' | 'whatsapp',
      tableNumber: formData.get('tableNumber') as string,
      items: cart.map(item => ({
        menuItem: {
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
        },
        quantity: item.quantity,
        subtotal: item.product.price * item.quantity,
      })),
      subtotal: getCartTotal(),
      total: getCartTotal(),
    };

    addOrder(newOrder);
    setShowAddModal(false);
    setCart([]);
    e.currentTarget.reset();
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pedidos</h1>
          <p className="text-gray-600">Gerencie todos os pedidos em tempo real</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-orange-500 to-amber-600 text-white px-6 py-3 rounded-xl font-bold text-2xl shadow-lg">
            {filteredOrders.length}
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Novo Pedido
          </button>
        </div>
      </div>

      {/* Stage Filters (Funil) */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-wrap gap-2">
          {stageOptions.map((stage) => (
            <button
              key={stage.value}
              onClick={() => setStageFilter(stage.value)}
              className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                stageFilter === stage.value
                  ? stage.color + ' shadow-md scale-105'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {stage.label}
              {stage.value !== 'all' && (
                <span className="ml-2 px-2 py-0.5 bg-white/50 rounded-full text-xs">
                  {activeOrders.filter(o => getOrderStage(o.status) === stage.value).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por número ou cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
              className="pl-12 pr-8 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white appearance-none text-sm font-medium"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredOrders.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum pedido encontrado</h3>
            <p className="text-gray-600">Tente ajustar os filtros de busca</p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const elapsedTime = calculateElapsedTime(order.createdAt);
            const orderStage = getOrderStage(order.status);
            const stageInfo = stageOptions.find(s => s.value === orderStage);
            
            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all overflow-hidden"
              >
                {/* Card Header */}
                <div className={`${getOrderStatusColor(order.status)} p-4`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white font-bold">
                        {order.orderNumber.replace('#', '')}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{order.orderNumber}</h3>
                        <div className="flex items-center gap-1 text-white/90 text-xs">
                          <Clock className="w-3 h-3" />
                          <span suppressHydrationWarning>{elapsedTime} min</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">
                        {formatCurrency(order.total)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full flex items-center gap-1">
                      {getStatusIcon(order.status)}
                      {getOrderStatusLabel(order.status)}
                    </span>
                    {stageInfo && (
                      <span className={`px-3 py-1 ${stageInfo.color} text-xs font-semibold rounded-full`}>
                        {stageInfo.label}
                      </span>
                    )}
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full capitalize">
                      {order.type === 'table' && `Mesa ${order.tableNumber}`}
                      {order.type === 'delivery' && 'Delivery'}
                      {order.type === 'counter' && 'Balcão'}
                      {order.type === 'whatsapp' && 'WhatsApp'}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-3">
                  {/* Customer Info */}
                  <div className="space-y-2">
                    {order.customerName && (
                      <div className="flex items-center gap-2 text-sm">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">{order.customerName}</span>
                      </div>
                    )}
                    {order.customerPhone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">{order.customerPhone}</span>
                      </div>
                    )}
                    {order.customerAddress && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700 line-clamp-1">{order.customerAddress}</span>
                      </div>
                    )}
                  </div>

                  {/* Items Summary */}
                  <div className="border-t border-gray-100 pt-3">
                    <div className="text-xs text-gray-500 mb-2 font-medium">ITENS DO PEDIDO</div>
                    <div className="space-y-1.5">
                      {order.items.slice(0, 3).map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between text-sm"
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <span className="w-6 h-6 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0">
                              {item.quantity}x
                            </span>
                            <span className="font-medium text-gray-900 truncate">
                              {item.menuItem.name}
                            </span>
                          </div>
                          <span className="font-bold text-gray-900 text-xs ml-2">
                            {formatCurrency(item.subtotal)}
                          </span>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="text-xs text-gray-500 italic">
                          +{order.items.length - 3} {order.items.length - 3 === 1 ? 'item' : 'itens'}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Total Breakdown */}
                  <div className="border-t border-gray-100 pt-3 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(order.subtotal)}
                      </span>
                    </div>
                    {order.discount > 0 && (
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Desconto</span>
                        <span className="font-semibold text-green-600">
                          -{formatCurrency(order.discount)}
                        </span>
                      </div>
                    )}
                    {order.deliveryFee > 0 && (
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Taxa de entrega</span>
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(order.deliveryFee)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="border-t border-gray-100 pt-3 grid grid-cols-2 gap-2">
                    {order.status === 'received' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'preparing')}
                        className="col-span-2 px-4 py-2.5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold text-sm"
                      >
                        Iniciar Preparo
                      </button>
                    )}
                    {order.status === 'preparing' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'ready')}
                        className="col-span-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold text-sm"
                      >
                        Marcar como Pronto
                      </button>
                    )}
                    {order.status === 'ready' && order.type === 'delivery' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'out_for_delivery')}
                        className="col-span-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold text-sm"
                      >
                        Saiu para Entrega
                      </button>
                    )}
                    {((order.status === 'ready' && order.type !== 'delivery') || 
                      (order.status === 'out_for_delivery')) && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'delivered')}
                        className="col-span-2 px-4 py-2.5 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-xl hover:shadow-lg transition-all font-semibold text-sm"
                      >
                        Finalizar Pedido
                      </button>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
                  <div className="text-xs text-gray-500 text-center" suppressHydrationWarning>
                    {formatDateTime(order.createdAt)}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Order Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900">Novo Pedido</h2>
              <p className="text-gray-600 text-sm mt-1">Selecione os itens do cardápio e preencha os dados do cliente</p>
            </div>
            
            <form onSubmit={handleAddOrder} className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Cardápio */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Cardápio
                  </h3>

                  {/* Category Filter */}
                  <div className="flex gap-2 flex-wrap">
                    {categories.map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => setSelectedCategory(category)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                          selectedCategory === category
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {category === 'all' ? 'Todos' : category}
                      </button>
                    ))}
                  </div>

                  {/* Products List */}
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {filteredMenuProducts.map((product) => {
                      const cartItem = cart.find(item => item.product.id === product.id);
                      const quantity = cartItem?.quantity || 0;

                      return (
                        <div
                          key={product.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 text-sm">{product.name}</h4>
                            <p className="text-xs text-gray-600 truncate">{product.description}</p>
                            <p className="text-sm font-bold text-orange-600 mt-1">
                              R$ {product.price.toFixed(2)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 ml-3">
                            {quantity > 0 ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => removeFromCart(product.id)}
                                  className="w-8 h-8 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-8 text-center font-bold text-gray-900">
                                  {quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => addToCart(product)}
                                  className="w-8 h-8 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                onClick={() => addToCart(product)}
                                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-semibold"
                              >
                                Adicionar
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Cart Summary */}
                  {cart.length > 0 && (
                    <div className="bg-orange-50 rounded-xl p-4 border-2 border-orange-200">
                      <h4 className="font-bold text-gray-900 mb-2">Resumo do Pedido</h4>
                      <div className="space-y-1 mb-3">
                        {cart.map((item) => (
                          <div key={item.product.id} className="flex justify-between text-sm">
                            <span className="text-gray-700">
                              {item.quantity}x {item.product.name}
                            </span>
                            <span className="font-semibold text-gray-900">
                              R$ {(item.product.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-orange-200 pt-2 flex justify-between">
                        <span className="font-bold text-gray-900">Total:</span>
                        <span className="font-bold text-orange-600 text-lg">
                          R$ {getCartTotal().toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Dados do Cliente */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900">Dados do Cliente</h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome do Cliente *
                    </label>
                    <input
                      type="text"
                      name="customerName"
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Digite o nome"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      name="customerPhone"
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="(00) 00000-0000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Pedido *
                    </label>
                    <select
                      name="type"
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="counter">Balcão</option>
                      <option value="table">Mesa</option>
                      <option value="delivery">Delivery</option>
                      <option value="whatsapp">WhatsApp</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número da Mesa (se aplicável)
                    </label>
                    <input
                      type="text"
                      name="tableNumber"
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Ex: 5"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Endereço (se delivery)
                    </label>
                    <textarea
                      name="customerAddress"
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Rua, número, bairro..."
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-6 border-t border-gray-100 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setCart([]);
                  }}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={cart.length === 0}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Criar Pedido ({cart.length} {cart.length === 1 ? 'item' : 'itens'})
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
