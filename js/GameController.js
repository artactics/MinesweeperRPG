import { Grid } from "./core/Grid.js";
import { Player } from "./core/Player.js";
import { BattleSystem } from "./core/BattleSystem.js";
import { GridRenderer } from "./ui/GridRenderer.js";
import { BattleUI } from "./ui/BattleUI.js";
import { LogUI } from "./ui/LogUI.js";
import { ModalUI } from "./ui/ModalUI.js";
import { FirebaseManager } from "./core/FirebaseManager.js";
import { DIRECTIONS, GAME_CONFIG, ITEM_TYPES, EQUIPMENT_TYPES, DUNGEON_CONFIG } from "./core/constants.js";


export class GameController {

  constructor() {
    this.currentDungeonLevel = 1;
    this.grid = null;
    this.player = new Player();
    this.battle = new BattleSystem(this.player);

    this.gridRenderer = new GridRenderer(
      null,
      document.getElementById("grid"),
      cell => this.onLeft(cell),
      cell => this.onRight(cell)
    );

    this.battleUI = new BattleUI();
    this.logUI = new LogUI();
    this.modalUI = new ModalUI();

    this.firebaseManager = new FirebaseManager(window.firebaseAuth, window.firebaseDB);
    this.firebaseManager.init((user) => this.onUserChanged(user));

    this.dungeonEquipmentGained = [];

    this.setupAuthButtons();
    this.setupPlayButtons();
    this.setupEquipmentModal();
    this.setupShopModal();
    this.setupInventoryModal();

    this.updateUI();
  }

  showHomeScreen() {
    document.getElementById("home-screen").style.display = "flex";
    document.getElementById("game-screen").style.display = "none";
  }

  showGameScreen() {
    document.getElementById("home-screen").style.display = "none";
    document.getElementById("game-screen").style.display = "block";
    this.showDungeonSelect();
  }

  showDungeonSelect() {
    document.getElementById("dungeon-select-screen").style.display = "block";
    document.getElementById("dungeon-play-screen").style.display = "none";
    document.getElementById("result-screen").style.display = "none";
    this.renderDungeonSelect();
  }

  showDungeonPlay() {
    document.getElementById("dungeon-select-screen").style.display = "none";
    document.getElementById("dungeon-play-screen").style.display = "block";
    document.getElementById("result-screen").style.display = "none";
  }

  showResultScreen(data) {
    document.getElementById("dungeon-play-screen").style.display = "none";
    document.getElementById("result-screen").style.display = "flex";

    document.getElementById("result-dungeon-name").textContent = data.dungeonName;

    const details = document.getElementById("result-details");
    details.innerHTML = "";

    const addRow = (label, value, cls = "") => {
      const row = document.createElement("div");
      row.className = "result-row" + (cls ? " " + cls : "");
      row.innerHTML = `<span>${label}</span><span>${value}</span>`;
      details.appendChild(row);
    };

    addRow("獲得EXP", `+${data.expGained}`);

    if (data.newLevel > data.prevLevel) {
      addRow(`レベルアップ！`, `Lv ${data.prevLevel} → Lv ${data.newLevel}`, "result-levelup");
    }

    addRow("獲得G", `+${data.clearGold}G`);
    addRow("HP", "全回復");

    const itemIds = Object.keys(data.gainedItems);
    if (itemIds.length > 0) {
      const titleEl = document.createElement("div");
      titleEl.className = "result-section-title";
      titleEl.textContent = "入手アイテム（倉庫へ）";
      details.appendChild(titleEl);
      for (const itemId of itemIds) {
        const item = data.gainedItems[itemId];
        addRow(`${item.emoji} ${item.name}`, `×${item.count}`);
      }
    }

    if (data.gainedEquipment && data.gainedEquipment.length > 0) {
      const eqTitle = document.createElement("div");
      eqTitle.className = "result-section-title";
      eqTitle.textContent = "入手装備品";
      details.appendChild(eqTitle);
      for (const item of data.gainedEquipment) {
        addRow(`${item.emoji} ${item.name}`, item.description);
      }
    }
  }

