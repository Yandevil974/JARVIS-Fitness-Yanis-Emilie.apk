"""Add only two permissions and one private receiver to the pinned binary manifest.
Existing nodes, attribute IDs, resource map and string indices are preserved.
"""
import pathlib
import struct
import sys
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[2] / 'complete-hotfix'))
from apk_binary import chunks, pool_strings, u16, u32, length

PERMISSIONS = ['android.permission.POST_NOTIFICATIONS', 'android.permission.RECEIVE_BOOT_COMPLETED']
ACTIONS = ['android.intent.action.BOOT_COMPLETED', 'android.intent.action.MY_PACKAGE_REPLACED',
           'android.intent.action.TIME_SET', 'android.intent.action.TIMEZONE_CHANGED']
RECEIVER = 'app.jarvis.fitness.ReminderReceiver'


def extend_pool(pool, added):
    values = pool_strings(pool)
    header = u16(pool, 2)
    _, style_count, flags, _, _ = struct.unpack_from('<IIIII', pool, 8)
    if style_count: raise ValueError('Unexpected manifest styles')
    values += added
    utf8 = bool(flags & 256)
    offsets, data = [], bytearray()
    for value in values:
        offsets.append(len(data))
        n = len(value.encode('utf-16le')) // 2
        if utf8:
            raw = value.encode()
            data += length(n, True) + length(len(raw), True) + raw + b'\0'
        else:
            data += length(n, False) + value.encode('utf-16le') + b'\0\0'
    data += bytes(-len(data) % 4)
    result = bytearray(pool[:header])
    struct.pack_into('<IIIII', result, 8, len(values), 0, flags & ~1, header + 4*len(values), 0)
    result += b''.join(struct.pack('<I', offset) for offset in offsets) + data
    struct.pack_into('<I', result, 4, len(result))
    assert pool_strings(result) == values
    return bytes(result)


def add_notifications(data):
    parts = [data[o:o+s] for o, _, _, s in chunks(data, u16(data,2))]
    pool = next(x for x in parts if u16(x,0)==1)
    values = pool_strings(pool)
    if RECEIVER in values or any(p in values for p in PERMISSIONS):
        raise ValueError('Notifications already added or unexpected manifest')
    added = PERMISSIONS + [RECEIVER] + [a for a in ACTIONS if a not in values]
    newpool = extend_pool(pool, added)
    strings = pool_strings(newpool)
    index = strings.index
    ns = index('http://schemas.android.com/apk/res/android')
    def start(tag, attrs=()):
        values = b''
        for name, kind, value in attrs:
            raw = index(value) if kind==3 else 0xffffffff
            typed = raw if kind==3 else value
            values += struct.pack('<IIIHBBI', ns,index(name),raw,8,0,kind,typed)
        return struct.pack('<HHIII',0x102,16,36+len(values),1,0xffffffff) + struct.pack('<IIHHHHHH',0xffffffff,index(tag),20,20,len(attrs),0,0,0) + values
    def end(tag): return struct.pack('<HHIIIII',0x103,16,24,1,0xffffffff,0xffffffff,index(tag))
    permissions = b''.join(start('uses-permission',[('name',3,p)])+end('uses-permission') for p in PERMISSIONS)
    receiver = start('receiver',[('name',3,RECEIVER),('enabled',0x12,0xffffffff),('exported',0x12,0)])
    receiver += start('intent-filter')
    receiver += b''.join(start('action',[('name',3,a)])+end('action') for a in ACTIONS)
    receiver += end('intent-filter')+end('receiver')
    result = bytearray(data[:u16(data,2)]); inserted = set()
    for part in parts:
        kind=u16(part,0)
        if kind==1: part=newpool
        elif kind in (0x102,0x103) and strings[u32(part,u16(part,2)+4)]=='application':
            if kind==0x102: result+=permissions;inserted.add('permissions')
            else: result+=receiver;inserted.add('receiver')
        result+=part
    if inserted != {'permissions','receiver'}: raise ValueError('Missing application boundary')
    struct.pack_into('<I',result,4,len(result))
    return bytes(result)
