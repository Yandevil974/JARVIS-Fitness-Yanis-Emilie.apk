#!/usr/bin/env python3
"""Compare les paires orig-*/new-* produites par capture.mjs (PIL+numpy requis)."""
import glob, os, sys
from PIL import Image
import numpy as np
shots = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), "shots")
worst = 100.0
for p in sorted(glob.glob(os.path.join(shots, "orig-*.png"))):
    q = p.replace("orig-", "new-")
    if not os.path.exists(q):
        print("sans paire:", os.path.basename(p)); continue
    a, b = Image.open(p).convert("RGB"), Image.open(q).convert("RGB")
    if a.size != b.size:
        print(f"{os.path.basename(p):22s} tailles différentes {a.size} vs {b.size}"); continue
    per = np.abs(np.asarray(a).astype("int32") - np.asarray(b).astype("int32")).mean(axis=2)
    ident = 100 * (per == 0).mean()
    worst = min(worst, ident)
    print(f"{os.path.basename(p)[5:-4]:22s} identiques {ident:6.2f}%  modifiés>12 {100*(per>12).mean():5.2f}%")
print("pire:", f"{worst:.2f}%")
