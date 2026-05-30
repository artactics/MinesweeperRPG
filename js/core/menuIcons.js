import { renderIconHtml } from "../ui/iconHtml.js";

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
  coins:         { name: "所持金", iconUrl: MENU("coins.svg"), iconColor: "#FFCA28" },
  equipment:     { name: "装備", iconUrl: MENU("equipment.svg"), iconColor: "#90CAF9" },
  dungeonSelect: { name: "ダンジョン選択", iconUrl: MENU("dungeon-select.svg"), iconColor: "#CE93D8" },
  entryDoor:     { name: "入場", iconUrl: MENU("entry-door.svg"), iconColor: "#66BB6A" },
  exitDoor:      { name: "退出", iconUrl: MENU("exit-door.svg"), iconColor: "#EF9A9A" }
};

/** ゲーム起動時に HTML 内の絵文字を SVG に差し替え */
export function initMenuIcons() {
  const icon = (key, size = "gi-icon-menu") =>
    renderIconHtml(MENU_ICONS[key], size);

  const homeTitle = document.querySelector(".home-title");
  if (homeTitle) {
    homeTitle.innerHTML = `${icon("bomb", "gi-icon-menu-lg")} マインスイーパーRPG`;
  }

  const featureItems = [
    ["party", "ダンジョンを探索して敵と戦う"],
    ["coins", "経験値でレベルアップ"],
    ["bag", "アイテムを集めて強化"],
    ["save", "Googleアカウントで進行を保存"]
  ];
  const features = document.querySelectorAll(".home-features div");
  features.forEach((el, i) => {
    const [key, text] = featureItems[i] || featureItems[0];
    el.innerHTML = `${icon(key)} ${text}`;
  });

  setBtn("home-login-btn", "key", "Googleでログイン");
  setBtn("home-guest-btn", "gamepad", "ゲストで遊ぶ");

  const dsHeader = document.querySelector("#ds-header h2");
  if (dsHeader) dsHeader.innerHTML = `${icon("dungeonSelect")} ダンジョン選択`;

  setBtn("inventory-btn", "inventory", "倉庫");
  setBtn("shop-btn", "coins", "ショップ");
  setBtn("equipment-btn", "equipment", "装備");
  setBtn("ds-login-btn", "key", "ログイン");
  setBtn("back-to-select-btn", "exitDoor", "ダンジョン選択に戻る");

  const flagBtn = document.getElementById("flag-mode-btn");
  if (flagBtn) flagBtn.textContent = "旗モード";

  const battleLabel = document.getElementById("battle-grid-label");
  if (battleLabel) battleLabel.textContent = "攻撃するマスを選べ（地雷に注意！）";

  setHeading("inventory-modal", "h2", "inventory", "倉庫");
  setHeading("shop-modal", "h2", "coins", "ショップ");
  setHeading("equipment-modal", "h2", "equipment", "装備管理");

  const resultTitle = document.getElementById("result-title");
  if (resultTitle) {
    resultTitle.innerHTML = `${icon("entryDoor", "gi-icon-menu-lg")} ダンジョンクリア！`;
  }
}

function setBtn(id, iconKey, label) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = `${renderIconHtml(MENU_ICONS[iconKey], "gi-icon-menu")} ${label}`;
}

function setHeading(modalId, tag, iconKey, label) {
  const el = document.querySelector(`#${modalId} ${tag}`);
  if (!el) return;
  el.innerHTML = `${renderIconHtml(MENU_ICONS[iconKey], "gi-icon-menu")} ${label}`;
}

/** ダンジョンカードのロック表示用 */
export function renderLockIcon() {
  return renderIconHtml(MENU_ICONS.key, "gi-icon-menu-sm");
}

/** ショップの所持金表示 */
export function renderGoldLabel(gold) {
  return `${renderIconHtml(MENU_ICONS.coins, "gi-icon-menu-sm")} 所持金: ${gold}G`;
}

/** ダンジョン選択画面の所持金表示 */
export function renderGoldInline(gold) {
  return `${renderIconHtml(MENU_ICONS.coins, "gi-icon-menu-sm")} ${gold}G`;
}
