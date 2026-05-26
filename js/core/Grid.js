import { DIRECTIONS, ENEMY_TYPES, ITEM_TYPES } from "./constants.js";

export class Grid {
  constructor(rows, cols, enemyCount, enemyTypes = null, itemChance = 0.1, itemPool = null, dungeonLevel = 1) {
    this.rows = rows;
    this.cols = cols;
    this.enemyCount = enemyCount;
    this.enemyTypes = enemyTypes || Object.keys(ENEMY_TYPES);
    this.itemChance = itemChance;
    this.itemPool = itemPool;
    this.dungeonLevel = dungeonLevel;
    this.cells = [];
    this.init();
  }

  init() {
    this.cells = [];
    for (let r = 0; r < this.rows; r++) {
      const row = [];
      for (let c = 0; c < this.cols; c++) {
        row.push({
          row: r,
          col: c,
          isEnemy: false,
          enemyType: null,
          item: null,
          revealed: false,
          flagged: false,
          danger: 0
        });
      }
      this.cells.push(row);
    }
    this.placeEnemies();
    this.calcDanger();
    this.placeItems();
  }

  placeEnemies() {
    let placed = 0;
    const maxAttempts = this.rows * this.cols * 10;
    let attempts = 0;

    while (placed < this.enemyCount && attempts < maxAttempts) {
      const r = Math.floor(Math.random() * this.rows);
      const c = Math.floor(Math.random() * this.cols);
      if (!this.cells[r][c].isEnemy) {
        const enemyTypeKey = this.enemyTypes[Math.floor(Math.random() * this.enemyTypes.length)];
        this.cells[r][c].isEnemy = true;
        this.cells[r][c].isElite = false;
        this.cells[r][c].enemyType = ENEMY_TYPES[enemyTypeKey];
        placed++;
      }
      attempts++;
    }

    // エリートを必ず1体配置
    attempts = 0;
    while (attempts < maxAttempts) {
      const r = Math.floor(Math.random() * this.rows);
      const c = Math.floor(Math.random() * this.cols);
      if (!this.cells[r][c].isEnemy) {
        const enemyTypeKey = this.enemyTypes[Math.floor(Math.random() * this.enemyTypes.length)];
        this.cells[r][c].isEnemy = true;
        this.cells[r][c].isElite = true;
        this.cells[r][c].enemyType = ENEMY_TYPES[enemyTypeKey];
        break;
      }
      attempts++;
    }
  }

  placeItems() {
    const pool = this.itemPool || Object.values(ITEM_TYPES);
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const cell = this.cells[r][c];
        if (!cell.isEnemy && cell.danger === 0 && Math.random() < this.itemChance) {
          cell.item = this._levelItem(pool[Math.floor(Math.random() * pool.length)]);
        }
      }
    }
  }

  _levelItem(base) {
    const lv = this.dungeonLevel;
    const extra = Math.max(0, lv - (base.minDungeon || 1));
    const leveled = { ...base, level: lv };
    if (base.category === "equipment") {
      if (base.atk)   { leveled.atk   = base.atk   + extra;     leveled.description = `ATK+${leveled.atk} Lv${lv}`; }
      if (base.maxHp) { leveled.maxHp = base.maxHp + extra * 2; leveled.description = `MaxHP+${leveled.maxHp} Lv${lv}`; }
    } else {
      const val = base.effect.value
        + (base.healScale || 0) * extra
        + (base.atkScale  || 0) * extra;
      leveled.effect = { ...base.effect, value: val };
      leveled.description = base.effect.type === "heal"
        ? `HP+${val}\u56de\u5fa9 Lv${lv}`
        : `ATK+${val} Lv${lv}`;
    }
    return leveled;
  }

  calcDanger() {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        let count = 0;
        for (const [dr, dc] of DIRECTIONS) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols) {
            const nb = this.cells[nr][nc];
            if (nb.isEnemy) count += nb.isElite ? 2 : 1;
          }
        }
        this.cells[r][c].danger = count;
      }
    }
  }

  getNeighbors(cell) {
    const neighbors = [];
    for (const [dr, dc] of DIRECTIONS) {
      const nr = cell.row + dr;
      const nc = cell.col + dc;
      if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols) {
        neighbors.push(this.cells[nr][nc]);
      }
    }
    return neighbors;
  }

  countDanger(r, c) {
    let count = 0;
    for (const [dr, dc] of DIRECTIONS) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nr >= this.rows || nc < 0 || nc >= this.cols) continue;
      const nb = this.cells[nr][nc];
      if (nb.isEnemy) count += nb.isElite ? 2 : 1;
    }
    return count;
  }

}
