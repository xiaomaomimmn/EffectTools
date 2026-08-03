const STORAGE_KEY = "kittyme-assets-v1";
const LEGACY_STORAGE_KEY = "lumina-assets-v1";
const DELETED_ASSETS_KEY = "kittyme-deleted-assets-v1";
const DELETED_RECORDS_KEY = "kittyme-deleted-records-v1";
const HIDDEN_TYPE_MIGRATION_KEY = "kittyme-hidden-type-migrated-v1";
const DELETION_LEDGER_MIGRATION_KEY = "kittyme-deletion-ledger-migrated-v3";
const UNITY_SMOKE_CC0_MIGRATION_KEY = "mewfx-unity-smoke-cc0-migrated-v2";
const RPICSTER_TAXONOMY_MIGRATION_KEY = "mewfx-rpicster-taxonomy-migrated-v1";
const RPICSTER_CC0_MIGRATION_KEY = "mewfx-rpicster-cc0-migrated-v1";
const CONTENT_SYNC_CHANNEL_NAME = "mewfx-content-sync-v1";
let contentSyncChannel = null;
try { if(globalThis.BroadcastChannel)contentSyncChannel=new BroadcastChannel(CONTENT_SYNC_CHANNEL_NAME); } catch {}
const PERMANENTLY_DELETED_ASSET_IDS = new Set([
  "fx-001","fx-002","fx-003","fx-004","fx-005","fx-006","fx-007","fx-008",
  "pixel-fx-32x32-grow-08","pixel-fx-32x32-grow-09","pixel-fx-32x32-grow-10","pixel-fx-32x32-grow-11","pixel-fx-32x32-grow-12"
]);

const TYPE_MIGRATION = { "烟雾": "元素", "粒子": "元素", "能量": "元素", "扭曲": "循环", "其他": "物体" };
const normalizeType = type => TYPE_MIGRATION[type] || type || "物体";
const TYPE_DIRECTORIES = { "光效": "light-effects", "序列": "sequences", "元素": "elements", "循环": "loops", "物体": "objects", "不展示": "hidden" };
function normalizeLibraryPath(value="") {
  const directoryMap={"光效":"light-effects","序列":"sequences","元素":"elements","循环":"loops","物体":"objects","_source":"hidden","source":"hidden"};
  let result=String(value);
  Object.entries(directoryMap).forEach(([oldName,newName])=>{result=result.replace(`assets/library/${oldName}/`,`assets/library/${newName}/`)});
  return result;
}

const KENNEY_SOURCE = "https://kenney.nl/assets/particle-pack";
const KENNEY_GROUPS = [
  { prefix: "circle", count: 5, type: "循环", label: "光环", tags: ["光环", "圆形"] },
  { prefix: "dirt", count: 3, type: "元素", label: "碎土", tags: ["泥土", "碎片"] },
  { prefix: "fire", count: 2, type: "元素", label: "爆燃", tags: ["火焰", "爆炸"] },
  { prefix: "flame", count: 6, type: "元素", label: "火焰", tags: ["火焰", "燃烧"] },
  { prefix: "flare", count: 1, type: "光效", label: "镜头光斑", tags: ["光斑", "闪光"] },
  { prefix: "light", count: 3, type: "光效", label: "能量光球", tags: ["光球", "能量"] },
  { prefix: "magic", count: 5, type: "光效", label: "魔法光效", tags: ["魔法", "光效"] },
  { prefix: "muzzle", count: 5, type: "光效", label: "枪口火光", tags: ["枪口", "火光"] },
  { prefix: "scorch", count: 3, type: "元素", label: "灼烧爆点", tags: ["灼烧", "爆点"] },
  { prefix: "scratch", count: 1, type: "元素", label: "抓痕", tags: ["抓痕", "划痕"] },
  { prefix: "slash", count: 4, type: "元素", label: "斩击", tags: ["斩击", "弧光"] },
  { prefix: "smoke", count: 10, type: "元素", label: "烟雾", tags: ["烟雾", "云团"] },
  { prefix: "spark", count: 7, type: "元素", label: "电弧", tags: ["闪电", "电弧"] },
  { prefix: "star", count: 9, type: "光效", label: "星芒", tags: ["星芒", "闪光"] },
  { prefix: "symbol", count: 2, type: "物体", label: "符号", tags: ["符号", "图形"] },
  { prefix: "trace", count: 7, type: "光效", label: "光迹", tags: ["光迹", "拖尾"] },
  { prefix: "twirl", count: 3, type: "循环", label: "旋涡", tags: ["旋涡", "环形"] },
  { prefix: "window", count: 4, type: "物体", label: "窗口纹样", tags: ["窗口", "纹样"] }
];

const kenneyAssets = KENNEY_GROUPS.flatMap(group =>
  Array.from({ length: group.count }, (_, index) => {
    const number = String(index + 1).padStart(2, "0");
    return {
      id: `kenney-${group.prefix}-${number}`,
      name: `${group.label} ${number}`,
      type: group.type,
      license: "CC0",
      tags: group.tags,
      source: "Kenney Particle Pack",
      sourceUrl: KENNEY_SOURCE,
      resolution: "512 × 512",
      format: "PNG",
      description: "来自 Kenney Particle Pack 的 CC0 特效贴图，可自由用于个人与商业项目。",
      image: `assets/library/${TYPE_DIRECTORIES[group.type]}/kenney-particle-pack/${group.prefix}_${number}.png`,
      createdAt: "2026-07-29",
      collectedAt: "2026-07-29T15:00:00+08:00"
    };
  })
);

const KENNEY_PATTERN_SOURCE = "https://kenney.nl/assets/pattern-pack";
const KENNEY_PATTERN_GROUPS = [
  { from: 1, to: 6, label: "条纹图案", tag: "条纹" },
  { from: 7, to: 12, label: "几何线纹", tag: "几何线条" },
  { from: 13, to: 16, label: "方格图案", tag: "方格" },
  { from: 17, to: 22, label: "砖墙图案", tag: "砖墙" },
  { from: 23, to: 24, label: "装饰纹样", tag: "几何纹样" },
  { from: 25, to: 31, label: "波纹图案", tag: "波纹" },
  { from: 32, to: 32, label: "圆点图案", tag: "圆点" },
  { from: 33, to: 33, label: "编织图案", tag: "编织" },
  { from: 34, to: 34, label: "星形图案", tag: "星形" },
  { from: 35, to: 36, label: "三角图案", tag: "三角形" },
  { from: 37, to: 42, label: "石块图案", tag: "不规则块面" },
  { from: 43, to: 45, label: "碎片图案", tag: "碎片" },
  { from: 46, to: 46, label: "星形图案", tag: "星形" },
  { from: 47, to: 48, label: "线框图案", tag: "几何线条" },
  { from: 49, to: 54, label: "几何块面", tag: "几何块面" },
  { from: 55, to: 56, label: "粒子方块", tag: "方块粒子" },
  { from: 57, to: 59, label: "块面图案", tag: "几何块面" },
  { from: 60, to: 68, label: "菱格图案", tag: "菱格" },
  { from: 69, to: 71, label: "圆点图案", tag: "圆点" },
  { from: 72, to: 72, label: "蜂窝图案", tag: "蜂窝" },
  { from: 73, to: 74, label: "圆点图案", tag: "圆点" },
  { from: 75, to: 75, label: "心形图案", tag: "心形" },
  { from: 76, to: 76, label: "方块图案", tag: "方块" },
  { from: 77, to: 77, label: "圆点网络", tag: "圆点" },
  { from: 78, to: 78, label: "菱格图案", tag: "菱格" },
  { from: 79, to: 80, label: "有机网格", tag: "有机网格" },
  { from: 81, to: 82, label: "粒子方块", tag: "方块粒子" },
  { from: 83, to: 83, label: "波纹图案", tag: "波纹" },
  { from: 84, to: 84, label: "交叉图案", tag: "交叉" }
];

