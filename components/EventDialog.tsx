
import React from 'react';
import { RandomEvent, EventChoice, Language, InventoryItem } from '../types';

interface EventDialogProps {
  event: RandomEvent;
  onChoice: (choice: EventChoice) => void;
  language: Language;
  inventory: InventoryItem[];
}

const EventDialog: React.FC<EventDialogProps> = ({ event, onChoice, language, inventory }) => {
  // 检查是否满足物资需求
  const checkRequirements = (choice: EventChoice): { canChoose: boolean; missingItems: string[] } => {
    if (!choice.requiredItems || choice.requiredItems.length === 0) {
      return { canChoose: true, missingItems: [] };
    }

    const missingItems: string[] = [];
    for (const required of choice.requiredItems) {
      const item = inventory.find(i => i.id === required.itemId);
      if (!item || item.quantity < required.quantity) {
        const itemName = item?.name[language] || required.itemId;
        const currentQty = item?.quantity || 0;
        missingItems.push(`${itemName} (${currentQty}/${required.quantity})`);
      }
    }

    return {
      canChoose: missingItems.length === 0,
      missingItems
    };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl hardware-accel">
      <div className="max-w-md w-full cyber-panel rounded-3xl border-2 border-amber-500/30 p-8 shadow-2xl animate-in zoom-in duration-300">
        <div className="text-amber-500 font-black text-xl mb-4 flex items-center gap-3 uppercase tracking-tighter">
          <span className="animate-pulse">⚠️</span> {event.title[language]}
        </div>
        <p className="text-slate-300 mb-8 leading-relaxed text-xs italic font-medium opacity-90">
          {event.description[language]}
        </p>
        <div className="space-y-2.5">
          {event.choices.map((choice, idx) => {
            const { canChoose, missingItems } = checkRequirements(choice);
            
            return (
              <div key={idx} className="relative">
                <button
                  onClick={() => canChoose && onChoice(choice)}
                  disabled={!canChoose}
                  className={`w-full text-left p-4 rounded-2xl border transition-all ${
                    canChoose 
                      ? 'bg-slate-900/40 border-white/5 hover:border-amber-500/50 hover:bg-amber-500/10 active:scale-95 group cursor-pointer'
                      : 'bg-slate-900/20 border-red-700/30 cursor-not-allowed opacity-60'
                  }`}
                >
                  <span className={`font-black uppercase text-[10px] tracking-widest ${
                    canChoose ? 'text-slate-300 group-hover:text-amber-400' : 'text-slate-600'
                  }`}>
                    {choice.text[language]}
                  </span>
                  
                  {/* 显示所需物资 */}
                  {choice.requiredItems && choice.requiredItems.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-white/5">
                      <p className="text-[9px] text-slate-500 uppercase tracking-wider mb-1">
                        {language === 'zh' ? '需要物资:' : 'Required:'}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {choice.requiredItems.map((req, i) => {
                          const item = inventory.find(it => it.id === req.itemId);
                          const hasEnough = item && item.quantity >= req.quantity;
                          return (
                            <span
                              key={i}
                              className={`text-[9px] px-2 py-0.5 rounded-md font-mono ${
                                hasEnough
                                  ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-700/50'
                                  : 'bg-red-900/30 text-red-400 border border-red-700/50'
                              }`}
                            >
                              {item?.name[language] || req.itemId} x{req.quantity}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </button>
                
                {/* 显示缺少的物资提示 */}
                {!canChoose && missingItems.length > 0 && (
                  <div className="mt-1 px-3 py-1.5 bg-red-950/30 border border-red-700/30 rounded-lg">
                    <p className="text-[9px] text-red-400 font-mono">
                      {language === 'zh' ? '⚠ 物资不足' : '⚠ Insufficient supplies'}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EventDialog;
