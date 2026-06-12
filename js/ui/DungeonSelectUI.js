import { DUNGEON_CONFIG, ENEMY_TYPES } from "../core/constants.js";
import { DUNGEON_LAYER_CONFIG, LAYER_LABELS, LAYER_KEYS } from "../config/dungeonLayerConfig.js";
import { renderIconHtml } from "./iconHtml.js";
import { renderPlayerStats, renderLockIcon } from "../core/menuIcons.js";

/**
 * ダンジョン選択画面の描画を担当するクラス
 */
export class DungeonSelectUI {

  /**
   * @param {object} options
   * @param {() => import("../core/Player.js").Player} options.getPlayer
   * @param {(level: number, layer: string) => void} options.onEnterDungeon - 入場ボタン押下時
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

    const LAYER_CSS = { surface: "layer-btn--surface", middle: "layer-btn--middle", deep: "layer-btn--deep" };

    for (const [level, config] of Object.entries(DUNGEON_CONFIG)) {
      const dungeonLvl = parseInt(level);
      const locked = player.level < config.minPlayerLevel;
      const layerConfigs = DUNGEON_LAYER_CONFIG[dungeonLvl];

      const card = document.createElement("div");
      card.className = `dungeon-card ${config.themeClass}` + (locked ? " dungeon-card-locked" : "");

      const bannerEl = document.createElement("div");
      bannerEl.className = "dungeon-card-banner";
      bannerEl.innerHTML = renderIconHtml(config, "gi-icon-dungeon");
      card.appendChild(bannerEl);

      const bodyEl = document.createElement("div");
      bodyEl.className = "dungeon-card-body";

      const nameEl = document.createElement("div");
      nameEl.className = "dungeon-card-name";
      nameEl.textContent = config.name;

      const enemyNames = config.enemyTypes.map(t => ENEMY_TYPES[t].name).join("、");
      const detailsEl = document.createElement("div");
      detailsEl.className = "dungeon-card-details";
      detailsEl.innerHTML = `
        <span>必要Lv: ${config.minPlayerLevel}</span>
        <span>出現敵: ${enemyNames}</span>
      `;

      bodyEl.appendChild(nameEl);
      bodyEl.appendChild(detailsEl);

      if (locked) {
        const lockEl = document.createElement("div");
        lockEl.className = "dungeon-card-lock";
        lockEl.innerHTML = `${renderLockIcon()}<span>Lv${config.minPlayerLevel}以上で解放</span>`;
        bodyEl.appendChild(lockEl);
      } else {
        const layersEl = document.createElement("div");
        layersEl.className = "dungeon-layers";

        for (const layerKey of LAYER_KEYS) {
          const lc = layerConfigs[layerKey];
          const layerLocked = player.level < lc.minPlayerLevel;

          const btn = document.createElement("button");
          btn.className = `layer-btn ${LAYER_CSS[layerKey]}`;
          btn.disabled = layerLocked;

          const levelNote = layerLocked
            ? `<span class="layer-btn__level">Lv${lc.minPlayerLevel}+</span>`
            : `<span class="layer-btn__level">EXP ${lc.exp}</span>`;

          btn.innerHTML = `
            <span class="layer-btn__name">${LAYER_LABELS[layerKey]}</span>
            <span class="layer-btn__floors">${lc.floorCount}F</span>
            ${levelNote}
          `;

          if (!layerLocked) {
            btn.addEventListener("click", () => this.onEnterDungeon(dungeonLvl, layerKey));
          }
          layersEl.appendChild(btn);
        }

        bodyEl.appendChild(layersEl);
      }

      card.appendChild(bodyEl);
      container.appendChild(card);
    }
  }
}
