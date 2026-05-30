import { ITEM_TYPES } from "../core/constants.js";
import { renderItemIcon } from "./iconBadge.js";
import { renderGoldLabel } from "../core/menuIcons.js";

/**
 * ショップモーダル（購入・売却）の描画と操作を担当するクラス
 */
export class ShopUI {

  /**
   * @param {object} options
   * @param {() => import("../core/Player.js").Player} options.getPlayer
   * @param {() => void} options.onTransaction - 購入・売却後のコールバック（セーブ等）
   */
  constructor({ getPlayer, onTransaction }) {
    this.getPlayer = getPlayer;
    this.onTransaction = onTransaction;
    this._bindButtons();
  }

  /** タブ・開閉ボタンのイベントを登録 */
  _bindButtons() {
    document.getElementById("shop-btn").addEventListener("click", () => {
      this.render("buy");
      document.getElementById("shop-modal").style.display = "flex";
    });
    document.getElementById("shop-close-btn").addEventListener("click", () => {
      document.getElementById("shop-modal").style.display = "none";
    });
    document.getElementById("shop-tab-buy").addEventListener("click", () => this.render("buy"));
    document.getElementById("shop-tab-sell").addEventListener("click", () => this.render("sell"));
  }

  /**
   * ショップ内容を描画
   * @param {"buy"|"sell"} tab
   */
  render(tab) {
    const player = this.getPlayer();
    document.getElementById("shop-gold-display").innerHTML = renderGoldLabel(player.gold);
    document.getElementById("shop-tab-buy").classList.toggle("active", tab === "buy");
    document.getElementById("shop-tab-sell").classList.toggle("active", tab === "sell");

    const content = document.getElementById("shop-content");
    content.innerHTML = "";

    if (tab === "buy") {
      this._renderBuyTab(player, content);
    } else {
      this._renderSellTab(player, content);
    }
  }

  /** 購入タブ */
  _renderBuyTab(player, content) {
    for (const item of Object.values(ITEM_TYPES)) {
      if (!item.buyPrice) continue;
      const row = document.createElement("div");
      row.className = "shop-row";
      const info = document.createElement("span");
      info.className = "shop-item-info";
      info.innerHTML = `${renderItemIcon(item)}<span>${item.name} <span style="color:#aaa;font-size:0.78rem">${item.description}</span></span>`;
      const price = document.createElement("span");
      price.className = "shop-item-price";
      price.textContent = `${item.buyPrice}G`;
      const btn = document.createElement("button");
      btn.className = "shop-buy-btn";
      btn.textContent = "購入";
      btn.disabled = player.gold < item.buyPrice;
      btn.addEventListener("click", () => {
        if (player.spendGold(item.buyPrice)) {
          player.addToInventory(item);
          this.onTransaction();
          this.render("buy");
        }
      });
      row.appendChild(info);
      row.appendChild(price);
      row.appendChild(btn);
      content.appendChild(row);
    }
  }

  /** 売却タブ */
  _renderSellTab(player, content) {
    const invIds = Object.keys(player.inventory);
    if (invIds.length > 0) {
      const t = document.createElement("div");
      t.className = "shop-section-title";
      t.textContent = "アイテム";
      content.appendChild(t);
      for (const id of invIds) {
        const item = player.inventory[id];
        if (!item.sellPrice) continue;
        const row = document.createElement("div");
        row.className = "shop-row";
        const info = document.createElement("span");
        info.className = "shop-item-info";
        info.innerHTML = `${renderItemIcon(item)}<span>${item.name} <span style="color:#aaa">×${item.count}</span></span>`;
        const price = document.createElement("span");
        price.className = "shop-item-price";
        price.textContent = `${item.sellPrice}G/個`;
        const btn = document.createElement("button");
        btn.className = "shop-sell-btn";
        btn.textContent = "売却";
        btn.addEventListener("click", () => {
          player.addGold(item.sellPrice);
          player.inventory[id].count--;
          if (player.inventory[id].count <= 0) delete player.inventory[id];
          this.onTransaction();
          this.render("sell");
        });
        row.appendChild(info);
        row.appendChild(price);
        row.appendChild(btn);
        content.appendChild(row);
      }
    }

    const eqIds = Object.keys(player.equipmentInventory);
    if (eqIds.length > 0) {
      const t = document.createElement("div");
      t.className = "shop-section-title";
      t.textContent = "装備品";
      content.appendChild(t);
      for (const id of eqIds) {
        const item = player.equipmentInventory[id];
        if (!item.sellPrice) continue;
        const countSuffix = item.count > 1 ? ` <span style="color:#aaa">×${item.count}</span>` : "";
        const row = document.createElement("div");
        row.className = "shop-row";
        const info = document.createElement("span");
        info.className = "shop-item-info";
        info.innerHTML = `${renderItemIcon(item)}<span>${item.name} <span style="color:#5aaa88;font-size:0.78rem">${item.description}</span>${countSuffix}</span>`;
        const price = document.createElement("span");
        price.className = "shop-item-price";
        price.textContent = `${item.sellPrice}G`;
        const btn = document.createElement("button");
        btn.className = "shop-sell-btn";
        btn.textContent = "売却";
        btn.addEventListener("click", () => {
          player.addGold(item.sellPrice);
          player.equipmentInventory[id].count--;
          if (player.equipmentInventory[id].count <= 0) delete player.equipmentInventory[id];
          this.onTransaction();
          this.render("sell");
        });
        row.appendChild(info);
        row.appendChild(price);
        row.appendChild(btn);
        content.appendChild(row);
      }
    }

    if (invIds.length === 0 && eqIds.length === 0) {
      content.innerHTML = "<div style='color:#555;padding:8px 0'>売却できるアイテムなし</div>";
    }
  }

}
