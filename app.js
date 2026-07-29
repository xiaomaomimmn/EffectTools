const STORAGE_KEY = "kittyme-assets-v1";
const LEGACY_STORAGE_KEY = "lumina-assets-v1";
const SUBMISSIONS_KEY = "kittyme-submissions-v1";

const TYPE_MIGRATION = { "烟雾": "元素", "粒子": "元素", "能量": "元素", "扭曲": "循环", "其他": "物体" };
const normalizeType = type => TYPE_MIGRATION[type] || type || "物体";

const seedAssets = [
  { id: "fx-001", name: "星云脉冲", type: "能量", license: "CC0", tags: ["紫色", "星云", "爆发"], source: "Lumina Original", sourceUrl: "https://creativecommons.org/publicdomain/zero/1.0/deed.zh-hans", resolution: "4096 × 4096", format: "PNG", description: "由中心向外扩散的高能星云脉冲，适合作为技能爆发、传送或空间场景的叠加素材。", createdAt: "2026-07-24", preset: "nebula", colors: ["#a43fff", "#321069", "#ff75dc"] },
  { id: "fx-002", name: "日蚀光环", type: "光效", license: "CC0", tags: ["金色", "光环", "日蚀"], source: "Lumina Original", sourceUrl: "https://creativecommons.org/publicdomain/zero/1.0/deed.zh-hans", resolution: "4096 × 4096", format: "PNG", description: "柔和而明亮的环形逆光，可用于太阳、传送门和角色轮廓光。", createdAt: "2026-07-22", preset: "eclipse", colors: ["#ffe167", "#ff9238", "#39190c"] },
  { id: "fx-003", name: "电弧裂隙", type: "能量", license: "CC0", tags: ["蓝色", "闪电", "裂隙"], source: "Lumina Original", sourceUrl: "https://creativecommons.org/publicdomain/zero/1.0/deed.zh-hans", resolution: "2048 × 2048", format: "PNG", description: "锐利的蓝色电弧交错形成空间裂隙，适合科幻与魔法类视觉设计。", createdAt: "2026-07-20", preset: "electric", colors: ["#64ecff", "#126dff", "#061527"] },
  { id: "fx-004", name: "绯红烟幕", type: "烟雾", license: "CC0", tags: ["红色", "烟雾", "氛围"], source: "Lumina Original", sourceUrl: "https://creativecommons.org/publicdomain/zero/1.0/deed.zh-hans", resolution: "4096 × 3072", format: "PNG", description: "层叠翻涌的绯红烟雾，适合作为战斗、灾变和暗黑场景的气氛素材。", createdAt: "2026-07-18", preset: "smoke", colors: ["#ff473d", "#77151c", "#18090b"] },
  { id: "fx-005", name: "翡翠粒子流", type: "粒子", license: "CC0", tags: ["绿色", "粒子", "流动"], source: "Lumina Original", sourceUrl: "https://creativecommons.org/publicdomain/zero/1.0/deed.zh-hans", resolution: "3840 × 2160", format: "PNG", description: "沿曲线运动的翡翠色微粒，可用于治愈、自然能量和数据流动效果。", createdAt: "2026-07-15", preset: "particles", colors: ["#c3ff4f", "#21cc8b", "#06271d"] },
  { id: "fx-006", name: "引力波纹", type: "扭曲", license: "CC0", tags: ["黑白", "波纹", "空间"], source: "Lumina Original", sourceUrl: "https://creativecommons.org/publicdomain/zero/1.0/deed.zh-hans", resolution: "2048 × 2048", format: "PNG", description: "高对比度的同心引力波纹，可作为置换贴图或空间扭曲效果使用。", createdAt: "2026-07-13", preset: "ripple", colors: ["#f4f2df", "#9a9e8d", "#121411"] },
  { id: "fx-007", name: "极光薄雾", type: "烟雾", license: "CC0", tags: ["青色", "极光", "柔光"], source: "Lumina Original", sourceUrl: "https://creativecommons.org/publicdomain/zero/1.0/deed.zh-hans", resolution: "4096 × 2160", format: "PNG", description: "轻盈的青紫色极光薄雾，适用于梦境、冰雪或未来感背景。", createdAt: "2026-07-10", preset: "aurora", colors: ["#77ffe0", "#9275ff", "#071e24"] },
  { id: "fx-008", name: "熔火飞星", type: "粒子", license: "CC0", tags: ["橙色", "火焰", "火星"], source: "Lumina Original", sourceUrl: "https://creativecommons.org/publicdomain/zero/1.0/deed.zh-hans", resolution: "3840 × 2160", format: "PNG", description: "高温火星从熔火核心迸射而出，适合爆炸、锻造和火焰技能。", createdAt: "2026-07-08", preset: "embers", colors: ["#fff273", "#ff6b1c", "#270b05"] }
];