  renderDungeonSelect() {
    const statsEl = document.getElementById("ds-player-stats");
    statsEl.innerHTML = `Lv <strong>${this.player.level}</strong> &nbsp; HP ${this.player.hp}/${this.player.maxHp} &nbsp; ATK ${this.player.atk} &nbsp; 💰 ${this.player.gold}G`;

    const container = document.getElementById("dungeon-cards");
    container.innerHTML = "";

    for (const [level, config] of Object.entries(DUNGEON_CONFIG)) {
      const locked = this.player.level < config.minPlayerLevel;
      const card = document.createElement("div");
      card.className = "dungeon-card" + (locked ? " dungeon-card-locked" : "");

      const nameEl = document.createElement("div");
      nameEl.className = "dungeon-card-name";
      nameEl.textContent = `Lv${level}: ${config.name}`;

      const detailsEl = document.createElement("div");
      detailsEl.className = "dungeon-card-details";
      detailsEl.innerHTML = `
        <span>必要Lv: ${config.minPlayerLevel}</span>
        <span>グリッド: ${config.gridSize.rows}×${config.gridSize.cols} &nbsp; 敵: ${config.enemyCount}</span>
        <span>クリアEXP: +${config.clearExp} &nbsp; クリアG: +${config.clearGold}</span>
      `;

      card.appendChild(nameEl);
      card.appendChild(detailsEl);

      if (locked) {
        const lockEl = document.createElement("div");
        lockEl.className = "dungeon-card-lock";
        lockEl.textContent = `🔒 Lv${config.minPlayerLevel}以上で解放`;
        card.appendChild(lockEl);
      } else {
        const btn = document.createElement("button");
        btn.className = "dungeon-enter-btn";
        btn.textContent = "入場する";
        btn.addEventListener("click", () => this.enterDungeon(parseInt(level)));
        card.appendChild(btn);
      }

      container.appendChild(card);
    }
  }

  setupPlayButtons() {
    document.getElementById("back-to-select-btn").addEventListener("click", () => {
      this.player.handItems = {};
      this.showDungeonSelect();
    });
    document.getElementById("result-ok-btn").addEventListener("click", () => {
      this.showDungeonSelect();
    });
  }

  setupEquipmentModal() {
    document.getElementById("equipment-btn").addEventListener("click", () => {
      this.renderEquipmentUI();
      document.getElementById("equipment-modal").style.display = "flex";
    });
    document.getElementById("equipment-close-btn").addEventListener("click", () => {
      document.getElementById("equipment-modal").style.display = "none";
    });
  }

  setupInventoryModal() {
    document.getElementById("inventory-btn").addEventListener("click", () => {
      this.renderInventoryUI();
      document.getElementById("inventory-modal").style.display = "flex";
    });
    document.getElementById("inventory-close-btn").addEventListener("click", () => {
      document.getElementById("inventory-modal").style.display = "none";
    });
  }

  renderInventoryUI() {
    const content = document.getElementById("inventory-content");
    content.innerHTML = "";

    const addSection = (title) => {
      const el = document.createElement("div");
      el.className = "shop-section-title";
      el.textContent = title;
      content.appendChild(el);
    };

    const addRow = (emoji, name, sub, badge) => {
      const row = document.createElement("div");
      row.className = "shop-row";
      const info = document.createElement("span");
      info.className = "shop-item-info";
      info.innerHTML = `${emoji} ${name} <span style="color:#aaa;font-size:0.8rem">${sub}</span>`;
      const b = document.createElement("span");
      b.className = "inv-badge";
      b.textContent = badge;
      row.appendChild(info);
      row.appendChild(b);
      content.appendChild(row);
    };

    const invIds = Object.keys(this.player.inventory);
    if (invIds.length > 0) {
      addSection("消費アイテム");
      for (const id of invIds) {
        const item = this.player.inventory[id];
        addRow(item.emoji, item.name, item.description, `×${item.count}`);
      }
    }

    const eqIds = Object.keys(this.player.equipmentInventory);
    if (eqIds.length > 0) {
      addSection("装備品");
      for (const id of eqIds) {
        const item = this.player.equipmentInventory[id];
        addRow(item.emoji, item.name, item.description, item.count > 1 ? `×${item.count}` : "");
      }
    }

    if (invIds.length === 0 && eqIds.length === 0) {
      content.innerHTML = "<div style='color:#555;padding:12px 0;text-align:center'>倉庫は空です</div>";
    }
  }

