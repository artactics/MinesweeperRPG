import { renderIconBadge } from "./iconBadge.js";

export class BattleUI {
  constructor() {
    this.modal = document.getElementById("battle-modal");
    this.text = document.getElementById("battle-text");
    this.gridEl = document.getElementById("battle-grid");
    this.labelEl = document.getElementById("battle-grid-label");
    this.logEl = document.getElementById("battle-log");
    this.skillPanel = document.getElementById("battle-skill-panel");
    this.attackCallback = null;
    this.selectedSkill = null;
    this._battleSkills = [];
    this._currentPlayer = null;
  }

  show(enemy, player, battleGrid) {
    this.modal.style.display = "flex";
    this.logEl.innerHTML = "";
    this.selectedSkill = null;
    this._currentPlayer = player;
    this.update(enemy, player);
    this.renderGrid(battleGrid);
  }

  update(enemy, player) {
    this._currentPlayer = player;
    const img = `<div class="battle-enemy-icon">${renderIconBadge(enemy, "lg")}</div>`;
    const focusBadge = player.focusActive ? ` <span class="focus-badge">集中中</span>` : "";
    this.text.innerHTML =
      `${img}<br>` +
      `<strong style="color: ${enemy.color}">${enemy.name}</strong><br>` +
      `敵HP: <strong>${Math.max(0, enemy.hp)} / ${enemy.maxHp}</strong><br>` +
      `あなたのHP: <strong>${player.hp} / ${player.maxHp}</strong>` +
      ` &nbsp; MP: <strong>${player.mp} / ${player.maxMp}</strong>${focusBadge}`;
  }

  renderSkills(skills, player) {
    this._battleSkills = skills;
    this._currentPlayer = player;
    if (!this.skillPanel) return;
    if (!skills || skills.length === 0) {
      this.skillPanel.innerHTML = "";
      return;
    }
    this.skillPanel.innerHTML = "";
    for (const skill of skills) {
      const btn = document.createElement("button");
      btn.className = "skill-btn";
      const canUse = player.mp >= skill.mpCost;
      btn.disabled = !canUse;
      if (this.selectedSkill?.id === skill.id) btn.classList.add("skill-btn--selected");
      btn.innerHTML = `${skill.name} <span class="skill-cost">MP:${skill.mpCost}</span>`;
      btn.title = skill.description;
      btn.onclick = () => {
        this.selectedSkill = (this.selectedSkill?.id === skill.id) ? null : skill;
        this.renderSkills(this._battleSkills, this._currentPlayer);
      };
      this.skillPanel.appendChild(btn);
    }
  }

  clearSkillSelection() {
    this.selectedSkill = null;
  }


  renderGrid(battleGrid) {
    const unrevealed = battleGrid.cells.flat().filter(c => !c.revealed);
    const minesLeft = unrevealed.filter(c => c.isMine).length;
    this.labelEl.textContent = "\u26a0\ufe0f \u5730\u96f7: " + minesLeft + "\u500b \uff0f \u6b8b\u308a\u30de\u30b9: " + unrevealed.length + "\u500b";

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
            div.textContent = "\u2716";
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

}
