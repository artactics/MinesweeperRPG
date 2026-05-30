import { renderItemIcon } from "./iconBadge.js";

/**
 * 攻略中のプレイヤーHUD（手持ち・倉庫アイテム一覧）を担当するクラス
 */
export class PlayerHudUI {

  /**
   * @param {object} options
   * @param {() => import("../core/Player.js").Player} options.getPlayer
   * @param {(itemId: string, fromHand: boolean) => void} options.onUseItem
   */
  constructor({ getPlayer, onUseItem }) {
    this.getPlayer = getPlayer;
    this.onUseItem = onUseItem;
  }

  /** 手持ち・倉庫のアイテムリストを再描画 */
  renderItems() {
    const player = this.getPlayer();
    this._renderItemList(
      document.getElementById("hand-items-list"),
      player.handItems,
      true
    );
    this._renderItemList(
      document.getElementById("inventory-list"),
      player.inventory,
      false
    );
  }

  _renderItemList(container, items, fromHand) {
    container.innerHTML = "";
    const itemIds = Object.keys(items);

    if (itemIds.length === 0) {
      container.innerHTML = "<div>アイテムなし</div>";
      return;
    }

    for (const itemId of itemIds) {
      const item = items[itemId];
      const itemDiv = document.createElement("div");
      itemDiv.className = "item-row";

      const itemInfo = document.createElement("span");
      itemInfo.className = "item-row__info";
      itemInfo.innerHTML = `${renderItemIcon(item)}<span>${item.name} x${item.count}</span>`;

      const useBtn = document.createElement("button");
      useBtn.className = "item-row__use-btn";
      useBtn.textContent = "使用";
      useBtn.onclick = () => this.onUseItem(itemId, fromHand);

      itemDiv.appendChild(itemInfo);
      itemDiv.appendChild(useBtn);
      container.appendChild(itemDiv);
    }
  }
}