const kenneyPatternAssets = Array.from({ length: 84 }, (_, index) => {
  const value = index + 1;
  const number = String(value).padStart(2, "0");
  const hour = String(12 + Math.floor(index / 60)).padStart(2, "0");
  const minute = String(index % 60).padStart(2, "0");
  const group = KENNEY_PATTERN_GROUPS.find(item => value >= item.from && value <= item.to);
  return {
    id: `kenney-pattern-${number}`,
    name: `${group.label} ${number}`,
    type: "循环",
    license: "CC0",
    tags: [group.tag, "无缝图案", "黑白"],
    source: "Kenney Pattern Pack",
    sourceUrl: KENNEY_PATTERN_SOURCE,
    resolution: "256 × 256",
    format: "PNG",
    description: "来自 Kenney Pattern Pack 的 CC0 无缝图案，可平铺用于材质、背景及循环纹理。",
    image: `assets/library/loops/kenney-pattern-pack/pattern_${number}.png`,
    createdAt: "2026-08-03",
    collectedAt: `2026-08-03T${hour}:${minute}:00+08:00`
  };
});

const KENNEY_SPLAT_SOURCE = "https://kenney.nl/assets/splat-pack";
const KENNEY_SPLAT_RADIAL = new Set([0, 1, 2, 10, 11, 18, 19, 20, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35]);
const kenneySplatAssets = Array.from({ length: 36 }, (_, index) => {
  const number = String(index).padStart(2, "0");
  const variant = KENNEY_SPLAT_RADIAL.has(index) ? "放射飞溅" : "圆润墨渍";
  return {
    id: `kenney-splat-${number}`,
    name: `${variant} ${number}`,
    type: "元素",
    license: "CC0",
    tags: ["溅射", variant, "透明背景"],
    source: "Kenney Splat Pack",
    sourceUrl: KENNEY_SPLAT_SOURCE,
    resolution: "512 × 512",
    format: "PNG",
    description: "来自 Kenney Splat Pack 的 CC0 透明背景溅射贴图，适用于液体、墨迹、污渍与击中特效。",
    image: `assets/library/elements/kenney-splat-pack/splat${number}.png`,
    createdAt: "2026-08-03",
    collectedAt: `2026-08-03T14:${number}:00+08:00`
  };
});

const KENNEY_LIGHT_MASK_SOURCE = "https://kenney.nl/assets/light-masks";
function createKenneyLightMaskAssets() {
  const files = [];
  const add = (prefix, letters, variants, label, tag) => {
    for (const letter of letters) for (const variant of variants) {
      files.push({ file: `${prefix}_${letter}${variant ? `_${variant}` : ""}`, label, tag, variant });
    }
  };
  add("circle", "abcd", ["", "noise", "streaks", "streaks_noise"], "圆形光照", "圆形光照");
  add("circle_rings", "abcd", ["", "noise", "streaks"], "同心光环", "同心光环");
  add("cone", "abcde", ["", "blur", "blur_noise", "noise"], "锥形光束", "光束");
  add("cone_composed", "abcdef", ["", "noise"], "组合光束", "光束");
  add("fan", "abcd", ["", "blur", "gradient"], "扇叶光影", "扇形光影");
  add("foliage_canopy", "abc", ["", "blur", "noise"], "树叶光斑", "植被光影");
  add("foliage_canopy", "d", ["", "noise"], "树叶光斑", "植被光影");
  add("ring", "abc", ["", "noise", "streaks"], "环形光晕", "光环");
  add("shape", "abcdefg", [""], "柔光形状", "柔光");
  add("streaks_composed", "abcdefgh", ["", "noise"], "组合星芒", "星芒");
  add("water_caustics", "abcd", [""], "水波焦散", "水波焦散");
  add("window", "abcdefghijk", ["", "blur", "noise"], "窗格投影", "窗格光影");
  const variantLabels = { "": "基础", noise: "噪点", streaks: "放射纹", streaks_noise: "放射纹噪点", blur: "柔化", blur_noise: "柔化噪点", gradient: "渐变" };
  return files.map((item, index) => {
    const number = String(index + 1).padStart(3, "0");
    return {
      id: `kenney-light-mask-${number}`,
      name: `${item.label} ${number}`,
      type: "光效",
      license: "CC0",
      tags: [item.tag, variantLabels[item.variant], "透明背景"],
      source: "Kenney Light Masks",
      sourceUrl: KENNEY_LIGHT_MASK_SOURCE,
      resolution: "512 × 512",
      format: "PNG",
      description: "来自 Kenney Light Masks 的 CC0 光照遮罩，可用于灯光投影、光束、光晕与环境光影效果。",
      image: `assets/library/light-effects/kenney-light-masks/${item.file}.png`,
      createdAt: "2026-08-03",
      collectedAt: `2026-08-03T15:${String(index % 60).padStart(2, "0")}:${String(Math.floor(index / 60)).padStart(2, "0")}+08:00`
    };
  });
}
const kenneyLightMaskAssets = createKenneyLightMaskAssets();

