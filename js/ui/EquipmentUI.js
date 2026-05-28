import { renderIconHtml } from "./iconHtml.js";

/**
 * 装備モーダルの描画と装備・外す操作を担当するクラス
 */
export class EquipmentUI {

  /**
   * @param {object} options
   * @param {() => import("../core/Player.js").Player} options.getPlayer
   * @param {() => void} options.onChanged - 装備変更後のコールバック
   */
  constructor({ getPlayer, onChanged }) {
    this.getPlayer = getPlayer;
    this.onChanged = onChanged;
    this._bindButtons();
  }

  _bindButtons() {
    document.getElementById("equipment-btn").addEventListener("click", () => {
      this.render();
      document.getElementById("equipment-modal").style.display = "flex";
    });
    document.getElementById("equipment-close-btn").addEventListener("click", () => {
      document.getElementById("equipment-modal").style.display = "none";
    });
  }

  /** 装備スロットと所持装備一覧を描画 */
  render() {
    const player = this.getPlayer();
    const slotsEl = document.getElementById("equipment-slots");
    slotsEl.innerHTML = "";

    for (const [slotKey, label] of [["weapon", "武器"], ["head", "頭"], ["body", "胴"], ["legs", "脚"]]) {
      const def = player.equipped[slotKey];
      const row = document.createElement("div");
      row.className = "eq-slot";

      const labelEl = document.createElement("span");
      labelEl.className = "eq-slot-label";
      labelEl.textContent = label;
      row.appendChild(labelEl);

      if (def) {
        const nameEl = document.createElement("span");
        nameEl.className = "eq-item-name";
        nameEl.innerHTML = `${renderIconHtml(def, "gi-icon-sm")} ${def.name} <span class="eq-item-stat">${def.description}</span>`;
        row.appendChild(nameEl);
        const btn = document.createElement("button");
        btn.className = "eq-unequip-btn";
        btn.textContent = "外す";
        btn.addEventListener("click", () => {
          player.unequipItem(slotKey);
          this.onChanged();
          this.render();
        });
        row.appendChild(btn);
      } else {
        const emptyEl = document.createElement("span");
        emptyEl.className = "eq-empty";
        emptyEl.textContent = "なし";
        row.appendChild(emptyEl);
      }
      slotsEl.appendChild(row);
    }

    const listEl = document.getElementById("equipment-inventory-list");
    listEl.innerHTML = "";
    const itemIds = Object.keys(player.equipmentInventory);
    if (itemIds.length === 0) {
      listEl.innerHTML = "<div style='color:#555;font-size:0.85rem;padding:8px 0'>装備品なし</div>";
      return;
    }
    for (const itemId of itemIds) {
      const item = player.equipmentInventory[itemId];
      const row = document.createElement("div");
      row.className = "eq-inventory-item";
      const info = document.createElement("span");
      info.className = "eq-item-info";
      info.innerHTML = `${renderIconHtml(item, "gi-icon-sm")} ${item.name} <span class="eq-item-stat">${item.description}</span>${item.count > 1 ? ` ×${item.count}` : ""}`;
      const btn = document.createElement("button");
      btn.className = "eq-equip-btn";
      btn.textContent = "装備";
      btn.addEventListener("click", () => {
        player.equipItem(itemId);
        this.onChanged();
        this.render();
      });
      row.appendChild(info);
      row.appendChild(btn);
      listEl.appendChild(row);
    }
  }
}
