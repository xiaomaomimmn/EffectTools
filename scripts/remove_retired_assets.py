from __future__ import annotations

import argparse
import json
import re
from collections import Counter
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
LIBRARY = (ROOT / "assets" / "library").resolve()
CATALOG = LIBRARY / "catalog.json"
METADATA = LIBRARY / "metadata.json"
RETIRED_JS = ROOT / "retired-assets.js"

TYPE_KEYS = {
    "光效": "light-effects",
    "序列": "sequences",
    "元素": "elements",
    "循环": "loops",
    "物体": "objects",
    "不展示": "hidden",
}


def retired_ids() -> list[str]:
    text = RETIRED_JS.read_text(encoding="utf-8")
    match = re.search(r"=\s*(\[[\s\S]*\])\s*;\s*$", text)
    if not match:
        raise RuntimeError("Cannot parse retired-assets.js")
    values = json.loads(match.group(1))
    if len(values) != len(set(values)):
        raise RuntimeError("retired-assets.js contains duplicate IDs")
    return values


def kronbits_manifest() -> dict[str, dict[str, object]]:
    text = (ROOT / "kronbits-particle-assets.js").read_text(encoding="utf-8")
    match = re.search(r"const records = \[\s*([\s\S]*?)\s*\];", text)
    if not match:
        raise RuntimeError("Cannot parse kronbits-particle-assets.js")
    records = json.loads(f"[{match.group(1)}]")
    result = {}
    for suffix, name, type_name, _primary, _series, type_directory, group, file_name in records:
        asset_id = f"kronbits-particle-{suffix}"
        result[asset_id] = {
            "id": asset_id,
            "name": name,
            "type": type_name,
            "source": "Particle Pack by Kronbits",
            "image": f"assets/library/{type_directory}/kronbits-particle-pack/{group}/{file_name}",
        }
    return result


def infer_asset(asset_id: str, kronbits: dict[str, dict[str, object]]) -> dict[str, object]:
    if asset_id in kronbits:
        return kronbits[asset_id]
    if asset_id.startswith("kronbits-particle-"):
        suffix = asset_id.removeprefix("kronbits-particle-")
        groups = {
            "basic-ding-blood": ("elements", "元素"),
            "basic-ding-shapes": ("objects", "物体"),
            "color-spirowires": ("light-effects", "光效"),
            "complex-others": ("light-effects", "光效"),
            "basic-spiral": ("light-effects", "光效"),
            "complex-circle": ("light-effects", "光效"),
        }
        for group, (directory, type_name) in groups.items():
            if suffix.startswith(f"{group}-"):
                file_name = suffix.removeprefix(f"{group}-") + ".png"
                return {"id": asset_id, "type": type_name, "source": "Particle Pack by Kronbits", "image": f"assets/library/{directory}/kronbits-particle-pack/{group}/{file_name}"}
    atlas_match = re.fullmatch(r"pixel-fx-atlas-(\d{2})", asset_id)
    if atlas_match:
        number = atlas_match.group(1)
        return {"id": asset_id, "type": "不展示", "source": "FX Pixel Texture by bdragon1727", "image": f"assets/library/hidden/fx-pixel-texture/atlases/{number}_Pixel_FX_Texture.png"}
    pixel_match = re.fullmatch(r"pixel-fx-(16x16|32x32)-([a-z0-9]+)-(\d+)", asset_id)
    if pixel_match:
        size, group, number = pixel_match.groups()
        labels = {"fx": ("elements", "FX", "元素"), "impact": ("elements", "Impact", "元素"), "arcane": ("light-effects", "Arcane", "光效")}
        directory, file_group, type_name = labels[group]
        return {"id": asset_id, "type": type_name, "source": "FX Pixel Texture by bdragon1727", "image": f"assets/library/{directory}/fx-pixel-texture/{size}_{file_group}_{int(number)}.png"}
    if asset_id == "lens-flare-particle-divine":
        return {"id": asset_id, "type": "光效", "source": "Lens Flares and Particles by hackcraft.de", "image": "assets/library/light-effects/lens-flares-and-particles/divine.png"}
    if asset_id == "kenney-light-mask-120":
        return {"id": asset_id, "type": "光效", "source": "Kenney Light Masks", "image": "assets/library/light-effects/kenney-light-masks/window_a.png"}
    raise RuntimeError(f"Cannot infer deleted asset: {asset_id}")


