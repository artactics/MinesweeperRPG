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
  ATK_GAIN_PER_LEVEL: 2
};

const ASSET = (dir, file) => `asset/image/${dir}/${file}`;
const DUNGEON_IMG = (themeClass) => ASSET("dungeon", `${themeClass}.svg`);
const ENEMY_IMG = (file) => ASSET("enemy", file);
const ITEM_IMG = (file) => ASSET("item", file);
const EQ_IMG = (file) => ASSET("equipment", file);

/** 装備ティアごとの表示色（同一 SVG を色分け） */
const TIER_COLOR = {
  1: "#8D6E63",
  2: "#90A4AE",
  3: "#5C6BC0",
  4: "#FFC107"
};

export const DUNGEON_CONFIG = {
  1: { name: "初心者の洞窟", themeClass: "theme-cave", iconUrl: DUNGEON_IMG("theme-cave"), iconColor: "#BCAAA4", minPlayerLevel: 1, maxPlayerLevel: 2, enemyTypes: ["SLIME"], enemyCount: 10, gridSize: { rows: 8, cols: 8 }, clearExp: 20, clearGold: 30, itemChance: 0.15 },
  2: { name: "森の小道", themeClass: "theme-forest", iconUrl: DUNGEON_IMG("theme-forest"), iconColor: "#66BB6A", minPlayerLevel: 2, maxPlayerLevel: 3, enemyTypes: ["SLIME", "GOBLIN"], enemyCount: 12, gridSize: { rows: 9, cols: 9 }, clearExp: 30, clearGold: 50, itemChance: 0.12 },
  3: { name: "ゴブリンの巣窟", themeClass: "theme-goblin", iconUrl: DUNGEON_IMG("theme-goblin"), iconColor: "#9CCC65", minPlayerLevel: 3, maxPlayerLevel: 4, enemyTypes: ["GOBLIN", "WOLF"], enemyCount: 14, gridSize: { rows: 10, cols: 10 }, clearExp: 45, clearGold: 70, itemChance: 0.10 },
  4: { name: "オークの要塞", themeClass: "theme-fortress", iconUrl: DUNGEON_IMG("theme-fortress"), iconColor: "#FF8A65", minPlayerLevel: 4, maxPlayerLevel: 5, enemyTypes: ["WOLF", "ORC"], enemyCount: 16, gridSize: { rows: 10, cols: 10 }, clearExp: 60, clearGold: 90, itemChance: 0.08 },
  5: { name: "スケルトン墓地", themeClass: "theme-graveyard", iconUrl: DUNGEON_IMG("theme-graveyard"), iconColor: "#B39DDB", minPlayerLevel: 5, maxPlayerLevel: 6, enemyTypes: ["ORC", "SKELETON"], enemyCount: 18, gridSize: { rows: 11, cols: 11 }, clearExp: 80, clearGold: 120, itemChance: 0.07 },
  6: { name: "ドラゴンの山脈", themeClass: "theme-dragon", iconUrl: DUNGEON_IMG("theme-dragon"), iconColor: "#EF5350", minPlayerLevel: 6, maxPlayerLevel: 7, enemyTypes: ["SKELETON", "DRAGON"], enemyCount: 20, gridSize: { rows: 12, cols: 12 }, clearExp: 100, clearGold: 160, itemChance: 0.06 },
  7: { name: "悪魔の領域", themeClass: "theme-demon", iconUrl: DUNGEON_IMG("theme-demon"), iconColor: "#AB47BC", minPlayerLevel: 7, maxPlayerLevel: 8, enemyTypes: ["DRAGON", "DEMON"], enemyCount: 22, gridSize: { rows: 12, cols: 12 }, clearExp: 130, clearGold: 200, itemChance: 0.05 },
  8: { name: "魔王の城", themeClass: "theme-castle", iconUrl: DUNGEON_IMG("theme-castle"), iconColor: "#E53935", minPlayerLevel: 8, maxPlayerLevel: 99, enemyTypes: ["DEMON"], enemyCount: 25, gridSize: { rows: 13, cols: 13 }, clearExp: 200, clearGold: 300, itemChance: 0.04 }
};

