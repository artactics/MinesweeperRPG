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
    const hpBar = document.getElementById("field-hp-bar");
    const mpBar = document.getElementById("field-mp-bar");
    if (hpBar) hpBar.style.width = `${Math.min(100, Math.round(player.hp / player.maxHp * 100))}%`;
    if (mpBar) mpBar.style.width = `${Math.min(100, Math.round((player.mp ?? 0) / (player.maxMp || 1) * 100))}%`;
    const statusEl = document.getElementById("player-status");
    if (statusEl) {
      const badges = [];
      if (player.poison)   badges.push(`<span class="status-badge status-poison">毒</span>`);
      if (player.burn)     badges.push(`<span class="status-badge status-burn">火傷</span>`);
      if (player.freeze)   badges.push(`<span class="status-badge status-freeze">凍傷</span>`);
      if (player.fortune)  badges.push(`<span class="status-badge status-fortune">金運</span>`);
      if (player.treasure) badges.push(`<span class="status-badge status-treasure">宝運</span>`);
      statusEl.innerHTML = badges.join(" ");
    }
  }
}
