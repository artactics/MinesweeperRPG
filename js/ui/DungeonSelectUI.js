import { DUNGEON_CONFIG } from "../core/constants.js";
import { renderIconHtml } from "./iconHtml.js";
import { renderPlayerStats, renderLockIcon, renderEnterButtonLabel } from "../core/menuIcons.js";

/**
 * ダンジョン選択画面の描画を担当するクラス
 */
export class DungeonSelectUI {

  /**
   * @param {object} options
   * @param {() => import("../core/Player.js").Player} options.getPlayer
   * @param {(level: number) => void} options.onEnterDungeon - 入場ボタン押下時
   */
  constructor({ getPlayer, onEnterDungeon }) {
    this.getPlayer = getPlayer;
    this.onEnterDungeon = onEnterDungeon;
  }

  /** プレイヤー状態とダンジョンカード一覧を再描画 */
  render() {
    const player = this.getPlayer();
    const statsEl = document.getElementById("ds-player-stats");
    statsEl.innerHTML = renderPlayerStats(player);

    const container = document.getElementById("dungeon-cards");
    container.innerHTML = "";

    for (const [level, config] of Object.entries(DUNGEON_CONFIG)) {
      const locked = player.level < config.minPlayerLevel;
      const card = document.createElement("div");
      card.className = `dungeon-card ${config.themeClass}` + (locked ? " dungeon-card-locked" : "");

      const bannerEl = document.createElement("div");
      bannerEl.className = "dungeon-card-banner";
      bannerEl.innerHTML =renderIconHtml(config, "gi-icon-dungeon");
      card.appendChild(bannerEl);

      const bodyEl = document.createElement("div");
      bodyEl.className = "dungeon-card-body";

      const nameEl = document.createElement("div");
      nameEl.className = "dungeon-card-name";
      nameEl.textContent = `${config.name}`;

      const detailsEl = document.createElement("div");
      detailsEl.className = "dungeon-card-details";
      detailsEl.innerHTML = `
        <span>必要Lv: ${config.minPlayerLevel}</span>
        <span>グリッド: ${config.gridSize.rows}×${config.gridSize.cols} &nbsp; 敵: ${config.enemyCount}</span>
        <span>クリアEXP: +${config.clearExp} &nbsp; クリアG: +${config.clearGold}</span>
      `;

      bodyEl.appendChild(nameEl);
      bodyEl.appendChild(detailsEl);

      if (locked) {
        const lockEl = document.createElement("div");
        lockEl.className = "dungeon-card-lock";
        lockEl.innerHTML = `${renderLockIcon()}<span>Lv${config.minPlayerLevel}以上で解放</span>`;
        bodyEl.appendChild(lockEl);
      } else {
        const btn = document.createElement("button");
        btn.className = "dungeon-enter-btn ui-btn ui-btn--enter";
        btn.innerHTML = renderEnterButtonLabel();
        btn.addEventListener("click", () => this.onEnterDungeon(parseInt(level)));
        bodyEl.appendChild(btn);
      }

      card.appendChild(bodyEl);
      container.appendChild(card);
    }
  }
}
