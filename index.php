<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>我的相簿庫 (自動讀取版)</title>
    <style>
        body {
            font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
            color: #333;
        }
        h1 { text-align: center; color: #2c3e50; margin-bottom: 40px; }
        h2 { border-bottom: 2px solid #e9ecef; padding-bottom: 10px; margin-top: 40px; color: #495057; }
        .gallery {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        .gallery img {
            width: 100%;
            height: 250px;
            object-fit: cover;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            transition: transform 0.2s;
        }
        .gallery img:hover { transform: scale(1.05); }
        .empty-msg { color: #888; font-style: italic; }
    </style>
</head>
<body>

    <h1>我的專屬相簿庫</h1>

    <?php
    // 定義要讀取的資料夾名稱
    $folders = ['arknight', 'pjsk', '圖片', '照片'];
    // 允許的圖片副檔名
    $allowed_exts = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

    // 迴圈處理每個資料夾
    foreach ($folders as $folder) {
        echo "<h2>" . htmlspecialchars($folder) . "</h2>";
        echo '<div class="gallery">';
        
        $has_images = false;
        
        // 確保資料夾存在才去讀取
        if (is_dir($folder)) {
            // 抓取資料夾內所有檔案
            $files = scandir($folder);
            foreach ($files as $file) {
                $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
                // 如果副檔名符合圖片格式，就輸出 <img> 標籤
                if (in_array($ext, $allowed_exts)) {
                    $has_images = true;
                    // 組合圖片路徑，例如：arknight/image.jpg
                    $filepath = $folder . '/' . $file;
                    echo '<img src="' . htmlspecialchars($filepath) . '" alt="photo" loading="lazy">';
                }
            }
        }
        
        // 如果資料夾裡面沒有圖片，顯示提示
        if (!$has_images) {
            echo '<p class="empty-msg">這個資料夾目前沒有照片喔！</p>';
        }
        
        echo '</div>';
    }
    ?>

</body>
</html>
