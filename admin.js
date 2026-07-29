const ADMIN_HASH_KEY = "kittyme-admin-hash-v1";
const ASSETS_KEY = "kittyme-assets-v1";
const SUBMISSIONS_KEY = "kittyme-submissions-v1";
const DEFAULT_PREVIEW = "assets/asset-placeholder.svg";
const $ = selector => document.querySelector(selector);
const TYPE_MIGRATION = { "烟雾": "元素", "粒子": "元素", "能量": "元素", "扭曲": "循环", "其他": "物体" };
const normalizeType = type => TYPE_MIGRATION[type] || type || "物体";

let assets = readList(ASSETS_KEY);
let submissions = readList(SUBMISSIONS_KEY);
let editorImage = "";

function readList(key) {
  try { const value = JSON.parse(localStorage.getItem(key) || "[]"); return Array.isArray(value) ? value.map(item => ({ ...item, type: normalizeType(item.type) })) : []; }
  catch { return []; }
}
function writeList(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
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
  $("#submissionEmpty").hidden=submissions.length>0; $("#publicEmpty").hidden=assets.length>0;
  $("#submissionGrid").innerHTML=submissions.map(item=>cardHtml(item,"submission")).join("");
  $("#publicGrid").innerHTML=assets.map(item=>cardHtml(item,"asset")).join("");
  document.querySelectorAll("[data-review]").forEach(button=>button.addEventListener("click",()=>openEditor("submission",button.dataset.review)));
  document.querySelectorAll("[data-reject]").forEach(button=>button.addEventListener("click",()=>rejectSubmission(button.dataset.reject)));
  document.querySelectorAll("[data-edit-asset]").forEach(button=>button.addEventListener("click",()=>openEditor("asset",button.dataset.editAsset)));
}
function cardHtml(item, mode) {
  const image = item.image ? `<img src="${item.image}" alt="${escapeHtml(item.name)}" />` : `<span>程序生成预览</span>`;
  const source = [item.source, item.sourceUrl].filter(Boolean).map(escapeHtml).join("<br>") || "未填写";
  return `<article class="review-card"><div class="review-image">${image}</div><div class="review-body"><div class="review-top"><h3>${escapeHtml(item.name)}</h3><span>${escapeHtml(item.license||"待核实")}</span></div><p class="review-meta">${escapeHtml(item.type||"其他")} · ${(item.tags||[]).map(escapeHtml).join(" / ")||"无标签"}</p><div class="review-source"><strong>出处：</strong><br>${source}</div><div class="review-actions">${mode==="submission"?`<button class="reject" data-reject="${item.id}">不收录</button><button class="approve" data-review="${item.id}">审核并发布</button>`:`<button class="edit" data-edit-asset="${item.id}">编辑资料</button>`}</div></div></article>`;
}

document.querySelectorAll("[data-admin-tab]").forEach(button=>button.addEventListener("click",()=>{
  document.querySelectorAll("[data-admin-tab]").forEach(item=>item.classList.toggle("active",item===button));
  $("#pendingPanel").classList.toggle("active",button.dataset.adminTab==="pending");
  $("#publicPanel").classList.toggle("active",button.dataset.adminTab==="public");
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
$("#editorImageInput").addEventListener("change",event=>{const file=event.target.files[0];if(!file)return;if(file.size>2*1024*1024){showToast("图片请控制在 2MB 以内");return}const reader=new FileReader();reader.onload=()=>{editorImage=reader.result;$("#editorPreview").src=editorImage};reader.readAsDataURL(file)});
$("#editorForm").addEventListener("submit",event=>{
  event.preventDefault(); const mode=$("#editorMode").value,id=$("#editorId").value; const source=$("#editorSource").value.trim(),sourceUrl=$("#editorSourceUrl").value.trim();
  if(!source&&!sourceUrl){showToast("请填写出处或出处地址");return}
  const old=(mode==="submission"?submissions:assets).find(item=>item.id===id); const record={...old,id:mode==="submission"?`fx-${Date.now().toString(36)}`:id,name:$("#editorName").value.trim(),type:$("#editorType").value,license:$("#editorLicense").value,tags:$("#editorTags").value.split(/[,，]/).map(v=>v.trim()).filter(Boolean),source,sourceUrl,resolution:$("#editorResolution").value.trim()||"未标注",format:$("#editorFormat").value.trim()||"未标注",description:$("#editorDescription").value.trim(),image:editorImage,createdAt:old.createdAt||new Date().toISOString().slice(0,10),preset:old.preset||"nebula",colors:old.colors||["#ff9fbd","#6957d9","#251d39"]};
  try { if(mode==="submission"){assets.unshift(record);submissions=submissions.filter(item=>item.id!==id);writeList(SUBMISSIONS_KEY,submissions)}else assets=assets.map(item=>item.id===id?record:item);writeList(ASSETS_KEY,assets);closeEditor();render();showToast(mode==="submission"?"已发布到首页":"修改已保存")} catch {showToast("保存失败，浏览器空间可能不足")}
});
$("#editorDelete").addEventListener("click",()=>{const mode=$("#editorMode").value,id=$("#editorId").value;if(!confirm(mode==="submission"?"确认不收录这条投稿吗？":"确认删除这张已展示的贴图吗？"))return;if(mode==="submission"){submissions=submissions.filter(item=>item.id!==id);writeList(SUBMISSIONS_KEY,submissions)}else{assets=assets.filter(item=>item.id!==id);writeList(ASSETS_KEY,assets)}closeEditor();render();showToast("已删除")});
function rejectSubmission(id){if(!confirm("确认不收录这条投稿吗？"))return;submissions=submissions.filter(item=>item.id!==id);writeList(SUBMISSIONS_KEY,submissions);render();showToast("已移出审核队列")}

configureLogin();
