import {
  renderIconBadge,
  renderIconButtonContent,
  renderIconHeading,
  renderIconFeatureRow,
  renderStatPill
} from "../ui/iconBadge.js";

/** メニュー・UI 用 SVG アイコン（asset/image/menu） */
const MENU = (file) => `./asset/image/menu/${file}`;

export const MENU_ICONS = {
  bomb:          { name: "地雷", iconUrl: MENU("bomb.svg"), iconColor: "#EF5350" },
  gamepad:       { name: "ゲーム", iconUrl: MENU("gamepad.svg"), iconColor: "#64B5F6" },
  key:           { name: "鍵", iconUrl: MENU("key.svg"), iconColor: "#FFD54F" },
  save:          { name: "セーブ", iconUrl: MENU("save.svg"), iconColor: "#81C784" },
  party:         { name: "パーティ", iconUrl: MENU("party.svg"), iconColor: "#FF8A65" },
  bag:           { name: "バッグ", iconUrl: MENU("bag.svg"), iconColor: "#A1887F" },
  inventory:     { name: "倉庫", iconUrl: MENU("inventory.svg"), iconColor: "#90A4AE" },
  shop:          { name: "ショップ", iconUrl: MENU("shop.svg"), iconColor: "#FFB74D" },
  coins:         { name: "所持金", iconUrl: MENU("coins.svg"), iconColor: "#FFCA28" },
  equipment:     { name: "装備", iconUrl: MENU("equipment.svg"), iconColor: "#90CAF9" },
  dungeonSelect: { name: "ダンジョン選択", iconUrl: MENU("dungeon-select.svg"), iconColor: "#CE93D8" },
  entryDoor:     { name: "入場", iconUrl: MENU("entry-door.svg"), iconColor: "#5c3100" },
  exitDoor:      { name: "退出", iconUrl: MENU("exit-door.svg"), iconColor: "#EF9A9A" }
};

/** ゲーム起動時にメニュー UI を SVG バッジデザインで構築 */
export function initMenuIcons() {
  const homeTitle = document.querySelector(".home-title");
  if (homeTitle) {
    homeTitle.innerHTML = renderIconHeading(MENU_ICONS.bomb, "マインスイーパーRPG", "xl");
  }

  const featureItems = [
    ["party", "ダンジョンを探索して敵と戦う"],
    ["coins", "経験値でレベルアップ"],
    ["bag", "アイテムを集めて強化"],
    ["save", "Googleアカウントで進行を保存"]
  ];
  const featuresEl = document.querySelector(".home-features");
  if (featuresEl) {
    featuresEl.innerHTML = featureItems
      .map(([key, text]) => renderIconFeatureRow(MENU_ICONS[key], text))
      .join("");
  }

  setBtn("home-login-btn", "key", "Googleでログイン", "primary", "md");
  setBtn("home-guest-btn", "gamepad", "ゲストで遊ぶ", "ghost", "md");

  const dsHeader = document.querySelector("#ds-header h2");
  if (dsHeader) {
    dsHeader.innerHTML = renderIconHeading(MENU_ICONS.dungeonSelect, "ダンジョン選択", "md");
  }

  setBtn("inventory-btn", "inventory", "倉庫", "toolbar");
  setBtn("shop-btn", "shop", "ショップ", "toolbar");
  setBtn("equipment-btn", "equipment", "装備", "toolbar");
  setBtn("ds-login-btn", "key", "ログイン", "toolbar");
  setBtn("back-to-select-btn", "exitDoor", "ダンジョン選択に戻る", "ghost", "sm");

  document.querySelectorAll("#inventory-btn, #shop-btn, #equipment-btn, #ds-login-btn")
    .forEach(el => el.classList.add("ui-btn", "ui-btn--toolbar"));
  document.getElementById("home-login-btn")?.classList.add("ui-btn", "ui-btn--primary");
  document.getElementById("home-guest-btn")?.classList.add("ui-btn", "ui-btn--ghost");
  document.getElementById("back-to-select-btn")?.classList.add("ui-btn", "ui-btn--ghost", "ui-btn--ghost-inline");

  const flagBtn = document.getElementById("flag-mode-btn");
  if (flagBtn) flagBtn.textContent = "旗モード";

  const battleLabel = document.getElementById("battle-grid-label");
  if (battleLabel) battleLabel.textContent = "攻撃するマスを選べ（地雷に注意！）";

  setHeading("inventory-modal", "h2", "inventory", "倉庫");
  setHeading("shop-modal", "h2", "shop", "ショップ");
  setHeading("equipment-modal", "h2", "equipment", "装備管理");

  const resultTitle = document.getElementById("result-title");
  if (resultTitle) {
    resultTitle.innerHTML = renderIconHeading(MENU_ICONS.party, "ダンジョンクリア！", "lg");
  }
}

function setBtn(id, iconKey, label, variant, badgeSize) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = renderIconButtonContent(MENU_ICONS[iconKey], label, variant, badgeSize);
}

function setHeading(modalId, tag, iconKey, label) {
  const el = document.querySelector(`#${modalId} ${tag}`);
  if (!el) return;
  el.innerHTML = renderIconHeading(MENU_ICONS[iconKey], label, "md");
  el.classList.add("ui-modal-heading");
}

/** ダンジョンカードのロック表示 */
export function renderLockIcon() {
  return renderIconBadge(MENU_ICONS.key, "sm");
}

/** ショップの所持金表示 */
export function renderGoldLabel(gold) {
  return (
    `<span class="gold-display">` +
    `${renderIconBadge(MENU_ICONS.coins, "sm")}` +
    `<span class="gold-display__text">所持金: <strong>${gold}G</strong></span>` +
    `</span>`
  );
}

/** ダンジョン選択画面のプレイヤーステータス行 */
export function renderPlayerStats(player) {
  return (
    `<div class="stat-bar">` +
    renderStatPill(`Lv <strong>${player.level}</strong>`, "level") +
    renderStatPill(`HP ${player.hp}/${player.maxHp}`, "hp") +
    renderStatPill(`ATK ${player.atk}`, "atk") +
    `<span class="stat-pill stat-pill--gold">` +
    `${renderIconBadge(MENU_ICONS.coins, "sm")}` +
    `<span>${player.gold}G</span>` +
    `</span>` +
    `</div>`
  );
}

/** 入場ボタン */
export function renderEnterButtonLabel() {
  return renderIconButtonContent(MENU_ICONS.entryDoor, "入場する", "enter", "lg");
}
