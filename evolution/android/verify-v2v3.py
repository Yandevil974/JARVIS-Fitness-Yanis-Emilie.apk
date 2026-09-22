#!/usr/bin/env python3
"""Independent verifier for APK Signature Scheme v2 and v3 (source.android.com spec).

Implemented from the public specification, deliberately NOT from apk_sign_ts code,
so it is an independent check of any signer (apksigner included). Self-test:
`python3 verify-v2v3.py <any apksigner-signed apk> --expect-cert-sha256 <hex>` must pass.
"""
import argparse, hashlib, io, json, struct, sys, zipfile
from pathlib import Path

CHUNK = 1024 * 1024
MAGIC = b'APK Sig Block 42'
ALG_NAMES = {0x0101: 'RSASSA-PSS/SHA2-256', 0x0102: 'RSASSA-PSS/SHA2-512',
             0x0103: 'RSASSA-PKCS1-v1_5/SHA2-256', 0x0104: 'RSASSA-PKCS1-v1_5/SHA2-512',
             0x0201: 'ECDSA/SHA2-256', 0x0202: 'ECDSA/SHA2-512'}


def eocd_and_cd(data: bytes):
    if data[-22:] == MAGIC[:4] or True:
        pass
    # locate EOCD (0x06054b50) scanning back over a possible zip comment
    lo = max(0, len(data) - 22 - 65535)
    idx = data.rfind(b'PK\x05\x06', lo)
    if idx < 0:
        raise ValueError('EOCD not found')
    eocd = idx
    assert struct.unpack_from('<I', data, eocd)[0] == 0x06054b50
    cd_size, cd_off = struct.unpack_from('<II', data, eocd + 12)
    cd_end = eocd  # central directory ends where EOCD starts
    return eocd, cd_off, cd_size


def signing_block_span(data: bytes, eocd: int, cd_off: int):
    """Return (block_start, block_size) if an APK Signing Block sits before the CD."""
    if cd_off < 32:
        return None, 0
    magic_at = cd_off - 16
    if data[magic_at:cd_off] != MAGIC:
        return None, 0
    block_size = struct.unpack_from('<Q', data, cd_off - 24)[0]
    block_start = cd_off - 8 - block_size
    # tail: second size field + magic
    assert struct.unpack_from('<Q', data, magic_at - 8)[0] == block_size
    return block_start, block_size


def parse_pairs(data: bytes, block_start: int, block_size: int):
    pairs = {}
    off = block_start + 8
    end = block_start + 8 + block_size - 24
    while off < end:
        pair_size = struct.unpack_from('<Q', data, off)[0]
        off += 8
        pid = struct.unpack_from('<I', data, off)[0]
        value = data[off + 4:off + pair_size]
        pairs[pid] = value
        off += pair_size
    return pairs


def lp(buf: bytes, off: int):
    (n,) = struct.unpack_from('<I', buf, off)
    return buf[off + 4:off + 4 + n], off + 4 + n


def seq(buf: bytes):
    """Parse a length-prefixed sequence of length-prefixed elements."""
    outer, _ = lp(buf, 0)
    items, off = [], 0
    while off < len(outer):
        item, off = lp(outer, off)
        items.append(item)
    return items


def content_digests(data: bytes, cd_off: int, eocd: int, alg_id: int, block_start: int):
    if prefix_of(alg_id) == 0x0101:
        hashlib_alg = 'sha256'
    else:
        hashlib_alg = 'sha512'
    # Per spec, the digest covers: ZIP entries (up to the ORIGINAL CD offset, i.e. the
    # signing block start), the Central Directory, and the EOCD whose CD-offset field is
    # patched back to that original offset.
    sections = [data[:block_start], data[cd_off:eocd], bytearray(data[eocd:])]
    struct.pack_into('<I', sections[2], 16, block_start)
    chunk_digests = []
    for section in sections:
        section = bytes(section)
        if len(section) % CHUNK == 0 and len(section) > 0:
            span = range(0, len(section) + 1, CHUNK)  # final empty chunk required by spec
        else:
            span = range(0, len(section), CHUNK)
        for start in span:
            chunk = section[start:start + CHUNK]
            h = hashlib.new(hashlib_alg)
            h.update(b'\xa5' + struct.pack('<I', len(chunk)) + chunk)
            chunk_digests.append(h.digest())
    top = hashlib.new(hashlib_alg)
    top.update(b'\x5a' + struct.pack('<I', len(chunk_digests)) + b''.join(chunk_digests))
    return {prefix_of(alg_id): top.digest()}


def lp_seq_elements(buf: bytes):
    """Parse a sequence of length-prefixed elements (buf is already the sequence content)."""
    items, off = [], 0
    while off < len(buf):
        item, off = lp(buf, off)
        items.append(item)
    return items


