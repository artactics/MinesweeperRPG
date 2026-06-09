import { Player } from "./core/Player.js";
import { BattleSystem } from "./core/BattleSystem.js";
import { GridRenderer } from "./ui/GridRenderer.js";
import { BattleUI } from "./ui/BattleUI.js";
import { LogUI } from "./ui/LogUI.js";
import { ModalUI } from "./ui/ModalUI.js";
import { FirebaseManager } from "./core/FirebaseManager.js";
import { ScreenNavigator } from "./ui/ScreenNavigator.js";
import { DungeonSelectUI } from "./ui/DungeonSelectUI.js";
import { MonsterListUI } from "./ui/MonsterListUI.js";
import { ShopUI } from "./ui/ShopUI.js";
import { InventoryUI } from "./ui/InventoryUI.js";
import { EquipmentUI } from "./ui/EquipmentUI.js";
import { PlayerHudUI } from "./ui/PlayerHudUI.js";
import { DungeonSession } from "./game/DungeonSession.js";
import { SaveService } from "./game/SaveService.js";
import { ItemUsageService } from "./game/ItemUsageService.js";
import { MinesweeperInputHandler } from "./game/MinesweeperInputHandler.js";
import { BattleCoordinator } from "./game/BattleCoordinator.js";
import { AuthFlow } from "./game/AuthFlow.js";
import { initMenuIcons } from "./core/menuIcons.js";
import { SKILL_CONFIG } from "./config/skillConfig.js";

/**
 * ゲーム全体のオーケストレータ（ファサード）
 * 各サブシステムの組み立てと画面フローの接続のみを行う
 */
export class GameController {

  constructor() {
    // --- コア状態 ---
    this.player = new Player();
    this.battle = new BattleSystem(this.player);

    // --- UI ---
    this.logUI = new LogUI();
    this.battleUI = new BattleUI();
    this.modalUI = new ModalUI();
    this.screenNavigator = new ScreenNavigator();
    this.monsterListUI = new MonsterListUI();

    // 盤面描画（入力は MinesweeperInputHandler へ委譲）
    this.gridRenderer = new GridRenderer(
      null,
      document.getElementById("grid"),
      cell => this._onGridLeft(cell),
      cell => this._onGridRight(cell)
    );

    // --- ダンジョンセッション ---
    this.dungeonSession = new DungeonSession({
      getPlayer: () => this.player,
      logUI: this.logUI,
      gridRenderer: this.gridRenderer,
      onBattleCreated: battle => { this.battle = battle; }
    });

    // --- 永続化 ---
    this.firebaseManager = new FirebaseManager(window.firebaseAuth, window.firebaseDB);
    this.saveService = new SaveService({
      firebaseManager: this.firebaseManager,
      getPlayer: () => this.player,
      getDungeonEquipmentGained: () => this.dungeonSession.dungeonEquipmentGained,
      getIsInDungeon: () => this.dungeonSession.grid !== null
    });

    // --- ゲームプレイ ---
    this.battleCoordinator = new BattleCoordinator({
      getBattle: () => this.battle,
      getPlayer: () => this.player,
      getSession: () => this.dungeonSession,
      battleUI: this.battleUI,
      logUI: this.logUI,
      gridRenderer: this.gridRenderer,
      onUpdateUI: () => this.updateUI(),
      onSave: () => this.saveGameData(),
      onMonsterListUpdate: () => this._updateMonsterList(),
      onCheckClear: () => this._handleCheckClear(),
      onGameOver: () => this.showGameOver()
    });

    this.minesweeperInput = new MinesweeperInputHandler({
      getSession: () => this.dungeonSession,
      gridRenderer: this.gridRenderer,
      battleCoordinator: this.battleCoordinator,
      getPlayer: () => this.player,
      logUI: this.logUI,
      onUpdateUI: () => this.updateUI(),
      onSave: () => this.saveGameData(),
      onCheckClear: () => this._handleCheckClear()
    });

    this.itemUsage = new ItemUsageService({
      getPlayer: () => this.player,
      logUI: this.logUI,
      onAfterUse: () => {
        this.updateUI();
        this.saveGameData();
      }
    });

    // --- メタ画面 UI ---
    this.dungeonSelectUI = new DungeonSelectUI({
      getPlayer: () => this.player,
      onEnterDungeon: (level, layer) => this.enterDungeon(level, layer)
    });

    const onMetaTransaction = () => {
      this.saveGameData();
      this.dungeonSelectUI.render();
    };

    this.shopUI = new ShopUI({
      getPlayer: () => this.player,
      onTransaction: onMetaTransaction
    });

    this.inventoryUI = new InventoryUI({ getPlayer: () => this.player });

    this.equipmentUI = new EquipmentUI({
      getPlayer: () => this.player,
      onChanged: () => {
        this.updateUI();
        this.saveGameData();
      }
    });

    this.playerHudUI = new PlayerHudUI({
      getPlayer: () => this.player,
      onUseItem: (itemId, fromHand) => this.itemUsage.useItem(itemId, fromHand),
      onUseSkill: (skill) => {
        this.minesweeperInput.useFieldSkill(skill);
        this._refreshFieldSkills();
      }
    });

    // --- 認証 ---
    this.authFlow = new AuthFlow({
      firebaseManager: this.firebaseManager,
      logUI: this.logUI,
      screenNavigator: this.screenNavigator,
      onPlayerLoaded: (player, battle) => {
        this._setPlayer(player, battle);
        this.screenNavigator.showGameScreen();
        this.screenNavigator.showDungeonSelect();
      },
      onLoggedOut: (player, battle) => {
        this._setPlayer(player, battle);
        this.updateUI();
        this.screenNavigator.showHomeScreen();
      },
      onGuestPlay: () => this.showDungeonSelect()
    });

    this.firebaseManager.init(user => this.authFlow.onUserChanged(user));

    initMenuIcons();
    this._setupPlayButtons();
    this.authFlow.setupButtons();
    this.updateUI();
  }

