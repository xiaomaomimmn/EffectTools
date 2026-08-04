import json
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
CATALOG = ROOT / "assets" / "library" / "catalog.json"
PREVIEW_SIDE = 128
FRAME_RATE = 30


def preview_frame(path: Path) -> Image.Image:
    source = Image.open(path).convert("RGBA")
    source.thumbnail((PREVIEW_SIDE, PREVIEW_SIDE), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (PREVIEW_SIDE, PREVIEW_SIDE), (0, 0, 0, 0))
    canvas.alpha_composite(source, ((PREVIEW_SIDE - source.width) // 2, (PREVIEW_SIDE - source.height) // 2))
    return canvas


def frame_durations(count: int) -> list[int]:
    # WebP stores integer milliseconds. 33, 33, 34 averages exactly 30 FPS.
    return [34 if index % 3 == 2 else 33 for index in range(count)]


def main() -> None:
    catalog = json.loads(CATALOG.read_text(encoding="utf-8"))
    sequences = [asset for asset in catalog["assets"] if asset.get("sequenceFrames")]
    known_previews = {
        (asset.get("animatedPreview") or str(Path(asset["sequenceFrames"][0]).parent / "preview.webp")).split("?", 1)[0]
        for asset in sequences
    }
    sequence_root = ROOT / "assets" / "library" / "sequences"
    for frames_dir in sequence_root.rglob("frames"):
        frame_paths = sorted(frames_dir.glob("frame-*.png"))
        if not frame_paths:
            continue
        preview_path = str((frames_dir.parent / "preview.webp").relative_to(ROOT)).replace("\\", "/")
        if preview_path in known_previews:
            continue
        sequences.append({
            "id": f"discovered-{frames_dir.parent.name}",
            "sequenceFrames": [str(path.relative_to(ROOT)).replace("\\", "/") for path in frame_paths],
            "animatedPreview": preview_path,
        })
        known_previews.add(preview_path)
    for asset in sequences:
        source_size = Image.open(ROOT / asset["sequenceFrames"][0]).size
        keep_lossless = max(source_size) <= PREVIEW_SIDE
        frames = [preview_frame(ROOT / relative_path) for relative_path in asset["sequenceFrames"]]
        preview_path = (asset.get("animatedPreview") or str(Path(asset["sequenceFrames"][0]).parent / "preview.webp").replace("\\", "/")).split("?", 1)[0]
        output = ROOT / preview_path
        output.parent.mkdir(parents=True, exist_ok=True)
        frames[0].save(
            output,
            save_all=True,
            append_images=frames[1:],
            duration=frame_durations(len(frames)),
            loop=0,
            lossless=keep_lossless,
            quality=100 if keep_lossless else 82,
            method=3,
        )
        mode = "lossless" if keep_lossless else "quality 82"
        print(f"{asset['id']}: {len(frames)} frames at {FRAME_RATE} FPS, {mode}", flush=True)


if __name__ == "__main__":
    main()
