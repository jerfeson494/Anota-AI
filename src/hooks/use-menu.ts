'use client';

import { useState, useEffect } from 'react';
import { MenuItem, Category } from '@/lib/types';
import { mockMenuItems, mockCategories } from '@/lib/mock-data';

export function useMenu() {
  const [items, setItems] = useState<MenuItem[]>(mockMenuItems);
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [loading, setLoading] = useState(false);

  const fetchMenu = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setItems(mockMenuItems);
    setCategories(mockCategories);
    setLoading(false);
  };

  const addMenuItem = async (item: Omit<MenuItem, 'id' | 'establishmentId'>) => {
    const newItem: MenuItem = {
      ...item,
      id: `item-${Date.now()}`,
      establishmentId: '1',
    };
    setItems(prev => [...prev, newItem]);
  };

  const updateMenuItem = async (id: string, updates: Partial<MenuItem>) => {
    setItems(prev =>
      prev.map(item => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const deleteMenuItem = async (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const addCategory = async (category: Omit<Category, 'id' | 'establishmentId'>) => {
    const newCategory: Category = {
      ...category,
      id: `cat-${Date.now()}`,
      establishmentId: '1',
    };
    setCategories(prev => [...prev, newCategory]);
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  return {
    items,
    categories,
    loading,
    fetchMenu,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    addCategory,
  };
}
