# Yuki Archive — 動漫圖片收藏網站

這是一個可部署到 **GitHub Pages** 的純靜態圖片收藏網站。網站使用 HTML、CSS、原生 JavaScript 和 Python 標準函式庫，不需要 Node.js、Express、SQLite、資料庫或 Discord Bot。

## 網站功能

- Arknights、Project SEKAI、插畫收藏、照片／其他四個分類（即使暫時沒有圖片也會顯示分類）
- 依檔名與分類搜尋、分類篩選、檔名排序、隨機探索
- 瀏覽器本機收藏清單（localStorage）
- 圖片燈箱、上一張／下一張、方向鍵切換
- 開啟原圖、下載圖片、深色／淺色配色
- 桌面與手機響應式版面
- 每次推送 `main` 時，自動掃描圖片資料夾並更新網站圖片清單

## 部署到 GitHub Pages

1. 將 ZIP 解壓縮到你的 `anime` 專案資料夾，允許覆蓋 `index.html`、`styles.css`、`script.js`、`README.md`、`.gitignore`。
2. 確認新增了 `tools/build_gallery.py` 和 `.github/workflows/deploy-pages.yml`。
3. 保留原有的 `arknight/`、`pjsk/`、`圖片/`、`照片/` 資料夾，不要搬移圖片。
4. 在專案資料夾執行以下 Git 指令提交並推送：

   ```bash
   git add index.html styles.css script.js README.md .gitignore tools/build_gallery.py .github/workflows/deploy-pages.yml
   git commit -m "Build static anime gallery for GitHub Pages"
   git push origin main
   ```

5. 開啟 GitHub 儲存庫 **Settings → Pages**，在 **Build and deployment → Source** 選擇 **GitHub Actions**。
6. 到 **Actions** 確認 `Deploy Yuki Anime Gallery` 工作流程成功。

網站網址：<https://yuki0912.github.io/anime/>\n\n目前只有 `照片/` 有圖片；Arknights、Project SEKAI、插畫分類資料夾目前是空的，分類按鈕仍會顯示。舊版素材不在目前 Git 歷史中，需要從原始備份重新上傳。

第一次設定 Pages 發布來源後，往後每次推送到 `main` 都會自動重新部署。

## 新增或移除圖片

把圖片放進 `arknight/`、`pjsk/`、`圖片/` 或 `照片/` 其中一個資料夾。四個分類固定顯示；空分類會提示應放入的資料夾。支援 JPG、JPEG、PNG、GIF、WEBP、AVIF。提交並推送到 `main` 後，GitHub Actions 會執行 `tools/build_gallery.py` 自動產生圖片清單及網站輸出。

## 本機預覽

需要 Python 3。在專案根目錄執行：

```bash
python tools/build_gallery.py
python -m http.server 8000 --directory _site
```

再開啟 <http://localhost:8000/>。

## 靜態網站限制與隱私提醒

- 網站沒有後端及登入系統；GitHub Pages 上的內容是公開網站。
- 網頁不能直接上傳或刪除 GitHub 上的檔案；請透過 GitHub 新增、刪除或提交圖片。
- 收藏與配色只儲存在目前瀏覽器，不會跨裝置或瀏覽器同步。
- 儲存庫目前是公開的；`照片/` 資料夾中的圖片也會隨網站發布。若其中有不適合公開的私人照片，請先從公開儲存庫移除，或從 `tools/build_gallery.py` 的 `CATEGORIES` 清單移除該分類。
- 原有 PHP、Node.js 和 Bot 檔案不會被本網站執行；Pages 工作流程只會打包網站檔案與上述四個圖片資料夾。
