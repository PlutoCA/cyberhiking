
import { Landmark, WeatherType, PlayerStatus, InventoryItem, GameState, Language, Season, Achievement, RandomEvent } from './types';

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'a1', name: { zh: '敬畏自然', en: 'Respect Nature' }, description: { zh: '成功完成穿越，明白禁区的危险', en: 'Finish the trail' }, unlocked: false, category: 'exploration', icon: '🛡️' },
  { id: 'a2', name: { zh: '赛博菩萨', en: 'Cyber Buddha' }, description: { zh: '累计获得100点赛博功德', en: '100+ Cyber Merit' }, unlocked: false, category: 'merit', icon: '🌀' },
  { id: 'a3', name: { zh: '救死扶伤', en: 'Lifesaver' }, description: { zh: '在途中成功营救他人', en: 'Rescued a hiker' }, unlocked: false, category: 'merit', icon: '🆘' },
  { id: 'a4', name: { zh: '极寒战神', en: 'Winter Warrior' }, description: { zh: '在冬季完成穿越挑战', en: 'Winter Victory' }, unlocked: false, category: 'challenge', icon: '❄️' },
  { id: 'a5', name: { zh: '巅峰极客', en: 'Peak Geek' }, description: { zh: '成功登顶海拔3767米的太白山拔仙台', en: 'Reached the highest peak Baxiantai' }, unlocked: false, category: 'exploration', icon: '🏔️' },
  { id: 'a6', name: { zh: '生存专家', en: 'Survival Expert' }, description: { zh: '在无人区存活超过5天', en: 'Survived over 5 days' }, unlocked: false, category: 'survival', icon: '⛺' },
  { id: 'a7', name: { zh: '负重前行', en: 'Heavy Loader' }, description: { zh: '以超过22kg的负重开启征途', en: 'Start with 22kg+ weight' }, unlocked: false, category: 'challenge', icon: '🎒' },
  { id: 'a8', name: { zh: '环保先锋', en: 'Eco Pioneer' }, description: { zh: '通过清理垃圾获得超过50点功德', en: '50+ Merit from trash' }, unlocked: false, category: 'merit', icon: '♻️' },
  { id: 'a9', name: { zh: '足迹记录者', en: 'Footprint Tracer' }, description: { zh: '在3个不同的重要点位完成数字签到', en: 'Check-in at 3 unique landmarks' }, unlocked: false, category: 'exploration', icon: '📍' },
  { id: 'a10', name: { zh: '鳌太万事通', en: 'Aotai Navigator' }, description: { zh: '在鳌太全线所有重要点位完成签到', en: 'Check-in at all landmarks' }, unlocked: false, category: 'exploration', icon: '🗺️' },
];

