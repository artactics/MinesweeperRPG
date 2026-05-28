import { GAME_CONFIG, ITEM_TYPES, EQUIPMENT_TYPES } from "./constants.js";

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
        this.inventory = this._rehydrateStash(savedData.inventory || {});
      }

      this.handItems = {};
      this.gold = savedData.gold || 0;
      this.bonusAtk = 0;
      const se = savedData.equipped || {};
      this.equipped = {
        weapon: this._restoreEquipped(se.weapon),
        head:   this._restoreEquipped(se.head),
        body:   this._restoreEquipped(se.body || se.armor),
        legs:   this._restoreEquipped(se.legs)
      };
      this.equipmentInventory = this._rehydrateStash(savedData.equipmentInventory || {});
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

  _restoreEquipped(val) {
    if (!val) return null;
    const id = typeof val === "string" ? val : val.id;
    return Object.values(EQUIPMENT_TYPES).find(e => e.id === id) || null;
  }

  /** セーブデータのアイテムに iconUrl / iconColor を最新定義で補完 */
  _rehydrateStash(stash) {
    const catalog = [...Object.values(ITEM_TYPES), ...Object.values(EQUIPMENT_TYPES)];
    const result = {};
    for (const [id, stored] of Object.entries(stash)) {
      const def = catalog.find(entry => entry.id === id);
      result[id] = def ? { ...def, count: stored.count } : stored;
    }
    return result;
  }

  _applyEquipmentStats(item, multiplier) {
    if (!item) return;
    if (item.atk)   this.atk   += item.atk   * multiplier;
    if (item.maxHp) {
      this.maxHp += item.maxHp * multiplier;
      if (multiplier > 0) this.hp += item.maxHp;
      else this.hp = Math.min(this.hp, this.maxHp);
    }
  }

  equipItem(itemId) {
    const item = this.equipmentInventory[itemId];
    if (!item) return;
    const slot = item.slot;
    if (this.equipped[slot]) {
      const old = this.equipped[slot];
      this._applyEquipmentStats(old, -1);
      if (!this.equipmentInventory[old.id]) this.equipmentInventory[old.id] = { ...old, count: 1 };
      else this.equipmentInventory[old.id].count++;
    }
    this._applyEquipmentStats(item, 1);
    this.equipped[slot] = { ...item };
    this.equipmentInventory[itemId].count--;
    if (this.equipmentInventory[itemId].count <= 0) delete this.equipmentInventory[itemId];
  }

  unequipItem(slot) {
    const item = this.equipped[slot];
    if (!item) return;
    this._applyEquipmentStats(item, -1);
    if (!this.equipmentInventory[item.id]) this.equipmentInventory[item.id] = { ...item, count: 1 };
    else this.equipmentInventory[item.id].count++;
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
