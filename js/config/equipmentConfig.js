/**
 * 装備品設定ファイル（プロパティファイル）
 *
 * 装備品はダンジョン数（8）に対応した 8シリーズで構成されます。
 * EQUIPMENT_SERIES[N] のシリーズはダンジョン N で入手できます。
 *
 * 各エントリのフィールド:
 *   id          : セーブデータ識別子（小文字スネークケース）
 *   name        : 表示名
 *   iconUrl     : アイコン画像パス
 *   iconColor   : シリーズのテーマカラー
 *   slot        : "weapon" | "head" | "body" | "legs"
 *   category    : "equipment"（固定）
 *   atk         : 武器のみ — ATK増加量
 *   maxHp       : 防具のみ — MaxHP増加量
 *   description : 説明文
 *   minDungeon  : levelItem() スケーリング基準（= シリーズ番号）
 *   sellPrice   : ショップ売却価格
 */

const EQ_IMG = (file) => `./asset/image/equipment/${file}`;

/** ダンジョンのテーマカラー（DUNGEON_CONFIG.iconColor と対応） */
const SERIES_COLOR = {
  1: "#15abbe",
  2: "#c7712a",
  3: "#56940e",
  4: "#cea346",
  5: "#c2b5da",
  6: "#fd5521",
  7: "#d900ff",
  8: "#ff0702"
};

/**
 * 装備品シリーズ定義
 * キー（1〜8）は DUNGEON_CONFIG のキーと対応
 * 各シリーズに weapon / head / body / legs の4種類
 */
