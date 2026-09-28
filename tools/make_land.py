"""Bake the globe's land mask (equirectangular, 1024x512) from Natural Earth 110m land (public domain).
Usage: python3 tools/make_land.py path/to/ne_110m_land.geojson"""
import json, sys
from PIL import Image, ImageDraw, ImageFilter
src = sys.argv[1] if len(sys.argv) > 1 else "ne_110m_land.geojson"
W, H, S = 1024, 512, 4
img = Image.new("L", (W * S, H * S), 0)
d = ImageDraw.Draw(img)
def xy(lon, lat): return ((lon + 180) / 360 * W * S, (90 - lat) / 180 * H * S)
for f in json.load(open(src))["features"]:
    g = f["geometry"]
    polys = g["coordinates"] if g["type"] == "MultiPolygon" else [g["coordinates"]]
    for poly in polys:
        d.polygon([xy(*p[:2]) for p in poly[0]], fill=255)
        for hole in poly[1:]:
            d.polygon([xy(*p[:2]) for p in hole], fill=0)
img = img.resize((W, H), Image.LANCZOS).filter(ImageFilter.GaussianBlur(0.6))
img.save("img/land.png", optimize=True)
print("wrote img/land.png")
