#!/usr/bin/env python3
"""
============================================================
SIGNATURE D'UN APK — APK Signature Scheme v2
------------------------------------------------------------
Implémente le schéma de signature v2 d'Android, suffisant à
partir d'Android 7.0 (minSdk du projet : 26).

Pourquoi une implémentation maison : `apksigner` fait partie du
SDK Android, indisponible ici et non téléchargeable. Le format
v2 est cependant entièrement documenté et reproductible.

PRINCIPE DU FORMAT
Un APK est un ZIP composé de quatre zones consécutives :
  1. le contenu des entrées
  2. le bloc de signature APK  <- inséré ici
  3. le catalogue central (Central Directory)
  4. l'enregistrement de fin (End of Central Directory)

La signature v2 couvre les zones 1, 3 et 4, chacune découpée en
morceaux de 1 Mo. Chaque morceau est condensé, puis l'ensemble
des condensats est condensé à son tour : c'est le condensat
final qui est signé.

  condensat_morceau = SHA256( 0xa5 || uint32(taille) || données )
  condensat_final   = SHA256( 0x5a || uint32(nb_morceaux) || tous_les_condensats )

Comme l'offset du catalogue central change une fois le bloc
inséré, l'EOCD est condensé avec ce champ corrigé au préalable.

USAGE
  python3 tools/apksign.py entree.apk sortie.apk [cle.pem]

Sans clé fournie, une paire RSA 2048 et un certificat
auto-signé valable 30 ans sont générés puis conservés, afin que
les mises à jour ultérieures partagent la même identité.
============================================================
"""

import os
import struct
import sys
import hashlib
from datetime import datetime, timedelta, timezone

try:
    from cryptography import x509
    from cryptography.x509.oid import NameOID
    from cryptography.hazmat.primitives import hashes, serialization
    from cryptography.hazmat.primitives.asymmetric import rsa, padding
except ImportError:
    sys.exit(
        "Le module `cryptography` est requis.\n"
        "  python3 -m venv venv && ./venv/bin/pip install cryptography"
    )

CHUNK = 1024 * 1024
SIG_BLOCK_MAGIC = b"APK Sig Block 42"
V2_BLOCK_ID = 0x7109871A
# RSASSA-PKCS1-v1_5 avec SHA-256, identifiant défini par Android.
SIG_ALGO_ID = 0x0103


# ----------------------------------------------------------------
# Localisation des zones du ZIP
# ----------------------------------------------------------------
def find_eocd(data):
    """Retrouve l'enregistrement de fin de catalogue (EOCD)."""
    # Le commentaire final peut mesurer jusqu'à 65535 octets.
    start = max(0, len(data) - 65536 - 22)
    pos = data.rfind(b"PK\x05\x06", start)
    if pos < 0:
        raise ValueError("EOCD introuvable : ce fichier n'est pas un ZIP valide.")
    return pos


def zones(data):
    """
    Retourne (debut_catalogue, fin_catalogue, debut_eocd).

    Dans l'EOCD, l'octet 12 porte la TAILLE du catalogue central et
    l'octet 16 son OFFSET — dans cet ordre. Les inverser décale tout le
    condensat sans pour autant casser la structure du ZIP, ce qui rend
    l'erreur silencieuse : d'où ce commentaire.
    """
    eocd = find_eocd(data)
    cd_size = struct.unpack("<I", data[eocd + 12 : eocd + 16])[0]
    cd_offset = struct.unpack("<I", data[eocd + 16 : eocd + 20])[0]
    return cd_offset, cd_offset + cd_size, eocd


# ----------------------------------------------------------------
# Condensat v2
# ----------------------------------------------------------------
def chunk_digests(blocks):
    """Condense chaque morceau de 1 Mo de chaque zone."""
    digests = []
    for blob in blocks:
        for off in range(0, len(blob), CHUNK):
            piece = blob[off : off + CHUNK]
            h = hashlib.sha256()
            h.update(b"\xa5")
            h.update(struct.pack("<I", len(piece)))
            h.update(piece)
            digests.append(h.digest())
    return digests


def apk_digest(data):
    """
    Condensat global de l'APK tel que défini par le schéma v2.

    Point délicat du format : l'EOCD est condensé avec son offset de
    catalogue central ramené à l'offset du bloc de signature — donc à
    la fin du contenu, AVANT insertion. C'est ce qui rend le condensat
    indépendant de la taille du bloc : sans cela, la signature devrait
    couvrir sa propre longueur, ce qui serait circulaire.

    Concrètement, on condense le fichier non signé tel quel, en
    laissant l'offset de l'EOCD inchangé.
    """
    cd_start, cd_end, eocd_start = zones(data)
    content = data[:cd_start]
    central = data[cd_start:eocd_start]
    eocd = bytearray(data[eocd_start:])
    # L'offset condensé est celui du bloc de signature, c'est-à-dire la
    # fin du contenu : sur un APK non signé, la valeur déjà en place.
    struct.pack_into("<I", eocd, 16, cd_start)

    digests = chunk_digests([content, central, bytes(eocd)])
    final = hashlib.sha256()
    final.update(b"\x5a")
    final.update(struct.pack("<I", len(digests)))
    for d in digests:
        final.update(d)
    return final.digest()


# ----------------------------------------------------------------
# Encodage des structures longueur-préfixée
# ----------------------------------------------------------------
def lp(payload):
    """Préfixe une séquence par sa longueur sur 32 bits."""
    return struct.pack("<I", len(payload)) + payload