const BDRAGON_750_SOURCE = "https://bdragon1727.itch.io/750-effect-and-fx-pixel-all";
const BDRAGON_750_PARTS = {
  1: [3, 4, 5, 6, 13, 14, 15, 16, 23, 24, 25, 26],
  2: [62, 63, 64, 65, 69, 70, 71, 72, 76, 77, 78, 79],
  3: [113, 114, 115, 116, 123, 124, 125, 126, 133, 134, 135, 136],
  4: [174, 175, 176, 177, 184, 185, 186, 187, 194, 195, 196, 197],
  5: [220, 221, 222, 223, 230, 231, 232, 233, 240, 241, 242, 243],
  6: [273, 274, 275, 276, 283, 284, 285, 286, 293, 294, 295, 296],
  7: [313, 314, 315, 316, 323, 324, 325, 326, 333, 334, 335, 336],
  8: [375, 376, 377, 378, 385, 386, 387, 388, 395, 396, 397, 398],
  9: [426, 427, 428, 429, 436, 437, 438, 439, 446, 447, 448, 449],
  10: [464, 465, 466, 467, 474, 475, 476, 477, 484, 485, 486, 487],
  11: [506, 507, 508, 509, 516, 517, 518, 519, 526, 527, 528, 529],
  12: [566, 567, 568, 569, 576, 577, 578, 579, 586, 587, 588, 589],
  13: [612, 613, 614, 615, 622, 623, 624, 625, 632, 633, 634, 635],
  14: [652, 653, 654, 655, 662, 663, 664, 665, 672, 673, 674, 675],
  15: [700, 701, 702, 703, 710, 711, 712, 713, 720, 721, 722, 723]
};
const BDRAGON_750_WIDTHS = {
  320: [223, 230], 384: [323], 448: [63, 315],
  512: [62, 64, 65, 220, 241, 273, 274, 275, 276, 284, 285, 313, 316, 324, 325, 326, 336, 375, 376, 377, 378, 385, 387, 396, 427],
  576: [70, 222, 231, 232, 283, 286, 293, 294, 295, 296, 314, 333, 334, 335, 386, 388, 395, 397, 398, 436, 447, 449, 526],
  640: [69, 71, 72, 174, 175, 176, 221, 233, 240, 242, 243, 426, 428, 429, 437, 438, 439, 446, 448],
  704: [76, 78, 177, 184, 464, 466, 467, 474, 487, 506, 578],
  768: [77, 79, 113, 114, 115, 116, 123, 124, 125, 126, 133, 134, 135, 136, 185, 186, 187, 194, 465, 475, 476, 477, 484, 485, 486, 507, 516, 517, 518, 519],
  832: [3, 13, 508, 509, 527, 528, 529, 566, 567, 569, 587, 623],
  896: [4, 5, 14, 15, 16, 23, 24, 25, 26, 195, 196, 197, 568, 576, 577, 579, 586, 588, 589, 614, 615, 622, 624, 632, 635, 672],
  960: [6, 612, 613, 625, 633, 634, 655, 662], 1024: [652, 663, 664, 665],
  1088: [653, 654, 702], 1152: [673, 674, 710], 1216: [675, 701], 1280: [711, 720],
  1344: [712], 1408: [700, 703, 721], 1472: [713, 722, 723]
};
const BDRAGON_750_WIDTH_BY_ID = new Map(Object.entries(BDRAGON_750_WIDTHS).flatMap(([width, ids]) => ids.map(id => [id, Number(width)])));
function createBdragon750SequenceAssets() {
  let order = 0;
  return Object.entries(BDRAGON_750_PARTS).flatMap(([partValue, ids]) => {
    const part = Number(partValue);
    return ids.map(value => {
      const index = order++;
      const idNumber = String(value).padStart(3, "0");
      const fileName = value < 10 ? String(value).padStart(2, "0") : String(value);
      const width = BDRAGON_750_WIDTH_BY_ID.get(value);
      return {
        id: `bdragon-750-sequence-${idNumber}`,
        name: `像素特效序列 ${idNumber}`,
        type: "序列",
        license: "待核实",
        tags: ["像素序列", `第 ${String(part).padStart(2, "0")} 组`, `${width / 64} 帧`, "多色变体"],
        source: "750 Effect and FX Pixel All by bdragon1727",
        sourceUrl: BDRAGON_750_SOURCE,
        resolution: `${width} × 576`,
        format: "PNG",
        description: "来自 bdragon1727 的像素特效序列图集，包含横向动画帧与多行配色变体；授权等级尚待核实。",
        image: `assets/library/sequences/bdragon-750-fx/part-${String(part).padStart(2, "0")}/${fileName}.png`,
        createdAt: "2026-08-03",
        collectedAt: `2026-08-03T${String(16 + Math.floor(index / 60)).padStart(2, "0")}:${String(index % 60).padStart(2, "0")}:00+08:00`
      };
    });
  });
}
const bdragon750SequenceAssets = [];
const codeManuVfxAssets = globalThis.CODEMANU_VFX_ASSETS || [];
const unityWispySmokeAssets = globalThis.UNITY_WISPY_SMOKE_ASSETS || [];
const rpicsterVfxAssets = globalThis.RPICSTER_VFX_ASSETS || [];

const PIXEL_FX_SOURCE = "https://bdragon1727.itch.io/fx-pixel-texture";
const PIXEL_FX_GROUPS = [
  { prefix: "16x16_FX", count: 9, type: "元素", label: "基础像素特效", tags: ["基础特效", "像素"], resolution: "16 × 16" },
  { prefix: "32x16_FX", count: 8, type: "元素", label: "像素弹道", tags: ["弹道", "像素"], resolution: "32 × 16" },
  { prefix: "32x32_Arcane", count: 17, type: "光效", label: "像素魔法", tags: ["魔法", "像素"], resolution: "32 × 32" },
  { prefix: "32x32_Circle", count: 14, type: "循环", label: "像素光环", tags: ["光环", "像素"], resolution: "32 × 32" },
  { prefix: "32x32_Grow", count: 13, type: "元素", label: "像素扩散", tags: ["扩散", "像素"], resolution: "32 × 32" },
  { prefix: "32x32_Impact", count: 14, type: "元素", label: "像素冲击", tags: ["冲击", "像素"], resolution: "32 × 32" },
  { prefix: "32x32_Star", count: 11, type: "光效", label: "像素星芒", tags: ["星芒", "像素"], resolution: "32 × 32" },
  { prefix: "48x48_FX", count: 7, type: "元素", label: "像素爆发", tags: ["爆发", "像素"], resolution: "48 × 48" },
  { prefix: "48x48_Light", count: 12, type: "光效", label: "像素能量", tags: ["能量", "像素"], resolution: "48 × 48" },
  { prefix: "64x64_Aura", count: 10, type: "循环", label: "像素光环", tags: ["光环", "像素"], resolution: "64 × 64" },
  { prefix: "64x64_FX", count: 17, type: "光效", label: "像素能量环", tags: ["能量环", "像素"], resolution: "64 × 64" }
];

const pixelFxAssets = PIXEL_FX_GROUPS.flatMap(group =>
  Array.from({ length: group.count }, (_, index) => {
    const number = String(index + 1).padStart(2, "0");
    return {
      id: `pixel-fx-${group.prefix.toLowerCase().replaceAll("_", "-")}-${number}`,
      name: `${group.label} ${number}`,
      type: group.type,
      license: "CC0",
      tags: group.tags,
      source: "FX Pixel Texture by bdragon1727",
      sourceUrl: PIXEL_FX_SOURCE,
      resolution: group.resolution,
      format: "PNG",
      description: "来自 bdragon1727 的 FX Pixel Texture CC0 像素特效贴图，可自由用于个人与商业项目。",
      image: `assets/library/${TYPE_DIRECTORIES[group.type]}/fx-pixel-texture/${group.prefix}_${index}.png`,
      createdAt: "2026-07-29",
      collectedAt: "2026-07-29T17:00:00+08:00"
    };
  })
);

