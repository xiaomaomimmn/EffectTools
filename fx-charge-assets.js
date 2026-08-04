(function () {
  const sourceUrl = "https://opengameart.org/content/fx-charge";
  const licenseUrl = "https://creativecommons.org/publicdomain/zero/1.0/";
  const root = "assets/library/sequences/fx-charge";
  const sequenceFrames = Array.from({ length: 8 }, (_, index) =>
    `${root}/frames/frame-${String(index).padStart(3, "0")}.png`
  );

  globalThis.FX_CHARGE_ASSETS = [{
    id: "fx-charge-white-impact",
    name: "白色充能冲击",
    type: "序列",
    license: "CC0",
    licenseUrl,
    attributionRequired: false,
    tags: ["冲击", "白色", "8 帧", "透明背景", "充能"],
    primaryTags: ["冲击"],
    secondaryTags: ["白色", "8 帧", "透明背景", "充能"],
    source: "FX Charge",
    sourceUrl,
    resolution: "256 × 256",
    format: "PNG 序列（ZIP）",
    description: "来自 OpenGameArt 的 FX Charge 白色充能冲击序列。原始纵向图集按从上到下切成 8 张 256 × 256 RGBA 帧，以 30 FPS 播放；素材采用 CC0 许可，无需署名。",
    image: sequenceFrames[2],
    animatedPreview: `${root}/preview.webp?v=30fps`,
    sequenceFrames,
    frameRate: 30,
    frameCount: 8,
    downloadUrl: `${root}/downloads/fx-charge-frames.zip`,
    downloadFileName: "fx-charge-frames.zip",
    createdAt: "2026-08-04",
    collectedAt: "2026-08-04T12:16:00+08:00"
  }];
})();
