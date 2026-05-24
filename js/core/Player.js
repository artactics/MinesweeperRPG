export class Player {
  constructor() {
    this.level = 1;
    this.maxHp = 30;
    this.hp = 30;
    this.atk = 6;
    this.exp = 0;
  }

  gainExp(amount) {
    this.exp += amount;
    this.checkLevelUp();
  }

  checkLevelUp() {
    const need = this.level * 10;
    while (this.exp >= need) {
      this.exp -= need;
      this.level++;
      this.maxHp += 10;
      this.atk += 2;
      this.hp = this.maxHp;
    }
  }
}
