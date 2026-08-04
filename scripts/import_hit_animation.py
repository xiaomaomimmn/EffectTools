from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
INCOMING = ROOT / "incoming"
OUTPUT = ROOT / "assets" / "library" / "sequences" / "hit-animation-frame-by-frame"
SOURCE_URL = "https://opengameart.org/content/hit-animation-frame-by-frame"
SOURCE_FRAME_SIDE = 1024
OUTPUT_FRAME_SIDE = 512
PREVIEW_SIDE = 128
FRAME_RATE = 30

SEQUENCES = (
    ("Hit-Yellow.png", "yellow-hit-a"),
    ("hit - yellow.png", "yellow-hit-b"),
)

SOURCE_NOTE = f"""Hit Animation - Frame by Frame
Source: {SOURCE_URL}
License: CC0 1.0 Universal
License URL: https://creativecommons.org/publicdomain/zero/1.0/
Attribution: Not required

The supplied 4096x4096 sheet was sliced as a 4x4 grid of 1024x1024 frames.
Each frame was resized to 512x512 without cropping.
"""


def main() -> None:
    downloads = OUTPUT / "downloads"
    downloads.mkdir(parents=True, exist_ok=True)

    for source_name, slug in SEQUENCES:
        source_path = INCOMING / source_name
        if not source_path.exists():
            source_path = OUTPUT / slug / "source.png"
        sheet = Image.open(source_path).convert("RGBA")
        if sheet.size != (4096, 4096):
            raise ValueError(f"{source_name}: expected 4096x4096, got {sheet.size}")

        sequence_dir = OUTPUT / slug
        frames_dir = sequence_dir / "frames"
        frames_dir.mkdir(parents=True, exist_ok=True)
        (sequence_dir / "source.png").write_bytes(source_path.read_bytes())

        frames = []
        index = 0
        for row in range(4):
            for column in range(4):
                left = column * SOURCE_FRAME_SIDE
                top = row * SOURCE_FRAME_SIDE
                frame = sheet.crop((left, top, left + SOURCE_FRAME_SIDE, top + SOURCE_FRAME_SIDE))
                frame = frame.resize((OUTPUT_FRAME_SIDE, OUTPUT_FRAME_SIDE), Image.Resampling.LANCZOS)
                frame_path = frames_dir / f"frame-{index:03d}.png"
                frame.save(frame_path, optimize=True)
                frames.append(frame)
                index += 1

        previews = [frame.resize((PREVIEW_SIDE, PREVIEW_SIDE), Image.Resampling.LANCZOS) for frame in frames]
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

        zip_path = downloads / f"{slug}-512px-frames.zip"
        with ZipFile(zip_path, "w", ZIP_DEFLATED, compresslevel=9) as archive:
            archive.writestr("SOURCE.txt", SOURCE_NOTE)
            archive.write(source_path, f"{slug}/original-4x4-spritesheet.png")
            for frame_path in sorted(frames_dir.glob("frame-*.png")):
                archive.write(frame_path, f"{slug}/frames-512px/{frame_path.name}")

        print(f"{slug}: {len(frames)} frames, 1024x1024 -> 512x512")


if __name__ == "__main__":
    main()
