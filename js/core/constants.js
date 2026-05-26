export const DIRECTIONS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1]
];

export const GAME_CONFIG = {
  GRID_ROWS: 10,
  GRID_COLS: 10,
  ENEMY_COUNT: 15,
  PLAYER_INITIAL_HP: 30,
  PLAYER_INITIAL_ATK: 6,
  EXP_PER_LEVEL: 10,
  HP_GAIN_PER_LEVEL: 10,
  ATK_GAIN_PER_LEVEL: 2,
  ESCAPE_DAMAGE: 4
};

export const DUNGEON_CONFIG = {
  1: { name: "初心者の洞窟", emoji: "🪨", themeClass: "theme-cave",     minPlayerLevel: 1, maxPlayerLevel: 2, enemyTypes: ["SLIME"],             enemyCount: 10, gridSize: { rows: 8,  cols: 8  }, clearExp: 20,  clearGold: 30,  itemChance: 0.15 },
  2: { name: "森の小道",     emoji: "🌲", themeClass: "theme-forest",   minPlayerLevel: 2, maxPlayerLevel: 3, enemyTypes: ["SLIME","GOBLIN"],    enemyCount: 12, gridSize: { rows: 9,  cols: 9  }, clearExp: 30,  clearGold: 50,  itemChance: 0.12 },
  3: { name: "ゴブリンの巣窟",emoji: "👺", themeClass: "theme-goblin",  minPlayerLevel: 3, maxPlayerLevel: 4, enemyTypes: ["GOBLIN","WOLF"],     enemyCount: 14, gridSize: { rows: 10, cols: 10 }, clearExp: 45,  clearGold: 70,  itemChance: 0.10 },
  4: { name: "オークの要塞", emoji: "🏰", themeClass: "theme-fortress", minPlayerLevel: 4, maxPlayerLevel: 5, enemyTypes: ["WOLF","ORC"],        enemyCount: 16, gridSize: { rows: 10, cols: 10 }, clearExp: 60,  clearGold: 90,  itemChance: 0.08 },
  5: { name: "スケルトン墓地",emoji: "💀", themeClass: "theme-graveyard",minPlayerLevel: 5, maxPlayerLevel: 6, enemyTypes: ["ORC","SKELETON"],   enemyCount: 18, gridSize: { rows: 11, cols: 11 }, clearExp: 80,  clearGold: 120, itemChance: 0.07 },
  6: { name: "ドラゴンの山脈",emoji: "🐉", themeClass: "theme-dragon",  minPlayerLevel: 6, maxPlayerLevel: 7, enemyTypes: ["SKELETON","DRAGON"], enemyCount: 20, gridSize: { rows: 12, cols: 12 }, clearExp: 100, clearGold: 160, itemChance: 0.06 },
  7: { name: "悪魔の領域",   emoji: "😈", themeClass: "theme-demon",    minPlayerLevel: 7, maxPlayerLevel: 8, enemyTypes: ["DRAGON","DEMON"],    enemyCount: 22, gridSize: { rows: 12, cols: 12 }, clearExp: 130, clearGold: 200, itemChance: 0.05 },
  8: { name: "魔王の城",     emoji: "🏯", themeClass: "theme-castle",   minPlayerLevel: 8, maxPlayerLevel: 99,enemyTypes: ["DEMON"],             enemyCount: 25, gridSize: { rows: 13, cols: 13 }, clearExp: 200, clearGold: 300, itemChance: 0.04 }
};

export const ENEMY_TYPES = {
  SLIME:    { name: "スライム",   emoji: "💧", baseHp: 8,  baseAtk: 2,  baseExp: 5,  dangerRange: [0, 2], color: "#4CAF50" },
  GOBLIN:   { name: "ゴブリン",   emoji: "👺", baseHp: 12, baseAtk: 4,  baseExp: 8,  dangerRange: [1, 4], color: "#8BC34A" },
  WOLF:     { name: "オオカミ",   emoji: "🐺", baseHp: 15, baseAtk: 5,  baseExp: 10, dangerRange: [2, 5], color: "#795548" },
  ORC:      { name: "オーク",     emoji: "👹", baseHp: 20, baseAtk: 6,  baseExp: 12, dangerRange: [3, 6], color: "#FF9800" },
  SKELETON: { name: "スケルトン", emoji: "💀", baseHp: 18, baseAtk: 7,  baseExp: 15, dangerRange: [4, 7], color: "#9E9E9E" },
  DRAGON:   { name: "ドラゴン",   emoji: "🐉", baseHp: 25, baseAtk: 8,  baseExp: 20, dangerRange: [5, 8], color: "#F44336" },
  DEMON:    { name: "デーモン",   emoji: "😈", baseHp: 30, baseAtk: 10, baseExp: 25, dangerRange: [6, 8], color: "#9C27B0" }
};

