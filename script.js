// script.js — 簡單的互動與範例資料
document.addEventListener('DOMContentLoaded',()=>{
  const gallery = document.getElementById('gallery-grid');
  const sample = [
    {title:'風之旅人',desc:'範例作品描述 1'},
    {title:'櫻花下的約定',desc:'範例作品描述 2'},
    {title:'機械之心',desc:'範例作品描述 3'},
    {title:'夜行者',desc:'範例作品描述 4'}
  ];

  sample.forEach(item=>{
    const el = document.createElement('div');
    el.className='card';
    el.innerHTML = `<h4 class="title">${item.title}</h4><p class="desc">${item.desc}</p>`;
    gallery.appendChild(el);
  });

  document.getElementById('cta').addEventListener('click',()=>{
    window.location.hash = '#about';
  });
});
