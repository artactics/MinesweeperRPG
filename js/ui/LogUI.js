export class LogUI {
  constructor() {
    this.el = document.getElementById("log");
  }

  add(message) {
    this.el.textContent += message + "\n";
    this.el.scrollTop = this.el.scrollHeight;
  }

  clear() {
    this.el.textContent = "";
  }
}
