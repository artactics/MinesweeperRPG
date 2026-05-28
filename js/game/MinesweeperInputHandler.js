import { DIRECTIONS } from "../core/constants.js";

/**
 * マインスイーパー盤面の左クリック・右クリック（旗）入力を処理するクラス
 */
export class MinesweeperInputHandler {

  /**
   * @param {object} options
   * @param {() => import("./DungeonSession.js").DungeonSession} options.getSession
   * @param {import("../ui/GridRenderer.js").GridRenderer} options.gridRenderer
   * @param {import("./BattleCoordinator.js").BattleCoordinator} options.battleCoordinator
   * @param {() => import("../core/Player.js").Player} options.getPlayer
   * @param {import("../ui/LogUI.js").LogUI} options.logUI
   * @param {() => void} options.onUpdateUI
   * @param {() => Promise<void>} options.onSave
   * @param {() => boolean} options.onCheckClear
   */
  constructor({
    getSession,
    gridRenderer,
    battleCoordinator,
    getPlayer,
    logUI,
    onUpdateUI,
    onSave,
    onCheckClear
  }) {
    this.getSession = getSession;
    this.gridRenderer = gridRenderer;
    this.battleCoordinator = battleCoordinator;
    this.getPlayer = getPlayer;
    this.logUI = logUI;
    this.onUpdateUI = onUpdateUI;
    this.onSave = onSave;
    this.onCheckClear = onCheckClear;
  }

  /** 左クリック（マス開示・コード開き・アイテム取得） */
  onLeft(cell) {
    const session = this.getSession();
    const grid = session.grid;
    if (!grid) return;

    if (session.flagMode) {
      this.onRight(cell);
      return;
    }
    if (cell.flagged) return;

    // 開いたマスでアイテムがある場合 → 取得
    if (cell.revealed && cell.item) {
      this._pickupItem(cell);
      return;
    }

    if (cell.revealed) {
      // コード開き：周囲の旗の数が danger と一致すれば隣接マスを一括開封
      if (cell.danger > 0) {
        const neighbors = grid.getNeighbors(cell);
        const flagCount = neighbors.filter(n => n.flagged).length;
        if (flagCount === cell.danger) {
          for (const n of neighbors.filter(n => !n.flagged && !n.revealed)) {
            this.onLeft(n);
          }
        }
      }
      return;
    }

    cell.revealed = true;
    this.gridRenderer.updateCell(cell);

    // アイテムマスは開いた状態で止める（再度クリックで取得）
    if (cell.item) return;

    if (cell.isEnemy) {
      this.battleCoordinator.startBattle(cell);
      return;
    }

    if (cell.danger > 0) {
      cell.element.textContent = cell.danger;
    } else {
      this.floodReveal(cell.row, cell.col);
    }

    this.onCheckClear();
  }

  /** 右クリック（旗の設置・解除） */
  onRight(cell) {
    if (cell.revealed) return;
    cell.flagged = !cell.flagged;
    this.gridRenderer.updateCell(cell);
  }

  /** danger=0 のマスから連鎖的に開示 */
  floodReveal(r, c) {
    const session = this.getSession();
    const grid = session.grid;

    for (const [dr, dc] of DIRECTIONS) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nr >= grid.rows || nc < 0 || nc >= grid.cols) continue;

      const cell = grid.cells[nr][nc];
      if (cell.revealed || cell.isEnemy) continue;

      cell.revealed = true;
      this.gridRenderer.updateCell(cell);

      if (cell.danger === 0) {
        this.floodReveal(nr, nc);
      }
    }
  }

  /** マス上のアイテムをプレイヤーに加える */
  _pickupItem(cell) {
    const session = this.getSession();
    const player = this.getPlayer();
    const item = cell.item;

    if (item.category === "equipment") {
      session.trackEquipmentPickup(item);
      this.logUI.add(`${item.emoji} ${item.name}を入手した！（装備品）`);
    } else {
      player.addItem(item);
      this.logUI.add(`${item.emoji} ${item.name}を手に入れた！`);
    }

    cell.item = null;
    this.gridRenderer.updateCell(cell);
    this.onUpdateUI();
    this.onSave();
  }
}
