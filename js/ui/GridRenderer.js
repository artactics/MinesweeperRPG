export class GridRenderer {
  constructor(grid, root, onLeft, onRight) {
    this.grid = grid;
    this.root = root;
    this.onLeft = onLeft;
    this.onRight = onRight;
  }

  render() {
    this.root.innerHTML = "";
    
    // グリッドサイズに応じてCSSを動的に設定
    this.root.style.gridTemplateColumns = `repeat(${this.grid.cols}, 32px)`;
    this.root.style.gridTemplateRows = `repeat(${this.grid.rows}, 32px)`;
    
    for (let r = 0; r < this.grid.rows; r++) {
      for (let c = 0; c < this.grid.cols; c++) {
        const cell = this.grid.cells[r][c];
        const div = document.createElement("div");
        div.className = "cell";
        div.dataset.row = r;
        div.dataset.col = c;

        // tap→開く（click）、長押し→旗（touchstart/touchend）
        let longPressTimer = null;
        let longPressTriggered = false;

        div.addEventListener("touchstart", () => {
          longPressTriggered = false;
          longPressTimer = setTimeout(() => {
            longPressTriggered = true;
            longPressTimer = null;
            this.onRight(cell);
          }, 500);
        }, { passive: true });
        div.addEventListener("touchmove", () => {
          if (longPressTimer !== null) {
            clearTimeout(longPressTimer);
            longPressTimer = null;
          }
        }, { passive: true });
        div.addEventListener("touchend", e => {
          if (longPressTimer !== null) {
            clearTimeout(longPressTimer);
            longPressTimer = null;
          }
          if (longPressTriggered) {
            e.preventDefault();
            longPressTriggered = false;
          }
        }, { passive: false });
        div.addEventListener("click", () => this.onLeft(cell));
        div.addEventListener("contextmenu", e => {
          e.preventDefault();
          this.onRight(cell);
        });

        cell.element = div;
        this.root.appendChild(div);
      }
    }
  }

  updateCell(cell) {
    const el = cell.element;
    el.classList.toggle("revealed", cell.revealed);
    el.classList.toggle("flagged", cell.flagged);

    if (cell.revealed) {
      if (cell.item) {
        el.textContent = cell.item.emoji;
        el.style.background = "#554433";
      } else {
        el.textContent = cell.isEnemy ? "✕" : (cell.danger || "");
        el.style.background = "";
      }
    } else {
      el.textContent = cell.flagged ? "⚑" : "";
      el.style.background = "";
    }
  }
}
