import { GAME_CONFIG } from "./constants.js";

export class Player {
  constructor() {
    this.level = 1;
    this.maxHp = GAME_CONFIG.PLAYER_INITIAL_HP;
    this.hp = GAME_CONFIG.PLAYER_INITIAL_HP;
    this.atk = GAME_CONFIG.PLAYER_INITIAL_ATK;
    this.exp = 0;
  }

  gainExp(amount) {
    this.exp += amount;
    this.checkLevelUp();
  }

  checkLevelUp() {
    const need = this.level * GAME_CONFIG.EXP_PER_LEVEL;
    while (this.exp >= need) {
      this.exp -= need;
      this.level++;
      this.maxHp += GAME_CONFIG.HP_GAIN_PER_LEVEL;
      this.atk += GAME_CONFIG.ATK_GAIN_PER_LEVEL;
      this.hp = this.maxHp;
    }
  }
}
