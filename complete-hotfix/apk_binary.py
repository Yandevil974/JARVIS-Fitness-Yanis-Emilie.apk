"""Minimal Android binary resource editing, preserving resource IDs and ZIP paths.

Only string-pool values and explicitly named manifest attributes are edited.
Unlike an aapt rebuild, this does not re-qualify/rename native drawable resources.
"""
import struct


def u16(data, offset):
    return struct.unpack_from('<H', data, offset)[0]


def u32(data, offset):
    return struct.unpack_from('<I', data, offset)[0]


def chunks(data, start):
    while start < len(data):
        kind, header, size = struct.unpack_from('<HHI', data, start)
        if size < header or header < 8 or start + size > len(data):
            raise ValueError('Invalid Android resource chunk')
        yield start, kind, header, size
        start += size
    if start != len(data):
        raise ValueError('Resource boundary mismatch')


def read_length(data, offset, utf8):
    if utf8:
        n = data[offset]
        return (((n & 127) << 8) | data[offset + 1], offset + 2) if n & 128 else (n, offset + 1)
    n = u16(data, offset)
    return (((n & 32767) << 16) | u16(data, offset + 2), offset + 4) if n & 32768 else (n, offset + 2)


def length(n, utf8):
    if utf8:
        if n > 32767:
            raise ValueError('UTF-8 resource string too long')
        return bytes([n]) if n < 128 else bytes([(n >> 8) | 128, n & 255])
    return struct.pack('<H', n) if n < 32768 else struct.pack('<HH', (n >> 16) | 32768, n & 65535)


def pool_strings(pool):
    header = u16(pool, 2)
    count, _, flags, start, _ = struct.unpack_from('<IIIII', pool, 8)
    utf8 = bool(flags & 256)
    result = []
    for i in range(count):
        offset = start + u32(pool, header + 4 * i)
        n, offset = read_length(pool, offset, utf8)
        if utf8:
            n, offset = read_length(pool, offset, True)
            result.append(pool[offset:offset+n].decode('utf-8'))
        else:
            result.append(pool[offset:offset+2*n].decode('utf-16le'))
    return result


def patch_pool(pool, replacements):
    values = pool_strings(pool)
    updated = [replacements.get(value, value) for value in values]
    if updated == values:
        return pool
    header = u16(pool, 2)
    count, style_count, flags, _, styles_start = struct.unpack_from('<IIIII', pool, 8)
    utf8 = bool(flags & 256)
    offsets, strings = [], bytearray()
    for value in updated:
        offsets.append(len(strings))
        utf16_length = len(value.encode('utf-16le')) // 2
        if utf8:
            encoded = value.encode('utf-8')
            strings += length(utf16_length, True) + length(len(encoded), True) + encoded + b'\0'
        else:
            strings += length(utf16_length, False) + value.encode('utf-16le') + b'\0\0'
    strings += bytes(-len(strings) % 4)
    style_offsets = pool[header + 4*count:header + 4*(count + style_count)]
    styles = pool[styles_start:] if styles_start else b''
    start = header + 4*(count + style_count)
    out = bytearray(pool[:header])
    struct.pack_into('<IIIII', out, 8, count, style_count, flags & ~1, start, start + len(strings) if styles_start else 0)
    out += b''.join(struct.pack('<I', n) for n in offsets) + style_offsets + strings + styles
    struct.pack_into('<I', out, 4, len(out))
    assert pool_strings(out) == updated
    return bytes(out)


def patch_manifest(data, replacements, version_code):
    if u16(data, 0) != 3:
        raise ValueError('Not an Android binary XML document')
    header = u16(data, 2)
    result = bytearray(data[:header])
    strings = None
    edited = set()
    for offset, kind, size_header, size in chunks(data, header):
        chunk = data[offset:offset+size]
        if kind == 1:
            strings = pool_strings(chunk)
            chunk = patch_pool(chunk, replacements)
        elif kind == 0x102:  # RES_XML_START_ELEMENT_TYPE
            chunk = bytearray(chunk)
            tag = strings[u32(chunk, size_header + 4)]
            attr_start, attr_size, attr_count = struct.unpack_from('<HHH', chunk, size_header + 8)
            if attr_size != 20:
                raise ValueError('Unsupported manifest attribute size')
            for i in range(attr_count):
                start = size_header + attr_start + i*attr_size
                name = strings[u32(chunk, start + 4)]
                if tag == 'manifest' and name == 'versionCode':
                    if chunk[start + 15] != 0x10:
                        raise ValueError('versionCode is not an integer')
                    struct.pack_into('<I', chunk, start + 16, version_code)
                    edited.add('versionCode')
                elif tag == 'application' and name == 'debuggable':
                    if chunk[start + 15] != 0x12:
                        raise ValueError('debuggable is not a boolean')
                    struct.pack_into('<I', chunk, start + 16, 0)
                    edited.add('debuggable')
        result += chunk
    if edited != {'versionCode', 'debuggable'}:
        raise ValueError(f'Unexpected manifest attributes: {edited}')
    struct.pack_into('<I', result, 4, len(result))
    return bytes(result)


def patch_resources(data, replacements, old_package, new_package):
    if u16(data, 0) != 2:
        raise ValueError('Not an Android resource table')
    header = u16(data, 2)
    result = bytearray(data[:header])
    changed_package = 0
    for offset, kind, _, size in chunks(data, header):
        chunk = data[offset:offset+size]
        if kind == 1:
            chunk = patch_pool(chunk, replacements)
        elif kind == 0x200:
            chunk = bytearray(chunk)
            name = chunk[12:268].decode('utf-16le').split('\0')[0]
            if name == old_package:
                encoded = new_package.encode('utf-16le')
                if len(encoded) >= 256:
                    raise ValueError('Package name too long')
                chunk[12:268] = encoded + bytes(256 - len(encoded))
                changed_package += 1
        result += chunk
    if changed_package != 1:
        raise ValueError(f'Expected one application resource package, found {changed_package}')
    struct.pack_into('<I', result, 4, len(result))
    return bytes(result)