export const ENEMY_TYPES = {
  SLIME:    { name: "スライム", iconUrl: ENEMY_IMG("slime.svg"), color: "#4CAF50", baseHp: 8, baseAtk: 2, baseExp: 5, dangerRange: [0, 2] },
  GOBLIN:   { name: "ゴブリン", iconUrl: ENEMY_IMG("goblin.svg"), color: "#8BC34A", baseHp: 12, baseAtk: 4, baseExp: 8, dangerRange: [1, 4] },
  WOLF:     { name: "オオカミ", iconUrl: ENEMY_IMG("wolf.svg"), color: "#A1887F", baseHp: 15, baseAtk: 5, baseExp: 10, dangerRange: [2, 5] },
  ORC:      { name: "オーク", iconUrl: ENEMY_IMG("orc.svg"), color: "#FF9800", baseHp: 20, baseAtk: 6, baseExp: 12, dangerRange: [3, 6] },
  SKELETON: { name: "スケルトン", iconUrl: ENEMY_IMG("skeleton.svg"), color: "#E0E0E0", baseHp: 18, baseAtk: 7, baseExp: 15, dangerRange: [4, 7] },
  DRAGON:   { name: "ドラゴン", iconUrl: ENEMY_IMG("dragon.svg"), color: "#F44336", baseHp: 25, baseAtk: 8, baseExp: 20, dangerRange: [5, 8] },
  DEMON:    { name: "デーモン", iconUrl: ENEMY_IMG("demon.svg"), color: "#CE93D8", baseHp: 30, baseAtk: 10, baseExp: 25, dangerRange: [6, 8] }
};

export const ITEM_TYPES = {
  POTION:       { id: "potion", name: "回復薬", iconUrl: ITEM_IMG("round-potion.svg"), iconColor: "#66BB6A", minDungeon: 1, description: "HP+10回復", effect: { type: "heal", value: 10 }, healScale: 3, buyPrice: 30, sellPrice: 12 },
  SUPER_POTION: { id: "super_potion", name: "超回復薬", iconUrl: ITEM_IMG("round-potion.svg"), iconColor: "#42A5F5", minDungeon: 3, description: "HP+20回復", effect: { type: "heal", value: 20 }, healScale: 5, buyPrice: 60, sellPrice: 24 },
  ATTACK_BOOST: { id: "attack_boost", name: "攻撃力UP", iconUrl: EQ_IMG("sword.svg"), iconColor: "#EF5350", minDungeon: 2, description: "ATK+3", effect: { type: "atk", value: 3 }, atkScale: 1, buyPrice: 80, sellPrice: 32 }
};

