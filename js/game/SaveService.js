/**
 * Firebase へのセーブデータ書き込みを担当するクラス
 * ダンジョン中に拾った装備はクリア前はセーブから除外する
 */
export class SaveService {

  /**
   * @param {object} options
   * @param {import("../core/FirebaseManager.js").FirebaseManager} options.firebaseManager
   * @param {() => import("../core/Player.js").Player} options.getPlayer
   * @param {() => object[]} options.getDungeonEquipmentGained
   * @param {() => boolean} options.getIsInDungeon - ダンジョン攻略中か
   */
  constructor({ firebaseManager, getPlayer, getDungeonEquipmentGained, getIsInDungeon }) {
    this.firebaseManager = firebaseManager;
    this.getPlayer = getPlayer;
    this.getDungeonEquipmentGained = getDungeonEquipmentGained;
    this.getIsInDungeon = getIsInDungeon || (() => false);
  }

  /**
   * プレイヤーデータを Firebase に保存
   * @param {boolean} dungeonClear - ダンジョンクリア時は true（装備を本保存に含める）
   */
  async save(dungeonClear = false) {
    if (!this.firebaseManager.getCurrentUser()) return;

    const player = this.getPlayer();
    let data = player.toJSON();

    // ダンジョン中のダメージ HP はセーブしない（リロード退出時も全回復扱い）
    if (this.getIsInDungeon()) {
      data = { ...data, hp: data.maxHp };
    }

    const dungeonEquipment = this.getDungeonEquipmentGained();

    // クリア前はダンジョン内で拾った装備をセーブデータから除外
    if (!dungeonClear && dungeonEquipment && dungeonEquipment.length > 0) {
      data = { ...data };
      data.equipmentInventory = { ...data.equipmentInventory };
      data.equipped = { ...data.equipped };
      for (const item of dungeonEquipment) {
        if (data.equipmentInventory[item.id]) {
          const cnt = data.equipmentInventory[item.id].count - 1;
          if (cnt <= 0) delete data.equipmentInventory[item.id];
          else {
            data.equipmentInventory[item.id] = {
              ...data.equipmentInventory[item.id],
              count: cnt
            };
          }
        }
        for (const slot of ["weapon", "head", "body", "legs"]) {
          if (data.equipped[slot] && data.equipped[slot].id === item.id) {
            data.equipped[slot] = null;
          }
        }
      }
    }

    await this.firebaseManager.saveUserData(data);
  }
}
