
export enum WeatherType {
  CLEAR = '晴朗',
  FOGGY = '浓雾',
  RAINY = '雷雨',
  SNOWY = '大雪',
  BLIZZARD = '暴风雪',
}

export enum Season {
  SPRING = '春',
  SUMMER = '夏',
  AUTUMN = '秋',
  WINTER = '冬',
}

export type Language = 'zh' | 'en';
export type ItemQuality = 'basic' | 'pro' | 'elite';
export type GamePhase = 'landing' | 'shopping' | 'hiking' | 'gameover';

export interface RouteOption {
  id: string;
  label: { zh: string; en: string };
  risk: number; // 0-1
  staminaCost: number;
  timeCost: number;
  description: { zh: string; en: string };
}

export interface Achievement {
  id: string;
  name: { zh: string; en: string };
  description: { zh: string; en: string };
  unlocked: boolean;
  category: 'survival' | 'merit' | 'challenge' | 'exploration';
  icon: string;
}

export interface Landmark {
  id: string;
  name: { zh: string; en: string };
  elevation: number;
  description: { zh: string; en: string };
  options: RouteOption[];
  sceneryKeywords: string;
  imageUrl: string;
}

export type ItemCategory = 'food' | 'water' | 'gear' | 'med';

export interface InventoryItem {
  id: string;
  name: { zh: string; en: string };
  type: ItemCategory;
  quality: ItemQuality;
  description: { zh: string; en: string };
  effect: (status: PlayerStatus) => PlayerStatus;
  quantity: number;
  weight: number;
  cost: number;
  isConsumable: boolean;
  isEquippable?: boolean; // 是否可装备
  isEquipped?: boolean;   // 是否已装备
  equipmentSlot?: 'clothing' | 'footwear' | 'accessory' | 'tool' | 'other'; // 装备槽位
  treats?: string;
}

export interface PlayerStatus {
  health: number;
  stamina: number;
  hydration: number;
  bodyTemp: number;
  energy: number;
  weight: number;
  maxWeight: number;
  conditions: string[];
}

export interface EventChoice {
  text: { zh: string; en: string };
  log: { zh: string; en: string };
  healthImpact: number;
  staminaImpact: number;
  meritImpact: number;
  bodyTempImpact?: number;
  hydrationImpact?: number;
  energyImpact?: number;
  conditionAdded?: string;
  conditionRemoved?: string;
  requiredItems?: { itemId: string; quantity: number }[];
  rewardItems?: { itemId: string; quantity: number }[];
}

export interface RandomEvent {
  id: string;
  title: { zh: string; en: string };
  description: { zh: string; en: string };
  choices: EventChoice[];
}

export interface GameState {
  language: Language;
  phase: GamePhase;
  currentLandmarkIndex: number;
  progress: number;
  weather: WeatherType;
  season: Season;
  time: number;
  day: number;
  status: PlayerStatus;
  inventory: InventoryItem[];
  log: string[];
  gameMessage: { zh: string; en: string };
  gold: number;
  merit: number;
  peopleSaved: number;
  checkInCount: number;
  checkedInLandmarks: string[]; // 记录已签到的点位ID
  achievements: Achievement[];
  startWeight: number;
  isCamping: boolean;
  deathCauseChain: { zh: string; en: string }[]; // 死亡原因链条
}
