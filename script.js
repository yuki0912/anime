// script.js — 支援上傳、從 API 取得圖片列表，並提供 Lightbox 檢視
document.addEventListener('DOMContentLoaded',()=>{
  const gallery = document.getElementById('gallery-grid');
  const uploadInput = document.getElementById('photo-input');
  const uploadBtn = document.getElementById('upload-btn');
  const message = document.getElementById('upload-message');

  async function loadPhotos(){
    gallery.innerHTML = '';
    try{
      const res = await fetch('/api/photos');
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0){
        gallery.innerHTML = '<p class="muted">尚無上傳的照片。請使用上方表單上傳。</p>';
        return;
      }
      data.forEach(item=>{
        const el = document.createElement('div');
        el.className = 'card';
        el.innerHTML = `
          <div class="thumb"><img src="${item.url}" alt="${item.filename}" loading="lazy"></div>
          <p class="desc" style="margin-top:8px">${item.filename}</p>
        `;
        el.querySelector('img').addEventListener('click',()=>openLightbox(item.url));
        gallery.appendChild(el);
      });
    }catch(err){
      gallery.innerHTML = '<p class="muted">載入相簿失敗，請稍後再試。</p>';
      console.error(err);
    }
  }

  function openLightbox(url){
    const lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.innerHTML = `<button class="close">關閉</button><img src="${url}">`;
    lb.querySelector('.close').addEventListener('click',()=> lb.remove());
    lb.addEventListener('click', (e)=>{ if(e.target === lb) lb.remove(); });
    document.body.appendChild(lb);
  }

  uploadBtn.addEventListener('click', async ()=>{
    const file = uploadInput.files[0];
    if (!file){ message.textContent = '請先選擇一張圖片。'; return; }
    const allowed = ['image/jpeg','image/png','image/gif','image/webp'];
    if (!allowed.includes(file.type)){ message.textContent = '只接受圖片檔案 (jpg/png/gif/webp)。'; return; }
    const form = new FormData();
    form.append('photo', file);
    uploadBtn.disabled = true;
    message.textContent = '上傳中...';
    try{
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      message.textContent = '上傳成功！';
      uploadInput.value = '';
      await loadPhotos();
    }catch(err){
      console.error(err);
      message.textContent = '上傳失敗，請確認檔案大小與格式後重試。';
    }finally{ uploadBtn.disabled = false; setTimeout(()=>message.textContent='','3500'); }
  });

  document.getElementById('cta').addEventListener('click',()=>{ window.location.hash = '#gallery'; });

  loadPhotos();
});