export const ITEM_TYPES = {
  POTION:       { id: "potion",       name: "回復薬",   emoji: "🧪", description: "HPを10回復", effect: { type: "heal", value: 10 }, buyPrice: 30, sellPrice: 12 },
  SUPER_POTION: { id: "super_potion", name: "超回復薬", emoji: "💊", description: "HPを20回復", effect: { type: "heal", value: 20 }, buyPrice: 60, sellPrice: 24 },
  ATTACK_BOOST: { id: "attack_boost", name: "攻撃力UP", emoji: "⚔️", description: "攻撃力+3",   effect: { type: "atk",  value: 3  }, buyPrice: 80, sellPrice: 32 }
};

export const EQUIPMENT_TYPES = {
  // 武器
  WOODEN_STICK:    { id: "wooden_stick",    name: "木の棒",              emoji: "🪵", slot: "weapon", category: "equipment", atk: 2,    description: "ATK+2",      minDungeon: 1, sellPrice: 15  },
  IRON_SWORD:      { id: "iron_sword",      name: "鉄の剣",              emoji: "🗡️", slot: "weapon", category: "equipment", atk: 5,    description: "ATK+5",      minDungeon: 2, sellPrice: 40  },
  STEEL_SWORD:     { id: "steel_sword",     name: "鋼の剣",              emoji: "⚔️", slot: "weapon", category: "equipment", atk: 9,    description: "ATK+9",      minDungeon: 4, sellPrice: 70  },
  DRAGON_BLADE:    { id: "dragon_blade",    name: "竜の剣",              emoji: "🔥", slot: "weapon", category: "equipment", atk: 15,   description: "ATK+15",     minDungeon: 6, sellPrice: 120 },
  // 頭防具
  LEATHER_HELM:    { id: "leather_helm",    name: "革の兜",              emoji: "🪖", slot: "head",   category: "equipment", maxHp: 5,  description: "MaxHP+5",    minDungeon: 1, sellPrice: 15  },
  IRON_HELM:       { id: "iron_helm",       name: "鉄兜",                emoji: "⛑️", slot: "head",   category: "equipment", maxHp: 10, description: "MaxHP+10",   minDungeon: 2, sellPrice: 30  },
  STEEL_HELM:      { id: "steel_helm",      name: "鋼の兜",              emoji: "🔵", slot: "head",   category: "equipment", maxHp: 18, description: "MaxHP+18",   minDungeon: 4, sellPrice: 55  },
  DRAGON_HELM:     { id: "dragon_helm",     name: "竜の兜",              emoji: "👑", slot: "head",   category: "equipment", maxHp: 28, description: "MaxHP+28",   minDungeon: 6, sellPrice: 85  },
  // 胴防具
  LEATHER_ARMOR:   { id: "leather_armor",   name: "革鎧",                emoji: "🧥", slot: "body",   category: "equipment", maxHp: 8,  description: "MaxHP+8",    minDungeon: 1, sellPrice: 25  },
  CHAIN_MAIL:      { id: "chain_mail",      name: "鎖帷子",              emoji: "🛡️", slot: "body",   category: "equipment", maxHp: 15, description: "MaxHP+15",   minDungeon: 3, sellPrice: 45  },
  PLATE_ARMOR:     { id: "plate_armor",     name: "プレートアーマー",    emoji: "🔰", slot: "body",   category: "equipment", maxHp: 25, description: "MaxHP+25",   minDungeon: 5, sellPrice: 75  },
  DRAGON_SCALE:    { id: "dragon_scale",    name: "竜鱗鎧",              emoji: "🐲", slot: "body",   category: "equipment", maxHp: 38, description: "MaxHP+38",   minDungeon: 7, sellPrice: 115 },
  // 脚防具
  LEATHER_BOOTS:   { id: "leather_boots",   name: "革のブーツ",          emoji: "👟", slot: "legs",   category: "equipment", maxHp: 4,  description: "MaxHP+4",    minDungeon: 1, sellPrice: 12  },
  IRON_GREAVES:    { id: "iron_greaves",    name: "鉄の脚当て",          emoji: "🦵", slot: "legs",   category: "equipment", maxHp: 8,  description: "MaxHP+8",    minDungeon: 2, sellPrice: 25  },
  STEEL_GREAVES:   { id: "steel_greaves",   name: "鋼の脚当て",          emoji: "⚙️", slot: "legs",   category: "equipment", maxHp: 14, description: "MaxHP+14",   minDungeon: 4, sellPrice: 42  },
  DRAGON_GREAVES:  { id: "dragon_greaves",  name: "竜の脚当て",          emoji: "🦾", slot: "legs",   category: "equipment", maxHp: 22, description: "MaxHP+22",   minDungeon: 6, sellPrice: 65  }
};
