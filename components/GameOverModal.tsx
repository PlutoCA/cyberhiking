import React from 'react';
import { GameState } from '../types';

interface GameOverModalProps {
  gameState: GameState;
  t: any;
  landmarks: any[];
  onResetToHome: () => void;
}

const GameOverModal: React.FC<GameOverModalProps> = ({
  gameState,
  t,
  landmarks,
  onResetToHome
}) => {
  if (gameState.phase !== 'gameover') return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6 animate-in fade-in duration-500 hardware-accel">
      <div className="max-w-md w-full cyber-panel p-8 rounded-[2.5rem] border border-red-500/20 text-center space-y-8 shadow-2xl">
        <h2 className={`text-4xl md:text-5xl font-black italic uppercase tracking-tighter ${gameState.currentLandmarkIndex === landmarks.length - 1 && gameState.status.health > 0 ? 'text-emerald-500' : 'text-neon-red text-red-700'}`}>
          {gameState.currentLandmarkIndex === landmarks.length - 1 && gameState.status.health > 0 ? t.success : t.failed}
        </h2>
        <p className="text-slate-300 text-xs leading-relaxed italic border-y border-white/5 py-6 px-4">
          {gameState.gameMessage[gameState.language]}
        </p>
        {gameState.deathCauseChain.length > 0 && (
          <div className="bg-red-950/30 border border-red-700/50 rounded-lg px-4 py-3 text-left">
            <p className="text-red-400 text-[10px] font-black uppercase tracking-widest mb-2">【死亡原因链条】</p>
            <p className="text-red-300 text-xs font-mono leading-relaxed">{gameState.deathCauseChain[0][gameState.language]}</p>
          </div>
        )}
        <div className="grid grid-cols-4 gap-2">
          <div className="space-y-1">
            <p className="text-[8px] text-slate-500 uppercase font-black">功德</p>
            <p className="text-base font-black text-white">{gameState.merit}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[8px] text-slate-500 uppercase font-black">里程</p>
            <p className="text-base font-black text-white">{gameState.currentLandmarkIndex + 1}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[8px] text-slate-500 uppercase font-black">存活</p>
            <p className="text-base font-black text-white">{gameState.day}D</p>
          </div>
          <div className="space-y-1">
            <p className="text-[8px] text-slate-500 uppercase font-black">打卡</p>
            <p className="text-base font-black text-white">{gameState.checkInCount}</p>
          </div>
        </div>
        <button 
          onClick={onResetToHome} 
          className="w-full py-4 bg-white text-black font-black uppercase rounded-2xl hover:scale-105 active:scale-95 transition-all tracking-[0.2em] text-xs"
        >
          返回首页
        </button>
      </div>
    </div>
  );
};

export default GameOverModal;
