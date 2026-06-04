import { Enemy } from "./Enemy.js";
import { ENEMY_TYPES } from "./constants.js";
import { BattleGrid } from "./BattleGrid.js";

export class BattleSystem {
  constructor(player) {
    this.player = player;
    this.enemy = null;
  }

  start(cell) {
    const isElite = cell.isElite || false;
    const enemyType = cell.enemyType || ENEMY_TYPES.SLIME;
    this.enemy = new Enemy(enemyType, isElite);
    this.battleGrid = new BattleGrid(isElite ? 3 : 2);
    return this.enemy;
  }

  attack(row, col, skill = null) {
    const { cell, gridReset } = this.battleGrid.reveal(row, col);
    if (!cell) return null;

    const isMine = cell.isMine;
    let playerDmg = isMine ? 0 : (this.player.atk + (this.player.bonusAtk || 0));
    let skillConsumed = false;

    if (!isMine) {
      if (this.player.focusActive) {
        playerDmg *= 3;
        this.player.focusActive = false;
      }
      if (skill) {
        if (skill.id === "double_strike") {
          playerDmg *= 2;
          skillConsumed = true;
        } else if (skill.id === "focus") {
          this.player.focusActive = true;
          playerDmg = 0;
          skillConsumed = true;
        } else if (skill.id === "heal") {
          this.player.hp = Math.min(this.player.hp + 10, this.player.maxHp);
          skillConsumed = true;
        }
      }
      this.enemy.hp -= playerDmg;
    }

    if (this.enemy.hp <= 0) {
      this.enemy.hp = 0;
      return { result: "victory", playerDmg, enemyDmg: 0, isMine, gridReset, skillConsumed };
    }

    const enemyDmg = this.enemy.atk;
    this.player.hp -= enemyDmg;
    if (this.player.hp <= 0) {
      this.player.hp = 0;
      return { result: "defeat", playerDmg, enemyDmg, isMine, gridReset, skillConsumed };
    }

    return { result: "continue", playerDmg, enemyDmg, isMine, gridReset, skillConsumed };
  }
}
