import { DIRECTIONS, ENEMY_TYPES } from "./constants.js";

export class Grid {
  constructor(rows, cols, enemySpawn, enemyTypes = null, dungeonLevel = 1, specialBlocks = null) {
    this.rows = rows;
    this.cols = cols;
    this.enemySpawn = typeof enemySpawn === "number"
      ? { normal: enemySpawn, elite: 1, master: 0 }
      : enemySpawn;
    this.enemyTypes = enemyTypes || Object.keys(ENEMY_TYPES);
    this.dungeonLevel = dungeonLevel;
    this.specialBlocks = specialBlocks || {};
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
          danger: 0,
          specialType: null,
          displayedDanger: 0
        });
      }
      this.cells.push(row);
    }
    this.placeEnemies();
    this.calcDanger();
    this._placeSpecialBlocks();
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

  _placeSpecialBlocks() {
    for (const type of ["fog", "sturdy", "tension", "phantom"]) {
      const count = this.specialBlocks[type] || 0;
      if (!count) continue;
      let placed = 0, attempts = 0;
      const max = this.rows * this.cols * 10;
      while (placed < count && attempts < max) {
        const r = Math.floor(Math.random() * this.rows);
        const c = Math.floor(Math.random() * this.cols);
        const cell = this.cells[r][c];
        if (!cell.isEnemy && !cell.specialType && cell.danger > 0) { cell.specialType = type; placed++; }
        attempts++;
      }
    }
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const cell = this.cells[r][c];
        if      (cell.specialType === "tension") { cell.displayedDanger = this._countDanger2Radius(r, c); }
        else if (cell.specialType === "phantom") { let off = Math.random() < 0.5 ? 1 : -1; if (cell.danger + off < 1) off = 1; cell._phantomOffset = off; cell.displayedDanger = cell.danger + off; }
        else                                      { cell.displayedDanger = cell.danger; }
      }
    }
  }

  recalcSpecialDangers() {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const cell = this.cells[r][c];
        if      (cell.specialType === "fog")     { cell.danger = this.countDanger(r, c); cell.displayedDanger = cell.danger; }
        else if (cell.specialType === "sturdy")  { cell.danger = this.countDanger(r, c); cell.displayedDanger = cell.danger; }
        else if (cell.specialType === "tension") cell.displayedDanger = this._countDanger2Radius(r, c);
        else if (cell.specialType === "phantom") cell.displayedDanger = Math.max(1, cell.danger + (cell._phantomOffset || 1));
      }
    }
  }

  _countDanger2Radius(r, c) {
    let count = 0;
    for (let dr = -2; dr <= 2; dr++) {
      for (let dc = -2; dc <= 2; dc++) {
        if (dr === 0 && dc === 0) continue;
        const nr = r + dr, nc = c + dc;
        if (nr < 0 || nr >= this.rows || nc < 0 || nc >= this.cols) continue;
        const nb = this.cells[nr][nc];
        if (nb.isEnemy) count += nb.isMaster ? 3 : nb.isElite ? 2 : 1;
      }
    }
    return count;
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
