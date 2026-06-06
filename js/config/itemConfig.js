/**
 * アイテム設定ファイル（プロパティファイル）
 *
 * フィールド説明:
 *   id          : セーブデータ識別子（小文字スネークケース）
 *   name        : 表示名
 *   iconUrl     : アイコン画像パス
 *   iconColor   : アイコン色
 *   minDungeon  : levelItem() スケーリング基準ダンジョンレベル
 *   description : 基本説明文
 *   effect      : { type: "heal"|"atk", value: 基本値 }
 *   healScale   : ダンジョンレベル上昇ごとの回復量増加
 *   atkScale    : ダンジョンレベル上昇ごとのATK増加
 *   buyPrice    : ショップ購入価格（未定義 = 購入不可）
 *   sellPrice   : ショップ売却価格
 */

const ITEM_IMG = (file) => `./asset/image/item/${file}`;
const EQ_IMG   = (file) => `./asset/image/equipment/${file}`;

export const ITEM_CONFIG = {
  POTION: {
    no: 1, id: "potion", name: "回復薬",
    iconUrl: ITEM_IMG("round-potion.svg"), iconColor: "#66BB6A",
    minDungeon: 1, description: "HP+10回復",
    effect: { type: "heal", value: 10 }, healScale: 3,
    buyPrice: 30, sellPrice: 12
  },
  SUPER_POTION: {
    no: 2, id: "super_potion", name: "超回復薬",
    iconUrl: ITEM_IMG("round-potion.svg"), iconColor: "#42A5F5",
    minDungeon: 3, description: "HP+20回復",
    effect: { type: "heal", value: 20 }, healScale: 5,
    buyPrice: 60, sellPrice: 24
  },
  ATTACK_BOOST: {
    no: 3, id: "attack_boost", name: "攻撃力UP",
    iconUrl: EQ_IMG("sword.svg"), iconColor: "#EF5350",
    minDungeon: 2, description: "ATK+3",
    effect: { type: "atk", value: 3 }, atkScale: 1,
    buyPrice: 80, sellPrice: 32
  },
  ANTIDOTE: {
    no: 4, id: "antidote", name: "解毒薬",
    iconUrl: ITEM_IMG("round-potion.svg"), iconColor: "#a050d0",
    minDungeon: 1, description: "毒状態を解除する",
    effect: { type: "cure_poison" },
    buyPrice: 40, sellPrice: 16
  },
  FIRE_CURE: {
    no: 5, id: "fire_cure", name: "解炎薬",
    iconUrl: ITEM_IMG("round-potion.svg"), iconColor: "#ff6030",
    minDungeon: 1, description: "火傷状態を解除する",
    effect: { type: "cure_burn" },
    buyPrice: 40, sellPrice: 16
  },
  FREEZE_CURE: {
    no: 6, id: "freeze_cure", name: "解凍薬",
    iconUrl: ITEM_IMG("round-potion.svg"), iconColor: "#5090d0",
    minDungeon: 1, description: "凍傷状態を解除する",
    effect: { type: "cure_freeze" },
    buyPrice: 40, sellPrice: 16
  }
};
