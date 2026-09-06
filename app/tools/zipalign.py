#!/usr/bin/env python3
"""
ALIGNEMENT D'UN APK (équivalent de `zipalign`)

Android lit certains fichiers de l'APK directement depuis le disque,
sans les décompresser : `resources.arsc` et les bibliothèques natives.
Pour cela il les projette en mémoire, ce qui impose que leurs données
commencent à une adresse alignée — 4 octets en général, 4096 pour les
`.so`. Un APK mal aligné est rejeté à l'installation, souvent avec le
message peu bavard « Application non installée ».

L'alignement se règle en rembourrant le champ « extra » de l'en-tête
local, qui précède les données : on l'allonge juste assez pour que les
données tombent au bon endroit. Seules les entrées non compressées sont
concernées, les autres étant de toute façon déchiffrées en mémoire.

À lancer AVANT la signature : réécrire le fichier après coup
invaliderait le condensat.

    python3 tools/zipalign.py entree.apk sortie.apk
"""
import struct
import sys
import zipfile


def alignment_for(name, compress_type):
    """Contrainte d'alignement d'une entrée, en octets (1 = aucune)."""
    if compress_type != zipfile.ZIP_STORED:
        return 1
    return 4096 if name.endswith(".so") else 4


def align(src, dst):
    zin = zipfile.ZipFile(src)
    raw = open(src, "rb").read()
    out = bytearray()
    central = []
    padded = 0

    for info in zin.infolist():
        off = info.header_offset
        # Relire l'en-tête local : ses champs peuvent différer de ceux
        # du catalogue central (nom et extra notamment).
        sig, ver, flags, method, mtime, mdate, crc, csize, usize, nlen, elen = (
            struct.unpack("<IHHHHHIIIHH", raw[off : off + 30])
        )
        if sig != 0x04034B50:
            raise ValueError(f"en-tête local invalide pour {info.filename}")
        name = raw[off + 30 : off + 30 + nlen]
        extra = raw[off + 30 + nlen : off + 30 + nlen + elen]
        data_start = off + 30 + nlen + elen
        data = raw[data_start : data_start + csize]

        # Le champ extra local est purement local : on peut le remplacer.
        # (Celui du catalogue central, lui, est conservé tel quel.)
        need = alignment_for(info.filename, info.compress_type)
        header_offset = len(out)
        if need > 1:
            pos = header_offset + 30 + nlen
            pad = (need - (pos % need)) % need
            if pad:
                padded += 1
            extra = b"\x00" * pad
        else:
            extra = b""

        out += struct.pack(
            "<IHHHHHIIIHH", sig, ver, flags, method, mtime, mdate,
            crc, csize, usize, nlen, len(extra),
        )
        out += name + extra + data

        # Un éventuel descripteur de données suit les données.
        if flags & 0x08:
            tail = raw[data_start + csize : data_start + csize + 16]
            n = 16 if tail[:4] == b"\x50\x4b\x07\x08" else 12
            out += raw[data_start + csize : data_start + csize + n]

        central.append((info, header_offset))

    cd_start = len(out)
    for info, header_offset in central:
        off = info.header_offset
        nlen, elen = struct.unpack("<HH", raw[off + 26 : off + 30])
        name = raw[off + 30 : off + 30 + nlen]
        dt = info.date_time
        dostime = (dt[3] << 11) | (dt[4] << 5) | (dt[5] // 2)
        dosdate = ((dt[0] - 1980) << 9) | (dt[1] << 5) | dt[2]
        out += struct.pack(
            "<IHHHHHHIIIHHHHHII",
            0x02014B50,
            info.create_version | (info.create_system << 8),
            info.extract_version,
            info.flag_bits,
            info.compress_type,
            dostime,
            dosdate,
            info.CRC,
            info.compress_size,
            info.file_size,
            nlen,
            0,                       # extra : inutile côté catalogue
            len(info.comment),
            0,                       # numéro de disque
            info.internal_attr,
            info.external_attr,
            header_offset,
        )
        out += name + info.comment

    cd_size = len(out) - cd_start
    out += struct.pack(
        "<IHHHHIIH", 0x06054B50, 0, 0, len(central), len(central),
        cd_size, cd_start, 0,
    )
    open(dst, "wb").write(out)
    return len(central), padded


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print(__doc__)
        sys.exit(2)
    n, padded = align(sys.argv[1], sys.argv[2])
    print(f"  {n} entrées, {padded} réalignées")
