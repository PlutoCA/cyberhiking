
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { LANDMARKS, INITIAL_GAME_STATE, SHOP_ITEMS, INITIAL_STATUS, ACHIEVEMENTS, LOCAL_EVENTS, QUIZ_QUESTIONS } from './constants';
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
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [activeShopCategory, setActiveShopCategory] = useState<ItemCategory>('food');
    const [shoppingCart, setShoppingCart] = useState<{ [key: string]: number }>({});
  
    // 统一的负重计算函数
    const calculateWeight = useCallback((inventory: InventoryItem[]): number => {
      const BASE_WEIGHT = 2.0; // 背包本身重量
      const itemsWeight = inventory.reduce((acc, i) => acc + (i.weight * i.quantity), 0);
      return Number((BASE_WEIGHT + itemsWeight).toFixed(2));
    }, []);
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
        // 修正：帐篷和睡袋应该减少失温，而不是增加
        const tentBonus = hasItem('g2') ? 0.3 : 1.0; // 有帐篷减少30%失温
        const bagBonus = hasItem('g3') ? 0.4 : 1.0;  // 有睡袋减少60%失温
        const fireHeating = hasItem('g5') ? 0.8 : 0;  // 气罐提供额外保温
        const passiveHeating = (hasItem('g2') && hasItem('g3')) ? 0.5 : 0; // 帐篷+睡袋组合额外加成
        const finalLoss = (tempLoss * tentBonus * bagBonus);
        const totalGain = (fireHeating + passiveHeating);
        newStatus.bodyTemp += (totalGain - finalLoss) * hours * 0.12;
    } else {
        const gearBonus = hasItem('g1') ? 0.35 : 1.0; // 冲锋衣减少65%失温
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

  const selectWeightedEvent = useCallback(() => {
    // 过滤出未触发的事件（减少重复概率）
    let availableEvents = LOCAL_EVENTS.filter(e => !gameState.triggeredEvents.includes(e.id));
    
    // 如果所有事件都触发过，保留最近触发的5个，其他可以重新触发
    if (availableEvents.length < 5) {
      const recentEvents = gameState.triggeredEvents.slice(-5);
      availableEvents = LOCAL_EVENTS.filter(e => !recentEvents.includes(e.id));
      
      // 如果还是太少，完全重置
      if (availableEvents.length === 0) {
        availableEvents = LOCAL_EVENTS;
        // 清空历史记录（保留在后续的setGameState中处理）
      }
    }
    
    // 根据玩家状态和环境选择合适的事件
    const currentStatus = gameState.status;
    const currentWeather = gameState.weather;
    const currentElevation = LANDMARKS[gameState.currentLandmarkIndex].elevation;
    const isNight = gameState.time >= 20 || gameState.time < 6;
    const currentDay = gameState.day;
    
    // 紧急事件优先（忽略历史记录）
    // 如果体温过低，增加保暖相关事件概率
    if (currentStatus.bodyTemp < 36.0) {
      const coldEvent = availableEvents.find(e => e.id === 'e4');
      if (coldEvent && Math.random() < 0.4) return coldEvent;
    }
    
    // 如果严重脱水，增加水源相关事件概率
    if (currentStatus.hydration < 30) {
      const waterEvent = availableEvents.find(e => e.id === 'e7');
      if (waterEvent && Math.random() < 0.4) return waterEvent;
    }
    
    // 如果体力过低，增加伤病相关事件概率
    if (currentStatus.stamina < 20) {
      const injuryEvent = availableEvents.find(e => e.id === 'e10');
      if (injuryEvent && Math.random() < 0.3) return injuryEvent;
    }
    
    // 如果在高海拔区域，增加高反相关事件概率
    if (currentElevation > 3000 && currentStatus.conditions.includes('高反')) {
      const rescueEvent = availableEvents.find(e => e.id === 'e6');
      if (rescueEvent && Math.random() < 0.35) return rescueEvent;
    }
    
    // 如果是夜晚，增加方向迷失事件概率
    if (isNight && !hasItem('g4')) {
      const lostEvent = availableEvents.find(e => e.id === 'e5');
      if (lostEvent && Math.random() < 0.5) return lostEvent;
    }
    
    // 根据天气调整事件
    if (currentWeather === WeatherType.BLIZZARD || currentWeather === WeatherType.SNOWY) {
      const weatherEvent = availableEvents.find(e => e.id === 'e4');
      if (weatherEvent && Math.random() < 0.4) return weatherEvent;
    }
    
    // 基于真实事件的触发条件
    if (currentDay > 3 && Math.random() < 0.25) {
      const experienceEvent = availableEvents.find(e => ['e11', 'e13', 'e15'].includes(e.id));
      if (experienceEvent) return experienceEvent;
    }
    
    // 如果玩家表现过于自信，增加警示事件
    if (currentStatus.health > 80 && currentStatus.stamina > 70 && currentStatus.conditions.length === 0 && Math.random() < 0.2) {
      const warningEvent = availableEvents.find(e => ['e12', 'e13', 'e15'].includes(e.id));
      if (warningEvent) return warningEvent;
    }
    
    // 长时间穿越后增加孤独感事件
    if (currentDay > 5 && Math.random() < 0.2) {
      const lonelinessEvent = availableEvents.find(e => e.id === 'e14');
      if (lonelinessEvent) return lonelinessEvent;
    }
    
    // 默认随机选择事件（从未触发的事件中选择）
    return availableEvents[Math.floor(Math.random() * availableEvents.length)];
  }, [gameState, hasItem]);

  const checkGameOver = useCallback((status: PlayerStatus, prevStatus?: PlayerStatus, currentEvent?: RandomEvent): { isOver: boolean, message: string, cause?: string } => {
    let cause: string | undefined;
    let message = '';
    
    // 检查死亡原因并构建链条
    if (status.health <= 0) {
      if (prevStatus && prevStatus.health > 0 && currentEvent) {
        // 事件导致的死亡
        cause = `${currentEvent.title.zh} → 伤害致命 → 死亡`;
      } else if (status.conditions.includes('外伤')) {
        cause = '创伤恶化 → 失血过多 → 死亡';
      }
      message = `${t.deathReason.health} [生命值: ${status.health.toFixed(1)}, 体温: ${status.bodyTemp.toFixed(1)}℃, 水分: ${status.hydration.toFixed(1)}%, 体力: ${status.stamina.toFixed(1)}%]`;
      return { isOver: true, message, cause };
    }
    
    if (status.bodyTemp < 34.0) {
      if (prevStatus && prevStatus.bodyTemp >= 34.0) {
        // 新引发的失温
        if (gameState.weather === WeatherType.BLIZZARD) {
          cause = `暴风雪环境 → 体温急剧下降 → 失温性休克 → 死亡`;
        } else if (gameState.weather === WeatherType.SNOWY) {
          cause = `大雪覆盖 → 无法保温 → 严重失温 → 死亡`;
        } else if (currentEvent) {
          cause = `${currentEvent.title.zh} → 体温丧失 → 失温 → 死亡`;
        } else {
          cause = `长期暴露 → 体温持续下降 → 失温性死亡`;
        }
      }
      message = `${t.deathReason.bodyTemp} [体温: ${status.bodyTemp.toFixed(1)}℃, 生命值: ${status.health.toFixed(1)}, 水分: ${status.hydration.toFixed(1)}%, 体力: ${status.stamina.toFixed(1)}%]`;
      return { isOver: true, message, cause };
    }
    
    if (status.hydration <= 0) {
      if (prevStatus && prevStatus.hydration > 0) {
        if (currentEvent?.title.zh.includes('幻觉')) {
          cause = `高原缺氧 → 幻觉导向 → 无法补水 → 脱水昏迷`;
        } else {
          cause = `补给不足 → 长期脱水 → 器官衰竭 → 死亡`;
        }
      }
      message = `${t.deathReason.hydration} [水分: ${status.hydration.toFixed(1)}%, 生命值: ${status.health.toFixed(1)}, 体温: ${status.bodyTemp.toFixed(1)}℃, 体力: ${status.stamina.toFixed(1)}%]`;
      return { isOver: true, message, cause };
    }
    
    if (status.stamina <= 0 && status.health <= 2) {
      if (prevStatus && prevStatus.stamina > 0) {
        if (status.conditions.includes('高反')) {
          cause = `高原反应 → 体力严重消耗 → 缺氧晕迷 → 死亡`;
        } else if (status.weight > status.maxWeight) {
          cause = `严重超重 → 过度疲劳 → 心脏衰竭 → 死亡`;
        } else {
          cause = `连续行军 → 体力耗尽 → 精力衰竭 → 倒地不起`;
        }
      }
      message = `${t.deathReason.stamina} [体力: ${status.stamina.toFixed(1)}%, 生命值: ${status.health.toFixed(1)}, 体温: ${status.bodyTemp.toFixed(1)}℃, 水分: ${status.hydration.toFixed(1)}%]`;
      return { isOver: true, message, cause };
    }
    
    return { isOver: false, message: '' };
  }, [t.deathReason, gameState.weather]);

  const createStatusAlerts = useCallback((prev: PlayerStatus, next: PlayerStatus, lang: Language) => {
    const alerts: string[] = [];
    const newConditions = next.conditions.filter(c => !prev.conditions.includes(c));

    newConditions.forEach(cond => {
      if (cond === '失温') alerts.push(lang === 'zh' ? `[DANGER] 体温降至 ${next.bodyTemp.toFixed(1)}℃，出现失温，立即保暖/扎营。` : `[DANGER] Body temp dropped to ${next.bodyTemp.toFixed(1)}°C. Hypothermia detected, warm up or camp now.`);
      if (cond === '脱水') alerts.push(lang === 'zh' ? `[DANGER] 水分仅剩 ${next.hydration.toFixed(1)}%，出现脱水，立刻补水。` : `[DANGER] Hydration at ${next.hydration.toFixed(1)}%. Dehydration detected, rehydrate now.`);
      if (cond === '外伤') alerts.push(lang === 'zh' ? `[DANGER] 遭受外伤，健康会持续下降，尽快处理伤口。` : `[DANGER] Injury sustained, health will keep dropping. Treat the wound ASAP.`);
      if (cond === '高反') alerts.push(lang === 'zh' ? `[DANGER] 出现高反症状，放慢速度或使用氧气瓶。` : `[DANGER] Altitude sickness detected. Slow down or use oxygen.`);
    });

    if (prev.health > 20 && next.health <= 20) alerts.push(lang === 'zh' ? `[DANGER] 生命值跌至 ${next.health.toFixed(1)}，注意保命操作。` : `[DANGER] Health dropped to ${next.health.toFixed(1)}. Focus on survival actions.`);

    return alerts;
  }, []);

  const addLog = useCallback((msg: string) => {
    setGameState(p => {
      const newLog = [...p.log, msg];
      if (newLog.length > LOG_LIMIT) newLog.shift();
      return { ...p, log: newLog };
    });
  }, []);

  const handleRouteChoice = async (option: RouteOption) => {
    if (gameState.phase !== 'hiking') return;
    if (gameState.isCamping) {
      addLog(`[SYSTEM] 你需要先打包帐篷才能继续前进。点击下方的"收起"按钮。`);
      return;
    }
    let newProgress = gameState.progress + 1;
    let nextLandmarkIndex = gameState.currentLandmarkIndex;
    let isReachedFinalLandmark = false;
    
    if (newProgress >= 3) {
      newProgress = 0;
      nextLandmarkIndex = Math.min(LANDMARKS.length - 1, gameState.currentLandmarkIndex + 1);
      // 判断是否到达终点（已推进到最后一个地标）
      isReachedFinalLandmark = nextLandmarkIndex === LANDMARKS.length - 1;
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
    const alerts = createStatusAlerts(gameState.status, nextStatus, gameState.language);
    alerts.forEach(alert => addLog(alert));
    const gameOver = checkGameOver(nextStatus, gameState.status);

    // 先判断是否死亡，再判断是否通关
    if (gameOver.isOver) {
      const deathChain = gameOver.cause ? [{ zh: gameOver.cause, en: gameOver.cause }] : [];
      const gs = { ...gameState, phase: 'gameover', status: nextStatus, currentLandmarkIndex: nextLandmarkIndex, progress: newProgress, gameMessage: { zh: gameOver.message, en: gameOver.message }, deathCauseChain: deathChain };
      setGameState({ ...gs, achievements: settleAchievements(gs as GameState) } as GameState);
    } else if (isReachedFinalLandmark) {
      // 到达最后一个地标（厚畛子）则游戏胜利
      const gs = { ...gameState, phase: 'gameover', status: nextStatus, currentLandmarkIndex: nextLandmarkIndex, progress: newProgress, gameMessage: { zh: "厚畛子镇的灯火映照在你颤抖的眼眸。你活着从鳌太线走了出来。\n\n秦岭圣山饶恕了你的渺小。但那些再也无法归家的灵魂，永远凝结在3767米的拔仙台。\n\n⛩️ 【圣山之誓】本游戏仅为虚构修行，真实鳌太穿越千倍死寂。2012-2024年58个灵魂永眠于此——他们都曾认为自己能活着回家。秦岭圣山已于2018年下达禁令，但每年仍有挑战者在风雪中消亡。每一具遗骸都在诉说：自然绝不留情。勿以身试法。勿让亲人哭泣。", en: "THE LIGHTS OF HOUZHENZI SHIMMER THROUGH YOUR TEARS. YOU ESCAPED THE AOTAI ALIVE.\n\nThe Sacred Mountain showed mercy to your insignificance. But 58 souls rest eternally at 3767m Baxiantai—all believed they would return.\n\n⛩️ 【OATH TO THE SACRED MOUNTAIN】This is fictional training only. The real Aotai Trail has slaughtered thousands. Between 2012-2024, 58 bodies were recovered—each belonged to someone who thought they would go home. The Sacred Mountain issued a ban in 2018. Yet every year more challengers freeze in the snow. Every skeleton screams the same truth: Nature shows ZERO mercy. Do not test fate. Do not break your family's hearts." } };
      setGameState({ ...gs, achievements: settleAchievements(gs as GameState) } as GameState);
    } else {
      // 检查是否到达新地标
      const shouldAddStory = nextLandmarkIndex !== gameState.currentLandmarkIndex;
      const isStillSameLandmark = nextLandmarkIndex === gameState.currentLandmarkIndex && newProgress > 0;
      
      // 生成AI叙事（仅当到达新地标时）
      if (shouldAddStory) {
        generateNarrative({ ...gameState, status: nextStatus, weather: nextWeather }, LANDMARKS[nextLandmarkIndex], option.label[gameState.language])
          .then(narrative => addLog(`[D${gameState.day}] ${narrative}`));
      }
      
      setGameState(p => {
          const newDay = p.day + Math.floor((p.time + option.timeCost) / 24);
          if (isNight && !hasItem('g4')) addLog(`[DANGER] ${t.noHeadlamp}`);
          
          const newState = {
            ...p,
            currentLandmarkIndex: nextLandmarkIndex,
            progress: newProgress,
            weather: nextWeather,
            time: (p.time + option.timeCost) % 24,
            day: newDay,
            status: nextStatus,
            achievements: settleAchievements({ ...p, status: nextStatus, day: newDay } as GameState)
          };
          
          // 到达新地标时添加地标故事
          if (shouldAddStory) {
            const landmarkStory = triggerLandmarkStory(nextLandmarkIndex);
            if (landmarkStory) {
              setTimeout(() => addLog(landmarkStory), 1200);
            }
          }
          
          // 在同一地标推进时输出进度提示（仅首次）
          if (isStillSameLandmark && newProgress === 1) {
            setTimeout(() => addLog(`[SYSTEM] ${gameState.language === 'zh' ? `开始推进路段，到达 3/3 将抵达下一地标。` : `Started segment progress. Reach 3/3 to move to next landmark.`}`), 100);
          } else if (isStillSameLandmark) {
            setTimeout(() => addLog(`[SYSTEM] ${gameState.language === 'zh' ? `已推进 ${newProgress}/3` : `Progress ${newProgress}/3`}`), 100);
          }
          
          return newState;
      });
      // 仅在未死亡且未完成游戏的情况下触发随机事件
      if (Math.random() < 0.25) {
        const selectedEvent = selectWeightedEvent();
        setCurrentEvent(selectedEvent);
        setGameState(q => ({ ...q, triggeredEvents: [...q.triggeredEvents, selectedEvent.id] }));
      }
    }
  };

  const handleEventChoice = (choice: EventChoice) => {
    let alerts: string[] = [];
    setGameState(p => {
      let newInventory = [...p.inventory];
      
      // 二次验证并消耗所需物资
      if (choice.requiredItems) {
        // 先验证是否所有物资都足够
        const canConsume = choice.requiredItems.every(required => {
          const item = newInventory.find(i => i.id === required.itemId);
          return item && item.quantity >= required.quantity;
        });
        
        if (!canConsume) {
          // 理论上不应该到这里，因为EventDialog已经验证过
          console.error('物资验证失败，但选择已通过UI验证');
          return p; // 不执行任何操作
        }
        
        // 消耗物资
        choice.requiredItems.forEach(required => {
          const item = newInventory.find(i => i.id === required.itemId);
          if (item) {
            item.quantity -= required.quantity;
            // 记录物资消耗日志
            const itemName = item.name[p.language];
            addLog(`[SYSTEM] 消耗了 ${itemName} x${required.quantity}`);
            
            // 如果数量为0，移除该物品
            if (item.quantity === 0) {
              newInventory = newInventory.filter(i => i.id !== required.itemId);
            }
          }
        });
      }
      
      // 获得奖励物资
      if (choice.rewardItems) {
        choice.rewardItems.forEach(reward => {
          const base = SHOP_ITEMS.find(i => i.id === reward.itemId);
          if (base) {
            const existing = newInventory.find(i => i.id === reward.itemId);
            if (existing) {
              existing.quantity += reward.quantity;
            } else {
              newInventory.push({ ...base, quantity: reward.quantity });
            }
            // 记录获得物资日志
            const itemName = base.name[p.language];
            addLog(`[SYSTEM] 获得了 ${itemName} x${reward.quantity}`);
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
        bodyTemp: choice.bodyTempImpact ? Math.max(34.0, Math.min(37.2, p.status.bodyTemp + choice.bodyTempImpact)) : p.status.bodyTemp,
        hydration: choice.hydrationImpact ? Math.max(0, Math.min(100, p.status.hydration + choice.hydrationImpact)) : p.status.hydration,
        energy: choice.energyImpact ? Math.max(0, Math.min(100, p.status.energy + choice.energyImpact)) : p.status.energy,
        conditions: newConditions
      };
      
      // 统一由calculateWeight计算负重
      // 重量将在最终返回时统一更新
      alerts = createStatusAlerts(p.status, nextStatus, p.language);
      const gameOver = checkGameOver(nextStatus, p.status, currentEvent || undefined);

      if (gameOver.isOver) {
        const deathChain = gameOver.cause ? [{ zh: gameOver.cause, en: gameOver.cause }] : [];
        return { ...p, phase: 'gameover', status: nextStatus, gameMessage: { zh: gameOver.message, en: gameOver.message }, deathCauseChain: deathChain };
      }

      const newLogs = [...p.log, `[EVENT] ${choice.log[p.language]}`].slice(-LOG_LIMIT);

      return {
        ...p,
        inventory: newInventory,
        merit: p.merit + choice.meritImpact,
        peopleSaved: p.peopleSaved + (choice.meritImpact >= 100 ? 1 : 0),
        log: newLogs,
        status: { ...nextStatus, weight: calculateWeight(newInventory) },
        achievements: settleAchievements({ ...p, status: nextStatus, merit: p.merit + choice.meritImpact, peopleSaved: p.peopleSaved + (choice.meritImpact >= 100 ? 1 : 0) } as GameState)
      };
    });
    alerts.forEach(alert => addLog(alert));
    setCurrentEvent(null);
  };

  const handleUseItem = (item: InventoryItem) => {
    if (gameState.phase !== 'hiking') return;
    
    // 装备不应该被"使用"，它们购买后自动装备并持续生效
    if (item.isEquippable && !item.isConsumable) {
      addLog(`[SYSTEM] ${item.name[gameState.language]} 已装备，效果持续生效中`);
      return;
    }
    
    setGameState(p => {
      const invItem = p.inventory.find(i => i.id === item.id);
      if (!invItem || invItem.quantity <= 0) return p;
      const newStatus = invItem.effect(p.status);
      const newInventory = p.inventory.map(i => i.id === item.id ? { ...i, quantity: i.isConsumable ? i.quantity - 1 : i.quantity } : i).filter(i => i.quantity > 0);
      
      const newLogs = [...p.log, `[ACTION] 使用了: ${invItem.name[p.language]}`].slice(-LOG_LIMIT);

      return { 
        ...p, 
        status: { ...newStatus, weight: calculateWeight(newInventory) }, 
        inventory: newInventory, 
        log: newLogs 
      };
    });
  };

  const handleCheckIn = () => {
    if (gameState.phase !== 'hiking') return;
    if (gameState.isCamping) {
      addLog(`[SYSTEM] 你需要先打包帐篷才能继续打卡。点击下方的"收起"按钮。`);
      return;
    }
    if (hasCheckedInCurrent) return;
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
    if (gameState.phase !== 'hiking') return;
    if (gameState.isCamping) {
      addLog(`[SYSTEM] 你需要先打包帐篷才能探索。点击下方的"收起"按钮。`);
      return;
    }
    addLog(`[ACTION] ${t.explore}...`);
    if (Math.random() < 0.3) {
        const selectedEvent = selectWeightedEvent();
        setCurrentEvent(selectedEvent);
        // 记录已触发的事件
        setGameState(p => ({
          ...p,
          triggeredEvents: [...p.triggeredEvents, selectedEvent.id]
        }));
    } else {
      addLog(`[SYSTEM] 这里的乱石堆中除了积雪和枯草，没有任何发现。`);
    }
    const prevStatus = gameState.status;
    const nextStatus = updateStatus(prevStatus, gameState.weather, 1, 'active');
    const alerts = createStatusAlerts(prevStatus, nextStatus, gameState.language);
    alerts.forEach(alert => addLog(alert));
    setGameState(p => ({
      ...p,
      time: (p.time + 1) % 24,
      status: nextStatus
    }));
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
    const prevStatus = gameState.status;
    const nextStatus = updateStatus(prevStatus, gameState.weather, hours, 'sleep');
    const alerts = createStatusAlerts(prevStatus, nextStatus, gameState.language);
    alerts.forEach(alert => addLog(alert));
    const gameOver = checkGameOver(nextStatus, prevStatus);

    if (gameOver.isOver) {
      const deathChain = gameOver.cause ? [{ zh: gameOver.cause, en: gameOver.cause }] : [];
      setGameState(p => ({ ...p, phase: 'gameover', status: nextStatus, gameMessage: { zh: gameOver.message, en: gameOver.message }, deathCauseChain: deathChain }));
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
    const prevStatus = gameState.status;
    const nextStatus = updateStatus(prevStatus, gameState.weather, hours, 'passive');
    nextStatus.stamina = Math.min(100, nextStatus.stamina + 20);
    const alerts = createStatusAlerts(prevStatus, nextStatus, gameState.language);
    alerts.forEach(alert => addLog(alert));
    const gameOver = checkGameOver(nextStatus, prevStatus);

    if (gameOver.isOver) {
      const deathChain = gameOver.cause ? [{ zh: gameOver.cause, en: gameOver.cause }] : [];
      setGameState(p => ({ ...p, phase: 'gameover', status: nextStatus, gameMessage: { zh: gameOver.message, en: gameOver.message }, deathCauseChain: deathChain }));
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
    
      // 使用统一的负重计算函数
      const weight = calculateWeight(mergedInventory);
    
      if (cost > gameState.gold || weight > 25) return;

    // 添加背景故事和出发日志
    const storyLogs = [
      `[STORY] ${gameState.language === 'zh' ? '你站在塘口村的入口处，望着巍峨的秦岭山脉。这条鳌太线被誉为“中华龙脊”，同时也是中国最危险的徒步线路之一。' : 'You stand at the entrance of Tangkou Village, gazing at the majestic Qinling Mountains. This Aotai Trail is known as the "Dragon Spine of China" and also one of the most dangerous hiking routes in the country.'}`,
      `[STORY] ${gameState.language === 'zh' ? '无数徒步者曾在这里留下足迹，也有不少人永远留在了这里。你检查了一遍装备，深吸一口气，踏上了这条充满未知的道路。' : 'Countless hikers have left their footprints here, and many have remained forever. You check your equipment, take a deep breath, and step onto this road full of unknowns.'}`,
      `[SYSTEM] ${gameState.language === 'zh' ? '征途开启。秦岭鳌太线：非经允许严禁穿越。' : 'Journey begins. Qinling Aotai Trail: Unauthorized crossing prohibited.'}`
    ];

    // 自动装备可装备的物品
    let autoEquippedInventory = [...mergedInventory];
    let equippedStatus = {...gameState.status};
    
    // 创建一个Set来跟踪已装备的装备槽位，避免重复装备相同槽位的装备
    const equippedSlots = new Set<string>();
    
    // 第一遍：处理已装备的物品，将它们的效果应用到状态中
    for (const item of autoEquippedInventory) {
      if (item.isEquipped && item.effect) {
        equippedStatus = item.effect(equippedStatus);
      }
    }
    
    // 第二遍：自动装备可装备但尚未装备的物品
    autoEquippedInventory = autoEquippedInventory.map(item => {
      if (item.isEquippable && item.quantity > 0 && !item.isEquipped) {
        // 如果该槽位尚未装备，则进行装备
        const slot = item.equipmentSlot || 'other';
        if (!equippedSlots.has(slot)) {
          // 标记为已装备
          const equippedItem = { ...item, isEquipped: true };
          
          // 应用装备效果（仅对一件装备应用效果，因为装备效果不应随数量叠加）
          if (equippedItem.effect) {
            equippedStatus = equippedItem.effect(equippedStatus);
          }
          
          // 标记此槽位已装备
          equippedSlots.add(slot);
          
          return equippedItem;
        }
      }
      return item;
    });

    setGameState(p => ({ 
      ...p, 
      phase: 'hiking', 
      gold: p.gold - cost, 
      inventory: autoEquippedInventory, 
      startWeight: weight, 
      status: { ...equippedStatus, weight }, 
      log: storyLogs
    }));
  };

  const triggerLandmarkStory = useCallback((landmarkIndex: number) => {
    const landmark = LANDMARKS[landmarkIndex];
    const landmarkStories = {
       0: `[STORY] ${gameState.language === 'zh' ? '塘口村是鳌太线的传统起点，许多徒步者在这里做最后的补给和准备。村里的老人常说："鳌太无情，山神不留任性之人"。' : 'Tangkou Village is the traditional starting point of the Aotai Trail, where many hikers make their final preparations. The elderly villagers often say: "Aotai has no mercy, the mountain god does not spare the reckless."'}`,
       1: `[STORY] ${gameState.language === 'zh' ? '海拔2800米的高度标志着你正式进入了秦岭腹地。这里的空气开始变得稀薄，原始森林展现出原始而神秘的面貌。' : 'At 2800 meters elevation, you officially enter the heart of the Qinling Mountains. The air begins to thin, and the primeval forest reveals its primitive and mysterious appearance.'}`,
       2: `[STORY] ${gameState.language === 'zh' ? '盆景园以其独特的高山灌丛景观闻名，这里的植物因长期受风雪侵蚀而形成奇特的造型，宛如天然盆景。' : 'Sobing Garden is famous for its unique alpine shrub landscape. The plants here have formed peculiar shapes due to long-term erosion by wind and snow, resembling natural bonsai.'}`,
       3: `[STORY] ${gameState.language === 'zh' ? '荞麦梁因其形状酷似荞麦而得名，这里是整个鳌太线上最为险峻的地段之一，稍有不慎就可能坠入万丈深渊。' : 'Buckwheat Ridge got its name from its resemblance to buckwheat. This is one of the most dangerous sections of the entire Aotai Trail, where a slight misstep could lead to a fatal fall.'}`,
       4: `[STORY] ${gameState.language === 'zh' ? '跑马梁是一片广阔的高山草甸，相传古时候有军队在此训练战马。开阔的地势让人一览众山小，但也意味着暴露在恶劣天气中无处可藏。' : 'Paoma Ridge is a vast alpine meadow, said to have been used in ancient times to train war horses. The open terrain offers panoramic views, but also means exposure to harsh weather with nowhere to hide.'}`,
       5: `[STORY] ${gameState.language === 'zh' ? '拔仙台海拔3767米，是秦岭的最高峰。站在这里，仿佛伸手即可触及天际。但高海拔带来的缺氧和严寒也让这里成为徒步者的终极考验。' : 'Baxiantai stands at 3767 meters, the highest peak of the Qinling Mountains. Standing here, it feels like you can reach the sky. But the oxygen deprivation and severe cold brought by high altitude make this the ultimate test for hikers.'}`,
       6: `[STORY] ${gameState.language === 'zh' ? '厚畛子镇标志着鳌太线的终点。无数徒步者带着疲惫的身躯和满载回忆的心灵抵达这里，完成了人生中最难忘的旅程之一。' : 'Houzhenzi Town marks the end of the Aotai Trail. Countless hikers arrive here with exhausted bodies and hearts full of memories, completing one of the most unforgettable journeys of their lives.'}`
     };
    
    return landmarkStories[landmarkIndex as keyof typeof landmarkStories] || '';
  }, [gameState.language]);

  const resetToHome = () => {
    setGameState(p => ({
      ...INITIAL_GAME_STATE,
      achievements: p.achievements // 保留已解锁成就
    }));
  };

  if (gameState.phase === 'landing') {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-950 p-6 relative hardware-accel overflow-hidden">
        {showQuiz && !showQuizResult && (
          <div className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6 hardware-accel animate-in fade-in duration-300">
            <div className="max-w-2xl w-full cyber-panel p-8 rounded-[2rem] border border-amber-500/30 flex flex-col max-h-[85vh]">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-black italic text-amber-400 uppercase tracking-tighter">❓ {gameState.language === 'zh' ? '户外知识问答' : 'Outdoor Knowledge Quiz'}</h2>
                <button onClick={() => { setShowQuiz(false); setCurrentQuizIndex(0); setQuizAnswers([]); }} className="text-slate-500 hover:text-white transition-colors">✕</button>
              </div>
              <p className="text-xs text-slate-400 mb-4">{`${currentQuizIndex + 1}/${QUIZ_QUESTIONS.length}`}</p>
              
              <div className="flex-grow overflow-y-auto custom-scrollbar space-y-4 mb-4">
                <h3 className="text-sm font-bold text-white">{QUIZ_QUESTIONS[currentQuizIndex].question[gameState.language]}</h3>
                <div className="space-y-2">
                  {QUIZ_QUESTIONS[currentQuizIndex].options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        const newAnswers = [...quizAnswers];
                        newAnswers[currentQuizIndex] = idx;
                        setQuizAnswers(newAnswers);
                      }}
                      className={`w-full text-left p-3 rounded-lg border transition-all text-xs ${
                        quizAnswers[currentQuizIndex] === idx
                          ? 'bg-amber-500/20 border-amber-500/60 text-amber-300'
                          : 'bg-slate-900/50 border-white/10 text-slate-300 hover:border-amber-500/30'
                      }`}
                    >
                      <span className="font-bold">{String.fromCharCode(65 + idx)}.</span> {opt[gameState.language]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (currentQuizIndex > 0) setCurrentQuizIndex(currentQuizIndex - 1);
                  }}
                  disabled={currentQuizIndex === 0}
                  className="px-4 py-2 bg-slate-800 text-slate-400 rounded-lg text-xs font-bold disabled:opacity-50"
                >
                  {gameState.language === 'zh' ? '上一题' : 'Previous'}
                </button>
                {currentQuizIndex === QUIZ_QUESTIONS.length - 1 ? (
                  <button
                    onClick={() => setShowQuizResult(true)}
                    className="flex-1 py-2 bg-amber-500 text-black rounded-lg text-xs font-bold hover:bg-amber-600 transition-all"
                  >
                    {gameState.language === 'zh' ? '提交答案' : 'Submit'}
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrentQuizIndex(currentQuizIndex + 1)}
                    className="flex-1 py-2 bg-amber-500 text-black rounded-lg text-xs font-bold hover:bg-amber-600 transition-all"
                  >
                    {gameState.language === 'zh' ? '下一题' : 'Next'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {showQuizResult && (
          <div className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6 hardware-accel animate-in fade-in duration-300">
            <div className="max-w-2xl w-full cyber-panel p-8 rounded-[2rem] border border-amber-500/30 flex flex-col max-h-[85vh]">
              <h2 className="text-2xl font-black italic text-white uppercase tracking-tighter mb-6 text-center">{gameState.language === 'zh' ? '答题结果' : 'Quiz Results'}</h2>
              
              <div className="flex-grow overflow-y-auto custom-scrollbar space-y-4 mb-6">
                {QUIZ_QUESTIONS.map((q, idx) => {
                  const isCorrect = quizAnswers[idx] === q.correctAnswer;
                  return (
                    <div key={q.id} className={`p-4 rounded-lg border ${isCorrect ? 'bg-green-950/30 border-green-500/40' : 'bg-red-950/30 border-red-500/40'}`}>
                      <p className="text-xs font-bold mb-2">
                        {idx + 1}. {q.question[gameState.language]}
                      </p>
                      <p className={`text-xs mb-2 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                        {gameState.language === 'zh' ? '你的答案：' : 'Your answer: '} {q.options[quizAnswers[idx]][gameState.language]}
                      </p>
                      {!isCorrect && (
                        <p className="text-xs text-amber-300 mb-2">
                          {gameState.language === 'zh' ? '正确答案：' : 'Correct answer: '} {q.options[q.correctAnswer][gameState.language]}
                        </p>
                      )}
                      <p className="text-xs text-slate-300 italic">{q.explanation[gameState.language]}</p>
                    </div>
                  );
                })}
              </div>

              <div className="text-center mb-4 space-y-3">
                <p className="text-lg font-black text-white">
                  {gameState.language === 'zh' ? '答题正确率：' : 'Accuracy: '}
                  <span className="text-amber-400">{Math.round((quizAnswers.filter((a, i) => a === QUIZ_QUESTIONS[i].correctAnswer).length / QUIZ_QUESTIONS.length) * 100)}%</span>
                </p>
                {(() => {
                  const accuracy = Math.round((quizAnswers.filter((a, i) => a === QUIZ_QUESTIONS[i].correctAnswer).length / QUIZ_QUESTIONS.length) * 100);
                  let comment = { zh: '', en: '' };
                  let emoji = '';
                  let colorClass = '';
                  
                  if (accuracy === 100) {
                    comment = { 
                      zh: '🎉 完美无缺！你完全掌握了户外生存的核心知识。山神会眷顾有准备的人。', 
                      en: '🎉 PERFECT! You have mastered outdoor survival knowledge. The Mountain God favors the prepared.' 
                    };
                    colorClass = 'text-emerald-400';
                  } else if (accuracy >= 90) {
                    comment = { 
                      zh: '🏔️ 优秀！你的知识储备已经达到了经验丰富的登山者水平。', 
                      en: '🏔️ EXCELLENT! Your knowledge rivals experienced mountaineers.' 
                    };
                    colorClass = 'text-green-400';
                  } else if (accuracy >= 80) {
                    comment = { 
                      zh: '✅ 良好！你已具备基本的户外生存能力，但仍需加深理解。', 
                      en: '✅ GOOD! You have basic survival skills but need deeper understanding.' 
                    };
                    colorClass = 'text-sky-400';
                  } else if (accuracy >= 60) {
                    comment = { 
                      zh: '⚠️ 及格！你掌握了一些知识，但进山前还需更多准备和学习。', 
                      en: '⚠️ PASS! You know some basics but need more preparation before entering mountains.' 
                    };
                    colorClass = 'text-yellow-400';
                  } else if (accuracy >= 40) {
                    comment = { 
                      zh: '❌ 危险！你的知识储备不足以应对野外险境。请认真学习后再考虑户外活动。', 
                      en: '❌ DANGEROUS! Your knowledge is insufficient for wilderness. Study before attempting outdoor activities.' 
                    };
                    colorClass = 'text-orange-400';
                  } else {
                    comment = { 
                      zh: '🚫 致命！以你目前的知识水平进山，几乎等于自杀。秦岭圣山绝不留情于无知者。', 
                      en: '🚫 FATAL! Entering mountains with your current knowledge is nearly suicidal. The Sacred Mountain shows no mercy to the ignorant.' 
                    };
                    colorClass = 'text-red-500';
                  }
                  
                  return (
                    <div className="bg-slate-900/50 border border-white/10 rounded-lg p-4">
                      <p className={`text-sm font-bold ${colorClass} leading-relaxed`}>
                        {comment[gameState.language]}
                      </p>
                    </div>
                  );
                })()}
              </div>

              <button
                onClick={() => {
                  setShowQuizResult(false);
                  setShowQuiz(false);
                  setCurrentQuizIndex(0);
                  setQuizAnswers([]);
                }}
                className="w-full py-3 bg-white text-black rounded-lg text-xs font-bold hover:bg-slate-200 transition-all"
              >
                {gameState.language === 'zh' ? '关闭' : 'Close'}
              </button>
            </div>
          </div>
        )}
        
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
             <div className="grid grid-cols-2 gap-2">
               <button onClick={() => setShowAchievements(true)} className="py-3 bg-slate-900 border border-sky-500/30 text-sky-400 font-black rounded-2xl uppercase tracking-[0.2em] hover:bg-slate-800 transition-all text-xs">🏆 {gameState.language === 'zh' ? '成就' : 'Achievements'}</button>
               <button onClick={() => { setCurrentQuizIndex(0); setQuizAnswers([]); setShowQuiz(true); }} className="py-3 bg-slate-900 border border-amber-500/30 text-amber-400 font-black rounded-2xl uppercase tracking-[0.2em] hover:bg-slate-800 transition-all text-xs">❓ {gameState.language === 'zh' ? '知识问答' : 'Quiz'}</button>
             </div>
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
      {currentEvent && <EventDialog event={currentEvent} language={gameState.language} inventory={gameState.inventory} onChoice={handleEventChoice} />}
      
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
             <div key={i} className={`text-[11px] leading-relaxed pl-3 border-l-2 transition-all duration-500 animate-in slide-in-from-left-1 ${
               l.includes('[DANGER]') ? 'text-red-400 border-red-900' : 
               l.startsWith('[SYSTEM]') ? 'text-sky-400 border-sky-900' : 
               l.startsWith('[EVENT]') ? 'text-amber-400 border-amber-900' : 
               l.startsWith('[STORY]') ? 'text-purple-400 border-purple-900' : 
               l.startsWith('[GUIDE]') ? 'text-emerald-400 border-emerald-900' :
               'text-slate-400 border-slate-800'
             }`}>
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
               <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest border border-white/5 rounded-xl px-3 py-2 bg-slate-900/40 flex flex-col gap-1">
                 <div className="flex items-center justify-between">
                   <span>{t.progressLabel}</span>
                   <span className="text-sky-400 font-mono">{gameState.progress}/3</span>
                 </div>
                 <span className="text-slate-500 font-normal normal-case tracking-normal text-[9px]">{t.progressHint}</span>
               </div>
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
                <h2 className={`text-4xl md:text-5xl font-black italic uppercase tracking-tighter ${gameState.currentLandmarkIndex === LANDMARKS.length - 1 && gameState.status.health > 0 ? 'text-emerald-500' : 'text-neon-red text-red-700'}`}>
                   {gameState.currentLandmarkIndex === LANDMARKS.length - 1 && gameState.status.health > 0 ? t.success : t.failed}
                </h2>
                <p className="text-slate-300 text-xs leading-relaxed italic border-y border-white/5 py-6 px-4">{gameState.gameMessage[gameState.language]}</p>
                {gameState.deathCauseChain.length > 0 && (
                  <div className="bg-red-950/30 border border-red-700/50 rounded-lg px-4 py-3 text-left">
                    <p className="text-red-400 text-[10px] font-black uppercase tracking-widest mb-2">【死亡原因链条】</p>
                    <p className="text-red-300 text-xs font-mono leading-relaxed">{gameState.deathCauseChain[0][gameState.language]}</p>
                  </div>
                )}
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
    progressLabel: '路段推进',
    progressHint: '到 3/3 将抵达下一地标',
    rest: '原地休息',
    camp: '扎营驻守',
    sleep: '深度睡眠',
    packup: '拔营',
    checkin: '数字签到',
    achievements: '成就系统',
    achievementList: '荣耀殿堂 (成就)',
    restDesc: '小憩 (体力+20)',
    failed: '山神收割灵魂',
    success: '活着离开了圣山',
    reboot: '重新进入',
    empty: '行囊空空...',
    gold: '点数',
    cart: '交易清单',
    cost: '总计',
    explore: '搜寻周边',
    guide: '求助向导',
    noHeadlamp: '夜晚光线不足，极其危险！',
    warning: '【圣山禁地】鳌太线为自然保护区禁区。秦岭山神的领地，非许可严禁涉足。此处已夺58条人命。山不测，人不寿。',
    background: '你翻越了围栏，踏入了圣山的禁地。现在，秦岭将审判你的每一步。',
    deathReason: {
      health: '秦岭吞没了你。你成了这座圣山永恒的子民。',
      stamina: '体力耗尽的那一刻，你跪倒在乱石之中。山神见证了你的最后呼吸。',
      bodyTemp: '极寒如刀刃剖开你的灵魂。你在白色的永恒中沉睡了。',
      hydration: '干渴是最温柔的死法。你在幻觉中微笑着闭上了眼。'
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
    progressLabel: 'Segment progress',
    progressHint: 'Reach 3/3 to move to the next landmark',
    rest: 'Rest',
    camp: 'Camp',
    sleep: 'Sleep',
    packup: 'Pack Up',
    checkin: 'Check-in',
    achievements: 'Achievements',
    achievementList: 'Hall of Fame',
    restDesc: 'Brief respite (+20 Stamina)',
    failed: 'CONSUMED BY SACRED MOUNTAIN',
    success: 'BLESSED & RETURNED',
    reboot: 'Reboot',
    empty: 'Empty...',
    gold: 'Credits',
    cart: 'Cart',
    cost: 'Total',
    explore: 'Explore',
    guide: 'Ask Guide',
    noHeadlamp: 'Night falls upon the Sacred Mountain. Darkness here devours the unprepared!',
    warning: '【SACRED FORBIDDEN ZONE】The Aotai Trail is the inner sanctum of the Sacred Mountain. Entry without permission is strictly forbidden. 58+ have perished here. The mountain judges all trespassers.',
    background: 'You crossed the barrier into the Sacred Mountain\'s forbidden realm. Every step is now judged by eternity.',
    deathReason: {
      health: 'The Sacred Mountain absorbed your body. You are now eternal.',
      stamina: 'You collapsed between ancient stones. The mountain witnessed your last breath.',
      bodyTemp: 'Hypothermia became your gateway. You sleep in endless white.',
      hydration: 'Thirst gave you the gentlest death. You smiled as darkness took you.'
    },
    categories: { food: 'Food', water: 'Water', gear: 'Gear', med: 'Meds' },
    seasons: { [Season.SPRING]: 'Spring', [Season.SUMMER]: 'Summer', [Season.AUTUMN]: 'Autumn', [Season.WINTER]: 'Winter' }
  }
};

export default App;
