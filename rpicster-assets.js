(function () {
  const sourceUrl = "https://github.com/RPicster/Godot-particle-and-vfx-textures";
  const licenseUrl = "https://creativecommons.org/publicdomain/zero/1.0/";
  const root = "assets/library/light-effects/godot-particle-vfx-textures";
  const textures = [
    ["effect-01", "放射光束 01", "effect_1.png", "星芒", ["柔和光束", "透明背景"]],
    ["effect-02", "放射光束 02", "effect_2.png", "星芒", ["密集光束", "透明背景"]],
    ["effect-03", "放射光束 03", "effect_3.png", "星芒", ["锐利光束", "透明背景"]],
    ["effect-04", "旋涡光效 01", "effect_4.png", "光迹", ["旋涡", "旋转", "透明背景"]],
    ["spotlight-01", "柔光光斑 01", "spotlight_1.png", "光斑", ["圆形柔光", "透明背景"]],
    ["spotlight-02", "横向光斑 01", "spotlight_2.png", "光斑", ["横向拉伸", "透明背景"]],
    ["spotlight-03", "十字光斑 01", "spotlight_3.png", "光斑", ["十字柔光", "透明背景"]],
    ["spotlight-04", "四角星芒 01", "spotlight_4.png", "星芒", ["四角", "透明背景"]],
    ["spotlight-05", "多角星芒 01", "spotlight_5.png", "星芒", ["多角", "透明背景"]],
    ["spotlight-06", "柔光星芒 01", "spotlight_6.png", "星芒", ["柔化", "透明背景"]],
    ["spotlight-07", "菱形光斑 01", "spotlight_7.png", "光斑", ["菱形柔光", "透明背景"]],
    ["spotlight-08", "细长星芒 01", "spotlight_8.png", "星芒", ["细长十字", "透明背景"]]
  ];

  globalThis.RPICSTER_VFX_ASSETS = textures.map(([slug, name, fileName, primaryTag, secondaryTags], index) => ({
    id: `rpicster-${slug}`,
    name,
    type: "光效",
    license: "CC0",
    licenseUrl,
    attributionRequired: false,
    optionalAttribution: "Raffaele Picca - raffaelepicca.com",
    tags: [primaryTag, ...secondaryTags],
    primaryTags: [primaryTag],
    secondaryTags,
    source: "Godot particle and VFX textures by RPicster",
    sourceUrl,
    resolution: "256 × 256",
    format: "PNG",
    description: `${name}来自 Raffaele Picca（RPicster）的 Godot particle and VFX textures 仓库，采用 CC0 许可并保留完整透明通道，适用于粒子、光斑和实时视觉特效。`,
    image: `${root}/${fileName}`,
    darkPreview: true,
    createdAt: "2020-12-03",
    collectedAt: `2026-08-03T20:${String(index).padStart(2, "0")}:00+08:00`
  }));
})();
