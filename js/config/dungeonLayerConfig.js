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
  1: { // 初心者の洞窟
    surface: { floorCount: 2, gridSize: { rows: 7, cols: 7 }, enemyCount:  8, expPerFloor:  8, goldPerFloor: 12, minPlayerLevel: 1 },
    middle:  { floorCount: 3, gridSize: { rows: 8, cols: 8 }, enemyCount: 10, expPerFloor: 10, goldPerFloor: 16, minPlayerLevel: 1 },
    deep:    { floorCount: 5, gridSize: { rows: 9, cols: 9 }, enemyCount: 13, expPerFloor: 14, goldPerFloor: 22, minPlayerLevel: 2 },
  },
  2: { // 森の小道
    surface: { floorCount: 2, gridSize: { rows:  8, cols:  8 }, enemyCount: 10, expPerFloor: 12, goldPerFloor: 18, minPlayerLevel: 2 },
    middle:  { floorCount: 3, gridSize: { rows:  9, cols:  9 }, enemyCount: 12, expPerFloor: 15, goldPerFloor: 25, minPlayerLevel: 2 },
    deep:    { floorCount: 5, gridSize: { rows: 10, cols: 10 }, enemyCount: 15, expPerFloor: 20, goldPerFloor: 35, minPlayerLevel: 3 },
  },
  3: { // ゴブリンの巣窟
    surface: { floorCount: 2, gridSize: { rows:  9, cols:  9 }, enemyCount: 12, expPerFloor: 18, goldPerFloor: 28, minPlayerLevel: 3 },
    middle:  { floorCount: 3, gridSize: { rows: 10, cols: 10 }, enemyCount: 14, expPerFloor: 22, goldPerFloor: 38, minPlayerLevel: 3 },
    deep:    { floorCount: 5, gridSize: { rows: 11, cols: 11 }, enemyCount: 18, expPerFloor: 30, goldPerFloor: 52, minPlayerLevel: 4 },
  },
  4: { // オークの要塞
    surface: { floorCount: 2, gridSize: { rows:  9, cols:  9 }, enemyCount: 13, expPerFloor: 24, goldPerFloor: 36, minPlayerLevel: 4 },
    middle:  { floorCount: 3, gridSize: { rows: 10, cols: 10 }, enemyCount: 16, expPerFloor: 30, goldPerFloor: 48, minPlayerLevel: 4 },
    deep:    { floorCount: 5, gridSize: { rows: 11, cols: 11 }, enemyCount: 20, expPerFloor: 40, goldPerFloor: 65, minPlayerLevel: 5 },
  },
  5: { // スケルトン墓地
    surface: { floorCount: 2, gridSize: { rows: 10, cols: 10 }, enemyCount: 15, expPerFloor: 32, goldPerFloor: 48, minPlayerLevel: 5 },
    middle:  { floorCount: 3, gridSize: { rows: 11, cols: 11 }, enemyCount: 18, expPerFloor: 40, goldPerFloor: 64, minPlayerLevel: 5 },
    deep:    { floorCount: 5, gridSize: { rows: 12, cols: 12 }, enemyCount: 23, expPerFloor: 55, goldPerFloor: 88, minPlayerLevel: 6 },
  },
  6: { // ドラゴンの山脈
    surface: { floorCount: 2, gridSize: { rows: 11, cols: 11 }, enemyCount: 17, expPerFloor:  40, goldPerFloor:  64, minPlayerLevel: 6 },
    middle:  { floorCount: 3, gridSize: { rows: 12, cols: 12 }, enemyCount: 20, expPerFloor:  50, goldPerFloor:  80, minPlayerLevel: 6 },
    deep:    { floorCount: 5, gridSize: { rows: 13, cols: 13 }, enemyCount: 26, expPerFloor:  70, goldPerFloor: 112, minPlayerLevel: 7 },
  },
  7: { // 悪魔の領域
    surface: { floorCount: 2, gridSize: { rows: 11, cols: 11 }, enemyCount: 18, expPerFloor:  52, goldPerFloor:  80, minPlayerLevel: 7 },
    middle:  { floorCount: 3, gridSize: { rows: 12, cols: 12 }, enemyCount: 22, expPerFloor:  65, goldPerFloor: 105, minPlayerLevel: 7 },
    deep:    { floorCount: 5, gridSize: { rows: 13, cols: 13 }, enemyCount: 28, expPerFloor:  90, goldPerFloor: 145, minPlayerLevel: 8 },
  },
  8: { // 魔王の城
    surface: { floorCount: 2, gridSize: { rows: 12, cols: 12 }, enemyCount: 20, expPerFloor:  80, goldPerFloor: 120, minPlayerLevel: 8 },
    middle:  { floorCount: 3, gridSize: { rows: 13, cols: 13 }, enemyCount: 25, expPerFloor: 100, goldPerFloor: 162, minPlayerLevel: 8 },
    deep:    { floorCount: 5, gridSize: { rows: 14, cols: 14 }, enemyCount: 32, expPerFloor: 140, goldPerFloor: 225, minPlayerLevel: 8 },
  },
};
