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
        const key = (cell.isElite ? "elite:" : "normal:") + (t ? t.name : "?");
        if (!counts[key]) {
          const icon = t && t.emoji ? `<span aria-hidden="true" style="font-size:16px">${t.emoji}</span> ` : "";
          counts[key] = {
            label: cell.isElite ? `${icon}${t ? t.name : "?"}（エリート）` : `${icon}${t ? t.name : "?"}`,
            isElite: cell.isElite,
            count: 0
          };
        }
        counts[key].count++;
      }
    }

    const items = Object.values(counts)
      .sort((a, b) => b.isElite - a.isElite)
      .map(e => {
        const cls = e.isElite ? "monster-elite" : "";
        return `<div class="${cls}">${e.label} ×${e.count}</div>`;
      });

    el.innerHTML = items.join("") || `<div>クリア！</div>`;
  }
}
