
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { LANDMARKS, INITIAL_GAME_STATE, SHOP_ITEMS, INITIAL_STATUS, ACHIEVEMENTS, LOCAL_EVENTS } from './constants';
import { GameState, WeatherType, PlayerStatus, Landmark, InventoryItem, RouteOption, Language, Season, ItemCategory, Achievement, RandomEvent, EventChoice } from './types';
import { generateNarrative, getSurvivalAdvice } from './services/geminiService';
import StatusBar from './components/StatusBar';
import EventDialog from './components/EventDialog';

const LOG_LIMIT = 50;

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem('cyberHike_achievements');
    const unlockedIds = saved ? JSON.parse(saved) : [];
    const baseState = { ...INITIAL_GAME_STATE };
    baseState.achievements = baseState.achievements.map(a => ({
      ...a,
      unlocked: unlockedIds.includes(a.id)
    }));
    return baseState;
  });

  const [currentEvent, setCurrentEvent] = useState<RandomEvent | null>(null);
  const [showAchievements, setShowAchievements] = useState(false);
  const [activeShopCategory, setActiveShopCategory] = useState<ItemCategory>('food');
  const [shoppingCart, setShoppingCart] = useState<{[key: string]: number}>({});
  const [guideLoading, setGuideLoading] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  const t = useMemo(() => translations[gameState.language], [gameState.language]);
  const isNight = gameState.time >= 20 || gameState.time < 6;

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'auto' });
    }
  }, [gameState.log]);

  const currentLandmark = LANDMARKS[gameState.currentLandmarkIndex];
  const hasCheckedInCurrent = gameState.checkedInLandmarks.includes(currentLandmark.id);

  const hasItem = useCallback((id: string) => {
    return gameState.inventory.some(item => item.id === id && item.quantity > 0);
  }, [gameState.inventory]);

  const persistAchievements = (updatedAchievements: Achievement[]) => {
    const unlockedIds = updatedAchievements.filter(a => a.unlocked).map(a => a.id);
    localStorage.setItem('cyberHike_achievements', JSON.stringify(unlockedIds));
  };

  const settleAchievements = useCallback((state: GameState) => {
    let changed = false;
    const newAchievements = state.achievements.map(a => {
      if (a.unlocked) return a;
      let shouldUnlock = false;
      
      if (a.id === 'a2' && state.merit >= 100) shouldUnlock = true;
      if (a.id === 'a3' && state.peopleSaved >= 1) shouldUnlock = true;
      if (a.id === 'a4' && state.phase === 'gameover' && state.status.health > 0 && state.season === Season.WINTER && state.currentLandmarkIndex === LANDMARKS.length - 1) shouldUnlock = true;
      if (a.id === 'a5' && LANDMARKS[state.currentLandmarkIndex].id === 'l6') shouldUnlock = true;
      if (a.id === 'a6' && state.day >= 6) shouldUnlock = true;
      if (a.id === 'a7' && state.startWeight >= 22) shouldUnlock = true;
      if (a.id === 'a8' && state.merit >= 50) shouldUnlock = true;
      
      // 打卡联动成就
      if (a.id === 'a9' && state.checkedInLandmarks.length >= 3) shouldUnlock = true;
      if (a.id === 'a10' && state.checkedInLandmarks.length >= LANDMARKS.length) shouldUnlock = true;
      
      if (state.phase === 'gameover' && state.status.health > 0 && state.currentLandmarkIndex === LANDMARKS.length - 1) {
         if (a.id === 'a1') shouldUnlock = true;
      }
      
      if (shouldUnlock) {
        changed = true;
        return { ...a, unlocked: true };
      }
      return a;
    });
    if (changed) { persistAchievements(newAchievements); return newAchievements; }
    return state.achievements;
  }, []);

  const updateStatus = useCallback((status: PlayerStatus, weather: WeatherType, hours: number, mode: 'active' | 'passive' | 'sleep' = 'active') => {
    let newStatus = { ...status };
    const weightFactor = 1 + (newStatus.weight / 25) * 0.4;
    const meritFactor = Math.max(0.7, 1 - (gameState.merit / 1000)); 
    const nightShift = (isNight && mode === 'active' && !hasItem('g4')) ? 2.5 : 1.0;

    if (mode === 'active') {
      newStatus.stamina -= (1.3 * hours * weightFactor * nightShift * meritFactor);
      newStatus.hydration -= (3.5 * hours * nightShift);
      newStatus.energy -= (2.5 * hours);
    } else if (mode === 'passive') {
      newStatus.hydration -= (0.8 * hours);
      newStatus.energy -= (0.4 * hours);
    } else {
      const sleepBonus = hasItem('g3') ? 1.8 : 1.0;
      newStatus.stamina = Math.min(100, newStatus.stamina + (25 * hours * sleepBonus));
      newStatus.health = Math.min(100, newStatus.health + (5 * hours * sleepBonus));
    }

    let tempLoss = 0.2;
    if (weather === WeatherType.BLIZZARD) tempLoss = 3.8;
    else if (weather === WeatherType.SNOWY) tempLoss = 2.0;
    else if (weather === WeatherType.RAINY) tempLoss = 1.0;
    else if (weather === WeatherType.FOGGY) tempLoss = 0.6;
    if (gameState.season === Season.WINTER) tempLoss += 1.4;
    if (isNight) tempLoss += 0.9;

    if (mode === 'sleep') {
        const tentBonus = hasItem('g2') ? 0.04 : 1.8; 
        const bagBonus = hasItem('g3') ? 0.2 : 1.3;
        const fireHeating = hasItem('g5') ? 3.0 : 0; 
        const passiveHeating = (hasItem('g2') && hasItem('g3')) ? 0.7 : 0;
        const finalLoss = (tempLoss * tentBonus * bagBonus);
        const totalGain = (fireHeating + passiveHeating);
        newStatus.bodyTemp += (totalGain - finalLoss) * hours * 0.12;
    } else {
        const gearBonus = hasItem('g1') ? 0.35 : 1.0;
        newStatus.bodyTemp -= (tempLoss * hours * 0.1 * gearBonus);
    }

    newStatus.bodyTemp = Math.min(37.2, newStatus.bodyTemp);
    const conditions = [...newStatus.conditions];
    if (newStatus.bodyTemp < 36.4 && !conditions.includes('失温')) conditions.push('失温');
    if (newStatus.hydration < 15 && !conditions.includes('脱水')) conditions.push('脱水');
    if (LANDMARKS[gameState.currentLandmarkIndex].elevation > 3000 && Math.random() < 0.05 && !conditions.includes('高反')) conditions.push('高反');

    if (newStatus.bodyTemp >= 36.8 && conditions.includes('失温')) {
        const idx = conditions.indexOf('失温');
        if (idx > -1) conditions.splice(idx, 1);
    }
    newStatus.conditions = conditions;
    
    let hl = 0;
    if (newStatus.conditions.includes('失温')) hl += 4.5; 
    if (newStatus.conditions.includes('脱水')) hl += 2.8;
    if (newStatus.conditions.includes('外伤')) hl += 1.8;
    if (newStatus.conditions.includes('高反')) hl += 1.2;
    if (newStatus.stamina <= 0) hl += 5.5;

    newStatus.health = Math.max(0, Math.min(100, newStatus.health - (hl * hours)));
    newStatus.stamina = Math.max(0, newStatus.stamina);
    newStatus.hydration = Math.max(0, newStatus.hydration);
    return newStatus;
  }, [gameState.season, isNight, hasItem, gameState.currentLandmarkIndex, gameState.merit]);

  const checkGameOver = useCallback((status: PlayerStatus): { isOver: boolean, message: string } => {
    if (status.health <= 0) return { isOver: true, message: t.deathReason.health };
    if (status.bodyTemp < 34.0) return { isOver: true, message: t.deathReason.bodyTemp };
    if (status.hydration <= 0) return { isOver: true, message: t.deathReason.hydration };
    if (status.stamina <= 0 && status.health <= 2) return { isOver: true, message: t.deathReason.stamina };
    return { isOver: false, message: '' };
  }, [t.deathReason]);

  const addLog = useCallback((msg: string) => {
    setGameState(p => {
      const newLog = [...p.log, msg];
      if (newLog.length > LOG_LIMIT) newLog.shift();
      return { ...p, log: newLog };
    });
  }, []);

  const handleRouteChoice = async (option: RouteOption) => {
    if (gameState.phase !== 'hiking' || gameState.isCamping) return;
    let newProgress = gameState.progress + 1;
    let nextLandmarkIndex = gameState.currentLandmarkIndex;
    if (newProgress >= 3) {
      newProgress = 0;
      nextLandmarkIndex = Math.min(LANDMARKS.length - 1, gameState.currentLandmarkIndex + 1);
    }

    const altitudeWeight = LANDMARKS[nextLandmarkIndex].elevation > 3000 ? 0.75 : 0.25;
    const weathers = Object.values(WeatherType);
    const nextWeather = Math.random() < altitudeWeight ? weathers[Math.floor(Math.random() * 3 + 2)] : weathers[Math.floor(Math.random() * 2)];
    
    let newConditions = [...gameState.status.conditions];
    let healthPenalty = 0;
    const risk = (isNight && !hasItem('g4')) ? option.risk * 2.5 : option.risk;
    
    if (Math.random() < risk) {
      if (!newConditions.includes('外伤')) newConditions.push('外伤');
      healthPenalty = 8 + (risk * 15);
    }

    const nextStatus = updateStatus({ ...gameState.status, conditions: newConditions }, gameState.weather, option.timeCost, 'active');
    nextStatus.health -= healthPenalty;
    const gameOver = checkGameOver(nextStatus);

    generateNarrative({ ...gameState, status: nextStatus, weather: nextWeather }, LANDMARKS[nextLandmarkIndex], option.label[gameState.language])
      .then(narrative => addLog(`[D${gameState.day}] ${narrative}`));

    if (gameOver.isOver) {
      const gs = { ...gameState, phase: 'gameover', status: nextStatus, gameMessage: { zh: gameOver.message, en: gameOver.message } };
      setGameState({ ...gs, achievements: settleAchievements(gs as GameState) } as GameState);
    } else if (nextLandmarkIndex === LANDMARKS.length - 1 && gameState.currentLandmarkIndex !== LANDMARKS.length - 1 && newProgress === 0) {
      const gs = { ...gameState, phase: 'gameover', status: nextStatus, currentLandmarkIndex: nextLandmarkIndex, gameMessage: { zh: "厚畛子的灯火就在前方，你终于完成了鳌太穿越！", en: "THE LIGHTS OF HOUZHENZI! MISSION COMPLETE!" } };
      setGameState({ ...gs, achievements: settleAchievements(gs as GameState) } as GameState);
    } else {
      setGameState(p => {
          const newDay = p.day + Math.floor((p.time + option.timeCost) / 24);
          if (isNight && !hasItem('g4')) addLog(`[DANGER] ${t.noHeadlamp}`);
          return {
            ...p,
            currentLandmarkIndex: nextLandmarkIndex,
            progress: newProgress,
            weather: nextWeather,
            time: (p.time + option.timeCost) % 24,
            day: newDay,
            status: nextStatus,
            achievements: settleAchievements({ ...p, status: nextStatus, day: newDay } as GameState)
          };
      });
      if (Math.random() < 0.25) setCurrentEvent([...LOCAL_EVENTS].sort(() => Math.random() - 0.5)[0]);
    }
  };

  const handleEventChoice = (choice: EventChoice) => {
    setGameState(p => {
      let newInventory = [...p.inventory];
      if (choice.rewardItems) {
        choice.rewardItems.forEach(reward => {
          const base = SHOP_ITEMS.find(i => i.id === reward.itemId);
          if (base) {
            const existing = newInventory.find(i => i.id === reward.itemId);
            if (existing) existing.quantity += reward.quantity;
            else newInventory.push({ ...base, quantity: reward.quantity });
          }
        });
      }

      let newConditions = [...p.status.conditions];
      if (choice.conditionAdded && !newConditions.includes(choice.conditionAdded)) newConditions.push(choice.conditionAdded);
      if (choice.conditionRemoved) newConditions = newConditions.filter(c => c !== choice.conditionRemoved);

      const nextStatus = {
        ...p.status,
        health: Math.max(0, Math.min(100, p.status.health + choice.healthImpact)),
        stamina: Math.max(0, Math.min(100, p.status.stamina + choice.staminaImpact)),
        conditions: newConditions
      };
      
      nextStatus.weight = Number(newInventory.reduce((acc, i) => acc + (i.weight * i.quantity), 2.0).toFixed(2));
      const gameOver = checkGameOver(nextStatus);

      if (gameOver.isOver) {
        return { ...p, phase: 'gameover', status: nextStatus, gameMessage: { zh: gameOver.message, en: gameOver.message } };
      }

      const newLogs = [...p.log, `[EVENT] ${choice.log[p.language]}`].slice(-LOG_LIMIT);

      return {
        ...p,
        status: nextStatus,
        inventory: newInventory,
        merit: p.merit + choice.meritImpact,
        peopleSaved: p.peopleSaved + (choice.meritImpact >= 100 ? 1 : 0),
        log: newLogs,
        achievements: settleAchievements({ ...p, status: nextStatus, merit: p.merit + choice.meritImpact, peopleSaved: p.peopleSaved + (choice.meritImpact >= 100 ? 1 : 0) } as GameState)
      };
    });
    setCurrentEvent(null);
  };

  const handleUseItem = (item: InventoryItem) => {
    if (gameState.phase !== 'hiking') return;
    setGameState(p => {
      const invItem = p.inventory.find(i => i.id === item.id);
      if (!invItem || invItem.quantity <= 0) return p;
      const newStatus = invItem.effect(p.status);
      const newInventory = p.inventory.map(i => i.id === item.id ? { ...i, quantity: i.isConsumable ? i.quantity - 1 : i.quantity } : i).filter(i => i.quantity > 0);
      
      const newLogs = [...p.log, `[ACTION] 使用了: ${invItem.name[p.language]}`].slice(-LOG_LIMIT);

      return { 
        ...p, 
        status: { ...newStatus, weight: Number(newInventory.reduce((acc, i) => acc + (i.weight * i.quantity), 2.0).toFixed(2)) }, 
        inventory: newInventory, 
        log: newLogs 
      };
    });
  };

  const handleCheckIn = () => {
    if (gameState.phase !== 'hiking' || gameState.isCamping || hasCheckedInCurrent) return;
    setGameState(p => {
      const newCheckInCount = p.checkInCount + 1;
      const newCheckedInLandmarks = [...p.checkedInLandmarks, currentLandmark.id];
      const newMerit = p.merit + 5;
      const nextLogs = [...p.log, `[SYSTEM] 已在 ${currentLandmark.name[p.language]} 留下数字足迹。功德+5`].slice(-LOG_LIMIT);
      const nextState = {
        ...p,
        checkInCount: newCheckInCount,
        checkedInLandmarks: newCheckedInLandmarks,
        merit: newMerit,
        log: nextLogs,
      };
      return {
        ...nextState,
        achievements: settleAchievements(nextState as GameState)
      };
    });
  };

  const updateCart = (id: string, delta: number) => {
    setShoppingCart(prev => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: next };
    });
  };

  const handleExplore = () => {
    if (gameState.phase !== 'hiking' || gameState.isCamping) return;
    addLog(`[ACTION] ${t.explore}...`);
    if (Math.random() < 0.3) {
      setCurrentEvent([...LOCAL_EVENTS].sort(() => Math.random() - 0.5)[0]);
    } else {
      addLog(`[SYSTEM] 这里的乱石堆中除了积雪和枯草，没有任何发现。`);
    }
    setGameState(p => {
      const nextStatus = updateStatus(p.status, p.weather, 1, 'active');
      return {
        ...p,
        time: (p.time + 1) % 24,
        status: nextStatus
      };
    });
  };

  const handleAskGuide = async () => {
    if (guideLoading) return;
    setGuideLoading(true);
    try {
      const advice = await getSurvivalAdvice(gameState);
      addLog(`[GUIDE] ${advice}`);
    } catch (err) {
      addLog(`[SYSTEM] 无法获取生存指南。`);
    } finally {
      setGuideLoading(false);
    }
  };

  const handleSleep = () => {
    const hours = 8;
    const nextStatus = updateStatus(gameState.status, gameState.weather, hours, 'sleep');
    const gameOver = checkGameOver(nextStatus);

    if (gameOver.isOver) {
      setGameState(p => ({ ...p, phase: 'gameover', status: nextStatus, gameMessage: { zh: gameOver.message, en: gameOver.message } }));
    } else {
      setGameState(p => ({
        ...p,
        time: (p.time + hours) % 24,
        day: p.day + Math.floor((p.time + hours) / 24),
        status: nextStatus,
        isCamping: false
      }));
      addLog(`[SYSTEM] 睡眠充足，体能核心恢复。`);
    }
  };

  const handleRest = () => {
    const hours = 2;
    const nextStatus = updateStatus(gameState.status, gameState.weather, hours, 'passive');
    nextStatus.stamina = Math.min(100, nextStatus.stamina + 20);
    const gameOver = checkGameOver(nextStatus);

    if (gameOver.isOver) {
      setGameState(p => ({ ...p, phase: 'gameover', status: nextStatus, gameMessage: { zh: gameOver.message, en: gameOver.message } }));
    } else {
      setGameState(p => ({
        ...p,
        time: (p.time + hours) % 24,
        day: p.day + Math.floor((p.time + hours) / 24),
        status: nextStatus
      }));
      addLog(`[ACTION] 原地小憩。`);
    }
  };

  const startJourney = () => {
    const entries = Object.entries(shoppingCart) as [string, number][];
    const cost = entries.reduce((acc, [id, q]) => acc + (SHOP_ITEMS.find(i => i.id === id)?.cost || 0) * q, 0);
    
    // 包含自带物资后的总重计算
    const currentInvWeight = gameState.inventory.reduce((acc, i) => acc + (i.weight * i.quantity), 0);
    const weight = entries.reduce((acc, [id, q]) => acc + (SHOP_ITEMS.find(i => i.id === id)?.weight || 0) * q, 2.0 + currentInvWeight);
    
    if (cost > gameState.gold || weight > 25) return;
    
    const items: InventoryItem[] = entries.map(([id, q]) => {
      const base = SHOP_ITEMS.find(i => i.id === id);
      return base ? { ...base, quantity: q } : null;
    }).filter((i): i is InventoryItem => i !== null && i.quantity > 0);

    // 合并初始物资和购买物资
    const mergedInventory = [...gameState.inventory];
    items.forEach(newItem => {
        const existingIdx = mergedInventory.findIndex(i => i.id === newItem.id);
        if (existingIdx > -1) mergedInventory[existingIdx].quantity += newItem.quantity;
        else mergedInventory.push(newItem);
    });

    setGameState(p => ({ 
      ...p, 
      phase: 'hiking', 
      gold: p.gold - cost, 
      inventory: mergedInventory, 
      startWeight: weight, 
      status: { ...p.status, weight }, 
      log: [`[SYSTEM] 征途开启。秦岭鳌太线：非经允许严禁穿越。`] 
    }));
  };

  const resetToHome = () => {
    setGameState(p => ({
      ...INITIAL_GAME_STATE,
      achievements: p.achievements // 保留已解锁成就
    }));
  };

  if (gameState.phase === 'landing') {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-950 p-6 relative hardware-accel overflow-hidden">
        {showAchievements && (
          <div className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6 hardware-accel animate-in fade-in duration-300">
            <div className="max-w-2xl w-full cyber-panel p-8 rounded-[2rem] border border-sky-500/30 flex flex-col max-h-[85vh]">
               <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-black italic text-white uppercase tracking-tighter">🏆 {t.achievementList}</h2>
                  <button onClick={() => setShowAchievements(false)} className="text-slate-500 hover:text-white transition-colors">✕</button>
               </div>
               <div className="flex-grow overflow-y-auto custom-scrollbar pr-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {gameState.achievements.map(a => (
                    <div key={a.id} className={`p-4 rounded-2xl border flex items-center gap-4 transition-all ${a.unlocked ? 'bg-sky-500/10 border-sky-500/40 opacity-100' : 'bg-slate-900/50 border-white/5 opacity-40'}`}>
                      <span className="text-2xl">{a.icon}</span>
                      <div className="min-w-0">
                        <p className="text-xs font-black text-white uppercase truncate">{a.name[gameState.language]}</p>
                        <p className="text-[10px] text-slate-500 leading-tight">{a.description[gameState.language]}</p>
                      </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        )}
        <div className="absolute inset-0 opacity-20"><img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1600" className="w-full h-full object-cover grayscale" alt="aotai" /></div>
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
                 <button key={s} onClick={() => setGameState(p => ({ ...p, season: s }))} className={`py-3 rounded-xl border text-[10px] font-black tracking-widest transition-all ${gameState.season === s ? 'bg-sky-500 text-black border-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.4)]' : 'bg-slate-900/50 border-white/5 text-slate-500'}`}>{translations[gameState.language].seasons[s]}</button>
               ))}
             </div>
             <button onClick={() => setGameState(p => ({ ...p, phase: 'shopping' }))} className="w-full py-4 bg-white text-black font-black rounded-2xl uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all text-sm">{t.prepare}</button>
             <button onClick={() => setShowAchievements(true)} className="w-full py-3 bg-slate-900 border border-sky-500/30 text-sky-400 font-black rounded-2xl uppercase tracking-[0.2em] hover:bg-slate-800 transition-all text-xs">🏆 {t.achievementList}</button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState.phase === 'shopping') {
    const cartEntries = Object.entries(shoppingCart) as [string, number][];
    const cost = cartEntries.reduce((acc, [id, q]) => acc + (SHOP_ITEMS.find(i => i.id === id)?.cost || 0) * q, 0);
    const initialInvWeight = gameState.inventory.reduce((acc, i) => acc + (i.weight * i.quantity), 0);
    const weight = cartEntries.reduce((acc, [id, q]) => acc + (SHOP_ITEMS.find(i => i.id === id)?.weight || 0) * q, 2.0 + initialInvWeight);
    
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
            <button onClick={() => setGameState(p => ({ ...p, phase: 'landing' }))} className="px-4 py-2 border border-white/10 rounded-xl text-slate-500 text-[10px] font-bold uppercase hover:text-slate-300 transition-colors">{t.back}</button>
          </div>
        </header>

        <main className="flex-grow flex flex-col md:flex-row overflow-hidden relative">
          <section className="flex-grow flex flex-col overflow-hidden p-4 md:p-6 gap-4">
            <nav className="flex-none flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
              {Object.keys(t.categories).map(cat => (
                <button 
                  key={cat} 
                  onClick={() => setActiveShopCategory(cat as ItemCategory)} 
                  className={`flex-none px-4 md:px-5 py-2 rounded-xl text-[10px] font-black border transition-all uppercase whitespace-nowrap ${activeShopCategory === cat ? 'bg-sky-500 text-black border-sky-400' : 'bg-slate-900 border-white/5 text-slate-500'}`}
                >
                  {(t.categories as any)[cat]}
                </button>
              ))}
            </nav>
            <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {SHOP_ITEMS.filter(i => i.type === activeShopCategory).map(item => (
                  <div key={item.id} className="bg-slate-900/40 border border-white/5 p-4 rounded-2xl flex flex-col justify-between hover:border-sky-500/40 transition-colors group">
                    <div>
                      <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase mb-2">
                        <span className="group-hover:text-slate-300">{item.weight}KG</span>
                        <span className="text-amber-500">{item.cost}🪙</span>
                      </div>
                      <h3 className="text-sm font-black text-white mb-1 group-hover:text-sky-400 transition-colors">{item.name[gameState.language]}</h3>
                      <p className="text-[10px] text-slate-500 leading-tight italic">{item.description[gameState.language]}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-4 bg-black/20 p-1 rounded-xl">
                      <button onClick={() => updateCart(item.id, -1)} className="w-8 h-8 bg-slate-800 rounded-lg font-black text-xs hover:bg-slate-700 transition-colors">-</button>
                      <span className="flex-grow text-center font-mono font-bold text-white">{shoppingCart[item.id] || 0}</span>
                      <button 
                        onClick={() => updateCart(item.id, 1)} 
                        className="w-8 h-8 bg-slate-800 rounded-lg font-black text-xs hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        disabled={!item.isConsumable && (shoppingCart[item.id] || 0) >= 1}
                      >+</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <aside className="w-full md:w-80 flex-none cyber-panel border-t md:border-t-0 md:border-l border-white/5 bg-black/40 flex flex-col shadow-2xl relative z-10 max-h-[40vh] md:max-h-full">
            <div className="flex-none p-4 md:p-6 border-b border-white/5">
              <h3 className="text-xs font-black text-sky-400 uppercase tracking-widest italic">{t.cart}</h3>
            </div>
            <div className="flex-grow overflow-y-auto p-4 md:p-6 custom-scrollbar">
              <div className="space-y-3">
                {cartEntries.filter(([_, q]) => q > 0).length === 0 ? (
                  <div className="text-center py-10 md:py-20 opacity-20 italic text-xs uppercase tracking-widest">{t.empty}</div>
                ) : (
                  cartEntries.map(([id, q]) => {
                    const item = SHOP_ITEMS.find(i => i.id === id);
                    if (!item || q <= 0) return null;
                    return (
                      <div key={id} className="flex justify-between items-center text-[10px] font-bold border-b border-white/5 pb-3 group">
                        <div className="flex flex-col">
                          <span className="text-slate-300 group-hover:text-sky-400 transition-colors truncate w-32 md:w-40">{item.name[gameState.language]}</span>
                          <span className="text-[8px] text-slate-600 font-mono">{(item.weight * q).toFixed(1)}KG</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sky-500 font-mono">x{q}</span>
                          <button onClick={() => updateCart(id, -1)} className="text-slate-700 hover:text-red-500 transition-colors px-1">✕</button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
            <div className="flex-none p-4 md:p-6 bg-slate-900/60 border-t border-white/10 space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-slate-500 text-[10px] font-bold uppercase">{t.cost}</span>
                <span className={`text-xl md:text-2xl font-black ${cost > gameState.gold ? 'text-red-500' : 'text-amber-500'}`}>{cost}🪙</span>
              </div>
              <button 
                onClick={startJourney} 
                disabled={cost > gameState.gold || weight > 25 || (cost === 0 && cartEntries.length === 0)}
                className="w-full py-4 bg-sky-600 text-white font-black rounded-2xl uppercase tracking-widest text-[10px] shadow-lg active:scale-95 disabled:grayscale disabled:opacity-30 disabled:active:scale-100 transition-all"
              >
                {t.depart}
              </button>
            </div>
          </aside>
        </main>
      </div>
    );
  }

  return (
    <div className={`h-screen w-full flex flex-col md:flex-row bg-slate-950 font-mono hardware-accel overflow-hidden ${isNight ? 'brightness-90' : ''}`}>
      {currentEvent && <EventDialog event={currentEvent} language={gameState.language} onChoice={handleEventChoice} />}
      
      {showAchievements && (
        <div className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6 hardware-accel animate-in fade-in duration-300">
          <div className="max-w-2xl w-full cyber-panel p-8 rounded-[2rem] border border-sky-500/30 flex flex-col max-h-[85vh]">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black italic text-white uppercase tracking-tighter">🏆 {t.achievementList}</h2>
                <button onClick={() => setShowAchievements(false)} className="text-slate-500 hover:text-white transition-colors">✕</button>
             </div>
             <div className="flex-grow overflow-y-auto custom-scrollbar pr-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {gameState.achievements.map(a => (
                  <div key={a.id} className={`p-4 rounded-2xl border flex items-center gap-4 transition-all ${a.unlocked ? 'bg-sky-500/10 border-sky-500/40 opacity-100' : 'bg-slate-900/50 border-white/5 opacity-40'}`}>
                    <span className="text-2xl">{a.icon}</span>
                    <div className="min-w-0">
                      <p className="text-xs font-black text-white uppercase truncate">{a.name[gameState.language]}</p>
                      <p className="text-[10px] text-slate-500 leading-tight">{a.description[gameState.language]}</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      )}

      <div className="w-full md:w-80 p-5 flex flex-col gap-4 border-r border-white/5 bg-black/40 overflow-y-auto custom-scrollbar">
        <div className="relative h-48 w-full rounded-2xl overflow-hidden shadow-2xl group border border-white/5">
          <img src={currentLandmark.imageUrl} className="w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-110" alt="landmark" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
          <div className="absolute bottom-4 left-4">
             <p className="text-[10px] text-sky-400 font-bold uppercase tracking-widest mb-0.5">{t.landmark}</p>
             <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">{currentLandmark.name[gameState.language]}</h3>
             <p className="text-[10px] text-slate-400 font-bold">{currentLandmark.elevation}M ALTITUDE</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
           <button onClick={handleExplore} className="py-2.5 rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-500 font-black uppercase text-[10px] hover:bg-amber-500/20 transition-all">🔍 {t.explore}</button>
           <button onClick={handleAskGuide} disabled={guideLoading} className={`py-2.5 rounded-xl border border-sky-500/20 bg-sky-500/10 text-sky-500 font-black uppercase text-[10px] hover:bg-sky-500/20 transition-all ${guideLoading ? 'animate-pulse' : ''}`}>🤖 {t.guide}</button>
        </div>

        <div className="cyber-panel p-5 rounded-2xl space-y-1">
          <StatusBar label={t.health} value={gameState.status.health} max={100} color="bg-red-500" icon="❤️" />
          <StatusBar label={t.stamina} value={gameState.status.stamina} max={100} color="bg-emerald-500" icon="⚡" />
          <StatusBar label={t.temp} value={gameState.status.bodyTemp} max={40} unit="°C" color={gameState.status.bodyTemp < 36.5 ? 'bg-sky-500 shadow-[0_0_10px_rgba(56,189,248,0.3)]' : 'bg-orange-500'} icon="🌡️" />
          
          <div className="flex flex-wrap gap-1.5 pt-2">
             {gameState.status.conditions.map(c => <span key={c} className="bg-red-500/20 text-red-500 px-2 py-0.5 rounded text-[8px] font-black border border-red-500/30 animate-pulse uppercase">{c}</span>)}
          </div>
        </div>

        <div className="mt-auto pt-4 flex flex-col gap-2">
           <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2">
              <span>功德 (MERIT)</span>
              <span className="text-sky-400 font-mono">{gameState.merit}</span>
           </div>
           <button onClick={() => setShowAchievements(true)} className="w-full py-2.5 rounded-xl border border-white/10 bg-slate-900/50 text-slate-400 font-black uppercase text-[10px] hover:text-white hover:border-sky-500/50 transition-all">🏆 {t.achievements}</button>
        </div>
      </div>

      <div className="flex-grow flex flex-col p-5 gap-4 overflow-hidden border-r border-white/5">
        <div className="flex justify-between items-center px-4 py-2 bg-slate-900/40 rounded-xl border border-white/5 text-[10px] font-bold text-slate-500">
          <span className="uppercase tracking-widest">{t.seasons[gameState.season]} MISSION | SOLO</span>
          <span className="text-sky-500 font-mono">{gameState.weather} | D{gameState.day} {gameState.time}:00</span>
        </div>
        <div className="flex-grow cyber-panel rounded-2xl p-5 overflow-y-auto custom-scrollbar flex flex-col gap-2">
           {gameState.log.map((l, i) => (
             <div key={i} className={`text-[11px] leading-relaxed pl-3 border-l-2 transition-all duration-500 animate-in slide-in-from-left-1 ${l.includes('[DANGER]') ? 'text-red-400 border-red-900' : l.startsWith('[SYSTEM]') ? 'text-sky-400 border-sky-900' : l.startsWith('[EVENT]') ? 'text-amber-400 border-amber-900' : 'text-slate-500 border-slate-800'}`}>
               {l}
             </div>
           ))}
           <div ref={logEndRef} />
        </div>
      </div>

      <div className="w-full md:w-80 p-5 flex flex-col gap-4 bg-black/40 overflow-y-auto custom-scrollbar">
        <div className="flex-grow cyber-panel rounded-2xl p-4 flex flex-col overflow-hidden">
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-3">{t.inventory} ({gameState.status.weight.toFixed(1)}kg)</p>
          <div className="flex-grow overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
            {gameState.inventory.length === 0 ? <p className="text-center py-10 text-[10px] text-slate-600 italic uppercase">{t.empty}</p> : 
             gameState.inventory.map(item => (
               <button key={item.id} onClick={() => handleUseItem(item)} className="w-full flex justify-between items-center p-3 rounded-xl bg-slate-900/50 border border-white/5 hover:border-sky-500/30 transition-all text-left group">
                 <div className="min-w-0">
                    <p className="text-[10px] font-black text-slate-300 uppercase truncate group-hover:text-sky-400 transition-colors">{item.name[gameState.language]}</p>
                    <p className="text-[8px] text-slate-500 font-bold uppercase">{item.isConsumable ? 'DEP' : 'DUR'}</p>
                 </div>
                 <span className="bg-slate-800 px-2 py-0.5 rounded text-[10px] font-mono font-bold text-white">x{item.quantity}</span>
               </button>
             ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 pt-2">
           {gameState.isCamping ? (
             <div className="space-y-2">
                <button onClick={handleSleep} className="w-full py-4 bg-emerald-700 text-white font-black rounded-xl uppercase tracking-widest text-xs shadow-lg shadow-emerald-900/20 active:scale-95 transition-all">{t.sleep}</button>
                <button onClick={() => setGameState(p => ({...p, isCamping: false}))} className="w-full py-3 bg-slate-800 text-slate-300 font-black rounded-xl uppercase text-[10px] border border-white/5">{t.packup}</button>
             </div>
           ) : (
             <>
               {currentLandmark.options.map(opt => (
                 <button key={opt.id} onClick={() => handleRouteChoice(opt)} className="w-full py-4 bg-sky-700 text-white font-black rounded-xl uppercase tracking-widest text-xs shadow-lg shadow-sky-900/20 active:scale-95 transition-all">{t.proceed}</button>
               ))}
               <div className="grid grid-cols-2 gap-2">
                 <button onClick={handleRest} className="py-3 bg-slate-900/50 text-slate-400 font-black rounded-xl uppercase text-[10px] border border-white/5 hover:bg-slate-800 transition-all">{t.restDesc.split(' ')[0]}</button>
                 <button onClick={() => setGameState(p => ({...p, isCamping: true}))} className="py-3 bg-amber-700 text-white font-black rounded-xl uppercase text-[10px] active:scale-95 transition-all">{t.camp.split(' ')[0]}</button>
               </div>
               <button 
                onClick={handleCheckIn} 
                disabled={hasCheckedInCurrent}
                className={`w-full py-3 font-black border rounded-xl uppercase text-[10px] transition-all ${hasCheckedInCurrent ? 'bg-slate-800 border-white/10 text-slate-600 cursor-not-allowed' : 'bg-indigo-900/40 text-indigo-400 border-indigo-500/30 hover:bg-indigo-900/60 active:scale-95'}`}
               >
                 {hasCheckedInCurrent ? '✅ 已打卡' : `📍 ${t.checkin}`}
               </button>
             </>
           )}
        </div>

        {gameState.phase === 'gameover' && (
          <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6 animate-in fade-in duration-500 hardware-accel">
             <div className="max-w-md w-full cyber-panel p-8 rounded-[2.5rem] border border-red-500/20 text-center space-y-8 shadow-2xl">
                <h2 className={`text-4xl md:text-5xl font-black italic uppercase tracking-tighter ${gameState.status.health <= 0 ? 'text-neon-red text-red-700' : 'text-emerald-500'}`}>
                   {gameState.status.health <= 0 ? t.failed : t.success}
                </h2>
                <p className="text-slate-300 text-xs leading-relaxed italic border-y border-white/5 py-6 px-4">{gameState.gameMessage[gameState.language]}</p>
                <div className="grid grid-cols-4 gap-2">
                   <div className="space-y-1"><p className="text-[8px] text-slate-500 uppercase font-black">功德</p><p className="text-base font-black text-white">{gameState.merit}</p></div>
                   <div className="space-y-1"><p className="text-[8px] text-slate-500 uppercase font-black">里程</p><p className="text-base font-black text-white">{gameState.currentLandmarkIndex + 1}</p></div>
                   <div className="space-y-1"><p className="text-[8px] text-slate-500 uppercase font-black">存活</p><p className="text-base font-black text-white">{gameState.day}D</p></div>
                   <div className="space-y-1"><p className="text-[8px] text-slate-500 uppercase font-black">打卡</p><p className="text-base font-black text-white">{gameState.checkInCount}</p></div>
                </div>
                <button onClick={resetToHome} className="w-full py-4 bg-white text-black font-black uppercase rounded-2xl hover:scale-105 active:scale-95 transition-all tracking-[0.2em] text-xs">返回首页</button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

const translations: any = {
  zh: {
    start: '开启征途',
    prepare: '物资筹备',
    intro: '穿越禁令',
    back: '返回首页',
    shopping: '量子补给站',
    load: '当前负重',
    add: '购买',
    reset: '清空',
    depart: '踏入无人区',
    log: '生存记录',
    biometrics: '生命体征',
    inventory: '行囊存储',
    landmark: '所在坐标',
    weather: '气象中枢',
    day: '第 {d} 天',
    health: '生命指数',
    stamina: '动力储备',
    temp: '核心体温',
    proceed: '推进路程',
    rest: '原地休息',
    camp: '扎营驻守',
    sleep: '深度睡眠',
    packup: '拔营',
    checkin: '数字签到',
    achievements: '成就系统',
    achievementList: '荣耀殿堂 (成就)',
    restDesc: '小憩 (体力+20)',
    failed: '量子通信中断',
    success: '穿越成功',
    reboot: '重新进入',
    empty: '行囊空空...',
    gold: '点数',
    cart: '交易清单',
    cost: '总计',
    explore: '搜寻周边',
    guide: '求助向导',
    noHeadlamp: '夜晚光线不足，极其危险！',
    warning: '【警告】鳌太线属于自然保护区核心区，非经允许严禁穿越。该区域地形极度复杂，气象万变，已造成多人遇难。',
    background: '你翻越了围栏。现在，你将独自面对荒野的审判。',
    deathReason: {
      health: '你永远停止在了秦岭的脊梁上。',
      stamina: '你倒在了乱石缝中。',
      bodyTemp: '极寒夺走了你的最后一丝意识。',
      hydration: '干渴摧毁了你的意志。'
    },
    categories: { food: '食物', water: '水源', gear: '装备', med: '医疗' },
    seasons: { [Season.SPRING]: '春季', [Season.SUMMER]: '夏季', [Season.AUTUMN]: '秋季', [Season.WINTER]: '冬季' }
  },
  en: {
    start: 'Start',
    prepare: 'Supply Prep',
    intro: 'Entry Ban',
    back: 'Back',
    shopping: 'Quantum Depot',
    load: 'Weight',
    add: 'Buy',
    reset: 'Clear',
    depart: 'Enter Zone',
    log: 'Survival Log',
    biometrics: 'Vitals',
    inventory: 'Storage',
    landmark: 'Coords',
    weather: 'Weather',
    day: 'Day {d}',
    health: 'Life',
    stamina: 'Stamina',
    temp: 'Body Temp',
    proceed: 'Advance',
    rest: 'Rest',
    camp: 'Camp',
    sleep: 'Sleep',
    packup: 'Pack Up',
    checkin: 'Check-in',
    achievements: 'Achievements',
    achievementList: 'Hall of Fame',
    restDesc: 'Rest (+20 Stamina)',
    failed: 'SIGNAL LOST',
    success: 'SURVIVED',
    reboot: 'Reboot',
    empty: 'Empty...',
    gold: 'Credits',
    cart: 'Cart',
    cost: 'Total',
    explore: 'Explore',
    guide: 'Ask Guide',
    noHeadlamp: 'No headlamp at night! Dangerous!',
    warning: 'Aotai line is a core protected area. Entry without permit is strictly prohibited. Extreme risks involved.',
    background: 'You jumped the fence. Now, you face the wild alone.',
    deathReason: {
      health: 'Life stopped on the ridge.',
      stamina: 'Exhausted on boulders.',
      bodyTemp: 'Hypothermia took you.',
      hydration: 'Dehydration shock.'
    },
    categories: { food: 'Food', water: 'Water', gear: 'Gear', med: 'Meds' },
    seasons: { [Season.SPRING]: 'Spring', [Season.SUMMER]: 'Summer', [Season.AUTUMN]: 'Autumn', [Season.WINTER]: 'Winter' }
  }
};

export default App;