export const LANDMARKS: Landmark[] = [
  { 
    id: 'l1', name: { zh: '塘口村', en: 'Tangkou Village' }, elevation: 1200, 
    description: { zh: '进山的起点，两侧是郁郁葱葱的林间小道。', en: 'Entrance to the mountain trail.' }, 
    sceneryKeywords: 'forest path village', 
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=1200',
    options: [{ id: 'o1', label: { zh: '开始拔高', en: 'Start Ascent' }, risk: 0.02, staminaCost: 5, timeCost: 2, description: { zh: '开始漫长的爬升。', en: 'Begin the long climb.' } }]
  },
  { 
    id: 'l2', name: { zh: '2800峰', en: '2800 Peak' }, elevation: 2800, 
    description: { zh: '原始森林的边缘，坡度陡峭，空气开始变得清冷。', en: 'Edge of the ancient forest.' }, 
    sceneryKeywords: 'steep forest mist', 
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200',
    options: [{ id: 'o2', label: { zh: '向山脊推进', en: 'Push to Ridge' }, risk: 0.05, staminaCost: 8, timeCost: 3, description: { zh: '向更高的山脊线迈进。', en: 'Moving towards the ridge line.' } }]
  },
  { 
    id: 'l3', name: { zh: '盆景园', en: 'Sobing Garden' }, elevation: 3100, 
    description: { zh: '奇松异石，海拔已在3000米之上。', en: 'Ancient pines and strange rocks.' }, 
    sceneryKeywords: 'alpine pines rocks', 
    imageUrl: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1200',
    options: [{ id: 'o3', label: { zh: '跨越石海', en: 'Cross Rock Sea' }, risk: 0.10, staminaCost: 12, timeCost: 4, description: { zh: '在巨大的乱石中寻找路径。', en: 'Navigating through massive boulders.' } }]
  },
  { 
    id: 'l4', name: { zh: '荞麦梁', en: 'Buckwheat Ridge' }, elevation: 3300, 
    description: { zh: '极其险峻的窄脊，风声在耳边咆哮。', en: 'Dangerous razor-thin ridge.' }, 
    sceneryKeywords: 'knife ridge gale', 
    imageUrl: 'https://images.unsplash.com/photo-1544198365-f5d60b6d8190?auto=format&fit=crop&q=80&w=1200',
    options: [{ id: 'o4', label: { zh: '贴脊横切', en: 'Ridge Crossing' }, risk: 0.15, staminaCost: 15, timeCost: 5, description: { zh: '全神贯注通过险路。', en: 'Concentrate on the dangerous path.' } }]
  },
  { 
    id: 'l5', name: { zh: '跑马梁', en: 'Paoma Ridge' }, elevation: 3450, 
    description: { zh: '一望无际的高山荒原，毫无遮挡，失温风险极高。', en: 'Exposed alpine plateau.' }, 
    sceneryKeywords: 'flat ridge grass', 
    imageUrl: 'https://images.unsplash.com/photo-1444492417251-9c84a5fa18e0?auto=format&fit=crop&q=80&w=1200',
    options: [{ id: 'o5', label: { zh: '冲刺最高峰', en: 'Final Sprint' }, risk: 0.10, staminaCost: 18, timeCost: 4, description: { zh: '目标直指拔仙台。', en: 'Targeting Baxiantai.' } }]
  },
  { 
    id: 'l6', name: { zh: '拔仙台', en: 'Baxiantai' }, elevation: 3767, 
    description: { zh: '秦岭主峰之巅，云海翻腾。', en: 'Summit of the Qinling Mountains.' }, 
    sceneryKeywords: 'summit cloud sea', 
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200',
    options: [{ id: 'o6', label: { zh: '下撤厚畛子', en: 'Descend' }, risk: 0.08, staminaCost: 10, timeCost: 6, description: { zh: '漫长的下山路。', en: 'Long descent.' } }]
  },
  { 
    id: 'l7', name: { zh: '厚畛子', en: 'Houzhenzi' }, elevation: 1100, 
    description: { zh: '终点站。炊烟袅袅，终于回归人间。', en: 'The finish line village.' }, 
    sceneryKeywords: 'village home lights', 
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fee74a62?auto=format&fit=crop&q=80&w=1200',
    options: []
  }
];

