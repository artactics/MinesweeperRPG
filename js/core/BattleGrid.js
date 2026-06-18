export class BattleGrid {
  constructor(mineCount = 2) {
    this.size = 3;
    this.mineCount = Math.min(mineCount, this.size * this.size - 1);
    this._init();
  }

  _init() {
    this.cells = Array.from({ length: this.size }, (_, r) =>
      Array.from({ length: this.size }, (_, c) => ({
        row: r, col: c, isMine: false, danger: 0, revealed: false
      }))
    );

    let placed = 0;
    while (placed < this.mineCount) {
      const r = Math.floor(Math.random() * this.size);
      const c = Math.floor(Math.random() * this.size);
      if (!this.cells[r][c].isMine) {
        this.cells[r][c].isMine = true;
        placed++;
      }
    }

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (!this.cells[r][c].isMine) {
          this.cells[r][c].danger = this._countAdj(r, c);
        }
      }
    }
  }

  _countAdj(row, col) {
    let count = 0;
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const nr = row + dr, nc = col + dc;
        if (nr >= 0 && nr < this.size && nc >= 0 && nc < this.size) {
          if (this.cells[nr][nc].isMine) count++;
        }
      }
    }
    return count;
  }

  reveal(row, col) {
    const cell = this.cells[row][col];
    if (cell.revealed) return { cell: null, gridReset: false };
    cell.revealed = true;
    const allRevealed = this.cells.flat().filter(c => !c.isMine).every(c => c.revealed);
    if (allRevealed) {
      this._init();
      return { cell, gridReset: true };
    }
    return { cell, gridReset: false };
  }
}
