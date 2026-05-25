import { Grid } from "./core/Grid.js";
import { Player } from "./core/Player.js";
import { BattleSystem } from "./core/BattleSystem.js";
import { GridRenderer } from "./ui/GridRenderer.js";
import { BattleUI } from "./ui/BattleUI.js";
import { LogUI } from "./ui/LogUI.js";
import { ModalUI } from "./ui/ModalUI.js";
import { DIRECTIONS, GAME_CONFIG } from "./core/constants.js";


export class GameController {

  constructor() {
    this.grid = new Grid(GAME_CONFIG.GRID_ROWS, GAME_CONFIG.GRID_COLS, GAME_CONFIG.ENEMY_COUNT);
    this.player = new Player();
    this.battle = new BattleSystem(this.player);

    this.gridRenderer = new GridRenderer(
      this.grid,
      document.getElementById("grid"),
      cell => this.onLeft(cell),
      cell => this.onRight(cell)
    );

    this.battleUI = new BattleUI();
    this.logUI = new LogUI();
    this.modalUI = new ModalUI();

    this.gridRenderer.render();
    this.updateUI();
  }

  onLeft(cell) {
    if (cell.revealed || cell.flagged) return;

    cell.revealed = true;
    this.gridRenderer.updateCell(cell);

    // 敵マス
    if (cell.isEnemy) {
      const enemy = this.battle.start(cell);
      this.logUI.add(`${enemy.emoji} ${enemy.name}が現れた！ 危険度:${cell.danger}`);

      this.battleUI.show(enemy, this.player);

      this.battleUI.onAttack(() => {
        const result = this.battle.attack();
        this.battleUI.update(enemy, this.player);
        this.updateUI();

        if (result === "victory") {
          this.logUI.add("敵を倒した！");

          // ★ 敵マスを安全マスに変更
          cell.isEnemy = false;
          cell.revealed = true;

          // ★ このマス自身の danger を再計算
          cell.danger = this.grid.countDanger(cell.row, cell.col);
          this.gridRenderer.updateCell(cell);

          // ★ 周囲 8 マスの danger も再計算
          for (const [dr, dc] of DIRECTIONS) {
            const nr = cell.row + dr;
            const nc = cell.col + dc;

            if (nr < 0 || nr >= this.grid.rows || nc < 0 || nc >= this.grid.cols) continue;

            const neighbor = this.grid.cells[nr][nc];

            // 敵じゃないマスだけ danger 再計算
            if (!neighbor.isEnemy) {
              neighbor.danger = this.grid.countDanger(nr, nc);
              this.gridRenderer.updateCell(neighbor);
            }
          }

          this.battleUI.hide();
          this.checkClear();
        } else if (result === "defeat") {
          this.logUI.add("やられてしまった…");
          this.battleUI.hide();
          this.showGameOver();
        }
      });

      this.battleUI.onEscape(() => {
        this.player.hp -= GAME_CONFIG.ESCAPE_DAMAGE;
        if (this.player.hp <= 0) {
          this.player.hp = 0;
          this.logUI.add(`逃げたが、${GAME_CONFIG.ESCAPE_DAMAGE}ダメージを受けた…`);
          this.battleUI.hide();
          this.showGameOver();
          return;
        }

        this.logUI.add(`逃げた！（${GAME_CONFIG.ESCAPE_DAMAGE}ダメージ）`);
        this.battleUI.hide();
        this.updateUI();

        cell.revealed = false;
        this.gridRenderer.updateCell(cell);
      });

      return;
    }

    // ★ 通常マスの処理（敵マスの外）
    if (cell.danger > 0) {
      cell.element.textContent = cell.danger;
    } else {
      this.floodReveal(cell.row, cell.col);
    }

    // ★ クリア判定（ここで呼ぶ）
    this.checkClear();
  }



  onRight(cell) {
    if (cell.revealed) return;
    cell.flagged = !cell.flagged;
    this.gridRenderer.updateCell(cell);
  }


  updateUI() {
    this.logUI.updatePlayer(this.player);
  }

  floodReveal(r, c) {
    for (const [dr, dc] of DIRECTIONS) {
      const nr = r + dr;
      const nc = c + dc;

      // 範囲外は無視
      if (nr < 0 || nr >= this.grid.rows || nc < 0 || nc >= this.grid.cols) continue;

      const cell = this.grid.cells[nr][nc];

      // すでに開いている or 敵マスは無視
      if (cell.revealed || cell.isEnemy) continue;

      // 開く
      cell.revealed = true;
      this.gridRenderer.updateCell(cell);

      // danger=0 ならさらに周囲を開く
      if (cell.danger === 0) {
        this.floodReveal(nr, nc);
      }
    }
  }

  checkClear() {
    for (let r = 0; r < this.grid.rows; r++) {
      for (let c = 0; c < this.grid.cols; c++) {
        const cell = this.grid.cells[r][c];
        if (cell.isEnemy) return false; // 敵が残っている
      }
    }
    this.showClearModal();
    return true;
  }

  showClearModal() {
    this.modalUI.showClear();
  }

  showGameOver() {
    this.modalUI.showGameOver(() => this.resetGame());
  }

  resetGame() {
    this.grid = new Grid(GAME_CONFIG.GRID_ROWS, GAME_CONFIG.GRID_COLS, GAME_CONFIG.ENEMY_COUNT);
    this.player = new Player();
    this.battle = new BattleSystem(this.player);

    this.gridRenderer.grid = this.grid;
    this.gridRenderer.render();
    this.logUI.clear();
    this.updateUI();
  }


}
