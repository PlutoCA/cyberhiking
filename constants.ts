
import { Landmark, WeatherType, PlayerStatus, InventoryItem, GameState, Language, Season, Achievement, RandomEvent, QuizQuestion } from './types';

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
    coordinates: { lat: 33.8947, lng: 107.4123 },
    description: { zh: '进山的起点，两侧是郁郁葱葱的林间小道。', en: 'Entrance to the mountain trail.' }, 
    realInfo: { zh: '塘口村位于陕西省太白县，是鳌太穿越的传统南坡起点。村里有多家客栈提供住宿和物资补给，是徒步者做最后准备的地方。村民常告诫："鳌太无情，山神不留任性之人"。', en: 'Tangkou Village in Taibai County is the traditional southern starting point of the Aotai Trail. Local guesthouses provide final supplies and accommodation.' },
    sceneryKeywords: 'forest path village', 
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=1200',
    options: [{ id: 'o1', label: { zh: '开始拔高', en: 'Start Ascent' }, risk: 0.02, staminaCost: 5, timeCost: 2, description: { zh: '开始漫长的爬升。', en: 'Begin the long climb.' } }]
  },
  { 
    id: 'l2', name: { zh: '2800峰', en: '2800 Peak' }, elevation: 2800, 
    coordinates: { lat: 33.9156, lng: 107.4589 },
    description: { zh: '原始森林的边缘，坡度陡峭，空气开始变得清冷。', en: 'Edge of the ancient forest.' }, 
    realInfo: { zh: '海拔2800米标志着正式进入秦岭腹地。空气开始稀薄，原始森林展现神秘面貌。这是很多徒步者第一晚的露营地，也是身体适应高海拔的关键点。', en: 'At 2800m elevation, you officially enter the Qinling hinterland. Air thins and the primeval forest reveals its mysterious character. First night camping spot for many hikers.' },
    sceneryKeywords: 'steep forest mist', 
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200',
    options: [{ id: 'o2', label: { zh: '向山脊推进', en: 'Push to Ridge' }, risk: 0.05, staminaCost: 8, timeCost: 3, description: { zh: '向更高的山脊线迈进。', en: 'Moving towards the ridge line.' } }]
  },
  { 
    id: 'l3', name: { zh: '盆景园', en: 'Sobing Garden' }, elevation: 3100, 
    coordinates: { lat: 33.9423, lng: 107.5234 },
    description: { zh: '奇松异石，海拔已在3000米之上。', en: 'Ancient pines and strange rocks.' }, 
    realInfo: { zh: '盆景园以独特的高山灌丛景观闻名。植物因长期受风雪侵蚀形成奇特造型，宛如天然盆景。海拔3200米，已超过树线，风景壮美却充满危险。', en: 'Famous for unique alpine shrubs shaped by years of wind and snow erosion, resembling natural bonsai. At 3200m, above the tree line.' },
    sceneryKeywords: 'alpine pines rocks', 
    imageUrl: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1200',
    options: [{ id: 'o3', label: { zh: '跨越石海', en: 'Cross Rock Sea' }, risk: 0.10, staminaCost: 12, timeCost: 4, description: { zh: '在巨大的乱石中寻找路径。', en: 'Navigating through massive boulders.' } }]
  },
  { 
    id: 'l4', name: { zh: '荞麦梁', en: 'Buckwheat Ridge' }, elevation: 3300, 
    coordinates: { lat: 33.9567, lng: 107.5678 },
    description: { zh: '极其险峻的窄脊，风声在耳边咆哮。', en: 'Dangerous razor-thin ridge.' }, 
    realInfo: { zh: '荞麦梁因形状酷似荞麦得名，是鳌太线最险峻地段之一。山脊狭窄，两侧陡峭悬崖，能见度差时极易迷失方向。多起严重事故发生于此地段。', en: 'Named for its buckwheat-like shape, this is one of the most dangerous sections. Narrow ridge with steep drops on both sides. Multiple serious accidents occurred here.' },
    sceneryKeywords: 'knife ridge gale', 
    imageUrl: 'https://images.unsplash.com/photo-1544198365-f5d60b6d8190?auto=format&fit=crop&q=80&w=1200',
    options: [{ id: 'o4', label: { zh: '贴脊横切', en: 'Ridge Crossing' }, risk: 0.15, staminaCost: 15, timeCost: 5, description: { zh: '全神贯注通过险路。', en: 'Concentrate on the dangerous path.' } }]
  },
  { 
    id: 'l5', name: { zh: '跑马梁', en: 'Paoma Ridge' }, elevation: 3450, 
    coordinates: { lat: 33.9712, lng: 107.6234 },
    description: { zh: '一望无际的高山荒原，毫无遮挡，失温风险极高。', en: 'Exposed alpine plateau.' }, 
    realInfo: { zh: '跑马梁是广阔的高山草甸，相传古时军队在此训练战马。开阔地势完全暴露于恶劣天气中，常遭遇狂风暴雪，是失温事故高发区。', en: 'Vast alpine meadow said to be used for training war horses in ancient times. Completely exposed to harsh weather, frequently hit by gales and blizzards. High-risk area for hypothermia.' },
    sceneryKeywords: 'flat ridge grass', 
    imageUrl: 'https://images.unsplash.com/photo-1444492417251-9c84a5fa18e0?auto=format&fit=crop&q=80&w=1200',
    options: [{ id: 'o5', label: { zh: '冲刺最高峰', en: 'Final Sprint' }, risk: 0.10, staminaCost: 18, timeCost: 4, description: { zh: '目标直指拔仙台。', en: 'Targeting Baxiantai.' } }]
  },
  { 
    id: 'l6', name: { zh: '拔仙台', en: 'Baxiantai' }, elevation: 3767, 
    coordinates: { lat: 33.9550, lng: 107.7600 },
    description: { zh: '秦岭主峰之巅，云海翻腾。', en: 'Summit of the Qinling Mountains.' }, 
    realInfo: { zh: '拔仙台海拔3767米，秦岭最高峰，鳌太线的最高点。高海拔缺氧和严寒成为终极考验。天气极其恶劣，常年积雪，能见度低。传说八仙在此升天，故名拔仙台。', en: 'At 3767m, Baxiantai is the highest peak of the Qinling Mountains and the highest point of the Aotai Trail. Extreme altitude, oxygen deprivation, and severe cold present the ultimate test. Year-round snow and low visibility.' },
    sceneryKeywords: 'summit cloud sea', 
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200',
    options: [{ id: 'o6', label: { zh: '下撤厚畛子', en: 'Descend' }, risk: 0.08, staminaCost: 10, timeCost: 6, description: { zh: '漫长的下山路。', en: 'Long descent.' } }]
  },
  { 
    id: 'l7', name: { zh: '厚畛子', en: 'Houzhenzi' }, elevation: 1100, 
    coordinates: { lat: 33.8234, lng: 107.9123 },
    description: { zh: '终点站。炊烟袅袅，终于回归人间。', en: 'The finish line village.' }, 
    realInfo: { zh: '厚畛子镇标志着鳌太线终点。无数徒步者带着疲惫和难忘的回忆抵达这里，完成人生中最艰险的旅程之一。镇上有温暖的客栈和热腾腾的饭菜等待着归来的勇士。', en: 'Houzhenzi town marks the end of the Aotai Trail. Countless hikers arrive here exhausted but fulfilled, having completed one of the most challenging journeys of their lives. Warm guesthouses and hot meals await the returning adventurers.' },
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
  { id: 'g1', name: { zh: '硬壳Gore-Tex冲锋衣', en: 'Gore-Tex Jacket' }, type: 'gear', quality: 'pro', description: { zh: '0.5kg。顶级防风防水，失温风险减半。', en: '0.5kg. Wind and rain protection.' }, quantity: 0, weight: 0.5, cost: 450, isConsumable: false, isEquippable: true, equipmentSlot: 'clothing', effect: (s) => s },
  { id: 'g2', name: { zh: '三季高山帐', en: 'Alpine Tent' }, type: 'gear', quality: 'elite', description: { zh: '2.2kg。抗风避风港。', en: '2.2kg. Extreme wind shelter.' }, quantity: 0, weight: 2.2, cost: 650, isConsumable: false, isEquippable: true, equipmentSlot: 'other', effect: (s) => s },
  { id: 'g3', name: { zh: '800蓬羽绒睡袋', en: 'Down Sleeping Bag' }, type: 'gear', quality: 'pro', description: { zh: '1.2kg。极限温标-20℃。', en: '1.2kg. Extreme warmth.' }, quantity: 0, weight: 1.2, cost: 500, isConsumable: false, isEquippable: true, equipmentSlot: 'other', effect: (s) => s },
  { id: 'g4', name: { zh: '强光LED头灯', en: 'High-Power Headlamp' }, type: 'gear', quality: 'pro', description: { zh: '夜间行军必备，视野清晰。', en: 'Essential for night travel.' }, quantity: 0, weight: 0.1, cost: 180, isConsumable: false, isEquippable: true, equipmentSlot: 'accessory', effect: (s) => s },
  { id: 'g5', name: { zh: '一体式炉头+气罐', en: 'Stove & Gas' }, type: 'gear', quality: 'pro', description: { zh: '0.6kg。融雪化水，提供核心体温。', en: '0.6kg. Melt snow for water.' }, quantity: 0, weight: 0.6, cost: 200, isConsumable: true, effect: (s) => s },
  { id: 'g7', name: { zh: '钛合金折叠登山杖', en: 'Titanium Poles' }, type: 'gear', quality: 'elite', description: { zh: '0.3kg。极轻，显著减少体力消耗。', en: 'Ultra-light. Saves stamina.' }, quantity: 0, weight: 0.3, cost: 350, isConsumable: false, isEquippable: true, equipmentSlot: 'tool', effect: (s) => ({ ...s, stamina: s.stamina + 5 }) },
  { id: 'g8', name: { zh: '卫星通讯终端', en: 'Satellite Terminal' }, type: 'gear', quality: 'elite', description: { zh: '0.4kg。在极端状态下可消耗100点功德强制撤回。', en: 'Emergency satellite comms.' }, quantity: 0, weight: 0.4, cost: 800, isConsumable: false, isEquippable: true, equipmentSlot: 'accessory', effect: (s) => s },

  // --- 医疗类 (Med) ---
  { id: 'm1', name: { zh: '综合急救箱', en: 'Full First-Aid Kit' }, type: 'med', quality: 'basic', description: { zh: '处理外伤与止血。', en: 'Treats minor injuries.' }, quantity: 0, weight: 0.3, cost: 60, isConsumable: true, treats: '外伤', effect: (s) => ({ ...s, health: Math.min(100, s.health + 30), conditions: s.conditions.filter(c => c !== '外伤') }) },
  { id: 'm2', name: { zh: '便携式氧气瓶', en: 'Oxygen Tank' }, type: 'med', quality: 'pro', description: { zh: '对抗急性高反。', en: 'Relieves altitude sickness.' }, quantity: 0, weight: 0.2, cost: 150, isConsumable: true, treats: '高反', effect: (s) => ({ ...s, health: Math.min(100, s.health + 10), stamina: Math.min(100, s.stamina + 20), conditions: s.conditions.filter(c => c !== '高反') }) },
  { id: 'm3', name: { zh: '布洛芬缓释胶囊', en: 'Ibuprofen' }, type: 'med', quality: 'basic', description: { zh: '止痛退烧，压制寒冷不适。', en: 'Pain relief.' }, quantity: 0, weight: 0.05, cost: 50, isConsumable: true, effect: (s) => ({ ...s, health: Math.min(100, s.health + 15), stamina: Math.min(100, s.stamina + 5) }) },
  { id: 'm5', name: { zh: '专业防冻膏', en: 'Frostbite Cream' }, type: 'med', quality: 'pro', description: { zh: '涂抹后可暂时锁定核心体温流失速度。', en: 'Prevents frostbite.' }, quantity: 0, weight: 0.1, cost: 120, isConsumable: true, effect: (s) => ({ ...s, bodyTemp: Math.min(37.2, s.bodyTemp + 0.1) }) },
  { id: 'm6', name: { zh: '失温急救包', en: 'Hypothermia Kit' }, type: 'med', quality: 'elite', description: { zh: '0.2kg。快速缓解失温症状，恢复核心体温。', en: '0.2kg. Rapid hypothermia relief.' }, quantity: 0, weight: 0.2, cost: 250, isConsumable: true, treats: '失温', effect: (s) => ({ ...s, bodyTemp: Math.min(37.2, s.bodyTemp + 1.2), health: Math.min(100, s.health + 20), conditions: s.conditions.filter(c => c !== '失温') }) },
  { id: 'm7', name: { zh: '暖宝贴 x5', en: 'Heat Patches x5' }, type: 'med', quality: 'basic', description: { zh: '0.02kg。贴在身体保暖，可用于紧急失温。', en: '0.02kg. Stick-on warmth packs.' }, quantity: 0, weight: 0.02, cost: 80, isConsumable: true, effect: (s) => ({ ...s, bodyTemp: Math.min(37.2, s.bodyTemp + 0.5), conditions: s.conditions.includes('失温') ? s.conditions.filter(c => c !== '失温') : s.conditions }) },
  
  // --- 新增装备类 ---
  { id: 'g9', name: { zh: '防寒内衣套装', en: 'Thermal Underwear Set' }, type: 'gear', quality: 'pro', description: { zh: '0.4kg。基础保温层，提高体温维持能力。', en: '0.4kg. Base thermal layer for heat retention.' }, quantity: 0, weight: 0.4, cost: 200, isConsumable: false, isEquippable: true, equipmentSlot: 'clothing', effect: (s) => ({ ...s, bodyTemp: Math.min(37.5, s.bodyTemp + 0.2) }) },
  { id: 'g10', name: { zh: '高帮登山靴', en: 'Mountaineering Boots' }, type: 'gear', quality: 'pro', description: { zh: '1.1kg。防滑防水，保护脚踝。', en: '1.1kg. Anti-slip, waterproof, ankle protection.' }, quantity: 0, weight: 1.1, cost: 300, isConsumable: false, isEquippable: true, equipmentSlot: 'footwear', effect: (s) => ({ ...s, stamina: s.stamina + 3 }) },
  { id: 'g11', name: { zh: '防潮垫', en: 'Insulated Mat' }, type: 'gear', quality: 'basic', description: { zh: '0.4kg。隔绝地面寒气，提升睡眠质量。', en: '0.4kg. Insulates from ground cold, improves sleep.' }, quantity: 0, weight: 0.4, cost: 120, isConsumable: false, isEquippable: true, equipmentSlot: 'other', effect: (s) => ({ ...s, bodyTemp: s.bodyTemp + 0.1 }) },
  
  // --- 新增食物类 ---
  { id: 'f6', name: { zh: '高原能量棒', en: 'Altitude Energy Bar' }, type: 'food', quality: 'basic', description: { zh: '80g。专为高原设计，含铁和维生素。', en: '80g. Altitude-specific, iron and vitamins.' }, quantity: 0, weight: 0.08, cost: 25, isConsumable: true, effect: (s) => ({ ...s, energy: Math.min(100, s.energy + 18), stamina: Math.min(100, s.stamina + 8) }) },
  { id: 'f7', name: { zh: '暖胃姜茶包', en: 'Warming Ginger Tea' }, type: 'food', quality: 'basic', description: { zh: '0.02kg。驱寒暖身，缓解高原反应。', en: '0.02kg. Warms body, relieves altitude effects.' }, quantity: 0, weight: 0.02, cost: 15, isConsumable: true, effect: (s) => ({ ...s, bodyTemp: Math.min(37.0, s.bodyTemp + 0.1), stamina: Math.min(100, s.stamina + 5) }) },
  
  // --- 新增水源类 ---
  { id: 'w4', name: { zh: '运动饮料 (500ml)', en: 'Sports Drink (500ml)' }, type: 'water', quality: 'pro', description: { zh: '0.5kg。富含电解质，快速补水。', en: '0.5kg. Rich in electrolytes, rapid hydration.' }, quantity: 0, weight: 0.5, cost: 25, isConsumable: true, effect: (s) => ({ ...s, hydration: Math.min(100, s.hydration + 35), stamina: Math.min(100, s.stamina + 8) }) },
  { id: 'w5', name: { zh: '保温水壶 (750ml)', en: 'Thermal Flask (750ml)' }, type: 'water', quality: 'pro', description: { zh: '0.5kg。保持饮品温度，防止结冰。', en: '0.5kg. Maintains temperature, prevents freezing.' }, quantity: 0, weight: 0.5, cost: 150, isConsumable: false, isEquippable: true, equipmentSlot: 'tool', effect: (s) => ({ ...s, bodyTemp: s.bodyTemp + 0.05 }) },
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
  gold: 4000,
  merit: 0,
  peopleSaved: 0,
  checkInCount: 0,
  checkedInLandmarks: [],
  achievements: ACHIEVEMENTS,
  startWeight: 0,
  isCamping: false,
  deathCauseChain: [],
  triggeredEvents: []
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
  },
  {
    id: 'e4',
    title: { zh: '遭遇恶劣天气', en: 'Severe Weather' },
    description: { zh: '天空突然变暗，狂风夹杂着雪花扑面而来。气温骤降，能见度急剧下降，你的处境变得非常危险。', en: 'The sky suddenly darkens, fierce winds mixed with snow hit your face. Temperature drops rapidly, visibility decreases drastically, your situation becomes very dangerous.' },
    choices: [
      { text: { zh: '立即寻找避风处搭建临时庇护所', en: 'Find shelter and build temporary shelter immediately' }, log: { zh: '你迅速找到一处岩石缝隙，利用携带的装备搭建了临时庇护所，熬过了这场突如其来的暴风雪。', en: 'You quickly find a rock crevice, use your equipment to build a temporary shelter, and endure the sudden blizzard.' }, healthImpact: 0, staminaImpact: -15, meritImpact: 10 },
      { text: { zh: '冒风前行，试图尽快到达下一个安全点', en: 'Press on through the storm to reach safety' }, log: { zh: '你冒着风雪艰难前行，虽然节约了时间，但体力大量消耗，体温也开始下降。', en: 'You struggle through the snowstorm, saving time but losing significant stamina and body temperature.' }, healthImpact: -5, staminaImpact: -25, bodyTempImpact: -0.5, meritImpact: -10 }
    ]
  },
  {
    id: 'e5',
    title: { zh: '迷失方向', en: 'Lost Direction' },
    description: { zh: '在复杂的地形中，你发现自己完全失去了方向感。GPS信号微弱，指南针也受到干扰，四周看起来都很相似。', en: 'In the complex terrain, you realize you\'ve completely lost your sense of direction. GPS signal is weak, compass is interfered with, surroundings all look similar.' },
    choices: [
      { text: { zh: '冷静分析地形，尝试通过自然标志判断方向', en: 'Analyze terrain calmly, use natural landmarks' }, log: { zh: '你仔细观察太阳的位置、植被分布和山势走向，成功找回了正确的方向。', en: 'You carefully observe sun position, vegetation distribution, and mountain trends to regain correct direction.' }, healthImpact: 0, staminaImpact: -5, meritImpact: 15 },
      { text: { zh: '继续按原方向前进，希望能碰巧找到正确路径', en: 'Continue forward hoping to find path' }, log: { zh: '你盲目地继续前行，结果越走越远，消耗了大量体力才勉强回到原路。', en: 'You blindly continue forward, getting further lost and expending much energy returning.' }, healthImpact: -10, staminaImpact: -30, meritImpact: -20 }
    ]
  },
  {
    id: 'e6',
    title: { zh: '发现失踪驴友', en: 'Missing Hiker Found' },
    description: { zh: '在一处隐蔽的山洞里，你发现了一名多日未归的失踪驴友，他已经虚弱不堪，急需帮助。', en: 'In a hidden cave, you find a missing hiker who has been gone for days, he is extremely weak and in urgent need of help.' },
    choices: [
      { text: { zh: '立即施救并尝试联系外界 (消耗大量物资)', en: 'Provide immediate aid and contact outside' }, log: { zh: '你用尽身上所有的医疗用品救治了这位驴友，虽然物资大幅减少，但拯救了一个生命。', en: 'You use all your medical supplies to treat the hiker, reducing supplies but saving a life.' }, healthImpact: 0, staminaImpact: -20, meritImpact: 50, requiredItems: [{ itemId: 'm1', quantity: 1 }, { itemId: 'w1', quantity: 1 }], rewardItems: [{ itemId: 'f1', quantity: 1 }] },
      { text: { zh: '标记位置后离开，让专业的救援队伍来处理', en: 'Mark location and leave for professionals' }, log: { zh: '你标记了具体位置并留下了一些补给，希望后续的救援队伍能找到他。', en: 'You mark the location and leave some supplies, hoping rescuers will find him.' }, healthImpact: 0, staminaImpact: -5, meritImpact: 20 }
    ]
  },
  {
    id: 'e7',
    title: { zh: '水源危机', en: 'Water Crisis' },
    description: { zh: '你的最后一壶水已经见底，而前方的水源看起来浑浊不清。在这种高海拔地区，脱水的威胁迫在眉睫。', en: 'Your last water container is nearly empty, and the forward water sources look murky. Dehydration threat is imminent at this altitude.' },
    choices: [
      { text: { zh: '使用净水片处理野外水源', en: 'Use purification tablets on wild water' }, log: { zh: '你谨慎地使用了净水片处理野外水源，避免了因饮用不洁水导致的疾病。', en: 'You carefully use purification tablets on wild water, avoiding illness from unclean water.' }, healthImpact: 0, staminaImpact: -5, meritImpact: 10, requiredItems: [{ itemId: 'w3', quantity: 1 }] },
      { text: { zh: '节省用水，加快步伐寻找清洁水源', en: 'Conserve water, hurry to find clean source' }, log: { zh: '你严格控制饮水量，加快步伐前进，但脱水症状已经开始显现。', en: 'You strictly ration water, speed up pace forward, but dehydration symptoms begin to appear.' }, healthImpact: -10, staminaImpact: -10, hydrationImpact: -15, meritImpact: -10 }
    ]
  },
  {
    id: 'e8',
    title: { zh: '野生动物遭遇', en: 'Wildlife Encounter' },
    description: { zh: '一只野生大熊猫出现在你的面前，它看起来并不具有攻击性，但挡住了你的去路。', en: 'A wild giant panda appears before you, seemingly non-aggressive but blocking your path.' },
    choices: [
      { text: { zh: '静静等待，不打扰它，直到它自行离开', en: 'Wait quietly without disturbing it' }, log: { zh: '你耐心等待，尊重野生动物的生活空间，最终它自行离开，你们平安无事。', en: 'You wait patiently, respecting wildlife space, eventually it leaves safely.' }, healthImpact: 0, staminaImpact: -10, meritImpact: 25 },
      { text: { zh: '尝试拍照留念', en: 'Try to take photos' }, log: { zh: '你试图拍照的行为惊扰了熊猫，它发出低吼后离开，你也因此消耗了一些时间。', en: 'Your attempt to photograph startles the panda, it growls and leaves, costing you time.' }, healthImpact: 0, staminaImpact: -5, meritImpact: -10 }
    ]
  },
  {
    id: 'e9',
    title: { zh: '队友掉队', en: 'Team Member Lagging' },
    description: { zh: '如果你有队友的话，其中一人因为体力不支开始掉队，要求休息。继续等待可能错过最佳前进时机，但丢下队友违背道义。', en: 'If you had companions, one falls behind due to exhaustion and requests rest. Waiting may miss optimal timing, but leaving teammate goes against ethics.' },
    choices: [
      { text: { zh: '停下等待并提供帮助', en: 'Stop and provide assistance' }, log: { zh: '你停下脚步，将自己的补给分给队友，虽然耽误了时间，但体现了团队精神。', en: 'You stop and share supplies with teammate, wasting time but showing teamwork.' }, healthImpact: 0, staminaImpact: -10, meritImpact: 30 },
      { text: { zh: '告知对方位置，约定在前方汇合', en: 'Inform position, agree to meet ahead' }, log: { zh: '你告知队友你的前进计划，在前方安全点等待，平衡了效率和责任。', en: 'You inform teammate of your plan, wait at safe point ahead, balancing efficiency and responsibility.' }, healthImpact: 0, staminaImpact: -5, meritImpact: 15 }
    ]
  },
  {
    id: 'e10',
    title: { zh: '突发伤病', en: 'Sudden Injury' },
    description: { zh: '在崎岖的山路上，你不慎滑倒，脚踝扭伤，行走变得困难。', en: 'On the rugged mountain path, you slip and sprain your ankle, making walking difficult.' },
    choices: [
      { text: { zh: '就地休息并使用医疗包处理伤势', en: 'Rest and treat injury with first aid kit' }, log: { zh: '你及时处理了伤势，虽然恢复缓慢，但避免了进一步恶化。', en: 'You promptly treat the injury, recovering slowly but preventing worsening.' }, healthImpact: 10, staminaImpact: -15, meritImpact: 5, requiredItems: [{ itemId: 'm1', quantity: 1 }] },
      { text: { zh: '强忍疼痛继续前进', en: 'Endure pain and continue' }, log: { zh: '你坚持继续前进，但伤势加重，严重影响了后续的行进速度和体力消耗。', en: 'You persist forward, but injury worsens, severely affecting speed and stamina.' }, healthImpact: -20, staminaImpact: -25, meritImpact: -15 }
    ]
  },
  {
    id: 'e11',
    title: { zh: '范师傅的救援故事', en: 'Rescue Story of Master Fan' },
    description: { zh: '你遇到了一位经验丰富的当地救援队员范师傅，他曾参与过十多次秦岭救援。他告诉你："这五年来，鳌太线第一位活着被救下的人就在这里附近被发现。其余人被找到时都已经没了，还有很多连遗体都找不到。"', en: 'You meet an experienced local rescuer Master Fan, who has participated in over ten Qinling rescues. He tells you: "In the past five years, the first person alive rescued on the Aotai trail was found near here. Others were found deceased, and many bodies were never recovered."' },
    choices: [
      { text: { zh: '认真听取经验教训，调整行程计划', en: 'Listen carefully and adjust plans' }, log: { zh: '你认真听取了范师傅的忠告，决定更加谨慎地继续行程。', en: 'You listen carefully to Master Fan\'s advice and decide to proceed more cautiously.' }, healthImpact: 0, staminaImpact: -5, meritImpact: 20 },
      { text: { zh: '礼貌感谢但认为自己准备充分，继续按原计划', en: 'Thank politely but continue as planned' }, log: { zh: '你礼貌地感谢了范师傅，但仍然按照自己的计划继续前进。', en: 'You politely thank Master Fan but continue with your own plan.' }, healthImpact: 0, staminaImpact: 0, meritImpact: 5 }
    ]
  },
  {
    id: 'e12',
    title: { zh: '失联者的遗言', en: 'Words of a Missing Hiker' },
    description: { zh: '在一个避风处，你发现了一本遗落的日记，上面写着："2月8日进山，原以为几天就能穿越鳌太线，没想到山中天气如此多变，我已经迷失了好几天..." 日记到这里戛然而止。', en: 'At a wind-sheltered spot, you find a forgotten diary: "Entered the mountains on Feb 8th, thought I could cross the Aotai trail in a few days, didn\'t expect the weather to be so changeable, I\'ve been lost for days..." The diary ends abruptly.' },
    choices: [
      { text: { zh: '将日记妥善保管，或许能帮助后续的救援工作', en: 'Keep the diary safely for future rescue efforts' }, log: { zh: '你小心地保存了这本日记，希望它能帮助救援队了解情况。', en: 'You carefully preserve the diary, hoping it can help rescue teams understand the situation.' }, healthImpact: 0, staminaImpact: -5, meritImpact: 15 },
      { text: { zh: '匆匆浏览后继续赶路，不能被过去的事耽搁', en: 'Quickly browse and continue' }, log: { zh: '你简单看了看日记就继续前进，认为不应该被过去的事影响自己的行程。', en: 'You quickly look at the diary and continue forward, thinking past events shouldn\'t affect your journey.' }, healthImpact: 0, staminaImpact: 0, meritImpact: -5 }
    ]
  },
  {
    id: 'e13',
    title: { zh: '救援队的警示', en: 'Rescue Team Warning' },
    description: { zh: '你偶遇一支正在执行搜救任务的救援队，他们告诉你："又有5人违规穿越鳌太线，其中2人已无生命体征，还有1人发生坠崖事故。请珍惜生命，遵守规定。"', en: 'You encounter a rescue team on a search mission. They tell you: "Another 5 people illegally crossed the Aotai trail, 2 of whom are deceased, and 1 suffered a cliff fall. Please cherish life and follow regulations."' },
    choices: [
      { text: { zh: '深受震撼，重新评估当前的风险', en: 'Deeply shocked, reassess risks' }, log: { zh: '救援队的话让你深刻意识到风险，你决定更加谨慎地评估每一步行动。', en: 'The rescue team\'s words deeply make you aware of the risks, and you decide to evaluate each step more cautiously.' }, healthImpact: 0, staminaImpact: -5, meritImpact: 25 },
      { text: { zh: '表示感谢但认为只要小心就没问题', en: 'Thank but think caution is sufficient' }, log: { zh: '你感谢救援队的提醒，但内心认为只要足够小心就不会有问题。', en: 'You thank the rescue team but believe that being careful will prevent problems.' }, healthImpact: 0, staminaImpact: 0, meritImpact: 5 }
    ]
  },
  {
    id: 'e14',
    title: { zh: '独行者的坚持', en: 'Lone Traveler\'s Persistence' },
    description: { zh: '你遇到一位资深女驴友，她告诉你："我是踏雪，正在尝试冬季独自穿越鳌太线。我已经在这里困了20多天，但一定要完成这次挑战。"她的精神令人敬佩，但也让人担忧。', en: 'You meet a seasoned female hiker who tells you: "I am Tauxue, attempting a winter solo crossing of the Aotai trail. I\'ve been trapped here for over 20 days, but I must complete this challenge." Her spirit is admirable but concerning.' },
    choices: [
      { text: { zh: '劝说她放弃并结伴同行，安全最重要', en: 'Persuade her to give up and travel together' }, log: { zh: '你成功说服了踏雪，两人决定结伴返回安全地带。', en: 'You successfully convince Tauxue, and the two of you decide to return to safety together.' }, healthImpact: 0, staminaImpact: -10, meritImpact: 30 },
      { text: { zh: '尊重她的决定，但表达关切', en: 'Respect her decision but express concern' }, log: { zh: '你尊重踏雪的决定，但留下了联系方式和部分补给。', en: 'You respect Tauxue\'s decision but leave contact information and some supplies.' }, healthImpact: 0, staminaImpact: -5, meritImpact: 10 }
    ]
  },
  {
    id: 'e15',
    title: { zh: '山民的忠告', en: 'Mountain Villager\'s Advice' },
    description: { zh: '在一处山坳，你遇到了一位老山民，他说："年轻人，鳌太无情，山神不留任性之人。我见过太多人怀着征服自然的雄心而来，却不知敬畏自然的后果。"', en: 'At a mountain pass, you meet an old mountain villager who says: "Young man, Aotai has no mercy, the mountain god does not spare the reckless. I have seen too many people come with ambitions to conquer nature, unaware of the consequences of not revering nature."' },
    choices: [
      { text: { zh: '虚心接受忠告，反思自己的行为', en: 'Humbly accept advice and reflect' }, log: { zh: '老山民的话让你陷入沉思，你开始重新审视这次穿越的意义。', en: 'The old villager\'s words make you contemplate, and you begin to reconsider the meaning of this crossing.' }, healthImpact: 0, staminaImpact: -5, meritImpact: 20 },
      { text: { zh: '礼貌感谢但认为自己准备充分，无需担心', en: 'Thank politely but think prepared enough' }, log: { zh: '你礼貌地感谢了老山民，但内心依然自信满满。', en: 'You politely thank the old villager but remain confident inside.' }, healthImpact: 0, staminaImpact: 0, meritImpact: -5 }
    ]
  },
  {
    id: 'e16',
    title: { zh: '偶遇金丝猴群', en: 'Golden Monkey Encounter' },
    description: { zh: '一群秦岭金丝猴出现在附近的树枝上好奇地打量着你。它们看起来并无恶意，但可能会抢夺你暴露在外的食物。', en: 'A group of Qinling golden monkeys appear on nearby branches, curiously eyeing you. They seem harmless but might steal exposed food.' },
    choices: [
      { text: { zh: '保持静止，缓慢后退，避免冲突', en: 'Stay still, retreat slowly' }, log: { zh: '你安静地离开了这片区域，与金丝猴们和平共处。', en: 'You quietly left the area, coexisting peacefully with the golden monkeys.' }, healthImpact: 0, staminaImpact: -5, meritImpact: 10 },
      { text: { zh: '拿出食物投喂，试图与它们建立友好关系', en: 'Offer food to befriend them' }, log: { zh: '金丝猴们接受了你的善意，但你也损失了一些珍贵的补给。', en: 'The golden monkeys accepted your kindness, but you also lost some precious supplies.' }, healthImpact: 0, staminaImpact: -10, meritImpact: 15, requiredItems: [{ itemId: 'f1', quantity: 1 }] }
    ]
  },
  {
    id: 'e17',
    title: { zh: '羚牛踪迹', en: 'Goral Tracks' },
    description: { zh: '你在雪地上发现了大型动物的足迹，向导手册告诉你这是羚牛的踪迹。羚牛通常温和，但在繁殖季节或感到威胁时会变得极具攻击性。', en: 'You discover large animal tracks in the snow. Your guidebook identifies them as goral tracks. Gorals are typically gentle but can become highly aggressive during mating season or when threatened.' },
    choices: [
      { text: { zh: '改变路线，远离这些踪迹', en: 'Change route, avoid tracks' }, log: { zh: '你谨慎地改变了路线，避开潜在的危险。', en: 'You cautiously changed route, avoiding potential danger.' }, healthImpact: 0, staminaImpact: -10, meritImpact: 10 },
      { text: { zh: '继续前行，保持警惕', en: 'Continue forward, stay alert' }, log: { zh: '你小心地继续前进，幸运地没有遇到羚牛。', en: 'You carefully continued forward, luckily not encountering any gorals.' }, healthImpact: 0, staminaImpact: -5, meritImpact: 5 }
    ]
  },
  {
    id: 'e18',
    title: { zh: '雪豹的凝视', en: 'Snow Leopard\'s Stare' },
    description: { zh: '在一处岩石上，你与一只雪豹四目相对。作为秦岭的顶级掠食者，雪豹很少主动攻击人类，但它的眼神充满了野性的威严。', en: 'On a rocky outcrop, you lock eyes with a snow leopard. As the apex predator of Qinling, snow leopards rarely attack humans, but its gaze is filled with wild majesty.' },
    choices: [
      { text: { zh: '避免直视，慢慢退后，不激怒这位山中王者', en: 'Avoid eye contact, retreat slowly' }, log: { zh: '你以恰当的方式表达了对山中王者的尊重，安全离开了现场。', en: 'You respectfully showed deference to the mountain king, safely leaving the scene.' }, healthImpact: 0, staminaImpact: -8, meritImpact: 20 },
      { text: { zh: '尝试拍照记录这一难得的相遇', en: 'Try to photograph the rare encounter' }, log: { zh: '你试图拍照的行为让雪豹感到威胁，它咆哮一声后消失了。', en: 'Your attempt to photograph startled the snow leopard, which roared and disappeared.' }, healthImpact: 0, staminaImpact: -5, meritImpact: -5 }
    ]
  },
  {
    id: 'e19',
    title: { zh: '野猪群的包围', en: 'Wild Boar Herd' },
    description: { zh: '一群野猪突然从灌木丛中冲出，它们似乎把你视为威胁。粗壮的哼哼声回荡在山谷中，地面震颤。', en: 'A herd of wild boars suddenly charges from the brush, seeing you as a threat. Their grunts echo through the valley.' },
    choices: [
      { text: { zh: '快速逃到高地或爬树躲避', en: 'Climb to higher ground immediately' }, log: { zh: '你敏捷地逃到安全的高地，野猪群从你身下奔过。惊险但化险为夷。', en: 'You nimbly reach higher ground as the boar herd thunders past below. Close call!' }, healthImpact: 0, staminaImpact: -20, meritImpact: 0 },
      { text: { zh: '站住不动，希望它们不理你', en: 'Stay still and hope they ignore you' }, log: { zh: '你冻住了。幸运的是，野猪群对你没有兴趣，掉头冲向另一个方向。', en: 'You froze. Fortunately, the boars lost interest and charged another direction.' }, healthImpact: 0, staminaImpact: -5, meritImpact: 5 },
      { text: { zh: '展开防御，与野猪搏斗', en: 'Fight back against the boars' }, log: { zh: '你的蛮撞付出了代价。一只野猪的獠牙划伤了你的大腿，你狼狈地逃脱。', en: 'Your bravado costs you. A boar\'s tusk gashes your thigh, but you manage to escape.' }, healthImpact: -25, staminaImpact: -30, meritImpact: -10, conditionAdded: '外伤' }
    ]
  },
  {
    id: 'e20',
    title: { zh: '失踪者通告', en: 'Missing Person Notice' },
    description: { zh: '你发现了一张被风吹得破烂的寻人启事，一位5个月前失踪的登山者照片清晰可见。启事上的电话号码已经模糊，但你识别出了一个位置记号。心中涌起一丝不安。', en: 'You find a tattered missing person notice. A climber who vanished 5 months ago stares from the poster.' },
    choices: [
      { text: { zh: '记录下信息，如果有机会就报警', en: 'Note the info and report if possible' }, log: { zh: '你小心地拍照记录了这张启事。至少，如果你生还也许能提供线索。', en: 'You photograph the notice carefully. Maybe your survival can provide clues.' }, healthImpact: -5, staminaImpact: -5, meritImpact: 15 },
      { text: { zh: '继续前行，这不是你的责任', en: 'Continue forward, not your concern' }, log: { zh: '你走了过去，但那张脸深深印在了你的脑海中。', en: 'You moved on, but that face haunts you.' }, healthImpact: 0, staminaImpact: 0, meritImpact: -20 }
    ]
  },
  {
    id: 'e21',
    title: { zh: '被困的登山队', en: 'Stranded Climbers' },
    description: { zh: '你发现了一处临时营地，四名登山者因天气恶劣被困已经3天。他们的食物和燃料即将耗尽，其中一人已经出现高反症状。他们看到你时露出了希望的表情。', en: 'You find a makeshift camp with 4 stranded climbers. They\'ve been trapped for days by bad weather.' },
    choices: [
      { text: { zh: '分享物资并协助撤离（需要：气罐x2, 食物x3, 氧气瓶x1）', en: 'Share supplies and assist evacuation' }, log: { zh: '你用尽了身上的补给，成功帮助他们度过难关并找到了安全的下撤路线。他们会一生感激你的义举。', en: 'You share your supplies, helping them find safety. They will remember your kindness forever.' }, healthImpact: -15, staminaImpact: -25, meritImpact: 150, requiredItems: [{ itemId: 'g5', quantity: 2 }, { itemId: 'f2', quantity: 3 }, { itemId: 'm2', quantity: 1 }] },
      { text: { zh: '分享部分物资，但无法陪同撤离', en: 'Share some supplies but cannot stay' }, log: { zh: '你留下了一些食物和水，希望他们能坚持到救援到来。', en: 'You leave some food and water, hoping rescue arrives in time.' }, healthImpact: 0, staminaImpact: -10, meritImpact: 50 },
      { text: { zh: '难以自保，匆匆离去', en: 'Cannot help, must move on' }, log: { zh: '你知道自己也在绝境中，选择了继续前行。那些哀望的眼神会在你的梦境中反复出现。', en: 'You know you\'re also in danger. Those eyes will haunt your dreams.' }, healthImpact: 0, staminaImpact: 0, meritImpact: -80 }
    ]
  },
  {
    id: 'e22',
    title: { zh: '幻觉与疯狂', en: 'Illusions in Mist' },
    description: { zh: '在浓雾中行走了太久，你开始看到奇怪的东西。有时是亲友的身影，有时是建筑物的轮廓。你不确定哪些是真实的，哪些只是缺氧导致的幻觉。', en: 'After hours in the mist, you see strange things. You can\'t distinguish reality from hallucination.' },
    choices: [
      { text: { zh: '停下休息，深呼吸恢复理智', en: 'Stop and rest, regain clarity' }, log: { zh: '你停了下来，做了几次深呼吸。世界逐渐清晰，幻觉消散了。', en: 'You stop, breathe deeply. The world sharpens. Clarity returns.' }, healthImpact: 5, staminaImpact: -20, meritImpact: 0 },
      { text: { zh: '继续前行，追逐那些幻影', en: 'Follow the illusions forward' }, log: { zh: '你被幻觉所迷，走了很多冤枉路，体力消耗严重。', en: 'The hallucinations lead you astray. Wasted stamina.' }, healthImpact: -10, staminaImpact: -40, meritImpact: -25 }
    ]
  },
  {
    id: 'e23',
    title: { zh: '雪崩预兆', en: 'Avalanche Warning' },
    description: { zh: '远处传来沉闷的轰鸣声，天空中的积雪开始松动。雪沙从上方流泻而下，节奏越来越快。这是雪崩的前兆。你有30秒的时间做出反应。', en: 'A distant rumble. Snow above becomes unstable. Avalanche warning. ~30 seconds to react.' },
    choices: [
      { text: { zh: '向侧面冲刺逃离雪流路线', en: 'Sprint sideways out of the path' }, log: { zh: '你拼命向侧面奔跑，堪堪逃过了雪崩。你在雪花中跌倒，但活了下来。', en: 'You sprint sideways, narrowly escaping. You survive.' }, healthImpact: -15, staminaImpact: -35, meritImpact: 0 },
      { text: { zh: '躲进最近的岩石缝隙中', en: 'Hide in the nearest rock crevice' }, log: { zh: '你蜷缩在岩缝中，雪流呼啸而过，但没有完全埋住你。', en: 'You curl in a rock crevice. You\'re not buried.' }, healthImpact: -5, staminaImpact: -20, meritImpact: 5 },
      { text: { zh: '冻住原地，不知所措', en: 'Freeze in panic, paralyzed' }, log: { zh: '你被吓住了。雪流击中你，你被部分埋住，但侥幸活下来。', en: 'You freeze. The snow hits you, partially burying you, but you survive.' }, healthImpact: -30, staminaImpact: -45, meritImpact: -15, conditionAdded: '外伤' }
    ]
  },
  {
    id: 'e24',
    title: { zh: '古老的祭坛遗迹', en: 'Ancient Shrine Ruins' },
    description: { zh: '在山脊上，你发现了一个残破的石头祭坛，上面留下了许多信徒的祈福物和纸条。有人祈求平安，有人留下遗言。这个地方充满了神圣与绝望交织的气息。', en: 'On the ridge, you find ancient shrine ruins scattered with prayer offerings and notes.' },
    choices: [
      { text: { zh: '敬礼祈福，留下自己的信念', en: 'Pay respects and leave your prayer' }, log: { zh: '你停下脚步，为自己、为这座山献上敬礼。心中的恐惧似乎消散了一些。', en: 'You pay respects to the mountain. Fear subsides slightly.' }, healthImpact: 5, staminaImpact: -5, meritImpact: 25 },
      { text: { zh: '匆匆略过，这些都是迷信', en: 'Move on, this is superstition' }, log: { zh: '你无视了这个遗迹，但某种说不出的不安始终跟随着你。', en: 'You dismiss it as superstition, but unease lingers.' }, healthImpact: 0, staminaImpact: 0, meritImpact: -10 }
    ]
  },
  {
    id: 'e25',
    title: { zh: '搜救直升机', en: 'Rescue Helicopter' },
    description: { zh: '一架搜救直升机突然从云层中出现，并向你靠近！机舱中的人员似乎发现了你。这可能是逃出困境的机会，但接近直升机意味着暴露在气流和风险中。', en: 'A rescue helicopter emerges from the clouds, moving toward you! A chance to escape.' },
    choices: [
      { text: { zh: '挥手示意，尽全力吸引注意', en: 'Wave frantically to get their attention' }, log: { zh: '你疯狂地挥舞，飞行员看到了你。直升机开始降低高度准备救援。', en: 'You wave frantically. The pilot spots you. The helicopter begins its approach.' }, healthImpact: 0, staminaImpact: -15, meritImpact: 0 },
      { text: { zh: '躲开飞机气流，观察是否真的看到你', en: 'Dodge the rotor wash, assess situation' }, log: { zh: '你躲到安全位置。直升机没有减速，它在搜索其他受难者。希望破灭了。', en: 'You take cover. The helicopter doesn\'t slow. Hope shattered.' }, healthImpact: -10, staminaImpact: -10, meritImpact: -30 }
    ]
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: { zh: '鳌太线穿越的全程距离大约有多长？', en: 'What is the approximate total distance of the Aotai Trail crossing?' },
    options: [
      { zh: '40公里直线距离，实际徒步170公里', en: '40km direct distance, 170km actual hiking' },
      { zh: '80公里直线距离，实际徒步200公里', en: '80km direct distance, 200km actual hiking' },
      { zh: '30公里直线距离，实际徒步100公里', en: '30km direct distance, 100km actual hiking' },
      { zh: '120公里直线距离，实际徒步250公里', en: '120km direct distance, 250km actual hiking' }
    ],
    correctAnswer: 0,
    explanation: { zh: '鳌太线从塘口村出发，穿越40公里，跨越17座3400米以上的高峰。由于山路崎岖蜿蜒，实际徒步距离达到170公里。', en: 'The Aotai Trail stretches 40km direct but requires 170km of actual hiking due to steep terrain and 17 peaks over 3400m.' },
    category: 'distance'
  },
  {
    id: 'q2',
    question: { zh: '在鳌太线遇到秦岭金丝猴应该怎么做？', en: 'What should you do if you encounter Qinling golden monkeys on the trail?' },
    options: [
      { zh: '保持距离并缓慢后退，不要做出突然动作', en: 'Keep distance and retreat slowly, avoid sudden movements' },
      { zh: '立即跑开，远离它们', en: 'Run away immediately' },
      { zh: '拿出食物投喂，和它们交朋友', en: 'Offer food and try to befriend them' },
      { zh: '发出大声噪音驱赶它们', en: 'Make loud noises to drive them away' }
    ],
    correctAnswer: 0,
    explanation: { zh: '秦岭金丝猴通常温和，但需要保持尊重的距离。突然动作可能会激惹它们。投喂会导致它们依赖人类食物并变得具有攻击性。', en: 'Golden monkeys are generally peaceful but require respectful distance. Avoid sudden movements. Feeding them causes dependency and aggression.' },
    category: 'wildlife'
  },
  {
    id: 'q3',
    question: { zh: '高原反应的主要症状不包括下列哪一项？', en: 'Which is NOT a typical symptom of altitude sickness?' },
    options: [
      { zh: '头痛、呕吐、失眠', en: 'Headache, vomiting, insomnia' },
      { zh: '皮肤瘙痒和皮疹', en: 'Itching skin and rash' },
      { zh: '呼吸困难、胸闷', en: 'Shortness of breath, chest tightness' },
      { zh: '疲劳和虚弱', en: 'Fatigue and weakness' }
    ],
    correctAnswer: 1,
    explanation: { zh: '高原反应主要由缺氧引起，症状包括头痛、呕吐、失眠、呼吸困难和疲劳。皮肤瘙痒和皮疹与高反无直接关系。', en: 'Altitude sickness is caused by oxygen deprivation, causing headache, vomiting, insomnia, and dyspnea. Skin reactions are unrelated.' },
    category: 'altitude'
  },
  {
    id: 'q4',
    question: { zh: '治疗高原反应的常用药物不包括下列哪一种？', en: 'Which drug is NOT used for altitude sickness treatment?' },
    options: [
      { zh: '乙酰唑胺（Diamox）', en: 'Acetazolamide (Diamox)' },
      { zh: '布洛芬（Ibuprofen）', en: 'Ibuprofen' },
      { zh: '红景天（Rhodiola）', en: 'Rhodiola' },
      { zh: '阿司匹林（Aspirin）', en: 'Aspirin' }
    ],
    correctAnswer: 3,
    explanation: { zh: '乙酰唑胺是预防和治疗高反的首选药物，布洛芬缓解头痛，红景天增强耐缺氧能力。阿司匹林主要用于心血管疾病，对高反无特殊效果。', en: 'Acetazolamide is the gold standard for altitude prevention, Ibuprofen relieves headache, Rhodiola enhances oxygen adaptation. Aspirin is for cardiovascular issues, not altitude sickness.' },
    category: 'altitude'
  },
  {
    id: 'q5',
    question: { zh: '失温症的早期症状（第一阶段）主要表现为？', en: 'What are the early symptoms of hypothermia (stage 1)?' },
    options: [
      { zh: '持续颤抖、意识清醒但行为迟缓', en: 'Shivering, conscious but sluggish movement' },
      { zh: '意识模糊、嘴唇发绀、停止颤抖', en: 'Confusion, cyanotic lips, no shivering' },
      { zh: '意识丧失、脉搏极弱', en: 'Unconscious, barely detectable pulse' },
      { zh: '心跳停止、瞳孔放大', en: 'Cardiac arrest, dilated pupils' }
    ],
    correctAnswer: 0,
    explanation: { zh: '失温第一阶段（32-35°C）表现为持续颤抖、意识清醒但行为变得迟缓、说话含糊。第二阶段停止颤抖。第三阶段意识丧失。及早识别关乎生死。', en: 'Stage 1 hypothermia (32-35°C): persistent shivering, clear consciousness but sluggish movement. Stage 2: no shivering, confusion. Stage 3: unconscious. Early recognition is lifesaving.' },
    category: 'hypothermia'
  },
  {
    id: 'q6',
    question: { zh: '遭遇失温的野外急救方法不包括？', en: 'Which is NOT appropriate first aid for hypothermia?' },
    options: [
      { zh: '移至避风暖和的地方，脱掉湿衣物', en: 'Move to sheltered warm area, remove wet clothing' },
      { zh: '给予温热的饮料和高热量食物', en: 'Provide warm drinks and high-calorie food' },
      { zh: '立即进行剧烈按摩和快速体动活动', en: 'Vigorous massage and rapid movement' },
      { zh: '缓慢加温，避免急速回温导致心律不齐', en: 'Slow rewarming to prevent cardiac arrhythmia' }
    ],
    correctAnswer: 2,
    explanation: { zh: '失温患者禁止剧烈活动和按摩，因为会使冷血流向心脏引发致命的心律不齐。正确做法是缓慢加温、保持温暖安静、监测生命体征。', en: 'Never use vigorous exercise or massage on hypothermia patients as this drives cold blood to the heart causing fatal arrhythmia. Slow rewarming in a warm, quiet environment is essential.' },
    category: 'hypothermia'
  },
  {
    id: 'q7',
    question: { zh: '长距离山地徒步中，防止足部水泡的最重要因素是？', en: 'What is the most important factor to prevent foot blisters on long hikes?' },
    options: [
      { zh: '穿着透气的棉质袜子', en: 'Wear breathable cotton socks' },
      { zh: '及时更换汗湿的袜子，保持足部干燥', en: 'Change wet socks promptly to keep feet dry' },
      { zh: '在脚上涂抹防水油脂', en: 'Apply waterproof grease on feet' },
      { zh: '频繁检查脚部皮肤', en: 'Frequent foot inspections' }
    ],
    correctAnswer: 1,
    explanation: { zh: '足部水泡由皮肤摩擦和潮湿引起。最重要的是保持足部干燥——及时更换汗湿的袜子，选择排汗性能好的专业登山袜。干燥的足部不易起泡。', en: 'Blisters result from friction and moisture. The key is keeping feet dry by changing damp socks promptly and using moisture-wicking hiking socks. Dry feet resist blistering.' },
    category: 'equipment'
  },
  {
    id: 'q8',
    question: { zh: '在山区突遇暴风雨时，下列哪项做法是错误的？', en: 'Which action is WRONG during sudden thunderstorm in mountains?' },
    options: [
      { zh: '远离高处和孤立树木，寻找低地避险', en: 'Move away from heights and isolated trees, find low ground' },
      { zh: '蹲着或坐着，脚并拢以减少接地面积', en: 'Crouch or sit with feet together to minimize ground contact' },
      { zh: '躲在山洞或树下等待暴雨过去', en: 'Take shelter in cave or under trees waiting for storm to pass' },
      { zh: '拆开背包金属部件并远离它们', en: 'Remove metal objects and move away from them' }
    ],
    correctAnswer: 2,
    explanation: { zh: '山洞可能集聚静电导致触电。树下容易被闪电击中。正确做法是蹲在低地、脚并拢、避开高处和金属物品。山区闪电致死率高达90%，必须高度重视。', en: 'Caves trap static electricity; trees attract lightning. Correct: crouch on low ground with feet together, avoid heights and metal. Mountain lightning has 90% fatality rate—take it seriously.' },
    category: 'weather'
  },
  {
    id: 'q9',
    question: { zh: '在无医疗救助的山区，发现同伴骨折应该如何处理？', en: 'How should you handle a companion\'s fracture in remote mountains with no medical aid?' },
    options: [
      { zh: '立即做简单夹板固定，用绷带或布条绑扎，避免活动', en: 'Immediately immobilize with makeshift splint, wrap with bandage, prevent movement' },
      { zh: '让患者继续行走以保持血流，边走边恢复', en: 'Keep patient walking to maintain circulation' },
      { zh: '频繁活动骨折处以检查严重程度', en: 'Move the fracture repeatedly to assess severity' },
      { zh: '给予止痛药后继续行进', en: 'Give painkillers and continue hiking' }
    ],
    correctAnswer: 0,
    explanation: { zh: '山区骨折的正确处理：1)停止活动；2)用木板、登山杖、背包等做简易夹板；3)用绷带固定；4)抬高患肢；5)冷敷减肿；6)安排转移至医疗点。继续行走会加重伤情。', en: 'Mountain fracture protocol: 1) Stop activity 2) Immobilize with makeshift splint (wood, trekking pole) 3) Wrap with bandage 4) Elevate limb 5) Apply cold 6) Arrange evacuation. Walking worsens the injury.' },
    category: 'firstaid'
  },
  {
    id: 'q10',
    question: { zh: '在海拔3500米以上的高山露营，为了节省燃料你应该？', en: 'At 3500m+ altitude camping to conserve fuel, you should?' },
    options: [
      { zh: '少喝热水，依靠自身体热保暖', en: 'Drink less warm water, rely on body heat' },
      { zh: '增加热水摄入量，高山缺氧需要更多补水和热量', en: 'Increase warm water and food intake for altitude compensation' },
      { zh: '只吃干粮，不进行加热以节省燃料', en: 'Eat only dry food to save fuel' },
      { zh: '缩短睡眠时间以节省热源', en: 'Reduce sleep to conserve heat sources' }
    ],
    correctAnswer: 1,
    explanation: { zh: '高山缺氧导致新陈代谢加快，身体需要更多热量和水分。充足的热水和温热食物能维持体温、促进血液循环、减轻高反。节食和脱水反而加速失温和高反恶化。', en: 'Altitude hypoxia accelerates metabolism, requiring more calories and hydration. Warm drinks and food maintain body temperature, improve circulation, mitigate altitude sickness. Undereating hastens hypothermia and AMS.' },
    category: 'nutrition'
  }
];

