export class LogUI {
  constructor() {
    this.el = document.getElementById("log");
    this.playerLevelEl = document.getElementById("player-level");
    this.playerHpEl = document.getElementById("player-hp");
    this.playerMaxHpEl = document.getElementById("player-max-hp");
    this.playerAtkEl = document.getElementById("player-atk");
    this.playerExpEl = document.getElementById("player-exp");
    this.playerMpEl = document.getElementById("player-mp");
    this.playerMaxMpEl = document.getElementById("player-max-mp");
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
    const bonus = player.bonusAtk || 0;
    this.playerAtkEl.textContent = bonus > 0 ? `${player.atk + bonus}(+${bonus})` : player.atk;
    this.playerExpEl.textContent = player.exp;
    if (this.playerMpEl)    this.playerMpEl.textContent    = player.mp    ?? "?";
    if (this.playerMaxMpEl) this.playerMaxMpEl.textContent = player.maxMp ?? "?";
  }
}
