export class Grid {
  constructor(rows, cols, enemyCount) {
    this.rows = rows;
    this.cols = cols;
    this.enemyCount = enemyCount;
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
          revealed: false,
          flagged: false,
          danger: 0
        });
      }
      this.cells.push(row);
    }
    this.placeEnemies();
    this.calcDanger();
  }

  placeEnemies() {
    let placed = 0;
    while (placed < this.enemyCount) {
      const r = Math.floor(Math.random() * this.rows);
      const c = Math.floor(Math.random() * this.cols);
      if (!this.cells[r][c].isEnemy) {
        this.cells[r][c].isEnemy = true;
        placed++;
      }
    }
  }

  calcDanger() {
    const dirs = [
      [-1,-1],[-1,0],[-1,1],
      [0,-1],        [0,1],
      [1,-1],[1,0],[1,1]
    ];
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        let count = 0;
        for (const [dr, dc] of dirs) {
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

  countDanger(r, c) {
    let count = 0;
    const dirs = [
      [-1,-1],[-1,0],[-1,1],
      [0,-1],        [0,1],
      [1,-1],[1,0],[1,1]
    ];

    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nr >= this.rows || nc < 0 || nc >= this.cols) continue;
      if (this.cells[nr][nc].isEnemy) count++;
    }

    return count;
  }

}
