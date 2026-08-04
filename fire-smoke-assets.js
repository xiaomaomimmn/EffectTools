(function () {
  const sourceUrl = "https://opengameart.org/content/fire-smoke-animations";
  const licenseUrl = "https://creativecommons.org/publicdomain/zero/1.0/";
  const root = "assets/library/sequences/fire-smoke-animations";
  const sequences = [
    ["fire-blast", "像素火焰爆破", "爆炸", 18, 22, 32],
    ["fire-burst", "像素火焰迸发", "爆炸", 11, 19, 32],
    ["fire-plume", "像素火焰喷涌", "像素火焰", 17, 20, 32],
    ["oily-fireball", "油焰火球", "像素火焰", 15, 16, 16],
    ["smoke-gas", "像素气态烟雾", "烟雾序列", 13, 22, 32],
    ["smoke-large", "大型像素烟雾", "烟雾序列", 13, 44, 64],
    ["smoke-poff", "像素烟团", "烟雾序列", 9, 20, 32],
    ["smoke-small", "小型像素烟雾", "烟雾序列", 8, 12, 16],
    ["smoke-thick-puff", "厚重像素烟团", "烟雾序列", 9, 8, 8],
    ["smoke-thick", "厚重像素烟雾", "烟雾序列", 13, 22, 32],
    ["smoke", "像素烟雾", "烟雾序列", 9, 20, 32]
  ];

  globalThis.FIRE_SMOKE_ANIMATION_ASSETS = sequences.map(([slug, name, primaryTag, frameCount, sourceSide, outputSide], index) => {
    const sequenceFrames = Array.from({ length: frameCount }, (_, frameIndex) =>
      `${root}/${slug}/frames/frame-${String(frameIndex).padStart(3, "0")}.png`
    );
    return {
      id: `fire-smoke-animation-${slug}`,
      name,
      type: "序列",
      license: "CC0",
      licenseUrl,
      attributionRequired: false,
      downloadDisabled: false,
      tags: [primaryTag, "像素特效", `${frameCount} 帧`, "透明背景", "2 次幂尺寸"],
      primaryTags: [primaryTag],
      secondaryTags: ["像素特效", `${frameCount} 帧`, "透明背景", "2 次幂尺寸"],
      source: "Fire & Smoke Animations",
      sourceUrl,
      resolution: `${outputSide} × ${outputSide}`,
      format: "PNG 序列（2 次幂透明补边）",
      description: `${name}来自 OpenGameArt 的 Fire & Smoke Animations。原图按高度 ${sourceSide} 像素切成方形帧，再以透明画布补到 ${outputSide} × ${outputSide}；原始像素未缩放或裁切。素材采用 CC0 许可，可自由用于个人及商业项目。`,
      image: sequenceFrames[0],
      animatedPreview: `${root}/${slug}/preview.webp?v=30fps`,
      sequenceFrames,
      frameRate: 30,
      frameCount,
      downloadUrl: `${root}/downloads/${slug}-power-of-two-frames.zip`,
      downloadFileName: `${slug}-power-of-two-frames.zip`,
      createdAt: "2023-03-14",
      collectedAt: `2026-08-04T11:${String(30 + index).padStart(2, "0")}:00+08:00`
    };
  });
})();
