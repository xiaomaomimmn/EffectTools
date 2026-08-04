from __future__ import annotations

import json
import re
import shutil
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "incoming" / "Particles"
LIBRARY = ROOT / "assets" / "library"
CATALOG = LIBRARY / "catalog.json"
METADATA = LIBRARY / "metadata.json"
MANIFEST = ROOT / "kronbits-particle-assets.js"
SOURCE_URL = "https://kronbits.itch.io/particle-pack"
LICENSE_URL = "https://creativecommons.org/publicdomain/zero/1.0/"
IMPORT_BATCH_ID = "kronbits-particle-pack-20260804"
RETIRED_JS = ROOT / "retired-assets.js"


GROUPS = {
    ("Basic", "ding bang"): ("元素", "冲击", "基础贴图", "基础漫画冲击"),
    ("Basic", "ding blood"): ("元素", "血液", "基础贴图", "基础血液"),
    ("Basic", "ding circles"): ("光效", "光环", "基础贴图", "基础圆环"),
    ("Basic", "ding shapes"): ("物体", "几何", "基础贴图", "基础几何"),
    ("Basic", "social"): ("物体", "符号", "基础贴图", "社交符号"),
    ("Basic", "spiral"): ("光效", "漩涡", "基础贴图", "基础螺旋"),
    ("Basic", "star"): ("光效", "星芒", "基础贴图", "基础星形"),
    ("Basic", "targets"): ("物体", "符号", "基础贴图", "基础准星"),
    ("Color", "burst"): ("光效", "爆炸", "彩色贴图", "彩色爆发"),
    ("Color", "energyball"): ("光效", "魔法", "彩色贴图", "彩色能量球"),
    ("Color", "fire"): ("元素", "火元素", "彩色贴图", "彩色火焰"),
    ("Color", "magic particles"): ("光效", "魔法", "彩色贴图", "彩色魔法粒子"),
    ("Color", "spirowires"): ("光效", "漩涡", "彩色贴图", "彩色螺旋线"),
    ("Color", "star"): ("光效", "星芒", "彩色贴图", "彩色星形"),
    ("Complex", "circle"): ("光效", "光环", "复杂贴图", "复杂光环"),
    ("Complex", "flare"): ("光效", "光斑", "复杂贴图", "复杂光斑"),
    ("Complex", "impacts"): ("元素", "冲击", "复杂贴图", "复杂冲击"),
    ("Complex", "lines"): ("光效", "光线", "复杂贴图", "复杂光线"),
    ("Complex", "muzzle flash"): ("光效", "枪口", "复杂贴图", "枪口火光"),
    ("Complex", "smoke"): ("元素", "烟雾", "复杂贴图", "烟雾纹理"),
    ("Complex", "star"): ("光效", "星芒", "复杂贴图", "复杂星芒"),
}

COMPLEX_OTHERS = {
    "lightrays": ("光效", "光线", "复杂贴图", "放射光线"),
    "spirowires": ("光效", "漩涡", "复杂贴图", "复杂螺旋线"),
    "squared": ("光效", "光格", "复杂贴图", "方形光格"),
    "turbine": ("光效", "漩涡", "复杂贴图", "涡轮旋光"),
}

TYPE_DIRECTORIES = {"光效": "light-effects", "元素": "elements", "物体": "objects"}


def slug(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")


def natural_key(path: Path) -> list[object]:
    return [int(part) if part.isdigit() else part.lower() for part in re.split(r"(\d+)", path.name)]


def retired_ids() -> set[str]:
    text = RETIRED_JS.read_text(encoding="utf-8")
    match = re.search(r"=\s*(\[[\s\S]*\])\s*;\s*$", text)
    if not match:
        raise RuntimeError("Cannot parse retired-assets.js")
    return set(json.loads(match.group(1)))


def group_for(path: Path) -> tuple[str, str, str, str]:
    relative = path.relative_to(SOURCE)
    top, folder = relative.parts[:2]
    if (top, folder) == ("Complex", "others"):
        prefix = re.split(r"[_\-\s]+", path.stem.lower())[0]
        return COMPLEX_OTHERS[prefix]
    return GROUPS[(top, folder)]


def display_number(path: Path, fallback: int) -> str:
    matches = re.findall(r"\d+", path.stem)
    return f"{int(matches[-1]) if matches else fallback:03d}"


def build_assets() -> tuple[list[dict[str, object]], list[list[object]]]:
    assets: list[dict[str, object]] = []
    records: list[list[object]] = []
    files = sorted(SOURCE.rglob("*.png"), key=lambda path: [part.lower() for part in path.parts[:-1]] + natural_key(path))
    retired = retired_ids()
    if len(files) != 1002:
        raise RuntimeError(f"Expected 1002 PNG files, found {len(files)}")

    for source_path in files:
        with Image.open(source_path) as image:
            has_transparency = "A" in image.getbands() or "transparency" in image.info
            if image.size != (512, 512) or not has_transparency:
                raise RuntimeError(f"Expected 512x512 image with alpha: {source_path}")

        relative = source_path.relative_to(SOURCE)
        suffix = slug(str(relative.with_suffix("")))
        asset_id = f"kronbits-particle-{suffix}"
        if asset_id in retired:
            continue
        import_index = len(assets)
        type_name, primary_tag, series_tag, label = group_for(source_path)
        type_directory = TYPE_DIRECTORIES[type_name]
        group_slug = slug("-".join(relative.parts[:2]))
        file_name = f"{slug(source_path.stem)}.png"
        destination = LIBRARY / type_directory / "kronbits-particle-pack" / group_slug / file_name
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source_path, destination)

        name = f"{label} {display_number(source_path, import_index + 1)}"
        image_path = destination.relative_to(ROOT).as_posix()
        tags = [primary_tag, series_tag, "透明背景", "512 × 512", "粒子贴图"]
        asset = {
            "id": asset_id,
            "name": name,
            "type": type_name,
            "license": "CC0",
            "licenseUrl": LICENSE_URL,
            "attributionRequired": False,
            "tags": tags,
            "primaryTags": [primary_tag],
            "secondaryTags": tags[1:],
            "source": "Particle Pack by Kronbits",
            "sourceUrl": SOURCE_URL,
            "resolution": "512 × 512",
            "format": "PNG",
            "description": f"{name}来自 Kronbits Particle Pack。素材采用 CC0 1.0 Universal 许可，可自由用于个人及商业项目，无需署名。",
            "image": image_path,
            "createdAt": "2019-01-16",
            "collectedAt": "2026-08-04T16:00:00+08:00",
            "importBatchId": IMPORT_BATCH_ID,
            "importIndex": import_index,
        }
        assets.append(asset)
        records.append([suffix, name, type_name, primary_tag, series_tag, type_directory, group_slug, file_name])
    return assets, records