export const EQUIPMENT_TYPES = {
  WOODEN_STICK:   { id: "wooden_stick", name: "木の棒", iconUrl: EQ_IMG("sword.svg"), iconColor: TIER_COLOR[1], slot: "weapon", category: "equipment", atk: 2, description: "ATK+2", minDungeon: 1, sellPrice: 15 },
  IRON_SWORD:     { id: "iron_sword", name: "鉄の剣", iconUrl: EQ_IMG("sword.svg"), iconColor: TIER_COLOR[2], slot: "weapon", category: "equipment", atk: 5, description: "ATK+5", minDungeon: 2, sellPrice: 40 },
  STEEL_SWORD:    { id: "steel_sword", name: "鋼の剣", iconUrl: EQ_IMG("sword.svg"), iconColor: TIER_COLOR[3], slot: "weapon", category: "equipment", atk: 9, description: "ATK+9", minDungeon: 4, sellPrice: 70 },
  DRAGON_BLADE:   { id: "dragon_blade", name: "竜の剣", iconUrl: EQ_IMG("sword.svg"), iconColor: TIER_COLOR[4], slot: "weapon", category: "equipment", atk: 15, description: "ATK+15", minDungeon: 6, sellPrice: 120 },
  LEATHER_HELM:   { id: "leather_helm", name: "革の兜", iconUrl: EQ_IMG("helm.svg"), iconColor: TIER_COLOR[1], slot: "head", category: "equipment", maxHp: 5, description: "MaxHP+5", minDungeon: 1, sellPrice: 15 },
  IRON_HELM:      { id: "iron_helm", name: "鉄兜", iconUrl: EQ_IMG("helm.svg"), iconColor: TIER_COLOR[2], slot: "head", category: "equipment", maxHp: 10, description: "MaxHP+10", minDungeon: 2, sellPrice: 30 },
  STEEL_HELM:     { id: "steel_helm", name: "鋼の兜", iconUrl: EQ_IMG("helm.svg"), iconColor: TIER_COLOR[3], slot: "head", category: "equipment", maxHp: 18, description: "MaxHP+18", minDungeon: 4, sellPrice: 55 },
  DRAGON_HELM:    { id: "dragon_helm", name: "竜の兜", iconUrl: EQ_IMG("helm.svg"), iconColor: TIER_COLOR[4], slot: "head", category: "equipment", maxHp: 28, description: "MaxHP+28", minDungeon: 6, sellPrice: 85 },
  LEATHER_ARMOR:  { id: "leather_armor", name: "革鎧", iconUrl: EQ_IMG("armor.svg"), iconColor: TIER_COLOR[1], slot: "body", category: "equipment", maxHp: 8, description: "MaxHP+8", minDungeon: 1, sellPrice: 25 },
  CHAIN_MAIL:     { id: "chain_mail", name: "鎖帷子", iconUrl: EQ_IMG("armor.svg"), iconColor: TIER_COLOR[2], slot: "body", category: "equipment", maxHp: 15, description: "MaxHP+15", minDungeon: 3, sellPrice: 45 },
  PLATE_ARMOR:    { id: "plate_armor", name: "プレートアーマー", iconUrl: EQ_IMG("armor.svg"), iconColor: TIER_COLOR[3], slot: "body", category: "equipment", maxHp: 25, description: "MaxHP+25", minDungeon: 5, sellPrice: 75 },
  DRAGON_SCALE:   { id: "dragon_scale", name: "竜鱗鎧", iconUrl: EQ_IMG("armor.svg"), iconColor: TIER_COLOR[4], slot: "body", category: "equipment", maxHp: 38, description: "MaxHP+38", minDungeon: 7, sellPrice: 115 },
  LEATHER_BOOTS:  { id: "leather_boots", name: "革のブーツ", iconUrl: EQ_IMG("boots.svg"), iconColor: TIER_COLOR[1], slot: "legs", category: "equipment", maxHp: 4, description: "MaxHP+4", minDungeon: 1, sellPrice: 12 },
  IRON_GREAVES:   { id: "iron_greaves", name: "鉄の脚当て", iconUrl: EQ_IMG("boots.svg"), iconColor: TIER_COLOR[2], slot: "legs", category: "equipment", maxHp: 8, description: "MaxHP+8", minDungeon: 2, sellPrice: 25 },
  STEEL_GREAVES:  { id: "steel_greaves", name: "鋼の脚当て", iconUrl: EQ_IMG("boots.svg"), iconColor: TIER_COLOR[3], slot: "legs", category: "equipment", maxHp: 14, description: "MaxHP+14", minDungeon: 4, sellPrice: 42 },
  DRAGON_GREAVES: { id: "dragon_greaves", name: "竜の脚当て", iconUrl: EQ_IMG("boots.svg"), iconColor: TIER_COLOR[4], slot: "legs", category: "equipment", maxHp: 22, description: "MaxHP+22", minDungeon: 6, sellPrice: 65 }
};
