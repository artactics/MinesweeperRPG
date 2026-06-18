/**
 * スキル設定ファイル
 *
 * 各スキルのフィールド:
 *   id        : 識別子
 *   name      : 表示名
 *   mpCost    : 消費MP
 *   usableIn  : "field" | "battle" | "both"
 *   description : 説明文
 */
export const SKILL_CONFIG = {
  HEAL: {
    id: "heal", name: "回復", mpCost: 5,
    usableIn: "both",
    description: "HPを10回復"
  },
  SCOUT: {
    id: "scout", name: "索敵", mpCost: 10,
    usableIn: "field",
    description: "モンスターのいないマスを1つ開ける"
  },
  DOUBLE_STRIKE: {
    id: "double_strike", name: "連撃", mpCost: 8,
    usableIn: "battle",
    description: "攻撃力の2倍のダメージ"
  },
  FOCUS: {
    id: "focus", name: "集中", mpCost: 6,
    usableIn: "battle",
    description: "次の攻撃が3倍ダメージ"
  },
  DRAIN: {
    id: "drain", name: "ドレイン", mpCost: 8,
    usableIn: "battle",
    description: "100%ダメージ、与えダメージの50%回復"
  },
  GUARD: {
    id: "guard", name: "ガード", mpCost: 5,
    usableIn: "battle",
    description: "攻撃せず、このターン被ダメージ50%カット"
  },
  POISON_MARK: {
    id: "poison_mark", name: "毒印", mpCost: 6,
    usableIn: "battle",
    description: "攻撃せず、敵を毒状態にする"
  },
  FIRE_MARK: {
    id: "fire_mark", name: "火印", mpCost: 6,
    usableIn: "battle",
    description: "攻撃せず、敵を火傷状態にする"
  },
  ICE_MARK: {
    id: "ice_mark", name: "冷印", mpCost: 6,
    usableIn: "battle",
    description: "攻撃せず、敵を凍傷状態にする"
  },
  CURE_POISON: {
    id: "cure_poison", name: "解毒", mpCost: 4,
    usableIn: "both",
    description: "攻撃せず、自分の毒状態を解除する"
  },
  CURE_BURN: {
    id: "cure_burn", name: "解炎", mpCost: 4,
    usableIn: "both",
    description: "攻撃せず、自分の火傷状態を解除する"
  },
  CURE_FREEZE: {
    id: "cure_freeze", name: "解凍", mpCost: 4,
    usableIn: "both",
    description: "攻撃せず、自分の凍傷状態を解除する"
  },
  FORTUNE_PRAYER: {
    id: "fortune_prayer", name: "金運の祈り", mpCost: 4,
    usableIn: "field",
    description: "「金運」状態になる。ゴールド獲得率が1.25倍"
  },
  TREASURE_PRAYER: {
    id: "treasure_prayer", name: "宝運の祈り", mpCost: 4,
    usableIn: "field",
    description: "「宝運」状態になる。アイテムドロップ率が1.25倍"
  }
};