export const SHOP_ITEMS: InventoryItem[] = [
  // --- 食物类 (Food) ---
  { id: 'f1', name: { zh: '压缩饼干', en: 'Energy Biscuit' }, type: 'food', quality: 'basic', description: { zh: '100g/块。高能量，口感略硬，但极其耐饿。', en: '100g energy bar. Dense and filling.' }, quantity: 0, weight: 0.1, cost: 10, isConsumable: true, effect: (s) => ({ ...s, energy: Math.min(100, s.energy + 20), stamina: Math.min(100, s.stamina + 10) }) },
  { id: 'f2', name: { zh: '风干牛肉', en: 'Beef Jerky' }, type: 'food', quality: 'pro', description: { zh: '高蛋白。有效修复疲劳，增强耐力。', en: 'High protein. Great for recovery.' }, quantity: 0, weight: 0.15, cost: 45, isConsumable: true, effect: (s) => ({ ...s, energy: Math.min(100, s.energy + 40), stamina: Math.min(100, s.stamina + 25) }) },
  { id: 'f3', name: { zh: '能量胶', en: 'Energy Gel' }, type: 'food', quality: 'elite', description: { zh: '快速吸收碳水。瞬间爆发体能。', en: 'Rapid absorption carbs. Quick burst.' }, quantity: 0, weight: 0.05, cost: 35, isConsumable: true, effect: (s) => ({ ...s, stamina: Math.min(100, s.stamina + 40), energy: Math.min(100, s.energy + 5) }) },
  { id: 'f4', name: { zh: '军用MRE自热套餐', en: 'Military MRE' }, type: 'food', quality: 'pro', description: { zh: '500g。包含主食、副食及加热袋。在极寒中提供热量。', en: '500g. Hot meal for extreme conditions.' }, quantity: 0, weight: 0.5, cost: 80, isConsumable: true, effect: (s) => ({ ...s, energy: Math.min(100, s.energy + 60), bodyTemp: Math.min(37.2, s.bodyTemp + 0.2) }) },
  { id: 'f5', name: { zh: '黑巧克力排', en: 'Dark Chocolate' }, type: 'food', quality: 'basic', description: { zh: '50g。快速补充糖分。', en: 'Sugar kick.' }, quantity: 0, weight: 0.05, cost: 20, isConsumable: true, effect: (s) => ({ ...s, energy: Math.min(100, s.energy + 15), stamina: Math.min(100, s.stamina + 5) }) },

  // --- 水源类 (Water) ---
  { id: 'w1', name: { zh: '纯净水 (1L)', en: 'Purified Water (1L)' }, type: 'water', quality: 'basic', description: { zh: '1.0kg。核心生存必需品。', en: '1kg weight. Survival essential.' }, quantity: 0, weight: 1.0, cost: 10, isConsumable: true, effect: (s) => ({ ...s, hydration: Math.min(100, s.hydration + 50) }) },
  { id: 'w2', name: { zh: '电解质冲剂', en: 'Electrolytes' }, type: 'water', quality: 'pro', description: { zh: '快速补盐，预防抽搐。', en: 'Replace salts.' }, quantity: 0, weight: 0.02, cost: 30, isConsumable: true, treats: '脱水', effect: (s) => ({ ...s, hydration: Math.min(100, s.hydration + 20), stamina: Math.min(100, s.stamina + 10), conditions: s.conditions.filter(c => c !== '脱水') }) },
  { id: 'w3', name: { zh: '速效净水片', en: 'Water Purification' }, type: 'water', quality: 'pro', description: { zh: '允许直接补给野外雪水而不会腹泻。', en: 'Purify wild water.' }, quantity: 0, weight: 0.01, cost: 40, isConsumable: true, effect: (s) => s },

  // --- 装备类 (Gear) ---
  { id: 'g1', name: { zh: '硬壳Gore-Tex冲锋衣', en: 'Gore-Tex Jacket' }, type: 'gear', quality: 'pro', description: { zh: '0.5kg。顶级防风防水，失温风险减半。', en: '0.5kg. Wind and rain protection.' }, quantity: 0, weight: 0.5, cost: 450, isConsumable: false, effect: (s) => s },
  { id: 'g2', name: { zh: '三季高山帐', en: 'Alpine Tent' }, type: 'gear', quality: 'elite', description: { zh: '2.2kg。抗风避风港。', en: '2.2kg. Extreme wind shelter.' }, quantity: 0, weight: 2.2, cost: 650, isConsumable: false, effect: (s) => s },
  { id: 'g3', name: { zh: '800蓬羽绒睡袋', en: 'Down Sleeping Bag' }, type: 'gear', quality: 'pro', description: { zh: '1.2kg。极限温标-20℃。', en: '1.2kg. Extreme warmth.' }, quantity: 0, weight: 1.2, cost: 500, isConsumable: false, effect: (s) => s },
  { id: 'g4', name: { zh: '强光LED头灯', en: 'High-Power Headlamp' }, type: 'gear', quality: 'pro', description: { zh: '夜间行军必备，视野清晰。', en: 'Essential for night travel.' }, quantity: 0, weight: 0.1, cost: 180, isConsumable: false, effect: (s) => s },
  { id: 'g5', name: { zh: '一体式炉头+气罐', en: 'Stove & Gas' }, type: 'gear', quality: 'pro', description: { zh: '0.6kg。融雪化水，提供核心体温。', en: '0.6kg. Melt snow for water.' }, quantity: 0, weight: 0.6, cost: 200, isConsumable: true, effect: (s) => s },
  { id: 'g7', name: { zh: '钛合金折叠登山杖', en: 'Titanium Poles' }, type: 'gear', quality: 'elite', description: { zh: '0.3kg。极轻，显著减少体力消耗。', en: 'Ultra-light. Saves stamina.' }, quantity: 0, weight: 0.3, cost: 350, isConsumable: false, effect: (s) => s },
  { id: 'g8', name: { zh: '卫星通讯终端', en: 'Satellite Terminal' }, type: 'gear', quality: 'elite', description: { zh: '0.4kg。在极端状态下可消耗100点功德强制撤回。', en: 'Emergency satellite comms.' }, quantity: 0, weight: 0.4, cost: 800, isConsumable: false, effect: (s) => s },

  // --- 医疗类 (Med) ---
  { id: 'm1', name: { zh: '综合急救箱', en: 'Full First-Aid Kit' }, type: 'med', quality: 'basic', description: { zh: '处理外伤与止血。', en: 'Treats minor injuries.' }, quantity: 0, weight: 0.3, cost: 60, isConsumable: true, treats: '外伤', effect: (s) => ({ ...s, health: Math.min(100, s.health + 30), conditions: s.conditions.filter(c => c !== '外伤') }) },
  { id: 'm2', name: { zh: '便携式氧气瓶', en: 'Oxygen Tank' }, type: 'med', quality: 'pro', description: { zh: '对抗急性高反。', en: 'Relieves altitude sickness.' }, quantity: 0, weight: 0.2, cost: 150, isConsumable: true, treats: '高反', effect: (s) => ({ ...s, health: Math.min(100, s.health + 10), stamina: Math.min(100, s.stamina + 20), conditions: s.conditions.filter(c => c !== '高反') }) },
  { id: 'm3', name: { zh: '布洛芬缓释胶囊', en: 'Ibuprofen' }, type: 'med', quality: 'basic', description: { zh: '止痛退烧，压制寒冷不适。', en: 'Pain relief.' }, quantity: 0, weight: 0.05, cost: 50, isConsumable: true, effect: (s) => ({ ...s, health: Math.min(100, s.health + 15), stamina: Math.min(100, s.stamina + 5) }) },
  { id: 'm5', name: { zh: '专业防冻膏', en: 'Frostbite Cream' }, type: 'med', quality: 'pro', description: { zh: '涂抹后可暂时锁定核心体温流失速度。', en: 'Prevents frostbite.' }, quantity: 0, weight: 0.1, cost: 120, isConsumable: true, effect: (s) => ({ ...s, bodyTemp: Math.min(37.2, s.bodyTemp + 0.1) }) },
];