  setupShopModal() {
    document.getElementById("shop-btn").addEventListener("click", () => {
      this.renderShopUI("buy");
      document.getElementById("shop-modal").style.display = "flex";
    });
    document.getElementById("shop-close-btn").addEventListener("click", () => {
      document.getElementById("shop-modal").style.display = "none";
    });
    document.getElementById("shop-tab-buy").addEventListener("click", () => this.renderShopUI("buy"));
    document.getElementById("shop-tab-sell").addEventListener("click", () => this.renderShopUI("sell"));
  }

  renderShopUI(tab) {
    document.getElementById("shop-gold-display").textContent = `💰 所持金: ${this.player.gold}G`;
    document.getElementById("shop-tab-buy").classList.toggle("active", tab === "buy");
    document.getElementById("shop-tab-sell").classList.toggle("active", tab === "sell");

    const content = document.getElementById("shop-content");
    content.innerHTML = "";

    if (tab === "buy") {
      for (const item of Object.values(ITEM_TYPES)) {
        if (!item.buyPrice) continue;
        const row = document.createElement("div");
        row.className = "shop-row";
        const info = document.createElement("span");
        info.className = "shop-item-info";
        info.innerHTML = `${item.emoji} ${item.name} <span style="color:#aaa;font-size:0.78rem">${item.description}</span>`;
        const price = document.createElement("span");
        price.className = "shop-item-price";
        price.textContent = `${item.buyPrice}G`;
        const btn = document.createElement("button");
        btn.className = "shop-buy-btn";
        btn.textContent = "購入";
        btn.disabled = this.player.gold < item.buyPrice;
        btn.addEventListener("click", () => {
          if (this.player.spendGold(item.buyPrice)) {
            this.player.addToInventory(item);
            this.saveGameData();
            this.renderShopUI("buy");
            this.renderDungeonSelect();
          }
        });
        row.appendChild(info);
        row.appendChild(price);
        row.appendChild(btn);
        content.appendChild(row);
      }
    } else {
      const invIds = Object.keys(this.player.inventory);
      if (invIds.length > 0) {
        const t = document.createElement("div");
        t.className = "shop-section-title";
        t.textContent = "アイテム";
        content.appendChild(t);
        for (const id of invIds) {
          const item = this.player.inventory[id];
          if (!item.sellPrice) continue;
          const row = document.createElement("div");
          row.className = "shop-row";
          const info = document.createElement("span");
          info.className = "shop-item-info";
          info.innerHTML = `${item.emoji} ${item.name} <span style="color:#aaa">×${item.count}</span>`;
          const price = document.createElement("span");
          price.className = "shop-item-price";
          price.textContent = `${item.sellPrice}G/個`;
          const btn = document.createElement("button");
          btn.className = "shop-sell-btn";
          btn.textContent = "売却";
          btn.addEventListener("click", () => {
            this.player.addGold(item.sellPrice);
            this.player.inventory[id].count--;
            if (this.player.inventory[id].count <= 0) delete this.player.inventory[id];
            this.saveGameData();
            this.renderShopUI("sell");
            this.renderDungeonSelect();
          });
          row.appendChild(info);
          row.appendChild(price);
          row.appendChild(btn);
          content.appendChild(row);
        }
      }

      const eqIds = Object.keys(this.player.equipmentInventory);
      if (eqIds.length > 0) {
        const t = document.createElement("div");
        t.className = "shop-section-title";
        t.textContent = "装備品";
        content.appendChild(t);
        for (const id of eqIds) {
          const item = this.player.equipmentInventory[id];
          if (!item.sellPrice) continue;
          const row = document.createElement("div");
          row.className = "shop-row";
          const info = document.createElement("span");
          info.className = "shop-item-info";
          info.innerHTML = `${item.emoji} ${item.name} <span style="color:#5aaa88;font-size:0.78rem">${item.description}</span>${item.count > 1 ? ` <span style="color:#aaa">×${item.count}</span>` : ""}`;
          const price = document.createElement("span");
          price.className = "shop-item-price";
          price.textContent = `${item.sellPrice}G`;
          const btn = document.createElement("button");
          btn.className = "shop-sell-btn";
          btn.textContent = "売却";
          btn.addEventListener("click", () => {
            this.player.addGold(item.sellPrice);
            this.player.equipmentInventory[id].count--;
            if (this.player.equipmentInventory[id].count <= 0) delete this.player.equipmentInventory[id];
            this.saveGameData();
            this.renderShopUI("sell");
            this.renderDungeonSelect();
          });
          row.appendChild(info);
          row.appendChild(price);
          row.appendChild(btn);
          content.appendChild(row);
        }
      }

      if (invIds.length === 0 && eqIds.length === 0) {
        content.innerHTML = "<div style='color:#555;padding:8px 0'>売却できるアイテムなし</div>";
      }
    }
  }

