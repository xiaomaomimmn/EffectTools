(function () {
  const sourceUrl = "https://opengameart.org/content/hit-animation-frame-by-frame";
  const licenseUrl = "https://creativecommons.org/publicdomain/zero/1.0/";
  const root = "assets/library/sequences/hit-animation-frame-by-frame";
  const sequences = [
    ["yellow-hit-a", "金色命中冲击 01"],
    ["yellow-hit-b", "金色命中冲击 02"]
  ];

  globalThis.HIT_ANIMATION_ASSETS = sequences.map(([slug, name], index) => {
    const sequenceFrames = Array.from({ length: 16 }, (_, frameIndex) =>
      `${root}/${slug}/frames/frame-${String(frameIndex).padStart(3, "0")}.png`
    );
    return {
      id: `hit-animation-${slug}`,
      name,
      type: "序列",
      license: "CC0",
      licenseUrl,
      attributionRequired: false,
      downloadDisabled: false,
      tags: ["冲击", "金色", "16 帧", "透明背景", "逐帧动画"],
      primaryTags: ["冲击"],
      secondaryTags: ["金色", "16 帧", "透明背景", "逐帧动画"],
      source: "Hit Animation - Frame by Frame",
      sourceUrl,
      resolution: "512 × 512",
      format: "PNG 序列（由 1024 × 1024 缩小）",
      description: `${name}来自 OpenGameArt 的 Hit Animation - Frame by Frame。原始 4 × 4 图集按 1024 × 1024 切成 16 帧，再高质量缩小为 512 × 512；素材采用 CC0 许可，可自由用于个人及商业项目。`,
      image: sequenceFrames[index === 0 ? 1 : 2],
      animatedPreview: `${root}/${slug}/preview.webp?v=30fps`,
      sequenceFrames,
      frameRate: 30,
      frameCount: 16,
      downloadUrl: `${root}/downloads/${slug}-512px-frames.zip`,
      downloadFileName: `${slug}-512px-frames.zip`,
      createdAt: "2026-08-04",
      collectedAt: `2026-08-04T11:2${index}:00+08:00`
    };
  });
})();
