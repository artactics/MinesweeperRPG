/**
 * アイテム使用の効果適用を担当するクラス
 */
export class ItemUsageService {

  /**
   * @param {object} options
   * @param {() => import("../core/Player.js").Player} options.getPlayer
   * @param {import("../ui/LogUI.js").LogUI} options.logUI
   * @param {() => void} options.onAfterUse
   */
  constructor({ getPlayer, logUI, onAfterUse }) {
    this.getPlayer = getPlayer;
    this.logUI = logUI;
    this.onAfterUse = onAfterUse;
  }

  /**
   * アイテムを使用する
   * @param {string} itemId
   * @param {boolean} fromHand - true: 手持ち, false: 倉庫
   */
  useItem(itemId, fromHand = true) {
    const player = this.getPlayer();
    const items = fromHand ? player.handItems : player.inventory;
    const item = items[itemId];
    if (!item) return;

    const effect = item.effect;

    switch (effect.type) {
      case "heal":
        player.hp = Math.min(player.hp + effect.value, player.maxHp);
        this.logUI.add(`${item.name}を使用！ HPを${effect.value}回復`);
        break;
      case "atk":
        player.bonusAtk += effect.value;
        this.logUI.add(`${item.name}を使用！ 攻撃力+${effect.value}（このダンジョンのみ）`);
        break;
      case "maxHp":
        player.maxHp += effect.value;
        player.hp += effect.value;
        this.logUI.add(`${item.name}を使用！ 最大HP+${effect.value}`);
        break;
      case "cure_poison":
        player.poison = false;
        this.logUI.add(`${item.name}を使用！ 毒が治った`);
        break;
      case "cure_burn":
        player.burn = false;
        this.logUI.add(`${item.name}を使用！ 火傷が治った`);
        break;
      case "cure_freeze":
        player.freeze = false;
        this.logUI.add(`${item.name}を使用！ 凍傷が治った`);
        break;
      case "mp_heal":
        player.mp = Math.min(player.mp + effect.value, player.maxMp);
        this.logUI.add(`${item.name}を使用！ MPを${effect.value}回復`);
        break;
      case "elixir":
        player.hp = player.maxHp;
        player.mp = player.maxMp;
        this.logUI.add(`${item.name}を使用！ HP・MP全回復！`);
        break;
    }

    player.removeItem(itemId, fromHand);
    this.onAfterUse();
  }
}
