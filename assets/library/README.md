# 本地贴图库分类记录

当前共有 1458 张 CC0 PNG，其中 1451 张公开展示，7 张彩色图集位于 `hidden` 并暂列为未分类。另有 2 个外部专题合集，不计入普通贴图库，也不托管对应素材文件。

## 网站目录同步

后台对分类、名称和授权等信息的修改会先保存在当前浏览器。修改完成后，在后台点击“导出目录 JSON”，用下载的文件替换 `assets/library/catalog.json` 并提交 Git。首页会优先读取这个文件，因此部署后其他浏览器和设备会看到同一份目录。

后台的“导入并覆盖”只接受 `version: 1`、包含 `assets` 和 `deletedAssetIds` 的目录文件，覆盖前会显示数量并要求再次确认。

## 目录命名规范

所有目录只使用小写英文与短横线，统一结构为：`英文大类/英文出处名/图片文件`。

| 后台大类 | 文件夹名称 |
| --- | --- |
| 光效 | `light-effects` |
| 序列 | `sequences` |
| 元素 | `elements` |
| 循环 | `loops` |
| 物体 | `objects` |
| 不展示 | `hidden` |

出处文件夹使用来源名称的英文 slug，例如 `kenney-particle-pack`、`fx-pixel-texture`。

## Kenney Particle Pack

本批共整理 80 张 PNG，来源及授权信息已确认。

- 存放结构：`英文大类/kenney-particle-pack/图片文件`

- 素材名称：Kenney Particle Pack
- 素材作者：Kenney
- 来源地址：https://kenney.nl/assets/particle-pack
- 版权许可：CC0 1.0
- 图片分辨率：512 × 512
- 使用要求：可自由用于个人及商业项目，无需署名

| 分类 | 数量 | 内容 |
| --- | ---: | --- |
| 光效 | 30 | flare、light、magic、muzzle、star、trace |
| 序列 | 0 | 暂未发现明确的逐帧动画序列 |
| 元素 | 36 | dirt、fire、flame、scorch、scratch、slash、smoke、spark |
| 循环 | 8 | circle、twirl |
| 物体 | 6 | symbol、window |

## 来源状态

- 当前状态：来源和 CC0 授权已确认
- 本目录下 80 张 PNG 均继承上述来源及授权信息
- 已接入网站首页，并保留来源名称和来源地址以便追溯

## Kenney Pattern Pack

本批共整理 84 张 256 × 256 PNG，全部为可平铺的黑白无缝图案。

- 存放结构：`loops/kenney-pattern-pack/图片文件`
- 素材名称：Kenney Pattern Pack
- 素材作者：Kenney
- 来源地址：https://kenney.nl/assets/pattern-pack
- 版权许可：CC0 1.0
- 后台大类：循环
- 主要细分类：条纹、几何线条、方格、砖墙、波纹、圆点、菱格、蜂窝、几何块面等
- 二级细分：无缝图案、黑白
- 使用要求：可自由用于个人及商业项目，无需署名

### 来源状态

- 当前状态：来源和 CC0 授权已确认
- 84 张 PNG 已接入网站首页，并保留来源名称和来源地址以便追溯

## Kenney Splat Pack

本批共整理 36 张 512 × 512 透明背景 PNG，全部归入“元素”大类。

- 存放结构：`elements/kenney-splat-pack/图片文件`
- 素材名称：Kenney Splat Pack
- 素材作者：Kenney
- 来源地址：https://kenney.nl/assets/splat-pack
- 版权许可：CC0 1.0
- 主要细分类：溅射
- 二级细分：圆润墨渍、放射飞溅、透明背景
- 使用要求：可自由用于个人及商业项目，无需署名

### 来源状态

- 当前状态：来源和 CC0 授权已确认
- 36 张 PNG 已接入网站首页，并保留来源名称和来源地址以便追溯

## Kenney Light Masks

本批共整理 152 张 512 × 512 透明背景 PNG，全部归入“光效”大类。

