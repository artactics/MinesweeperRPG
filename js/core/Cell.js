export class Cell {
  constructor(row, col) {
    this.row = row;
    this.col = col;
    this.isEnemy = false;
    this.revealed = false;
    this.flagged = false;
    this.danger = 0;

    // UI レイヤーがセットする
    this.element = null;
  }
}
