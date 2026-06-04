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
    id: "scout", name: "索敵", mpCost: 4,
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
  }
};