- 存放结构：`light-effects/kenney-light-masks/图片文件`
- 素材名称：Kenney Light Masks
- 素材作者：Kenney
- 来源地址：https://kenney.nl/assets/light-masks
- 版权许可：CC0 1.0
- 主要细分类：圆形光照、同心光环、光束、扇形光影、植被光影、光环、柔光、星芒、水波焦散、窗格光影
- 二级细分：基础、噪点、柔化、渐变、放射纹、透明背景
- 使用要求：可自由用于个人及商业项目，无需署名

### 来源状态

- 当前状态：来源和 CC0 授权已确认
- 152 张 PNG 已接入网站首页，并保留来源名称和来源地址以便追溯

## 750 Effect and FX Pixel All

本站仅保留该素材包的外部来源链接，不托管 PNG、GIF 或其他预览文件。

- 素材作者：bdragon1727
- 来源地址：https://bdragon1727.itch.io/750-effect-and-fx-pixel-all
- 版权许可：免费版限非商业游戏使用；商业游戏需要向作者付费或赞助任意金额
- 禁止事项：禁止转售或重新分发素材文件，即使修改后也不允许
- 后台大类：序列
- 主要细分类：像素序列
- 二级细分：外部资源、禁止再分发

### 来源状态

- 首页“专题合集”展示完整介绍、版权限制和作者链接
- 专题不进入普通贴图库，不提供本站下载，只能跳转作者页面

## 32x32 Simple SFX

本站仅保留该素材包的外部来源链接，不托管 PNG、GIF 或其他预览文件。

- 素材作者：Steel Soldier
- 来源地址：https://steelsoldier.itch.io/32x32-simple-sfx
- 版权许可：可用于个人、非商业和商业项目，也可以修改
- 署名要求：非必须，但作者希望尽量附上链接或署名
- 授权边界：未明确允许重新分发素材文件，因此不标为 CC0
- 首页展示：“专题合集”展示介绍、授权说明和作者链接
- 发布限制：不进入普通贴图库，不提供本站下载，只能跳转作者页面

## VFX Free Pack

CodeManu 制作的 2D 特效序列包，按 CC BY 4.0 收录并在首页以 30 FPS 播放。

- 素材作者：CodeManu
- 来源地址：https://codemanu.itch.io/vfx-free-pack
- 版权许可：Creative Commons Attribution 4.0 International
- 许可证：https://creativecommons.org/licenses/by/4.0/
- 署名要求：使用、修改或再分发时必须署名 CodeManu，并保留来源及许可证链接
- 本地内容：仅 `30fps/Frames`，共 22 组、680 张 PNG
- 未导入内容：60 FPS、GIF、Spritesheets、SMP 工程文件
- 下载形式：每组独立 Frames ZIP，ZIP 内附 `ATTRIBUTION.md`
- 首页展示：每组作为一张“序列”卡片，以 30 FPS 循环预览
- 网页预览：128 × 128、30 FPS 透明动画 WebP；不影响原始 Frames 下载

## Free VFX Image Sequences & Flipbooks

Unity 发布的 4 组飘缕烟雾图像序列，首页以 30 FPS 播放。

- 素材作者：Unity
- 来源地址：https://unity.com/blog/engine-platform/free-vfx-image-sequences-flipbooks
- 版权许可：CC0 1.0 Universal
- 许可证：https://creativecommons.org/publicdomain/zero/1.0/
- 署名要求：无需署名
- 本地内容：4 组、每组 240 帧，共 960 张 400 × 400 PNG
- 原始格式：RGBA TGA；网页版本无损转换为 RGBA PNG
- 主要细分类：烟雾
- 首页展示：每组作为一张“序列”卡片，以 30 FPS 循环预览
- 下载形式：每组提供独立 PNG Frames ZIP，并附来源与 CC0 说明

## Godot particle and VFX textures

RPicster 分享的 12 张透明背景粒子与 VFX 光效贴图。

- 素材作者：RPicster
- 来源地址：https://github.com/RPicster/Godot-particle-and-vfx-textures
- 版权许可：CC0 1.0 Universal
- 许可证：https://creativecommons.org/publicdomain/zero/1.0/
- 署名要求：无需署名
- 可选署名：`Raffaele Picca - raffaelepicca.com`
- 本地内容：12 张 256 × 256 RGBA PNG
- 图片类型：放射光束 3 张、旋涡光效 1 张、光斑 4 张、星芒 4 张
- 主要细分类：星芒、光迹、光斑（均复用现有分类）
- 下载形式：可直接下载透明背景 PNG 原图

