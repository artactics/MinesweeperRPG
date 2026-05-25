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

export const ENEMY_TYPES = {
  SLIME: { name: "スライム", emoji: "💧", baseHp: 8, baseAtk: 2, baseExp: 5, dangerRange: [0, 2], color: "#4CAF50" },
  GOBLIN: { name: "ゴブリン", emoji: "👺", baseHp: 12, baseAtk: 4, baseExp: 8, dangerRange: [1, 4], color: "#8BC34A" },
  WOLF: { name: "オオカミ", emoji: "🐺", baseHp: 15, baseAtk: 5, baseExp: 10, dangerRange: [2, 5], color: "#795548" },
  ORC: { name: "オーク", emoji: "👹", baseHp: 20, baseAtk: 6, baseExp: 12, dangerRange: [3, 6], color: "#FF9800" },
  SKELETON: { name: "スケルトン", emoji: "💀", baseHp: 18, baseAtk: 7, baseExp: 15, dangerRange: [4, 7], color: "#9E9E9E" },
  DRAGON: { name: "ドラゴン", emoji: "🐉", baseHp: 25, baseAtk: 8, baseExp: 20, dangerRange: [5, 8], color: "#F44336" },
  DEMON: { name: "デーモン", emoji: "😈", baseHp: 30, baseAtk: 10, baseExp: 25, dangerRange: [6, 8], color: "#9C27B0" }
};
