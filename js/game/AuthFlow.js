import { Player } from "../core/Player.js";
import { BattleSystem } from "../core/BattleSystem.js";

/**
 * 認証（ログイン・ログアウト・ゲスト）フローを担当するクラス
 */
export class AuthFlow {

  /**
   * @param {object} options
   * @param {import("../core/FirebaseManager.js").FirebaseManager} options.firebaseManager
   * @param {import("../ui/LogUI.js").LogUI} options.logUI
   * @param {import("../ui/ScreenNavigator.js").ScreenNavigator} options.screenNavigator
   * @param {(player: Player, battle: BattleSystem) => void} options.onPlayerLoaded
   * @param {() => void} options.onLoggedOut
   * @param {() => void} options.onGuestPlay
   */
  constructor({
    firebaseManager,
    logUI,
    screenNavigator,
    onPlayerLoaded,
    onLoggedOut,
    onGuestPlay
  }) {
    this.firebaseManager = firebaseManager;
    this.logUI = logUI;
    this.screenNavigator = screenNavigator;
    this.onPlayerLoaded = onPlayerLoaded;
    this.onLoggedOut = onLoggedOut;
    this.onGuestPlay = onGuestPlay;
  }

  /** ログイン・ログアウト・ゲストボタンのイベントを登録 */
  setupButtons() {
    const homeLoginBtn = document.getElementById("home-login-btn");
    const homeGuestBtn = document.getElementById("home-guest-btn");
    const logoutBtn = document.getElementById("logout-btn");
    const dsLoginBtn = document.getElementById("ds-login-btn");

    const doLogin = async () => {
      try {
        await this.firebaseManager.signInWithGoogle();
      } catch (error) {
        console.error(error);
      }
    };

    homeLoginBtn.addEventListener("click", doLogin);
    dsLoginBtn.addEventListener("click", doLogin);

    homeGuestBtn.addEventListener("click", () => {
      this.screenNavigator.showGameScreen();
      this.onGuestPlay();
    });

    logoutBtn.addEventListener("click", async () => {
      try {
        await this.firebaseManager.signOut();
      } catch (error) {
        this.logUI.add("ログアウトに失敗しました");
        console.error(error);
      }
    });
  }

  /** Firebase 認証状態が変わったときの処理 */
  async onUserChanged(user) {
    const logoutBtn = document.getElementById("logout-btn");
    const dsLoginBtn = document.getElementById("ds-login-btn");

    if (user) {
      logoutBtn.style.display = "block";
      dsLoginBtn.style.display = "none";
      this.screenNavigator.showGameScreen();
      this.logUI.add(`ログイン: ${user.displayName || user.email}`);

      try {
        const savedData = await this.firebaseManager.loadUserData();
        if (savedData) {
          const player = new Player(savedData);
          const battle = new BattleSystem(player);
          this.onPlayerLoaded(player, battle);
          this.logUI.add("セーブデータを読み込みました");
        } else {
          this.onGuestPlay();
        }
      } catch (error) {
        console.error("セーブデータ読み込みエラー:", error);
        this.logUI.add("セーブデータの読み込みに失敗しました");
        this.onGuestPlay();
      }
    } else {
      logoutBtn.style.display = "none";
      dsLoginBtn.style.display = "block";
      const player = new Player();
      const battle = new BattleSystem(player);
      this.onLoggedOut(player, battle);
    }
  }
}