## Gothicvania Magic Pack 9

ansimuz 发布的 4 组横向像素特效序列图集，已逐帧切分并保持透明背景。

- 素材作者：ansimuz
- 来源地址：https://opengameart.org/content/gothicvania-magic-pack-9
- 版权许可：CC0 1.0 Universal
- 许可证：https://creativecommons.org/publicdomain/zero/1.0/
- 署名要求：无需署名；可选署名 ansimuz
- 本地内容：暗影雷击 11 帧、火焰炸弹 14 帧、连锁闪电 10 帧、魔法火花 7 帧
- 正方形处理：以透明画布居中补齐，不拉伸、不裁掉特效内容
- 主要细分类：能量、爆炸（复用现有序列分类）
- 网页预览：128 × 128、30 FPS 透明动画 WebP
- 下载形式：每组提供独立 Frames ZIP，包含原始图集、切分帧及来源说明

## Hit Animation - Frame by Frame

OpenGameArt 上的两组金色命中动画，原始文件均为 4096 × 4096 的 4 × 4 图集。

- 来源地址：https://opengameart.org/content/hit-animation-frame-by-frame
- 版权许可：CC0 1.0 Universal
- 许可证：https://creativecommons.org/publicdomain/zero/1.0/
- 署名要求：无需署名
- 本地内容：2 组、每组 16 帧，共 32 帧
- 原始单帧：1024 × 1024 RGBA PNG
- 网页与下载帧：高质量缩小为 512 × 512 RGBA PNG，不裁切画面
- 主要细分类：冲击（复用现有序列分类）
- 网页预览：128 × 128、30 FPS 透明动画 WebP
- 下载形式：每组提供独立 Frames ZIP，包含原始图集、512 × 512 切分帧及 CC0 来源说明

## Fire & Smoke Animations

OpenGameArt 上的 11 组像素火焰与烟雾横向图集，已按图集高度逐帧切分。

- 来源地址：https://opengameart.org/content/fire-smoke-animations
- 版权许可：CC0 1.0 Universal
- 许可证：https://creativecommons.org/publicdomain/zero/1.0/
- 署名要求：无需署名
- 本地内容：11 组、共 135 帧
- 切片规则：以图集高度作为单帧宽高，从左至右切分
- 2 次幂处理：8→8、12/16→16、19/20/22→32、44→64
- 像素处理：仅透明居中补边，不缩放、不裁切原始像素
- 主要细分类：爆炸、像素火焰、烟雾序列（均复用现有分类）
- 网页预览：128 × 128、30 FPS、最近邻像素放大
- 下载形式：每组提供独立 Frames ZIP，包含原始图集、2 次幂切分帧及 CC0 来源说明

## Lens Flares and Particles

hackcraft.de 发布的 36 张镜头光斑、光环、星芒和粒子灰度贴图。

- 来源地址：https://opengameart.org/content/lens-flares-and-particles
- 随附授权文件：`LICENSE`，原文为 `CC0 - Public Domain Donation by hackcraft.de`
- 版权许可：CC0 1.0 Universal
- 署名要求：无需署名；可选署名 hackcraft.de
- 本地内容：36 张 PNG，尺寸为 64 × 128、128 × 128 或 256 × 256
- 贴图特性：保留原始黑色背景与灰度通道，适合加法或滤色混合
- 主要细分类：光环、星芒、光点、放射光、光斑、光格、漩涡（全部复用现有分类）
- 下载形式：可直接下载 PNG 原图

## FX Charge

OpenGameArt 上的白色充能命中序列。

- 来源地址：https://opengameart.org/content/fx-charge
- 版权许可：CC0 1.0 Universal
- 许可证：https://creativecommons.org/publicdomain/zero/1.0/
- 署名要求：无需署名
- 本地内容：1 组、8 张 256 × 256 RGBA PNG
- 切片顺序：原始 256 × 2048 纵向图集，从上到下切分；保留透明收尾帧
- 主要细分类：冲击（复用现有分类）
- 网页预览：128 × 128、30 FPS 透明动画 WebP
- 下载形式：Frames ZIP，包含原始图集、8 张切分帧及 CC0 来源说明

