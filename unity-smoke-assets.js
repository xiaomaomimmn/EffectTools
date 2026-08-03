(function () {
  const sourceUrl = "https://unity.com/blog/engine-platform/free-vfx-image-sequences-flipbooks";
  const licenseUrl = "https://creativecommons.org/publicdomain/zero/1.0/";
  const root = "assets/library/sequences/unity-wispy-smoke";
  const sequences = [
    ["wispy-smoke-01", "飘缕烟雾 01", "轻盈上升"],
    ["wispy-smoke-02", "飘缕烟雾 02", "横向翻涌"],
    ["wispy-smoke-03", "飘缕烟雾 03", "团状扩散"],
    ["wispy-smoke-03b", "飘缕烟雾 03B", "柔化变体"]
  ];

  globalThis.UNITY_WISPY_SMOKE_ASSETS = sequences.map(([slug, name, variant], index) => {
    const sequenceFrames = Array.from({ length: 240 }, (_, frameIndex) =>
      `${root}/${slug}/frame-${String(frameIndex + 1).padStart(3, "0")}.png`
    );
    return {
      id: `unity-${slug}`,
      name,
      type: "序列",
      license: "CC0",
      licenseUrl,
      attributionRequired: false,
      tags: ["烟雾", variant, "240 帧", "透明背景", "Unity"],
      primaryTags: ["烟雾"],
      secondaryTags: [variant, "240 帧", "透明背景", "Unity"],
      source: "Free VFX Image Sequences & Flipbooks by Unity",
      sourceUrl,
      resolution: "400 × 400",
      format: "PNG 序列（由 TGA 转换）",
      description: `${name}来自 Unity Labs Paris 发布的免费 VFX 图像序列，共 240 帧，采用 CC0 许可，可自由用于个人及商业项目。`,
      image: sequenceFrames[0],
      sequenceFrames,
      frameRate: 30,
      frameCount: 240,
      downloadUrl: `${root}/downloads/${slug}-png-frames.zip`,
      downloadFileName: `${slug}-png-frames.zip`,
      smoothPreview: true,
      createdAt: "2016-11-28",
      collectedAt: `2026-08-03T19:0${index}:00+08:00`
    };
  });
})();
