export class ModalUI {
  constructor() {
    this.gameoverModal = document.getElementById("gameover-modal");
    this.gameoverRetryBtn = document.getElementById("gameover-retry-btn");
  }

  showGameOver(onRetry) {
    this.gameoverModal.style.display = "flex";
    this.gameoverRetryBtn.onclick = () => {
      this.gameoverModal.style.display = "none";
      if (onRetry) onRetry();
    };
  }
}
