'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Plus, Trash2, Upload, Image as ImageIcon } from 'lucide-react';
import { MenuItem, Category, ItemVariation } from '@/lib/types';

interface MenuItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Omit<MenuItem, 'id' | 'establishmentId'>) => void;
  categories: Category[];
  editItem?: MenuItem | null;
}

export function MenuItemDialog({ isOpen, onClose, onSave, categories, editItem }: MenuItemDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    image: '',
    preparationTime: '',
    available: true,
    tags: [] as string[],
  });

  const [variations, setVariations] = useState<ItemVariation[]>([]);
  const [newVariation, setNewVariation] = useState({ name: '', price: '' });
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('file');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editItem) {
      setFormData({
        name: editItem.name,
        description: editItem.description || '',
        price: editItem.price.toString(),
        categoryId: editItem.categoryId,
        image: editItem.image || '',
        preparationTime: editItem.preparationTime?.toString() || '',
        available: editItem.available,
        tags: editItem.tags || [],
      });
      setVariations(editItem.variations || []);
      setImagePreview(editItem.image || '');
    } else {
      resetForm();
    }
  }, [editItem, isOpen]);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      categoryId: categories[0]?.id || '',
      image: '',
      preparationTime: '',
      available: true,
      tags: [],
    });
    setVariations([]);
    setNewVariation({ name: '', price: '' });
    setImagePreview('');
    setUploadMethod('file');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas arquivos de imagem');
        return;
      }

      // Validar tamanho (máx 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 5MB');
        return;
      }

      // Criar preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setFormData({ ...formData, image: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (url: string) => {
    setFormData({ ...formData, image: url });
    setImagePreview(url);
  };

  const removeImage = () => {
    setImagePreview('');
    setFormData({ ...formData, image: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const item: Omit<MenuItem, 'id' | 'establishmentId'> = {
      name: formData.name,
      description: formData.description || undefined,
      price: parseFloat(formData.price),
      categoryId: formData.categoryId,
      image: formData.image || undefined,
      preparationTime: formData.preparationTime ? parseInt(formData.preparationTime) : undefined,
      available: formData.available,
      tags: formData.tags.length > 0 ? formData.tags : undefined,
      variations: variations.length > 0 ? variations : undefined,
    };

    onSave(item);
    resetForm();
    onClose();
  };

  const addVariation = () => {
    if (newVariation.name && newVariation.price) {
      setVariations([
        ...variations,
        {
          id: `var-${Date.now()}`,
          name: newVariation.name,
          price: parseFloat(newVariation.price),
        },
      ]);
      setNewVariation({ name: '', price: '' });
    }
  };

  const removeVariation = (id: string) => {
    setVariations(variations.filter((v) => v.id !== id));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {editItem ? 'Editar Item' : 'Novo Item'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nome do Item *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Ex: Pizza Margherita"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Descrição
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Descreva o item..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Preço (R$) *
                </label>
                <input
                  type="number"
                  required
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="0,00"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Categoria *
                </label>
                <select
                  required
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tempo de Preparo (min)
              </label>
              <input
                type="number"
                min="0"
                value={formData.preparationTime}
                onChange={(e) => setFormData({ ...formData, preparationTime: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="15"
              />
            </div>

            {/* Image Upload Section */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Imagem do Item
              </label>
              
              {/* Upload Method Toggle */}
              <div className="flex gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setUploadMethod('file')}
                  className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
                    uploadMethod === 'file'
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Upload className="w-4 h-4 inline mr-2" />
                  Upload de Arquivo
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMethod('url')}
                  className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
                    uploadMethod === 'url'
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <ImageIcon className="w-4 h-4 inline mr-2" />
                  URL da Imagem
                </button>
              </div>

              {/* File Upload */}
              {uploadMethod === 'file' && (
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-colors"
                  >
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600 font-semibold">
                      Clique para fazer upload
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      PNG, JPG ou WEBP (máx. 5MB)
                    </span>
                  </label>
                </div>
              )}

              {/* URL Input */}
              {uploadMethod === 'url' && (
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              )}

              {/* Image Preview */}
              {imagePreview && (
                <div className="mt-4 relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="available"
                checked={formData.available}
                onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
              />
              <label htmlFor="available" className="text-sm font-semibold text-gray-700">
                Item disponível para venda
              </label>
            </div>
          </div>

          {/* Variations */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Variações (Opcional)</h3>
            
            {variations.length > 0 && (
              <div className="space-y-2 mb-4">
                {variations.map((variation) => (
                  <div
                    key={variation.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <span className="font-semibold text-gray-900">{variation.name}</span>
                      <span className="text-gray-600 ml-2">
                        + R$ {variation.price.toFixed(2)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeVariation(variation.id)}
                      className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="text"
                value={newVariation.name}
                onChange={(e) => setNewVariation({ ...newVariation, name: e.target.value })}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Nome da variação"
              />
              <input
                type="number"
                step="0.01"
                min="0"
                value={newVariation.price}
                onChange={(e) => setNewVariation({ ...newVariation, price: e.target.value })}
                className="w-32 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Preço"
              />
              <button
                type="button"
                onClick={addVariation}
                className="px-4 py-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors font-semibold"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              {editItem ? 'Salvar Alterações' : 'Adicionar Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
