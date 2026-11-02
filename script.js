(() => {
  "use strict";
  const items = Array.isArray(window.GALLERY_ITEMS) ? window.GALLERY_ITEMS : [];
  const categoryNames = { arknight: "Arknights", pjsk: "Project SEKAI", "圖片": "插畫收藏", "照片": "照片 / 其他" };
  const categoryOrder = ["arknight", "pjsk", "圖片", "照片"];
  const FAVORITES_KEY = "yuki-archive-favorites-v1";
  const THEME_KEY = "yuki-archive-theme-v1";
  const PAGE_SIZE = 48;
  const state = { category: "all", query: "", favoritesOnly: false, sort: "default", filtered: [], activeIndex: 0, limit: PAGE_SIZE };
  const $ = (selector) => document.querySelector(selector);
  const grid = $("#gallery-grid"), categoryFilters = $("#category-filters"), searchInput = $("#search-input"), lightbox = $("#lightbox"), lightboxImage = $("#lightbox-image");

  function readFavorites() {
    try { const saved = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]"); return new Set(Array.isArray(saved) ? saved : []); }
    catch (error) { return new Set(); }
  }
  const favorites = readFavorites();
  const imageUrl = (path) => "./" + path.split("/").map(encodeURIComponent).join("/");
  const displayName = (item) => item.title || item.path.split("/").pop();
  const categoryName = (key) => categoryNames[key] || key;
  function saveFavorites() { try { localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(favorites))); } catch (error) { console.warn("無法儲存收藏清單：", error); } }
  function updateCounters() {
    $("#total-count").textContent = String(items.length);
    $("#category-count").textContent = String(new Set(items.map((item) => item.category)).size);
    $("#hero-favorites-count").textContent = String(favorites.size);
    $("#header-favorites-count").textContent = String(favorites.size);
    $("#current-year").textContent = String(new Date().getFullYear());
  }
  function buildCategoryFilters() {
    categoryFilters.replaceChildren();
    const counts = {};
    items.forEach((item) => { counts[item.category] = (counts[item.category] || 0) + 1; });
    const options = [{ key: "all", label: "全部圖片", count: items.length }].concat(categoryOrder.filter((key) => counts[key]).map((key) => ({ key, label: categoryName(key), count: counts[key] })));
    options.forEach((option) => {
      const button = document.createElement("button");
      button.type = "button"; button.className = "category-button" + (state.category === option.key ? " active" : "");
      button.dataset.category = option.key; button.setAttribute("aria-pressed", state.category === option.key ? "true" : "false");
      button.append(document.createTextNode(option.label));
      const count = document.createElement("span"); count.textContent = String(option.count); button.append(count);
      button.addEventListener("click", () => { state.category = option.key; state.limit = PAGE_SIZE; buildCategoryFilters(); render(); });
      categoryFilters.append(button);
    });
  }
  function getFilteredItems() {
    let result = items.filter((item) => {
      const matchesCategory = state.category === "all" || item.category === state.category;
      const matchesFavorite = !state.favoritesOnly || favorites.has(item.path);
      const haystack = (displayName(item) + " " + categoryName(item.category) + " " + item.path).toLocaleLowerCase();
      return matchesCategory && matchesFavorite && (!state.query || haystack.includes(state.query.toLocaleLowerCase()));
    });
    if (state.sort === "name") result = result.slice().sort((a, b) => displayName(a).localeCompare(displayName(b), "zh-Hant"));
    else if (state.sort === "random") {
      result = result.slice();
      for (let i = result.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [result[i], result[j]] = [result[j], result[i]]; }
    }
    return result;
  }
  function toggleFavorite(item) {
    if (favorites.has(item.path)) favorites.delete(item.path); else favorites.add(item.path);
    saveFavorites(); updateCounters(); render(); if (lightbox.open) updateLightbox();
  }
  function createCard(item, index) {
    const card = document.createElement("article"); card.className = "gallery-card";
    const preview = document.createElement("button"); preview.type = "button"; preview.className = "card-image-button"; preview.setAttribute("aria-label", "放大檢視：" + displayName(item));
    const image = document.createElement("img"); image.src = imageUrl(item.path); image.alt = displayName(item); image.loading = "lazy"; image.decoding = "async"; preview.append(image);
    preview.addEventListener("click", () => openLightbox(index));
    const meta = document.createElement("div"); meta.className = "card-meta";
    const titleWrap = document.createElement("div"); titleWrap.className = "card-title";
    const title = document.createElement("strong"); title.textContent = displayName(item); title.title = displayName(item);
    const category = document.createElement("span"); category.textContent = categoryName(item.category); titleWrap.append(title, category);
    const favorite = document.createElement("button"); favorite.type = "button"; favorite.className = "card-favorite" + (favorites.has(item.path) ? " is-favorite" : "");
    favorite.textContent = favorites.has(item.path) ? "♥" : "♡"; favorite.setAttribute("aria-label", favorites.has(item.path) ? "取消收藏" : "加入收藏"); favorite.setAttribute("aria-pressed", favorites.has(item.path) ? "true" : "false"); favorite.addEventListener("click", () => toggleFavorite(item));
    meta.append(titleWrap, favorite); card.append(preview, meta); return card;
  }
  function render() {
    state.filtered = getFilteredItems(); const visible = state.filtered.slice(0, state.limit); grid.replaceChildren();
    if (!state.filtered.length) {
      const empty = document.createElement("div"); empty.className = "empty-state";
      const title = document.createElement("strong"); title.textContent = state.favoritesOnly ? "還沒有收藏圖片" : "找不到符合條件的圖片";
      const message = document.createElement("span"); message.textContent = state.favoritesOnly ? "按圖片右下角的愛心，就能加入你的收藏清單。" : "試試其他關鍵字，或切換不同分類。";
      empty.append(title, message); grid.append(empty);
    } else { const fragment = document.createDocumentFragment(); visible.forEach((item, index) => fragment.append(createCard(item, index))); grid.append(fragment); }
    $("#result-count").textContent = state.filtered.length + " 張圖片";
    $("#shown-count").textContent = state.filtered.length ? ("顯示 " + visible.length + " / " + state.filtered.length + " 張") : "";
    $("#load-more").hidden = visible.length >= state.filtered.length;
    $("#favorites-filter").classList.toggle("active", state.favoritesOnly);
    $("#favorites-filter").setAttribute("aria-pressed", state.favoritesOnly ? "true" : "false");
    $("#favorites-filter").innerHTML = '<span aria-hidden="true">♡</span> ' + (state.favoritesOnly ? "顯示全部" : "只看收藏");
  }
  function openLightbox(index) { state.activeIndex = index; updateLightbox(); if (typeof lightbox.showModal === "function") lightbox.showModal(); else lightbox.setAttribute("open", ""); }
  function updateLightbox() {
    const item = state.filtered[state.activeIndex]; if (!item) return;
    const url = imageUrl(item.path); lightboxImage.src = url; lightboxImage.alt = displayName(item);
    $("#lightbox-title").textContent = displayName(item); $("#lightbox-category").textContent = categoryName(item.category);
    $("#lightbox-counter").textContent = (state.activeIndex + 1) + " / " + state.filtered.length;
    $("#open-original").href = url; $("#download-image").href = url; $("#download-image").download = displayName(item);
    const isFavorite = favorites.has(item.path); $("#lightbox-favorite").textContent = isFavorite ? "♥" : "♡"; $("#lightbox-favorite").setAttribute("aria-label", isFavorite ? "取消收藏" : "加入收藏");
  }
  function moveLightbox(direction) { if (!state.filtered.length) return; state.activeIndex = (state.activeIndex + direction + state.filtered.length) % state.filtered.length; updateLightbox(); }
  function setFavoritesOnly(enabled) { state.favoritesOnly = enabled; state.limit = PAGE_SIZE; render(); }

  $("#lightbox-close").addEventListener("click", () => lightbox.close());
  $("#lightbox-prev").addEventListener("click", () => moveLightbox(-1));
  $("#lightbox-next").addEventListener("click", () => moveLightbox(1));
  $("#lightbox-favorite").addEventListener("click", () => { const item = state.filtered[state.activeIndex]; if (item) toggleFavorite(item); });
  lightbox.addEventListener("click", (event) => { if (event.target === lightbox) lightbox.close(); });
  $("#favorites-filter").addEventListener("click", () => setFavoritesOnly(!state.favoritesOnly));
  $("#favorites-shortcut").addEventListener("click", () => { setFavoritesOnly(!state.favoritesOnly); $("#gallery").scrollIntoView({ behavior: "smooth" }); });
  $("#hero-favorites").addEventListener("click", () => { setFavoritesOnly(true); $("#gallery").scrollIntoView({ behavior: "smooth" }); });
  searchInput.addEventListener("input", () => { state.query = searchInput.value.trim(); state.limit = PAGE_SIZE; render(); });
  $("#sort-select").addEventListener("change", (event) => { state.sort = event.target.value; state.limit = PAGE_SIZE; render(); });
  $("#load-more").addEventListener("click", () => { state.limit += PAGE_SIZE; render(); });
  $("#theme-toggle").addEventListener("click", () => { document.body.classList.toggle("light-theme"); try { localStorage.setItem(THEME_KEY, document.body.classList.contains("light-theme") ? "light" : "dark"); } catch (error) {} });
  document.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); searchInput.focus(); }
    if (!lightbox.open) return;
    if (event.key === "Escape") lightbox.close(); if (event.key === "ArrowLeft") moveLightbox(-1); if (event.key === "ArrowRight") moveLightbox(1);
  });
  try { if (localStorage.getItem(THEME_KEY) === "light") document.body.classList.add("light-theme"); } catch (error) {}
  const featured = items.find((item) => item.category === "arknight") || items[0]; if (featured) $("#hero-image").src = imageUrl(featured.path);
  updateCounters(); buildCategoryFilters(); render();
})();
