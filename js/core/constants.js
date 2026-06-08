import { ITEM_CONFIG }      from "../config/itemConfig.js";
import { EQUIPMENT_CONFIG } from "../config/equipmentConfig.js";

/** ITEM_TYPES / EQUIPMENT_TYPES として他ファイルから参照可能 */
export const ITEM_TYPES      = ITEM_CONFIG;
export const EQUIPMENT_TYPES = EQUIPMENT_CONFIG;

/**
 * アイテム・装備品にダンジョンレベルのスケーリングを適用して返す
 * @param {object} base - ITEM_TYPES または EQUIPMENT_TYPES のエントリ
 * @param {number} dungeonLevel - ダンジョンレベル（1〜8）
 * @returns {object} スケール済みアイテムオブジェクト
 */
export function levelItem(base, dungeonLevel) {
  const extra = Math.max(0, dungeonLevel - (base.minDungeon || 1));
  const leveled = { ...base, level: dungeonLevel };
  if (base.category === "equipment") {
    if (base.atk)   { leveled.atk   = base.atk   + extra;     leveled.description = `ATK+${leveled.atk} Lv${dungeonLevel}`; }
    if (base.maxHp) { leveled.maxHp = base.maxHp + extra * 2; leveled.description = `MaxHP+${leveled.maxHp} Lv${dungeonLevel}`; }
  } else {
    const val = base.effect.value
      + (base.healScale || 0) * extra
      + (base.atkScale  || 0) * extra
      + (base.mpScale   || 0) * extra;
    leveled.effect = { ...base.effect, value: val };
    leveled.description = base.effect.type === "heal"
      ? `HP+${val}回復 Lv${dungeonLevel}`
      : base.effect.type === "mp_heal"
      ? `MP+${val}回復 Lv${dungeonLevel}`
      : `ATK+${val} Lv${dungeonLevel}`;
  }
  return leveled;
}

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

const ASSET = (dir, file) => `./asset/image/${dir}/${file}`;
const DUNGEON_IMG = (themeClass) => ASSET("dungeon", `${themeClass}.svg`);
const ENEMY_IMG = (file) => ASSET("enemy", file);

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
  SLIME:    { name: "スライム", iconUrl: ENEMY_IMG("slime.svg"), color: "#4CAF50", baseHp: 10, baseAtk: 2, baseExp: 5, dangerRange: [0, 2],
    skills: [{ id: "drain", chance: 0.20 }] },
  GOBLIN:   { name: "ゴブリン", iconUrl: ENEMY_IMG("goblin.svg"), color: "#8BC34A", baseHp: 20, baseAtk: 4, baseExp: 8, dangerRange: [1, 4],
    skills: [{ id: "charge", chance: 0.20 }] },
  WOLF:     { name: "オオカミ", iconUrl: ENEMY_IMG("wolf.svg"), color: "#A1887F", baseHp: 40, baseAtk: 7, baseExp: 10, dangerRange: [2, 5],
    skills: [{ id: "fire_mark", chance: 0.20 }] },
  ORC:      { name: "オーク", iconUrl: ENEMY_IMG("orc.svg"), color: "#FF9800", baseHp: 70, baseAtk: 11, baseExp: 12, dangerRange: [3, 6],
    skills: [{ id: "ice_mark", chance: 0.20 }] },
  SKELETON: { name: "スケルトン", iconUrl: ENEMY_IMG("skeleton.svg"), color: "#E0E0E0", baseHp: 110, baseAtk: 16, baseExp: 15, dangerRange: [4, 7],
    skills: [{ id: "regen", chance: 0.40 }, { id: "poison_mark", chance: 0.20 }] },
  DRAGON:   { name: "ドラゴン", iconUrl: ENEMY_IMG("dragon.svg"), color: "#F44336", baseHp: 160, baseAtk: 22, baseExp: 20, dangerRange: [5, 8],
    skills: [{ id: "flame_breath", chance: 0.20 }] },
  DEMON:    { name: "デーモン", iconUrl: ENEMY_IMG("demon.svg"), color: "#CE93D8", baseHp: 230, baseAtk: 29, baseExp: 25, dangerRange: [6, 8],
    skills: [{ id: "poison_breath", chance: 0.20 }, { id: "ice_breath", chance: 0.20 }] }
};

