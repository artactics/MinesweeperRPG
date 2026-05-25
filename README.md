# マインスイーパーRPG

マインスイーパーとRPG要素を組み合わせたブラウザゲームです。

## 機能

- マインスイーパーゲームプレイ
- 敵との戦闘システム
- レベルアップシステム
- アイテム収集・使用
- Firebaseによるユーザーデータ保存（レベル、アイテムなど）

## Firebase設定

このゲームはFirebaseを使用してユーザーデータを保存します。使用するには以下の手順で設定してください：

### 1. Firebaseプロジェクト作成

1. [Firebase Console](https://console.firebase.google.com/) にアクセス
2. 新しいプロジェクトを作成

### 2. Authentication設定

1. Firebase Consoleで「Authentication」を選択
2. 「Sign-in method」タブで「Google」を有効にする

### 3. Firestore設定

1. Firebase Consoleで「Firestore Database」を選択
2. データベースを作成（テストモードでも可）
3. セキュリティルールを設定（開発中はテストモードでOK）

### 4. Firebase設定ファイルの更新

1. Firebase Consoleで「Project Settings」 > 「General」 > 「Your apps」を選択
2. Webアプリを追加（または既存の設定を確認）
3. 表示される設定値を `firebase-config.js` にコピー

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

開発用のセキュリティルール例：

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

## GitHub Pagesデプロイ

### 手動デプロイ

1. GitHubリポジトリを作成
2. コードをプッシュ
3. GitHubリポジトリの「Settings」 > 「Pages」を選択
4. Sourceを「GitHub Actions」または「Deploy from a branch」に設定
5. ブランチを選択（通常は `main` または `gh-pages`）

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

## ゲームプレイ

- **左クリック**: マスを開く
- **右クリック**: 旗を立てる
- 敵マスを開くと戦闘開始
- 敵を倒すと経験値とアイテムがドロップ
- アイテムを使用してステータスを強化

## アイテム

- 🧪 回復薬: HPを10回復
- 💊 超回復薬: HPを20回復
- ⚔️ 攻撃力UP: 攻撃力+3
