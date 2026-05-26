export class BattleUI {
  constructor() {
    this.modal = document.getElementById("battle-modal");
    this.text = document.getElementById("battle-text");
    this.gridEl = document.getElementById("battle-grid");
    this.labelEl = document.getElementById("battle-grid-label");
    this.logEl = document.getElementById("battle-log");
    this.escapeBtn = document.getElementById("escape-btn");
    this.attackCallback = null;
  }

  show(enemy, player, battleGrid) {
    this.modal.style.display = "flex";
    this.logEl.innerHTML = "";
    this.update(enemy, player);
    this.renderGrid(battleGrid);
  }

  update(enemy, player) {
    this.text.innerHTML =
      `<span style="font-size: 32px;">${enemy.emoji}</span><br>` +
      `<strong style="color: ${enemy.color}">${enemy.name}</strong><br>` +
      `敵HP: <strong>${Math.max(0, enemy.hp)} / ${enemy.maxHp}</strong><br>` +
      `あなたのHP: <strong>${player.hp} / ${player.maxHp}</strong>`;
  }

  renderGrid(battleGrid) {
    const unrevealed = battleGrid.cells.flat().filter(c => !c.revealed);
    const minesLeft = unrevealed.filter(c => c.isMine).length;
    this.labelEl.textContent = `⚠️ 地雷: ${minesLeft}個 ／ 残りマス: ${unrevealed.length}個`;

    this.gridEl.innerHTML = "";
    this.gridEl.style.gridTemplateColumns = `repeat(${battleGrid.size}, 40px)`;

    for (let r = 0; r < battleGrid.size; r++) {
      for (let c = 0; c < battleGrid.size; c++) {
        const cell = battleGrid.cells[r][c];
        const div = document.createElement("div");
        div.className = "battle-cell";

        if (cell.revealed) {
          div.classList.add("battle-cell-revealed");
          if (cell.isMine) {
            div.classList.add("battle-cell-mine");
            div.textContent = "�";
          } else {
            if (cell.danger > 0) {
              div.textContent = cell.danger;
              div.classList.add(`battle-num-${cell.danger}`);
            }
          }
        } else {
          div.addEventListener("click", () => {
            if (this.attackCallback) this.attackCallback(r, c);
          });
        }
        this.gridEl.appendChild(div);
      }
    }
  }

  addLog(msg, type = "normal") {
    const line = document.createElement("div");
    line.className = `battle-log-line battle-log-${type}`;
    line.textContent = msg;
    this.logEl.appendChild(line);
    this.logEl.scrollTop = this.logEl.scrollHeight;
  }

  hide() {
    this.modal.style.display = "none";
  }

  onAttack(callback) {
    this.attackCallback = callback;
  }

  onEscape(callback) {
    this.escapeBtn.onclick = callback;
  }
}