def synchronize_metadata(metadata: dict[str, object], active_assets: list[dict[str, object]]) -> None:
    definitions = [
        ("Particle Pack", "Kronbits", lambda asset: str(asset["id"]).startswith("kronbits-particle-")),
        ("FX Pixel Texture", None, lambda asset: str(asset["id"]).startswith("pixel-fx-")),
        ("Lens Flares and Particles", None, lambda asset: str(asset["id"]).startswith("lens-flare-particle-")),
        ("Kenney Light Masks", None, lambda asset: str(asset["id"]).startswith("kenney-light-mask-")),
    ]
    old_asset_total = 0
    old_public_total = 0
    new_asset_total = 0
    new_public_total = 0
    for collection_name, creator, predicate in definitions:
        collection = next(item for item in metadata["collections"] if item.get("collection") == collection_name and (creator is None or item.get("creator") == creator))
        old_count = int(collection["assetCount"])
        old_hidden = int(collection["categories"].get("hidden", 0))
        old_asset_total += old_count
        old_public_total += old_count - old_hidden

        current = [asset for asset in active_assets if predicate(asset)]
        counts = Counter(TYPE_KEYS[str(asset["type"])] for asset in current)
        collection["assetCount"] = len(current)
        for category in ["light-effects", "sequences", "elements", "loops", "objects", "hidden"]:
            if category in collection["categories"] or counts[category]:
                collection["categories"][category] = counts[category]
        new_asset_total += len(current)
        new_public_total += len(current) - counts["hidden"]

    metadata["assetCount"] = int(metadata["assetCount"]) - old_asset_total + new_asset_total
    metadata["publicAssetCount"] = int(metadata["publicAssetCount"]) - old_public_total + new_public_total
    metadata["publicEntryCount"] = sum(str(asset["type"]) != "不展示" for asset in active_assets)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true")
    args = parser.parse_args()

    ids = retired_ids()
    id_set = set(ids)
    catalog = json.loads(CATALOG.read_text(encoding="utf-8"))
    by_id = {str(asset["id"]): asset for asset in catalog["assets"]}
    already_deleted = set(map(str, catalog["deletedAssetIds"]))
    unknown_ids = [asset_id for asset_id in ids if asset_id not in by_id and asset_id not in already_deleted]
    if unknown_ids:
        raise RuntimeError(f"IDs are neither active nor deleted: {unknown_ids}")

    kronbits = kronbits_manifest()
    assets = [by_id.get(asset_id) or infer_asset(asset_id, kronbits) for asset_id in ids]
    paths: list[Path] = []
    for asset in assets:
        path = (ROOT / str(asset["image"])).resolve()
        if not path.is_relative_to(LIBRARY):
            raise RuntimeError(f"Unsafe image path for {asset['id']}: {path}")
        if path.is_file():
            paths.append(path)
        elif str(asset["id"]) not in already_deleted:
            raise RuntimeError(f"Missing active image for {asset['id']}: {path}")
    if len(paths) != len(set(paths)):
        raise RuntimeError("Multiple IDs resolve to the same image")

    source_counts = Counter(str(asset["source"]) for asset in assets)
    type_counts = Counter(str(asset["type"]) for asset in assets)
    public_count = sum(str(asset["type"]) != "不展示" for asset in assets)
    print(json.dumps({"ids": len(ids), "files": len(paths), "public": public_count, "sources": source_counts, "types": type_counts}, ensure_ascii=False, indent=2))
    if not args.apply:
        return

    for path in paths:
        path.unlink()

    catalog["assets"] = [asset for asset in catalog["assets"] if str(asset["id"]) not in id_set]
    catalog["deletedAssetIds"] = list(dict.fromkeys([*catalog["deletedAssetIds"], *ids]))
    CATALOG.write_text(json.dumps(catalog, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    metadata = json.loads(METADATA.read_text(encoding="utf-8"))
    synchronize_metadata(metadata, catalog["assets"])
    METADATA.write_text(json.dumps(metadata, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Removed {len(assets)} retired assets and image files")


if __name__ == "__main__":
    main()
