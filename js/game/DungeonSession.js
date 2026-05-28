import { Grid } from "../core/Grid.js";
import { BattleSystem } from "../core/BattleSystem.js";
import { ITEM_TYPES, EQUIPMENT_TYPES, DUNGEON_CONFIG } from "../core/constants.js";

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
    this.grid = null;
    this.flagMode = false;
    /** 今回のダンジョンで拾った装備（クリアまで仮所持） */
    this.dungeonEquipmentGained = [];
  }

  /**
   * ダンジョンに入場し盤面を生成
   * @param {number} level
   * @returns {boolean} 入場成功なら true
   */
  enter(level) {
    const config = DUNGEON_CONFIG[level];
    if (!config) return false;

    const player = this.getPlayer();
    if (player.level < config.minPlayerLevel) {
      this.logUI.add(`このダンジョンはLv${config.minPlayerLevel}以上で入場可能です`);
      return false;
    }

    this.discardDungeonEquipment();
    player.handItems = {};
    this.dungeonEquipmentGained = [];
    this.currentDungeonLevel = level;

    const itemPool = [
      ...Object.values(ITEM_TYPES),
      ...Object.values(EQUIPMENT_TYPES).filter(e => e.minDungeon <= level)
    ];

    this.grid = new Grid(
      config.gridSize.rows,
      config.gridSize.cols,
      config.enemyCount,
      config.enemyTypes,
      config.itemChance,
      itemPool,
      level
    );

    player.bonusAtk = 0;
    this.flagMode = false;

    const battle = new BattleSystem(player);
    this.onBattleCreated(battle);

    const gridEl = document.getElementById("grid");
    gridEl.className = config.themeClass || "";

    this.gridRenderer.grid = this.grid;
    this.gridRenderer.render();

    this.logUI.clear();
    this.logUI.add(`${config.emoji} ${config.name}に入場しました`);

    return true;
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
   * 全安全マス開示済みか判定し、クリア処理を行う
   * @returns {object|null} クリア時は結果画面用データ、未クリアは null
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
    const prevLevel = player.level;

    player.gainExp(config.clearExp);
    player.addGold(config.clearGold || 0);
    player.hp = player.maxHp;

    // グリッド上の未取得アイテムを自動回収
    for (let r = 0; r < this.grid.rows; r++) {
      for (let c = 0; c < this.grid.cols; c++) {
        const cell = this.grid.cells[r][c];
        if (cell.item) {
          if (cell.item.category === "equipment") {
            this.trackEquipmentPickup(cell.item);
          } else {
            player.addItem(cell.item);
          }
          cell.item = null;
        }
      }
    }

    const gainedItems = { ...player.handItems };
    for (const itemId of Object.keys(player.handItems)) {
      player.moveToInventory(itemId);
    }

    const gainedEquipment = [...this.dungeonEquipmentGained];
    this.dungeonEquipmentGained = [];

    return {
      dungeonName: config.name,
      expGained: config.clearExp,
      clearGold: config.clearGold || 0,
      prevLevel,
      newLevel: player.level,
      gainedItems,
      gainedEquipment
    };
  }

  /** 旗モードの ON/OFF を切り替え */
  toggleFlagMode() {
    this.flagMode = !this.flagMode;
    const btn = document.getElementById("flag-mode-btn");
    btn.classList.toggle("flag-mode-on", this.flagMode);
    btn.classList.toggle("flag-mode-off", !this.flagMode);
    btn.textContent = this.flagMode ? "⚑ 旗モード ON" : "⚑ 旗モード";
  }

  /** 撤退時：仮装備破棄と手持ちリセット */
  abandon() {
    this.discardDungeonEquipment();
    this.getPlayer().handItems = {};
  }
}
