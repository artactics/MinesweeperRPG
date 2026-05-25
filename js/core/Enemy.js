export class Enemy {
  constructor(type, danger) {
    console.log('Enemy constructor - type:', type, 'danger:', danger);
    this.type = type;
    this.name = type ? type.name : 'Unknown';
    this.emoji = type ? type.emoji : '❓';
    this.color = type ? type.color : '#fff';
    this.danger = danger;
    this.hp = type ? type.baseHp + danger * 3 : 10;
    this.maxHp = this.hp;
    this.atk = type ? type.baseAtk + danger * 2 : 3;
    this.exp = type ? type.baseExp + danger * 2 : 5;
  }
}
