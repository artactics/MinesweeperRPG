export class GridRenderer {
  constructor(grid, root, onLeft, onRight) {
    this.grid = grid;
    this.root = root;
    this.onLeft = onLeft;
    this.onRight = onRight;
    this._setupEvents();
  }

  _setupEvents() {
    // イベント委譲：グリッド全体で一括管理（一度だけ登録）
    let touchTarget = null;
    let touchMoved = false;
    let touchStartX = 0;
    let touchStartY = 0;

    this._ignoreNextClick = false;

    this.root.addEventListener("touchstart", e => {
      const touch = e.touches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
      touchMoved = false;
      const el = document.elementFromPoint(touch.clientX, touch.clientY);
      touchTarget = (el && el.classList.contains("cell")) ? el : null;
    }, { passive: true });

    this.root.addEventListener("touchmove", e => {
      const dx = e.touches[0].clientX - touchStartX;
      const dy = e.touches[0].clientY - touchStartY;
      if (Math.abs(dx) > 8 || Math.abs(dy) > 8) touchMoved = true;
    }, { passive: true });

    this.root.addEventListener("touchend", () => {
      if (!touchMoved && touchTarget) {
        this._ignoreNextClick = true;
        const r = parseInt(touchTarget.dataset.row);
        const c = parseInt(touchTarget.dataset.col);
        this.onLeft(this.grid.cells[r][c]);
      }
      touchTarget = null;
    }, { passive: true });

    // マウス操作（PC）
    this.root.addEventListener("click", e => {
      if (this._ignoreNextClick) {
        this._ignoreNextClick = false;
        return;
      }
      const el = e.target.closest(".cell");
      if (!el) return;
      const r = parseInt(el.dataset.row);
      const c = parseInt(el.dataset.col);
      this.onLeft(this.grid.cells[r][c]);
    });

    this.root.addEventListener("contextmenu", e => {
      e.preventDefault();
      const el = e.target.closest(".cell");
      if (!el) return;
      const r = parseInt(el.dataset.row);
      const c = parseInt(el.dataset.col);
      this.onRight(this.grid.cells[r][c]);
    });
  }

  render() {
    this.root.innerHTML = "";

    const cellSize = 32;
    this.root.style.gridTemplateColumns = `repeat(${this.grid.cols}, ${cellSize}px)`;
    this.root.style.gridTemplateRows    = `repeat(${this.grid.rows}, ${cellSize}px)`;

    for (let r = 0; r < this.grid.rows; r++) {
      for (let c = 0; c < this.grid.cols; c++) {
        const cell = this.grid.cells[r][c];
        const div = document.createElement("div");
        div.className = "cell";
        div.dataset.row = r;
        div.dataset.col = c;
        div.style.width  = `${cellSize}px`;
        div.style.height = `${cellSize}px`;
        cell.element = div;
        this.root.appendChild(div);
      }
    }
  }

  updateCell(cell) {
    const el = cell.element;
    el.classList.toggle("revealed", cell.revealed);
    el.classList.toggle("flagged", cell.flagged);
    el.classList.remove("flag-1", "flag-2", "flag-3");

    if (cell.revealed) {
      el.textContent = cell.isEnemy ? "✕" : (cell.danger || "");
      el.style.background = "";
    } else if (cell.flagType === 1) {
      el.textContent = "１";
      el.classList.add("flag-1");
    } else if (cell.flagType === 2) {
      el.textContent = "２";
      el.classList.add("flag-2");
    } else if (cell.flagType === 3) {
      el.textContent = "３";
      el.classList.add("flag-3");
    } else {
      el.textContent = "";
      el.style.background = "";
    }
  }
}
