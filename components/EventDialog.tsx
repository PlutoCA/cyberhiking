
import React from 'react';
import { RandomEvent, EventChoice, Language } from '../types';

interface EventDialogProps {
  event: RandomEvent;
  onChoice: (choice: EventChoice) => void;
  language: Language;
}

const EventDialog: React.FC<EventDialogProps> = ({ event, onChoice, language }) => {
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
          {event.choices.map((choice, idx) => (
            <button
              key={idx}
              onClick={() => onChoice(choice)}
              className="w-full text-left p-4 rounded-2xl bg-slate-900/40 border border-white/5 hover:border-amber-500/50 hover:bg-amber-500/10 active:scale-95 transition-all group"
            >
              <span className="text-slate-300 group-hover:text-amber-400 font-black uppercase text-[10px] tracking-widest">{choice.text[language]}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventDialog;
