import { Enemy } from "./Enemy.js";
import { ENEMY_TYPES } from "./constants.js";

export class BattleSystem {
  constructor(player) {
    this.player = player;
    this.enemy = null;
  }

  start(cell) {
    const danger = cell.danger;
    const enemyType = cell.enemyType || this.selectEnemyType(danger);
    this.enemy = new Enemy(enemyType, danger);
    return this.enemy;
  }

  selectEnemyType(danger) {
    const types = Object.values(ENEMY_TYPES);
    const validTypes = types.filter(type => 
      danger >= type.dangerRange[0] && danger <= type.dangerRange[1]
    );
    
    console.log('danger:', danger, 'validTypes:', validTypes);
    
    if (validTypes.length === 0) {
      console.log('No valid types, returning SLIME');
      return ENEMY_TYPES.SLIME;
    }
    
    const randomIndex = Math.floor(Math.random() * validTypes.length);
    const selected = validTypes[randomIndex];
    console.log('Selected enemy type:', selected);
    return selected;
  }

  attack() {
    this.enemy.hp -= this.player.atk + (this.player.bonusAtk || 0);
    if (this.enemy.hp <= 0) {
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