let assets = loadAssets();
try { localStorage.setItem(STORAGE_KEY, JSON.stringify(assets)); } catch {}
let activeType = "全部";
let query = "";
let sortNewest = true;
let selectedId = null;
let pendingImage = "";

const $ = (selector) => document.querySelector(selector);
const grid = $("#assetGrid");
const dialog = $("#assetDialog");
const drawer = $("#adminDrawer");
const backdrop = $("#drawerBackdrop");

function loadAssets() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(LEGACY_STORAGE_KEY);
    const saved = JSON.parse(raw);
    const list = Array.isArray(saved) ? saved : structuredClone(seedAssets);
    return list.map(asset => ({ ...asset, type: normalizeType(asset.type), source: asset.source === "Lumina Original" ? "KITTYME Original" : asset.source }));
  } catch {
    return structuredClone(seedAssets).map(asset => ({ ...asset, type: normalizeType(asset.type), source: "KITTYME Original" }));
  }
}

function persist() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(assets)); }
  catch { showToast("图片太大，浏览器无法继续保存"); }
}

function initGeometry() {
  const layer = $("#geometryLayer");
  if (!layer) return;
  const types = ["triangle", "square", "pentagon", "circle"];
  const selectedType = types[Math.floor(Math.random() * types.length)];
  const colors = ["#9188ff", "#ec6f91", "#47c7b0", "#e2af4e", "#4aa7d6", "#d66e50"];
  const shapes = Array.from({ length: 12 }, () => {
    const shape = document.createElement("span");
    const size = Math.round(46 + Math.random() * 474);
    const rotation = Math.round(Math.random() * 360);
    shape.className = `geo-shape geo-${selectedType}`;
    shape.style.cssText = `left:${-12 + Math.random() * 104}%;top:${-14 + Math.random() * 106}%;width:${size}px;height:${size}px;background:${colors[Math.floor(Math.random() * colors.length)]};opacity:${(.035 + Math.random() * .085).toFixed(3)};transform:rotate(${rotation}deg)`;
    shape.dataset.speed = (-.045 + Math.random() * .09).toFixed(3);
    shape.dataset.rotation = rotation;
    shape.dataset.phase = (Math.random() * Math.PI * 2).toFixed(3);
    shape.dataset.duration = (26 + Math.random() * 34).toFixed(2);
    shape.dataset.driftX = (22 + Math.random() * 76).toFixed(2);
    shape.dataset.driftY = (18 + Math.random() * 64).toFixed(2);
    layer.appendChild(shape);
    return shape;
  });
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const moveShapes = timestamp => {
    const scroll = window.scrollY;
    shapes.forEach(shape => {
      const speed = Number(shape.dataset.speed);
      const phase = Number(shape.dataset.phase);
      const cycle = timestamp / (Number(shape.dataset.duration) * 1000) * Math.PI * 2;
      const driftX = Math.sin(cycle + phase) * Number(shape.dataset.driftX);
      const driftY = Math.cos(cycle * .83 + phase) * Number(shape.dataset.driftY);
      const y = driftY + scroll * speed;
      const x = driftX + scroll * speed * .2;
      const rotation = Number(shape.dataset.rotation) + Math.sin(cycle + phase) * 12 + scroll * speed * .018;
      shape.style.transform = `translate3d(${x}px,${y}px,0) rotate(${rotation}deg)`;
    });
    requestAnimationFrame(moveShapes);
  };
  requestAnimationFrame(moveShapes);
}

