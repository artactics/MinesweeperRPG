export class BattleUI {
  constructor() {
    this.modal = document.getElementById("battle-modal");
    this.text = document.getElementById("battle-text");
    this.attackBtn = document.getElementById("attack-btn");
    this.escapeBtn = document.getElementById("escape-btn");
  }

  show(enemy, player) {
    this.modal.style.display = "flex";
    this.update(enemy, player);
  }

  update(enemy, player) {
    this.text.innerHTML =
      `<span style="font-size: 32px;">${enemy.emoji}</span><br>` +
      `<strong style="color: ${enemy.color}">${enemy.name}</strong><br>` +
      `敵HP: ${enemy.hp}<br>` +
      `あなたのHP: ${player.hp}`;
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
