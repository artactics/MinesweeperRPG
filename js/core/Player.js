import { GAME_CONFIG, EQUIPMENT_TYPES } from "./constants.js";

export class Player {
  constructor(savedData = null) {
    if (savedData) {
      this.level = savedData.level || 1;
      this.maxHp = savedData.maxHp || GAME_CONFIG.PLAYER_INITIAL_HP;
      this.hp = savedData.hp || GAME_CONFIG.PLAYER_INITIAL_HP;
      this.atk = savedData.atk || GAME_CONFIG.PLAYER_INITIAL_ATK;
      this.exp = savedData.exp || 0;
      
      // 古いデータ形式（配列）から新しい形式（オブジェクト）に変換
      if (Array.isArray(savedData.items)) {
        this.inventory = {};
        for (const item of savedData.items) {
          if (!this.inventory[item.id]) {
            this.inventory[item.id] = { ...item, count: 1 };
          } else {
            this.inventory[item.id].count++;
          }
        }
      } else {
        this.inventory = savedData.inventory || {};
      }
      
      this.handItems = {};
      this.gold = savedData.gold || 0;
      this.bonusAtk = 0;
      const se = savedData.equipped || {};
      this.equipped = {
        weapon: se.weapon || null,
        head:   se.head   || null,
        body:   se.body   || se.armor || null,
        legs:   se.legs   || null
      };
      this.equipmentInventory = savedData.equipmentInventory || {};
    } else {
      this.level = 1;
      this.maxHp = GAME_CONFIG.PLAYER_INITIAL_HP;
      this.hp = GAME_CONFIG.PLAYER_INITIAL_HP;
      this.atk = GAME_CONFIG.PLAYER_INITIAL_ATK;
      this.exp = 0;
      this.inventory = {};
      this.handItems = {};
      this.equipped = { weapon: null, head: null, body: null, legs: null };
      this.equipmentInventory = {};
      this.gold = 0;
      this.bonusAtk = 0;
    }
  }

  addGold(amount) {
    this.gold += amount;
  }

  spendGold(amount) {
    if (this.gold < amount) return false;
    this.gold -= amount;
    return true;
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

  addItem(item) {
    // 手持ちに追加
    if (!this.handItems[item.id]) {
      this.handItems[item.id] = { ...item, count: 1 };
    } else {
      this.handItems[item.id].count++;
    }
  }

  removeItem(itemId, fromHand = true) {
    const items = fromHand ? this.handItems : this.inventory;
    if (items[itemId]) {
      items[itemId].count--;
      if (items[itemId].count <= 0) {
        delete items[itemId];
      }
    }
  }

  hasItem(itemId) {
    return (this.inventory[itemId] && this.inventory[itemId].count > 0) ||
           (this.handItems[itemId] && this.handItems[itemId].count > 0);
  }

  moveToInventory(itemId) {
    if (this.handItems[itemId]) {
      if (!this.inventory[itemId]) {
        this.inventory[itemId] = { ...this.handItems[itemId] };
      } else {
        this.inventory[itemId].count += this.handItems[itemId].count;
      }
      delete this.handItems[itemId];
    }
  }

  moveToHand(itemId) {
    if (this.inventory[itemId]) {
      if (!this.handItems[itemId]) {
        this.handItems[itemId] = { ...this.inventory[itemId] };
      } else {
        this.handItems[itemId].count += this.inventory[itemId].count;
      }
      delete this.inventory[itemId];
    }
  }

  addToInventory(item) {
    if (!this.inventory[item.id]) {
      this.inventory[item.id] = { ...item, count: 1 };
    } else {
      this.inventory[item.id].count++;
    }
  }

  addEquipment(item) {
    if (!this.equipmentInventory[item.id]) {
      this.equipmentInventory[item.id] = { ...item, count: 1 };
    } else {
      this.equipmentInventory[item.id].count++;
    }
  }

  _applyEquipmentStats(itemId, multiplier) {
    const def = Object.values(EQUIPMENT_TYPES).find(e => e.id === itemId);
    if (!def) return;
    if (def.atk)   this.atk   += def.atk   * multiplier;
    if (def.maxHp) {
      this.maxHp += def.maxHp * multiplier;
      if (multiplier > 0) {
        this.hp += def.maxHp;
      } else {
        this.hp = Math.min(this.hp, this.maxHp);
      }
    }
  }

  equipItem(itemId) {
    const def = Object.values(EQUIPMENT_TYPES).find(e => e.id === itemId);
    if (!def) return;
    const slot = def.slot;
    if (this.equipped[slot]) {
      this._applyEquipmentStats(this.equipped[slot], -1);
      const prevDef = Object.values(EQUIPMENT_TYPES).find(e => e.id === this.equipped[slot]);
      if (prevDef) {
        if (!this.equipmentInventory[prevDef.id]) {
          this.equipmentInventory[prevDef.id] = { ...prevDef, count: 1 };
        } else {
          this.equipmentInventory[prevDef.id].count++;
        }
      }
    }
    this._applyEquipmentStats(itemId, 1);
    this.equipped[slot] = itemId;
    if (this.equipmentInventory[itemId]) {
      this.equipmentInventory[itemId].count--;
      if (this.equipmentInventory[itemId].count <= 0) delete this.equipmentInventory[itemId];
    }
  }

  unequipItem(slot) {
    const itemId = this.equipped[slot];
    if (!itemId) return;
    this._applyEquipmentStats(itemId, -1);
    const def = Object.values(EQUIPMENT_TYPES).find(e => e.id === itemId);
    if (def) {
      if (!this.equipmentInventory[itemId]) {
        this.equipmentInventory[itemId] = { ...def, count: 1 };
      } else {
        this.equipmentInventory[itemId].count++;
      }
    }
    this.equipped[slot] = null;
  }

  toJSON() {
    return {
      level: this.level,
      maxHp: this.maxHp,
      hp: this.hp,
      atk: this.atk,
      exp: this.exp,
      gold: this.gold,
      inventory: this.inventory,
      equipped: this.equipped,
      equipmentInventory: this.equipmentInventory
    };
  }
}
