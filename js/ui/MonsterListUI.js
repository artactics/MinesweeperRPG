import { renderItemIcon } from "./iconBadge.js";

/**
 * 攻略中画面の「残り敵一覧」表示を担当するクラス
 */
export class MonsterListUI {

  /**
   * グリッド上の未撃破・未開示の敵を集計して表示
   * @param {import("../core/Grid.js").Grid | null} grid
   */
  render(grid) {
    const el = document.getElementById("monster-list");
    if (!el || !grid) return;

    const counts = {};
    for (let r = 0; r < grid.rows; r++) {
      for (let c = 0; c < grid.cols; c++) {
        const cell = grid.cells[r][c];
        if (!cell.isEnemy || cell.revealed) continue;
        const t = cell.enemyType;
        const tier = cell.isMaster ? "master" : cell.isElite ? "elite" : "normal";
        const key = tier + ":" + (t ? t.name : "?");
        if (!counts[key]) {
          const icon = t ? `${renderItemIcon(t)} ` : "";
          const enemyName = t ? t.name : "?";
          const suffix = cell.isMaster ? "（マスター）" : cell.isElite ? "（エリート）" : "";
          counts[key] = {
            label: `${icon}${enemyName}${suffix}`,
            tier,
            count: 0
          };
        }
        counts[key].count++;
      }
    }

    const tierOrder = { master: 0, elite: 1, normal: 2 };
    const items = Object.values(counts)
      .sort((a, b) => tierOrder[a.tier] - tierOrder[b.tier])
      .map(e => {
        const cls = e.tier === "master" ? "monster-master" : e.tier === "elite" ? "monster-elite" : "";
        return `<div class="${cls}">${e.label} ×${e.count}</div>`;
      });

    el.innerHTML = items.join("") || `<div>クリア！</div>`;
  }
}