const pixelFxAtlasAssets = Array.from({ length: 7 }, (_, index) => {
  const number = String(index).padStart(2, "0");
  return {
    id: `pixel-fx-atlas-${number}`,
    name: `像素特效彩色图集 ${number}`,
    type: "不展示",
    license: "CC0",
    tags: [],
    source: "FX Pixel Texture by bdragon1727",
    sourceUrl: PIXEL_FX_SOURCE,
    resolution: "640 × 480",
    format: "PNG",
    description: "FX Pixel Texture 的原始彩色贴图合集，尚未设置主要细分类。",
    image: `assets/library/hidden/fx-pixel-texture/atlases/${number}_Pixel_FX_Texture.png`,
    createdAt: "2026-07-29",
    collectedAt: `2026-07-29T17:01:0${index}+08:00`
  };
});

const retiredDefaultTestAssets = [
  { id: "fx-001", name: "星云脉冲", type: "能量", license: "CC0", tags: ["紫色", "星云", "爆发"], source: "Lumina Original", sourceUrl: "https://creativecommons.org/publicdomain/zero/1.0/deed.zh-hans", resolution: "4096 × 4096", format: "PNG", description: "由中心向外扩散的高能星云脉冲，适合作为技能爆发、传送或空间场景的叠加素材。", createdAt: "2026-07-24", preset: "nebula", colors: ["#a43fff", "#321069", "#ff75dc"] },
  { id: "fx-002", name: "日蚀光环", type: "光效", license: "CC0", tags: ["金色", "光环", "日蚀"], source: "Lumina Original", sourceUrl: "https://creativecommons.org/publicdomain/zero/1.0/deed.zh-hans", resolution: "4096 × 4096", format: "PNG", description: "柔和而明亮的环形逆光，可用于太阳、传送门和角色轮廓光。", createdAt: "2026-07-22", preset: "eclipse", colors: ["#ffe167", "#ff9238", "#39190c"] },
  { id: "fx-003", name: "电弧裂隙", type: "能量", license: "CC0", tags: ["蓝色", "闪电", "裂隙"], source: "Lumina Original", sourceUrl: "https://creativecommons.org/publicdomain/zero/1.0/deed.zh-hans", resolution: "2048 × 2048", format: "PNG", description: "锐利的蓝色电弧交错形成空间裂隙，适合科幻与魔法类视觉设计。", createdAt: "2026-07-20", preset: "electric", colors: ["#64ecff", "#126dff", "#061527"] },
  { id: "fx-004", name: "绯红烟幕", type: "烟雾", license: "CC0", tags: ["红色", "烟雾", "氛围"], source: "Lumina Original", sourceUrl: "https://creativecommons.org/publicdomain/zero/1.0/deed.zh-hans", resolution: "4096 × 3072", format: "PNG", description: "层叠翻涌的绯红烟雾，适合作为战斗、灾变和暗黑场景的气氛素材。", createdAt: "2026-07-18", preset: "smoke", colors: ["#ff473d", "#77151c", "#18090b"] },
  { id: "fx-005", name: "翡翠粒子流", type: "粒子", license: "CC0", tags: ["绿色", "粒子", "流动"], source: "Lumina Original", sourceUrl: "https://creativecommons.org/publicdomain/zero/1.0/deed.zh-hans", resolution: "3840 × 2160", format: "PNG", description: "沿曲线运动的翡翠色微粒，可用于治愈、自然能量和数据流动效果。", createdAt: "2026-07-15", preset: "particles", colors: ["#c3ff4f", "#21cc8b", "#06271d"] },
  { id: "fx-006", name: "引力波纹", type: "扭曲", license: "CC0", tags: ["黑白", "波纹", "空间"], source: "Lumina Original", sourceUrl: "https://creativecommons.org/publicdomain/zero/1.0/deed.zh-hans", resolution: "2048 × 2048", format: "PNG", description: "高对比度的同心引力波纹，可作为置换贴图或空间扭曲效果使用。", createdAt: "2026-07-13", preset: "ripple", colors: ["#f4f2df", "#9a9e8d", "#121411"] },
  { id: "fx-007", name: "极光薄雾", type: "烟雾", license: "CC0", tags: ["青色", "极光", "柔光"], source: "Lumina Original", sourceUrl: "https://creativecommons.org/publicdomain/zero/1.0/deed.zh-hans", resolution: "4096 × 2160", format: "PNG", description: "轻盈的青紫色极光薄雾，适用于梦境、冰雪或未来感背景。", createdAt: "2026-07-10", preset: "aurora", colors: ["#77ffe0", "#9275ff", "#071e24"] },
  { id: "fx-008", name: "熔火飞星", type: "粒子", license: "CC0", tags: ["橙色", "火焰", "火星"], source: "Lumina Original", sourceUrl: "https://creativecommons.org/publicdomain/zero/1.0/deed.zh-hans", resolution: "3840 × 2160", format: "PNG", description: "高温火星从熔火核心迸射而出，适合爆炸、锻造和火焰技能。", createdAt: "2026-07-08", preset: "embers", colors: ["#fff273", "#ff6b1c", "#270b05"] }
];

const seedAssets = [];

const legacyBundledAssets = [...kenneyAssets, ...pixelFxAssets, ...pixelFxAtlasAssets];
const bundledAssets = [...legacyBundledAssets, ...kenneyPatternAssets, ...kenneySplatAssets, ...kenneyLightMaskAssets, ...bdragon750SequenceAssets, ...codeManuVfxAssets, ...unityWispySmokeAssets, ...rpicsterVfxAssets];
const bundledAssetById = new Map(bundledAssets.map(asset => [asset.id, asset]));

function migrateDeletionLedger() {
  if(localStorage.getItem(DELETION_LEDGER_MIGRATION_KEY))return;
  try {
    const raw=localStorage.getItem(STORAGE_KEY);
    const parsed=raw===null?null:JSON.parse(raw);
    const hasSavedAssets=Array.isArray(parsed)&&parsed.length>0;
    const testIds=PERMANENTLY_DELETED_ASSET_IDS;
    const active=Array.isArray(parsed)?parsed.filter(item=>!testIds.has(String(item.id))):[];
    if(Array.isArray(parsed)&&active.length!==parsed.length)localStorage.setItem(STORAGE_KEY,JSON.stringify(active));
    const activeIds=new Set(active.map(item=>String(item.id)));
    const recovered=hasSavedAssets?legacyBundledAssets.filter(item=>!item.id.startsWith("pixel-fx-atlas-")&&!activeIds.has(String(item.id))):[];
    const savedIds=JSON.parse(localStorage.getItem(DELETED_ASSETS_KEY)||"[]");
    const savedRecords=JSON.parse(localStorage.getItem(DELETED_RECORDS_KEY)||"[]");
    const ids=new Set(Array.isArray(savedIds)?savedIds.map(String):[]);
    const records=new Map((Array.isArray(savedRecords)?savedRecords:[]).map(item=>[String(item.id),item]));
    const deletedAt=new Date().toISOString();
    const defaults=retiredDefaultTestAssets.map(item=>({id:item.id,name:item.name,image:"",type:"",source:"MewFX Original / 默认测试贴图",sourceUrl:""}));
    const forced=bundledAssets.filter(item=>PERMANENTLY_DELETED_ASSET_IDS.has(String(item.id)));
    [...defaults,...forced,...recovered].forEach(item=>{
      const id=String(item.id);
      ids.add(id);
      if(!records.has(id))records.set(id,{id,name:item.name||"历史删除记录",image:normalizeLibraryPath(item.image||""),type:item.type||"",source:item.source||"其他来源",sourceUrl:item.sourceUrl||"",deletedAt});
    });
    localStorage.setItem(DELETED_ASSETS_KEY,JSON.stringify([...ids]));
    localStorage.setItem(DELETED_RECORDS_KEY,JSON.stringify([...records.values()]));
    localStorage.setItem(DELETION_LEDGER_MIGRATION_KEY,"1");
  }catch{}
}

