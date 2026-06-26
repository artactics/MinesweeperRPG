import { Grid } from "../core/Grid.js";
import { BattleSystem } from "../core/BattleSystem.js";
import { ITEM_TYPES, EQUIPMENT_TYPES, DUNGEON_CONFIG, levelItem } from "../core/constants.js";
import { DUNGEON_LAYER_CONFIG, LAYER_LABELS } from "../config/dungeonLayerConfig.js";

/**
 * ダンジョン攻略セッションの状態とライフサイクルを管理するクラス
 */
export class DungeonSession {

  /**
   * @param {object} options
   * @param {() => import("../core/Player.js").Player} options.getPlayer
   * @param {import("../ui/LogUI.js").LogUI} options.logUI
   * @param {import("../ui/GridRenderer.js").GridRenderer} options.gridRenderer
   * @param {(battle: import("../core/BattleSystem.js").BattleSystem) => void} options.onBattleCreated
   */
  constructor({ getPlayer, logUI, gridRenderer, onBattleCreated }) {
    this.getPlayer = getPlayer;
    this.logUI = logUI;
    this.gridRenderer = gridRenderer;
    this.onBattleCreated = onBattleCreated;

    this.currentDungeonLevel = 1;
    this.currentLayer = "surface";
    this.currentFloor = 1;
    this.totalFloors = 1;
    this.layerConfig = null;
    this.totalExpGained = 0;
    this.totalGoldGained = 0;
    this.entryPlayerLevel = 1;
    this.grid = null;
    this.flagMode = false;
    /** 今回のダンジョンで拾った装備（クリアまで仮所持） */
    this.dungeonEquipmentGained = [];
    /** 星評価トラッキング */
    this.usedSkillOrItem = false;
    this.encounteredEnemy = false;
    /** アイテム使用回数トラッキング（ダンジョン層ごとにリセット） */
    this.itemUsageCounts = {};
    /** 現フロアのグリッドに存在する最大danger値 */
    this.maxDangerLevel = 3;
  }

  markSkillOrItemUsed() { this.usedSkillOrItem = true; }
  markEnemyEncountered()  { this.encounteredEnemy  = true; }

  getItemUseCount(itemId)       { return this.itemUsageCounts[itemId] || 0; }
  recordItemUse(itemId)         { this.itemUsageCounts[itemId] = (this.itemUsageCounts[itemId] || 0) + 1; }
  canUseItem(itemId, limit = 5) { return this.getItemUseCount(itemId) < limit; }

  /**
   * ダンジョンに入場し盤面を生成
   * @param {number} level
   * @param {string} [layer] - "surface" | "middle" | "deep"
   * @returns {boolean} 入場成功なら true
   */
  enter(level, layer = "surface") {
    const config = DUNGEON_CONFIG[level];
    const layerConfig = DUNGEON_LAYER_CONFIG[level]?.[layer];
    if (!config || !layerConfig) return false;

    const player = this.getPlayer();
    if (player.level < config.minPlayerLevel) {
      this.logUI.add(`このダンジョンはLv${config.minPlayerLevel}以上で入場可能です`);
      return false;
    }
    if (player.level < layerConfig.minPlayerLevel) {
      this.logUI.add(`この層はLv${layerConfig.minPlayerLevel}以上で入場可能です`);
      return false;
    }

    this.discardDungeonEquipment();
    player.handItems = {};
    player.hp = player.maxHp;
    player.mp = player.maxMp;
    player.poison   = false;
    player.burn     = false;
    player.freeze   = false;
    player.fortune  = false;
    player.treasure = false;
    this.dungeonEquipmentGained = [];

    this.currentDungeonLevel = level;
    this.currentLayer = layer;
    this.currentFloor = 1;
    this.totalFloors = layerConfig.floorCount;
    this.layerConfig = layerConfig;
    this.totalExpGained = 0;
    this.totalGoldGained = 0;
    this.entryPlayerLevel = player.level;
    this.usedSkillOrItem = false;
    this.encounteredEnemy = false;
    this.itemUsageCounts = {};

    player.bonusAtk = 0;
    this.flagMode = false;

    this._generateFloor();

    const layerLabel = LAYER_LABELS[layer];
    this.logUI.clear();
    this.logUI.add(`${config.name} ${layerLabel} 1F に入場しました`);

    return true;
  }

  /**
   * 現在のフロアのグリッドを生成して盤面を更新する
   */
  _generateFloor() {
    const config = DUNGEON_CONFIG[this.currentDungeonLevel];
    const lc = this.layerConfig;

    this.grid = new Grid(
      lc.gridSize.rows,
      lc.gridSize.cols,
      lc.enemySpawn,
      lc.enemyTypes || config.enemyTypes,
      this.currentDungeonLevel,
      lc.specialBlocks || null
    );

    const battle = new BattleSystem(this.getPlayer());
    this.onBattleCreated(battle);

    const gridEl = document.getElementById("grid");
    gridEl.className = config.themeClass || "";

    const spawn = lc.enemySpawn || {};
    if ((spawn.master || 0) > 0)     this.maxDangerLevel = 3;
    else if ((spawn.elite || 0) > 0) this.maxDangerLevel = 2;
    else                             this.maxDangerLevel = 1;

    this.gridRenderer.grid = this.grid;
    this.gridRenderer.render();
  }

