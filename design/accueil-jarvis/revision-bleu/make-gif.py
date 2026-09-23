"""Create the eight-second orb preview from render.mjs frames; requires Pillow."""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent
REPO = ROOT.parents[2]
files = sorted((REPO / ".cache/revision-design/orb-frames").glob("*.png"))
if len(files) != 100:
    raise SystemExit("Run render.mjs with RENDER_GIF=1 first (100 frames required).")
frames = [Image.open(file).convert("RGB") for file in files]
width, height = frames[0].size
sheet = Image.new("RGB", (width * 5, height * 4))
for index, frame in enumerate(frames[::5]):
    sheet.paste(frame, (index % 5 * width, index // 5 * height))
palette = sheet.quantize(colors=256, method=Image.Quantize.MEDIANCUT)
indexed = [frame.quantize(palette=palette, dither=Image.Dither.NONE) for frame in frames]
output = ROOT / "orbe-bleu-anime.gif"
indexed[0].save(output, save_all=True, append_images=indexed[1:], duration=80,
                loop=0, optimize=False, disposal=1)
with Image.open(output) as result:
    assert result.n_frames == 100
    assert result.info["loop"] == 0
    assert result.info["duration"] == 80
print(f"GIF: {width} × {height}, 100 frames, 8 seconds, {output.stat().st_size:,} bytes.")
