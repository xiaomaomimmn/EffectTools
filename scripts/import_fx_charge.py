from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
INCOMING = ROOT / "incoming" / "fx_1.png"
OUTPUT = ROOT / "assets" / "library" / "sequences" / "fx-charge"
SOURCE_URL = "https://opengameart.org/content/fx-charge"
FRAME_SIDE = 256
PREVIEW_SIDE = 128
FRAME_RATE = 30

SOURCE_NOTE = f"""FX Charge
Source: {SOURCE_URL}
License: CC0 1.0 Universal
License URL: https://creativecommons.org/publicdomain/zero/1.0/
Attribution: Not required

The original 256x2048 vertical sprite sheet was sliced from top to bottom into
eight 256x256 RGBA frames. The original pixels and transparent ending frame are
preserved.
"""


def main() -> None:
    source_path = INCOMING if INCOMING.exists() else OUTPUT / "source.png"
    sheet = Image.open(source_path).convert("RGBA")
    if sheet.size != (FRAME_SIDE, FRAME_SIDE * 8):
        raise ValueError(f"Expected 256x2048, got {sheet.size}")

    frames_dir = OUTPUT / "frames"
    downloads = OUTPUT / "downloads"
    frames_dir.mkdir(parents=True, exist_ok=True)
    downloads.mkdir(parents=True, exist_ok=True)
    (OUTPUT / "source.png").write_bytes(source_path.read_bytes())

    frames = []
    for index in range(8):
        frame = sheet.crop((0, index * FRAME_SIDE, FRAME_SIDE, (index + 1) * FRAME_SIDE))
        frame_path = frames_dir / f"frame-{index:03d}.png"
        frame.save(frame_path, optimize=True)
        frames.append(frame)

    previews = [frame.resize((PREVIEW_SIDE, PREVIEW_SIDE), Image.Resampling.LANCZOS) for frame in frames]
    previews[0].save(
        OUTPUT / "preview.webp",
        save_all=True,
        append_images=previews[1:],
        duration=[34 if index % 3 == 2 else 33 for index in range(len(previews))],
        loop=0,
        lossless=False,
        quality=88,
        method=3,
    )

    with ZipFile(downloads / "fx-charge-frames.zip", "w", ZIP_DEFLATED, compresslevel=9) as archive:
        archive.writestr("SOURCE.txt", SOURCE_NOTE)
        archive.write(source_path, "fx-charge/original-vertical-spritesheet.png")
        for frame_path in sorted(frames_dir.glob("frame-*.png")):
            archive.write(frame_path, f"fx-charge/frames/{frame_path.name}")

    print("fx-charge: 8 frames, 256x256 RGBA, 30 FPS")


if __name__ == "__main__":
    main()
