const ADMIN_HASH_KEY = "kittyme-admin-hash-v1";
const ASSETS_KEY = "kittyme-assets-v1";
const SUBMISSIONS_KEY = "kittyme-submissions-v1";
const DELETED_ASSETS_KEY = "kittyme-deleted-assets-v1";
const DELETED_RECORDS_KEY = "kittyme-deleted-records-v1";
const RESOLVED_DELETIONS_KEY = "kittyme-resolved-deletions-v1";
const SOURCE_ATLAS_MIGRATION_KEY = "kittyme-source-atlas-migrated-v1";
const HIDDEN_TYPE_MIGRATION_KEY = "kittyme-hidden-type-migrated-v1";
const DELETION_LEDGER_MIGRATION_KEY = "kittyme-deletion-ledger-migrated-v3";
const UNITY_SMOKE_CC0_MIGRATION_KEY = "mewfx-unity-smoke-cc0-migrated-v2";
const RPICSTER_TAXONOMY_MIGRATION_KEY = "mewfx-rpicster-taxonomy-migrated-v1";
const RPICSTER_CC0_MIGRATION_KEY = "mewfx-rpicster-cc0-migrated-v1";
const OPENGAMEART_CC0_MIGRATION_KEY = "mewfx-opengameart-cc0-migrated-v1";
const PERMANENTLY_DELETED_ASSET_IDS = new Set([
  "fx-001","fx-002","fx-003","fx-004","fx-005","fx-006","fx-007","fx-008",
  "pixel-fx-32x32-grow-08","pixel-fx-32x32-grow-09","pixel-fx-32x32-grow-10","pixel-fx-32x32-grow-11","pixel-fx-32x32-grow-12",
  ...(globalThis.RETIRED_ASSET_IDS || [])
]);
const COLLECTION_ONLY_ASSET_IDS = new Set([
  "cartoon-smoke-chemical-smoke",
  "cartoon-smoke-poisonous-smoke",
  "cartoon-smoke-smoke",
  "cartoon-smoke-smoke-blow",
  "cartoon-smoke-smoke-explosion",
  "cartoon-smoke-smoke-spell"
]);
const PHYSICAL_DELETION_MIGRATION_KEY = "kittyme-physical-deletions-resolved-v1";
const CONTENT_SYNC_CHANNEL_NAME = "mewfx-content-sync-v1";
const CATALOG_URL = "assets/library/catalog.json";
const CATALOG_VERSION = 1;
const DEFAULT_PREVIEW = "assets/asset-placeholder.svg";
const $ = selector => document.querySelector(selector);
let contentSyncChannel = null;
try { if(globalThis.BroadcastChannel)contentSyncChannel=new BroadcastChannel(CONTENT_SYNC_CHANNEL_NAME); } catch {}
function notifyContentChange(key) {
  try { contentSyncChannel?.postMessage({key,changedAt:Date.now()}); } catch {}
  const bridge=document.querySelector("#contentSyncBridge")?.contentWindow;
  if(bridge)bridge.postMessage({type:"mewfx-content-write",key,value:localStorage.getItem(key)||""},"*");
}
const contentSyncBridge=document.querySelector("#contentSyncBridge");
function publishContentToBridge(){
  [ASSETS_KEY,DELETED_ASSETS_KEY,DELETED_RECORDS_KEY].forEach(notifyContentChange);
}
contentSyncBridge?.addEventListener("load",publishContentToBridge);
window.addEventListener("load",publishContentToBridge,{once:true});
const TYPE_OPTIONS = ["光效", "元素", "循环", "序列", "物体", "不展示"];
const SIMPLE_SFX_GROUP_PREFIX = "simple-sfx-group-";
const TYPE_MIGRATION = { "烟雾": "元素", "粒子": "元素", "能量": "元素", "扭曲": "循环", "其他": "物体" };
const normalizeType = type => TYPE_MIGRATION[type] || type || "物体";
const KENNEY_PATTERN_SOURCE = "https://kenney.nl/assets/pattern-pack";
const KENNEY_PATTERN_GROUPS = [
  [1, 6, "条纹图案", "条纹"], [7, 12, "几何线纹", "几何线条"],
  [13, 16, "方格图案", "方格"], [17, 22, "砖墙图案", "砖墙"],
  [23, 24, "装饰纹样", "几何纹样"], [25, 31, "波纹图案", "波纹"],
  [32, 32, "圆点图案", "圆点"], [33, 33, "编织图案", "编织"],
  [34, 34, "星形图案", "星形"], [35, 36, "三角图案", "三角形"],
  [37, 42, "石块图案", "不规则块面"], [43, 45, "碎片图案", "碎片"],
  [46, 46, "星形图案", "星形"], [47, 48, "线框图案", "几何线条"],
  [49, 54, "几何块面", "几何块面"], [55, 56, "粒子方块", "方块粒子"],
  [57, 59, "块面图案", "几何块面"], [60, 68, "菱格图案", "菱格"],
  [69, 71, "圆点图案", "圆点"], [72, 72, "蜂窝图案", "蜂窝"],
  [73, 74, "圆点图案", "圆点"], [75, 75, "心形图案", "心形"],
  [76, 76, "方块图案", "方块"], [77, 77, "圆点网络", "圆点"],
  [78, 78, "菱格图案", "菱格"], [79, 80, "有机网格", "有机网格"],
  [81, 82, "粒子方块", "方块粒子"], [83, 83, "波纹图案", "波纹"],
  [84, 84, "交叉图案", "交叉"]
];
function createKenneyPatternAssets() {
  return Array.from({length:84},(_,index)=>{
    const value=index+1,number=String(value).padStart(2,"0"),hour=String(12+Math.floor(index/60)).padStart(2,"0"),minute=String(index%60).padStart(2,"0");
    const group=KENNEY_PATTERN_GROUPS.find(([from,to])=>value>=from&&value<=to);
    return {id:`kenney-pattern-${number}`,name:`${group[2]} ${number}`,type:"循环",license:"CC0",tags:[group[3],"无缝图案","黑白"],source:"Kenney Pattern Pack",sourceUrl:KENNEY_PATTERN_SOURCE,resolution:"256 × 256",format:"PNG",description:"来自 Kenney Pattern Pack 的 CC0 无缝图案，可平铺用于材质、背景及循环纹理。",image:`assets/library/loops/kenney-pattern-pack/pattern_${number}.png`,createdAt:"2026-08-03",collectedAt:`2026-08-03T${hour}:${minute}:00+08:00`};
  });
}
const KENNEY_SPLAT_SOURCE = "https://kenney.nl/assets/splat-pack";
const KENNEY_SPLAT_RADIAL = new Set([0,1,2,10,11,18,19,20,26,27,28,29,30,31,32,33,34,35]);
function createKenneySplatAssets() {
  return Array.from({length:36},(_,index)=>{
    const number=String(index).padStart(2,"0"),variant=KENNEY_SPLAT_RADIAL.has(index)?"放射飞溅":"圆润墨渍";
    return {id:`kenney-splat-${number}`,name:`${variant} ${number}`,type:"元素",license:"CC0",tags:["溅射",variant,"透明背景"],source:"Kenney Splat Pack",sourceUrl:KENNEY_SPLAT_SOURCE,resolution:"512 × 512",format:"PNG",description:"来自 Kenney Splat Pack 的 CC0 透明背景溅射贴图，适用于液体、墨迹、污渍与击中特效。",image:`assets/library/elements/kenney-splat-pack/splat${number}.png`,createdAt:"2026-08-03",collectedAt:`2026-08-03T14:${number}:00+08:00`};
  });
}
const KENNEY_LIGHT_MASK_SOURCE = "https://kenney.nl/assets/light-masks";
function createKenneyLightMaskAssets() {
  const files=[];
  const add=(prefix,letters,variants,label,tag)=>{for(const letter of letters)for(const variant of variants)files.push({file:`${prefix}_${letter}${variant?`_${variant}`:""}`,label,tag,variant})};
  add("circle","abcd",["","noise","streaks","streaks_noise"],"圆形光照","圆形光照");
  add("circle_rings","abcd",["","noise","streaks"],"同心光环","同心光环");
  add("cone","abcde",["","blur","blur_noise","noise"],"锥形光束","光束");
  add("cone_composed","abcdef",["","noise"],"组合光束","光束");
  add("fan","abcd",["","blur","gradient"],"扇叶光影","扇形光影");
  add("foliage_canopy","abc",["","blur","noise"],"树叶光斑","植被光影");
  add("foliage_canopy","d",["","noise"],"树叶光斑","植被光影");
  add("ring","abc",["","noise","streaks"],"环形光晕","光环");
  add("shape","abcdefg",[""],"柔光形状","柔光");
  add("streaks_composed","abcdefgh",["","noise"],"组合星芒","星芒");
  add("water_caustics","abcd",[""],"水波焦散","水波焦散");
  add("window","abcdefghijk",["","blur","noise"],"窗格投影","窗格光影");
  const variantLabels={"":"基础",noise:"噪点",streaks:"放射纹",streaks_noise:"放射纹噪点",blur:"柔化",blur_noise:"柔化噪点",gradient:"渐变"};
  return files.map((item,index)=>{const number=String(index+1).padStart(3,"0");return {id:`kenney-light-mask-${number}`,name:`${item.label} ${number}`,type:"光效",license:"CC0",tags:[item.tag,variantLabels[item.variant],"透明背景"],source:"Kenney Light Masks",sourceUrl:KENNEY_LIGHT_MASK_SOURCE,resolution:"512 × 512",format:"PNG",description:"来自 Kenney Light Masks 的 CC0 光照遮罩，可用于灯光投影、光束、光晕与环境光影效果。",image:`assets/library/light-effects/kenney-light-masks/${item.file}.png`,createdAt:"2026-08-03",collectedAt:`2026-08-03T15:${String(index%60).padStart(2,"0")}:${String(Math.floor(index/60)).padStart(2,"0")}+08:00`}});
}
const BDRAGON_750_SOURCE = "https://bdragon1727.itch.io/750-effect-and-fx-pixel-all";
const BDRAGON_750_PARTS = {
  1:[3,4,5,6,13,14,15,16,23,24,25,26],2:[62,63,64,65,69,70,71,72,76,77,78,79],3:[113,114,115,116,123,124,125,126,133,134,135,136],4:[174,175,176,177,184,185,186,187,194,195,196,197],5:[220,221,222,223,230,231,232,233,240,241,242,243],6:[273,274,275,276,283,284,285,286,293,294,295,296],7:[313,314,315,316,323,324,325,326,333,334,335,336],8:[375,376,377,378,385,386,387,388,395,396,397,398],9:[426,427,428,429,436,437,438,439,446,447,448,449],10:[464,465,466,467,474,475,476,477,484,485,486,487],11:[506,507,508,509,516,517,518,519,526,527,528,529],12:[566,567,568,569,576,577,578,579,586,587,588,589],13:[612,613,614,615,622,623,624,625,632,633,634,635],14:[652,653,654,655,662,663,664,665,672,673,674,675],15:[700,701,702,703,710,711,712,713,720,721,722,723]
};
const BDRAGON_750_WIDTHS = {
  320:[223,230],384:[323],448:[63,315],512:[62,64,65,220,241,273,274,275,276,284,285,313,316,324,325,326,336,375,376,377,378,385,387,396,427],576:[70,222,231,232,283,286,293,294,295,296,314,333,334,335,386,388,395,397,398,436,447,449,526],640:[69,71,72,174,175,176,221,233,240,242,243,426,428,429,437,438,439,446,448],704:[76,78,177,184,464,466,467,474,487,506,578],768:[77,79,113,114,115,116,123,124,125,126,133,134,135,136,185,186,187,194,465,475,476,477,484,485,486,507,516,517,518,519],832:[3,13,508,509,527,528,529,566,567,569,587,623],896:[4,5,14,15,16,23,24,25,26,195,196,197,568,576,577,579,586,588,589,614,615,622,624,632,635,672],960:[6,612,613,625,633,634,655,662],1024:[652,663,664,665],1088:[653,654,702],1152:[673,674,710],1216:[675,701],1280:[711,720],1344:[712],1408:[700,703,721],1472:[713,722,723]
};
const BDRAGON_750_WIDTH_BY_ID=new Map(Object.entries(BDRAGON_750_WIDTHS).flatMap(([width,ids])=>ids.map(id=>[id,Number(width)])));
function createBdragon750SequenceAssets(){return []}
const codeManuVfxAssets = globalThis.CODEMANU_VFX_ASSETS || [];
const unityWispySmokeAssets = globalThis.UNITY_WISPY_SMOKE_ASSETS || [];
const rpicsterVfxAssets = globalThis.RPICSTER_VFX_ASSETS || [];
const gothicvaniaMagicAssets = globalThis.GOTHICVANIA_MAGIC_ASSETS || [];
const hitAnimationAssets = globalThis.HIT_ANIMATION_ASSETS || [];
const fireSmokeAnimationAssets = globalThis.FIRE_SMOKE_ANIMATION_ASSETS || [];
const lensFlareParticleAssets = globalThis.LENS_FLARE_PARTICLE_ASSETS || [];
const fxChargeAssets = globalThis.FX_CHARGE_ASSETS || [];
const kronbitsParticleAssets = globalThis.KRONBITS_PARTICLE_ASSETS || [];
function normalizeLibraryPath(value="") {
  const directoryMap={"光效":"light-effects","序列":"sequences","元素":"elements","循环":"loops","物体":"objects","_source":"hidden","source":"hidden"};
  let result=String(value);
  Object.entries(directoryMap).forEach(([chinese,english])=>{result=result.replace(`assets/library/${chinese}/`,`assets/library/${english}/`)});
  if(result.includes("/kenney-particle-pack/")||!result.match(/^assets\/library\/(?:light-effects|elements|loops|objects)\/(?:circle|dirt|fire|flame|flare|light|magic|muzzle|scorch|scratch|slash|smoke|spark|star|symbol|trace|twirl|window)_\d{2}\.png$/))return result;
  return result.replace(/^(assets\/library\/(?:light-effects|elements|loops|objects)\/)/,"$1kenney-particle-pack/");
}

