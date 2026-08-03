(function () {
  const sourceUrl = "https://codemanu.itch.io/vfx-free-pack";
  const licenseUrl = "https://creativecommons.org/licenses/by/4.0/";
  const root = "assets/library/sequences/codemanu-vfx-free-pack";
  const sequences = [
    ["effect-anima", "灵体能量", "能量", 30, 437, 437],
    ["effect-bighit", "大型冲击", "冲击", 30, 557, 553],
    ["effect-bloodimpact", "血液冲击", "血液", 30, 69, 60],
    ["effect-charged", "能量充能", "充能", 40, 321, 371],
    ["effect-constellation", "星座连线", "星座", 30, 299, 313],
    ["effect-ditheredfire", "抖动火焰", "火焰", 30, 517, 246],
    ["effect-eldenring", "黄金法环", "法环", 30, 421, 425],
    ["effect-electricshield", "电能护盾", "护盾", 30, 265, 265],
    ["effect-explosion", "大型爆炸", "爆炸", 30, 517, 517],
    ["effect-explosion2", "扩散爆炸", "爆炸", 30, 355, 355],
    ["effect-fastpixelfire", "快速像素火焰", "像素火焰", 30, 173, 193],
    ["effect-hyperspeed", "超高速光流", "高速移动", 30, 517, 515],
    ["effect-impact", "能量冲击", "冲击", 30, 291, 301],
    ["effect-kabooms", "卡通爆破", "爆炸", 30, 401, 325],
    ["effect-magma", "熔岩喷发", "熔岩", 30, 381, 186],
    ["effect-powerchords", "能量和弦", "音波", 30, 517, 353],
    ["effect-puffandstars", "烟团与星星", "星尘", 40, 120, 109],
    ["effect-smallhit", "小型冲击", "冲击", 30, 532, 528],
    ["effect-tentacles", "能量触手", "触手", 30, 453, 337],
    ["effect-thevortex", "能量旋涡", "旋涡", 30, 427, 431],
    ["effect-wheel", "旋转能量轮", "转轮", 30, 273, 273],
    ["effect-worm", "蠕动能量", "蠕动", 30, 413, 369]
  ];

  globalThis.CODEMANU_VFX_ASSETS = sequences.map(([slug, name, primaryTag, frameCount, width, height], index) => {
    const sequenceFrames = Array.from({ length: frameCount }, (_, frameIndex) =>
      `${root}/${slug}/frame-${String(frameIndex).padStart(3, "0")}.png`
    );
    return {
      id: `codemanu-vfx-${slug}`,
      name,
      type: "序列",
      license: "CC BY 4.0",
      licenseUrl,
      attributionRequired: true,
      tags: [primaryTag, "30 FPS", `${frameCount} 帧`, "透明背景"],
      primaryTags: [primaryTag],
      secondaryTags: ["30 FPS", `${frameCount} 帧`, "透明背景", "CodeManu"],
      source: "VFX Free Pack by CodeManu",
      sourceUrl,
      resolution: `${width} × ${height}`,
      format: "PNG 序列（ZIP）",
      description: `${name}出自 CodeManu 的 VFX Free Pack，以 30 FPS 播放。素材采用 CC BY 4.0，使用和再分发时必须署名 CodeManu。`,
      image: sequenceFrames[0],
      animatedPreview: `${root}/${slug}/preview.webp`,
      sequenceFrames,
      frameRate: 30,
      frameCount,
      downloadUrl: `${root}/downloads/${slug}-30fps-frames.zip`,
      downloadFileName: `${slug}-30fps-frames.zip`,
      createdAt: "2026-08-03",
      collectedAt: `2026-08-03T18:${String(index).padStart(2, "0")}:00+08:00`
    };
  });
})();
