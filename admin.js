const ADMIN_HASH_KEY = "kittyme-admin-hash-v1";
const ASSETS_KEY = "kittyme-assets-v1";
const SUBMISSIONS_KEY = "kittyme-submissions-v1";
const DELETED_ASSETS_KEY = "kittyme-deleted-assets-v1";
const SOURCE_ATLAS_MIGRATION_KEY = "kittyme-source-atlas-migrated-v1";
const HIDDEN_TYPE_MIGRATION_KEY = "kittyme-hidden-type-migrated-v1";
const DEFAULT_PREVIEW = "assets/asset-placeholder.svg";
const $ = selector => document.querySelector(selector);
const TYPE_OPTIONS = ["光效", "序列", "元素", "循环", "物体", "不展示"];
const TYPE_MIGRATION = { "烟雾": "元素", "粒子": "元素", "能量": "元素", "扭曲": "循环", "其他": "物体" };
const normalizeType = type => TYPE_MIGRATION[type] || type || "物体";
function normalizeLibraryPath(value="") {
  const directoryMap={"光效":"light-effects","序列":"sequences","元素":"elements","循环":"loops","物体":"objects","_source":"hidden","source":"hidden"};
  let result=String(value);
  Object.entries(directoryMap).forEach(([chinese,english])=>{result=result.replace(`assets/library/${chinese}/`,`assets/library/${english}/`)});
  if(result.includes("/kenney-particle-pack/")||!result.match(/^assets\/library\/(?:light-effects|elements|loops|objects)\/(?:circle|dirt|fire|flame|flare|light|magic|muzzle|scorch|scratch|slash|smoke|spark|star|symbol|trace|twirl|window)_\d{2}\.png$/))return result;
  return result.replace(/^(assets\/library\/(?:light-effects|elements|loops|objects)\/)/,"$1kenney-particle-pack/");
}

function ensureSourceAtlases() {
  if(localStorage.getItem(SOURCE_ATLAS_MIGRATION_KEY))return;
  try {
    const saved=JSON.parse(localStorage.getItem(ASSETS_KEY)||"[]");
    const list=Array.isArray(saved)?saved:[];
    const existingIds=new Set(list.map(item=>item.id));
    const deletedValue=JSON.parse(localStorage.getItem(DELETED_ASSETS_KEY)||"[]");
    const deletedIds=new Set(Array.isArray(deletedValue)?deletedValue.map(String):[]);
    const atlases=Array.from({length:7},(_,index)=>{
      const number=String(index).padStart(2,"0");
      return {id:`pixel-fx-atlas-${number}`,name:`像素特效彩色图集 ${number}`,type:"物体",license:"CC0",tags:[],source:"FX Pixel Texture by bdragon1727",sourceUrl:"https://bdragon1727.itch.io/fx-pixel-texture",resolution:"640 × 480",format:"PNG",description:"FX Pixel Texture 的原始彩色贴图合集，尚未设置主要细分类。",image:`assets/library/hidden/fx-pixel-texture/atlases/${number}_Pixel_FX_Texture.png`,createdAt:"2026-07-29",collectedAt:`2026-07-29T17:01:0${index}+08:00`};
    }).filter(item=>!existingIds.has(item.id)&&!deletedIds.has(String(item.id)));
    if(atlases.length)localStorage.setItem(ASSETS_KEY,JSON.stringify([...atlases,...list]));
    localStorage.setItem(SOURCE_ATLAS_MIGRATION_KEY,"1");
  }catch{}
}

ensureSourceAtlases();

function ensureHiddenType() {
  if(localStorage.getItem(HIDDEN_TYPE_MIGRATION_KEY))return;
  try {
    const saved=JSON.parse(localStorage.getItem(ASSETS_KEY)||"[]");
    if(Array.isArray(saved)){
      const updated=saved.map(item=>item.id?.startsWith("pixel-fx-atlas-")&&item.type==="物体"&&!(item.tags||[]).length?{...item,type:"不展示"}:item);
      localStorage.setItem(ASSETS_KEY,JSON.stringify(updated));
    }
    localStorage.setItem(HIDDEN_TYPE_MIGRATION_KEY,"1");
  }catch{}
}

ensureHiddenType();

