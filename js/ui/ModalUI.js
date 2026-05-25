export class ModalUI {
  constructor() {
    this.clearModal = document.getElementById("clear-modal");
    this.clearOkBtn = document.getElementById("clear-ok-btn");
    this.gameoverModal = document.getElementById("gameover-modal");
    this.gameoverRetryBtn = document.getElementById("gameover-retry-btn");
  }

  showClear(onClose) {
    this.clearModal.style.display = "flex";
    this.clearOkBtn.onclick = () => {
      this.clearModal.style.display = "none";
      if (onClose) onClose();
    };
  }

  showGameOver(onRetry) {
    this.gameoverModal.style.display = "flex";
    this.gameoverRetryBtn.onclick = () => {
      this.gameoverModal.style.display = "none";
      if (onRetry) onRetry();
    };
  }
}