def write_manifest(records: list[list[object]]) -> None:
    rows = ",\n".join(f"    {json.dumps(row, ensure_ascii=False)}" for row in records)
    content = f'''(function () {{
  const sourceUrl = "{SOURCE_URL}";
  const licenseUrl = "{LICENSE_URL}";
  const importBatchId = "{IMPORT_BATCH_ID}";
  const records = [
{rows}
  ];

  globalThis.KRONBITS_PARTICLE_ASSETS = records.map(([suffix, name, type, primaryTag, seriesTag, typeDirectory, group, file], importIndex) => ({{
    id: `kronbits-particle-${{suffix}}`,
    name,
    type,
    license: "CC0",
    licenseUrl,
    attributionRequired: false,
    tags: [primaryTag, seriesTag, "透明背景", "512 × 512", "粒子贴图"],
    primaryTags: [primaryTag],
    secondaryTags: [seriesTag, "透明背景", "512 × 512", "粒子贴图"],
    source: "Particle Pack by Kronbits",
    sourceUrl,
    resolution: "512 × 512",
    format: "PNG",
    description: `${{name}}来自 Kronbits Particle Pack。素材采用 CC0 1.0 Universal 许可，可自由用于个人及商业项目，无需署名。`,
    image: `assets/library/${{typeDirectory}}/kronbits-particle-pack/${{group}}/${{file}}`,
    createdAt: "2019-01-16",
    collectedAt: "2026-08-04T16:00:00+08:00",
    importBatchId,
    importIndex
  }}));
}})();
'''
    MANIFEST.write_text(content, encoding="utf-8")


def update_catalog(assets: list[dict[str, object]]) -> list[dict[str, object]]:
    catalog = json.loads(CATALOG.read_text(encoding="utf-8"))
    existing = {str(asset["id"]): asset for asset in catalog["assets"] if str(asset.get("id", "")).startswith("kronbits-particle-")}
    assets = [{**asset, **existing.get(str(asset["id"]), {})} for asset in assets]
    catalog["assets"] = [asset for asset in catalog["assets"] if not str(asset.get("id", "")).startswith("kronbits-particle-")]
    catalog["assets"].extend(assets)
    CATALOG.write_text(json.dumps(catalog, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return assets


def update_metadata(assets: list[dict[str, object]]) -> None:
    metadata = json.loads(METADATA.read_text(encoding="utf-8"))
    old = next((item for item in metadata["collections"] if item.get("collection") == "Particle Pack" and item.get("creator") == "Kronbits"), None)
    old_count = int(old.get("assetCount", 0)) if old else 0
    old_hidden = int(old.get("categories", {}).get("hidden", 0)) if old else 0
    new_hidden = sum(str(asset["type"]) == "不展示" for asset in assets)
    metadata["assetCount"] = int(metadata["assetCount"]) - old_count + len(assets)
    metadata["publicAssetCount"] = int(metadata["publicAssetCount"]) - (old_count - old_hidden) + (len(assets) - new_hidden)
    metadata["collections"] = [item for item in metadata["collections"] if not (item.get("collection") == "Particle Pack" and item.get("creator") == "Kronbits")]
    collection = {
        "collection": "Particle Pack",
        "creator": "Kronbits",
        "source": SOURCE_URL,
        "license": "CC0 1.0 Universal",
        "licenseUrl": LICENSE_URL,
        "licenseVerified": True,
        "attributionRequired": False,
        "assetCount": len(assets),
        "resolution": "512 × 512",
        "hostedLocally": True,
        "downloadEnabled": True,
        "categories": {
            "light-effects": sum(str(asset["type"]) == "光效" for asset in assets),
            "sequences": sum(str(asset["type"]) == "序列" for asset in assets),
            "elements": sum(str(asset["type"]) == "元素" for asset in assets),
            "loops": sum(str(asset["type"]) == "循环" for asset in assets),
            "objects": sum(str(asset["type"]) == "物体" for asset in assets),
        },
    }
    first_external = next((index for index, item in enumerate(metadata["collections"]) if item.get("assetCount") == 0 and item.get("externalResourceCount")), len(metadata["collections"]))
    metadata["collections"].insert(first_external, collection)
    catalog = json.loads(CATALOG.read_text(encoding="utf-8"))
    metadata["publicEntryCount"] = sum(str(asset["type"]) != "不展示" for asset in catalog["assets"])
    METADATA.write_text(json.dumps(metadata, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def main() -> None:
    assets, records = build_assets()
    write_manifest(records)
    assets = update_catalog(assets)
    update_metadata(assets)
    print(f"Imported {len(assets)} Kronbits Particle Pack textures")


if __name__ == "__main__":
    main()
