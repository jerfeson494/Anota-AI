'use client';

import { Users, UserPlus, Shield, Clock } from 'lucide-react';

export default function StaffPage() {
  const staff = [
    {
      id: '1',
      name: 'Admin User',
      email: 'admin@restaurant.com',
      role: 'admin',
      status: 'active',
      lastActive: '2 min atrás',
    },
    {
      id: '2',
      name: 'João Silva',
      email: 'joao@restaurant.com',
      role: 'waiter',
      status: 'active',
      lastActive: '5 min atrás',
    },
    {
      id: '3',
      name: 'Maria Santos',
      email: 'maria@restaurant.com',
      role: 'kitchen',
      status: 'active',
      lastActive: '1 min atrás',
    },
    {
      id: '4',
      name: 'Pedro Costa',
      email: 'pedro@restaurant.com',
      role: 'cashier',
      status: 'inactive',
      lastActive: '2 horas atrás',
    },
  ];

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      admin: 'Administrador',
      waiter: 'Garçom',
      kitchen: 'Cozinha',
      cashier: 'Caixa',
    };
    return labels[role] || role;
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      admin: 'from-purple-500 to-pink-600',
      waiter: 'from-blue-500 to-cyan-600',
      kitchen: 'from-orange-500 to-amber-600',
      cashier: 'from-green-500 to-emerald-600',
    };
    return colors[role] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Equipe</h1>
          <p className="text-gray-600">Gerencie usuários e permissões</p>
        </div>
        <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2">
          <UserPlus className="w-5 h-5" />
          Adicionar Membro
        </button>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mb-4">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{staff.length}</div>
          <div className="text-sm text-gray-600">Total de Membros</div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {staff.filter((s) => s.status === 'active').length}
          </div>
          <div className="text-sm text-gray-600">Ativos Agora</div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {staff.filter((s) => s.role === 'admin').length}
          </div>
          <div className="text-sm text-gray-600">Administradores</div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center mb-4">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {staff.filter((s) => s.role === 'waiter').length}
          </div>
          <div className="text-sm text-gray-600">Garçons</div>
        </div>
      </div>

      {/* Staff List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Membro</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Função</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Última Atividade
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {staff.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 bg-gradient-to-br ${getRoleColor(
                          member.role
                        )} rounded-full flex items-center justify-center text-white font-semibold`}
                      >
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{member.name}</div>
                        <div className="text-sm text-gray-600">{member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 bg-gradient-to-r ${getRoleColor(
                        member.role
                      )} text-white text-sm font-semibold rounded-full`}
                    >
                      {getRoleLabel(member.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          member.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                        }`}
                      />
                      <span
                        className={`text-sm font-semibold ${
                          member.status === 'active' ? 'text-green-600' : 'text-gray-600'
                        }`}
                      >
                        {member.status === 'active' ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{member.lastActive}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="px-4 py-2 text-sm text-orange-600 hover:bg-orange-50 rounded-lg font-semibold transition-colors">
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Roles Info */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-600 rounded-2xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-6">Funções e Permissões</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <Shield className="w-8 h-8 mb-3" />
            <h3 className="font-bold mb-2">Administrador</h3>
            <p className="text-sm opacity-90">Acesso total ao sistema</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <Users className="w-8 h-8 mb-3" />
            <h3 className="font-bold mb-2">Garçom</h3>
            <p className="text-sm opacity-90">Gerenciar pedidos e mesas</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <Users className="w-8 h-8 mb-3" />
            <h3 className="font-bold mb-2">Cozinha</h3>
            <p className="text-sm opacity-90">Visualizar e preparar pedidos</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <Users className="w-8 h-8 mb-3" />
            <h3 className="font-bold mb-2">Caixa</h3>
            <p className="text-sm opacity-90">Processar pagamentos</p>
          </div>
        </div>
      </div>
    </div>
  );
}
