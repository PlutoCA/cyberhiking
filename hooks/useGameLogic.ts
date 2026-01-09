import { useCallback } from 'react';
import { InventoryItem } from '../types';

export const useGameLogic = () => {
  // 统一的负重计算函数
  const calculateWeight = useCallback((inventory: InventoryItem[]): number => {
    const BASE_WEIGHT = 2.0; // 背包本身重量
    const itemsWeight = inventory.reduce((acc, i) => acc + (i.weight * i.quantity), 0);
    return Number((BASE_WEIGHT + itemsWeight).toFixed(2));
  }, []);

  // 检查物品是否存在
  const hasItem = useCallback((inventory: InventoryItem[], itemId: string): boolean => {
    return inventory.some(i => i.id === itemId && i.quantity > 0);
  }, []);

  // 使用物品
  const useItem = useCallback((inventory: InventoryItem[], itemId: string): InventoryItem[] => {
    return inventory.map(i => 
      i.id === itemId && i.quantity > 0 
        ? { ...i, quantity: i.quantity - 1 } 
        : i
    ).filter(i => i.quantity > 0);
  }, []);

  // 添加物品
  const addItem = useCallback((inventory: InventoryItem[], item: InventoryItem, quantity: number = 1): InventoryItem[] => {
    const existing = inventory.find(i => i.id === item.id);
    if (existing) {
      return inventory.map(i => 
        i.id === item.id 
          ? { ...i, quantity: i.quantity + quantity } 
          : i
      );
    }
    return [...inventory, { ...item, quantity }];
  }, []);

  return {
    calculateWeight,
    hasItem,
    useItem,
    addItem
  };
};
