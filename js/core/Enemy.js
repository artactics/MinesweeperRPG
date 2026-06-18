export class Enemy {
  constructor(type, isElite = false, isMaster = false) {
    this.type = type;
    this.isElite  = isElite;
    this.isMaster = isMaster;
    this.name = type
      ? (isMaster ? type.name + "\uff08\u30de\u30b9\u30bf\u30fc\uff09" : isElite ? type.name + "\uff08\u30a8\u30ea\u30fc\u30c8\uff09" : type.name)
      : "Unknown";
    this.iconUrl   = type ? type.iconUrl : null;
    this.iconColor = type ? type.color : "#fff";
    this.color     = isMaster ? "#9c27b0" : isElite ? "#FFD700" : (type ? type.color : "#fff");
    this.hp    = type ? (isMaster ? type.baseHp * 3  : isElite ? type.baseHp * 2        : type.baseHp)              : 10;
    this.maxHp = this.hp;
    this.atk   = type ? (isMaster ? type.baseAtk * 2 : isElite ? Math.ceil(type.baseAtk * 1.5) : type.baseAtk)     : 3;
    this.exp   = type ? (isMaster ? type.baseExp * 5 : isElite ? type.baseExp * 3       : type.baseExp)             : 5;
    this.chargeActive = false;
    this.breathActive = null;
    this.poison = false;
    this.burn = false;
    this.freeze = false;
  }
}
