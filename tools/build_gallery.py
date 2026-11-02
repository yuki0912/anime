#!/usr/bin/env python3
"""Build the static GitHub Pages site and generate its image manifest."""
from __future__ import annotations
import json
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "_site"
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp", ".avif"}
CATEGORIES = [
    ("arknight", "Arknights"),
    ("pjsk", "Project SEKAI"),
    ("圖片", "插畫收藏"),
    ("照片", "照片 / 其他"),
]

def main() -> None:
    if OUTPUT.exists():
        shutil.rmtree(OUTPUT)
    OUTPUT.mkdir(parents=True)
    for filename in ("index.html", "styles.css", "script.js"):
        source = ROOT / filename
        if not source.is_file():
            raise FileNotFoundError(f"Missing required website file: {source}")
        shutil.copy2(source, OUTPUT / filename)

    gallery_items: list[dict[str, str]] = []
    for folder, label in CATEGORIES:
        source_folder = ROOT / folder
        if not source_folder.is_dir():
            continue
        for source in sorted(source_folder.rglob("*"), key=lambda p: p.as_posix().casefold()):
            if not source.is_file() or source.suffix.lower() not in IMAGE_EXTENSIONS:
                continue
            relative = source.relative_to(ROOT)
            destination = OUTPUT / relative
            destination.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(source, destination)
            gallery_items.append({"path": relative.as_posix(), "category": folder, "title": source.stem})

    category_manifest = [{"key": folder, "label": label} for folder, label in CATEGORIES]\n    manifest = "window.GALLERY_CATEGORIES = " + json.dumps(category_manifest, ensure_ascii=False, separators=(",", ":")) + ";\n"\n    manifest += "window.GALLERY_ITEMS = " + json.dumps(gallery_items, ensure_ascii=False, separators=(",", ":")) + ";\n"
    (OUTPUT / "gallery-data.js").write_text(manifest, encoding="utf-8")
    (OUTPUT / ".nojekyll").write_text("", encoding="utf-8")
    print(f"Built {len(gallery_items)} images into {OUTPUT}")
    for folder, label in CATEGORIES:
        count = sum(1 for item in gallery_items if item["category"] == folder)
        print(f"  {label}: {count}")

if __name__ == "__main__":
    main()
