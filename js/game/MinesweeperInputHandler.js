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
    onCheckClear,
    onFlagChange = null
  }) {
    this.getSession = getSession;
    this.gridRenderer = gridRenderer;
    this.battleCoordinator = battleCoordinator;
    this.getPlayer = getPlayer;
    this.logUI = logUI;
    this.onUpdateUI = onUpdateUI;
    this.onSave = onSave;
    this.onCheckClear = onCheckClear;
    this.onFlagChange = onFlagChange;
  }

  useFieldSkill(skill) {
    const player = this.getPlayer();
    if (!player || player.mp < skill.mpCost) {
      this.logUI.add("スキルを使用するにはMPが足りません");
      return false;
    }
    if (skill.id === "heal") {
      const before = player.hp;
      player.hp = Math.min(player.hp + 10, player.maxHp);
      player.spendMp(skill.mpCost);
      this.logUI.add(`回復スキル発動！HP+${player.hp - before}`);
      this.onUpdateUI();
      this.onSave();
      return true;
    }
    if (skill.id === "cure_poison" || skill.id === "cure_burn" || skill.id === "cure_freeze") {
      const key = skill.id === "cure_poison" ? "poison" : skill.id === "cure_burn" ? "burn" : "freeze";
      if (!player[key]) {
        this.logUI.add(`${skill.name}：状態異常になっていません`);
        return false;
      }
      player[key] = false;
      player.spendMp(skill.mpCost);
      const label = skill.id === "cure_poison" ? "毒" : skill.id === "cure_burn" ? "火傷" : "凍傷";
      this.logUI.add(`${skill.name}発動！${label}を解除した`);
      this.onUpdateUI();
      this.onSave();
      return true;
    }
    if (skill.id === "scout") {
      const session = this.getSession();
      const grid = session.grid;
      if (!grid) return false;
      const candidates = [];
      for (let r = 0; r < grid.rows; r++) {
        for (let c = 0; c < grid.cols; c++) {
          const cell = grid.cells[r][c];
          if (!cell.revealed && !cell.isEnemy && !cell.flagged) candidates.push(cell);
        }
      }
      if (candidates.length === 0) {
        this.logUI.add("開けるマスがない");
        return false;
      }
      const target = candidates[Math.floor(Math.random() * candidates.length)];
      player.spendMp(skill.mpCost);
      this.logUI.add(`索敵スキル発動！マスを開けた`);
      this.onLeft(target, true);
      this.onUpdateUI();
      return true;
    }
    return false;
  }

  /** 左クリック（マス開示・コード開き・アイテム取得） */
  onLeft(cell, skipMpGain = false) {
    const session = this.getSession();
    const grid = session.grid;
    if (!grid) return;

    if (session.flagMode) {
      this.onRight(cell);
      return;
    }
    if (cell.flagged) return;

    if (cell.revealed) {
      // コード開き：特殊マスは無効
      if (cell.specialType) return;
      const displayDanger = cell.displayedDanger ?? cell.danger;
      if (displayDanger !== null && displayDanger > 0) {
        const neighbors = grid.getNeighbors(cell);
        const flagCount = neighbors.reduce((s, n) => s + (n.flagType || (n.flagged ? 1 : 0)), 0);
        if (flagCount === displayDanger) {
          for (const n of neighbors.filter(n => !n.flagged && !n.revealed)) {
            this.onLeft(n, skipMpGain);
          }
        }
      }
      return;
    }

    // 頑丈チェック：周囲の通常マスが全て開放されていないと開けない
    if (cell.specialType === "sturdy") {
      const neighbors = grid.getNeighbors(cell);
      const canOpen = neighbors.every(n => n.isEnemy || n.specialType === "sturdy" || n.revealed);
      if (!canOpen) return;
    }

    cell.revealed = true;
    this.gridRenderer.updateCell(cell);

    if (cell.isEnemy) {
      this.battleCoordinator.startBattle(cell);
      return;
    }

    if (!skipMpGain) this.getPlayer().gainMp(1);

    // 特殊マス・dangerあり：フラッド無効。通常danger=0のみ連鎖開示
    if (!cell.specialType && cell.danger === 0) {
      this.floodReveal(cell.row, cell.col, skipMpGain);
    }

    this.onCheckClear();
    this.onUpdateUI();
  }

  /** 右クリック（旗サイクル: なし→1→2→3→なし） */
  onRight(cell) {
    if (cell.revealed) return;
    cell.flagType = ((cell.flagType || 0) + 1) % 4;
    cell.flagged  = cell.flagType > 0;
    this.gridRenderer.updateCell(cell);
    this.onFlagChange?.();
  }

  /** danger=0 のマスから連鎖的に開示 */
  floodReveal(r, c, skipMpGain = false) {
    const session = this.getSession();
    const grid = session.grid;

    for (const [dr, dc] of DIRECTIONS) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nr >= grid.rows || nc < 0 || nc >= grid.cols) continue;

      const cell = grid.cells[nr][nc];
      if (cell.revealed || cell.isEnemy || cell.specialType) continue;

      cell.revealed = true;
      this.gridRenderer.updateCell(cell);
      if (!skipMpGain) this.getPlayer().gainMp(1);

      if (cell.danger === 0) {
        this.floodReveal(nr, nc, skipMpGain);
      }
    }
  }

}
