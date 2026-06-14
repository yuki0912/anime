const fs = require('fs');
const path = require('path');

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp']);

// 統一標籤與實際資料夾名稱
const CATEGORIES = {
  'Arknights': 'arknight',
  'Project Sekai': 'pjsk',
  '照片': '照片',
  '圖片': '圖片'
};

const result = {};

for (const [label, folder] of Object.entries(CATEGORIES)) {
  result[label] = [];
  try {
    if (fs.existsSync(folder)) {
      const files = fs.readdirSync(folder).sort();
      for (const file of files) {
        const ext = path.extname(file).toLowerCase();
        if (IMAGE_EXTS.has(ext)) {
          // 注意：GitHub Pages 是靜態路徑，這裡不加開頭斜線，使用相對路徑
          result[label].push(`${folder}/${file}`);
        }
      }
    }
  } catch (e) {
    console.error(`讀取 ${folder} 失敗:`, e.message);
  }
}

// 寫入 images.json
fs.writeFileSync('images.json', JSON.stringify(result, null, 2), 'utf8');
console.log('✅ images.json 已成功更新！');