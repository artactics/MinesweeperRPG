import { DIRECTIONS } from "../core/constants.js";
import { SKILL_CONFIG } from "../config/skillConfig.js";

/**
 * フィールド上の敵マスと BattleUI / BattleSystem の連携を担当するクラス
 */
export class BattleCoordinator {

  /**
   * @param {object} options
   * @param {() => import("../core/BattleSystem.js").BattleSystem} options.getBattle
   * @param {() => import("../core/Player.js").Player} options.getPlayer
   * @param {() => import("./DungeonSession.js").DungeonSession} options.getSession
   * @param {import("../ui/BattleUI.js").BattleUI} options.battleUI
   * @param {import("../ui/LogUI.js").LogUI} options.logUI
   * @param {import("../ui/GridRenderer.js").GridRenderer} options.gridRenderer
   * @param {() => void} options.onUpdateUI
   * @param {() => Promise<void>} options.onSave
   * @param {() => void} options.onMonsterListUpdate
   * @param {() => boolean} options.onCheckClear
   * @param {() => void} options.onGameOver
   */
  constructor({
    getBattle,
    getPlayer,
    getSession,
    battleUI,
    logUI,
    gridRenderer,
    onUpdateUI,
    onSave,
    onMonsterListUpdate,
    onCheckClear,
    onGameOver
  }) {
    this.getBattle = getBattle;
    this.getPlayer = getPlayer;
    this.getSession = getSession;
    this.battleUI = battleUI;
    this.logUI = logUI;
    this.gridRenderer = gridRenderer;
    this.onUpdateUI = onUpdateUI;
    this.onSave = onSave;
    this.onMonsterListUpdate = onMonsterListUpdate;
    this.onCheckClear = onCheckClear;
    this.onGameOver = onGameOver;
  }

  _getBattleSkills(player) {
    return player.activeSkills
      .map(key => SKILL_CONFIG[key])
      .filter(s => s && (s.usableIn === "battle" || s.usableIn === "both"));
  }