migrateDeletionLedger();

function migrateUnitySmokeCc0() {
  if(localStorage.getItem(UNITY_SMOKE_CC0_MIGRATION_KEY))return;
  try {
    const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||"[]");
    if(Array.isArray(saved)){
      const currentById=new Map(unityWispySmokeAssets.map(item=>[String(item.id),item]));
      const updated=saved.map(item=>{
        const current=currentById.get(String(item.id));
        if(!current)return item;
        const {lightPreview,downloadDisabled,...legacy}=item;
        return {...legacy,...current};
      });
      localStorage.setItem(STORAGE_KEY,JSON.stringify(updated));
    }
    localStorage.setItem(UNITY_SMOKE_CC0_MIGRATION_KEY,"1");
  } catch {}
}

migrateUnitySmokeCc0();

function migrateRpicsterTaxonomy() {
  if(localStorage.getItem(RPICSTER_TAXONOMY_MIGRATION_KEY))return;
  try {
    const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||"[]");
    if(Array.isArray(saved)){
      const currentById=new Map(rpicsterVfxAssets.map(item=>[String(item.id),item]));
      const updated=saved.map(item=>{
        const current=currentById.get(String(item.id));
        return current?{...item,tags:current.tags,primaryTags:current.primaryTags,secondaryTags:current.secondaryTags}:item;
      });
      localStorage.setItem(STORAGE_KEY,JSON.stringify(updated));
    }
    localStorage.setItem(RPICSTER_TAXONOMY_MIGRATION_KEY,"1");
  } catch {}
}

migrateRpicsterTaxonomy();

function migrateRpicsterCc0() {
  if(localStorage.getItem(RPICSTER_CC0_MIGRATION_KEY))return;
  try {
    const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||"[]");
    if(Array.isArray(saved)){
      const currentById=new Map(rpicsterVfxAssets.map(item=>[String(item.id),item]));
      const updated=saved.map(item=>{
        const current=currentById.get(String(item.id));
        if(!current)return item;
        const {downloadDisabled,...legacy}=item;
        return {...legacy,...current};
      });
      localStorage.setItem(STORAGE_KEY,JSON.stringify(updated));
    }
    localStorage.setItem(RPICSTER_CC0_MIGRATION_KEY,"1");
  } catch {}
}

migrateRpicsterCc0();

let assets = loadAssets();
try { localStorage.setItem(STORAGE_KEY, JSON.stringify(assets)); localStorage.setItem(HIDDEN_TYPE_MIGRATION_KEY,"1"); } catch {}
let lastAssetStorageSnapshot = localStorage.getItem(STORAGE_KEY) || "";
let lastDeletedStorageSnapshot = localStorage.getItem(DELETED_ASSETS_KEY) || "";
let activeType = "全部";
let activeTag = "全部";
let query = "";
let sortNewest = true;
let selectedId = null;
let currentPage = 1;
let lastColumnCount = 0;
let sequenceCardPreviews = [];
let detailSequencePreview = null;
let sequenceAnimationRequest = 0;

const $ = (selector) => document.querySelector(selector);
const grid = $("#assetGrid");
const dialog = $("#assetDialog");
const COLLECTION_PREVIEW_URLS = {
  "bdragon-750": "https://img.itch.zone/aW1hZ2UvMjkzODMwMS8xNzYwMzU0NC5naWY=/original/0gFHAh.gif",
  "simple-sfx": "https://img.itch.zone/aW1nLzI3ODQ5ODgxLmdpZg==/original/7mNZvK.gif"
};

function initCollectionPreviews() {
  document.querySelectorAll("[data-collection-preview]").forEach(container => {
    const source = COLLECTION_PREVIEW_URLS[container.dataset.collectionPreview];
    if (!source) return;
    const preview = new Image();
    preview.className = "collection-preview";
    preview.alt = "";
    preview.loading = "lazy";
    preview.referrerPolicy = "no-referrer";
    preview.addEventListener("load", () => container.classList.add("has-preview"), { once: true });
    preview.addEventListener("error", () => preview.remove(), { once: true });
    preview.src = source;
    container.appendChild(preview);
  });
}

function loadAssets() {
  try {
    const deletedValue = JSON.parse(localStorage.getItem(DELETED_ASSETS_KEY) || "[]");
    const deletedIds = new Set([...(Array.isArray(deletedValue) ? deletedValue.map(String) : []),...PERMANENTLY_DELETED_ASSET_IDS]);
    const raw = localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(LEGACY_STORAGE_KEY);
    const saved = JSON.parse(raw);
    const list = (Array.isArray(saved) ? saved : structuredClone(seedAssets))
      .filter(asset => !deletedIds.has(String(asset.id)))
      .filter(asset => !String(asset.id).startsWith("bdragon-750-sequence-") && asset.id !== "bdragon-750-source");
    const migrateHiddenType=!localStorage.getItem(HIDDEN_TYPE_MIGRATION_KEY);
    const normalized = list.map(asset => {
      const bundled = bundledAssetById.get(asset.id);
      const hasCanonicalLicense=String(asset.id).startsWith("unity-wispy-smoke-")||String(asset.id).startsWith("rpicster-");
      const canonicalLicense=hasCanonicalLicense&&bundled?{
        license:bundled.license,
        licenseUrl:bundled.licenseUrl,
        attributionRequired:bundled.attributionRequired,
        optionalAttribution:bundled.optionalAttribution,
        downloadDisabled:bundled.downloadDisabled,
        downloadUrl:bundled.downloadUrl,
        downloadFileName:bundled.downloadFileName
      }:{};
      return {
        ...asset,
        ...canonicalLicense,
        type: migrateHiddenType&&asset.id?.startsWith("pixel-fx-atlas-")&&asset.type==="物体"&&!(asset.tags||[]).length?"不展示":normalizeType(asset.type),
        resolution: bundled?.resolution || asset.resolution,
        source: ["Lumina Original", "KITTYME Original"].includes(asset.source) ? "MewFX Original" : asset.source,
        image: bundled?.image || normalizeLibraryPath(asset.image),
        collectedAt: bundled?.collectedAt || asset.collectedAt || asset.createdAt
      };
    });
    const existingIds = new Set(normalized.map(asset => asset.id));
    return [...normalized, ...bundledAssets.filter(asset => !existingIds.has(asset.id) && !deletedIds.has(String(asset.id)))];
  } catch {
    let deletedIds = new Set();
    try {
      const deletedValue = JSON.parse(localStorage.getItem(DELETED_ASSETS_KEY) || "[]");
      deletedIds = new Set([...(Array.isArray(deletedValue) ? deletedValue.map(String) : []),...PERMANENTLY_DELETED_ASSET_IDS]);
    } catch {}
    return [
      ...structuredClone(seedAssets).map(asset => ({ ...asset, type: normalizeType(asset.type), source: "MewFX Original" })),
      ...bundledAssets
    ].filter(asset => !deletedIds.has(String(asset.id)));
  }
}

