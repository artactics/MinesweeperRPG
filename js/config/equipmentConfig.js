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
  1: { // 初心者の洞窟シリーズ
    CAVE_SWORD:  { id: "cave_sword",  name: "初心者の剣",      iconUrl: EQ_IMG("sword.svg"),  iconColor: SERIES_COLOR[1], slot: "weapon", category: "equipment", atk:  2,  description: "ATK+2",    minDungeon: 1, sellPrice:  15 },
    CAVE_HELM:   { id: "cave_helm",   name: "初心者の兜",      iconUrl: EQ_IMG("helm.svg"),   iconColor: SERIES_COLOR[1], slot: "head",   category: "equipment", maxHp: 5, description: "MaxHP+5",  minDungeon: 1, sellPrice:  10 },
    CAVE_ARMOR:  { id: "cave_armor",  name: "初心者の鎧",        iconUrl: EQ_IMG("armor.svg"),  iconColor: SERIES_COLOR[1], slot: "body",   category: "equipment", maxHp: 8, description: "MaxHP+8",  minDungeon: 1, sellPrice:  16 },
    CAVE_BOOTS:  { id: "cave_boots",  name: "初心者の脚当て",  iconUrl: EQ_IMG("boots.svg"),  iconColor: SERIES_COLOR[1], slot: "legs",   category: "equipment", maxHp: 3, description: "MaxHP+3",  minDungeon: 1, sellPrice:   6 },
  },
  2: { // 森の小道シリーズ
    FOREST_SWORD:  { id: "forest_sword",  name: "木の剣",           iconUrl: EQ_IMG("sword.svg"),  iconColor: SERIES_COLOR[2], slot: "weapon", category: "equipment", atk:  4,  description: "ATK+4",    minDungeon: 2, sellPrice:  25 },
    FOREST_HELM:   { id: "forest_helm",   name: "木の兜",       iconUrl: EQ_IMG("helm.svg"),   iconColor: SERIES_COLOR[2], slot: "head",   category: "equipment", maxHp: 8, description: "MaxHP+8",  minDungeon: 2, sellPrice:  16 },
    FOREST_ARMOR:  { id: "forest_armor",  name: "木の鎧",       iconUrl: EQ_IMG("armor.svg"),  iconColor: SERIES_COLOR[2], slot: "body",   category: "equipment", maxHp: 13, description: "MaxHP+13", minDungeon: 2, sellPrice: 26 },
    FOREST_BOOTS:  { id: "forest_boots",  name: "木の脚当て",   iconUrl: EQ_IMG("boots.svg"),  iconColor: SERIES_COLOR[2], slot: "legs",   category: "equipment", maxHp: 5, description: "MaxHP+5",  minDungeon: 2, sellPrice:  10 },
  },
  3: { // ゴブリンの巣窟シリーズ
    GOBLIN_SWORD:  { id: "goblin_sword",  name: "ゴブリンの剣",   iconUrl: EQ_IMG("sword.svg"),  iconColor: SERIES_COLOR[3], slot: "weapon", category: "equipment", atk:  7,  description: "ATK+7",    minDungeon: 3, sellPrice:  40 },
    GOBLIN_HELM:   { id: "goblin_helm",   name: "ゴブリンの兜",   iconUrl: EQ_IMG("helm.svg"),   iconColor: SERIES_COLOR[3], slot: "head",   category: "equipment", maxHp: 12, description: "MaxHP+12", minDungeon: 3, sellPrice: 24 },
    GOBLIN_ARMOR:  { id: "goblin_armor",  name: "ゴブリンの鎧", iconUrl: EQ_IMG("armor.svg"),  iconColor: SERIES_COLOR[3], slot: "body",   category: "equipment", maxHp: 19, description: "MaxHP+19", minDungeon: 3, sellPrice: 38 },
    GOBLIN_BOOTS:  { id: "goblin_boots",  name: "ゴブリンの脚当て",   iconUrl: EQ_IMG("boots.svg"),  iconColor: SERIES_COLOR[3], slot: "legs",   category: "equipment", maxHp: 8, description: "MaxHP+8",  minDungeon: 3, sellPrice:  16 },
  },
  4: { // オークの要塞シリーズ
    ORC_SWORD:  { id: "orc_sword",  name: "オークの剣",   iconUrl: EQ_IMG("sword.svg"),  iconColor: SERIES_COLOR[4], slot: "weapon", category: "equipment", atk:  11,  description: "ATK+11",   minDungeon: 4, sellPrice:  60 },
    ORC_HELM:   { id: "orc_helm",   name: "オークの兜",       iconUrl: EQ_IMG("helm.svg"),   iconColor: SERIES_COLOR[4], slot: "head",   category: "equipment", maxHp: 17, description: "MaxHP+17", minDungeon: 4, sellPrice:  34 },
    ORC_ARMOR:  { id: "orc_armor",  name: "オークの鎧",       iconUrl: EQ_IMG("armor.svg"),  iconColor: SERIES_COLOR[4], slot: "body",   category: "equipment", maxHp: 26, description: "MaxHP+26", minDungeon: 4, sellPrice:  52 },
    ORC_BOOTS:  { id: "orc_boots",  name: "オークの脚当て",   iconUrl: EQ_IMG("boots.svg"),  iconColor: SERIES_COLOR[4], slot: "legs",   category: "equipment", maxHp: 11, description: "MaxHP+11", minDungeon: 4, sellPrice:  22 },
  },
  5: { // スケルトン墓地シリーズ
    SKELETON_SWORD:  { id: "skeleton_sword",  name: "骨の剣",      iconUrl: EQ_IMG("sword.svg"),  iconColor: SERIES_COLOR[5], slot: "weapon", category: "equipment", atk:  15,  description: "ATK+15",   minDungeon: 5, sellPrice:  85 },
    SKELETON_HELM:   { id: "skeleton_helm",   name: "骨の兜",      iconUrl: EQ_IMG("helm.svg"),   iconColor: SERIES_COLOR[5], slot: "head",   category: "equipment", maxHp: 22, description: "MaxHP+22", minDungeon: 5, sellPrice:  44 },
    SKELETON_ARMOR:  { id: "skeleton_armor",  name: "骨の鎧",        iconUrl: EQ_IMG("armor.svg"),  iconColor: SERIES_COLOR[5], slot: "body",   category: "equipment", maxHp: 34, description: "MaxHP+34", minDungeon: 5, sellPrice:  68 },
    SKELETON_BOOTS:  { id: "skeleton_boots",  name: "骨の脚当て",  iconUrl: EQ_IMG("boots.svg"),  iconColor: SERIES_COLOR[5], slot: "legs",   category: "equipment", maxHp: 15, description: "MaxHP+15", minDungeon: 5, sellPrice:  30 },
  },
  6: { // ドラゴンの山脈シリーズ
    DRAGON_SWORD:  { id: "dragon_sword",  name: "竜の剣",      iconUrl: EQ_IMG("sword.svg"),  iconColor: SERIES_COLOR[6], slot: "weapon", category: "equipment", atk:  20,  description: "ATK+20",   minDungeon: 6, sellPrice: 115 },
    DRAGON_HELM:   { id: "dragon_helm",   name: "竜の兜",      iconUrl: EQ_IMG("helm.svg"),   iconColor: SERIES_COLOR[6], slot: "head",   category: "equipment", maxHp: 28, description: "MaxHP+28", minDungeon: 6, sellPrice:  56 },
    DRAGON_ARMOR:  { id: "dragon_armor",  name: "竜鱗鎧",      iconUrl: EQ_IMG("armor.svg"),  iconColor: SERIES_COLOR[6], slot: "body",   category: "equipment", maxHp: 43, description: "MaxHP+43", minDungeon: 6, sellPrice:  86 },
    DRAGON_BOOTS:  { id: "dragon_boots",  name: "竜の脚当て",  iconUrl: EQ_IMG("boots.svg"),  iconColor: SERIES_COLOR[6], slot: "legs",   category: "equipment", maxHp: 19, description: "MaxHP+19", minDungeon: 6, sellPrice:  38 },
  },
  7: { // 悪魔の領域シリーズ
    DEMON_SWORD:  { id: "demon_sword",  name: "悪魔の剣",      iconUrl: EQ_IMG("sword.svg"),  iconColor: SERIES_COLOR[7], slot: "weapon", category: "equipment", atk:  26,  description: "ATK+26",   minDungeon: 7, sellPrice: 150 },
    DEMON_HELM:   { id: "demon_helm",   name: "悪魔の兜",      iconUrl: EQ_IMG("helm.svg"),   iconColor: SERIES_COLOR[7], slot: "head",   category: "equipment", maxHp: 35, description: "MaxHP+35", minDungeon: 7, sellPrice:  70 },
    DEMON_ARMOR:  { id: "demon_armor",  name: "悪魔の鎧",      iconUrl: EQ_IMG("armor.svg"),  iconColor: SERIES_COLOR[7], slot: "body",   category: "equipment", maxHp: 54, description: "MaxHP+54", minDungeon: 7, sellPrice: 108 },
    DEMON_BOOTS:  { id: "demon_boots",  name: "悪魔の脚当て",  iconUrl: EQ_IMG("boots.svg"),  iconColor: SERIES_COLOR[7], slot: "legs",   category: "equipment", maxHp: 24, description: "MaxHP+24", minDungeon: 7, sellPrice:  48 },
  },
  8: { // 魔王の城シリーズ
    LORD_SWORD:  { id: "lord_sword",  name: "魔王の剣",      iconUrl: EQ_IMG("sword.svg"),  iconColor: SERIES_COLOR[8], slot: "weapon", category: "equipment", atk:  33,  description: "ATK+33",   minDungeon: 8, sellPrice: 190 },
    LORD_HELM:   { id: "lord_helm",   name: "魔王の兜",      iconUrl: EQ_IMG("helm.svg"),   iconColor: SERIES_COLOR[8], slot: "head",   category: "equipment", maxHp: 43, description: "MaxHP+43", minDungeon: 8, sellPrice:  86 },
    LORD_ARMOR:  { id: "lord_armor",  name: "魔王の鎧",      iconUrl: EQ_IMG("armor.svg"),  iconColor: SERIES_COLOR[8], slot: "body",   category: "equipment", maxHp: 66, description: "MaxHP+66", minDungeon: 8, sellPrice: 132 },
    LORD_BOOTS:  { id: "lord_boots",  name: "魔王の脚当て",  iconUrl: EQ_IMG("boots.svg"),  iconColor: SERIES_COLOR[8], slot: "legs",   category: "equipment", maxHp: 30, description: "MaxHP+30", minDungeon: 8, sellPrice:  60 },
  },
};

/**
 * ルックアップ用フラットマップ
 * EQUIPMENT_TYPES として constants.js から再エクスポートされます
 */
export const EQUIPMENT_CONFIG = Object.assign(
  {}, ...Object.values(EQUIPMENT_SERIES)
);
