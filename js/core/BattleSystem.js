import { Enemy } from "./Enemy.js";
import { ENEMY_TYPES } from "./constants.js";
import { BattleGrid } from "./BattleGrid.js";

export class BattleSystem {
  constructor(player) {
    this.player = player;
    this.enemy = null;
  }

  start(cell) {
    const isElite  = cell.isElite  || false;
    const isMaster = cell.isMaster || false;
    const enemyType = cell.enemyType || ENEMY_TYPES.SLIME;
    this.enemy = new Enemy(enemyType, isElite, isMaster);
    this.battleGrid = new BattleGrid(isMaster ? 4 : isElite ? 3 : 2);
    return this.enemy;
  }

  attack(row, col, skill = null) {
    const { cell, gridReset } = this.battleGrid.reveal(row, col);
    if (!cell) return null;

    const isMine = cell.isMine;
    let playerDmg = isMine ? 0 : (this.player.atk + (this.player.bonusAtk || 0));
    let skillConsumed = false;
    let playerHeal = 0;
    let enemyStatusInflicted = null;

    if (!isMine) {
      if (this.player.focusActive) {
        playerDmg *= 3;
        this.player.focusActive = false;
      }
      if (skill) {
        switch (skill.id) {
          case "double_strike": playerDmg *= 2; skillConsumed = true; break;
          case "focus":         this.player.focusActive = true; playerDmg = 0; skillConsumed = true; break;
          case "heal":          this.player.hp = Math.min(this.player.hp + 10, this.player.maxHp); playerDmg = 0; skillConsumed = true; break;
          case "drain":         playerHeal = Math.floor(playerDmg * 0.5); this.player.hp = Math.min(this.player.hp + playerHeal, this.player.maxHp); skillConsumed = true; break;
          case "guard":         this.player.guardActive = true; playerDmg = 0; skillConsumed = true; break;
          case "poison_mark":   this.enemy.poison  = true; playerDmg = 0; enemyStatusInflicted = "poison"; skillConsumed = true; break;
          case "fire_mark":     this.enemy.burn    = true; playerDmg = 0; enemyStatusInflicted = "burn";   skillConsumed = true; break;
          case "ice_mark":      this.enemy.freeze  = true; playerDmg = 0; enemyStatusInflicted = "freeze"; skillConsumed = true; break;
          case "cure_poison":   this.player.poison  = false; playerDmg = 0; skillConsumed = true; break;
          case "cure_burn":     this.player.burn    = false; playerDmg = 0; skillConsumed = true; break;
          case "cure_freeze":   this.player.freeze  = false; playerDmg = 0; skillConsumed = true; break;
        }
      }
      if (this.player.freeze) playerDmg = Math.floor(playerDmg * 0.75);
      this.enemy.hp -= playerDmg;
    }

    const enemyStatusTick = this._applyStatusTick(this.enemy);

    if (this.enemy.hp <= 0) {
      this.enemy.hp = 0;
      this.player.guardActive = false;
      return { result: "victory", playerDmg, playerHeal, enemyDmg: 0, enemySkillId: null, enemyHeal: 0,
               isMine, gridReset, skillConsumed, enemyStatusInflicted, playerStatusInflicted: null,
               enemyStatusTick, playerStatusTick: null };
    }

    let enemyDmg = this.enemy.atk;
    let enemyHeal = 0;
    let enemySkillId = null;
    let playerStatusInflicted = null;

    if (this.enemy.breathActive) {
      const bt = this.enemy.breathActive;
      enemyDmg = Math.ceil(this.enemy.atk * 2);
      if (bt === "fire")   { this.player.burn   = true; playerStatusInflicted = "burn"; }
      if (bt === "poison") { this.player.poison = true; playerStatusInflicted = "poison"; }
      if (bt === "ice")    { this.player.freeze = true; playerStatusInflicted = "freeze"; }
      this.enemy.breathActive = null;
      enemySkillId = bt === "fire" ? "flame_breath_release" : bt === "poison" ? "poison_breath_release" : "ice_breath_release";
    } else if (this.enemy.chargeActive) {
      enemyDmg = Math.ceil(this.enemy.atk * 3);
      this.enemy.chargeActive = false;
      enemySkillId = "charge_release";
    } else {
      enemySkillId = this._resolveEnemySkill();
      switch (enemySkillId) {
        case "power_attack":  enemyDmg = Math.ceil(this.enemy.atk * 2); break;
        case "heal":          enemyHeal = Math.ceil(this.enemy.maxHp * 0.25); this.enemy.hp = Math.min(this.enemy.hp + enemyHeal, this.enemy.maxHp); enemyDmg = 0; break;
        case "regen":         enemyHeal = 5; this.enemy.hp = Math.min(this.enemy.hp + enemyHeal, this.enemy.maxHp); break;
        case "charge":        this.enemy.chargeActive = true; enemyDmg = 0; break;
        case "drain":         enemyHeal = Math.floor(this.enemy.atk * 0.5); this.enemy.hp = Math.min(this.enemy.hp + enemyHeal, this.enemy.maxHp); break;
        case "poison_mark":   this.player.poison  = true; playerStatusInflicted = "poison"; enemyDmg = 0; break;
        case "fire_mark":     this.player.burn    = true; playerStatusInflicted = "burn";   enemyDmg = 0; break;
        case "ice_mark":      this.player.freeze  = true; playerStatusInflicted = "freeze"; enemyDmg = 0; break;
        case "flame_breath":  this.enemy.breathActive = "fire";   enemyDmg = 0; break;
        case "poison_breath": this.enemy.breathActive = "poison"; enemyDmg = 0; break;
        case "ice_breath":    this.enemy.breathActive = "ice";    enemyDmg = 0; break;
      }
    }

    if (this.enemy.freeze) enemyDmg = Math.floor(enemyDmg * 0.75);
    if (this.player.guardActive) {
      enemyDmg = Math.floor(enemyDmg * 0.5);
      this.player.guardActive = false;
    }

    this.player.hp -= enemyDmg;
    const playerStatusTick = this._applyStatusTick(this.player);

    if (this.player.hp <= 0) {
      this.player.hp = 0;
      return { result: "defeat", playerDmg, playerHeal, enemyDmg, enemySkillId, enemyHeal,
               isMine, gridReset, skillConsumed, enemyStatusInflicted, playerStatusInflicted,
               enemyStatusTick, playerStatusTick };
    }

    return { result: "continue", playerDmg, playerHeal, enemyDmg, enemySkillId, enemyHeal,
             isMine, gridReset, skillConsumed, enemyStatusInflicted, playerStatusInflicted,
             enemyStatusTick, playerStatusTick };
  }

  _applyStatusTick(entity) {
    if (!entity.poison && !entity.burn) return null;
    const ticks = {};
    if (entity.poison) {
      const dmg = Math.max(1, Math.floor(entity.maxHp * 0.03));
      entity.hp = Math.max(0, entity.hp - dmg);
      ticks.poison = dmg;
    }
    if (entity.burn) {
      const dmg = Math.max(1, Math.floor(entity.hp * 0.05));
      entity.hp = Math.max(0, entity.hp - dmg);
      ticks.burn = dmg;
    }
    return ticks;
  }

  _resolveEnemySkill() {
    const skills = this.enemy.type?.skills;
    if (!skills || skills.length === 0) return null;
    for (const s of skills) {
      if (Math.random() < s.chance) return s.id;
    }
    return null;
  }
}
