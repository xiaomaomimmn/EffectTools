from pathlib import Path
from shutil import copy2


ROOT = Path(__file__).resolve().parents[1]
INCOMING = ROOT / "incoming"
OUTPUT = ROOT / "assets" / "library" / "light-effects" / "lens-flares-and-particles"


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    png_files = sorted(INCOMING.glob("*.png"))
    if len(png_files) != 36:
        raise ValueError(f"Expected 36 PNG files, found {len(png_files)}")
    for source in png_files:
        copy2(source, OUTPUT / source.name)
    copy2(INCOMING / "LICENSE", OUTPUT / "LICENSE")
    print(f"Imported {len(png_files)} PNG files and LICENSE")


if __name__ == "__main__":
    main()
