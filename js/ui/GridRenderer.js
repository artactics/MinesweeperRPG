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

        div.addEventListener("click", () => this.onLeft(cell));
        div.addEventListener("contextmenu", e => {
          e.preventDefault();
          this.onRight(cell);
        });

        // タッチ操作：タップ→開く、長押し→旗
        let pressTimer = null;
        div.addEventListener("touchstart", e => {
          e.preventDefault();
          pressTimer = setTimeout(() => {
            pressTimer = null;
            this.onRight(cell);
          }, 500);
        }, { passive: false });
        div.addEventListener("touchend", () => {
          if (pressTimer !== null) {
            clearTimeout(pressTimer);
            pressTimer = null;
            this.onLeft(cell);
          }
        });
        div.addEventListener("touchmove", () => {
          if (pressTimer !== null) {
            clearTimeout(pressTimer);
            pressTimer = null;
          }
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
