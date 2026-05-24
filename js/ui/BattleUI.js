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
