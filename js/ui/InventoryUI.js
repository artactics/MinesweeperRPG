import { renderIconHtml } from "./iconHtml.js";

/**
 * 倉庫モーダル（閲覧専用）の描画を担当するクラス
 */
export class InventoryUI {

  /**
   * @param {object} options
   * @param {() => import("../core/Player.js").Player} options.getPlayer
   */
  constructor({ getPlayer }) {
    this.getPlayer = getPlayer;
    this._bindButtons();
  }

  /** 開閉ボタンのイベントを登録 */
  _bindButtons() {
    document.getElementById("inventory-btn").addEventListener("click", () => {
      this.render();
      document.getElementById("inventory-modal").style.display = "flex";
    });
    document.getElementById("inventory-close-btn").addEventListener("click", () => {
      document.getElementById("inventory-modal").style.display = "none";
    });
  }

  /** 倉庫の中身を一覧表示 */
  render() {
    const player = this.getPlayer();
    const content = document.getElementById("inventory-content");
    content.innerHTML = "";

    const addSection = (title) => {
      const el = document.createElement("div");
      el.className = "shop-section-title";
      el.textContent = title;
      content.appendChild(el);
    };

    const addRow = (item, sub, badge) => {
      const row = document.createElement("div");
      row.className = "shop-row";
      const info = document.createElement("span");
      info.className = "shop-item-info";
      info.innerHTML = `${renderIconHtml(item, "gi-icon-sm")} ${item.name} <span style="color:#aaa;font-size:0.8rem">${sub}</span>`;
      const b = document.createElement("span");
      b.className = "inv-badge";
      b.textContent = badge;
      row.appendChild(info);
      row.appendChild(b);
      content.appendChild(row);
    };

    const invIds = Object.keys(player.inventory);
    if (invIds.length > 0) {
      addSection("消費アイテム");
      for (const id of invIds) {
        const item = player.inventory[id];
        addRow(item, item.description, `×${item.count}`);
      }
    }

    const eqIds = Object.keys(player.equipmentInventory);
    if (eqIds.length > 0) {
      addSection("装備品");
      for (const id of eqIds) {
        const item = player.equipmentInventory[id];
        addRow(item, item.description, item.count > 1 ? `×${item.count}` : "");
      }
    }

    if (invIds.length === 0 && eqIds.length === 0) {
      content.innerHTML = "<div style='color:#555;padding:12px 0;text-align:center'>倉庫は空です</div>";
    }
  }
}
