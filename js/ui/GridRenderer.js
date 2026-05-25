export class GridRenderer {
  constructor(grid, root, onLeft, onRight) {
    this.grid = grid;
    this.root = root;
    this.onLeft = onLeft;
    this.onRight = onRight;
  }

  render() {
    this.root.innerHTML = "";

    // モバイルはセルを大きくする
    const cellSize = window.innerWidth <= 600 ? 40 : 32;
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

    // イベント委譲：グリッド全体で一括管理
    let longPressTimer = null;
    let longPressTarget = null;
    let touchMoved = false;
    let touchStartX = 0;
    let touchStartY = 0;

    this.root.addEventListener("touchstart", e => {
      e.preventDefault(); // スクロール・300ms遅延を即座に排除
      const touch = e.touches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
      touchMoved = false;
      const el = document.elementFromPoint(touch.clientX, touch.clientY);
      if (!el || !el.classList.contains("cell")) return;
      longPressTarget = el;
      longPressTimer = setTimeout(() => {
        longPressTimer = null;
        const r = parseInt(longPressTarget.dataset.row);
        const c = parseInt(longPressTarget.dataset.col);
        this.onRight(this.grid.cells[r][c]);
        longPressTarget = null;
      }, 500);
    }, { passive: false });

    this.root.addEventListener("touchmove", e => {
      const dx = e.touches[0].clientX - touchStartX;
      const dy = e.touches[0].clientY - touchStartY;
      if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
        touchMoved = true;
        if (longPressTimer) { clearTimeout(longPressTimer); longPressTimer = null; }
      }
    }, { passive: true });

    this.root.addEventListener("touchend", e => {
      if (longPressTimer) { clearTimeout(longPressTimer); longPressTimer = null; }
      if (!touchMoved && longPressTarget) {
        const r = parseInt(longPressTarget.dataset.row);
        const c = parseInt(longPressTarget.dataset.col);
        this.onLeft(this.grid.cells[r][c]);
      }
      longPressTarget = null;
    }, { passive: true });

    // マウス操作（PC）
    this.root.addEventListener("click", e => {
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