function persist() {
  try { const serialized=JSON.stringify(assets);localStorage.setItem(STORAGE_KEY,serialized);lastAssetStorageSnapshot=serialized; }
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

function updateSequenceAnimations(timestamp) {
  const previews = detailSequencePreview ? [...sequenceCardPreviews, detailSequencePreview] : sequenceCardPreviews;
  previews.forEach(preview => {
    const frameIndex = Math.floor(timestamp * preview.frameRate / 1000) % preview.frames.length;
    if (frameIndex === preview.lastFrame) return;
    preview.lastFrame = frameIndex;
    preview.apply(preview.frames[frameIndex]);
  });
  sequenceAnimationRequest = previews.length ? requestAnimationFrame(updateSequenceAnimations) : 0;
}

function syncSequenceAnimations() {
  const hasPreviews = sequenceCardPreviews.length > 0 || Boolean(detailSequencePreview);
  if (hasPreviews && !sequenceAnimationRequest) sequenceAnimationRequest = requestAnimationFrame(updateSequenceAnimations);
  if (!hasPreviews && sequenceAnimationRequest) {
    cancelAnimationFrame(sequenceAnimationRequest);
    sequenceAnimationRequest = 0;
  }
}

function assetDimensions(asset) {
  const match = String(asset.resolution || "").match(/(\d+)\s*[×xX]\s*(\d+)/);
  return match ? { width: Number(match[1]), height: Number(match[2]) } : null;
}

function isSmallAsset(asset) {
  const dimensions = assetDimensions(asset);
  return Boolean(asset.type !== "序列" && dimensions && dimensions.width < 128 && dimensions.height < 128);
}

function collectionTime(asset) {
  const value = asset.collectedAt || asset.createdAt || asset.submittedAt || "";
  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function visibleAssets() {
  const normalized = query.trim().toLowerCase();
  return [...assets]
    .filter(asset => asset.type !== "不展示")
    .filter(asset => activeType === "全部" || asset.type === activeType)
    .filter(asset => activeTag === "全部" || primaryTagsFor(asset).includes(activeTag))
    .filter(asset => !normalized || [asset.name, asset.type, asset.source, ...asset.tags].join(" ").toLowerCase().includes(normalized))
    .sort((a, b) => {
      const timeDifference = collectionTime(b) - collectionTime(a);
      const orderedDifference = sortNewest ? timeDifference : -timeDifference;
      return orderedDifference || String(a.id).localeCompare(String(b.id));
    });
}

function columnsPerPage() {
  return Math.max(1, Number.parseInt(getComputedStyle(grid).getPropertyValue("--grid-columns"), 10) || 1);
}

function pageSize() {
  return columnsPerPage() * 10;
}

function pageItems(totalPages) {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1);
  const pages = new Set([1, totalPages, currentPage - 1, currentPage, currentPage + 1]);
  return [...pages].filter(page => page > 0 && page <= totalPages).sort((a, b) => a - b);
}

function renderPagination(totalItems, perPage) {
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage));
  currentPage = Math.min(Math.max(1, currentPage), totalPages);
  const items = pageItems(totalPages);
  let previous = 0;
  const numberMarkup = items.map(page => {
    const gap = previous && page - previous > 1 ? '<span class="page-gap">…</span>' : "";
    previous = page;
    return `${gap}<button type="button" data-page="${page}" class="${page === currentPage ? "active" : ""}" aria-label="第 ${page} 页"${page === currentPage ? ' aria-current="page"' : ""}>${page}</button>`;
  }).join("");
  const start = totalItems ? (currentPage - 1) * perPage + 1 : 0;
  const end = Math.min(currentPage * perPage, totalItems);
  document.querySelectorAll("[data-pagination]").forEach(pagination => {
    pagination.hidden = totalItems === 0;
    pagination.querySelector(".previous-page").disabled = currentPage === 1;
    pagination.querySelector(".next-page").disabled = currentPage === totalPages;
    pagination.querySelector(".page-numbers").innerHTML = numberMarkup;
    pagination.querySelector(".page-summary").textContent = `${start}–${end} / ${totalItems}`;
    pagination.querySelectorAll("[data-page]").forEach(button => button.addEventListener("click", () => {
      currentPage = Number(button.dataset.page);
      render();
      grid.scrollIntoView({ behavior: "smooth", block: "start" });
    }));
  });
}

function availableTags() {
  if (activeType === "全部") return [];
  const counts = new Map();
  assets.filter(asset => asset.type !== "不展示" && asset.type === activeType).forEach(asset =>
    primaryTagsFor(asset).forEach(tag => counts.set(tag, (counts.get(tag) || 0) + 1))
  );
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "zh-CN"));
}

function primaryTagsFor(asset) {
  const tags = asset.tags || [];
  const primary = tags.slice(0, 1);
  return primary.length ? primary : (asset.primaryTags || []).slice(0, 1);
}

function secondaryTagsFor(asset) {
  const primary = new Set(primaryTagsFor(asset));
  const tags = (asset.tags || []).filter(tag => !primary.has(tag));
  return tags.length ? tags : (asset.secondaryTags || []).filter(tag => !primary.has(tag));
}

function downloadFileName(asset) {
  const format = String(asset.format || "PNG").toLowerCase().replace(/[^a-z0-9]/g, "") || "png";
  const safeName = String(asset.name || "kittyme-asset").replace(/[\\/:*?"<>|]/g, "-").trim();
  return `${safeName}.${format}`;
}

async function downloadAsset(asset) {
  if (!asset || asset.downloadDisabled) return;
  if (asset.downloadUrl) {
    const link = document.createElement("a");
    link.href = asset.downloadUrl;
    link.download = asset.downloadFileName || "kittyme-sequence.zip";
    document.body.appendChild(link);
    link.click();
    link.remove();
    showToast("已开始下载 30 FPS Frames 序列");
    return;
  }
  const source = imageFor(asset);
  try {
    const image = new Image();
    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = reject;
      image.src = source;
    });
    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const context = canvas.getContext("2d");
    context.drawImage(image, 0, 0);
    const blob = await new Promise((resolve, reject) =>
      canvas.toBlob(value => value ? resolve(value) : reject(new Error("无法生成下载文件")), "image/png")
    );
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = downloadFileName(asset).replace(/\.[^.]+$/, ".png");
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    showToast("已开始下载原图");
  } catch {
    showToast("本地浏览器阻止下载，请通过网站地址访问后重试");
  }
}

