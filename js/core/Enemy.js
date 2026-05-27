export class Enemy {
  constructor(type, isElite = false) {
    this.type = type;
    this.isElite = isElite;
    this.name  = type ? (isElite ? type.name + " (\u30a8\u30ea\u30fc\u30c8)" : type.name) : "Unknown";
    this.emoji   = type ? type.emoji   : "\u2753";
    this.iconUrl = type ? type.iconUrl : null;
    this.color = isElite ? "#FFD700" : (type ? type.color : "#fff");
    this.hp    = type ? (isElite ? type.baseHp * 2        : type.baseHp)              : 10;
    this.maxHp = this.hp;
    this.atk   = type ? (isElite ? Math.ceil(type.baseAtk * 1.5) : type.baseAtk)     : 3;
    this.exp   = type ? (isElite ? type.baseExp * 3       : type.baseExp)             : 5;
  }
}
