export class LogUI {
  constructor() {
    this.el = document.getElementById("log");
    this.playerLevelEl = document.getElementById("player-level");
    this.playerHpEl = document.getElementById("player-hp");
    this.playerMaxHpEl = document.getElementById("player-max-hp");
    this.playerAtkEl = document.getElementById("player-atk");
    this.playerExpEl = document.getElementById("player-exp");
  }

  add(message) {
    this.el.textContent += message + "\n";
    this.el.scrollTop = this.el.scrollHeight;
  }

  clear() {
    this.el.textContent = "";
  }

  updatePlayer(player) {
    this.playerLevelEl.textContent = player.level;
    this.playerHpEl.textContent = player.hp;
    this.playerMaxHpEl.textContent = player.maxHp;
    this.playerAtkEl.textContent = player.atk;
    this.playerExpEl.textContent = player.exp;
  }
}