## Particle Pack by Kronbits

Kronbits 发布的透明粒子与特效贴图；原包 1002 张，清理无用贴图后站内保留 936 张。

- 官方来源：https://kronbits.itch.io/particle-pack
- 授权协议：CC0 1.0 Universal
- 授权地址：https://creativecommons.org/publicdomain/zero/1.0/
- 授权依据：作者页面的 `Asset license` 明确标注 `Creative Commons Zero v1.0 Universal`
- 发布时间：2019-01-16；更新日期：2023-06-07
- 图片规格：全部为 512 × 512 透明 PNG
- 内容结构：Basic、Color、Complex
- 当前数量：光效 338、元素 178、物体 420，共 936 张
- 主要细分类：优先复用光环、星芒、光斑、光线、光格、漩涡、魔法、枪口、爆炸、冲击、血液、火元素、几何、符号；静态烟雾使用“烟雾”
- 使用要求：可自由用于个人和商业项目，无需署名；站内提供原始 PNG 下载

## Pixel Fire Asset Pack v1.2

DevKidd 发布的像素火焰动画包，作为外链专题展示。

- 官方来源：https://devkidd.itch.io/pixel-fire-asset-pack
- 官方预览：https://img.itch.zone/aW1nLzIyMTgyNDI5LmdpZg==/original/rXdi%2Bu.gif
- 授权状态：作者自定义免费许可，不是 CC0
- 允许范围：可用于个人和商业项目，可修改，署名非必须
- 明确限制：禁止将素材原样出售，修改后也不能作为素材出售
- 包内内容：2250 张 PNG、248 个 GIF、15 个 Aseprite 文件
- 规格说明：16 × 32、32 × 32 和 32 × 48 像素，包含多色火焰、落地火焰和烟雾变化
- 本站处理：仅引用官方 GIF 作专题预览，不托管、不重新分发，也不提供素材文件下载

## Free 2D Cartoon Smoke Effects Pack

CraftPix 发布的 6 组卡通烟雾动画，作为外链专题展示。

- 官方来源：https://craftpix.net/freebies/free-cartoon-smoke-effects-asset-pack/
- 官方预览：https://img.craftpix.net/2026/05/Free-Cartoon-Smoke-Effects-Asset-Pack.gif
- 包内许可文件：仅指向 https://craftpix.net/file-licenses/
- 授权状态：不是 CC0；使用前以 CraftPix 原页和随包条款为准
- 内容说明：6 组、共 68 张 PNG 源帧
- 本站处理：从普通素材库移除，仅引用官方 GIF 作专题预览
- 分发限制：不托管、不重新分发，也不提供素材文件下载

## FX Pixel Texture

本批共整理 132 张独立 PNG，另有 7 张彩色图集作为未分类素材展示。

- 存放结构：`英文大类/fx-pixel-texture/图片文件`

- 素材名称：FX Pixel Texture
- 素材作者：bdragon1727
- 来源地址：https://bdragon1727.itch.io/fx-pixel-texture
- 版权许可：CC0
- 图片分辨率：16 × 16 至 64 × 64
- 使用要求：可自由用于个人及商业项目，无需署名

| 分类 | 数量 | 主要细分类 |
| --- | ---: | --- |
| 光效 | 57 | 魔法、星芒、能量、能量环 |
| 序列 | 0 | 本批没有逐帧动画序列 |
| 元素 | 51 | 基础特效、弹道、扩散、冲击、爆发 |
| 循环 | 24 | 光环 |
| 物体 | 0 | 本批没有独立物体贴图 |
| 不展示 | 7 | 尚未设置主要细分类的彩色图集 |

### 来源状态

- 当前状态：由用户确认为 CC0
- 132 张独立贴图已接入首页，并保留永久来源页
- 7 张 640 × 480 彩色图集保存在 `hidden/fx-pixel-texture/atlases`，已接入“未分类”标签，方便后续批量整理

以后可以继续把新图片放入项目根目录的 `incoming` 文件夹。