  /** ダンジョン内で拾った装備を破棄（撤退・ゲームオーバー時） */
  discardDungeonEquipment() {
    const player = this.getPlayer();
    for (const item of this.dungeonEquipmentGained || []) {
      for (const slot of ["weapon", "head", "body", "legs"]) {
        if (player.equipped[slot] && player.equipped[slot].id === item.id) {
          player._applyEquipmentStats(player.equipped[slot], -1);
          player.equipped[slot] = null;
        }
      }
      if (player.equipmentInventory[item.id]) {
        player.equipmentInventory[item.id].count--;
        if (player.equipmentInventory[item.id].count <= 0) {
          delete player.equipmentInventory[item.id];
        }
      }
    }
    this.dungeonEquipmentGained = [];
  }

  /**
   * 装備品をダンジョン内仮所持として記録
   * @param {object} item
   */
  trackEquipmentPickup(item) {
    const player = this.getPlayer();
    player.addEquipment(item);
    this.dungeonEquipmentGained.push(item);
  }

  /**
   * 全安全マス開示済みか判定し、フロアクリア処理を行う
   * @returns {{ status: 'advance'|'complete', ... }|null}
   *   null        : 未クリア
   *   advance     : フロアクリア・次フロアへ進む
   *   complete    : 全フロアクリア・結果画面用データ
   */
  tryClear() {
    if (!this.grid) return null;

    let totalSafeCells = 0;
    let revealedSafeCells = 0;

    for (let r = 0; r < this.grid.rows; r++) {
      for (let c = 0; c < this.grid.cols; c++) {
        const cell = this.grid.cells[r][c];
        if (!cell.isEnemy) {
          totalSafeCells++;
          if (cell.revealed) revealedSafeCells++;
        }
      }
    }

    if (revealedSafeCells !== totalSafeCells || totalSafeCells === 0) {
      return null;
    }

    const config = DUNGEON_CONFIG[this.currentDungeonLevel];
    const player = this.getPlayer();
    const lc = this.layerConfig;
    const layerLabel = LAYER_LABELS[this.currentLayer];

    if (this.currentFloor < this.totalFloors) {
      // まだフロアが残っている → 次フロアへ
      const nextFloor = this.currentFloor + 1;
      this.logUI.add(`${layerLabel} ${this.currentFloor}F クリア！ → ${nextFloor}F へ進む`);
      this.currentFloor = nextFloor;
      this._generateFloor();
      return { status: "advance", floor: this.currentFloor, totalFloors: this.totalFloors };
    }

    // 全フロアクリア → EXP・ゴールドを一括付与
    const goldAmt = player.fortune ? Math.floor(lc.gold * 1.25) : lc.gold;
    player.gainExp(lc.exp);
    this.totalExpGained += lc.exp;
    player.addGold(goldAmt);
    this.totalGoldGained += goldAmt;
    this.logUI.add(`${config.name} ${layerLabel} 全${this.totalFloors}F クリア！`);
    player.poison   = false;
    player.burn     = false;
    player.freeze   = false;
    player.fortune  = false;
    player.treasure = false;

    const { gainedItems, gainedEquipment } = this._rollDrops();
    this.dungeonEquipmentGained = [];
    this.grid = null;

    // 星評価（増加のみ、減少なし）
    let stars = 1;
    if (!this.usedSkillOrItem) stars = 2;
    if (!this.usedSkillOrItem && !this.encounteredEnemy) stars = 3;
    player.setLayerStars(this.currentDungeonLevel, this.currentLayer, stars);

    return {
      status: "complete",
      dungeonName: `${config.name}【${layerLabel}】`,
      expGained: this.totalExpGained,
      clearGold: this.totalGoldGained,
      prevLevel: this.entryPlayerLevel,
      newLevel: player.level,
      gainedItems,
      gainedEquipment
    };
  }

  /**
   * ダンジョンクリア時のドロップ抽選を行い、結果をプレイヤーに付与する
   * @returns {{ gainedItems: object, gainedEquipment: object[] }}
   */
  _rollDrops() {
    const drops = this.layerConfig.drops || [];
    const player = this.getPlayer();
    const gainedItems = {};
    const gainedEquipment = [];

    const dropMult = player.treasure ? 1.25 : 1;
    for (const drop of drops) {
      if (Math.random() > Math.min(1, drop.chance * dropMult)) continue;

      const base = drop.category === "equipment"
        ? EQUIPMENT_TYPES[drop.id]
        : ITEM_TYPES[drop.id];
      if (!base) continue;

      const item = drop.category === "equipment" ? base : levelItem(base, this.currentDungeonLevel);

      if (drop.category === "equipment") {
        player.addEquipment(item);
        gainedEquipment.push(item);
      } else {
        player.addToInventory(item);
        if (!gainedItems[item.id]) {
          gainedItems[item.id] = { ...item, count: 1 };
        } else {
          gainedItems[item.id].count++;
        }
      }
    }

    return { gainedItems, gainedEquipment };
  }

  /** 旗モードの ON/OFF を切り替え */
  toggleFlagMode() {
    this.flagMode = !this.flagMode;
    const btn = document.getElementById("flag-mode-btn");
    btn.classList.toggle("flag-mode-on", this.flagMode);
    btn.classList.toggle("flag-mode-off", !this.flagMode);
    btn.textContent = this.flagMode ? "旗モード ON" : "旗モード";
  }

  /** 撤退時：仮装備破棄・手持ちリセット・HP全回復・セッション終了 */
  abandon() {
    this.discardDungeonEquipment();
    this.itemUsageCounts = {};
    const player = this.getPlayer();
    player.handItems  = {};
    player.hp         = player.maxHp;
    player.fortune    = false;
    player.treasure   = false;
    this.grid = null;
    this.flagMode = false;
    this.currentFloor = 1;
    this.totalFloors = 1;
    this.totalExpGained = 0;
    this.totalGoldGained = 0;
  }
}
