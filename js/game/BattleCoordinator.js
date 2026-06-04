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

      const { result, playerDmg, enemyDmg, isMine, gridReset, skillConsumed } = attackResult;

      if (skillConsumed && pendingSkill) {
        player.spendMp(pendingSkill.mpCost);
        if (pendingSkill.id === "heal") {
          this.battleUI.addLog("回復スキル発動！HP+10", "heal");
        } else if (pendingSkill.id === "double_strike") {
          this.battleUI.addLog("連撃発動！", "attack");
        } else if (pendingSkill.id === "focus") {
          this.battleUI.addLog("集中！このターンは攻撃せず、次の攻撃が3倍になる", "heal");
        }
        this.battleUI.clearSkillSelection();
      } else if (pendingSkill && isMine) {
        this.battleUI.addLog("地雷によりスキルは発動されなかった", "normal");
      }

      if (isMine) {
        this.battleUI.addLog("地雷！攻撃失敗…", "damage");
      } else if (playerDmg > 0) {
        this.battleUI.addLog(`${enemy.name}に ${playerDmg} ダメージ！`, "attack");
      }
      if (gridReset) {
        this.battleUI.addLog("新しいグリッドが出現！", "normal");
      }
      this.battleUI.update(enemy, player);
      this.battleUI.renderGrid(battle.battleGrid);
      this.battleUI.renderSkills(battleSkills, player);
      this.onUpdateUI();

      await delay(300);

      if (result === "victory") {
        this.battleUI.addLog(`${enemy.name}を倒した！`, "victory");
        this.logUI.add(`${enemy.name}を倒した！`);
        await delay(300);
        this._onVictory(cell, enemy, grid);
      } else if (result === "defeat") {
        this.battleUI.addLog(`${enemy.name}から ${enemyDmg} ダメージを受けた！`, "damage");
        this.battleUI.update(enemy, player);
        this.onUpdateUI();
        await delay(300);
        this.battleUI.addLog("やられてしまった…", "damage");
        this.logUI.add("やられてしまった…");
        await delay(300);
        this.battleUI.hide();
        this.onGameOver();
      } else {
        this.battleUI.addLog(`${enemy.name}から ${enemyDmg} ダメージを受けた！`, "damage");
        this.battleUI.update(enemy, player);
        this.onUpdateUI();
        this.battleUI.onAttack(handler);
      }
    };

    this.battleUI.onAttack(handler);
  }

  /** 勝利時：マスを安全化し danger を再計算 */
  _onVictory(cell, enemy, grid) {
    this.onSave();

    cell.isEnemy = false;
    cell.revealed = true;
    cell.danger = grid.countDanger(cell.row, cell.col);
    this.gridRenderer.updateCell(cell);

    for (const [dr, dc] of DIRECTIONS) {
      const nr = cell.row + dr;
      const nc = cell.col + dc;
      if (nr < 0 || nr >= grid.rows || nc < 0 || nc >= grid.cols) continue;

      const neighbor = grid.cells[nr][nc];
      if (!neighbor.isEnemy) {
        neighbor.danger = grid.countDanger(nr, nc);
        this.gridRenderer.updateCell(neighbor);
      }
    }

    this.onMonsterListUpdate();
    this.battleUI.hide();
    this.onCheckClear();
  }
}
