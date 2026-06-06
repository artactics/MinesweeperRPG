/**
 * 敵スキル設定
 *
 * effect.type:
 *   "damage_mult" : 攻撃ダメージに倍率をかける
 *   "self_heal_pct": 最大HPの指定割合を回復し、そのターン攻撃しない
 *   "self_heal_flat": 固定値回復し、そのターンも攻撃する
 */
export const ENEMY_SKILL_CONFIG = {
  power_attack: {
    id: "power_attack",
    name: "強打",
    description: "通常の2倍のダメージを与える",
    effect: { type: "damage_mult", value: 2 }
  },
  heal: {
    id: "heal",
    name: "回復",
    description: "最大HPの25%を回復する（このターン攻撃しない）",
    effect: { type: "self_heal_pct", value: 0.25 }
  },
  regen: {
    id: "regen",
    name: "再生",
    description: "5HPを回復してから通常攻撃する",
    effect: { type: "self_heal_flat", value: 5 }
  },
  charge: {
    id: "charge",
    name: "溜め",
    description: "このターン攻撃せず、次のターンに3倍ダメージを与える",
    effect: { type: "charge", value: 3 }
  },
  drain: {
    id: "drain",
    name: "ドレイン",
    description: "100%ダメージ、与えダメージの50%回復",
    effect: { type: "drain", value: 0.5 }
  },
  poison_mark: {
    id: "poison_mark",
    name: "毒印",
    description: "攻撃せず、プレイヤーを毒状態にする",
    effect: { type: "inflict_poison" }
  },
  fire_mark: {
    id: "fire_mark",
    name: "火印",
    description: "攻撃せず、プレイヤーを火傷状態にする",
    effect: { type: "inflict_burn" }
  },
  flame_breath: {
    id: "flame_breath",
    name: "炎の息",
    description: "息を吸うターンの後、200%ダメージ＋火傷状態",
    effect: { type: "breath", element: "fire", mult: 2 }
  },
  poison_breath: {
    id: "poison_breath",
    name: "毒の息",
    description: "息を吸うターンの後、200%ダメージ＋毒状態",
    effect: { type: "breath", element: "poison", mult: 2 }
  },
  ice_mark: {
    id: "ice_mark",
    name: "凍印",
    description: "攻撃せず、プレイヤーを凍傷状態にする",
    effect: { type: "inflict_freeze" }
  },
  ice_breath: {
    id: "ice_breath",
    name: "氷の息",
    description: "息を吸うターンの後、200%ダメージ＋凍傷状態",
    effect: { type: "breath", element: "ice", mult: 2 }
  }
};
