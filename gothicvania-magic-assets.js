(function () {
  const sourceUrl = "https://opengameart.org/content/gothicvania-magic-pack-9";
  const licenseUrl = "https://creativecommons.org/publicdomain/zero/1.0/";
  const root = "assets/library/sequences/gothicvania-magic-pack-9";
  const sequences = [
    ["dark-bolt", "暗影雷击", "能量", 11, 128],
    ["fire-bomb", "火焰炸弹", "爆炸", 14, 64],
    ["lightning", "连锁闪电", "能量", 10, 128],
    ["spark", "魔法火花", "能量", 7, 32]
  ];

  globalThis.GOTHICVANIA_MAGIC_ASSETS = sequences.map(([slug, name, primaryTag, frameCount, frameSide], index) => {
    const sequenceFrames = Array.from({ length: frameCount }, (_, frameIndex) =>
      `${root}/${slug}/frames/frame-${String(frameIndex).padStart(3, "0")}.png`
    );
    return {
      id: `gothicvania-magic-${slug}`,
      name,
      type: "序列",
      license: "CC0",
      licenseUrl,
      attributionRequired: false,
      optionalAttribution: "ansimuz",
      tags: [primaryTag, "像素特效", `${frameCount} 帧`, "透明背景", "Gothicvania"],
      primaryTags: [primaryTag],
      secondaryTags: ["像素特效", `${frameCount} 帧`, "透明背景", "Gothicvania"],
      source: "Gothicvania Magic Pack 9 by ansimuz",
      sourceUrl,
      resolution: `${frameSide} × ${frameSide}`,
      format: "PNG 序列（ZIP）",
      description: `${name}来自 ansimuz 的 Gothicvania Magic Pack 9。原始横向图集已逐帧切分，并在透明画布中保留为正方形；素材采用 CC0 许可。`,
      image: sequenceFrames[0],
      animatedPreview: `${root}/${slug}/preview.webp?v=30fps`,
      sequenceFrames,
      frameRate: 30,
      frameCount,
      downloadUrl: `${root}/downloads/${slug}-frames.zip`,
      downloadFileName: `${slug}-frames.zip`,
      createdAt: "2022-03-11",
      collectedAt: `2026-08-04T11:0${index}:00+08:00`
    };
  });
})();