function renderTagFilters() {
  const tags = availableTags();
  $("#subfilterWrap").hidden = tags.length === 0;
  $("#tagFilters").innerHTML = tags.length ? `
    <button class="tag-filter${activeTag === "全部" ? " active" : ""}" data-tag="全部">全部</button>
    ${tags.map(([tag, count]) => `<button class="tag-filter${activeTag === tag ? " active" : ""}" data-tag="${escapeHtml(tag)}">${escapeHtml(tag)} <small>${count}</small></button>`).join("")}` : "";
  $("#tagFilters").querySelectorAll("[data-tag]").forEach(button => button.addEventListener("click", () => {
    activeTag = button.dataset.tag;
    currentPage = 1;
    $("#tagFilters").querySelectorAll("[data-tag]").forEach(item => item.classList.toggle("active", item === button));
    render();
  }));
}

async function detectMissingResolutions() {
  const targets = assets.filter(asset => asset.image && (!asset.resolution || asset.resolution === "未标注"));
  if (!targets.length) return;
  let changed = false;
  await Promise.all(targets.map(asset => new Promise(resolve => {
    const detector = new Image();
    detector.onload = () => {
      asset.resolution = `${detector.naturalWidth} × ${detector.naturalHeight}`;
      changed = true;
      resolve();
    };
    detector.onerror = resolve;
    detector.src = asset.image;
  })));
  if (changed) persist();
}

function render() {
  sequenceCardPreviews = [];
  const filteredList = visibleAssets();
  const perPage = pageSize();
  const totalPages = Math.max(1, Math.ceil(filteredList.length / perPage));
  currentPage = Math.min(currentPage, totalPages);
  const startIndex = (currentPage - 1) * perPage;
  const list = filteredList.slice(startIndex, startIndex + perPage);
  grid.innerHTML = list.map((asset, i) => `
    <article class="asset-card asset-card-compact${isSmallAsset(asset) ? " asset-card-pixel" : ""}${asset.type === "序列" && !asset.externalOnly ? " asset-card-sequence" : ""}${asset.smoothPreview || asset.id.startsWith("codemanu-vfx-") ? " asset-card-smooth-sequence" : ""}${asset.darkPreview ? " asset-card-dark-preview" : ""}${asset.externalOnly ? " asset-card-external" : ""}" tabindex="0" data-id="${asset.id}" aria-label="查看 ${escapeHtml(asset.name)}">
      <div class="card-preview">
        <span class="card-index">${String(startIndex + i + 1).padStart(2, "0")}</span>
        <span class="card-license">${escapeHtml(asset.license)}</span>
        <img class="asset-preview" src="${imageFor(asset)}" alt="${escapeHtml(asset.name)} 特效贴图预览" loading="lazy" />
      </div>
      <div class="card-info"><div><h3>${escapeHtml(asset.name)}</h3><p>${asset.tags.slice(0, 3).map(escapeHtml).join(" · ")}</p></div><span>${escapeHtml(asset.type)}</span></div>
    </article>`).join("");
  $("#resultCount").textContent = `${filteredList.length} ITEMS`;
  $("#assetCount").textContent = String(assets.filter(asset => asset.type !== "不展示").length).padStart(2, "0");
  $("#emptyState").hidden = filteredList.length > 0;
  renderPagination(filteredList.length, perPage);
  grid.querySelectorAll(".asset-card").forEach(card => {
    card.addEventListener("click", () => openDetail(card.dataset.id));
    card.addEventListener("keydown", e => { if (e.key === "Enter") openDetail(card.dataset.id); });
    const asset = assets.find(item => item.id === card.dataset.id);
    if (asset?.sequenceFrames?.length > 1) {
      const image = card.querySelector(".asset-preview");
      sequenceCardPreviews.push({
        frames: asset.sequenceFrames,
        frameRate: Math.max(1, Number(asset.frameRate) || 30),
        lastFrame: -1,
        apply: source => { image.src = source; }
      });
    }
  });
  grid.querySelectorAll(".asset-preview").forEach(image => {
    const applyPreviewMode = () => {
      const asset = assets.find(item => item.id === image.closest(".asset-card")?.dataset.id);
      const isPixelAsset = asset?.type !== "序列" && image.naturalWidth < 128 && image.naturalHeight < 128;
      image.classList.toggle("compact-preview", isPixelAsset);
      image.classList.toggle("pixel-preview", isPixelAsset);
    };
    if (image.complete) applyPreviewMode();
    else image.addEventListener("load", applyPreviewMode, { once: true });
  });
  syncSequenceAnimations();
}

