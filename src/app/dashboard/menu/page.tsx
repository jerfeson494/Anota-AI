'use client';

import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { useMenu } from '@/hooks/use-menu';
import { formatCurrency } from '@/lib/utils-anota';
import { MenuItemDialog } from '@/components/menu/menu-item-dialog';
import { MenuItem } from '@/lib/types';

export default function MenuPage() {
  const { items, categories, loading, addMenuItem, updateMenuItem, deleteMenuItem } = useMenu();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddItem = () => {
    setEditingItem(null);
    setIsDialogOpen(true);
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleSaveItem = (itemData: Omit<MenuItem, 'id' | 'establishmentId'>) => {
    if (editingItem) {
      updateMenuItem(editingItem.id, itemData);
    } else {
      addMenuItem(itemData);
    }
  };

  const handleToggleAvailability = (item: MenuItem) => {
    updateMenuItem(item.id, { available: !item.available });
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este item?')) {
      deleteMenuItem(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Cardápio</h1>
          <p className="text-gray-600">Gerencie categorias e itens do seu menu</p>
        </div>
        <button
          onClick={handleAddItem}
          className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Novo Item
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar itens..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
          >
            <option value="all">Todas as categorias</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Categories Quick Access */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-colors ${
            selectedCategory === 'all'
              ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          Todos ({items.length})
        </button>
        {categories.map((category) => {
          const count = items.filter((item) => item.categoryId === category.id).length;
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {category.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Items Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
          <div className="text-gray-400 mb-4">
            <Search className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum item encontrado</h3>
          <p className="text-gray-600">Tente ajustar os filtros ou adicione novos itens ao cardápio</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => {
            const category = categories.find((c) => c.id === item.categoryId);
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-shadow group"
              >
                {/* Image Placeholder */}
                <div className="h-48 bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center relative">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-6xl">🍽️</div>
                  )}
                  {!item.available && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold">
                        Indisponível
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{item.name}</h3>
                      <p className="text-xs text-gray-500">{category?.name}</p>
                    </div>
                    <button
                      onClick={() => handleToggleAvailability(item)}
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                      title={item.available ? 'Marcar como indisponível' : 'Marcar como disponível'}
                    >
                      {item.available ? (
                        <Eye className="w-4 h-4 text-green-600" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>

                  {item.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                  )}

                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl font-bold text-orange-600">
                      {formatCurrency(item.price)}
                    </div>
                    {item.preparationTime && (
                      <div className="text-xs text-gray-500">{item.preparationTime} min</div>
                    )}
                  </div>

                  {item.variations && item.variations.length > 0 && (
                    <div className="mb-4 pb-4 border-b border-gray-100">
                      <div className="text-xs text-gray-500 mb-1">Variações disponíveis:</div>
                      <div className="flex flex-wrap gap-1">
                        {item.variations.slice(0, 3).map((variation) => (
                          <span
                            key={variation.id}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg"
                          >
                            {variation.name}
                          </span>
                        ))}
                        {item.variations.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg">
                            +{item.variations.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditItem(item)}
                      className="flex-1 px-4 py-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors font-semibold text-sm flex items-center justify-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Dialog */}
      <MenuItemDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveItem}
        categories={categories}
        editItem={editingItem}
      />
    </div>
  );
}
