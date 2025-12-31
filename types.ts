
export enum Realm {
  Mortal = '凡人',
  QiRefining = '炼气',
  Foundation = '筑基',
  GoldenCore = '金丹',
  NascentSoul = '元婴',
  SoulFormation = '化神',
  VoidRefining = '炼虚',
  BodyIntegration = '合体',
  GreatTribulation = '大乘',
  Immortal = '渡劫'
}

export interface Item {
  id: string;
  name: string;
  description: string;
  type: 'elixir' | 'artifact' | 'material';
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';
  value: number;
  effect?: {
    qi?: number;
    health?: number;
    luck?: number;
  };
}

export interface PlayerStats {
  name: string;
  realm: Realm;
  stage: number; // 1-9
  qi: number;
  maxQi: number;
  health: number;
  maxHealth: number;
  spiritStones: number;
  luck: number;
  talent: number;
  age: number;
}

export interface GameLog {
  id: string;
  timestamp: number;
  content: string;
  type: 'info' | 'success' | 'warning' | 'danger' | 'cultivation';
}

export interface EncounterResult {
  story: string;
  qiGain?: number;
  healthLoss?: number;
  itemFound?: Item;
  stonesFound?: number;
}