  // --- 盤面入力（初期化順のためラッパー） ---

  _onGridLeft(cell) {
    this.minesweeperInput.onLeft(cell);
  }

  _onGridRight(cell) {
    this.minesweeperInput.onRight(cell);
  }

  // --- 画面遷移 ---

  showDungeonSelect() {
    this.screenNavigator.showGameScreen();
    this.screenNavigator.showDungeonSelect();
    this.dungeonSelectUI.render();
  }

  enterDungeon(level, layer) {
    if (!this.dungeonSession.enter(level, layer)) return;
    this._updateMonsterList();
    this._updateFloorProgress();
    this._updateSpecialBlocksLegend();
    this.updateUI();
    this.screenNavigator.showDungeonPlay();
  }

  // --- UI 更新 ---

  updateUI() {
    this.logUI.updatePlayer(this.player);
    this.playerHudUI.renderItems();
    this._refreshFieldSkills();
  }

  _refreshFieldSkills() {
    const fieldSkills = this.player.activeSkills
      .map(k => SKILL_CONFIG[k])
      .filter(s => s && (s.usableIn === "field" || s.usableIn === "both"));
    this.playerHudUI.renderFieldSkills(fieldSkills);
  }

  _updateMonsterList() {
    this.monsterListUI.render(this.dungeonSession.grid);
  }

  _updateSpecialBlocksLegend() {
    const section = document.getElementById("special-blocks-section");
    const legend  = document.getElementById("special-blocks-legend");
    if (!section || !legend) return;
    const sb = this.dungeonSession.layerConfig?.specialBlocks;
    const LABELS = {
      fog:     { name: "視界不良", desc: "開けても数字が見えない" },
      sturdy:  { name: "頑丈",     desc: "周囲マスが全て開いてから開放" },
      tension: { name: "緊張感",   desc: "周囲2マス分の合計を表示" },
      phantom: { name: "まぼろし", desc: "表示数字が±1ずれている" },
    };
    const lines = sb
      ? Object.entries(LABELS)
          .filter(([t]) => (sb[t] || 0) > 0)
          .map(([t, l]) => `<div class="special-legend-item special-legend--${t}"><span class="legend-sample special-${t}"></span><strong>${l.name}</strong>：${l.desc}</div>`)
      : [];
    section.style.display = lines.length ? "" : "none";
    legend.innerHTML = lines.join("");
  }

  _updateFloorProgress() {
    const el = document.getElementById("floor-progress");
    if (!el) return;
    const s = this.dungeonSession;
    el.textContent = `${s.currentFloor}F / ${s.totalFloors}F`;
  }

  // --- セーブ ---

  async saveGameData(dungeonClear = false) {
    await this.saveService.save(dungeonClear);
  }

  // --- クリア・ゲームオーバー ---

  _handleCheckClear() {
    const result = this.dungeonSession.tryClear();
    if (!result) return false;

    if (result.status === "advance") {
      this._updateMonsterList();
      this._updateFloorProgress();
      this._updateSpecialBlocksLegend();
      this.updateUI();
      this.saveGameData();
      return true;
    }

    this.saveGameData(true);
    this.screenNavigator.showResultScreen(result);
    return true;
  }

  showGameOver() {
    this.modalUI.showGameOver(() => this.resetGame());
  }

  resetGame() {
    this.dungeonSession.abandon();
    this.saveGameData();
    this.showDungeonSelect();
    this.updateUI();
  }

  // --- プレイ中ボタン ---

  _setupPlayButtons() {
    document.getElementById("back-to-select-btn").addEventListener("click", () => {
      this.dungeonSession.abandon();
      this.saveGameData();
      this.showDungeonSelect();
      this.updateUI();
    });
    document.getElementById("result-ok-btn").addEventListener("click", () => {
      this.showDungeonSelect();
    });
    document.getElementById("flag-mode-btn").addEventListener("click", () => {
      this.dungeonSession.toggleFlagMode();
    });
  }

  // --- 認証後のプレイヤー差し替え ---

  _setPlayer(player, battle) {
    this.player = player;
    this.battle = battle;
    this.updateUI();
    this.dungeonSelectUI.render();
  }
}
