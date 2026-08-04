# MewFX 特效贴图素材库

一个无依赖的纯前端特效贴图素材库，用于浏览、筛选、预览和下载特效资源。

## 使用

直接用浏览器打开 `index.html`。

## 已实现

- 特效贴图展示、版权分级、类型筛选、搜索和排序
- 首页按光效、元素、循环、序列、物体等大类浏览素材
- 大类下只展示主要细分标签；次要描述归入详情页二级细分
- 详情页支持将原图直接下载到本地，并记录图片实际分辨率
- 大图在卡片中完整居中；实际尺寸不超过 128px 的像素图以四分之一面积锐化预览
- 贴图详情、标签、格式、分辨率、版权和来源信息
- 序列帧素材以 30 FPS 动画预览，并保留原始资源下载
- 每次刷新随机选择一种几何形状，带缓慢漂浮和滚动视差
- 默认深色主题，可切换浅色主题
- 明暗主题和移动端响应式布局

示例贴图由站内程序化 SVG 生成，仅作为界面演示素材，统一标注为 `MewFX Original / CC0`。

本地待整理素材放入 `incoming`。`assets/library` 当前有 2138 张 PNG：其中 1458 张为 CC0（1451 张公开展示、7 张归入 `hidden`），[CodeManu VFX Free Pack](https://codemanu.itch.io/vfx-free-pack) 有 680 张 CC BY 4.0 Frames，[Unity Free VFX Image Sequences & Flipbooks](https://unity.com/blog/engine-platform/free-vfx-image-sequences-flipbooks) 有 960 张 CC0 烟雾 Frames，另收录 12 张来自 [RPicster/Godot-particle-and-vfx-textures](https://github.com/RPicster/Godot-particle-and-vfx-textures) 的 CC0 光效贴图。两批序列共整理为 26 组 30 FPS 序列，首页共展示 517 个素材条目。“专题合集”另收录 [750 Effect and FX Pixel All](https://bdragon1727.itch.io/750-effect-and-fx-pixel-all) 和 [32x32 Simple SFX](https://steelsoldier.itch.io/32x32-simple-sfx) 等外部资源。

VFX Free Pack 仅导入 `30fps/Frames`，不包含 60 FPS、GIF、Spritesheets 或工程文件。每组序列提供包含署名说明的 Frames ZIP；使用与再分发时必须署名 CodeManu，并保留来源及 [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) 许可证链接。

网页中的序列缩略预览统一使用 128 × 128、30 FPS 的透明动画 WebP；原始下载保留完整分辨率与帧序列。

`32x32 Simple SFX` 允许用于个人、非商业和商业项目，署名非必须但作者希望尽量署名或附上链接。由于授权页没有明确说明可重新分发素材文件，本站仅展示介绍和作者原页入口。`Free Cartoon Smoke Effects Asset Pack` 未明确标注为 CC0，因此同样只作为外链专题展示，预览使用 CraftPix 官方 GIF。`Pixel Fire Asset Pack v1.2` 采用作者自定义免费许可，可用于个人和商业项目但禁止将素材原样出售，因此也仅作外链专题展示。

素材目录统一使用英文路径：`assets/library/<英文大类>/<英文出处名>/`。大类使用 `light-effects`、`sequences`、`elements`、`loops`、`objects`、`hidden`；出处名称使用小写英文短横线格式。