export const EQUIPMENT_SERIES = {
  1: { // スライムシリーズ
    SLIME_SWORD:  { no:  1, id: "slime_sword",  name: "スライムの剣",      iconUrl: EQ_IMG("sword.svg"),  iconColor: SERIES_COLOR[1], slot: "weapon", category: "equipment", atk:  2,  description: "ATK+2",    minDungeon: 1, sellPrice:  15, skill: "HEAL" },
    SLIME_HELM:   { no:  2, id: "slime_helm",   name: "スライムの兜",      iconUrl: EQ_IMG("helm.svg"),   iconColor: SERIES_COLOR[1], slot: "head",   category: "equipment", maxHp: 5, description: "MaxHP+5",  minDungeon: 1, sellPrice:  10, skill: "HEAL" },
    SLIME_ARMOR:  { no:  3, id: "slime_armor",  name: "スライムの鎧",      iconUrl: EQ_IMG("armor.svg"),  iconColor: SERIES_COLOR[1], slot: "body",   category: "equipment", maxHp: 8, description: "MaxHP+8",  minDungeon: 1, sellPrice:  16, skill: "FOCUS" },
    SLIME_BOOTS:  { no:  4, id: "slime_boots",  name: "スライムの脚当て",  iconUrl: EQ_IMG("boots.svg"),  iconColor: SERIES_COLOR[1], slot: "legs",   category: "equipment", maxHp: 3, description: "MaxHP+3",  minDungeon: 1, sellPrice:   6, skill: "SCOUT" },
  },
  2: { // ゴブリンシリーズ
    GOBLIN_SWORD:  { no:  5, id: "goblin_sword",  name: "小鬼の剣",      iconUrl: EQ_IMG("sword.svg"),  iconColor: SERIES_COLOR[2], slot: "weapon", category: "equipment", atk:  4,  description: "ATK+4",    minDungeon: 2, sellPrice:  25, skill: "DOUBLE_STRIKE" },
    GOBLIN_HELM:   { no:  6, id: "goblin_helm",   name: "小鬼の兜",      iconUrl: EQ_IMG("helm.svg"),   iconColor: SERIES_COLOR[2], slot: "head",   category: "equipment", maxHp: 8, description: "MaxHP+8",  minDungeon: 2, sellPrice:  16, skill: "HEAL" },
    GOBLIN_ARMOR:  { no:  7, id: "goblin_armor",  name: "小鬼の鎧",      iconUrl: EQ_IMG("armor.svg"),  iconColor: SERIES_COLOR[2], slot: "body",   category: "equipment", maxHp: 13, description: "MaxHP+13", minDungeon: 2, sellPrice: 26, skill: "FOCUS" },
    GOBLIN_BOOTS:  { no:  8, id: "goblin_boots",  name: "小鬼の脚当て",  iconUrl: EQ_IMG("boots.svg"),  iconColor: SERIES_COLOR[2], slot: "legs",   category: "equipment", maxHp: 5, description: "MaxHP+5",  minDungeon: 2, sellPrice:  10, skill: "SCOUT" },
  },
  3: { // 狼シリーズ
    WOLF_SWORD:  { no:  9, id: "wolf_sword",  name: "狼の剣",      iconUrl: EQ_IMG("sword.svg"),  iconColor: SERIES_COLOR[3], slot: "weapon", category: "equipment", atk:  7,  description: "ATK+7",    minDungeon: 3, sellPrice:  40, skill: "DOUBLE_STRIKE" },
    WOLF_HELM:   { no: 10, id: "wolf_helm",   name: "狼の兜",      iconUrl: EQ_IMG("helm.svg"),   iconColor: SERIES_COLOR[3], slot: "head",   category: "equipment", maxHp: 12, description: "MaxHP+12", minDungeon: 3, sellPrice: 24, skill: "HEAL" },
    WOLF_ARMOR:  { no: 11, id: "wolf_armor",  name: "狼の鎧",      iconUrl: EQ_IMG("armor.svg"),  iconColor: SERIES_COLOR[3], slot: "body",   category: "equipment", maxHp: 19, description: "MaxHP+19", minDungeon: 3, sellPrice: 38, skill: "FOCUS" },
    WOLF_BOOTS:  { no: 12, id: "wolf_boots",  name: "狼の脚当て",  iconUrl: EQ_IMG("boots.svg"),  iconColor: SERIES_COLOR[3], slot: "legs",   category: "equipment", maxHp: 8, description: "MaxHP+8",  minDungeon: 3, sellPrice:  16, skill: "SCOUT" },
  },
  4: { // オークシリーズ
    ORC_SWORD:  { no: 13, id: "orc_sword",  name: "鬼の剣",      iconUrl: EQ_IMG("sword.svg"),  iconColor: SERIES_COLOR[4], slot: "weapon", category: "equipment", atk:  11,  description: "ATK+11",   minDungeon: 4, sellPrice:  60, skill: "DOUBLE_STRIKE" },
    ORC_HELM:   { no: 14, id: "orc_helm",   name: "鬼の兜",      iconUrl: EQ_IMG("helm.svg"),   iconColor: SERIES_COLOR[4], slot: "head",   category: "equipment", maxHp: 17, description: "MaxHP+17", minDungeon: 4, sellPrice:  34, skill: "HEAL" },
    ORC_ARMOR:  { no: 15, id: "orc_armor",  name: "鬼の鎧",      iconUrl: EQ_IMG("armor.svg"),  iconColor: SERIES_COLOR[4], slot: "body",   category: "equipment", maxHp: 26, description: "MaxHP+26", minDungeon: 4, sellPrice:  52, skill: "FOCUS" },
    ORC_BOOTS:  { no: 16, id: "orc_boots",  name: "鬼の脚当て",  iconUrl: EQ_IMG("boots.svg"),  iconColor: SERIES_COLOR[4], slot: "legs",   category: "equipment", maxHp: 11, description: "MaxHP+11", minDungeon: 4, sellPrice:  22, skill: "SCOUT" },
  },
  5: { // 亡者シリーズ
    DEAD_SWORD:  { no: 17, id: "dead_sword",  name: "亡者の剣",      iconUrl: EQ_IMG("sword.svg"),  iconColor: SERIES_COLOR[5], slot: "weapon", category: "equipment", atk:  15,  description: "ATK+15",   minDungeon: 5, sellPrice:  85, skill: "DOUBLE_STRIKE" },
    DEAD_HELM:   { no: 18, id: "dead_helm",   name: "亡者の兜",      iconUrl: EQ_IMG("helm.svg"),   iconColor: SERIES_COLOR[5], slot: "head",   category: "equipment", maxHp: 22, description: "MaxHP+22", minDungeon: 5, sellPrice:  44, skill: "HEAL" },
    DEAD_ARMOR:  { no: 19, id: "dead_armor",  name: "亡者の鎧",      iconUrl: EQ_IMG("armor.svg"),  iconColor: SERIES_COLOR[5], slot: "body",   category: "equipment", maxHp: 34, description: "MaxHP+34", minDungeon: 5, sellPrice:  68, skill: "FOCUS" },
    DEAD_BOOTS:  { no: 20, id: "dead_boots",  name: "亡者の脚当て",  iconUrl: EQ_IMG("boots.svg"),  iconColor: SERIES_COLOR[5], slot: "legs",   category: "equipment", maxHp: 15, description: "MaxHP+15", minDungeon: 5, sellPrice:  30, skill: "SCOUT" },
  },
  6: { // ドラゴンの山脈シリーズ
    DRAGON_SWORD:  { no: 21, id: "dragon_sword",  name: "竜の剣",      iconUrl: EQ_IMG("sword.svg"),  iconColor: SERIES_COLOR[6], slot: "weapon", category: "equipment", atk:  20,  description: "ATK+20",   minDungeon: 6, sellPrice: 115, skill: "DOUBLE_STRIKE" },
    DRAGON_HELM:   { no: 22, id: "dragon_helm",   name: "竜の兜",      iconUrl: EQ_IMG("helm.svg"),   iconColor: SERIES_COLOR[6], slot: "head",   category: "equipment", maxHp: 28, description: "MaxHP+28", minDungeon: 6, sellPrice:  56, skill: "HEAL" },
    DRAGON_ARMOR:  { no: 23, id: "dragon_armor",  name: "竜鱗鎧",      iconUrl: EQ_IMG("armor.svg"),  iconColor: SERIES_COLOR[6], slot: "body",   category: "equipment", maxHp: 43, description: "MaxHP+43", minDungeon: 6, sellPrice:  86, skill: "FOCUS" },
    DRAGON_BOOTS:  { no: 24, id: "dragon_boots",  name: "竜の脚当て",  iconUrl: EQ_IMG("boots.svg"),  iconColor: SERIES_COLOR[6], slot: "legs",   category: "equipment", maxHp: 19, description: "MaxHP+19", minDungeon: 6, sellPrice:  38, skill: "SCOUT" },
  },
  7: { // 悪魔の領域シリーズ
    DEMON_SWORD:  { no: 25, id: "demon_sword",  name: "悪魔の剣",      iconUrl: EQ_IMG("sword.svg"),  iconColor: SERIES_COLOR[7], slot: "weapon", category: "equipment", atk:  26,  description: "ATK+26",   minDungeon: 7, sellPrice: 150, skill: "DOUBLE_STRIKE" },
    DEMON_HELM:   { no: 26, id: "demon_helm",   name: "悪魔の兜",      iconUrl: EQ_IMG("helm.svg"),   iconColor: SERIES_COLOR[7], slot: "head",   category: "equipment", maxHp: 35, description: "MaxHP+35", minDungeon: 7, sellPrice:  70, skill: "HEAL" },
    DEMON_ARMOR:  { no: 27, id: "demon_armor",  name: "悪魔の鎧",      iconUrl: EQ_IMG("armor.svg"),  iconColor: SERIES_COLOR[7], slot: "body",   category: "equipment", maxHp: 54, description: "MaxHP+54", minDungeon: 7, sellPrice: 108, skill: "FOCUS" },
    DEMON_BOOTS:  { no: 28, id: "demon_boots",  name: "悪魔の脚当て",  iconUrl: EQ_IMG("boots.svg"),  iconColor: SERIES_COLOR[7], slot: "legs",   category: "equipment", maxHp: 24, description: "MaxHP+24", minDungeon: 7, sellPrice:  48, skill: "SCOUT" },
  },
  8: { // 魔王の城シリーズ
    LORD_SWORD:  { no: 29, id: "lord_sword",  name: "魔王の剣",      iconUrl: EQ_IMG("sword.svg"),  iconColor: SERIES_COLOR[8], slot: "weapon", category: "equipment", atk:  33,  description: "ATK+33",   minDungeon: 8, sellPrice: 190, skill: "DOUBLE_STRIKE" },
    LORD_HELM:   { no: 30, id: "lord_helm",   name: "魔王の兜",      iconUrl: EQ_IMG("helm.svg"),   iconColor: SERIES_COLOR[8], slot: "head",   category: "equipment", maxHp: 43, description: "MaxHP+43", minDungeon: 8, sellPrice:  86, skill: "HEAL" },
    LORD_ARMOR:  { no: 31, id: "lord_armor",  name: "魔王の鎧",      iconUrl: EQ_IMG("armor.svg"),  iconColor: SERIES_COLOR[8], slot: "body",   category: "equipment", maxHp: 66, description: "MaxHP+66", minDungeon: 8, sellPrice: 132, skill: "FOCUS" },
    LORD_BOOTS:  { no: 32, id: "lord_boots",  name: "魔王の脚当て",  iconUrl: EQ_IMG("boots.svg"),  iconColor: SERIES_COLOR[8], slot: "legs",   category: "equipment", maxHp: 30, description: "MaxHP+30", minDungeon: 8, sellPrice:  60, skill: "SCOUT" },
  },
};

/**
 * ルックアップ用フラットマップ
 * EQUIPMENT_TYPES として constants.js から再エクスポートされます
 */
export const EQUIPMENT_CONFIG = Object.assign(
  {}, ...Object.values(EQUIPMENT_SERIES)
);