  renderEquipmentUI() {
    const slotsEl = document.getElementById("equipment-slots");
    slotsEl.innerHTML = "";

    for (const [slotKey, label] of [["weapon", "武器"], ["head", "頭"], ["body", "胴"], ["legs", "脚"]]) {
      const equippedId = this.player.equipped[slotKey];
      const def = equippedId ? Object.values(EQUIPMENT_TYPES).find(e => e.id === equippedId) : null;
      const row = document.createElement("div");
      row.className = "eq-slot";

      const labelEl = document.createElement("span");
      labelEl.className = "eq-slot-label";
      labelEl.textContent = label;
      row.appendChild(labelEl);

      if (def) {
        const nameEl = document.createElement("span");
        nameEl.className = "eq-item-name";
        nameEl.innerHTML = `${def.emoji} ${def.name} <span class="eq-item-stat">${def.description}</span>`;
        row.appendChild(nameEl);
        const btn = document.createElement("button");
        btn.className = "eq-unequip-btn";
        btn.textContent = "外す";
        btn.addEventListener("click", () => {
          this.player.unequipItem(slotKey);
          this.updateUI();
          this.saveGameData();
          this.renderEquipmentUI();
        });
        row.appendChild(btn);
      } else {
        const emptyEl = document.createElement("span");
        emptyEl.className = "eq-empty";
        emptyEl.textContent = "なし";
        row.appendChild(emptyEl);
      }
      slotsEl.appendChild(row);
    }

    const listEl = document.getElementById("equipment-inventory-list");
    listEl.innerHTML = "";
    const itemIds = Object.keys(this.player.equipmentInventory);
    if (itemIds.length === 0) {
      listEl.innerHTML = "<div style='color:#555;font-size:0.85rem;padding:8px 0'>装備品なし</div>";
      return;
    }
    for (const itemId of itemIds) {
      const item = this.player.equipmentInventory[itemId];
      const row = document.createElement("div");
      row.className = "eq-inventory-item";
      const info = document.createElement("span");
      info.className = "eq-item-info";
      info.innerHTML = `${item.emoji} ${item.name} <span class="eq-item-stat">${item.description}</span>${item.count > 1 ? ` ×${item.count}` : ""}`;
      const btn = document.createElement("button");
      btn.className = "eq-equip-btn";
      btn.textContent = "装備";
      btn.addEventListener("click", () => {
        this.player.equipItem(itemId);
        this.updateUI();
        this.saveGameData();
        this.renderEquipmentUI();
      });
      row.appendChild(info);
      row.appendChild(btn);
      listEl.appendChild(row);
    }
  }

  setupAuthButtons() {
    const homeLoginBtn = document.getElementById("home-login-btn");
    const homeGuestBtn = document.getElementById("home-guest-btn");
    const logoutBtn = document.getElementById("logout-btn");
    const dsLoginBtn = document.getElementById("ds-login-btn");

    const doLogin = async () => {
      try {
        await this.firebaseManager.signInWithGoogle();
      } catch (error) {
        console.error(error);
      }
    };

    homeLoginBtn.addEventListener("click", doLogin);
    dsLoginBtn.addEventListener("click", doLogin);

    homeGuestBtn.addEventListener("click", () => {
      this.showGameScreen();
    });

    logoutBtn.addEventListener("click", async () => {
      try {
        await this.firebaseManager.signOut();
      } catch (error) {
        this.logUI.add("ログアウトに失敗しました");
        console.error(error);
      }
    });
  }