function openDetail(id) {
  const asset = assets.find(item => item.id === id);
  if (!asset) return;
  selectedId = id;
  const smallAsset = isSmallAsset(asset);
  const dimensions = assetDimensions(asset);
  const hasSequencePreview = asset.sequenceFrames?.length > 1;
  const detailPreview = $("#detailPreview");
  const detailSequenceImage = $("#detailSequenceImage");
  const previewScale = asset.type === "序列" && !asset.externalOnly ? 92 : smallAsset ? 50 : 72;
  dialog.classList.toggle("small-asset-detail", smallAsset);
  dialog.classList.toggle("sequence-asset-detail", asset.type === "序列" && !asset.externalOnly);
  dialog.classList.toggle("smooth-sequence-detail", Boolean(asset.smoothPreview || asset.id.startsWith("codemanu-vfx-")));
  dialog.classList.toggle("dark-asset-detail", Boolean(asset.darkPreview));
  detailSequenceImage.hidden = !hasSequencePreview;
  detailSequenceImage.alt = hasSequencePreview ? `${asset.name} 序列预览` : "";
  if(hasSequencePreview)detailSequenceImage.src = imageFor(asset);
  else detailSequenceImage.removeAttribute("src");
  detailPreview.style.backgroundImage = hasSequencePreview ? "none" : `url("${imageFor(asset)}")`;
  detailPreview.style.backgroundSize = dimensions && dimensions.height > dimensions.width
    ? `auto ${previewScale}%`
    : `${previewScale}% auto`;
  $("#detailCode").textContent = asset.id.toUpperCase().replace("FX-", "FX—");
  $("#detailLicense").textContent = asset.license;
  $("#detailName").textContent = asset.name;
  $("#detailDescription").textContent = asset.description || "暂无简介。";
  $("#detailType").textContent = asset.type;
  $("#detailResolution").textContent = asset.resolution || "未标注";
  $("#detailFormat").textContent = asset.format || "未标注";
  $("#detailSource").textContent = asset.source;
  const primaryTags = primaryTagsFor(asset);
  const secondaryTags = secondaryTagsFor(asset);
  $("#detailPrimaryTags").innerHTML = primaryTags.map(tag => `<span># ${escapeHtml(tag)}</span>`).join("");
  $("#detailSecondaryTags").innerHTML = secondaryTags.map(tag => `<span># ${escapeHtml(tag)}</span>`).join("");
  $("#detailSecondaryGroup").hidden = secondaryTags.length === 0;
  $("#sourceLink").href = asset.sourceUrl || "#";
  $("#sourceLink").hidden = !asset.sourceUrl;
  $("#sourceLink").textContent = asset.externalOnly ? "前往作者页面下载 ↗" : "访问素材出处 ↗";
  $("#detailDownload").hidden = Boolean(asset.externalOnly || asset.downloadDisabled);
  $("#detailDownload").textContent = asset.downloadUrl ? "下载 Frames ZIP ↓" : "下载原图 ↓";
  $("#detailLicenseNote").textContent = asset.attributionRequired
    ? "使用与再分发时必须署名原作者，并保留来源及许可证链接。"
    : "请以素材原始页面的实时授权条款为准。本站不对第三方授权变更作担保。";
  $("#detailLicenseLink").href = asset.licenseUrl || "#";
  $("#detailLicenseLink").hidden = !asset.licenseUrl;
  detailSequencePreview = hasSequencePreview ? {
    frames: asset.sequenceFrames,
    frameRate: Math.max(1, Number(asset.frameRate) || 30),
    lastFrame: -1,
    apply: source => { detailSequenceImage.src = source; }
  } : null;
  syncSequenceAnimations();
  dialog.showModal();
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

function setActiveNavigation(href) {
  const navigation = document.querySelector(".main-nav");
  const links = [...navigation.querySelectorAll("a[href^='#']")];
  links.forEach(link =>
    link.classList.toggle("active", link.getAttribute("href") === href)
  );
  const activeLink = links.find(link => link.classList.contains("active"));
  const indicator = navigation.querySelector(".nav-indicator");
  if (activeLink && indicator) {
    indicator.style.width = `${activeLink.offsetWidth}px`;
    indicator.style.transform = `translateX(${activeLink.offsetLeft}px)`;
  }
}

document.querySelectorAll(".main-nav a[href^='#']").forEach(link => link.addEventListener("click", () => {
  setActiveNavigation(link.getAttribute("href"));
}));
window.addEventListener("hashchange", () => setActiveNavigation(location.hash || "#gallery"));
window.addEventListener("resize", () => setActiveNavigation(location.hash || "#gallery"));
document.fonts?.ready.then(() => setActiveNavigation(location.hash || "#gallery"));

$("#typeFilters").addEventListener("click", event => {
  const button = event.target.closest("button[data-filter]");
  if (!button) return;
  activeType = button.dataset.filter;
  activeTag = "全部";
  currentPage = 1;
  document.querySelectorAll(".filter-pill").forEach(item => item.classList.toggle("active", item === button));
  renderTagFilters();
  render();
});
$("#searchInput").addEventListener("input", event => { query = event.target.value; currentPage = 1; render(); });
$("#sortButton").addEventListener("click", () => {
  sortNewest = !sortNewest;
  currentPage = 1;
  $("#sortButton").innerHTML = `${sortNewest ? "最新收录" : "最早收录"} <span>${sortNewest ? "↓" : "↑"}</span>`;
  render();
});
document.querySelectorAll(".previous-page").forEach(button => button.addEventListener("click", () => { if (currentPage > 1) { currentPage -= 1; render(); grid.scrollIntoView({ behavior: "smooth", block: "start" }); } }));
document.querySelectorAll(".next-page").forEach(button => button.addEventListener("click", () => { currentPage += 1; render(); grid.scrollIntoView({ behavior: "smooth", block: "start" }); }));
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    const columnCount = columnsPerPage();
    if (columnCount === lastColumnCount) return;
    lastColumnCount = columnCount;
    currentPage = 1;
    render();
  }, 120);
});
$("#editFromDetail").addEventListener("click", () => { dialog.close(); });
$("#detailDownload").addEventListener("click", () => downloadAsset(assets.find(asset => asset.id === selectedId)));
document.querySelectorAll("[data-close-dialog]").forEach(button => button.addEventListener("click", () => dialog.close()));
dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });
dialog.addEventListener("close", () => { detailSequencePreview = null; syncSequenceAnimations(); });
$("#themeToggle").addEventListener("click", () => document.body.classList.toggle("dark"));
document.addEventListener("keydown", event => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); $("#searchInput").focus(); }
});
function refreshAssetsFromStorage(force=false) {
  const assetSnapshot=localStorage.getItem(STORAGE_KEY)||"";
  const deletedSnapshot=localStorage.getItem(DELETED_ASSETS_KEY)||"";
  if(!force&&assetSnapshot===lastAssetStorageSnapshot&&deletedSnapshot===lastDeletedStorageSnapshot)return;
  lastAssetStorageSnapshot=assetSnapshot;
  lastDeletedStorageSnapshot=deletedSnapshot;
  assets=loadAssets();
  if(activeTag!=="全部"&&!availableTags().some(([tag])=>tag===activeTag))activeTag="全部";
  renderTagFilters();
  render();
}
const contentSyncBridge=$("#contentSyncBridge");
function requestBridgeContent(){contentSyncBridge?.contentWindow?.postMessage({type:"mewfx-content-request"},"*")}
contentSyncBridge?.addEventListener("load",requestBridgeContent);
window.addEventListener("load",requestBridgeContent,{once:true});
window.addEventListener("message",event=>{
  if(event.source!==contentSyncBridge?.contentWindow||event.data?.type!=="mewfx-content-snapshot")return;
  const values=event.data.values||{};
  let changed=false;
  [STORAGE_KEY,DELETED_ASSETS_KEY,DELETED_RECORDS_KEY].forEach(key=>{
    const value=values[key];
    if(typeof value!=="string"||!value||localStorage.getItem(key)===value)return;
    localStorage.setItem(key,value);
    changed=true;
  });
  if(changed)refreshAssetsFromStorage(true);
});
window.addEventListener("storage", event => {
  if(event.key!==STORAGE_KEY&&event.key!==DELETED_ASSETS_KEY)return;
  refreshAssetsFromStorage(true);
});
contentSyncChannel?.addEventListener("message",event=>{
  if(event.data?.key===STORAGE_KEY||event.data?.key===DELETED_ASSETS_KEY)refreshAssetsFromStorage(true);
});
window.addEventListener("focus",()=>refreshAssetsFromStorage());
document.addEventListener("visibilitychange",()=>{if(!document.hidden)refreshAssetsFromStorage()});
setInterval(()=>{if(!document.hidden)refreshAssetsFromStorage()},1200);
initGeometry();
initCollectionPreviews();
setActiveNavigation(location.hash || "#gallery");
renderTagFilters();
render();
lastColumnCount = columnsPerPage();
detectMissingResolutions();
