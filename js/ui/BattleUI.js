export class BattleUI {
  constructor() {
    this.modal = document.getElementById("battle-modal");
    this.text = document.getElementById("battle-text");
    this.logEl = document.getElementById("battle-log");
    this.attackBtn = document.getElementById("attack-btn");
    this.escapeBtn = document.getElementById("escape-btn");
  }

  show(enemy, player) {
    this.modal.style.display = "flex";
    this.logEl.innerHTML = "";
    this.update(enemy, player);
  }

  update(enemy, player) {
    this.text.innerHTML =
      `<span style="font-size: 32px;">${enemy.emoji}</span><br>` +
      `<strong style="color: ${enemy.color}">${enemy.name}</strong><br>` +
      `敵HP: <strong>${Math.max(0, enemy.hp)} / ${enemy.maxHp}</strong><br>` +
      `あなたのHP: <strong>${player.hp} / ${player.maxHp}</strong>`;
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
    this.attackBtn.onclick = callback;
  }

  onEscape(callback) {
    this.escapeBtn.onclick = callback;
  }
}
