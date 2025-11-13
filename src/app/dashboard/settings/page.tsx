'use client';

import { useState, useEffect } from 'react';
import { 
  Store, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Bell,
  CreditCard,
  Save
} from 'lucide-react';

export default function SettingsPage() {
  const [mounted, setMounted] = useState(false);
  const [settings, setSettings] = useState({
    restaurantName: 'Meu Restaurante',
    phone: '(11) 98765-4321',
    email: 'contato@restaurante.com',
    address: 'Rua Principal, 123 - Centro',
    openingTime: '11:00',
    closingTime: '23:00',
    deliveryFee5km: '5.00',
    deliveryFee10km: '10.00',
    deliveryFee15km: '15.00',
    deliveryFee20km: '20.00',
    minimumOrder: '20.00',
    acceptPix: true,
    acceptCard: true,
    acceptCash: true,
    notifyNewOrders: true,
    notifyStatusChange: true,
  });

  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você implementaria a lógica de salvar no backend
    console.log('Configurações salvas:', settings);
    setSaveMessage('Configurações salvas com sucesso!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleChange = (field: string, value: any) => {
    setSettings({ ...settings, [field]: value });
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Configurações</h1>
        <p className="text-gray-600">Gerencie as configurações do seu estabelecimento</p>
      </div>

      {/* Success Message */}
      {saveMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl">
          {saveMessage}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Restaurant Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-amber-600 p-6">
            <div className="flex items-center gap-3 text-white">
              <Store className="w-6 h-6" />
              <h2 className="text-xl font-bold">Informações do Estabelecimento</h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Restaurante
              </label>
              <input
                type="text"
                value={settings.restaurantName}
                onChange={(e) => handleChange('restaurantName', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Telefone
                </label>
                <input
                  type="tel"
                  value={settings.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Email
                </label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Endereço
              </label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Horário de Abertura
                </label>
                <input
                  type="time"
                  value={settings.openingTime}
                  onChange={(e) => handleChange('openingTime', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Horário de Fechamento
                </label>
                <input
                  type="time"
                  value={settings.closingTime}
                  onChange={(e) => handleChange('closingTime', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Settings */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-6">
            <div className="flex items-center gap-3 text-white">
              <MapPin className="w-6 h-6" />
              <h2 className="text-xl font-bold">Configurações de Entrega</h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pedido Mínimo (R$)
              </label>
              <input
                type="number"
                step="0.01"
                value={settings.minimumOrder}
                onChange={(e) => handleChange('minimumOrder', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="border-t border-gray-200 pt-4 mt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Taxa de Entrega por Raio de Distância
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Até 5km (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={settings.deliveryFee5km}
                    onChange={(e) => handleChange('deliveryFee5km', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="5.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Até 10km (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={settings.deliveryFee10km}
                    onChange={(e) => handleChange('deliveryFee10km', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="10.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Até 15km (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={settings.deliveryFee15km}
                    onChange={(e) => handleChange('deliveryFee15km', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="15.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Até 20km (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={settings.deliveryFee20km}
                    onChange={(e) => handleChange('deliveryFee20km', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="20.00"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6">
            <div className="flex items-center gap-3 text-white">
              <CreditCard className="w-6 h-6" />
              <h2 className="text-xl font-bold">Formas de Pagamento</h2>
            </div>
          </div>
          <div className="p-6 space-y-3">
            <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={settings.acceptPix}
                onChange={(e) => handleChange('acceptPix', e.target.checked)}
                className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
              />
              <span className="font-medium text-gray-900">Aceitar PIX</span>
            </label>

            <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={settings.acceptCard}
                onChange={(e) => handleChange('acceptCard', e.target.checked)}
                className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
              />
              <span className="font-medium text-gray-900">Aceitar Cartão</span>
            </label>

            <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={settings.acceptCash}
                onChange={(e) => handleChange('acceptCash', e.target.checked)}
                className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
              />
              <span className="font-medium text-gray-900">Aceitar Dinheiro</span>
            </label>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-600 p-6">
            <div className="flex items-center gap-3 text-white">
              <Bell className="w-6 h-6" />
              <h2 className="text-xl font-bold">Notificações</h2>
            </div>
          </div>
          <div className="p-6 space-y-3">
            <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={settings.notifyNewOrders}
                onChange={(e) => handleChange('notifyNewOrders', e.target.checked)}
                className="w-5 h-5 text-orange-600 rounded focus:ring-2 focus:ring-orange-500"
              />
              <span className="font-medium text-gray-900">Notificar novos pedidos</span>
            </label>

            <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={settings.notifyStatusChange}
                onChange={(e) => handleChange('notifyStatusChange', e.target.checked)}
                className="w-5 h-5 text-orange-600 rounded focus:ring-2 focus:ring-orange-500"
              />
              <span className="font-medium text-gray-900">Notificar mudanças de status</span>
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            Salvar Alterações
          </button>
        </div>
      </form>
    </div>
  );
}
