import { renderIconHtml } from "./iconHtml.js";

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
      itemDiv.style.display = "flex";
      itemDiv.style.alignItems = "center";
      itemDiv.style.marginBottom = "5px";

      const itemInfo = document.createElement("span");
      itemInfo.innerHTML = `${renderIconHtml(item, "gi-icon-sm")} ${item.name} x${item.count}`;
      itemInfo.style.flex = "1";

      const useBtn = document.createElement("button");
      useBtn.textContent = "使用";
      useBtn.style.marginLeft = "5px";
      useBtn.style.padding = "2px 8px";
      useBtn.onclick = () => this.onUseItem(itemId, fromHand);

      itemDiv.appendChild(itemInfo);
      itemDiv.appendChild(useBtn);
      container.appendChild(itemDiv);
    }
  }
}
