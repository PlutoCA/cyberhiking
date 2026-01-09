import React from 'react';
import { InventoryItem, ItemCategory } from '../types';

interface ShoppingPageProps {
  gameState: any;
  shoppingCart: { [key: string]: number };
  activeCategory: ItemCategory;
  shopItems: InventoryItem[];
  t: any;
  onBack: () => void;
  onCategoryChange: (category: ItemCategory) => void;
  onAddToCart: (itemId: string) => void;
  onResetCart: () => void;
  onStartJourney: () => void;
  calculateWeight: (inventory: InventoryItem[]) => number;
}

const ShoppingPage: React.FC<ShoppingPageProps> = ({
  gameState,
  shoppingCart,
  activeCategory,
  shopItems,
  t,
  onBack,
  onCategoryChange,
  onAddToCart,
  onResetCart,
  onStartJourney,
  calculateWeight
}) => {
  const cartEntries = Object.entries(shoppingCart) as [string, number][];
  const cost = cartEntries.reduce((acc, [id, q]) => acc + (shopItems.find(i => i.id === id)?.cost || 0) * q, 0);
  const initialInvWeight = gameState.inventory.reduce((acc: number, i: InventoryItem) => acc + (i.weight * i.quantity), 0);
  const weight = cartEntries.reduce((acc, [id, q]) => acc + (shopItems.find(i => i.id === id)?.weight || 0) * q, 2.0 + initialInvWeight);

  const categories: ItemCategory[] = ['food', 'water', 'gear', 'med'];
  
  return (
    <div className="h-screen w-full bg-slate-950 flex flex-col font-sans hardware-accel overflow-hidden">
      <header className="flex-none px-6 py-4 md:py-6 border-b border-white/5 bg-slate-950/80 backdrop-blur-md z-20">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-4 md:gap-0">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-white italic uppercase tracking-tighter text-center md:text-left">{t.shopping}</h2>
            <div className="flex gap-4 md:gap-6 mt-1 justify-center md:justify-start">
              <span className="text-amber-500 font-bold text-xs tracking-widest uppercase">🪙 {gameState.gold} CREDITS</span>
              <span className={`text-xs font-bold tracking-widest uppercase ${weight > 22 ? 'text-red-500 animate-pulse' : 'text-sky-400'}`}>🎒 {weight.toFixed(1)}/25kg</span>
            </div>
          </div>
          <button onClick={onBack} className="px-4 py-2 border border-white/10 rounded-xl text-slate-500 text-[10px] font-bold uppercase hover:text-slate-300 transition-colors">{t.back}</button>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <div className="flex-1 p-4 md:p-6 overflow-y-auto custom-scrollbar">
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {categories.map(cat => (
              <button 
                key={cat} 
                onClick={() => onCategoryChange(cat)} 
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-all ${activeCategory === cat ? 'bg-sky-500 text-black' : 'bg-slate-900 border border-white/10 text-slate-500'}`}
              >
                {t.categories[cat]}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {shopItems.filter(item => item.category === activeCategory).map(item => (
              <div key={item.id} className="cyber-panel rounded-2xl p-4 border border-white/5 hover:border-sky-500/30 transition-all group">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-sm font-black text-white uppercase group-hover:text-sky-400 transition-colors">{item.name[gameState.language]}</h3>
                  <span className="text-amber-500 font-bold text-xs">🪙{item.cost}</span>
                </div>
                <p className="text-[10px] text-slate-500 mb-3 leading-tight">{item.description[gameState.language]}</p>
                <div className="flex flex-wrap gap-2 text-[8px] font-bold uppercase mb-3">
                  {item.weight > 0 && <span className="bg-slate-800 px-2 py-1 rounded text-slate-400">⚖️ {item.weight}kg</span>}
                  {item.isConsumable && <span className="bg-slate-800 px-2 py-1 rounded text-blue-400">CONSUMABLE</span>}
                  {item.isEquippable && <span className="bg-slate-800 px-2 py-1 rounded text-purple-400">EQUIPMENT</span>}
                </div>
                <button 
                  onClick={() => onAddToCart(item.id)} 
                  className="w-full py-2 bg-white text-black font-bold rounded-xl text-[10px] uppercase hover:bg-sky-400 active:scale-95 transition-all"
                >
                  {t.add}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-white/5 p-4 md:p-6 bg-slate-950/80 backdrop-blur-md flex flex-col">
          <h3 className="text-sm font-black text-white uppercase mb-3">{t.cart}</h3>
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 mb-4">
            {cartEntries.length === 0 ? (
              <p className="text-center py-8 text-slate-600 text-[10px] uppercase italic">{t.empty}</p>
            ) : (
              cartEntries.map(([id, qty]) => {
                const item = shopItems.find(i => i.id === id);
                if (!item) return null;
                return (
                  <div key={id} className="flex justify-between items-center p-2 bg-slate-900 rounded-lg border border-white/5">
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold text-slate-300 truncate">{item.name[gameState.language]}</p>
                      <p className="text-[8px] text-slate-600">x{qty} • 🪙{item.cost * qty}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-3 bg-amber-950/20 border border-amber-500/30 rounded-lg">
              <span className="text-xs font-black text-amber-400 uppercase">{t.cost}</span>
              <span className="text-lg font-black text-amber-400">🪙{cost}</span>
            </div>
            <button onClick={onResetCart} className="w-full py-2 bg-slate-800 text-slate-400 font-bold rounded-xl text-[10px] uppercase hover:bg-slate-700 transition-all">{t.reset}</button>
            <button 
              onClick={onStartJourney} 
              disabled={cost > gameState.gold}
              className="w-full py-3 bg-white text-black font-black rounded-xl text-xs uppercase hover:bg-sky-400 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t.depart}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingPage;
