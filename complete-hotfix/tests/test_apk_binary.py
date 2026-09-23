import importlib.util
import json
import os
from pathlib import Path
import struct
import sys
import unittest
import zipfile

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from apk_binary import chunks, pool_strings, patch_pool, patch_manifest, patch_resources, u16, u32

CONFIG = json.loads((ROOT / 'manifest.json').read_text())
BASE = Path(os.environ.get('COMPLETE_BASE_APK', '/home/user/new-original.apk'))


def pools(data):
    return [data[o:o+s] for o, k, _, s in chunks(data, u16(data, 2)) if k == 1]


def attrs(data):
    strings = pool_strings(pools(data)[0])
    result = []
    for o, kind, h, size in chunks(data, u16(data, 2)):
        if kind != 0x102:
            continue
        chunk = data[o:o+size]
        tag = strings[u32(chunk, h+4)]
        start, stride, count = struct.unpack_from('<HHH', chunk, h+8)
        for i in range(count):
            p = h+start+i*stride
            name, typ, value = strings[u32(chunk, p+4)], chunk[p+15], u32(chunk, p+16)
            result.append((tag, name, typ, strings[value] if typ == 3 else value))
    return result


class BinaryPatchTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with zipfile.ZipFile(BASE) as z:
            cls.manifest = z.read('AndroidManifest.xml')
            cls.resources = z.read('resources.arsc')

    def test_noop_pool_is_byte_identical(self):
        for data in (self.manifest, self.resources):
            for pool in pools(data):
                self.assertEqual(patch_pool(pool, {}), pool)

    def test_strings_keep_their_indices_and_all_unrelated_values(self):
        replacement = {'JARVIS Fitness': 'JARVIS Fitness Complet', 'app.jarvis.fitness': CONFIG['appId']}
        for data in (self.manifest, self.resources):
            for pool in pools(data):
                original = pool_strings(pool)
                updated = patch_pool(pool, replacement)
                self.assertEqual(pool_strings(updated), [replacement.get(s, s) for s in original])
                self.assertEqual(u32(updated, 4), len(updated))
                self.assertEqual(len(updated) % 4, 0)

    def test_utf8_and_utf16_unicode_and_long_lengths(self):
        for utf8 in (True, False):
            text = 'ancien'
            encoded = text.encode('utf-8' if utf8 else 'utf-16le')
            raw = bytes([len(text), len(encoded)]) + encoded + b'\0' if utf8 else struct.pack('<H', len(text)) + encoded + b'\0\0'
            raw += bytes(-len(raw) % 4)
            pool = struct.pack('<HHIIIIIII', 1, 28, 32+len(raw), 1, 0, 256 if utf8 else 0, 32, 0, 0) + raw
            replacement = 'Échauffement 🏋️ ' + 'a' * (250 if utf8 else 33000)
            patched = patch_pool(pool, {text: replacement})
            self.assertEqual(pool_strings(patched), [replacement])

    def test_only_named_manifest_values_change_and_native_classes_remain(self):
        old, new = 'app.jarvis.fitness', CONFIG['appId']
        replacements = {old: new, '1.0.4': CONFIG['version']}
        for suffix in ['fileprovider', 'androidx-startup', 'DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION']:
            replacements[f'{old}.{suffix}'] = f'{new}.{suffix}'
        updated = patch_manifest(self.manifest, replacements, CONFIG['versionCode'])
        expected = []
        for tag, name, typ, value in attrs(self.manifest):
            if tag == 'manifest' and name == 'versionCode': value = CONFIG['versionCode']
            elif tag == 'application' and name == 'debuggable': value = 0
            elif typ == 3: value = replacements.get(value, value)
            expected.append((tag, name, typ, value))
        self.assertEqual(attrs(updated), expected)
        self.assertIn(('activity', 'name', 3, 'app.jarvis.fitness.MainActivity'), expected)
        self.assertEqual(u32(updated, 4), len(updated))

    def test_resource_ids_offsets_and_package_body_are_unchanged(self):
        old, new = 'app.jarvis.fitness', CONFIG['appId']
        updated = patch_resources(self.resources, {old: new, 'JARVIS Fitness': CONFIG['appName']}, old, new)
        a = [(k, self.resources[o:o+s]) for o, k, _, s in chunks(self.resources, u16(self.resources, 2))]
        b = [(k, updated[o:o+s]) for o, k, _, s in chunks(updated, u16(updated, 2))]
        self.assertEqual(len(a), len(b))
        for (kind, before), (kind_after, after) in zip(a, b):
            self.assertEqual(kind, kind_after)
            if kind == 0x200:
                self.assertEqual(before[:12], after[:12])
                self.assertEqual(before[268:], after[268:])
                self.assertEqual(after[12:268].decode('utf-16le').split('\0')[0], new)
        self.assertEqual(u32(updated, 4), len(updated))


if __name__ == '__main__':
    unittest.main()
