from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
INCOMING = ROOT / "incoming"
OUTPUT = ROOT / "assets" / "library" / "sequences" / "fire-smoke-animations"
SOURCE_URL = "https://opengameart.org/content/fire-smoke-animations"
PREVIEW_SIDE = 128
FRAME_RATE = 30

SEQUENCES = (
    ("FireBlast_RefSheet.png", "fire-blast"),
    ("FireBurst_RefSheet.png", "fire-burst"),
    ("FirePlume_RefSheet.png", "fire-plume"),
    ("OilyFireball_RefSheet.png", "oily-fireball"),
    ("SmokeGas_RefSheet.png", "smoke-gas"),
    ("SmokeLarge_RefSheet.png", "smoke-large"),
    ("SmokePoff_RefSheet.png", "smoke-poff"),
    ("SmokeSmall_RefSheet.png", "smoke-small"),
    ("SmokeThickPuff_RefSheet.png", "smoke-thick-puff"),
    ("SmokeThick_RefSheet.png", "smoke-thick"),
    ("Smoke_RefSheet.png", "smoke"),
)

SOURCE_NOTE = f"""Fire & Smoke Animations
Source: {SOURCE_URL}
License: CC0 1.0 Universal
License URL: https://creativecommons.org/publicdomain/zero/1.0/
Attribution: Not required

Each horizontal sheet was sliced into square cells using the sheet height. The
resulting cells were centered on a transparent square canvas whose side is the
next power of two. Original pixels were not resized or cropped.
"""


def next_power_of_two(value: int) -> int:
    return 1 << (value - 1).bit_length()


def square_power_of_two(frame: Image.Image, side: int) -> Image.Image:
    canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    canvas.alpha_composite(frame, ((side - frame.width) // 2, (side - frame.height) // 2))
    return canvas


def preview_frame(frame: Image.Image) -> Image.Image:
    scale = max(1, PREVIEW_SIDE // max(frame.size))
    preview = frame.resize((frame.width * scale, frame.height * scale), Image.Resampling.NEAREST)
    canvas = Image.new("RGBA", (PREVIEW_SIDE, PREVIEW_SIDE), (0, 0, 0, 0))
    canvas.alpha_composite(preview, ((PREVIEW_SIDE - preview.width) // 2, (PREVIEW_SIDE - preview.height) // 2))
    return canvas


def frame_durations(count: int) -> list[int]:
    return [34 if index % 3 == 2 else 33 for index in range(count)]


def main() -> None:
    downloads = OUTPUT / "downloads"
    downloads.mkdir(parents=True, exist_ok=True)

    for source_name, slug in SEQUENCES:
        source_path = INCOMING / source_name
        sheet = Image.open(source_path).convert("RGBA")
        source_side = sheet.height
        if sheet.width % source_side:
            raise ValueError(f"{source_name}: width {sheet.width} is not divisible by height {source_side}")
        output_side = next_power_of_two(source_side)

        sequence_dir = OUTPUT / slug
        frames_dir = sequence_dir / "frames"
        frames_dir.mkdir(parents=True, exist_ok=True)
        (sequence_dir / "source.png").write_bytes(source_path.read_bytes())

        frames = []
        for index, left in enumerate(range(0, sheet.width, source_side)):
            source_frame = sheet.crop((left, 0, left + source_side, source_side))
            frame = square_power_of_two(source_frame, output_side)
            frame_path = frames_dir / f"frame-{index:03d}.png"
            frame.save(frame_path, optimize=True)
            frames.append(frame)

        previews = [preview_frame(frame) for frame in frames]
        previews[0].save(
            sequence_dir / "preview.webp",
            save_all=True,
            append_images=previews[1:],
            duration=frame_durations(len(previews)),
            loop=0,
            lossless=True,
            quality=100,
            method=3,
        )

        zip_path = downloads / f"{slug}-power-of-two-frames.zip"
        with ZipFile(zip_path, "w", ZIP_DEFLATED, compresslevel=9) as archive:
            archive.writestr("SOURCE.txt", SOURCE_NOTE)
            archive.write(source_path, f"{slug}/original-spritesheet.png")
            for frame_path in sorted(frames_dir.glob("frame-*.png")):
                archive.write(frame_path, f"{slug}/frames/{frame_path.name}")

        print(f"{slug}: {len(frames)} frames, {source_side}x{source_side} -> {output_side}x{output_side}")


if __name__ == "__main__":
    main()
