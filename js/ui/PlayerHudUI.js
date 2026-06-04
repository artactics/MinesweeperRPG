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
  constructor({ getPlayer, onUseItem, onUseSkill }) {
    this.getPlayer = getPlayer;
    this.onUseItem = onUseItem;
    this.onUseSkill = onUseSkill || (() => {});
  }

  /** 倉庫アイテムリストを再描画 */
  renderItems() {
    const player = this.getPlayer();
    this._renderItemList(
      document.getElementById("inventory-list"),
      player.inventory,
      false
    );
  }

  renderFieldSkills(skills) {
    const container = document.getElementById("field-skill-list");
    if (!container) return;
    container.innerHTML = "";
    const player = this.getPlayer();
    if (!skills || skills.length === 0) {
      container.innerHTML = "<div style=\"color:#777;font-size:0.82rem\">なし</div>";
      return;
    }
    for (const skill of skills) {
      const btn = document.createElement("button");
      btn.className = "skill-btn";
      btn.disabled = player.mp < skill.mpCost;
      btn.innerHTML = `${skill.name} <span class="skill-cost">MP:${skill.mpCost}</span>`;
      btn.title = skill.description;
      btn.onclick = () => this.onUseSkill(skill);
      container.appendChild(btn);
    }
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
