import { DIRECTIONS, ENEMY_TYPES } from "./constants.js";

export class Grid {
  constructor(rows, cols, enemySpawn, enemyTypes = null, dungeonLevel = 1) {
    this.rows = rows;
    this.cols = cols;
    this.enemySpawn = typeof enemySpawn === "number"
      ? { normal: enemySpawn, elite: 1, master: 0 }
      : enemySpawn;
    this.enemyTypes = enemyTypes || Object.keys(ENEMY_TYPES);
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
          revealed: false,
          flagged: false,
          flagType: 0,
          danger: 0
        });
      }
      this.cells.push(row);
    }
    this.placeEnemies();
    this.calcDanger();
  }

  _placeTier(count, isElite, isMaster) {
    const maxAttempts = this.rows * this.cols * 10;
    let placed = 0, attempts = 0;
    while (placed < count && attempts < maxAttempts) {
      const r = Math.floor(Math.random() * this.rows);
      const c = Math.floor(Math.random() * this.cols);
      if (!this.cells[r][c].isEnemy) {
        const key = this.enemyTypes[Math.floor(Math.random() * this.enemyTypes.length)];
        this.cells[r][c].isEnemy  = true;
        this.cells[r][c].isElite  = isElite;
        this.cells[r][c].isMaster = isMaster;
        this.cells[r][c].enemyType = ENEMY_TYPES[key];
        placed++;
      }
      attempts++;
    }
  }

  placeEnemies() {
    const { normal = 0, elite = 0, master = 0 } = this.enemySpawn;
    this._placeTier(normal, false, false);
    this._placeTier(elite,  true,  false);
    this._placeTier(master, false, true);
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
            if (nb.isEnemy) count += nb.isMaster ? 3 : nb.isElite ? 2 : 1;
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
      if (nb.isEnemy) count += nb.isMaster ? 3 : nb.isElite ? 2 : 1;
    }
    return count;
  }

}
