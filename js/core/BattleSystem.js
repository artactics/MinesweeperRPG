export class BattleSystem {
  constructor(player) {
    this.player = player;
    this.enemy = null;
  }

  start(cell) {
    const base = Math.max(1, cell.danger);
    this.enemy = {
      hp: 10 + base * 4,
      atk: 3 + base * 2,
      exp: 5 + base * 3
    };
    return this.enemy;
  }

  attack() {
    this.enemy.hp -= this.player.atk;
    if (this.enemy.hp <= 0) {
      this.player.gainExp(this.enemy.exp);
      return "victory";
    }

    this.player.hp -= this.enemy.atk;
    if (this.player.hp <= 0) {
      this.player.hp = 0;
      return "defeat";
    }

    return "continue";
  }
}
