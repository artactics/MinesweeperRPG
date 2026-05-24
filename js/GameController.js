import { Grid } from "./core/Grid.js";
import { Player } from "./core/Player.js";
import { BattleSystem } from "./core/BattleSystem.js";
import { GridRenderer } from "./ui/GridRenderer.js";
import { BattleUI } from "./ui/BattleUI.js";
import { LogUI } from "./ui/LogUI.js";


export class GameController {

  constructor() {
    this.grid = new Grid(10, 10, 15);
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
      this.logUI.add(`敵が現れた！ 危険度:${cell.danger}`);

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
          const dirs = [
            [-1,-1],[-1,0],[-1,1],
            [0,-1],        [0,1],
            [1,-1],[1,0],[1,1]
          ];

          for (const [dr, dc] of dirs) {
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
        this.logUI.add("逃げた！");
        this.battleUI.hide();

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

  showBattle(enemy) {
    const modal = document.getElementById("battle-modal");
    modal.style.display = "flex";

    const update = () => {
      document.getElementById("battle-text").innerHTML =
        `敵HP: ${enemy.hp}<br>あなたのHP: ${this.player.hp}`;
    };
    update();

    document.getElementById("attack-btn").onclick = () => {
      const result = this.battle.attack();
      update();
      this.updateUI();

      if (result !== "continue") {
        modal.style.display = "none";
      }
    };
  }

  updateUI() {
    document.getElementById("player-level").textContent = this.player.level;
    document.getElementById("player-hp").textContent = this.player.hp;
    document.getElementById("player-max-hp").textContent = this.player.maxHp;
    document.getElementById("player-atk").textContent = this.player.atk;
    document.getElementById("player-exp").textContent = this.player.exp;
  }

  floodReveal(r, c) {
    const dirs = [
      [-1,-1],[-1,0],[-1,1],
      [0,-1],        [0,1],
      [1,-1],[1,0],[1,1]
    ];

    for (const [dr, dc] of dirs) {
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
    const modal = document.getElementById("clear-modal");
    modal.style.display = "flex";

    document.getElementById("clear-ok-btn").onclick = () => {
      modal.style.display = "none";
    };
  }

  showGameOver() {
    const modal = document.getElementById("gameover-modal");
    modal.style.display = "flex";

    document.getElementById("gameover-retry-btn").onclick = () => {
      modal.style.display = "none";
      this.resetGame();
    };
  }

  resetGame() {
    this.grid = new Grid(10, 10, 15);
    this.player = new Player();
    this.battle = new BattleSystem(this.player);

    this.gridRenderer.grid = this.grid;
    this.gridRenderer.render();
    this.logUI.clear();
    this.updateUI();
  }


}