export const INITIAL_STATUS: PlayerStatus = {
  health: 100,
  stamina: 100,
  hydration: 100,
  bodyTemp: 37.0,
  energy: 100,
  weight: 3.2, // 2.0背包 + 0.1*2饼干 + 1.0水
  maxWeight: 25,
  conditions: []
};

export const INITIAL_GAME_STATE: GameState = {
  language: 'zh',
  phase: 'landing',
  currentLandmarkIndex: 0,
  progress: 0,
  weather: WeatherType.CLEAR,
  season: Season.AUTUMN,
  time: 7,
  day: 1,
  status: INITIAL_STATUS,
  inventory: [
    { ...SHOP_ITEMS.find(i => i.id === 'f1')!, quantity: 2 },
    { ...SHOP_ITEMS.find(i => i.id === 'w1')!, quantity: 1 }
  ],
  log: [],
  gameMessage: { zh: '', en: '' },
  gold: 5000,
  merit: 0,
  peopleSaved: 0,
  checkInCount: 0,
  checkedInLandmarks: [],
  achievements: ACHIEVEMENTS,
  startWeight: 0,
  isCamping: false
};

export const LOCAL_EVENTS: RandomEvent[] = [
  {
    id: 'e1',
    title: { zh: '环保行动', en: 'Eco Action' },
    description: { zh: '你在草垫中发现了几瓶丢弃的废旧气罐和塑料袋。', en: 'You find abandoned trash on the meadow.' },
    choices: [
      { text: { zh: '清理并带走 (功德+20, 负重+0.5kg)', en: 'Pick it up (+20 Merit)' }, log: { zh: '你选择了带走垃圾，保护这片脆弱的净土。', en: 'You picked up the trash to protect the soil.' }, healthImpact: 0, staminaImpact: -5, meritImpact: 20 },
      { text: { zh: '体力有限，无视', en: 'Ignore' }, log: { zh: '你默默走过，环境负担依然存在。', en: 'You ignored it.' }, healthImpact: 0, staminaImpact: 0, meritImpact: -15 }
    ]
  },
  {
    id: 'e2',
    title: { zh: '失温的独行者', en: 'Helpless Hiker' },
    description: { zh: '前方岩缝中躲着一名瑟瑟发抖的独行客，他的装备明显不足以应对此地。', en: 'You find a shivering hiker in a rock cleft.' },
    choices: [
      { text: { zh: '分享火种与补给 (火种x1, 牛肉干x1)', en: 'Share supplies' }, log: { zh: '你挽救了一个生命。正如那句老话：鳌太不相信眼泪，但相信善良。', en: 'You saved a life.' }, healthImpact: 0, staminaImpact: -5, meritImpact: 100, requiredItems: [{ itemId: 'g5', quantity: 1 }, { itemId: 'f2', quantity: 1 }] },
      { text: { zh: '我也自身难保', en: 'Cannot help' }, log: { zh: '你内心感到沉重，但现实如此残酷。', en: 'The wild is cruel.' }, healthImpact: 0, staminaImpact: 0, meritImpact: -50 }
    ]
  },
  {
    id: 'e3',
    title: { zh: '前辈的路标/遗泽', en: 'Cache Found' },
    description: { zh: '在一处避风处，你发现了一只被石块压着的背囊，里面似乎有有用的东西。', en: 'You found a cache left behind.' },
    choices: [
      { text: { zh: '搜寻可用物资', en: 'Search cache' }, log: { zh: '你找到了一些可用的气罐补给。虽然略感惭愧，但生存概率提升。', en: 'You found some useful gear.' }, healthImpact: 0, staminaImpact: -5, meritImpact: -10, rewardItems: [{ itemId: 'g5', quantity: 1 }] },
      { text: { zh: '不去惊扰死者的安宁/他人的补给', en: 'Leave it' }, log: { zh: '你保持了尊严与敬畏，继续前行。', en: 'You left it untouched.' }, healthImpact: 0, staminaImpact: 0, meritImpact: 30 }
    ]
  }
];
