from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
INCOMING = ROOT / "incoming"
OUTPUT = ROOT / "assets" / "library" / "sequences" / "gothicvania-magic-pack-9"
PREVIEW_SIDE = 128
FRAME_RATE = 30
SOURCE_URL = "https://opengameart.org/content/gothicvania-magic-pack-9"
SOURCE_NOTE = f"""Gothicvania Magic Pack 9 by ansimuz
Source: {SOURCE_URL}
License: CC0 1.0
License URL: https://creativecommons.org/publicdomain/zero/1.0/

Frames were sliced from the original horizontal sprite sheets. Every frame is
centered on a transparent square canvas without stretching the artwork.
"""

SEQUENCES = (
    ("Dark-Bolt.png", "dark-bolt", 64, 128),
    ("Fire-bomb.png", "fire-bomb", 64, 64),
    ("Lightning.png", "lightning", 64, 128),
    ("spark.png", "spark", 32, 32),
)


def transparent_square(frame: Image.Image, side: int) -> Image.Image:
    if frame.width > side or frame.height > side:
        raise ValueError(f"Frame {frame.size} does not fit inside {side}x{side}")
    canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    canvas.alpha_composite(frame.convert("RGBA"), ((side - frame.width) // 2, (side - frame.height) // 2))
    return canvas


def preview_frame(frame: Image.Image) -> Image.Image:
    canvas = Image.new("RGBA", (PREVIEW_SIDE, PREVIEW_SIDE), (0, 0, 0, 0))
    preview = frame.copy()
    if preview.width > PREVIEW_SIDE or preview.height > PREVIEW_SIDE:
        preview.thumbnail((PREVIEW_SIDE, PREVIEW_SIDE), Image.Resampling.NEAREST)
    canvas.alpha_composite(preview, ((PREVIEW_SIDE - preview.width) // 2, (PREVIEW_SIDE - preview.height) // 2))
    return canvas


def main() -> None:
    downloads = OUTPUT / "downloads"
    downloads.mkdir(parents=True, exist_ok=True)
    for source_name, slug, cell_width, output_side in SEQUENCES:
        source_path = INCOMING / source_name
        sheet = Image.open(source_path).convert("RGBA")
        if sheet.width % cell_width:
            raise ValueError(f"{source_name}: width {sheet.width} is not divisible by frame width {cell_width}")

        sequence_dir = OUTPUT / slug
        frames_dir = sequence_dir / "frames"
        frames_dir.mkdir(parents=True, exist_ok=True)
        (sequence_dir / "source.png").write_bytes(source_path.read_bytes())

        frames = []
        for index, left in enumerate(range(0, sheet.width, cell_width)):
            frame = transparent_square(sheet.crop((left, 0, left + cell_width, sheet.height)), output_side)
            frame_path = frames_dir / f"frame-{index:03d}.png"
            frame.save(frame_path, optimize=True)
            frames.append(frame)

        previews = [preview_frame(frame) for frame in frames]
        previews[0].save(
            sequence_dir / "preview.webp",
            save_all=True,
            append_images=previews[1:],
            duration=[34 if index % 3 == 2 else 33 for index in range(len(previews))],
            loop=0,
            lossless=True,
            quality=100,
            method=6,
        )

        zip_path = downloads / f"{slug}-frames.zip"
        with ZipFile(zip_path, "w", ZIP_DEFLATED, compresslevel=9) as archive:
            archive.writestr("SOURCE.txt", SOURCE_NOTE)
            archive.write(source_path, f"{slug}/original-spritesheet.png")
            for frame_path in sorted(frames_dir.glob("frame-*.png")):
                archive.write(frame_path, f"{slug}/frames/{frame_path.name}")

        print(f"{slug}: {len(frames)} frames, {frames[0].width}x{frames[0].height}")


if __name__ == "__main__":
    main()
