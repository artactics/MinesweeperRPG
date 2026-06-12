# マインスイーパーRPG

マインスイーパーとRPG要素を組み合わせたブラウザゲームです。  
盤面の数字を手がかりに敵の位置を推理しながら、戦闘・レベルアップ・装備強化を楽しめます。

## 主な機能

- マインスイーパー形式の盤面探索
- 敵との턴制戦闘システム（スキル・状態異常あり）
- レベルアップ・ステータス成長
- 8種ダンジョン × 3層（表層／中層／深層）
- 装備品8シリーズ・4スロット（武器／頭／体／脚）
- アイテム7種（回復・状態異常治療・強化）
- 特殊ブロック4種
- Firebaseによるユーザーデータ保存（Googleログイン）

---

## ゲームプレイ

### 基本操作

| 操作 | 内容 |
|------|------|
| 左クリック | マスを開く |
| 右クリック | 旗を立てる／外す |
| フラグモードボタン | フラグモード切替（旗と開放を反転） |

- 数字マスは周囲8マスに存在する敵の数を表示
- 敵マスを開くと戦闘開始
- 全ての敵マスを旗で囲むか倒すとフロアクリア

### 戦闘

- 戦闘はターン制。ATKとHP・MPを管理して戦う
- 敵はそれぞれ固有のスキルを持つ（ドレイン・炎上・凍傷・毒など）
- 戦闘中はインベントリのアイテムを使用可能

---

## ダンジョン

### ダンジョン一覧

| No | ダンジョン名 | 必要Lv | 出現敵 |
|----|-------------|--------|--------|
| 1 | 初心者の洞窟 | 1 | スライム |
| 2 | 森の小道 | 2 | スライム、ゴブリン |
| 3 | ゴブリンの巣窟 | 3 | ゴブリン、オオカミ |
| 4 | オークの要塞 | 4 | オオカミ、オーク |
| 5 | スケルトン墓地 | 5 | オーク、スケルトン |
| 6 | ドラゴンの山脈 | 6 | スケルトン、ドラゴン |
| 7 | 悪魔の領域 | 7 | ドラゴン、デーモン |
| 8 | 魔王の城 | 8 | デーモン |

### 層（レイヤー）

各ダンジョンには **表層・中層・深層** の3層があります。

| 層 | 特徴 |
|----|------|
| 表層 | 1フロア。入門向け |
| 中層 | 2フロア。エリート敵が出現 |
| 深層 | 3フロア。エリート＋マスター敵が出現。報酬大 |

- 層クリア時に EXP・ゴールドを一括獲得
- クリア時に装備品・アイテムがドロップ

---

## 特殊ブロック

| ブロック名 | 表示 | 仕様 |
|-----------|------|------|
| 視界不良 | △（奇数）／□（偶数） | 周囲の敵数の奇偶のみ表示 |
| 頑丈 | 通常表示 | 周囲の安全マスが全て開いてから開放 |
| 緊張感 | 数字 | 周囲2マス分の合計敵数を表示 |
| 幻影 | 数字 | 実際の値±1の誤った数字を表示 |

---

## アイテム

| アイテム名 | 効果 |
|-----------|------|
| 回復薬 | HP回復（ダンジョンLvでスケール） |
| 超回復薬 | HP大回復（ダンジョンLvでスケール） |
| 攻撃力UP | ATK上昇（ダンジョンLvでスケール） |
| 解毒薬 | 毒状態を解除 |
| 解炎薬 | 火傷状態を解除 |
| 解凍薬 | 凍傷状態を解除 |
| マナ薬 | MP回復（ダンジョンLvでスケール） |

---

## 装備品

ダンジョンごとの専用装備シリーズ（各4種：剣／兜／鎧／脚当て）。  
装備にはスキルが付与されており、戦闘で発動します。

| シリーズ | 対象ダンジョン |
|---------|---------------|
| スライムシリーズ | ダンジョン1 |
| ゴブリンシリーズ | ダンジョン2 |
| 狼シリーズ | ダンジョン3 |
| オークシリーズ | ダンジョン4 |
| 亡者シリーズ | ダンジョン5 |
| ドラゴンシリーズ | ダンジョン6 |
| 悪魔シリーズ | ダンジョン7 |
| 魔王シリーズ | ダンジョン8 |

---

## Firebase設定

このゲームはFirebaseを使用してユーザーデータを保存します。

### 1. Firebaseプロジェクト作成

1. [Firebase Console](https://console.firebase.google.com/) にアクセス
2. 新しいプロジェクトを作成

### 2. Authentication設定

1. Firebase Consoleで「Authentication」を選択
2. 「Sign-in method」タブで「Google」を有効にする

### 3. Firestore設定

1. Firebase Consoleで「Firestore Database」を選択
2. データベースを作成（テストモードでも可）
3. セキュリティルールを設定

### 4. Firebase設定ファイルの更新

`firebase-config.js` に設定値をコピーします：

```javascript
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 5. Firestoreセキュリティルール

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## GitHub Pagesデプロイ

### 手動デプロイ

1. GitHubリポジトリを作成してコードをプッシュ
2. 「Settings」 > 「Pages」を選択
3. Sourceを「GitHub Actions」または「Deploy from a branch」に設定

### GitHub Actionsを使用した自動デプロイ

`.github/workflows/deploy.yml` を作成：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/upload-pages-artifact@v2
        with:
          path: '.'
      - uses: actions/deploy-pages@v2
```
