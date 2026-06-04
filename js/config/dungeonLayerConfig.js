/**
 * ダンジョン層設定ファイル（プロパティファイル）
 *
 * 各ダンジョンの表層・中層・深層ごとに以下の値を設定します。
 *   floorCount    : 階層数（クリアが必要なフロア数）
 *   gridSize      : グリッドサイズ { rows, cols }
 *   enemyCount    : 1フロアあたりの敵数
 *   expPerFloor   : 1フロアクリアで得る経験値
 *   goldPerFloor  : 1フロアクリアで得るゴールド
 *   minPlayerLevel: この層に入場できる最低プレイヤーレベル
 *   drops         : ダンジョンクリア時のドロップテーブル（確率0のアイテムは記載しない）
 *                   { id: ITEM_TYPES/EQUIPMENT_TYPES のキー, category: "item"|"equipment", chance: 0〜1 }
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
      floorCount: 1, gridSize: { rows: 7, cols: 7 }, enemyCount:  8, expPerFloor:  8, goldPerFloor: 12, minPlayerLevel: 1,
      drops: [
        { id: "POTION",       category: "item",      chance: 0.01 },
        { id: "SLIME_SWORD",  category: "equipment", chance: 0.01 },
        { id: "SLIME_HELM",   category: "equipment", chance: 0.01 },
        { id: "SLIME_ARMOR",  category: "equipment", chance: 0.01 },
        { id: "SLIME_BOOTS",  category: "equipment", chance: 0.01 },
      ],
    },
    middle: {
      floorCount: 2, gridSize: { rows: 8, cols: 8 }, enemyCount: 10, expPerFloor: 10, goldPerFloor: 16, minPlayerLevel: 1,
      drops: [
        { id: "POTION",       category: "item",      chance: 0.10 },
        { id: "SLIME_SWORD",  category: "equipment", chance: 0.10 },
        { id: "SLIME_HELM",   category: "equipment", chance: 0.10 },
        { id: "SLIME_ARMOR",  category: "equipment", chance: 0.10 },
        { id: "SLIME_BOOTS",  category: "equipment", chance: 0.10 },
      ],
    },
    deep: {
      floorCount: 3, gridSize: { rows: 9, cols: 9 }, enemyCount: 13, expPerFloor: 14, goldPerFloor: 22, minPlayerLevel: 2,
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
      floorCount: 1, gridSize: { rows:  8, cols:  8 }, enemyCount: 10, expPerFloor: 12, goldPerFloor: 18, minPlayerLevel: 2,
      drops: [
        { id: "POTION",         category: "item",      chance: 0.01 },
        { id: "GOBLIN_SWORD",   category: "equipment", chance: 0.01 },
        { id: "GOBLIN_HELM",    category: "equipment", chance: 0.01 },
        { id: "GOBLIN_ARMOR",   category: "equipment", chance: 0.01 },
        { id: "GOBLIN_BOOTS",   category: "equipment", chance: 0.01 },
      ],
    },
    middle: {
      floorCount: 2, gridSize: { rows:  9, cols:  9 }, enemyCount: 12, expPerFloor: 15, goldPerFloor: 25, minPlayerLevel: 2,
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
      floorCount: 3, gridSize: { rows: 10, cols: 10 }, enemyCount: 15, expPerFloor: 20, goldPerFloor: 35, minPlayerLevel: 3,
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
      floorCount: 1, gridSize: { rows:  9, cols:  9 }, enemyCount: 12, expPerFloor: 18, goldPerFloor: 28, minPlayerLevel: 3,
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
      floorCount: 3, gridSize: { rows: 10, cols: 10 }, enemyCount: 14, expPerFloor: 22, goldPerFloor: 38, minPlayerLevel: 3,
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
      floorCount: 5, gridSize: { rows: 11, cols: 11 }, enemyCount: 18, expPerFloor: 30, goldPerFloor: 52, minPlayerLevel: 4,
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
      floorCount: 1, gridSize: { rows:  9, cols:  9 }, enemyCount: 13, expPerFloor: 24, goldPerFloor: 36, minPlayerLevel: 4,
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
      floorCount: 3, gridSize: { rows: 10, cols: 10 }, enemyCount: 16, expPerFloor: 30, goldPerFloor: 48, minPlayerLevel: 4,
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
      floorCount: 5, gridSize: { rows: 11, cols: 11 }, enemyCount: 20, expPerFloor: 40, goldPerFloor: 65, minPlayerLevel: 5,
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
      floorCount: 1, gridSize: { rows: 10, cols: 10 }, enemyCount: 15, expPerFloor: 32, goldPerFloor: 48, minPlayerLevel: 5,
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
      floorCount: 3, gridSize: { rows: 11, cols: 11 }, enemyCount: 18, expPerFloor: 40, goldPerFloor: 64, minPlayerLevel: 5,
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
      floorCount: 6, gridSize: { rows: 12, cols: 12 }, enemyCount: 23, expPerFloor: 55, goldPerFloor: 88, minPlayerLevel: 6,
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
      floorCount: 1, gridSize: { rows: 11, cols: 11 }, enemyCount: 17, expPerFloor:  40, goldPerFloor:  64, minPlayerLevel: 6,
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
      floorCount: 3, gridSize: { rows: 12, cols: 12 }, enemyCount: 20, expPerFloor:  50, goldPerFloor:  80, minPlayerLevel: 6,
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
      floorCount: 6, gridSize: { rows: 13, cols: 13 }, enemyCount: 26, expPerFloor:  70, goldPerFloor: 112, minPlayerLevel: 7,
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
      floorCount: 2, gridSize: { rows: 11, cols: 11 }, enemyCount: 18, expPerFloor:  52, goldPerFloor:  80, minPlayerLevel: 7,
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
      floorCount: 4, gridSize: { rows: 12, cols: 12 }, enemyCount: 22, expPerFloor:  65, goldPerFloor: 105, minPlayerLevel: 7,
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
      floorCount: 7, gridSize: { rows: 13, cols: 13 }, enemyCount: 28, expPerFloor:  90, goldPerFloor: 145, minPlayerLevel: 8,
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
      floorCount: 3, gridSize: { rows: 12, cols: 12 }, enemyCount: 20, expPerFloor:  80, goldPerFloor: 120, minPlayerLevel: 8,
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
      floorCount: 5, gridSize: { rows: 13, cols: 13 }, enemyCount: 25, expPerFloor: 100, goldPerFloor: 162, minPlayerLevel: 8,
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
      floorCount: 8, gridSize: { rows: 14, cols: 14 }, enemyCount: 32, expPerFloor: 140, goldPerFloor: 225, minPlayerLevel: 8,
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