let assets = readList(ASSETS_KEY);
let submissions = readList(SUBMISSIONS_KEY);
let editorImage = "";
const filterState = {
  submission: { type: "", primary: "" },
  asset: { type: "", primary: "" }
};
const selectedItems = {
  submission: new Set(),
  asset: new Set()
};
const sortNewest = { submission: true, asset: true };

function readList(key) {
  try { const value = JSON.parse(localStorage.getItem(key) || "[]"); return Array.isArray(value) ? value.map(item => ({ ...item, type: normalizeType(item.type), image: normalizeLibraryPath(item.image) })) : []; }
  catch { return []; }
}
function writeList(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function rememberDeletedAssets(ids) {
  try {
    const saved=JSON.parse(localStorage.getItem(DELETED_ASSETS_KEY)||"[]");
    const deleted=new Set(Array.isArray(saved)?saved.map(String):[]);
    ids.forEach(id=>deleted.add(String(id)));
    localStorage.setItem(DELETED_ASSETS_KEY,JSON.stringify([...deleted]));
  }catch{}
}
async function digest(value) {
  if (!globalThis.crypto?.subtle) {
    let fallback = 2166136261;
    for (const char of `kittyme:${value}`) fallback = Math.imul(fallback ^ char.charCodeAt(0), 16777619);
    return `local-${(fallback >>> 0).toString(16)}`;
  }
  const data = new TextEncoder().encode(`kittyme:${value}`);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(hash)].map(byte => byte.toString(16).padStart(2,"0")).join("");
}
function escapeHtml(value="") { return String(value).replace(/[&<>'"]/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[char]); }
function showToast(message) { $("#adminToast p").textContent=message; $("#adminToast").classList.add("show"); clearTimeout(showToast.timer); showToast.timer=setTimeout(()=>$("#adminToast").classList.remove("show"),2200); }

function configureLogin() {
  const firstVisit = !localStorage.getItem(ADMIN_HASH_KEY);
  $("#loginTitle").textContent = firstVisit ? "设置管理密码" : "管理员登录";
  $("#loginHint").textContent = firstVisit ? "首次进入，请设置仅自己知道的管理密码。" : "输入管理密码进入后台。";
  $("#adminPassword").autocomplete = firstVisit ? "new-password" : "current-password";
}
$("#loginForm").addEventListener("submit", async event => {
  event.preventDefault();
  const password = $("#adminPassword").value;
  const hash = await digest(password);
  const saved = localStorage.getItem(ADMIN_HASH_KEY);
  if (!saved) localStorage.setItem(ADMIN_HASH_KEY, hash);
  else if (saved !== hash) { $("#loginHint").textContent="密码不正确，请重试。"; $("#adminPassword").select(); return; }
  $("#loginScreen").hidden=true; $("#adminShell").hidden=false; $("#adminPassword").value=""; render();
});
$("#lockAdmin").addEventListener("click",()=>{ $("#adminShell").hidden=true; $("#loginScreen").hidden=false; configureLogin(); });

function render() {
  submissions = readList(SUBMISSIONS_KEY).filter(item => item.status !== "published");
  assets = readList(ASSETS_KEY);
  $("#pendingCount").textContent=submissions.length; $("#pendingBadge").textContent=submissions.length;
  $("#publicCount").textContent=assets.length; $("#publicBadge").textContent=assets.length;
  $("#uncategorizedBadge").textContent=assets.filter(item=>!primaryCategory(item)).length;
  renderPanel("submission");
  renderPanel("asset");
}
function listForMode(mode) { return mode === "submission" ? submissions : assets; }
function primaryCategory(item) { return Array.isArray(item.tags) && item.tags.length ? String(item.tags[0]).trim() : ""; }
function itemTime(item) {
  const bundledFallback=item.id?.startsWith("pixel-fx-")?"2026-07-29T17:00:00+08:00":item.id?.startsWith("kenney-")?"2026-07-29T15:00:00+08:00":"";
  const timestamp=Date.parse(item.collectedAt||item.submittedAt||bundledFallback||item.createdAt||"");
  return Number.isNaN(timestamp)?0:timestamp;
}
function filteredList(mode) {
  const state=filterState[mode];
  return listForMode(mode).filter(item => {
    const typeMatches=!state.type || normalizeType(item.type)===state.type;
    const primary=primaryCategory(item);
    const primaryMatches=!state.primary || (state.primary==="__none__" ? !primary : primary===state.primary);
    return typeMatches && primaryMatches;
  }).sort((a,b)=>{
    const difference=itemTime(b)-itemTime(a);
    return (sortNewest[mode]?difference:-difference)||String(a.id).localeCompare(String(b.id));
  });
}
function optionHtml(value, label=value) { return `<option value="${escapeHtml(value)}">${escapeHtml(label)}</option>`; }
function renderPanel(mode) {
  const all=listForMode(mode);
  const existingIds=new Set(all.map(item=>String(item.id)));
  selectedItems[mode].forEach(id=>{if(!existingIds.has(id))selectedItems[mode].delete(id)});

  const types=[...new Set([...TYPE_OPTIONS,...all.map(item=>normalizeType(item.type)),filterState[mode].type].filter(Boolean))];
  const primaryValues=[...new Set([...all.map(primaryCategory),filterState[mode].primary!=="__none__"?filterState[mode].primary:""].filter(Boolean))].sort((a,b)=>a.localeCompare(b,"zh-CN"));
  const typeFilter=$(`[data-type-filter="${mode}"]`);
  const primaryFilter=$(`[data-primary-filter="${mode}"]`);
  typeFilter.innerHTML=optionHtml("","全部大类")+types.map(value=>optionHtml(value)).join("");
  primaryFilter.innerHTML=optionHtml("","全部细分类")+(all.some(item=>!primaryCategory(item))?optionHtml("__none__","未分类"):"")+primaryValues.map(value=>optionHtml(value)).join("");
  typeFilter.value=filterState[mode].type;
  primaryFilter.value=filterState[mode].primary;
  $(`#${mode==="submission"?"submission":"asset"}PrimaryList`).innerHTML=primaryValues.map(value=>optionHtml(value)).join("");

  const visible=filteredList(mode);
  const grid=$(mode==="submission"?"#submissionGrid":"#publicGrid");
  const empty=$(mode==="submission"?"#submissionEmpty":"#publicEmpty");
  grid.innerHTML=visible.map(item=>cardHtml(item,mode)).join("");
  empty.hidden=visible.length>0;
  const filtering=Boolean(filterState[mode].type || filterState[mode].primary);
  empty.querySelector("h3").textContent=all.length && filtering ? "没有符合分类的内容" : mode==="submission" ? "投稿都处理完啦" : "还没有展示内容";
  const emptyCopy=empty.querySelector("p");
  if(emptyCopy)emptyCopy.textContent=all.length && filtering ? "可以调整或清除筛选条件。" : "新的投稿会出现在这里。";
  $(`[data-filter-result="${mode}"]`).textContent=filtering ? `显示 ${visible.length} / 共 ${all.length} 项` : `共 ${all.length} 项`;

  const selectedCount=selectedItems[mode].size;
  $(`[data-selected-count="${mode}"]`).textContent=selectedCount;
  $(`[data-apply-bulk="${mode}"]`).disabled=selectedCount===0;
  $(`[data-bulk-delete="${mode}"]`).disabled=selectedCount===0;
  const selectVisible=$(`[data-select-visible="${mode}"]`);
  const visibleSelected=visible.filter(item=>selectedItems[mode].has(String(item.id))).length;
  selectVisible.checked=visible.length>0 && visibleSelected===visible.length;
  selectVisible.indeterminate=visibleSelected>0 && visibleSelected<visible.length;
  selectVisible.disabled=visible.length===0;

  grid.querySelectorAll("[data-review]").forEach(button=>button.addEventListener("click",()=>openEditor("submission",button.dataset.review)));
  grid.querySelectorAll("[data-reject]").forEach(button=>button.addEventListener("click",()=>rejectSubmission(button.dataset.reject)));
  grid.querySelectorAll("[data-edit-asset]").forEach(button=>button.addEventListener("click",()=>openEditor("asset",button.dataset.editAsset)));
  grid.querySelectorAll("[data-card-select]").forEach(input=>input.addEventListener("change",()=>{
    if(input.checked)selectedItems[mode].add(input.value);else selectedItems[mode].delete(input.value);
    renderPanel(mode);
  }));
  enableDragSelection(grid,mode);
}

function enableDragSelection(grid,mode) {
  if(grid.dataset.dragSelectionReady)return;
  grid.dataset.dragSelectionReady="true";
  grid.addEventListener("pointerdown",event=>{
    if(event.button!==0||event.pointerType==="touch"||event.target.closest("button,input,a"))return;
    const cards=[...grid.querySelectorAll(".review-card")];
    if(!cards.length)return;
    const start={x:event.clientX,y:event.clientY};
    const initial=new Set(selectedItems[mode]);
    const additive=event.ctrlKey||event.metaKey;
    const marquee=document.createElement("div");
    marquee.className="selection-marquee";
    document.body.appendChild(marquee);
    grid.classList.add("drag-selecting");
    grid.setPointerCapture(event.pointerId);
    let dragged=false;

    const update=current=>{
      const left=Math.min(start.x,current.x),top=Math.min(start.y,current.y);
      const right=Math.max(start.x,current.x),bottom=Math.max(start.y,current.y);
      marquee.style.cssText=`left:${left}px;top:${top}px;width:${right-left}px;height:${bottom-top}px`;
      const hits=new Set(cards.filter(card=>{
        const rect=card.getBoundingClientRect();
        return rect.right>=left&&rect.left<=right&&rect.bottom>=top&&rect.top<=bottom;
      }).map(card=>card.querySelector("[data-card-select]").value));
      cards.forEach(card=>{
        const input=card.querySelector("[data-card-select]");
        const checked=additive?(initial.has(input.value)!==hits.has(input.value)):hits.has(input.value);
        input.checked=checked;
        card.classList.toggle("selected",checked);
      });
    };
    const move=moveEvent=>{
      if(moveEvent.pointerId!==event.pointerId)return;
      if(Math.hypot(moveEvent.clientX-start.x,moveEvent.clientY-start.y)>5)dragged=true;
      if(dragged){moveEvent.preventDefault();update({x:moveEvent.clientX,y:moveEvent.clientY})}
    };
    const finish=endEvent=>{
      if(endEvent.pointerId!==event.pointerId)return;
      grid.removeEventListener("pointermove",move);
      grid.removeEventListener("pointerup",finish);
      grid.removeEventListener("pointercancel",finish);
      grid.classList.remove("drag-selecting");
      marquee.remove();
      if(!dragged)return;
      selectedItems[mode].clear();
      cards.forEach(card=>{
        const input=card.querySelector("[data-card-select]");
        if(input.checked)selectedItems[mode].add(input.value);
      });
      renderPanel(mode);
    };
    grid.addEventListener("pointermove",move);
    grid.addEventListener("pointerup",finish);
    grid.addEventListener("pointercancel",finish);
  });
}
function cardHtml(item, mode) {
  const image = item.image ? `<img src="${item.image}" alt="${escapeHtml(item.name)}" />` : `<span>程序生成预览</span>`;
  const source = [item.source, item.sourceUrl].filter(Boolean).map(escapeHtml).join("<br>") || "未填写";
  const id=String(item.id);
  const selected=selectedItems[mode].has(id);
  return `<article class="review-card${selected?" selected":""}"><label class="card-selector" title="选择 ${escapeHtml(item.name)}"><input type="checkbox" data-card-select="${mode}" value="${escapeHtml(id)}" ${selected?"checked":""} aria-label="选择 ${escapeHtml(item.name)}" /></label><div class="review-image">${image}</div><div class="review-body"><div class="review-top"><h3>${escapeHtml(item.name)}</h3><span>${escapeHtml(item.license||"待核实")}</span></div><p class="review-meta">${escapeHtml(item.type||"其他")} · ${(item.tags||[]).map(escapeHtml).join(" / ")||"无标签"}</p><div class="review-source"><strong>出处：</strong><br>${source}</div><div class="review-actions">${mode==="submission"?`<button class="reject" data-reject="${escapeHtml(id)}">不收录</button><button class="approve" data-review="${escapeHtml(id)}">审核并发布</button>`:`<button class="edit" data-edit-asset="${escapeHtml(id)}">编辑资料</button>`}</div></div></article>`;
}

document.querySelectorAll("[data-type-filter]").forEach(select=>select.addEventListener("change",()=>{const mode=select.dataset.typeFilter;filterState[mode].type=select.value;renderPanel(mode)}));
document.querySelectorAll("[data-primary-filter]").forEach(select=>select.addEventListener("change",()=>{const mode=select.dataset.primaryFilter;filterState[mode].primary=select.value;renderPanel(mode)}));
document.querySelectorAll("[data-clear-filter]").forEach(button=>button.addEventListener("click",()=>{const mode=button.dataset.clearFilter;filterState[mode]={type:"",primary:""};renderPanel(mode)}));
document.querySelectorAll("[data-admin-sort]").forEach(button=>button.addEventListener("click",()=>{
  const mode=button.dataset.adminSort;
  sortNewest[mode]=!sortNewest[mode];
  button.innerHTML=`${sortNewest[mode]?"最新优先":"最早优先"} <span>${sortNewest[mode]?"↓":"↑"}</span>`;
  renderPanel(mode);
}));
document.querySelectorAll("[data-select-visible]").forEach(input=>input.addEventListener("change",()=>{
  const mode=input.dataset.selectVisible;
  filteredList(mode).forEach(item=>input.checked?selectedItems[mode].add(String(item.id)):selectedItems[mode].delete(String(item.id)));
  renderPanel(mode);
}));
document.querySelectorAll("[data-apply-bulk]").forEach(button=>button.addEventListener("click",()=>applyBulkEdit(button.dataset.applyBulk)));
document.querySelectorAll("[data-bulk-delete]").forEach(button=>button.addEventListener("click",()=>bulkDelete(button.dataset.bulkDelete)));

function bulkDelete(mode) {
  const ids=selectedItems[mode];
  const count=ids.size;
  if(!count)return;
  const target=mode==="submission"?"待审核投稿":"已审核贴图";
  if(!confirm(`确认删除选中的 ${count} 项${target}记录吗？图片文件暂时保留。`))return;
  if(mode==="submission"){
    submissions=submissions.filter(item=>!ids.has(String(item.id)));
    writeList(SUBMISSIONS_KEY,submissions);
  }else{
    assets=assets.filter(item=>!ids.has(String(item.id)));
    writeList(ASSETS_KEY,assets);
    rememberDeletedAssets(ids);
  }
  ids.clear();
  render();
  showToast(`已删除 ${count} 项`);
}

function applyBulkEdit(mode) {
  const type=$(`[data-bulk-type="${mode}"]`).value;
  const primary=$(`[data-bulk-primary="${mode}"]`).value.trim();
  const ids=selectedItems[mode];
  if(!ids.size)return;
  if(!type&&!primary){showToast("请选择要修改的大类或填写主要细分类");return}
  if(!confirm(`确认批量修改选中的 ${ids.size} 项吗？`))return;
  const updated=listForMode(mode).map(item=>{
    if(!ids.has(String(item.id)))return item;
    const record={...item};
    if(type)record.type=type;
    if(primary){
      const tags=Array.isArray(item.tags)?item.tags.map(tag=>String(tag).trim()).filter(Boolean):[];
      record.tags=[primary,...tags.slice(1).filter(tag=>tag!==primary)];
    }
    return record;
  });
  if(mode==="submission"){submissions=updated;writeList(SUBMISSIONS_KEY,submissions)}else{assets=updated;writeList(ASSETS_KEY,assets)}
  const count=ids.size;
  ids.clear();
  $(`[data-bulk-type="${mode}"]`).value="";
  $(`[data-bulk-primary="${mode}"]`).value="";
  render();
  showToast(`已批量更新 ${count} 项`);
}

document.querySelectorAll("[data-admin-tab]").forEach(button=>button.addEventListener("click",()=>{
  document.querySelectorAll("[data-admin-tab]").forEach(item=>item.classList.toggle("active",item===button));
  const tab=button.dataset.adminTab;
  $("#pendingPanel").classList.toggle("active",tab==="pending");
  $("#publicPanel").classList.toggle("active",tab==="public"||tab==="uncategorized");
  if(tab==="uncategorized"){
    filterState.asset={type:"",primary:"__none__"};
    renderPanel("asset");
  }else if(tab==="public"&&filterState.asset.primary==="__none__"){
    filterState.asset.primary="";
    renderPanel("asset");
  }
}));

function openEditor(mode,id) {
  const item=(mode==="submission"?submissions:assets).find(entry=>entry.id===id); if(!item)return;
  $("#editorMode").value=mode; $("#editorId").value=id; $("#editorTitle").textContent=mode==="submission"?"审核并发布":"编辑展示资料";
  $("#editorSubmit").textContent=mode==="submission"?"确认发布":"保存修改"; $("#editorDelete").textContent=mode==="submission"?"不收录":"删除素材";
  $("#editorName").value=item.name||""; $("#editorType").value=normalizeType(item.type); $("#editorLicense").value=item.license||"待核实"; $("#editorTags").value=(item.tags||[]).join(", ");
  $("#editorSource").value=item.source||""; $("#editorSourceUrl").value=item.sourceUrl||""; $("#editorResolution").value=item.resolution||""; $("#editorFormat").value=item.format||""; $("#editorDescription").value=item.description||"";
  editorImage=item.image||""; $("#editorPreview").src=editorImage||DEFAULT_PREVIEW; $("#editorDialog").showModal();
}
function closeEditor(){ $("#editorDialog").close(); }
$("#closeEditor").addEventListener("click",closeEditor); $("#editorCancel").addEventListener("click",closeEditor);
$("#editorImageInput").addEventListener("change",event=>{const file=event.target.files[0];if(!file)return;if(file.size>2*1024*1024){showToast("图片请控制在 2MB 以内");return}const reader=new FileReader();reader.onload=()=>{editorImage=reader.result;$("#editorPreview").src=editorImage;const detector=new Image();detector.onload=()=>{$("#editorResolution").value=`${detector.naturalWidth} × ${detector.naturalHeight}`};detector.src=editorImage};reader.readAsDataURL(file)});
$("#editorForm").addEventListener("submit",event=>{
  event.preventDefault(); const mode=$("#editorMode").value,id=$("#editorId").value; const source=$("#editorSource").value.trim(),sourceUrl=$("#editorSourceUrl").value.trim();
  if(!source&&!sourceUrl){showToast("请填写出处或出处地址");return}
  const old=(mode==="submission"?submissions:assets).find(item=>item.id===id); const record={...old,id:mode==="submission"?`fx-${Date.now().toString(36)}`:id,name:$("#editorName").value.trim(),type:$("#editorType").value,license:$("#editorLicense").value,tags:$("#editorTags").value.split(/[,，]/).map(v=>v.trim()).filter(Boolean),source,sourceUrl,resolution:$("#editorResolution").value.trim()||"未标注",format:$("#editorFormat").value.trim()||"未标注",description:$("#editorDescription").value.trim(),image:editorImage,createdAt:old.createdAt||new Date().toISOString().slice(0,10),collectedAt:mode==="submission"?new Date().toISOString():(old.collectedAt||old.createdAt||new Date().toISOString()),preset:old.preset||"nebula",colors:old.colors||["#ff9fbd","#6957d9","#251d39"]};
  try { if(mode==="submission"){assets.unshift(record);submissions=submissions.filter(item=>item.id!==id);writeList(SUBMISSIONS_KEY,submissions)}else assets=assets.map(item=>item.id===id?record:item);writeList(ASSETS_KEY,assets);closeEditor();render();showToast(mode==="submission"?"已发布到首页":"修改已保存")} catch {showToast("保存失败，浏览器空间可能不足")}
});
$("#editorDelete").addEventListener("click",()=>{const mode=$("#editorMode").value,id=$("#editorId").value;if(!confirm(mode==="submission"?"确认不收录这条投稿吗？":"确认删除这张已审核贴图的记录吗？图片文件暂时保留。"))return;if(mode==="submission"){submissions=submissions.filter(item=>item.id!==id);writeList(SUBMISSIONS_KEY,submissions)}else{assets=assets.filter(item=>item.id!==id);writeList(ASSETS_KEY,assets);rememberDeletedAssets([id])}closeEditor();render();showToast("记录已删除")});
function rejectSubmission(id){if(!confirm("确认不收录这条投稿吗？"))return;submissions=submissions.filter(item=>item.id!==id);writeList(SUBMISSIONS_KEY,submissions);render();showToast("已移出审核队列")}

configureLogin();
