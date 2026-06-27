<?php
// 自動抓取資料夾內的圖片
function getImagesFromFolder($folder) {
    if (!is_dir($folder)) return [];
    $files = scandir($folder);
    $images = [];
    $allowed = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    foreach ($files as $file) {
        $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
        if (in_array($ext, $allowed)) {
            $images[] = $folder . '/' . $file;
        }
    }
    return $images;
}

// 定義分類
$categories = [
    "Arknights" => getImagesFromFolder('arknight'),
    "Project Sekai" => getImagesFromFolder('pjsk'),
    "照片" => getImagesFromFolder('照片'),
    "圖片" => getImagesFromFolder('圖片')
];
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Auto Image Gallery</title>
  <style>
    /* CSS 與你原本的設計一致 */
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #0f0f0f; color: #eee; font-family: sans-serif; min-height: 100vh; }
    header { background: #1a1a2e; padding: 20px 32px; border-bottom: 2px solid #e94560; }
    nav { display: flex; gap: 8px; padding: 16px 32px; background: #16213e; flex-wrap: wrap; }
    button { background: #0f3460; color: #eee; border: none; padding: 8px 20px; border-radius: 20px; cursor: pointer; }
    button.active { background: #e94560; }
    .gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; padding: 32px; }
    .gallery-item { aspect-ratio: 1; overflow: hidden; border-radius: 8px; cursor: pointer; }
    .gallery-item img { width: 100%; height: 100%; object-fit: cover; }
    .lightbox { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.95); z-index: 100; align-items: center; justify-content: center; }
    .lightbox.open { display: flex; }
    .lightbox img { max-width: 90vw; max-height: 85vh; object-fit: contain; }
  </style>
</head>
<body>
  <header><h1>Image Gallery</h1></header>
  <nav>
    <?php foreach ($categories as $name => $imgs): ?>
      <button onclick="show('<?= $name ?>')"><?= $name ?> (<?= count($imgs) ?>)</button>
    <?php endforeach; ?>
  </nav>

  <div id="gallery" class="gallery"></div>
  <div class="lightbox" id="lightbox" onclick="this.classList.remove('open')">
    <img id="lightbox-img" src="" />
  </div>

  <script>
    // 將 PHP 的陣列轉為 JS
    const data = <?= json_encode($categories) ?>;
    
    function show(cat) {
      const g = document.getElementById('gallery');
      g.innerHTML = '';
      data[cat].forEach(src => {
        const div = document.createElement('div');
        div.className = 'gallery-item';
        div.innerHTML = `<img src="${src}" />`;
        div.onclick = () => {
          document.getElementById('lightbox-img').src = src;
          document.getElementById('lightbox').classList.add('open');
        };
        g.appendChild(div);
      });
    }
    // 預設顯示第一個
    show(Object.keys(data)[0]);
  </script>
</body>
</html>
