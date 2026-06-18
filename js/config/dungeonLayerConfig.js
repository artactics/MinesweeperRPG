/**
 * ダンジョン層設定ファイル（プロパティファイル）
 *
 * 各ダンジョンの表層・中層・深層ごとに以下の値を設定します。
 *   floorCount    : 階層数（クリアが必要なフロア数）
 *   gridSize      : グリッドサイズ { rows, cols }
 *   enemyCount    : 1フロアあたりの敵数
 *   exp           : ダンジョン層クリアで得る経験値
 *   gold          : ダンジョン層クリアで得るゴールド
 *   minPlayerLevel: この層に入場できる最低プレイヤーレベル
 *   drops         : ダンジョンクリア時のドロップテーブル（確率0のアイテムは記載しない）
 *                   { id: ITEM_TYPES/EQUIPMENT_TYPES のキー, category: "item"|"equipment", chance: 0～1 }
 */

/** 層の表示ラベル */
export const LAYER_LABELS = {
  surface: "表層",
  middle:  "中層",
  deep:    "深層"
};

/** 層キーの順序 */
export const LAYER_KEYS = ["surface", "middle", "deep"];

/**
 * ダンジョンごとの層設定
 * キーは DUNGEON_CONFIG のキー（1〜8）と対応
 */
export const DUNGEON_LAYER_CONFIG = {
  1: { // スライムの洞窟 ── スライムシリーズ（SLIME）
    surface: {
      floorCount: 1, gridSize: { rows: 8, cols: 8 }, enemyTypes: ["SLIME"], enemySpawn: { normal:  8, elite: 0, master: 0 }, exp:  1, gold: 1, minPlayerLevel: 1,
      drops: [
        { id: "POTION",       category: "item",      chance: 0.01 },
        { id: "SLIME_SWORD",  category: "equipment", chance: 0.01 },
        { id: "SLIME_HELM",   category: "equipment", chance: 0.01 },
        { id: "SLIME_ARMOR",  category: "equipment", chance: 0.01 },
        { id: "SLIME_BOOTS",  category: "equipment", chance: 0.01 },
      ],
    },
    middle: {
      floorCount: 2, gridSize: { rows: 8, cols: 8 }, enemyTypes: ["SLIME"], enemySpawn: { normal:  8, elite: 2, master: 0 }, exp:  3, gold: 3, minPlayerLevel: 1,
      drops: [
        { id: "POTION",       category: "item",      chance: 0.10 },
        { id: "SLIME_SWORD",  category: "equipment", chance: 0.10 },
        { id: "SLIME_HELM",   category: "equipment", chance: 0.10 },
        { id: "SLIME_ARMOR",  category: "equipment", chance: 0.10 },
        { id: "SLIME_BOOTS",  category: "equipment", chance: 0.10 },
      ],
    },
    deep: {
      floorCount: 3, gridSize: { rows: 8, cols: 8 }, enemyTypes: ["SLIME"], enemySpawn: { normal: 10, elite: 2, master: 1 }, exp:  6, gold: 6, minPlayerLevel: 2,
      drops: [
        { id: "POTION",       category: "item",      chance: 0.50 },
        { id: "SLIME_SWORD",  category: "equipment", chance: 0.50 },
        { id: "SLIME_HELM",   category: "equipment", chance: 0.50 },
        { id: "SLIME_ARMOR",  category: "equipment", chance: 0.50 },
        { id: "SLIME_BOOTS",  category: "equipment", chance: 0.50 },
      ],
    },
  },
  2: { // ゴブリンの森 ── ゴブリンシリーズ（GOBLIN）
    surface: {
      floorCount: 1, gridSize: { rows:  9, cols:  9 }, enemyTypes: ["SLIME", "GOBLIN"], enemySpawn: { normal: 10, elite: 0, master: 0 }, exp:  2, gold: 2, minPlayerLevel: 2,
      drops: [
        { id: "POTION",         category: "item",      chance: 0.01 },
        { id: "GOBLIN_SWORD",   category: "equipment", chance: 0.01 },
        { id: "GOBLIN_HELM",    category: "equipment", chance: 0.01 },
        { id: "GOBLIN_ARMOR",   category: "equipment", chance: 0.01 },
        { id: "GOBLIN_BOOTS",   category: "equipment", chance: 0.01 },
      ],
    },
    middle: {
      floorCount: 2, gridSize: { rows:  9, cols:  9 }, enemyTypes: ["SLIME", "GOBLIN"], enemySpawn: { normal:  9, elite: 3, master: 0 }, exp:  6, gold: 6, minPlayerLevel: 2,
      drops: [
        { id: "POTION",         category: "item",      chance: 0.10 },
        { id: "SUPER_POTION",   category: "item",      chance: 0.10 },
        { id: "GOBLIN_SWORD",   category: "equipment", chance: 0.10 },
        { id: "GOBLIN_HELM",    category: "equipment", chance: 0.10 },
        { id: "GOBLIN_ARMOR",   category: "equipment", chance: 0.10 },
        { id: "GOBLIN_BOOTS",   category: "equipment", chance: 0.10 },
      ],
    },
    deep: {
      floorCount: 3, gridSize: { rows: 9, cols: 9 }, enemyTypes: ["SLIME", "GOBLIN"], enemySpawn: { normal: 11, elite: 3, master: 1 }, exp: 12, gold: 12, minPlayerLevel: 3,
      drops: [
        { id: "SUPER_POTION",   category: "item",      chance: 0.50 },
        { id: "ATTACK_BOOST",   category: "item",      chance: 0.50 },
        { id: "GOBLIN_SWORD",   category: "equipment", chance: 0.50 },
        { id: "GOBLIN_HELM",    category: "equipment", chance: 0.50 },
        { id: "GOBLIN_ARMOR",   category: "equipment", chance: 0.50 },
        { id: "GOBLIN_BOOTS",   category: "equipment", chance: 0.50 },
      ],
    },
  },
  3: { // 狼の巣窟 ── 狼シリーズ（WOLF）
    surface: {
      floorCount: 1, gridSize: { rows:  10, cols:  10 }, enemyTypes: ["GOBLIN", "WOLF"], enemySpawn: { normal: 12, elite: 0, master: 0 }, exp:  4, gold: 4, minPlayerLevel: 3,
      drops: [
        { id: "SUPER_POTION",   category: "item",      chance: 0.01 },
        { id: "ATTACK_BOOST",   category: "item",      chance: 0.01 },
        { id: "WOLF_SWORD",     category: "equipment", chance: 0.01 },
        { id: "WOLF_HELM",      category: "equipment", chance: 0.01 },
        { id: "WOLF_ARMOR",     category: "equipment", chance: 0.01 },
        { id: "WOLF_BOOTS",     category: "equipment", chance: 0.01 },
      ],
    },
    middle: {
      floorCount: 2, gridSize: { rows: 10, cols: 10 }, enemyTypes: ["GOBLIN", "WOLF"], enemySpawn: { normal: 11, elite: 3, master: 0 }, exp: 12, gold: 12, minPlayerLevel: 3,
      drops: [
        { id: "SUPER_POTION",   category: "item",      chance: 0.10 },
        { id: "ATTACK_BOOST",   category: "item",      chance: 0.10 },
        { id: "WOLF_SWORD",     category: "equipment", chance: 0.10 },
        { id: "WOLF_HELM",      category: "equipment", chance: 0.10 },
        { id: "WOLF_ARMOR",     category: "equipment", chance: 0.10 },
        { id: "WOLF_BOOTS",     category: "equipment", chance: 0.10 },
      ],
    },
    deep: {
      floorCount: 3, gridSize: { rows: 10, cols: 10 }, enemyTypes: ["GOBLIN", "WOLF"], enemySpawn: { normal: 13, elite: 4, master: 1 }, exp: 24, gold: 24, minPlayerLevel: 4,
      drops: [
        { id: "SUPER_POTION",   category: "item",      chance: 0.50 },
        { id: "ATTACK_BOOST",   category: "item",      chance: 0.50 },
        { id: "WOLF_SWORD",     category: "equipment", chance: 0.50 },
        { id: "WOLF_HELM",      category: "equipment", chance: 0.50 },
        { id: "WOLF_ARMOR",     category: "equipment", chance: 0.50 },
        { id: "WOLF_BOOTS",     category: "equipment", chance: 0.50 },
      ],
    },
  },
  4: { // オークの要塞 ── オークシリーズ（ORC）
    surface: {
      floorCount: 1, gridSize: { rows:  10, cols:  10 }, enemyTypes: ["WOLF", "ORC"], enemySpawn: { normal: 13, elite: 0, master: 0 }, specialBlocks: { sturdy: 4 }, exp:  6, gold: 6, minPlayerLevel: 4,
      drops: [
        { id: "SUPER_POTION",   category: "item",      chance: 0.01 },
        { id: "ATTACK_BOOST",   category: "item",      chance: 0.01 },
        { id: "ORC_SWORD",      category: "equipment", chance: 0.01 },
        { id: "ORC_HELM",       category: "equipment", chance: 0.01 },
        { id: "ORC_ARMOR",      category: "equipment", chance: 0.01 },
        { id: "ORC_BOOTS",      category: "equipment", chance: 0.01 },
      ],
    },
    middle: {
      floorCount: 2, gridSize: { rows: 10, cols: 10 }, enemyTypes: ["WOLF", "ORC"], enemySpawn: { normal: 12, elite: 4, master: 0 }, specialBlocks: { sturdy: 6 }, exp: 18, gold: 18, minPlayerLevel: 4,
      drops: [
        { id: "SUPER_POTION",   category: "item",      chance: 0.10 },
        { id: "ATTACK_BOOST",   category: "item",      chance: 0.10 },
        { id: "ORC_SWORD",      category: "equipment", chance: 0.10 },
        { id: "ORC_HELM",       category: "equipment", chance: 0.10 },
        { id: "ORC_ARMOR",      category: "equipment", chance: 0.10 },
        { id: "ORC_BOOTS",      category: "equipment", chance: 0.10 },
      ],
    },
    deep: {
      floorCount: 3, gridSize: { rows: 10, cols: 10 }, enemyTypes: ["WOLF", "ORC"], enemySpawn: { normal: 14, elite: 4, master: 2 }, specialBlocks: { sturdy: 8 }, exp: 36, gold: 36, minPlayerLevel: 5,
      drops: [
        { id: "SUPER_POTION",   category: "item",      chance: 0.50 },
        { id: "ATTACK_BOOST",   category: "item",      chance: 0.50 },
        { id: "ORC_SWORD",      category: "equipment", chance: 0.50 },
        { id: "ORC_HELM",       category: "equipment", chance: 0.50 },
        { id: "ORC_ARMOR",      category: "equipment", chance: 0.50 },
        { id: "ORC_BOOTS",      category: "equipment", chance: 0.50 },
      ],
    },
  },
  5: { // 亡者の墓地 ── 亡者シリーズ（DEAD）
    surface: {
      floorCount: 1, gridSize: { rows: 11, cols: 11 }, enemyTypes: ["ORC", "SKELETON"], enemySpawn: { normal: 15, elite: 0, master: 0 }, specialBlocks: { fog: 4 }, exp: 8, gold: 8, minPlayerLevel: 5,
      drops: [
        { id: "SUPER_POTION",   category: "item",      chance: 0.01 },
        { id: "ATTACK_BOOST",   category: "item",      chance: 0.01 },
        { id: "DEAD_SWORD",     category: "equipment", chance: 0.01 },
        { id: "DEAD_HELM",      category: "equipment", chance: 0.01 },
        { id: "DEAD_ARMOR",     category: "equipment", chance: 0.01 },
        { id: "DEAD_BOOTS",     category: "equipment", chance: 0.01 },
      ],
    },
    middle: {
      floorCount: 2, gridSize: { rows: 11, cols: 11 }, enemyTypes: ["ORC", "SKELETON"], enemySpawn: { normal: 14, elite: 4, master: 0 }, specialBlocks: { fog: 6 }, exp: 24, gold: 24, minPlayerLevel: 5,
      drops: [
        { id: "SUPER_POTION",   category: "item",      chance: 0.10 },
        { id: "ATTACK_BOOST",   category: "item",      chance: 0.10 },
        { id: "DEAD_SWORD",     category: "equipment", chance: 0.10 },
        { id: "DEAD_HELM",      category: "equipment", chance: 0.10 },
        { id: "DEAD_ARMOR",     category: "equipment", chance: 0.10 },
        { id: "DEAD_BOOTS",     category: "equipment", chance: 0.10 },
      ],
    },
    deep: {
      floorCount: 3, gridSize: { rows: 11, cols: 11 }, enemyTypes: ["ORC", "SKELETON"], enemySpawn: { normal: 16, elite: 5, master: 2 }, specialBlocks: { fog: 8 }, exp: 48, gold: 48, minPlayerLevel: 6,
      drops: [
        { id: "SUPER_POTION",   category: "item",      chance: 0.50 },
        { id: "ATTACK_BOOST",   category: "item",      chance: 0.50 },
        { id: "DEAD_SWORD",     category: "equipment", chance: 0.50 },
        { id: "DEAD_HELM",      category: "equipment", chance: 0.50 },
        { id: "DEAD_ARMOR",     category: "equipment", chance: 0.50 },
        { id: "DEAD_BOOTS",     category: "equipment", chance: 0.50 },
      ],
    },
  },
  6: { // ドラゴンの山脈 ── ドラゴンシリーズ（DRAGON）
    surface: {
      floorCount: 1, gridSize: { rows: 11, cols: 11 }, enemyTypes: ["SKELETON", "DRAGON"], enemySpawn: { normal: 17, elite: 0, master: 0 }, specialBlocks: { tension: 4 }, exp:  12, gold:  12, minPlayerLevel: 6,
      drops: [
        { id: "SUPER_POTION",   category: "item",      chance: 0.01 },
        { id: "ATTACK_BOOST",   category: "item",      chance: 0.01 },
        { id: "DRAGON_SWORD",   category: "equipment", chance: 0.01 },
        { id: "DRAGON_HELM",    category: "equipment", chance: 0.01 },
        { id: "DRAGON_ARMOR",   category: "equipment", chance: 0.01 },
        { id: "DRAGON_BOOTS",   category: "equipment", chance: 0.01 },
      ],
    },
    middle: {
      floorCount: 2, gridSize: { rows: 11, cols: 11 }, enemyTypes: ["SKELETON", "DRAGON"], enemySpawn: { normal: 15, elite: 5, master: 0 }, specialBlocks: { tension: 6 }, exp:  36, gold:  36, minPlayerLevel: 6,
      drops: [
        { id: "SUPER_POTION",   category: "item",      chance: 0.10 },
        { id: "ATTACK_BOOST",   category: "item",      chance: 0.10 },
        { id: "DRAGON_SWORD",   category: "equipment", chance: 0.10 },
        { id: "DRAGON_HELM",    category: "equipment", chance: 0.10 },
        { id: "DRAGON_ARMOR",   category: "equipment", chance: 0.10 },
        { id: "DRAGON_BOOTS",   category: "equipment", chance: 0.10 },
      ],
    },
    deep: {
      floorCount: 3, gridSize: { rows: 11, cols: 11 }, enemyTypes: ["SKELETON", "DRAGON"], enemySpawn: { normal: 18, elite: 6, master: 2 }, specialBlocks: { tension: 8 }, exp: 72, gold: 72, minPlayerLevel: 7,
      drops: [
        { id: "SUPER_POTION",   category: "item",      chance: 0.50 },
        { id: "ATTACK_BOOST",   category: "item",      chance: 0.50 },
        { id: "DRAGON_SWORD",   category: "equipment", chance: 0.50 },
        { id: "DRAGON_HELM",    category: "equipment", chance: 0.50 },
        { id: "DRAGON_ARMOR",   category: "equipment", chance: 0.50 },
        { id: "DRAGON_BOOTS",   category: "equipment", chance: 0.50 },
      ],
    },
  },
  7: { // 悪魔の領域 ── 悪魔シリーズ（DEMON）
    surface: {
      floorCount: 1, gridSize: { rows: 12, cols: 12 }, enemyTypes: ["DRAGON", "DEMON"], enemySpawn: { normal: 18, elite: 0, master: 0 }, specialBlocks: { phantom: 4 }, exp:  16, gold:  16, minPlayerLevel: 7,
      drops: [
        { id: "SUPER_POTION",   category: "item",      chance: 0.01 },
        { id: "ATTACK_BOOST",   category: "item",      chance: 0.01 },
        { id: "DEMON_SWORD",    category: "equipment", chance: 0.01 },
        { id: "DEMON_HELM",     category: "equipment", chance: 0.01 },
        { id: "DEMON_ARMOR",    category: "equipment", chance: 0.01 },
        { id: "DEMON_BOOTS",    category: "equipment", chance: 0.01 },
      ],
    },
    middle: {
      floorCount: 2, gridSize: { rows: 12, cols: 12 }, enemyTypes: ["DRAGON", "DEMON"], enemySpawn: { normal: 17, elite: 5, master: 0 }, specialBlocks: { phantom: 6 }, exp: 48, gold: 48, minPlayerLevel: 7,
      drops: [
        { id: "SUPER_POTION",   category: "item",      chance: 0.10 },
        { id: "ATTACK_BOOST",   category: "item",      chance: 0.10 },
        { id: "DEMON_SWORD",    category: "equipment", chance: 0.10 },
        { id: "DEMON_HELM",     category: "equipment", chance: 0.10 },
        { id: "DEMON_ARMOR",    category: "equipment", chance: 0.10 },
        { id: "DEMON_BOOTS",    category: "equipment", chance: 0.10 },
      ],
    },
    deep: {
      floorCount: 3, gridSize: { rows: 12, cols: 12 }, enemyTypes: ["DRAGON", "DEMON"], enemySpawn: { normal: 20, elite: 6, master: 2 }, specialBlocks: { phantom: 8 }, exp: 96, gold: 96, minPlayerLevel: 8,
      drops: [
        { id: "SUPER_POTION",   category: "item",      chance: 0.50 },
        { id: "ATTACK_BOOST",   category: "item",      chance: 0.50 },
        { id: "DEMON_SWORD",    category: "equipment", chance: 0.50 },
        { id: "DEMON_HELM",     category: "equipment", chance: 0.50 },
        { id: "DEMON_ARMOR",    category: "equipment", chance: 0.50 },
        { id: "DEMON_BOOTS",    category: "equipment", chance: 0.50 },
      ],
    },
  },
  8: { // 魔王の城 ── 魔王シリーズ（LORD）
    surface: {
      floorCount: 1, gridSize: { rows: 12, cols: 12 }, enemyTypes: ["DEMON"], enemySpawn: { normal: 20, elite: 0, master: 0 }, specialBlocks: { fog: 2, sturdy: 2 }, exp: 24, gold: 24, minPlayerLevel: 8,
      drops: [
        { id: "SUPER_POTION",   category: "item",      chance: 0.01 },
        { id: "ATTACK_BOOST",   category: "item",      chance: 0.01 },
        { id: "LORD_SWORD",     category: "equipment", chance: 0.01 },
        { id: "LORD_HELM",      category: "equipment", chance: 0.01 },
        { id: "LORD_ARMOR",     category: "equipment", chance: 0.01 },
        { id: "LORD_BOOTS",     category: "equipment", chance: 0.01 },
      ],
    },
    middle: {
      floorCount: 2, gridSize: { rows: 12, cols: 12 }, enemyTypes: ["DEMON"], enemySpawn: { normal: 19, elite: 6, master: 0 }, specialBlocks: { fog: 4, sturdy: 2, tension: 2, phantom: 2 }, exp: 72, gold: 72, minPlayerLevel: 8,
      drops: [
        { id: "SUPER_POTION",   category: "item",      chance: 0.10 },
        { id: "ATTACK_BOOST",   category: "item",      chance: 0.10 },
        { id: "LORD_SWORD",     category: "equipment", chance: 0.10 },
        { id: "LORD_HELM",      category: "equipment", chance: 0.10 },
        { id: "LORD_ARMOR",     category: "equipment", chance: 0.10 },
        { id: "LORD_BOOTS",     category: "equipment", chance: 0.10 },
      ],
    },
    deep: {
      floorCount: 3, gridSize: { rows: 12, cols: 12 }, enemyTypes: ["DEMON"], enemySpawn: { normal: 22, elite: 7, master: 3 }, specialBlocks: { fog: 4, sturdy: 4, tension: 4, phantom: 4 }, exp: 148, gold: 148, minPlayerLevel: 8,
      drops: [
        { id: "SUPER_POTION",   category: "item",      chance: 0.50 },
        { id: "ATTACK_BOOST",   category: "item",      chance: 0.50 },
        { id: "LORD_SWORD",     category: "equipment", chance: 0.50 },
        { id: "LORD_HELM",      category: "equipment", chance: 0.50 },
        { id: "LORD_ARMOR",     category: "equipment", chance: 0.50 },
        { id: "LORD_BOOTS",     category: "equipment", chance: 0.50 },
      ],
    },
  },
};
