import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
  doc, 
  getDoc, 
  setDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export class FirebaseManager {
  constructor(auth, db) {
    this.auth = auth;
    this.db = db;
    this.user = null;
    this.onUserChange = null;
  }

  init(onUserChange) {
    this.onUserChange = onUserChange;
    onAuthStateChanged(this.auth, (user) => {
      this.user = user;
      if (this.onUserChange) {
        this.onUserChange(user);
      }
    });
  }

  async signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(this.auth, provider);
      return result.user;
    } catch (error) {
      console.error("Google sign-in error:", error);
      throw error;
    }
  }

  async signOut() {
    try {
      await signOut(this.auth);
    } catch (error) {
      console.error("Sign-out error:", error);
      throw error;
    }
  }

  getCurrentUser() {
    return this.user;
  }

  async saveUserData(playerData) {
    if (!this.user) {
      console.warn("No user logged in");
      return;
    }

    const userRef = doc(this.db, "users", this.user.uid);
    const data = {
      uid: this.user.uid,
      displayName: this.user.displayName,
      email: this.user.email,
      lastUpdated: new Date().toISOString(),
      player: {
        level: playerData.level,
        maxHp: playerData.maxHp,
        hp: playerData.hp,
        atk: playerData.atk,
        exp: playerData.exp,
        gold: playerData.gold || 0,
        inventory: playerData.inventory || {},
        equipped: playerData.equipped || { weapon: null, armor: null },
        equipmentInventory: playerData.equipmentInventory || {},
        dungeonStars: playerData.dungeonStars || {}
      }
    };

    try {
      await setDoc(userRef, data, { merge: true });
      console.log("User data saved successfully");
    } catch (error) {
      console.error("Error saving user data:", error);
      throw error;
    }
  }

  async loadUserData() {
    if (!this.user) {
      console.warn("No user logged in");
      return null;
    }

    const userRef = doc(this.db, "users", this.user.uid);
    try {
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        return data.player;
      } else {
        console.log("No user data found");
        return null;
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      throw error;
    }
  }
}