  /**
   * 敵マスで戦闘を開始
   * @param {object} cell - 敵がいるマス
   */
  startBattle(cell) {
    const battle = this.getBattle();
    const player = this.getPlayer();
    const session = this.getSession();
    const grid = session.grid;

    const enemy = battle.start(cell);
    this.logUI.add(`${enemy.name}が現れた！`);
    this.battleUI.show(enemy, player, battle.battleGrid);

    const battleSkills = this._getBattleSkills(player);
    this.battleUI.renderSkills(battleSkills, player);

    const delay = (ms) => new Promise(r => setTimeout(r, ms));

    const handler = async (row, col) => {
      this.battleUI.onAttack(null);

      const pendingSkill = this.battleUI.selectedSkill;
      if (pendingSkill && player.mp < pendingSkill.mpCost) {
        this.battleUI.addLog("MPが足りない！", "damage");
        this.battleUI.clearSkillSelection();
        this.battleUI.renderSkills(battleSkills, player);
        this.battleUI.onAttack(handler);
        return;
      }

      const attackResult = battle.attack(row, col, pendingSkill);
      if (!attackResult) { this.battleUI.onAttack(handler); return; }

      const { result, playerDmg, playerHeal, enemyDmg, enemySkillId, enemyHeal,
              isMine, gridReset, skillConsumed,
              enemyStatusInflicted, playerStatusInflicted,
              enemyStatusTick, playerStatusTick } = attackResult;

      if (skillConsumed && pendingSkill) {
        this.getSession().markSkillOrItemUsed();
        player.spendMp(pendingSkill.mpCost);
        switch (pendingSkill.id) {
          case "heal":         this.battleUI.addLog("回復スキル発動！HP+10", "heal"); break;
          case "double_strike": this.battleUI.addLog("連撃発動！", "attack"); break;
          case "focus":        this.battleUI.addLog("集中！このターンは攻撃せず、次の攻撃が3倍になる", "heal"); break;
          case "drain":        this.battleUI.addLog(`ドレイン！${playerHeal}HP吸収！`, "heal"); break;
          case "guard":        this.battleUI.addLog("ガード！このターン被ダメージ50%カット！", "normal"); break;
          case "poison_mark":  this.battleUI.addLog(`${enemy.name}に毒を付与！`, "normal"); break;
          case "fire_mark":    this.battleUI.addLog(`${enemy.name}に火傷を付与！`, "normal"); break;
          case "ice_mark":     this.battleUI.addLog(`${enemy.name}に凍傷を付与！`, "normal"); break;
          case "cure_poison":  this.battleUI.addLog("毒を解除した！", "heal"); break;
          case "cure_burn":    this.battleUI.addLog("火傷を解除した！", "heal"); break;
          case "cure_freeze":  this.battleUI.addLog("凍傷を解除した！", "heal"); break;
        }
        this.battleUI.clearSkillSelection();
      } else if (pendingSkill && isMine) {
        this.battleUI.addLog("地雷によりスキルは発動されなかった", "normal");
      }

      if (enemyStatusInflicted === "poison") this.battleUI.addLog(`${enemy.name}は毒状態になった！`, "normal");
      if (enemyStatusInflicted === "burn")   this.battleUI.addLog(`${enemy.name}は火傷状態になった！`, "normal");
      if (enemyStatusInflicted === "freeze") this.battleUI.addLog(`${enemy.name}は凍傷状態になった！`, "normal");

      if (isMine) {
        this.battleUI.addLog("地雷！攻撃失敗…", "damage");
      } else if (playerDmg > 0) {
        this.battleUI.addLog(`${enemy.name}に ${playerDmg} ダメージ！`, "attack");
      }
      if (gridReset) this.battleUI.addLog("新しいグリッドが出現！", "normal");

      if (enemyStatusTick?.poison) this.battleUI.addLog(`毒！${enemy.name}に ${enemyStatusTick.poison} ダメージ！`, "attack");
      if (enemyStatusTick?.burn)   this.battleUI.addLog(`火傷！${enemy.name}に ${enemyStatusTick.burn} ダメージ！`, "attack");

      this.battleUI.update(enemy, player);
      if (!isMine && playerDmg > 0) {
        this.battleUI.hitFlash();
        this.battleUI.showDamageFloat(playerDmg);
      }
      this.battleUI.renderGrid(battle.battleGrid);
      this.battleUI.renderSkills(battleSkills, player);
      this.onUpdateUI();

      await delay(300);

      if      (enemySkillId === "power_attack")             this.battleUI.addLog(`${enemy.name}は強打を使った！`, "damage");
      else if (enemySkillId === "heal")                     this.battleUI.addLog(`${enemy.name}は回復した！(+${enemyHeal}HP)`, "normal");
      else if (enemySkillId === "regen")                    this.battleUI.addLog(`${enemy.name}は再生した！(+${enemyHeal}HP)`, "normal");
      else if (enemySkillId === "charge")                   this.battleUI.addLog(`${enemy.name}は力を溜めている…`, "normal");
      else if (enemySkillId === "charge_release")           this.battleUI.addLog(`${enemy.name}の渾身の一撃！`, "damage");
      else if (enemySkillId === "drain")                    this.battleUI.addLog(`${enemy.name}はドレイン！(+${enemyHeal}HP吸収)`, "normal");
      else if (enemySkillId === "poison_mark")              this.battleUI.addLog(`${enemy.name}は毒を仕掛けた！`, "damage");
      else if (enemySkillId === "fire_mark")                this.battleUI.addLog(`${enemy.name}は炎を仕掛けた！`, "damage");
      else if (enemySkillId === "flame_breath")             this.battleUI.addLog(`${enemy.name}は大きく息を吸った…`, "normal");
      else if (enemySkillId === "poison_breath")            this.battleUI.addLog(`${enemy.name}は怪しい気体を溜めている…`, "normal");
      else if (enemySkillId === "ice_mark")                 this.battleUI.addLog(`${enemy.name}は凍傷を仕掛けた！`, "damage");
      else if (enemySkillId === "flame_breath_release")     this.battleUI.addLog(`${enemy.name}の炎の息！`, "damage");
      else if (enemySkillId === "poison_breath_release")    this.battleUI.addLog(`${enemy.name}の毒の息！`, "damage");
      else if (enemySkillId === "ice_breath")               this.battleUI.addLog(`${enemy.name}は大きく息を吸った…`, "normal");
      else if (enemySkillId === "ice_breath_release")       this.battleUI.addLog(`${enemy.name}の氷の息！`, "damage");

      if (playerStatusInflicted === "poison") this.battleUI.addLog("毒状態になった！", "damage");
      if (playerStatusInflicted === "burn")   this.battleUI.addLog("火傷状態になった！", "damage");
      if (playerStatusInflicted === "freeze") this.battleUI.addLog("凍傷状態になった！", "damage");

      if (result === "victory") {
        this.battleUI.addLog(`${enemy.name}を倒した！`, "victory");
        this.logUI.add(`${enemy.name}を倒した！`);
        await delay(300);
        this._onVictory(cell, enemy, grid);
      } else if (result === "defeat") {
        if (enemyDmg > 0) this.battleUI.addLog(`${enemy.name}から ${enemyDmg} ダメージを受けた！`, "damage");
        if (playerStatusTick?.poison) this.battleUI.addLog(`毒で ${playerStatusTick.poison} ダメージ！`, "damage");
        if (playerStatusTick?.burn)   this.battleUI.addLog(`火傷で ${playerStatusTick.burn} ダメージ！`, "damage");
        this.battleUI.update(enemy, player);
        this.onUpdateUI();
        await delay(300);
        this.battleUI.addLog("やられてしまった…", "damage");
        this.logUI.add("やられてしまった…");
        await delay(300);
        this.battleUI.hide();
        this.onGameOver();
      } else {
        if (enemyDmg > 0) this.battleUI.addLog(`${enemy.name}から ${enemyDmg} ダメージを受けた！`, "damage");
        if (playerStatusTick?.poison) this.battleUI.addLog(`毒で ${playerStatusTick.poison} ダメージ！`, "damage");
        if (playerStatusTick?.burn)   this.battleUI.addLog(`火傷で ${playerStatusTick.burn} ダメージ！`, "damage");
        this.battleUI.update(enemy, player);
        this.onUpdateUI();
        this.battleUI.onAttack(handler);
      }
    };

    this.battleUI.onAttack(handler);
  }

  /** 勝利時：マスを開放して周囲を再計算する */
  _onVictory(cell, enemy, grid) {
    this.onSave();

    cell.isEnemy  = false;
    cell.revealed = true;

    const affected = [cell, ...grid.getNeighbors(cell)];
    for (const c of affected) {
      c.danger = grid.countDanger(c.row, c.col);
      if (!c.specialType) c.displayedDanger = c.danger;
    }
    grid.recalcSpecialDangers();

    for (let r = 0; r < grid.rows; r++) {
      for (let c2 = 0; c2 < grid.cols; c2++) {
        const gc = grid.cells[r][c2];
        if (gc.element) this.gridRenderer.updateCell(gc);
      }
    }

    this.onMonsterListUpdate();
    this.battleUI.hide();
    this.onCheckClear();
  }
}
