import { DIRECTIONS, ENEMY_TYPES, ITEM_TYPES } from "./constants.js";

export class Grid {
  constructor(rows, cols, enemyCount, enemyTypes = null, itemChance = 0.1, itemPool = null) {
    this.rows = rows;
    this.cols = cols;
    this.enemyCount = enemyCount;
    this.enemyTypes = enemyTypes || Object.keys(ENEMY_TYPES);
    this.itemChance = itemChance;
    this.itemPool = itemPool;
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
        this.cells[r][c].enemyType = ENEMY_TYPES[enemyTypeKey];
        placed++;
      }
      attempts++;
    }

    if (placed < this.enemyCount) {
      console.warn(`Could only place ${placed} enemies out of ${this.enemyCount}`);
    }
  }

  placeItems() {
    const pool = this.itemPool || Object.values(ITEM_TYPES);
    
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const cell = this.cells[r][c];
        if (!cell.isEnemy && cell.danger === 0 && Math.random() < this.itemChance) {
          cell.item = pool[Math.floor(Math.random() * pool.length)];
        }
      }
    }
  }

  calcDanger() {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        let count = 0;
        for (const [dr, dc] of DIRECTIONS) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols) {
            if (this.cells[nr][nc].isEnemy) count++;
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
      if (this.cells[nr][nc].isEnemy) count++;
    }

    return count;
  }

}