function svgData(asset) {
  const [a, b, c] = asset.colors || ["#d8ff45", "#4270ff", "#09100f"];
  const id = asset.id.replace(/[^a-z0-9]/gi, "");
  const defs = `<defs>
    <radialGradient id="bg${id}"><stop stop-color="${b}"/><stop offset=".7" stop-color="${c}"/><stop offset="1" stop-color="#050605"/></radialGradient>
    <radialGradient id="glow${id}"><stop stop-color="#fff"/><stop offset=".2" stop-color="${a}"/><stop offset=".75" stop-color="${b}" stop-opacity=".6"/><stop offset="1" stop-color="${b}" stop-opacity="0"/></radialGradient>
    <filter id="blur${id}"><feGaussianBlur stdDeviation="18"/></filter>
    <filter id="noise${id}"><feTurbulence baseFrequency=".014" numOctaves="4" seed="${asset.name.length * 7}"/><feDisplacementMap in="SourceGraphic" scale="65"/></filter>
    <filter id="soft${id}"><feTurbulence type="fractalNoise" baseFrequency=".009 .02" numOctaves="3" seed="${asset.name.length}"/><feDisplacementMap in="SourceGraphic" scale="90"/><feGaussianBlur stdDeviation="7"/></filter>
  </defs>`;
  const stars = Array.from({length: 44}, (_, i) => {
    const x = (i * 83 + 29) % 800, y = (i * 137 + 51) % 820, r = (i % 5) * .55 + .7;
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="${i%3 ? a : '#fff'}" opacity="${.2 + (i%7)/10}"/>`;
  }).join("");
  let art = "";
  switch (asset.preset) {
    case "eclipse": art = `<circle cx="400" cy="410" r="245" fill="none" stroke="${a}" stroke-width="30" opacity=".2" filter="url(#blur${id})"/><circle cx="400" cy="410" r="220" fill="#090a08" stroke="${a}" stroke-width="7" filter="url(#noise${id})"/><circle cx="400" cy="410" r="237" fill="none" stroke="#fff5b7" stroke-width="2" opacity=".8"/>${stars}`; break;
    case "electric": art = `${stars}<g fill="none" stroke="${a}" filter="url(#blur${id})" opacity=".7"><path d="M40 590 198 524 265 586 337 360 405 430 490 170 545 350 760 243" stroke-width="16"/><path d="M73 240 219 332 316 292 402 498 516 425 733 561" stroke-width="12"/></g><g fill="none" stroke="#d8fbff"><path d="M40 590 198 524 265 586 337 360 405 430 490 170 545 350 760 243" stroke-width="3"/><path d="M73 240 219 332 316 292 402 498 516 425 733 561" stroke-width="2"/></g>`; break;
    case "smoke": art = `<g filter="url(#soft${id})" opacity=".8"><ellipse cx="290" cy="520" rx="260" ry="150" fill="${a}"/><ellipse cx="520" cy="340" rx="230" ry="170" fill="${b}"/><ellipse cx="490" cy="630" rx="330" ry="140" fill="${a}"/><ellipse cx="250" cy="210" rx="180" ry="120" fill="${b}"/></g>`; break;
    case "particles": art = `<path d="M-60 620 C170 350 310 670 490 350 S680 250 870 70" fill="none" stroke="${a}" stroke-width="80" opacity=".18" filter="url(#blur${id})"/>${stars}<path d="M-60 620 C170 350 310 670 490 350 S680 250 870 70" fill="none" stroke="${a}" stroke-width="2" opacity=".6"/>`; break;
    case "ripple": art = `<g fill="none" stroke="${a}" transform="translate(400 420) rotate(-12)" filter="url(#noise${id})">${Array.from({length:12},(_,i)=>`<ellipse rx="${45+i*28}" ry="${20+i*15}" stroke-width="${1+i*.45}" opacity="${1-i*.055}"/>`).join("")}</g><circle cx="400" cy="420" r="24" fill="${a}" filter="url(#blur${id})"/>`; break;
    case "aurora": art = `<g fill="none" filter="url(#soft${id})"><path d="M-50 610 Q180 80 380 380 T850 190" stroke="${a}" stroke-width="100" opacity=".65"/><path d="M-50 300 Q230 650 410 280 T850 420" stroke="${b}" stroke-width="75" opacity=".55"/></g>${stars}`; break;
    case "embers": art = `<ellipse cx="390" cy="590" rx="190" ry="120" fill="url(#glow${id})" filter="url(#blur${id})"/>${stars}<g stroke="${a}" stroke-linecap="round">${Array.from({length:24},(_,i)=>`<path d="M${250+(i*47)%310} ${650-(i%4)*20} q${-100+(i*31)%200} -${120+(i*29)%360} ${-30+(i*17)%70} -${190+(i*37)%400}" stroke-width="${1+i%4}" opacity="${.3+(i%5)/8}"/>`).join("")}</g>`; break;
    default: art = `${stars}<ellipse cx="400" cy="410" rx="230" ry="170" fill="url(#glow${id})" filter="url(#noise${id})"/><ellipse cx="400" cy="410" rx="120" ry="90" fill="#fff" opacity=".25" filter="url(#blur${id})"/>`;
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 820">${defs}<rect width="800" height="820" fill="url(#bg${id})"/>${art}<rect width="800" height="820" fill="none" stroke="#fff" opacity=".08"/></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function imageFor(asset) { return asset.image || svgData(asset); }

function visibleAssets() {
  const normalized = query.trim().toLowerCase();
  return [...assets]
    .filter(asset => activeType === "全部" || asset.type === activeType)
    .filter(asset => !normalized || [asset.name, asset.type, asset.source, ...asset.tags].join(" ").toLowerCase().includes(normalized))
    .sort((a, b) => sortNewest ? b.createdAt.localeCompare(a.createdAt) : a.createdAt.localeCompare(b.createdAt));
}

function render() {
  const list = visibleAssets();
  grid.innerHTML = list.map((asset, i) => `
    <article class="asset-card" tabindex="0" data-id="${asset.id}" aria-label="查看 ${escapeHtml(asset.name)}">
      <div class="card-preview">
        <span class="card-index">${String(i + 1).padStart(2, "0")}</span>
        <span class="card-license">${escapeHtml(asset.license)}</span>
        <img src="${imageFor(asset)}" alt="${escapeHtml(asset.name)} 特效贴图预览" loading="lazy" />
        <span class="card-open">↗</span>
      </div>
      <div class="card-info"><div><h3>${escapeHtml(asset.name)}</h3><p>${asset.tags.slice(0, 3).map(escapeHtml).join(" · ")}</p></div><span>${escapeHtml(asset.type)}</span></div>
    </article>`).join("");
  $("#resultCount").textContent = `${list.length} ITEMS`;
  $("#assetCount").textContent = String(assets.length).padStart(2, "0");
  $("#emptyState").hidden = list.length > 0;
  grid.querySelectorAll(".asset-card").forEach(card => {
    card.addEventListener("click", () => openDetail(card.dataset.id));
    card.addEventListener("keydown", e => { if (e.key === "Enter") openDetail(card.dataset.id); });
  });
}

function openDetail(id) {
  const asset = assets.find(item => item.id === id);
  if (!asset) return;
  selectedId = id;
  $("#detailPreview").style.backgroundImage = `url("${imageFor(asset)}")`;
  $("#detailCode").textContent = asset.id.toUpperCase().replace("FX-", "FX—");
  $("#detailLicense").textContent = asset.license;
  $("#detailName").textContent = asset.name;
  $("#detailDescription").textContent = asset.description || "暂无简介。";
  $("#detailType").textContent = asset.type;
  $("#detailResolution").textContent = asset.resolution || "未标注";
  $("#detailFormat").textContent = asset.format || "未标注";
  $("#detailSource").textContent = asset.source;
  $("#detailTags").innerHTML = asset.tags.map(tag => `<span># ${escapeHtml(tag)}</span>`).join("");
  $("#sourceLink").href = asset.sourceUrl || "#";
  $("#sourceLink").hidden = !asset.sourceUrl;
  dialog.showModal();
}

function openDrawer() {
  selectedId = null;
  pendingImage = "";
  $("#assetForm").reset();
  $("#uploadPreview").hidden = true;
  $("#uploadPreview").removeAttribute("src");
  $("#deleteAsset").hidden = true;
  $("#formHeading").textContent = "投稿一张贴图";
  $("#assetId").value = "";
  drawer.classList.add("open");
  backdrop.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");
  setTimeout(() => $("#assetName").focus(), 350);
}

function closeDrawer() {
  drawer.classList.remove("open");
  backdrop.classList.remove("open");
  drawer.setAttribute("aria-hidden", "true");
}

function submitAsset(event) {
  event.preventDefault();
  const source = $("#assetSource").value.trim();
  const sourceUrl = $("#assetSourceUrl").value.trim();
  if (!pendingImage) { showToast("请先上传贴图图片"); return; }
  if (!source && !sourceUrl) { showToast("请填写素材出处或出处地址"); return; }
  const record = {
    id: `submission-${Date.now().toString(36)}`,
    name: $("#assetName").value.trim(),
    type: $("#assetType").value,
    license: $("#assetLicense").value,
    tags: $("#assetTags").value.split(/[,，]/).map(t => t.trim()).filter(Boolean),
    source,
    sourceUrl,
    resolution: $("#assetResolution").value.trim() || "未标注",
    format: $("#assetFormat").value.trim() || "未标注",
    description: $("#assetDescription").value.trim(),
    image: pendingImage,
    status: "pending",
    submittedAt: new Date().toISOString()
  };
  try {
    const submissions = JSON.parse(localStorage.getItem(SUBMISSIONS_KEY) || "[]");
    submissions.unshift(record);
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(submissions));
  } catch { showToast("图片太大，投稿保存失败"); return; }
  closeDrawer();
  showToast("投稿成功，等待管理员审核");
}

function deleteSelected() {
  const id = $("#assetId").value;
  if (!id || !confirm("确认删除这条素材记录吗？此操作无法撤销。")) return;
  assets = assets.filter(item => item.id !== id);
  persist();
  closeDrawer();
  if (dialog.open) dialog.close();
  render();
  showToast("素材已删除");
}

function randomPalette() {
  const palettes = [["#d8ff45","#2476f4","#071321"],["#ff70b5","#7038e8","#170827"],["#ffdb58","#f05a24","#290b08"],["#68ffe1","#168d8b","#061c1c"]];
  return palettes[Math.floor(Math.random() * palettes.length)];
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>'"]/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[char]);
}

let toastTimer;
function showToast(message) {
  $("#toast p").textContent = message;
  $("#toast").classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $("#toast").classList.remove("show"), 2400);
}