function knownBundledAssetIds() {
  const kenneyGroups={circle:5,dirt:3,fire:2,flame:6,flare:1,light:3,magic:5,muzzle:5,scorch:3,scratch:1,slash:4,smoke:10,spark:7,star:9,symbol:2,trace:7,twirl:3,window:4};
  const pixelGroups={"16x16-fx":9,"32x16-fx":8,"32x32-arcane":17,"32x32-circle":14,"32x32-grow":13,"32x32-impact":14,"32x32-star":11,"48x48-fx":7,"48x48-light":12,"64x64-aura":10,"64x64-fx":17};
  return [
    ...Object.entries(kenneyGroups).flatMap(([group,count])=>Array.from({length:count},(_,index)=>`kenney-${group}-${String(index+1).padStart(2,"0")}`)),
    ...Object.entries(pixelGroups).flatMap(([group,count])=>Array.from({length:count},(_,index)=>`pixel-fx-${group}-${String(index+1).padStart(2,"0")}`))
  ];
}

function migrateDeletionLedger() {
  if(localStorage.getItem(DELETION_LEDGER_MIGRATION_KEY))return;
  try {
    const raw=localStorage.getItem(ASSETS_KEY);
    const parsed=raw===null?null:JSON.parse(raw);
    const hasSavedAssets=Array.isArray(parsed)&&parsed.length>0;
    const defaultTests=[
      ["fx-001","星云脉冲"],["fx-002","日蚀光环"],["fx-003","电弧裂隙"],["fx-004","绯红烟幕"],
      ["fx-005","翡翠粒子流"],["fx-006","引力波纹"],["fx-007","极光薄雾"],["fx-008","熔火飞星"]
    ].map(([id,name])=>({id,name,image:"",type:"",source:"MewFX Original / 默认测试贴图",sourceUrl:"",deletedAt:""}));
    let active=Array.isArray(parsed)?parsed:[];
    const testIds=PERMANENTLY_DELETED_ASSET_IDS;
    const withoutTests=active.filter(item=>!testIds.has(String(item.id)));
    if(Array.isArray(parsed)&&withoutTests.length!==active.length)localStorage.setItem(ASSETS_KEY,JSON.stringify(withoutTests));
    active=withoutTests;
    const activeIds=new Set(active.map(item=>String(item.id)));
    const recovered=hasSavedAssets?knownBundledAssetIds().filter(id=>!activeIds.has(id)).map(inferDeletedRecord):[];
    const forced=[...PERMANENTLY_DELETED_ASSET_IDS].filter(id=>id.startsWith("pixel-fx-")).map(inferDeletedRecord);
    rememberDeletedAssets([...defaultTests,...forced,...recovered]);
    localStorage.setItem(DELETION_LEDGER_MIGRATION_KEY,"1");
  }catch{}
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

migrateDeletionLedger();
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

function ensureKenneyPatternPack() {
  try {
    const saved=JSON.parse(localStorage.getItem(ASSETS_KEY)||"[]");
    const list=Array.isArray(saved)?saved:[];
    const existingIds=new Set(list.map(item=>String(item.id)));
    const deletedValue=JSON.parse(localStorage.getItem(DELETED_ASSETS_KEY)||"[]");
    const deletedIds=new Set(Array.isArray(deletedValue)?deletedValue.map(String):[]);
    const additions=createKenneyPatternAssets().filter(item=>!existingIds.has(item.id)&&!deletedIds.has(item.id));
    if(additions.length)localStorage.setItem(ASSETS_KEY,JSON.stringify([...list,...additions]));
  }catch{}
}

ensureKenneyPatternPack();

function ensureKenneySplatPack() {
  try {
    const saved=JSON.parse(localStorage.getItem(ASSETS_KEY)||"[]");
    const list=Array.isArray(saved)?saved:[];
    const existingIds=new Set(list.map(item=>String(item.id)));
    const deletedValue=JSON.parse(localStorage.getItem(DELETED_ASSETS_KEY)||"[]");
    const deletedIds=new Set(Array.isArray(deletedValue)?deletedValue.map(String):[]);
    const additions=createKenneySplatAssets().filter(item=>!existingIds.has(item.id)&&!deletedIds.has(item.id));
    if(additions.length)localStorage.setItem(ASSETS_KEY,JSON.stringify([...list,...additions]));
  }catch{}
}

ensureKenneySplatPack();

function ensureKenneyLightMasks() {
  try {
    const saved=JSON.parse(localStorage.getItem(ASSETS_KEY)||"[]");
    const list=Array.isArray(saved)?saved:[];
    const existingIds=new Set(list.map(item=>String(item.id)));
    const deletedValue=JSON.parse(localStorage.getItem(DELETED_ASSETS_KEY)||"[]");
    const deletedIds=new Set(Array.isArray(deletedValue)?deletedValue.map(String):[]);
    const additions=createKenneyLightMaskAssets().filter(item=>!existingIds.has(item.id)&&!deletedIds.has(item.id));
    if(additions.length)localStorage.setItem(ASSETS_KEY,JSON.stringify([...list,...additions]));
  }catch{}
}

ensureKenneyLightMasks();

function ensureBdragon750Sequences(){
  try{
    const saved=JSON.parse(localStorage.getItem(ASSETS_KEY)||"[]"),list=Array.isArray(saved)?saved:[],base=list.filter(item=>!String(item.id).startsWith("bdragon-750-sequence-")&&item.id!=="bdragon-750-source"),existingIds=new Set(base.map(item=>String(item.id)));
    const deletedValue=JSON.parse(localStorage.getItem(DELETED_ASSETS_KEY)||"[]"),deletedIds=new Set(Array.isArray(deletedValue)?deletedValue.map(String):[]);
    const additions=createBdragon750SequenceAssets().filter(item=>!existingIds.has(item.id)&&!deletedIds.has(item.id));
    if(additions.length||base.length!==list.length)localStorage.setItem(ASSETS_KEY,JSON.stringify([...base,...additions]));
  }catch{}
}

ensureBdragon750Sequences();

function ensureCodeManuVfxPack() {
  try {
    const list=readList(ASSETS_KEY),existingIds=new Set(list.map(item=>String(item.id)));
    const deletedValue=JSON.parse(localStorage.getItem(DELETED_ASSETS_KEY)||"[]"),deletedIds=new Set(Array.isArray(deletedValue)?deletedValue.map(String):[]);
    const additions=codeManuVfxAssets.filter(item=>!existingIds.has(item.id)&&!deletedIds.has(item.id));
    if(additions.length)writeList(ASSETS_KEY,[...list,...additions]);
  } catch {}
}

ensureCodeManuVfxPack();

function ensureUnityWispySmokePack() {
  try {
    let list=readList(ASSETS_KEY);
    if(!localStorage.getItem(UNITY_SMOKE_CC0_MIGRATION_KEY)){
      const currentById=new Map(unityWispySmokeAssets.map(item=>[String(item.id),item]));
      list=list.map(item=>{
        const current=currentById.get(String(item.id));
        if(!current)return item;
        const {lightPreview,downloadDisabled,...legacy}=item;
        return {...legacy,...current};
      });
      localStorage.setItem(UNITY_SMOKE_CC0_MIGRATION_KEY,"1");
    }
    const existingIds=new Set(list.map(item=>String(item.id)));
    const deletedValue=JSON.parse(localStorage.getItem(DELETED_ASSETS_KEY)||"[]"),deletedIds=new Set(Array.isArray(deletedValue)?deletedValue.map(String):[]);
    const additions=unityWispySmokeAssets.filter(item=>!existingIds.has(item.id)&&!deletedIds.has(item.id));
    if(additions.length||list.some(item=>String(item.id).startsWith("unity-wispy-smoke-")))writeList(ASSETS_KEY,[...list,...additions]);
  } catch {}
}

ensureUnityWispySmokePack();

function ensureRpicsterVfxPack() {
  try {
    let list=readList(ASSETS_KEY);
    if(!localStorage.getItem(RPICSTER_TAXONOMY_MIGRATION_KEY)){
      const currentById=new Map(rpicsterVfxAssets.map(item=>[String(item.id),item]));
      list=list.map(item=>{
        const current=currentById.get(String(item.id));
        return current?{...item,tags:current.tags,primaryTags:current.primaryTags,secondaryTags:current.secondaryTags}:item;
      });
      localStorage.setItem(RPICSTER_TAXONOMY_MIGRATION_KEY,"1");
    }
    if(!localStorage.getItem(RPICSTER_CC0_MIGRATION_KEY)){
      const currentById=new Map(rpicsterVfxAssets.map(item=>[String(item.id),item]));
      list=list.map(item=>{
        const current=currentById.get(String(item.id));
        if(!current)return item;
        const {downloadDisabled,...legacy}=item;
        return {...legacy,...current};
      });
      localStorage.setItem(RPICSTER_CC0_MIGRATION_KEY,"1");
    }
    const existingIds=new Set(list.map(item=>String(item.id)));
    const deletedValue=JSON.parse(localStorage.getItem(DELETED_ASSETS_KEY)||"[]"),deletedIds=new Set(Array.isArray(deletedValue)?deletedValue.map(String):[]);
    const additions=rpicsterVfxAssets.filter(item=>!existingIds.has(item.id)&&!deletedIds.has(item.id));
    if(additions.length||list.some(item=>String(item.id).startsWith("rpicster-")))writeList(ASSETS_KEY,[...list,...additions]);
  } catch {}
}

ensureRpicsterVfxPack();

function ensureGothicvaniaMagicPack() {
  try {
    const list=readList(ASSETS_KEY),existingIds=new Set(list.map(item=>String(item.id)));
    const deletedValue=JSON.parse(localStorage.getItem(DELETED_ASSETS_KEY)||"[]"),deletedIds=new Set(Array.isArray(deletedValue)?deletedValue.map(String):[]);
    const additions=gothicvaniaMagicAssets.filter(item=>!existingIds.has(item.id)&&!deletedIds.has(item.id));
    if(additions.length)writeList(ASSETS_KEY,[...list,...additions]);
  } catch {}
}

ensureGothicvaniaMagicPack();

function ensureHitAnimationPack() {
  try {
    const list=readList(ASSETS_KEY),existingIds=new Set(list.map(item=>String(item.id)));
    const deletedValue=JSON.parse(localStorage.getItem(DELETED_ASSETS_KEY)||"[]"),deletedIds=new Set(Array.isArray(deletedValue)?deletedValue.map(String):[]);
    const additions=hitAnimationAssets.filter(item=>!existingIds.has(item.id)&&!deletedIds.has(item.id));
    if(additions.length)writeList(ASSETS_KEY,[...list,...additions]);
  } catch {}
}

ensureHitAnimationPack();

function ensureFireSmokeAnimationPack() {
  try {
    const list=readList(ASSETS_KEY),existingIds=new Set(list.map(item=>String(item.id)));
    const deletedValue=JSON.parse(localStorage.getItem(DELETED_ASSETS_KEY)||"[]"),deletedIds=new Set(Array.isArray(deletedValue)?deletedValue.map(String):[]);
    const additions=fireSmokeAnimationAssets.filter(item=>!existingIds.has(item.id)&&!deletedIds.has(item.id));
    if(additions.length)writeList(ASSETS_KEY,[...list,...additions]);
  } catch {}
}

ensureFireSmokeAnimationPack();

function ensureLensFlareParticlePack() {
  try {
    const list=readList(ASSETS_KEY),existingIds=new Set(list.map(item=>String(item.id)));
    const deletedValue=JSON.parse(localStorage.getItem(DELETED_ASSETS_KEY)||"[]"),deletedIds=new Set(Array.isArray(deletedValue)?deletedValue.map(String):[]);
    const additions=lensFlareParticleAssets.filter(item=>!existingIds.has(item.id)&&!deletedIds.has(item.id));
    if(additions.length)writeList(ASSETS_KEY,[...list,...additions]);
  } catch {}
}

ensureLensFlareParticlePack();

function ensureFxChargePack() {
  try {
    const list=readList(ASSETS_KEY),existingIds=new Set(list.map(item=>String(item.id)));
    const deletedValue=JSON.parse(localStorage.getItem(DELETED_ASSETS_KEY)||"[]"),deletedIds=new Set(Array.isArray(deletedValue)?deletedValue.map(String):[]);
    const additions=fxChargeAssets.filter(item=>!existingIds.has(item.id)&&!deletedIds.has(item.id));
    if(additions.length)writeList(ASSETS_KEY,[...list,...additions]);
  } catch {}
}

ensureFxChargePack();

function ensureKronbitsParticlePack() {
  try {
    const list=readList(ASSETS_KEY),existingIds=new Set(list.map(item=>String(item.id)));
    const deletedValue=JSON.parse(localStorage.getItem(DELETED_ASSETS_KEY)||"[]"),deletedIds=new Set(Array.isArray(deletedValue)?deletedValue.map(String):[]);
    const additions=kronbitsParticleAssets.filter(item=>!existingIds.has(item.id)&&!deletedIds.has(item.id));
    if(additions.length)writeList(ASSETS_KEY,[...list,...additions]);
  } catch {}
}

ensureKronbitsParticlePack();

function migrateOpenGameArtCc0() {
  if(localStorage.getItem(OPENGAMEART_CC0_MIGRATION_KEY))return;
  try {
    const canonicalById=new Map([...hitAnimationAssets,...fireSmokeAnimationAssets].map(item=>[String(item.id),item]));
    const list=JSON.parse(localStorage.getItem(ASSETS_KEY)||"[]");
    if(Array.isArray(list)){
      const updated=list.map(item=>canonicalById.has(String(item.id))?{...item,...canonicalById.get(String(item.id))}:item);
      localStorage.setItem(ASSETS_KEY,JSON.stringify(updated));
    }
    localStorage.setItem(OPENGAMEART_CC0_MIGRATION_KEY,"1");
  } catch {}
}

migrateOpenGameArtCc0();

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
const pageState = { submission: 1, asset: 1 };
const adminSequencePreviews = { submission: [], asset: [] };
let adminSequenceAnimationRequest = 0;
let activeAssetTab = "public";

function readList(key) {
  try { const value = JSON.parse(localStorage.getItem(key) || "[]"); return Array.isArray(value) ? value.filter(item=>key!==ASSETS_KEY||(!PERMANENTLY_DELETED_ASSET_IDS.has(String(item.id))&&!COLLECTION_ONLY_ASSET_IDS.has(String(item.id)))).map(item => {
    const canonical=[...unityWispySmokeAssets,...rpicsterVfxAssets,...gothicvaniaMagicAssets].find(asset=>String(asset.id)===String(item.id));
    const canonicalLicense=canonical?{license:canonical.license,licenseUrl:canonical.licenseUrl,attributionRequired:canonical.attributionRequired,optionalAttribution:canonical.optionalAttribution,downloadDisabled:canonical.downloadDisabled,downloadUrl:canonical.downloadUrl,downloadFileName:canonical.downloadFileName}:{};
    return { ...canonical, ...item, ...canonicalLicense, type: normalizeType(item.type||canonical?.type), source:["Lumina Original","KITTYME Original"].includes(item.source)?"MewFX Original":(item.source||canonical?.source), image: normalizeLibraryPath(item.image||canonical?.image||"") };
  }) : []; }
  catch { return []; }
}
function writeList(key, value) { localStorage.setItem(key, JSON.stringify(value)); notifyContentChange(key); }
function buildCatalogPayload() {
  let deletedAssetIds=[];
  try {
    const value=JSON.parse(localStorage.getItem(DELETED_ASSETS_KEY)||"[]");
    if(Array.isArray(value))deletedAssetIds=value.map(String);
  } catch {}
  return {
    version:CATALOG_VERSION,
    exportedAt:new Date().toISOString(),
    assets:assets.map(item=>structuredClone(item)),
    deletedAssetIds:[...new Set([...deletedAssetIds,...PERMANENTLY_DELETED_ASSET_IDS])]
  };
}
function validateCatalogPayload(value) {
  if(!value||typeof value!=="object"||Array.isArray(value))throw new Error("JSON 顶层必须是对象");
  if(value.version!==CATALOG_VERSION)throw new Error(`仅支持 version ${CATALOG_VERSION}`);
  if(!Array.isArray(value.assets))throw new Error("缺少 assets 数组");
  if(!Array.isArray(value.deletedAssetIds))throw new Error("缺少 deletedAssetIds 数组");
  const ids=new Set();
  const normalizedAssets=value.assets.map((item,index)=>{
    if(!item||typeof item!=="object"||Array.isArray(item))throw new Error(`assets[${index}] 不是有效对象`);
    const id=String(item.id||"").trim();
    if(!id)throw new Error(`assets[${index}] 缺少 id`);
    if(ids.has(id))throw new Error(`素材 id 重复：${id}`);
    ids.add(id);
    return {...item,id};
  });
  return {
    version:CATALOG_VERSION,
    exportedAt:typeof value.exportedAt==="string"?value.exportedAt:"",
    assets:normalizedAssets,
    deletedAssetIds:[...new Set(value.deletedAssetIds.map(id=>String(id).trim()).filter(Boolean))]
  };
}
function setCatalogStatus(message) {
  const target=$("#catalogStatus");
  if(target)target.textContent=message;
}
function downloadCatalogJson() {
  const payload=buildCatalogPayload();
  const blob=new Blob([`${JSON.stringify(payload,null,2)}\n`],{type:"application/json;charset=utf-8"});
  const url=URL.createObjectURL(blob);
  const link=document.createElement("a");
  link.href=url;
  link.download="catalog.json";
  link.click();
  setTimeout(()=>URL.revokeObjectURL(url),0);
  setCatalogStatus(`已导出 ${payload.assets.length} 项；请替换仓库中的 catalog.json`);
  showToast("目录 JSON 已导出");
}
function applyCatalogPayload(value,{announce=false}={}) {
  const payload=validateCatalogPayload(value);
  const deletedIds=[...new Set([...payload.deletedAssetIds,...PERMANENTLY_DELETED_ASSET_IDS])];
  const deletedSet=new Set(deletedIds);
  const nextAssets=payload.assets.filter(item=>!deletedSet.has(String(item.id)));
  const previousRecords=new Map(readDeletedRecords().map(item=>[String(item.id),item]));
  const nextRecords=deletedIds.map(id=>previousRecords.get(id)||inferDeletedRecord(id));
  writeList(ASSETS_KEY,nextAssets);
  localStorage.setItem(DELETED_ASSETS_KEY,JSON.stringify(deletedIds));
  localStorage.setItem(DELETED_RECORDS_KEY,JSON.stringify(nextRecords));
  notifyContentChange(DELETED_ASSETS_KEY);
  notifyContentChange(DELETED_RECORDS_KEY);
  assets=readList(ASSETS_KEY);
  selectedItems.asset.clear();
  pageState.asset=1;
  if(!$("#adminShell").hidden)render();
  const time=payload.exportedAt?`，导出于 ${new Date(payload.exportedAt).toLocaleString("zh-CN")}`:"";
  setCatalogStatus(`已载入 ${assets.length} 项${time}`);
  if(announce)showToast(`已导入 ${assets.length} 项素材`);
  return payload;
}
async function loadRepositoryCatalog() {
  try {
    const response=await fetch(CATALOG_URL,{cache:"no-store"});
    if(!response.ok)throw new Error(`HTTP ${response.status}`);
    applyCatalogPayload(await response.json());
  } catch {
    setCatalogStatus(location.protocol==="file:"?"本地文件模式无法读取仓库 JSON，当前使用浏览器数据":"仓库 JSON 读取失败，当前使用浏览器数据");
  }
}
async function importCatalogFile(file) {
  const payload=validateCatalogPayload(JSON.parse(await file.text()));
  const currentCount=assets.length;
  const deletedCount=payload.deletedAssetIds.length;
  if(!confirm(`将用 JSON 中的 ${payload.assets.length} 项素材覆盖当前 ${currentCount} 项，并同步 ${deletedCount} 个删除标记。确认继续吗？`))return;
  applyCatalogPayload(payload,{announce:true});
}
function importSubmittedAssets(rawValue) {
  try {
    const incoming=JSON.parse(rawValue||"[]");
    if(!Array.isArray(incoming))return 0;
    const current=readList(SUBMISSIONS_KEY);
    const byId=new Map(current.map(item=>[String(item.id),item]));
    let added=0;
    incoming.forEach(item=>{
      if(!item||typeof item!=="object"||!String(item.id||"").startsWith("submission-"))return;
      const id=String(item.id);
      if(!byId.has(id)){byId.set(id,item);added+=1}
    });
    if(added)writeList(SUBMISSIONS_KEY,[...byId.values()]);
    return added;
  }catch{return 0}
}
function deletedSourceForId(id) {
  if(String(id).startsWith("codemanu-vfx-"))return "VFX Free Pack by CodeManu";
  if(String(id).startsWith("gothicvania-magic-"))return "Gothicvania Magic Pack 9 by ansimuz";
  if(String(id).startsWith("hit-animation-"))return "Hit Animation - Frame by Frame";
  if(String(id).startsWith("fire-smoke-animation-"))return "Fire & Smoke Animations";
  if(String(id).startsWith("lens-flare-particle-"))return "Lens Flares and Particles by hackcraft.de";
  if(String(id).startsWith("fx-charge-"))return "FX Charge";
  if(String(id).startsWith("kronbits-particle-"))return "Particle Pack by Kronbits";
  if(String(id).startsWith("cartoon-smoke-"))return "Free 2D Cartoon Smoke Effects Pack";
  if(String(id).startsWith("bdragon-750-sequence-"))return "750 Effect and FX Pixel All by bdragon1727";
  if(String(id).startsWith("kenney-pattern-"))return "Kenney Pattern Pack";
  if(String(id).startsWith("kenney-splat-"))return "Kenney Splat Pack";
  if(String(id).startsWith("kenney-light-mask-"))return "Kenney Light Masks";
  if(String(id).startsWith("kenney-"))return "Kenney Particle Pack";
  if(String(id).startsWith("pixel-fx-"))return "FX Pixel Texture by bdragon1727";
  return "其他来源";
}
function inferDeletedRecord(id) {
  const value=String(id);
  const kenneyGroups={circle:["光环","循环"],dirt:["碎土","元素"],fire:["爆燃","元素"],flame:["火焰","元素"],flare:["镜头光斑","光效"],light:["能量光球","光效"],magic:["魔法光效","光效"],muzzle:["枪口火光","光效"],scorch:["灼烧爆点","元素"],scratch:["抓痕","元素"],slash:["斩击","元素"],smoke:["烟雾","元素"],spark:["电弧","元素"],star:["星芒","光效"],symbol:["符号","物体"],trace:["光迹","光效"],twirl:["旋涡","循环"],window:["窗口纹样","物体"]};
  const typeDirectories={"光效":"light-effects","元素":"elements","循环":"loops","物体":"objects"};
  const codeManuItem=codeManuVfxAssets.find(item=>item.id===value);
  if(codeManuItem)return {id:value,name:codeManuItem.name,image:codeManuItem.image,type:codeManuItem.type,source:codeManuItem.source,sourceUrl:codeManuItem.sourceUrl,deletedAt:""};
  const gothicvaniaItem=gothicvaniaMagicAssets.find(item=>item.id===value);
  if(gothicvaniaItem)return {id:value,name:gothicvaniaItem.name,image:gothicvaniaItem.image,type:gothicvaniaItem.type,source:gothicvaniaItem.source,sourceUrl:gothicvaniaItem.sourceUrl,deletedAt:""};
  const hitAnimationItem=hitAnimationAssets.find(item=>item.id===value);
  if(hitAnimationItem)return {id:value,name:hitAnimationItem.name,image:hitAnimationItem.image,type:hitAnimationItem.type,source:hitAnimationItem.source,sourceUrl:hitAnimationItem.sourceUrl,deletedAt:""};
  const fireSmokeItem=fireSmokeAnimationAssets.find(item=>item.id===value);
  if(fireSmokeItem)return {id:value,name:fireSmokeItem.name,image:fireSmokeItem.image,type:fireSmokeItem.type,source:fireSmokeItem.source,sourceUrl:fireSmokeItem.sourceUrl,deletedAt:""};
  const lensFlareItem=lensFlareParticleAssets.find(item=>item.id===value);
  if(lensFlareItem)return {id:value,name:lensFlareItem.name,image:lensFlareItem.image,type:lensFlareItem.type,source:lensFlareItem.source,sourceUrl:lensFlareItem.sourceUrl,deletedAt:""};
  const fxChargeItem=fxChargeAssets.find(item=>item.id===value);
  if(fxChargeItem)return {id:value,name:fxChargeItem.name,image:fxChargeItem.image,type:fxChargeItem.type,source:fxChargeItem.source,sourceUrl:fxChargeItem.sourceUrl,deletedAt:""};
  const kronbitsParticleItem=kronbitsParticleAssets.find(item=>item.id===value);
  if(kronbitsParticleItem)return {id:value,name:kronbitsParticleItem.name,image:kronbitsParticleItem.image,type:kronbitsParticleItem.type,source:kronbitsParticleItem.source,sourceUrl:kronbitsParticleItem.sourceUrl,deletedAt:""};
  const sequenceMatch=value.match(/^bdragon-750-sequence-(\d{3})$/);
  if(sequenceMatch){
    const item=createBdragon750SequenceAssets().find(asset=>asset.id===value);
    if(item)return{id:value,name:item.name,image:item.image,type:item.type,source:item.source,sourceUrl:item.sourceUrl,deletedAt:""};
  }
  const patternMatch=value.match(/^kenney-pattern-(\d{2})$/);
  if(patternMatch){
    const number=Number(patternMatch[1]),group=KENNEY_PATTERN_GROUPS.find(([from,to])=>number>=from&&number<=to);
    return {id:value,name:`${group?.[2]||"无缝图案"} ${patternMatch[1]}`,image:`assets/library/loops/kenney-pattern-pack/pattern_${patternMatch[1]}.png`,type:"循环",source:"Kenney Pattern Pack",sourceUrl:KENNEY_PATTERN_SOURCE,deletedAt:""};
  }
  const splatMatch=value.match(/^kenney-splat-(\d{2})$/);
  if(splatMatch){
    const number=Number(splatMatch[1]),variant=KENNEY_SPLAT_RADIAL.has(number)?"放射飞溅":"圆润墨渍";
    return {id:value,name:`${variant} ${splatMatch[1]}`,image:`assets/library/elements/kenney-splat-pack/splat${splatMatch[1]}.png`,type:"元素",source:"Kenney Splat Pack",sourceUrl:KENNEY_SPLAT_SOURCE,deletedAt:""};
  }
  const lightMaskMatch=value.match(/^kenney-light-mask-(\d{3})$/);
  if(lightMaskMatch){
    const item=createKenneyLightMaskAssets().find(asset=>asset.id===value);
    if(item)return {id:value,name:item.name,image:item.image,type:item.type,source:item.source,sourceUrl:item.sourceUrl,deletedAt:""};
  }
  const kenneyMatch=value.match(/^kenney-([a-z]+)-(\d{2})$/);
  if(kenneyMatch&&kenneyGroups[kenneyMatch[1]]){
    const [label,type]=kenneyGroups[kenneyMatch[1]];
    return {id:value,name:`${label} ${kenneyMatch[2]}`,image:`assets/library/${typeDirectories[type]}/kenney-particle-pack/${kenneyMatch[1]}_${kenneyMatch[2]}.png`,type,source:"Kenney Particle Pack",sourceUrl:"https://kenney.nl/assets/particle-pack",deletedAt:""};
  }
  const pixelGroups={"16x16-fx":["16x16_FX","基础像素特效","元素"],"32x16-fx":["32x16_FX","像素弹道","元素"],"32x32-arcane":["32x32_Arcane","像素魔法","光效"],"32x32-circle":["32x32_Circle","像素光环","循环"],"32x32-grow":["32x32_Grow","像素扩散","元素"],"32x32-impact":["32x32_Impact","像素冲击","元素"],"32x32-star":["32x32_Star","像素星芒","光效"],"48x48-fx":["48x48_FX","像素爆发","元素"],"48x48-light":["48x48_Light","像素能量","光效"],"64x64-aura":["64x64_Aura","像素光环","循环"],"64x64-fx":["64x64_FX","像素能量环","光效"]};
  const pixelMatch=value.match(/^pixel-fx-(.+)-(\d{2})$/);
  if(pixelMatch&&pixelGroups[pixelMatch[1]]){
    const [prefix,label,type]=pixelGroups[pixelMatch[1]],index=String(Math.max(0,Number(pixelMatch[2])-1));
    return {id:value,name:`${label} ${pixelMatch[2]}`,image:`assets/library/${typeDirectories[type]}/fx-pixel-texture/${prefix}_${index}.png`,type,source:"FX Pixel Texture by bdragon1727",sourceUrl:"https://bdragon1727.itch.io/fx-pixel-texture",deletedAt:""};
  }
  const atlasMatch=value.match(/^pixel-fx-atlas-(\d{2})$/);
  if(atlasMatch)return {id:value,name:`像素特效彩色图集 ${atlasMatch[1]}`,image:`assets/library/hidden/fx-pixel-texture/atlases/${atlasMatch[1]}_Pixel_FX_Texture.png`,type:"不展示",source:"FX Pixel Texture by bdragon1727",sourceUrl:"https://bdragon1727.itch.io/fx-pixel-texture",deletedAt:""};
  return {id:value,name:"历史删除记录",image:"",type:"",source:deletedSourceForId(value),sourceUrl:"",deletedAt:""};
}
function readDeletedRecords() {
  try {
    const idsValue=JSON.parse(localStorage.getItem(DELETED_ASSETS_KEY)||"[]");
    const recordValue=JSON.parse(localStorage.getItem(DELETED_RECORDS_KEY)||"[]");
    const records=Array.isArray(recordValue)?recordValue:[];
    const byId=new Map(records.map(record=>[String(record.id),record]));
    (Array.isArray(idsValue)?idsValue:[]).forEach(value=>{
      const id=String(value);
      if(!byId.has(id))byId.set(id,inferDeletedRecord(id));
    });
    return [...byId.values()];
  }catch{return[]}
}
function readResolvedDeletionIds() {
  try {
    const value=JSON.parse(localStorage.getItem(RESOLVED_DELETIONS_KEY)||"[]");
    return new Set(Array.isArray(value)?value.map(String):[]);
  }catch{return new Set()}
}
function readPendingDeletedRecords() {
  const resolved=readResolvedDeletionIds();
  return readDeletedRecords().filter(item=>!resolved.has(String(item.id)));
}
function resolveDeletedRecord(id) {
  const resolved=readResolvedDeletionIds();
  resolved.add(String(id));
  localStorage.setItem(RESOLVED_DELETIONS_KEY,JSON.stringify([...resolved]));
}
function resolvePhysicallyDeletedAssets() {
  if(localStorage.getItem(PHYSICAL_DELETION_MIGRATION_KEY))return;
  const resolved=readResolvedDeletionIds();
  PERMANENTLY_DELETED_ASSET_IDS.forEach(id=>resolved.add(id));
  localStorage.setItem(RESOLVED_DELETIONS_KEY,JSON.stringify([...resolved]));
  localStorage.setItem(PHYSICAL_DELETION_MIGRATION_KEY,"1");
}

resolvePhysicallyDeletedAssets();
function rememberDeletedAssets(records) {
  try {
    const current=readDeletedRecords();
    const byId=new Map(current.map(record=>[String(record.id),record]));
    const deletedAt=new Date().toISOString();
    records.forEach(value=>{
      const record=typeof value==="object"&&value?value:{id:value};
      const id=String(record.id);
      byId.set(id,{id,name:record.name||byId.get(id)?.name||"未命名资源",image:normalizeLibraryPath(record.image||byId.get(id)?.image||""),type:record.type||byId.get(id)?.type||"",source:record.source||byId.get(id)?.source||deletedSourceForId(id),sourceUrl:record.sourceUrl||byId.get(id)?.sourceUrl||"",deletedAt});
    });
    localStorage.setItem(DELETED_ASSETS_KEY,JSON.stringify([...byId.keys()]));
    localStorage.setItem(DELETED_RECORDS_KEY,JSON.stringify([...byId.values()]));
    notifyContentChange(DELETED_ASSETS_KEY);
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
  assets = readList(ASSETS_KEY).filter(item=>!String(item.id).startsWith(SIMPLE_SFX_GROUP_PREFIX));
  writeList(ASSETS_KEY,assets);
  $("#pendingCount").textContent=submissions.length; $("#pendingBadge").textContent=submissions.length;
  const classifiedCount=assets.filter(item=>Boolean(primaryCategory(item))).length;
  $("#publicCount").textContent=classifiedCount; $("#publicBadge").textContent=classifiedCount;
  $("#uncategorizedBadge").textContent=assets.filter(item=>!primaryCategory(item)).length;
  $("#deletedBadge").textContent=readPendingDeletedRecords().length;
  renderPanel("submission");
  renderPanel("asset");
  renderDeletedPanel();
}
function listForMode(mode) { return mode === "submission" ? submissions : assets; }
function primaryCategory(item) { return Array.isArray(item.tags) && item.tags.length ? String(item.tags[0]).trim() : ""; }
function scopedListForMode(mode) {
  const list=listForMode(mode);
  if(mode!=="asset")return list;
  return activeAssetTab==="uncategorized"?list.filter(item=>!primaryCategory(item)):list.filter(item=>Boolean(primaryCategory(item)));
}
function assetDimensions(item) {
  const match=String(item.resolution||"").match(/(\d+)\s*[×xX]\s*(\d+)/);
  return match?{width:Number(match[1]),height:Number(match[2])}:null;
}
function isSmallAsset(item) {
  const dimensions=assetDimensions(item);
  return Boolean(dimensions&&dimensions.width<128&&dimensions.height<128);
}
function itemTime(item) {
  const bundledFallback=item.id?.startsWith("pixel-fx-")?"2026-07-29T17:00:00+08:00":item.id?.startsWith("kenney-")?"2026-07-29T15:00:00+08:00":"";
  const timestamp=Date.parse(item.collectedAt||item.submittedAt||bundledFallback||item.createdAt||"");
  return Number.isNaN(timestamp)?0:timestamp;
}
function importBatchKey(item) {
  return String(item.importBatchId||item.importBatchAt||item.sourceUrl||item.source||item.id||"");
}
function buildImportSequence(list) {
  const sequence=new Map();
  let batch=-1,previousKey=null,indexInBatch=0;
  list.forEach(item=>{
    const key=importBatchKey(item);
    if(key!==previousKey){batch+=1;indexInBatch=0;previousKey=key}
    sequence.set(item,{batch,index:indexInBatch});
    indexInBatch+=1;
  });
  return sequence;
}
function filteredList(mode) {
  const state=filterState[mode];
  const importSequence=mode==="asset"?buildImportSequence(assets):null;
  return scopedListForMode(mode).filter(item => {
    const typeMatches=!state.type || normalizeType(item.type)===state.type;
    const primary=primaryCategory(item);
    const primaryMatches=!state.primary || (state.primary==="__none__" ? !primary : primary===state.primary);
    return typeMatches && primaryMatches;
  }).sort((a,b)=>{
    if(mode==="asset"){
      const aOrder=importSequence.get(a),bOrder=importSequence.get(b);
      const batchDifference=bOrder.batch-aOrder.batch;
      const orderedDifference=sortNewest[mode]?batchDifference:-batchDifference;
      return orderedDifference||aOrder.index-bOrder.index;
    }
    const difference=itemTime(b)-itemTime(a);
    return (sortNewest[mode]?difference:-difference)||String(a.id).localeCompare(String(b.id));
  });
}
function adminColumnCount() {
  const width=window.innerWidth;
  return width<=420?1:width<=680?2:width<=900?3:width<=1200?4:5;
}
function adminPageItems(totalPages,currentPage) {
  if(totalPages<=7)return Array.from({length:totalPages},(_,index)=>index+1);
  return [...new Set([1,totalPages,currentPage-1,currentPage,currentPage+1])]
    .filter(page=>page>0&&page<=totalPages)
    .sort((a,b)=>a-b);
}
function renderAdminPagination(mode,totalItems,perPage) {
  const totalPages=Math.max(1,Math.ceil(totalItems/perPage));
  pageState[mode]=Math.min(Math.max(1,pageState[mode]),totalPages);
  const currentPage=pageState[mode];
  let previous=0;
  const numberMarkup=adminPageItems(totalPages,currentPage).map(page=>{
    const gap=previous&&page-previous>1?'<span class="admin-page-gap">…</span>':"";
    previous=page;
    return `${gap}<button type="button" data-admin-page="${page}" class="${page===currentPage?"active":""}"${page===currentPage?' aria-current="page"':""}>${page}</button>`;
  }).join("");
  const start=totalItems?(currentPage-1)*perPage+1:0;
  const end=Math.min(currentPage*perPage,totalItems);
  document.querySelectorAll(`[data-admin-pagination="${mode}"]`).forEach(pagination=>{
    pagination.hidden=totalPages<=1;
    pagination.querySelector(".admin-page-numbers").innerHTML=numberMarkup;
    pagination.querySelector(".admin-page-summary").textContent=`${start}–${end} / ${totalItems}`;
    const previousButton=pagination.querySelector('[data-admin-page-action="previous"]');
    const nextButton=pagination.querySelector('[data-admin-page-action="next"]');
    previousButton.disabled=currentPage===1;
    nextButton.disabled=currentPage===totalPages;
    previousButton.onclick=()=>goToAdminPage(mode,currentPage-1);
    nextButton.onclick=()=>goToAdminPage(mode,currentPage+1);
    pagination.querySelectorAll("[data-admin-page]").forEach(button=>button.onclick=()=>goToAdminPage(mode,Number(button.dataset.adminPage)));
  });
  return {startIndex:(currentPage-1)*perPage,endIndex:Math.min(currentPage*perPage,totalItems)};
}
function goToAdminPage(mode,page) {
  pageState[mode]=page;
  renderPanel(mode);
  const panel=$(mode==="submission"?"#pendingPanel":"#publicPanel");
  panel.querySelector(".admin-list-tools").scrollIntoView({behavior:"smooth",block:"start"});
}
function optionHtml(value, label=value) { return `<option value="${escapeHtml(value)}">${escapeHtml(label)}</option>`; }
function bulkPrimaryValues(mode) {
  const selectedType=$(`[data-bulk-type="${mode}"]`).value;
  const selectedIds=selectedItems[mode];
  const selectedTypes=new Set(listForMode(mode).filter(item=>selectedIds.has(String(item.id))).map(item=>normalizeType(item.type)));
  const applicableTypes=selectedType?new Set([selectedType]):selectedTypes;
  return [...new Set(listForMode(mode)
    .filter(item=>!applicableTypes.size||applicableTypes.has(normalizeType(item.type)))
    .map(primaryCategory)
    .filter(Boolean))]
    .sort((a,b)=>a.localeCompare(b,"zh-CN"));
}
function renderBulkPrimaryOptions(mode) {
  const select=$(`[data-bulk-primary="${mode}"]`);
  if(!select)return;
  const current=select.value;
  const values=bulkPrimaryValues(mode);
  select.innerHTML=optionHtml("","保持原细分类")+values.map(value=>optionHtml(value)).join("")+optionHtml("__custom__","＋ 自定义细分类…");
  select.value=current==="__custom__"||values.includes(current)?current:"";
  syncBulkPrimaryCustom(mode);
}
function syncBulkPrimaryCustom(mode,focus=false) {
  const select=$(`[data-bulk-primary="${mode}"]`);
  const input=$(`[data-bulk-primary-custom="${mode}"]`);
  const custom=select.value==="__custom__";
  input.hidden=!custom;
  if(!custom)input.value="";
  if(custom&&focus)input.focus();
}
function renderPanel(mode) {
  const all=scopedListForMode(mode);
  const existingIds=new Set(all.map(item=>String(item.id)));
  selectedItems[mode].forEach(id=>{if(!existingIds.has(id))selectedItems[mode].delete(id)});

  const types=[...new Set([...TYPE_OPTIONS,...all.map(item=>normalizeType(item.type)),filterState[mode].type].filter(Boolean))];
  const primaryScope=filterState[mode].type?all.filter(item=>normalizeType(item.type)===filterState[mode].type):all;
  const primaryValues=[...new Set(primaryScope.map(primaryCategory).filter(Boolean))].sort((a,b)=>a.localeCompare(b,"zh-CN"));
  const typeFilter=$(`[data-type-filter="${mode}"]`);
  const primaryFilter=$(`[data-primary-filter="${mode}"]`);
  typeFilter.innerHTML=optionHtml("","全部大类")+types.map(value=>optionHtml(value)).join("");
  primaryFilter.innerHTML=optionHtml("","全部细分类")+(primaryScope.some(item=>!primaryCategory(item))?optionHtml("__none__","未分类"):"")+primaryValues.map(value=>optionHtml(value)).join("");
  typeFilter.value=filterState[mode].type;
  primaryFilter.value=filterState[mode].primary;
  renderBulkPrimaryOptions(mode);

  const visible=filteredList(mode);
  const grid=$(mode==="submission"?"#submissionGrid":"#publicGrid");
  const empty=$(mode==="submission"?"#submissionEmpty":"#publicEmpty");
  const perPage=adminColumnCount()*10;
  const pageRange=renderAdminPagination(mode,visible.length,perPage);
  const pageItems=visible.slice(pageRange.startIndex,pageRange.endIndex);
  grid.innerHTML=pageItems.map(item=>cardHtml(item,mode)).join("");
  syncAdminSequencePreviews(mode,grid,pageItems);
  grid.querySelectorAll(".review-preview").forEach(image=>{
    const applyPreviewMode=()=>{
      const small=image.naturalWidth<128&&image.naturalHeight<128;
      image.closest(".review-card")?.classList.toggle("review-card-pixel",small);
    };
    if(image.complete&&image.naturalWidth)applyPreviewMode();
    else image.addEventListener("load",applyPreviewMode,{once:true});
  });
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
function previewImageFor(item) {
  const animatedPreview=item.animatedPreview||[...codeManuVfxAssets,...unityWispySmokeAssets,...gothicvaniaMagicAssets,...hitAnimationAssets,...fireSmokeAnimationAssets,...fxChargeAssets].find(asset=>String(asset.id)===String(item.id))?.animatedPreview;
  if(animatedPreview)return animatedPreview;
  const frames=Array.isArray(item.sequenceFrames)?item.sequenceFrames.filter(Boolean):[];
  return frames.length?frames[Math.floor(frames.length/2)]:(item.image||"");
}
function activeAdminSequencePreviews() {
  if(document.hidden||$("#adminShell")?.hidden)return [];
  return [...adminSequencePreviews.submission,...adminSequencePreviews.asset].filter(preview=>
    preview.image.isConnected&&preview.image.closest(".admin-panel")?.classList.contains("active")
  );
}
function updateAdminSequenceAnimations(timestamp) {
  const previews=activeAdminSequencePreviews();
  previews.forEach(preview=>{
    const frameIndex=Math.floor(timestamp*preview.frameRate/1000)%preview.frames.length;
    if(frameIndex===preview.lastFrame)return;
    preview.lastFrame=frameIndex;
    preview.image.src=preview.frames[frameIndex];
  });
  adminSequenceAnimationRequest=previews.length?requestAnimationFrame(updateAdminSequenceAnimations):0;
}
function syncAdminSequenceAnimation() {
  const hasActivePreviews=activeAdminSequencePreviews().length>0;
  if(hasActivePreviews&&!adminSequenceAnimationRequest)adminSequenceAnimationRequest=requestAnimationFrame(updateAdminSequenceAnimations);
  if(!hasActivePreviews&&adminSequenceAnimationRequest){
    cancelAnimationFrame(adminSequenceAnimationRequest);
    adminSequenceAnimationRequest=0;
  }
}
function syncAdminSequencePreviews(mode,grid,items) {
  const itemsById=new Map(items.map(item=>[String(item.id),item]));
  adminSequencePreviews[mode]=[...grid.querySelectorAll("[data-sequence-preview]")].map(image=>{
    const item=itemsById.get(image.dataset.sequencePreview);
    const frames=Array.isArray(item?.sequenceFrames)?item.sequenceFrames.filter(Boolean):[];
    if(frames.length<2)return null;
    return {image,frames,frameRate:Math.min(30,Math.max(1,Number(item.frameRate)||12)),lastFrame:-1};
  }).filter(Boolean);
  syncAdminSequenceAnimation();
}
function cardHtml(item, mode) {
  const id=String(item.id);
  const frames=Array.isArray(item.sequenceFrames)?item.sequenceFrames.filter(Boolean):[];
  const previewImage=previewImageFor(item);
  const hasAnimatedPreview=Boolean(item.animatedPreview||[...codeManuVfxAssets,...unityWispySmokeAssets,...gothicvaniaMagicAssets,...hitAnimationAssets,...fireSmokeAnimationAssets,...fxChargeAssets].find(asset=>String(asset.id)===id)?.animatedPreview);
  const image = previewImage ? `<img class="review-preview" src="${previewImage}" alt="${escapeHtml(item.name)}" loading="lazy"${frames.length>1&&!hasAnimatedPreview?` data-sequence-preview="${escapeHtml(id)}"`:""} />` : `<span>程序生成预览</span>`;
  const source = [item.source, item.sourceUrl].filter(Boolean).map(escapeHtml).join("<br>") || "未填写";
  const selected=selectedItems[mode].has(id);
  return `<article class="review-card${isSmallAsset(item)?" review-card-pixel":""}${selected?" selected":""}"><label class="card-selector" title="选择 ${escapeHtml(item.name)}"><input type="checkbox" data-card-select="${mode}" value="${escapeHtml(id)}" ${selected?"checked":""} aria-label="选择 ${escapeHtml(item.name)}" /></label><div class="review-image">${image}</div><div class="review-body"><div class="review-top"><h3>${escapeHtml(item.name)}</h3><span>${escapeHtml(item.license||"待核实")}</span></div><p class="review-meta">${escapeHtml(item.type||"其他")} · ${(item.tags||[]).map(escapeHtml).join(" / ")||"无标签"}</p><div class="review-source"><strong>出处：</strong><br>${source}</div><div class="review-actions">${mode==="submission"?`<button class="reject" data-reject="${escapeHtml(id)}">不收录</button><button class="approve" data-review="${escapeHtml(id)}">审核并发布</button>`:`<button class="edit" data-edit-asset="${escapeHtml(id)}">编辑资料</button>`}</div></div></article>`;
}

function renderDeletedPanel() {
  const records=readPendingDeletedRecords().sort((a,b)=>String(b.deletedAt||"").localeCompare(String(a.deletedAt||""))||String(a.id).localeCompare(String(b.id)));
  const groups=new Map();
  records.forEach(record=>{
    const source=record.source||deletedSourceForId(record.id);
    if(!groups.has(source))groups.set(source,[]);
    groups.get(source).push(record);
  });
  $("#deletedEmpty").hidden=records.length>0;
  $("#copyDeletedIds").disabled=records.length===0;
  $("#deletedGroups").innerHTML=[...groups.entries()].map(([source,items])=>`
    <section class="deleted-group">
      <header class="deleted-group-head"><div><h3>${escapeHtml(source)}</h3><span>${items.length} 项删除记录</span></div><button type="button" class="deleted-group-copy" data-copy-deleted-source="${escapeHtml(source)}">复制本组 ID</button></header>
      <div class="deleted-id-block">${items.map(item=>`<code>${escapeHtml(item.id)}</code>`).join("")}</div>
      <div class="deleted-list">${items.map(item=>`<article class="deleted-row"><strong title="${escapeHtml(item.name||"")}">${escapeHtml(item.name||"未命名资源")}</strong><code title="${escapeHtml(item.id)}">${escapeHtml(item.id)}</code><span title="${escapeHtml(item.image||"")}">${escapeHtml(item.image||"旧记录未保存路径")}</span><time>${item.deletedAt?escapeHtml(new Date(item.deletedAt).toLocaleString("zh-CN",{hour12:false})):"历史记录"}</time><button type="button" class="deleted-resolve" data-resolve-deleted="${escapeHtml(item.id)}">确认已删除</button></article>`).join("")}</div>
    </section>`).join("");
  document.querySelectorAll("[data-copy-deleted-source]").forEach(button=>button.addEventListener("click",()=>{
    const source=button.dataset.copyDeletedSource;
    copyText(records.filter(item=>(item.source||deletedSourceForId(item.id))===source).map(item=>item.id).join("\n"),`已复制 ${source} 的资源 ID`);
  }));
  document.querySelectorAll("[data-resolve-deleted]").forEach(button=>button.addEventListener("click",()=>{
    const id=button.dataset.resolveDeleted;
    if(!confirm(`确认 ${id} 的资源文件已经删除吗？确认后将从删除清单隐藏。`))return;
    resolveDeletedRecord(id);
    render();
    showToast("已确认并从删除清单隐藏");
  }));
}

async function copyText(value,message) {
  try {
    if(navigator.clipboard&&globalThis.isSecureContext)await navigator.clipboard.writeText(value);
    else{
      const input=document.createElement("textarea");input.value=value;input.style.position="fixed";input.style.opacity="0";document.body.appendChild(input);input.select();document.execCommand("copy");input.remove();
    }
    showToast(message);
  }catch{showToast("复制失败，请手动选择 ID")}
}

document.querySelectorAll("[data-type-filter]").forEach(select=>select.addEventListener("change",()=>{const mode=select.dataset.typeFilter;filterState[mode].type=select.value;filterState[mode].primary=mode==="asset"&&activeAssetTab==="uncategorized"?"__none__":"";pageState[mode]=1;renderPanel(mode)}));
document.querySelectorAll("[data-primary-filter]").forEach(select=>select.addEventListener("change",()=>{const mode=select.dataset.primaryFilter;filterState[mode].primary=select.value;pageState[mode]=1;renderPanel(mode)}));
document.querySelectorAll("[data-clear-filter]").forEach(button=>button.addEventListener("click",()=>{const mode=button.dataset.clearFilter;filterState[mode]={type:"",primary:""};pageState[mode]=1;renderPanel(mode)}));
document.querySelectorAll("[data-bulk-type]").forEach(select=>select.addEventListener("change",()=>{
  const mode=select.dataset.bulkType;
  $(`[data-bulk-primary="${mode}"]`).value="";
  $(`[data-bulk-primary-custom="${mode}"]`).value="";
  renderBulkPrimaryOptions(mode);
}));
document.querySelectorAll("[data-bulk-primary]").forEach(select=>select.addEventListener("change",()=>syncBulkPrimaryCustom(select.dataset.bulkPrimary,true)));
document.querySelectorAll("[data-admin-sort]").forEach(button=>button.addEventListener("click",()=>{
  const mode=button.dataset.adminSort;
  sortNewest[mode]=!sortNewest[mode];
  pageState[mode]=1;
  button.innerHTML=`${sortNewest[mode]?"最新优先":"最早优先"} <span>${sortNewest[mode]?"↓":"↑"}</span>`;
  renderPanel(mode);
}));
document.querySelectorAll("[data-apply-bulk]").forEach(button=>button.addEventListener("click",()=>applyBulkEdit(button.dataset.applyBulk)));
document.querySelectorAll("[data-bulk-delete]").forEach(button=>button.addEventListener("click",()=>bulkDelete(button.dataset.bulkDelete)));
$("#copyDeletedIds").addEventListener("click",()=>copyText(readPendingDeletedRecords().map(item=>item.id).join("\n"),"已复制全部待处理资源 ID"));

function bulkDelete(mode) {
  const ids=selectedItems[mode];
  const count=ids.size;
  if(!count)return;
  const target=mode==="submission"?"待审核投稿":"已分类贴图";
  if(!confirm(`确认删除选中的 ${count} 项${target}记录吗？图片文件暂时保留。`))return;
  if(mode==="submission"){
    submissions=submissions.filter(item=>!ids.has(String(item.id)));
    writeList(SUBMISSIONS_KEY,submissions);
  }else{
    const deletedRecords=assets.filter(item=>ids.has(String(item.id)));
    assets=assets.filter(item=>!ids.has(String(item.id)));
    writeList(ASSETS_KEY,assets);
    rememberDeletedAssets(deletedRecords);
  }
  ids.clear();
  render();
  showToast(`已删除 ${count} 项`);
}

function applyBulkEdit(mode) {
  const type=$(`[data-bulk-type="${mode}"]`).value;
  const primarySelect=$(`[data-bulk-primary="${mode}"]`);
  const primary=primarySelect.value==="__custom__"?$(`[data-bulk-primary-custom="${mode}"]`).value.trim():primarySelect.value.trim();
  const ids=selectedItems[mode];
  if(!ids.size)return;
  if(primarySelect.value==="__custom__"&&!primary){showToast("请填写自定义主要细分类");return}
  if(!type&&!primary){showToast("请选择要修改的大类或主要细分类");return}
  if(!confirm(`确认批量修改选中的 ${ids.size} 项吗？`))return;
  const updated=listForMode(mode).map(item=>{
    if(!ids.has(String(item.id)))return item;
    const record={...item};
    if(type)record.type=type;
    if(primary){
      const tags=Array.isArray(item.tags)?item.tags.map(tag=>String(tag).trim()).filter(Boolean):[];
      record.tags=[primary,...tags.slice(1).filter(tag=>tag!==primary)];
      record.primaryTags=[primary];
      record.secondaryTags=record.tags.slice(1);
    }
    return record;
  });
  if(mode==="submission"){submissions=updated;writeList(SUBMISSIONS_KEY,submissions)}else{assets=updated;writeList(ASSETS_KEY,assets)}
  const count=ids.size;
  ids.clear();
  $(`[data-bulk-type="${mode}"]`).value="";
  $(`[data-bulk-primary="${mode}"]`).value="";
  $(`[data-bulk-primary-custom="${mode}"]`).value="";
  render();
  showToast(`已批量更新 ${count} 项`);
}

document.querySelectorAll("[data-admin-tab]").forEach(button=>button.addEventListener("click",()=>{
  document.querySelectorAll("[data-admin-tab]").forEach(item=>item.classList.toggle("active",item===button));
  const tab=button.dataset.adminTab;
  if(tab==="public"||tab==="uncategorized"){activeAssetTab=tab;pageState.asset=1}
  if(tab==="pending")pageState.submission=1;
  $("#pendingPanel").classList.toggle("active",tab==="pending");
  $("#publicPanel").classList.toggle("active",tab==="public"||tab==="uncategorized");
  $("#deletedPanel").classList.toggle("active",tab==="deleted");
  if(tab==="uncategorized"){
    filterState.asset={type:"",primary:"__none__"};
    renderPanel("asset");
  }else if(tab==="public"&&filterState.asset.primary==="__none__"){
    filterState.asset.primary="";
    renderPanel("asset");
  }
  syncAdminSequenceAnimation();
}));

function openEditor(mode,id) {
  const item=(mode==="submission"?submissions:assets).find(entry=>entry.id===id); if(!item)return;
  $("#editorMode").value=mode; $("#editorId").value=id; $("#editorTitle").textContent=mode==="submission"?"审核并发布":"编辑展示资料";
  $("#editorSubmit").textContent=mode==="submission"?"确认发布":"保存修改"; $("#editorDelete").textContent=mode==="submission"?"不收录":"删除素材";
  $("#editorName").value=item.name||""; $("#editorType").value=normalizeType(item.type); $("#editorLicense").value=item.license||"待核实"; $("#editorTags").value=(item.tags||[]).join(", ");
  $("#editorSource").value=item.source||""; $("#editorSourceUrl").value=item.sourceUrl||""; $("#editorResolution").value=item.resolution||""; $("#editorFormat").value=item.format||""; $("#editorDescription").value=item.description||"";
  editorImage=item.image||""; $("#editorPreview").src=previewImageFor(item)||DEFAULT_PREVIEW; $("#editorDialog").showModal();
}
function closeEditor(){ $("#editorDialog").close(); }
$("#closeEditor").addEventListener("click",closeEditor); $("#editorCancel").addEventListener("click",closeEditor);
$("#editorImageInput").addEventListener("change",event=>{const file=event.target.files[0];if(!file)return;if(file.size>2*1024*1024){showToast("图片请控制在 2MB 以内");return}const reader=new FileReader();reader.onload=()=>{editorImage=reader.result;$("#editorPreview").src=editorImage;const detector=new Image();detector.onload=()=>{$("#editorResolution").value=`${detector.naturalWidth} × ${detector.naturalHeight}`};detector.src=editorImage};reader.readAsDataURL(file)});
$("#editorForm").addEventListener("submit",event=>{
  event.preventDefault(); const mode=$("#editorMode").value,id=$("#editorId").value; const source=$("#editorSource").value.trim(),sourceUrl=$("#editorSourceUrl").value.trim();
  if(!source&&!sourceUrl){showToast("请填写出处或出处地址");return}
  const old=(mode==="submission"?submissions:assets).find(item=>item.id===id); const tags=$("#editorTags").value.split(/[,，]/).map(v=>v.trim()).filter(Boolean); const record={...old,id:mode==="submission"?`fx-${Date.now().toString(36)}`:id,name:$("#editorName").value.trim(),type:$("#editorType").value,license:$("#editorLicense").value,tags,primaryTags:tags.slice(0,1),secondaryTags:tags.slice(1),source,sourceUrl,resolution:$("#editorResolution").value.trim()||"未标注",format:$("#editorFormat").value.trim()||"未标注",description:$("#editorDescription").value.trim(),image:editorImage,createdAt:old.createdAt||new Date().toISOString().slice(0,10),collectedAt:mode==="submission"?new Date().toISOString():(old.collectedAt||old.createdAt||new Date().toISOString()),preset:old.preset||"nebula",colors:old.colors||["#ff9fbd","#6957d9","#251d39"]};
  try { if(mode==="submission"){assets.push(record);submissions=submissions.filter(item=>item.id!==id);writeList(SUBMISSIONS_KEY,submissions)}else assets=assets.map(item=>item.id===id?record:item);writeList(ASSETS_KEY,assets);closeEditor();render();showToast(mode==="submission"?"已发布到首页":"修改已保存")} catch {showToast("保存失败，浏览器空间可能不足")}
});
$("#editorDelete").addEventListener("click",()=>{const mode=$("#editorMode").value,id=$("#editorId").value;if(!confirm(mode==="submission"?"确认不收录这条投稿吗？":"确认删除这张已审核贴图的记录吗？图片文件暂时保留。"))return;if(mode==="submission"){submissions=submissions.filter(item=>item.id!==id);writeList(SUBMISSIONS_KEY,submissions)}else{const deletedRecord=assets.find(item=>item.id===id);assets=assets.filter(item=>item.id!==id);writeList(ASSETS_KEY,assets);if(deletedRecord)rememberDeletedAssets([deletedRecord])}closeEditor();render();showToast("记录已删除")});
function rejectSubmission(id){if(!confirm("确认不收录这条投稿吗？"))return;submissions=submissions.filter(item=>item.id!==id);writeList(SUBMISSIONS_KEY,submissions);render();showToast("已移出审核队列")}

let lastAdminColumnCount=adminColumnCount();
let adminResizeTimer;
window.addEventListener("resize",()=>{
  clearTimeout(adminResizeTimer);
  adminResizeTimer=setTimeout(()=>{
    const nextColumnCount=adminColumnCount();
    if(nextColumnCount===lastAdminColumnCount)return;
    lastAdminColumnCount=nextColumnCount;
    pageState.submission=1;
    pageState.asset=1;
    if(!$("#adminShell").hidden)render();
  },120);
});
document.addEventListener("visibilitychange",syncAdminSequenceAnimation);

$("#exportCatalog").addEventListener("click",downloadCatalogJson);
$("#importCatalog").addEventListener("change",async event=>{
  const file=event.target.files?.[0];
  if(!file)return;
  try { await importCatalogFile(file); }
  catch(error){setCatalogStatus(`导入失败：${error.message}`);showToast("目录 JSON 格式不正确")}
  finally { event.target.value=""; }
});

configureLogin();
loadRepositoryCatalog();
const ADMIN_SYNC_TOKEN=new URLSearchParams(location.hash.slice(1)).get("sync")||"";
window.addEventListener("message",event=>{
  if(!ADMIN_SYNC_TOKEN||event.source!==window.opener||event.data?.type!=="kittyme-submissions-sync"||event.data.token!==ADMIN_SYNC_TOKEN||typeof event.data.submissions!=="string")return;
  const added=importSubmittedAssets(event.data.submissions);
  if(added){render();showToast(`已接收 ${added} 条首页投稿`)}
});
if(window.opener&&ADMIN_SYNC_TOKEN)window.opener.postMessage({type:"kittyme-request-submissions",token:ADMIN_SYNC_TOKEN},"*");
