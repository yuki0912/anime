# custom-website — Image upload + gallery

我已為你在 `custom-website` 分支新增上傳與檢視照片的功能。變更檔案：

- server.js — Node/Express + Multer 的簡單上傳伺服器，會把檔案放在 `uploads/`，並提供 `/api/photos` 與 `/api/upload`。
- package.json — 服務所需的套件（express, multer, cors）。
- .gitignore — 排除 node_modules 與 uploads。
- styles.css、script.js、index.html（已更新） — 加入上傳介面、動態載入相片與 lightbox。

如何在本機啟動（快速）：

1. 確認已安裝 Node.js (推薦 v18+)
2. Clone 並切換分支：
   - git clone git@github.com:yuki0912/anime.git
   - cd anime
   - git checkout custom-website
3. 安裝套件並啟動：
   - npm install
   - npm start
4. 開啟瀏覽器： http://localhost:3000

說明與限制：
- 最大單檔 5MB；只接受 jpg/png/gif/webp。
- 上傳檔案會儲存在專案的 uploads 資料夾（請注意備份與存取權限）。
- GitHub Pages 無法直接做上傳（需要伺服器）。若要部署，我可以幫你把此專案部署到像 Render、Railway、Fly 或 Heroku 的平台。

下一步我可以：
- 加入使用者驗證與管理介面（限制誰可上傳/刪除）
- 加入圖片縮圖、壓縮或自動調整尺寸
- 加入刪除功能或標題/描述編輯
- 幫你部署到雲端並設定自訂網域

要我先做哪一項？