$("#typeFilters").addEventListener("click", event => {
  const button = event.target.closest("button[data-filter]");
  if (!button) return;
  activeType = button.dataset.filter;
  document.querySelectorAll(".filter-pill").forEach(item => item.classList.toggle("active", item === button));
  render();
});
$("#searchInput").addEventListener("input", event => { query = event.target.value; render(); });
$("#sortButton").addEventListener("click", () => {
  sortNewest = !sortNewest;
  $("#sortButton").innerHTML = `${sortNewest ? "最新收录" : "最早收录"} <span>${sortNewest ? "↓" : "↑"}</span>`;
  render();
});
$("#clearFilters").addEventListener("click", () => {
  activeType = "全部"; query = ""; $("#searchInput").value = "";
  document.querySelectorAll(".filter-pill").forEach(item => item.classList.toggle("active", item.dataset.filter === "全部"));
  render();
});
$("#adminButton").addEventListener("click", () => openDrawer());
$("#closeDrawer").addEventListener("click", closeDrawer);
$("#cancelForm").addEventListener("click", closeDrawer);
backdrop.addEventListener("click", closeDrawer);
$("#assetForm").addEventListener("submit", submitAsset);
$("#deleteAsset").addEventListener("click", deleteSelected);
$("#editFromDetail").addEventListener("click", () => { dialog.close(); });
document.querySelectorAll("[data-close-dialog]").forEach(button => button.addEventListener("click", () => dialog.close()));
dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });
$("#assetImage").addEventListener("change", event => {
  const file = event.target.files[0];
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) { showToast("图片请控制在 2MB 以内"); event.target.value = ""; return; }
  const reader = new FileReader();
  reader.onload = () => { pendingImage = reader.result; $("#uploadPreview").src = pendingImage; $("#uploadPreview").hidden = false; };
  reader.readAsDataURL(file);
});
$("#themeToggle").addEventListener("click", () => document.body.classList.toggle("dark"));
document.addEventListener("keydown", event => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); $("#searchInput").focus(); }
  if (event.key === "Escape" && drawer.classList.contains("open")) closeDrawer();
});

initGeometry();
render();
