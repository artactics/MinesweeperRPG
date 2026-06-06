/**
 * 状態異常設定
 *   poison : 毎ターン maxHp * 3% ダメージ
 *   burn   : 毎ターン 現在HP * 5% ダメージ
 */
export const STATUS_CONFIG = {
  poison: { id: "poison", name: "毒",   color: "#a050d0", description: "毎ターン最大HPの3%ダメージ" },
  burn:   { id: "burn",   name: "火傷", color: "#ff6030", description: "毎ターン現在HPの5%ダメージ" },
  freeze: { id: "freeze", name: "凍傷", color: "#5090d0", description: "攻撃力が半減する" }
};