def build_v2_block(digest, cert_der, signer_key):
    """Assemble le bloc « APK Signature Scheme v2 » complet."""
    # digests : séquence de (algo_id, digest)
    # signed_data = séquence de digests | séquence de certificats |
    #               séquence d'attributs. Chaque séquence porte sa
    #               propre longueur, et chaque élément la sienne.
    digests = lp(lp(struct.pack("<I", SIG_ALGO_ID) + lp(digest)))
    certificates = lp(lp(cert_der))
    attributes = lp(b"")
    signed_data = digests + certificates + attributes

    signature = signer_key.sign(
        signed_data, padding.PKCS1v15(), hashes.SHA256()
    )
    signatures = lp(lp(struct.pack("<I", SIG_ALGO_ID) + lp(signature)))
    public_key = lp(
        signer_key.public_key().public_bytes(
            serialization.Encoding.DER,
            serialization.PublicFormat.SubjectPublicKeyInfo,
        )
    )
    # Le signataire encapsule signed_data (préfixé), la séquence de
    # signatures et la clé publique. Le tout est lui-même préfixé,
    # puis placé dans la séquence des signataires — également préfixée.
    signer = lp(lp(signed_data) + signatures + public_key)
    return lp(signer)


def build_signing_block(v2_block):
    """
    Enveloppe le bloc v2 dans le bloc de signature APK, aligné sur
    4096 octets pour préserver l'alignement des entrées STORED.
    """
    pair = struct.pack("<Q", len(v2_block) + 4) + struct.pack("<I", V2_BLOCK_ID) + v2_block
    # taille (8) + paires + taille (8) + magie (16)
    size = len(pair) + 8 + 16
    total = size + 8
    padding_len = (-total) % 4096
    if padding_len:
        # Bloc de bourrage : identifiant réservé 0x42726577.
        if padding_len < 12:
            padding_len += 4096
        pad_payload = b"\x00" * (padding_len - 12)
        pad = (
            struct.pack("<Q", len(pad_payload) + 4)
            + struct.pack("<I", 0x42726577)
            + pad_payload
        )
        pair += pad
        size = len(pair) + 8 + 16
    return struct.pack("<Q", size) + pair + struct.pack("<Q", size) + SIG_BLOCK_MAGIC


# ----------------------------------------------------------------
# Clé et certificat
# ----------------------------------------------------------------
def load_or_create_key(path):
    """Charge la clé de signature, ou en crée une conservée sur disque."""
    if path and os.path.exists(path):
        blob = open(path, "rb").read()
        key = serialization.load_pem_private_key(blob, password=None)
        cert = x509.load_pem_x509_certificate(blob)
        return key, cert

    key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    name = x509.Name(
        [
            x509.NameAttribute(NameOID.COMMON_NAME, "JARVIS Fitness"),
            x509.NameAttribute(NameOID.ORGANIZATION_NAME, "JARVIS Fitness"),
            x509.NameAttribute(NameOID.COUNTRY_NAME, "FR"),
        ]
    )
    now = datetime.now(timezone.utc)
    cert = (
        x509.CertificateBuilder()
        .subject_name(name)
        .issuer_name(name)
        .public_key(key.public_key())
        .serial_number(x509.random_serial_number())
        .not_valid_before(now - timedelta(days=1))
        .not_valid_after(now + timedelta(days=365 * 30))
        .sign(key, hashes.SHA256())
    )
    if path:
        os.makedirs(os.path.dirname(path) or ".", exist_ok=True)
        with open(path, "wb") as f:
            f.write(
                key.private_bytes(
                    serialization.Encoding.PEM,
                    serialization.PrivateFormat.PKCS8,
                    serialization.NoEncryption(),
                )
            )
            f.write(cert.public_bytes(serialization.Encoding.PEM))
        os.chmod(path, 0o600)
        print(f"Clé de signature créée : {path}")
        print("  Conservez-la : elle seule permettra les mises à jour ultérieures.")
    return key, cert


# ----------------------------------------------------------------
# Assemblage final
# ----------------------------------------------------------------
def sign(src, dst, keystore):
    data = bytearray(open(src, "rb").read())
    cd_start, cd_end, eocd_start = zones(data)
    content_end = cd_start
    if data.find(SIG_BLOCK_MAGIC, max(0, content_end - 4096)) >= 0:
        raise SystemExit("Cet APK porte déjà un bloc de signature.")

    key, cert = load_or_create_key(keystore)
    cert_der = cert.public_bytes(serialization.Encoding.DER)

    # Le condensat ne dépend pas de la taille du bloc (voir apk_digest),
    # il n'y a donc aucun point fixe à chercher : un seul calcul suffit.
    digest = apk_digest(bytes(data))
    block = build_signing_block(build_v2_block(digest, cert_der, key))

    out = bytearray()
    out += data[:content_end]
    out += block
    out += data[cd_start:eocd_start]
    eocd = bytearray(data[eocd_start:])
    struct.pack_into("<I", eocd, 16, content_end + len(block))
    out += eocd

    open(dst, "wb").write(out)
    print(f"APK signé : {dst}  ({len(out) / 1024 / 1024:.1f} Mo)")
    print(f"  Empreinte du certificat (SHA-256) :")
    print(f"  {cert.fingerprint(hashes.SHA256()).hex()}")


if __name__ == "__main__":
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    sign(sys.argv[1], sys.argv[2], sys.argv[3] if len(sys.argv) > 3 else None)