def verify_apk(path, expect_cert_sha256=None, verbose=True):
    from cryptography.hazmat.primitives import hashes, serialization
    from cryptography.hazmat.primitives.asymmetric import padding as apadding
    from cryptography import x509
    data = Path(path).read_bytes()
    eocd, cd_off, _cd_size = eocd_and_cd(data)
    block_start, block_size = signing_block_span(data, eocd, cd_off)
    if not block_start:
        raise ValueError('No APK Signing Block')
    pairs = parse_pairs(data, block_start, block_size)
    report = {'schemes': {}, 'certSha256': None, 'digestAlgs': [], 'signers': 0}
    checks = []
    for scheme, pid in ((2, 0x7109871a), (3, 0xf05368c0)):
        if pid not in pairs:
            report['schemes'][scheme] = 'absent'
            continue
        signers_seq = pairs[pid]
        signers, _ = lp(signers_seq, 0)
        count, off = 0, 0
        while off < len(signers):
            signer, off = lp(signers, off)
            count += 1
            signed_data, o2 = lp(signer, 0)
            if scheme == 3:
                min_sdk, max_sdk = struct.unpack_from('<II', signer, o2)
                o2 += 8
            signatures_raw, o2 = lp(signer, o2)
            public_key, o2 = lp(signer, o2)
            # --- digests and certificates from SIGNED data ---
            d_o = 0
            digests_raw, d_o = lp(signed_data, d_o)
            certs_raw, d_o = lp(signed_data, d_o)
            sd_min = sd_max = None
            if scheme == 3:
                sd_min, sd_max = struct.unpack_from('<II', signed_data, d_o)
                d_o += 8
            # remaining bytes are the attributes (skip verbatim; signature covers them)
            digests = {}
            for d in lp_seq_elements(digests_raw):
                (n,) = struct.unpack_from('<I', d, 4)
                digests[struct.unpack_from('<I', d, 0)[0]] = d[8:8 + n]
            certs = lp_seq_elements(certs_raw)
            cert = x509.load_der_x509_certificate(certs[0])
            cert_sha = cert.fingerprint(hashes.SHA256()).hex()
            report['certSha256'] = report['certSha256'] or cert_sha
            # 1. digest tree of the whole APK must match the signed digests
            for alg_id, digest in digests.items():
                computed = content_digests(data, cd_off, eocd, alg_id, block_start)
                if computed[prefix_of(alg_id)] != digest:
                    raise ValueError('scheme %d: content digest mismatch' % scheme)
                report['digestAlgs'].append(alg_id)
            # 2. each signature must verify against signed data with the cert key
            for sig in lp_seq_elements(signatures_raw):
                alg_id = struct.unpack_from('<I', sig, 0)[0]
                (n,) = struct.unpack_from('<I', sig, 4)
                signature = sig[8:8 + n]
                key = cert.public_key()
                if alg_id in (0x0101, 0x0102):
                    key.verify(signature, signed_data, apadding.PSS(mgf=apadding.MGF1(hashes.SHA256()), salt_length=32), hashes.SHA256())
                else:
                    key.verify(signature, signed_data, apadding.PKCS1v15(), hashes.SHA256())
            # 3. public key must match the certificate key
            spki = cert.public_key().public_bytes(serialization.Encoding.DER, serialization.PublicFormat.SubjectPublicKeyInfo)
            if spki != public_key:
                raise ValueError('scheme %d: public key != certificate SPKI' % scheme)
            if scheme == 3:
                if (min_sdk, max_sdk) != (sd_min, sd_max):
                    raise ValueError('scheme 3: min/max SDK mismatch between signer and signed data')
                report.setdefault('v3SdkRange', [min_sdk, max_sdk])
            checks.append(scheme)
        report['schemes'][scheme] = 'verified' if pid in pairs else 'absent'
    report['signers'] = len(checks)
    if expect_cert_sha256 and report['certSha256'] != expect_cert_sha256:
        raise ValueError('Certificate %s != expected %s' % (report['certSha256'], expect_cert_sha256))
    if verbose:
        print(json.dumps(report, indent=2, ensure_ascii=False))
    if 2 not in checks or 3 not in checks:
        raise ValueError('v2+v3 both required; got %s' % checks)
    return report


def prefix_of(alg_id: int):
    if alg_id in (0x0101, 0x0103):
        return 0x0101
    if alg_id in (0x0102, 0x0104):
        return 0x0102
    raise ValueError('Non-RSA digest tree not implemented for alg %#x' % alg_id)



if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('apk')
    ap.add_argument('--expect-cert-sha256')
    ap.add_argument('--json')
    args = ap.parse_args()
    report = verify_apk(args.apk, args.expect_cert_sha256)
    if args.json:
        Path(args.json).write_text(json.dumps(report, indent=2, ensure_ascii=False) + '\n')
    print('VERIFIED v2+v3:', args.apk)
