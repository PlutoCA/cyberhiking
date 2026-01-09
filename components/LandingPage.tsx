import React from 'react';
import { Season, GameState, Achievement } from '../types';

interface LandingPageProps {
  gameState: GameState;
  showAchievements: boolean;
  showQuiz: boolean;
  t: any;
  onSeasonChange: (season: Season) => void;
  onStartShopping: () => void;
  onShowAchievements: (show: boolean) => void;
  onShowQuiz: (show: boolean) => void;
  translations: any;
}

const LandingPage: React.FC<LandingPageProps> = ({
  gameState,
  showAchievements,
  showQuiz,
  t,
  onSeasonChange,
  onStartShopping,
  onShowAchievements,
  onShowQuiz,
  translations
}) => {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-slate-950 p-6 relative hardware-accel overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1600" className="w-full h-full object-cover grayscale" alt="aotai" />
      </div>
      <div className="z-10 max-w-xl w-full cyber-panel p-8 rounded-[2rem] border-2 border-red-500/20 shadow-2xl space-y-8 animate-in fade-in duration-700">
        <div className="text-center">
          <h1 className="text-6xl font-black text-white italic tracking-tighter uppercase text-neon">Cyber Hike</h1>
          <p className="text-red-500 font-bold tracking-[0.3em] mt-2">秦岭：生死鳌太线</p>
        </div>
        <div className="bg-red-950/20 border border-red-500/30 p-4 rounded-xl text-left space-y-3">
          <p className="text-red-400 font-black text-xs leading-relaxed uppercase">{t.warning}</p>
          <p className="text-slate-400 text-[10px] italic opacity-80">{t.background}</p>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {Object.values(Season).map(s => (
              <button 
                key={s} 
                onClick={() => onSeasonChange(s)} 
                className={`py-3 rounded-xl border text-[10px] font-black tracking-widest transition-all ${
                  gameState.season === s 
                    ? 'bg-sky-500 text-black border-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.4)]' 
                    : 'bg-slate-900/50 border-white/5 text-slate-500'
                }`}
              >
                {translations[gameState.language].seasons[s]}
              </button>
            ))}
          </div>
          <button 
            onClick={onStartShopping} 
            className="w-full py-4 bg-white text-black font-black rounded-2xl uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all text-sm"
          >
            {t.prepare}
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => onShowAchievements(true)} 
              className="py-3 bg-slate-900 border border-sky-500/30 text-sky-400 font-black rounded-2xl uppercase tracking-[0.2em] hover:bg-slate-800 transition-all text-xs"
            >
              🏆 {gameState.language === 'zh' ? '成就' : 'Achievements'}
            </button>
            <button 
              onClick={() => onShowQuiz(true)} 
              className="py-3 bg-slate-900 border border-amber-500/30 text-amber-400 font-black rounded-2xl uppercase tracking-[0.2em] hover:bg-slate-800 transition-all text-xs"
            >
              ❓ {gameState.language === 'zh' ? '知识问答' : 'Quiz'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
