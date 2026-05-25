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

        // Pointer Events でマウス・タッチ両対応
        // タップ/クリック→開く、長押し/右クリック→旗
        let pressTimer = null;
        let startX = 0;
        let startY = 0;
        let moved = false;

        div.addEventListener("pointerdown", e => {
          e.preventDefault();
          startX = e.clientX;
          startY = e.clientY;
          moved = false;
          pressTimer = setTimeout(() => {
            pressTimer = null;
            this.onRight(cell);
          }, 500);
        });
        div.addEventListener("pointermove", e => {
          if (!moved) {
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
              moved = true;
              if (pressTimer !== null) {
                clearTimeout(pressTimer);
                pressTimer = null;
              }
            }
          }
        });
        div.addEventListener("pointerup", () => {
          if (pressTimer !== null) {
            clearTimeout(pressTimer);
            pressTimer = null;
            if (!moved) this.onLeft(cell);
          }
        });
        div.addEventListener("pointercancel", () => {
          if (pressTimer !== null) {
            clearTimeout(pressTimer);
            pressTimer = null;
          }
        });
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
