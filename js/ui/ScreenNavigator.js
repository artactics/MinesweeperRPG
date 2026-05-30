import { renderItemIcon } from "./iconBadge.js";

/**
 * 画面の表示切替を担当するクラス
 * DOM の display プロパティのみを操作し、ゲームロジックは持たない
 */
export class ScreenNavigator {

  /** ホーム画面（ログイン前）を表示 */
  showHomeScreen() {
    document.getElementById("home-screen").style.display = "flex";
    document.getElementById("game-screen").style.display = "none";
  }

  /** ゲーム画面（ログイン後・ゲスト）の外枠を表示 */
  showGameScreen() {
    document.getElementById("home-screen").style.display = "none";
    document.getElementById("game-screen").style.display = "block";
  }

  /** ダンジョン選択画面を表示 */
  showDungeonSelect() {
    document.getElementById("dungeon-select-screen").style.display = "block";
    document.getElementById("dungeon-play-screen").style.display = "none";
    document.getElementById("result-screen").style.display = "none";
  }

  /** ダンジョン攻略中の画面を表示 */
  showDungeonPlay() {
    document.getElementById("dungeon-select-screen").style.display = "none";
    document.getElementById("dungeon-play-screen").style.display = "block";
    document.getElementById("result-screen").style.display = "none";
  }

  /**
   * クリア結果画面を表示
   * @param {object} data - クリア報酬の表示用データ
   */
  showResultScreen(data) {
    document.getElementById("dungeon-play-screen").style.display = "none";
    document.getElementById("result-screen").style.display = "flex";

    document.getElementById("result-dungeon-name").textContent = data.dungeonName;

    const details = document.getElementById("result-details");
    details.innerHTML = "";

    const addRow = (labelHtml, value, cls = "") => {
      const row = document.createElement("div");
      row.className = "result-row" + (cls ? " " + cls : "");
      row.innerHTML = `<span>${labelHtml}</span><span>${value}</span>`;
      details.appendChild(row);
    };

    addRow("獲得EXP", `+${data.expGained}`);

    if (data.newLevel > data.prevLevel) {
      addRow(`レベルアップ！`, `Lv ${data.prevLevel} → Lv ${data.newLevel}`, "result-levelup");
    }

    addRow("獲得G", `+${data.clearGold}G`);
    addRow("HP", "全回復");

    const itemIds = Object.keys(data.gainedItems);
    if (itemIds.length > 0) {
      const titleEl = document.createElement("div");
      titleEl.className = "result-section-title";
      titleEl.textContent = "入手アイテム（倉庫へ）";
      details.appendChild(titleEl);
      for (const itemId of itemIds) {
        const item = data.gainedItems[itemId];
        addRow(`${renderItemIcon(item)}<span>${item.name}</span>`, `×${item.count}`);
      }
    }

    if (data.gainedEquipment && data.gainedEquipment.length > 0) {
      const eqTitle = document.createElement("div");
      eqTitle.className = "result-section-title";
      eqTitle.textContent = "入手装備品";
      details.appendChild(eqTitle);
      for (const item of data.gainedEquipment) {
        addRow(`${renderItemIcon(item)}<span>${item.name}</span>`, item.description);
      }
    }
  }
}