  enterDungeon(level) {
    const config = DUNGEON_CONFIG[level];
    if (!config) return;

    if (this.player.level < config.minPlayerLevel) {
      this.logUI.add(`このダンジョンはLv${config.minPlayerLevel}以上で入場可能です`);
      return;
    }

    this.player.handItems = {};
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
      itemPool
    );
    this.player.bonusAtk = 0;
    this.battle = new BattleSystem(this.player);

    this.gridRenderer.grid = this.grid;
    this.gridRenderer.render();
    this.logUI.clear();
    this.logUI.add(`${config.name}に入場しました`);
    this.updateUI();
    this.showDungeonPlay();
  }

  async onUserChanged(user) {
    const logoutBtn = document.getElementById("logout-btn");

    const dsLoginBtn = document.getElementById("ds-login-btn");
    if (user) {
      logoutBtn.style.display = "block";
      dsLoginBtn.style.display = "none";
      this.showGameScreen();
      this.logUI.add(`ログイン: ${user.displayName || user.email}`);
      const savedData = await this.firebaseManager.loadUserData();
      if (savedData) {
        this.player = new Player(savedData);
        this.battle = new BattleSystem(this.player);
        this.updateUI();
        this.renderDungeonSelect();
        this.logUI.add("セーブデータを読み込みました");
      }
    } else {
      logoutBtn.style.display = "none";
      dsLoginBtn.style.display = "block";
      this.player = new Player();
      this.battle = new BattleSystem(this.player);
      this.updateUI();
      this.showHomeScreen();
    }
  }

  async saveGameData() {
    if (this.firebaseManager.getCurrentUser()) {
      await this.firebaseManager.saveUserData(this.player.toJSON());
    }
  }

  onLeft(cell) {
    if (cell.flagged) return;

    // 開いたマスでアイテムがある場合
    if (cell.revealed && cell.item) {
      const item = cell.item;
      if (item.category === "equipment") {
        this.player.addEquipment(item);
        this.dungeonEquipmentGained.push(item);
        this.logUI.add(`${item.emoji} ${item.name}を入手した！（装備品）`);
      } else {
        this.player.addItem(item);
        this.logUI.add(`${item.emoji} ${item.name}を手に入れた！`);
      }
      cell.item = null;
      this.gridRenderer.updateCell(cell);
      this.updateUI();
      this.saveGameData();
      return;
    }

    if (cell.revealed) {
      // コード開き：旗の数が danger と一致すれば未開封・無旗マスを一括開封
      if (cell.danger > 0) {
        const neighbors = this.grid.getNeighbors(cell);
        const flagCount = neighbors.filter(n => n.flagged).length;
        if (flagCount === cell.danger) {
          for (const n of neighbors.filter(n => !n.flagged && !n.revealed)) {
            this.onLeft(n);
          }
        }
      }
      return;
    }

    cell.revealed = true;
    this.gridRenderer.updateCell(cell);

    // アイテムマスの場合（開いた直後にアイテムがある場合）
    if (cell.item) {
      return; // アイテムを表示した状態で止める
    }

    // 敵マス
    if (cell.isEnemy) {
      const enemy = this.battle.start(cell);
      this.logUI.add(`${enemy.emoji} ${enemy.name}が現れた！ 危険度:${cell.danger}`);

      this.battleUI.show(enemy, this.player);

      this.battleUI.onAttack(() => {
        const result = this.battle.attack();
        this.battleUI.update(enemy, this.player);
        this.updateUI();

        if (result === "victory") {
          this.logUI.add(`敵を倒した！`);
          this.saveGameData();

          // ★ 敵マスを安全マスに変更
          cell.isEnemy = false;
          cell.revealed = true;

          // ★ このマス自身の danger を再計算
          cell.danger = this.grid.countDanger(cell.row, cell.col);
          this.gridRenderer.updateCell(cell);

          // ★ 周囲 8 マスの danger も再計算
          for (const [dr, dc] of DIRECTIONS) {
            const nr = cell.row + dr;
            const nc = cell.col + dc;

            if (nr < 0 || nr >= this.grid.rows || nc < 0 || nc >= this.grid.cols) continue;

            const neighbor = this.grid.cells[nr][nc];

            // 敵じゃないマスだけ danger 再計算
            if (!neighbor.isEnemy) {
              neighbor.danger = this.grid.countDanger(nr, nc);
              this.gridRenderer.updateCell(neighbor);
            }
          }

          this.battleUI.hide();
          this.checkClear();
        } else if (result === "defeat") {
          this.logUI.add("やられてしまった…");
          this.battleUI.hide();
          this.showGameOver();
        }
      });

      this.battleUI.onEscape(() => {
        this.player.hp -= GAME_CONFIG.ESCAPE_DAMAGE;
        if (this.player.hp <= 0) {
          this.player.hp = 0;
          this.logUI.add(`逃げたが、${GAME_CONFIG.ESCAPE_DAMAGE}ダメージを受けた…`);
          this.battleUI.hide();
          this.showGameOver();
          return;
        }

        this.logUI.add(`逃げた！（${GAME_CONFIG.ESCAPE_DAMAGE}ダメージ）`);
        this.battleUI.hide();
        this.updateUI();

        cell.revealed = false;
        this.gridRenderer.updateCell(cell);
      });

      return;
    }

    // ★ 通常マスの処理（敵マスの外）
    if (cell.danger > 0) {
      cell.element.textContent = cell.danger;
    } else {
      this.floodReveal(cell.row, cell.col);
    }

    // ★ クリア判定（ここで呼ぶ）
    this.checkClear();
  }



  onRight(cell) {
    if (cell.revealed) return;
    cell.flagged = !cell.flagged;
    this.gridRenderer.updateCell(cell);
  }


  updateUI() {
    this.logUI.updatePlayer(this.player);
    this.updateItemsUI();
  }

  updateItemsUI() {
    // 手持ちアイテム
    const handItemsList = document.getElementById("hand-items-list");
    handItemsList.innerHTML = "";

    const handItemIds = Object.keys(this.player.handItems);

    if (handItemIds.length === 0) {
      handItemsList.innerHTML = "<div>アイテムなし</div>";
    } else {
      for (const itemId of handItemIds) {
        const item = this.player.handItems[itemId];
        const itemDiv = document.createElement("div");
        itemDiv.style.display = "flex";
        itemDiv.style.alignItems = "center";
        itemDiv.style.marginBottom = "5px";

        const itemInfo = document.createElement("span");
        itemInfo.textContent = `${item.emoji} ${item.name} x${item.count}`;
        itemInfo.style.flex = "1";

        const useBtn = document.createElement("button");
        useBtn.textContent = "使用";
        useBtn.style.marginLeft = "5px";
        useBtn.style.padding = "2px 8px";
        useBtn.onclick = () => this.useItem(itemId, true);

        itemDiv.appendChild(itemInfo);
        itemDiv.appendChild(useBtn);
        handItemsList.appendChild(itemDiv);
      }
    }

    // 倉庫
    const inventoryList = document.getElementById("inventory-list");
    inventoryList.innerHTML = "";

    const inventoryItemIds = Object.keys(this.player.inventory);

    if (inventoryItemIds.length === 0) {
      inventoryList.innerHTML = "<div>アイテムなし</div>";
    } else {
      for (const itemId of inventoryItemIds) {
        const item = this.player.inventory[itemId];
        const itemDiv = document.createElement("div");
        itemDiv.style.display = "flex";
        itemDiv.style.alignItems = "center";
        itemDiv.style.marginBottom = "5px";

        const itemInfo = document.createElement("span");
        itemInfo.textContent = `${item.emoji} ${item.name} x${item.count}`;
        itemInfo.style.flex = "1";

        const useBtn = document.createElement("button");
        useBtn.textContent = "使用";
        useBtn.style.marginLeft = "5px";
        useBtn.style.padding = "2px 8px";
        useBtn.onclick = () => this.useItem(itemId, false);

        itemDiv.appendChild(itemInfo);
        itemDiv.appendChild(useBtn);
        inventoryList.appendChild(itemDiv);
      }
    }
  }

  useItem(itemId, fromHand = true) {
    const items = fromHand ? this.player.handItems : this.player.inventory;
    const item = items[itemId];
    if (!item) return;

    const effect = item.effect;

    switch (effect.type) {
      case "heal":
        this.player.hp = Math.min(this.player.hp + effect.value, this.player.maxHp);
        this.logUI.add(`${item.emoji} ${item.name}を使用！ HPを${effect.value}回復`);
        break;
      case "atk":
        this.player.bonusAtk += effect.value;
        this.logUI.add(`${item.emoji} ${item.name}を使用！ 攻撃力+${effect.value}（このダンジョンのみ）`);
        break;
      case "maxHp":
        this.player.maxHp += effect.value;
        this.player.hp += effect.value;
        this.logUI.add(`${item.emoji} ${item.name}を使用！ 最大HP+${effect.value}`);
        break;
    }

    this.player.removeItem(itemId, fromHand);
    this.updateUI();
    this.saveGameData();
  }

  moveToInventory(itemId) {
    this.player.moveToInventory(itemId);
    this.updateUI();
    this.saveGameData();
  }

  moveToHand(itemId) {
    this.player.moveToHand(itemId);
    this.updateUI();
    this.saveGameData();
  }

  floodReveal(r, c) {
    for (const [dr, dc] of DIRECTIONS) {
      const nr = r + dr;
      const nc = c + dc;

      // 範囲外は無視
      if (nr < 0 || nr >= this.grid.rows || nc < 0 || nc >= this.grid.cols) continue;

      const cell = this.grid.cells[nr][nc];

      // すでに開いている or 敵マスは無視
      if (cell.revealed || cell.isEnemy) continue;

      // 開く
      cell.revealed = true;
      this.gridRenderer.updateCell(cell);

      // danger=0 ならさらに周囲を開く
      if (cell.danger === 0) {
        this.floodReveal(nr, nc);
      }
    }
  }

  checkClear() {
    let totalSafeCells = 0;
    let revealedSafeCells = 0;

    for (let r = 0; r < this.grid.rows; r++) {
      for (let c = 0; c < this.grid.cols; c++) {
        const cell = this.grid.cells[r][c];
        if (!cell.isEnemy) {
          totalSafeCells++;
          if (cell.revealed) {
            revealedSafeCells++;
          }
        }
      }
    }

    if (revealedSafeCells === totalSafeCells && totalSafeCells > 0) {
      const config = DUNGEON_CONFIG[this.currentDungeonLevel];
      const prevLevel = this.player.level;

      this.player.gainExp(config.clearExp);
      this.player.addGold(config.clearGold || 0);
      this.player.hp = this.player.maxHp;

      // グリッド上の未取得アイテムを自動回収
      for (let r = 0; r < this.grid.rows; r++) {
        for (let c = 0; c < this.grid.cols; c++) {
          const cell = this.grid.cells[r][c];
          if (cell.item) {
            if (cell.item.category === "equipment") {
              this.player.addEquipment(cell.item);
              this.dungeonEquipmentGained.push(cell.item);
            } else {
              this.player.addItem(cell.item);
            }
            cell.item = null;
          }
        }
      }

      const gainedItems = { ...this.player.handItems };
      for (const itemId of Object.keys(this.player.handItems)) {
        this.player.moveToInventory(itemId);
      }

      this.saveGameData();
      this.showResultScreen({
        dungeonName: config.name,
        expGained: config.clearExp,
        clearGold: config.clearGold || 0,
        prevLevel,
        newLevel: this.player.level,
        gainedItems,
        gainedEquipment: [...this.dungeonEquipmentGained]
      });
      return true;
    }

    return false;
  }

  showGameOver() {
    this.modalUI.showGameOver(() => this.resetGame());
  }

  resetGame() {
    this.player.handItems = {};
    this.player.hp = this.player.maxHp;
    this.showDungeonSelect();
  }


}
