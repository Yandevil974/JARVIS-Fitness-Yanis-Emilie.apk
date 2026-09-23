#!/usr/bin/env python3
"""Offline hotfix: retain native DEX, rebuild web/resources, align and sign.

Requires Java, Apktool 2.9.3+ and Android apksigner. Build web assets first:
  npm ci && npm run build:portable && npm run build
Private signing material must remain outside the repository/public downloads.
This fallback avoids Android SDK downloads and GitHub Actions artifact quotas.
"""
import argparse
import hashlib
import json
from pathlib import Path
import re
import shutil
import struct
import subprocess
import tempfile
import zipfile

ROOT = Path(__file__).resolve().parents[1]
BASE_SHA256 = "f820c9b954cce1b0cda8adceecb300a8c520e1ec0785d58030c6e44cf546d65e"


def sha256(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def run(*args):
    subprocess.run([str(a) for a in args], check=True)


def align_apk(source, target):
    """Align stored ZIP members before signing (4 B resources, 16 KiB native libs)."""
    with zipfile.ZipFile(source) as src, zipfile.ZipFile(target, "w") as dst:
        for info in src.infolist():
            data = src.read(info.filename)
            if info.compress_type == zipfile.ZIP_STORED:
                alignment = 16384 if info.filename.startswith("lib/") and info.filename.endswith(".so") else 4
                offset = dst.fp.tell() + 30 + len(info.filename.encode("utf-8")) + len(info.extra)
                if offset % alignment:
                    padding = (-(offset + 4)) % alignment
                    info.extra += struct.pack("<HH", 0xD935, padding) + bytes(padding)
            dst.writestr(info, data)
    verify_alignment(target)


def verify_alignment(path):
    with zipfile.ZipFile(path) as z, open(path, "rb") as raw:
        for info in z.infolist():
            if info.compress_type != zipfile.ZIP_STORED:
                continue
            raw.seek(info.header_offset + 26)
            namesize, extrasize = struct.unpack("<HH", raw.read(4))
            offset = info.header_offset + 30 + namesize + extrasize
            alignment = 16384 if info.filename.startswith("lib/") and info.filename.endswith(".so") else 4
            assert offset % alignment == 0, f"Unaligned APK entry: {info.filename}"


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    for name in ["base", "apktool", "apksigner", "keystore", "password-file", "output"]:
        parser.add_argument("--" + name, required=True, type=Path)
    parser.add_argument("--java", default="java")
    args = parser.parse_args()
    assert sha256(args.base) == BASE_SHA256, "Unexpected base APK; inspect it before rebuilding"
    assert (ROOT / "release/index.html").exists(), "Run the web build first"
    config = json.loads((ROOT / "capacitor.config.json").read_text())
    version = json.loads((ROOT / "package.json").read_text())["version"]
    version_code = re.search(r"versionCode (\d+)", (ROOT / "android/app/build.gradle").read_text()).group(1)
    with tempfile.TemporaryDirectory(prefix="jarvis-apk-") as tmp:
        work = Path(tmp)
        decoded = work / "decoded"
        run(args.java, "-jar", args.apktool, "d", "-f", "-s", args.base, "-o", decoded)
        manifest = decoded / "AndroidManifest.xml"
        text = manifest.read_text()
        old = "app.jarvis.fitness"
        new = config["appId"]
        # Keep Java class names: only the install ID, authorities and permissions change.
        text = text.replace(f'package="{old}"', f'package="{new}"')
        for suffix in ["fileprovider", "androidx-startup", "DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION"]:
            text = text.replace(f"{old}.{suffix}", f"{new}.{suffix}")
        text = text.replace('android:debuggable="true"', 'android:debuggable="false"')
        manifest.write_text(text)
        strings = decoded / "res/values/strings.xml"
        strings.write_text(strings.read_text().replace(">JARVIS Fitness<", f'>{config["appName"]}<').replace(f">{old}<", f">{new}<"))
        metadata = decoded / "apktool.yml"
        text = re.sub(r"versionCode: .*", f"versionCode: {version_code}", metadata.read_text())
        metadata.write_text(re.sub(r"versionName: .*", f"versionName: {version}", text))
        shutil.rmtree(decoded / "assets/public")
        shutil.copytree(ROOT / "release", decoded / "assets/public")
        shutil.copyfile(ROOT / "capacitor.config.json", decoded / "assets/capacitor.config.json")
        shutil.rmtree(decoded / "assets/restoration", ignore_errors=True)
        unsigned, aligned = work / "unsigned.apk", work / "aligned.apk"
        run(args.java, "-jar", args.apktool, "b", decoded, "-o", unsigned)
        align_apk(unsigned, aligned)
        args.output.parent.mkdir(parents=True, exist_ok=True)
        run(args.java, "-jar", args.apksigner, "sign", "--ks", args.keystore,
            "--ks-pass", f"file:{args.password_file}", "--v1-signing-enabled", "false",
            "--v2-signing-enabled", "true", "--v3-signing-enabled", "true",
            "--v4-signing-enabled", "false",
            "--out", args.output, aligned)
        run(args.java, "-jar", args.apksigner, "verify", "--verbose", "--print-certs", args.output)
        verify_alignment(args.output)
        with zipfile.ZipFile(args.base) as base, zipfile.ZipFile(args.output) as result:
            for name in base.namelist():
                if name.endswith(".dex"):
                    assert base.read(name) == result.read(name), f"Native code changed: {name}"
            for path in (ROOT / "release").rglob("*"):
                if path.is_file():
                    assert result.read("assets/public/" + str(path.relative_to(ROOT / "release"))) == path.read_bytes()
            assert not any("restoration/" in name for name in result.namelist())
        print(f"Verified native code, web assets, alignment and signature. SHA-256: {sha256(args.output)}")


if __name__ == "__main__":
    main()
