export class GridRenderer {
  constructor(grid, root, onLeft, onRight) {
    this.grid = grid;
    this.root = root;
    this.onLeft = onLeft;
    this.onRight = onRight;
  }

  render() {
    this.root.innerHTML = "";
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
      el.textContent = cell.isEnemy ? "✕" : (cell.danger || "");
    } else {
      el.textContent = cell.flagged ? "⚑" : "";
    }
  }
}
