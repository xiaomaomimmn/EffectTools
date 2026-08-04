(function () {
  const sourceUrl = "https://opengameart.org/content/lens-flares-and-particles";
  const licenseUrl = "https://creativecommons.org/publicdomain/zero/1.0/";
  const root = "assets/library/light-effects/lens-flares-and-particles";
  const textures = [
    ["aura.png", "柔光光环", "光环", 256, 256],
    ["corona.png", "日冕放射光", "放射光", 128, 128],
    ["darkball.png", "暗色光球", "光点", 256, 256],
    ["divine.png", "神圣光晕", "光环", 256, 256],
    ["extend.png", "扩散柔光", "光点", 256, 256],
    ["extendring.png", "扩散光环", "光环", 256, 256],
    ["flaredouble.png", "双向镜头光斑", "光斑", 64, 128],
    ["flarefour.png", "四向镜头光斑", "光斑", 128, 128],
    ["hexagon.png", "六边形光格", "光格", 128, 128],
    ["hexangle.png", "六边形线框", "光格", 128, 128],
    ["i0.png", "纵向放射星芒", "星芒", 128, 128],
    ["iris.png", "虹膜镜头光斑", "光斑", 256, 256],
    ["nova.png", "新星星芒", "星芒", 128, 128],
    ["pearl.png", "珍珠柔光", "光点", 256, 256],
    ["pearlring.png", "珍珠光环", "光环", 256, 256],
    ["pollen.png", "花粉光点", "光点", 256, 256],
    ["quadangle.png", "方形线框", "光格", 128, 128],
    ["quadragon.png", "方形光格", "光格", 128, 128],
    ["ring.png", "基础光环", "光环", 256, 256],
    ["sparkle.png", "闪耀星芒", "星芒", 128, 128],
    ["star.png", "柔和星芒", "星芒", 256, 256],
    ["starring.png", "星芒光环", "光环", 256, 256],
    ["sun.png", "太阳放射光", "放射光", 256, 256],
    ["triangle.png", "三角形光格", "光格", 128, 128],
    ["trigon.png", "三角光纹", "光格", 128, 128],
    ["tunel.png", "隧道旋光", "漩涡", 256, 256],
    ["tunelring.png", "隧道光环", "光环", 256, 256],
    ["wave.png", "波纹光环", "光环", 256, 256],
    ["wavering.png", "波纹线框光环", "光环", 256, 256],
    ["x0.png", "四瓣星芒 01", "星芒", 128, 128],
    ["x1.png", "四瓣星芒 02", "星芒", 128, 128],
    ["x2.png", "四瓣星芒 03", "星芒", 128, 128],
    ["x3.png", "四瓣星芒 04", "星芒", 128, 128],
    ["x4.png", "四瓣星芒 05", "星芒", 128, 128],
    ["x5.png", "四瓣星芒 06", "星芒", 128, 128],
    ["x6.png", "四瓣星芒 07", "星芒", 128, 128]
  ];

  globalThis.LENS_FLARE_PARTICLE_ASSETS = textures.map(([file, name, primaryTag, width, height], index) => ({
    id: `lens-flare-particle-${file.replace(/\.png$/i, "").replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`,
    name,
    type: "光效",
    license: "CC0",
    licenseUrl,
    attributionRequired: false,
    optionalAttribution: "hackcraft.de",
    tags: [primaryTag, "灰度贴图", "加法混合", "黑色背景"],
    primaryTags: [primaryTag],
    secondaryTags: ["灰度贴图", "加法混合", "黑色背景", "hackcraft.de"],
    source: "Lens Flares and Particles by hackcraft.de",
    sourceUrl,
    resolution: `${width} × ${height}`,
    format: "PNG（灰度 / 加法混合）",
    description: `${name}来自 hackcraft.de 发布的 Lens Flares and Particles，适合以加法或滤色混合方式制作光效。素材随附 LICENSE 明确声明为 CC0，可自由用于个人及商业项目，无需署名。`,
    image: `${root}/${file}`,
    createdAt: "2012-03-25",
    collectedAt: `2026-08-04T12:${String(index).padStart(2, "0")}:00+08:00`
  }));
})();
