# 🤖 Discord Bot 設置指南

## 📋 前置要求
- Node.js 16+ 版本
- Discord 帳號
- Discord 伺服器

## 🚀 快速開始

### 1. 安裝依賴
```bash
npm install
```

### 2. 設定環境變數
複製 `.env.example` 為 `.env`：
```bash
cp .env.example .env
```

編輯 `.env` 檔案，填入你的 Discord Bot Token：
```
DISCORD_TOKEN=your_bot_token_here
```

### 3. 取得 Discord Bot Token

1. 前往 [Discord Developer Portal](https://discord.com/developers/applications)
2. 點擊「New Application」建立新應用
3. 給你的應用命名（例：Anime Bot）
4. 進入「Bot」分頁，點擊「Add Bot」
5. 在 TOKEN 區域點擊「Copy」複製 Token
6. **⚠️ 重要：不要將 Token 分享給任何人！**

### 4. 設定 Bot 權限

在 Developer Portal 中：
1. 進入「OAuth2」→「URL Generator」
2. 選擇 **Scopes**：
   - `bot`
3. 選擇 **Permissions**：
   - Send Messages
   - Read Messages/View Channels
   - Read Message History
4. 複製生成的 URL，在瀏覽器中開啟
5. 選擇要邀請機器人的伺服器

### 5. 啟動機器人

**正常運行：**
```bash
npm start
```

**開發模式（自動重啟）：**
```bash
npm run dev
```

## 📝 可用命令

- `!ping` - 檢查機器人是否在線
- `!help` - 顯示幫助訊息
- `!anime` - 動漫相關訊息

## 🔧 自訂機器人

編輯 `bot.js` 檔案來新增自己的命令和功能。

範例：
```javascript
if (message.content === '!mycommand') {
  message.reply('你的回應');
}
```

## 📚 有用的資源

- [discord.js 文檔](https://discord.js.org/)
- [Discord API 文檔](https://discord.com/developers/docs)

## ❓ 常見問題

**Q: 機器人無法登入？**
A: 檢查你的 `.env` 檔案中是否正確填入了 `DISCORD_TOKEN`

**Q: 機器人無法回應訊息？**
A: 確認機器人在伺服器中有足夠的權限

---

祝你使用愉快！🎉
