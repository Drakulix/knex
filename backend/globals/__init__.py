import datetime as dt

from bson import ObjectId
from uuid import UUID
from flask_principal import Permission, PermissionDenied, RoleNeed

__all__ = ['ADMIN_PERMISSION', 'object_id_to_uuid', 'uuid_to_object_id']

ADMIN_PERMISSION = Permission(RoleNeed('admin'))


class UTC(dt.tzinfo):
    ZERO = dt.timedelta(0)

    def utcoffset(self, dt):
        return self.ZERO

    def tzname(self, dt):
        return 'UTC'

    def dst(self, dt):
        return self.ZERO

UTC = UTC()
UUID_1_EPOCH = dt.datetime(1582, 10, 15, tzinfo=UTC)
UUID_TICKS_PER_SECOND = 10000000


def unix_time_to_uuid_time(dt):
    return int((dt - UUID_1_EPOCH).total_seconds() * UUID_TICKS_PER_SECOND)


def object_id_to_uuid(object_id):
    """
    Converts ObjectId to UUID
    :param object_id: some ObjectId
    :return: UUID
    """

    str_object_id = str(object_id)

    b = []
    for i in [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22]:
        b.append(int(str_object_id[i:i+2], 16))

    generation_time = ObjectId(str_object_id).generation_time.astimezone(UTC)
    time = unix_time_to_uuid_time(generation_time)
    time |= (b[4] >> 6) & 0x3

    most_sig_bits = str(hex(0x1000 | time >> 48 & 0x0FFF |
                        time >> 16 & 0xFFFF0000 |
                        time << 32))[9:]

    least_sig_bits = str(hex(2 << 62 |
                             (b[4] & 0x3F) << 56 | (b[5] & 0xFF) << 48 |
                             (b[6] & 0xFF) << 40 | (b[7] & 0xFF) << 32 |
                             (b[8] & 0xFF) << 24 | (b[9] & 0xFF) << 16 |
                             (b[10] & 0xFF) << 8 | b[11] & 0xFF))[2:]

    return UUID('%s-%s-%s-%s-%s' % (most_sig_bits[:8], most_sig_bits[8:12], most_sig_bits[12:16],
                least_sig_bits[0:4], least_sig_bits[4:]))


def get_timestamp_from_uuid(uuid_object):
    generation_time = dt.datetime.utcfromtimestamp(
        (uuid_object.time - 0x01b21dd213814000) * 100 / 1e9)
    generation_time = generation_time.replace(tzinfo=pytz.UTC)
    return int(generation_time.timestamp())


def get_timestamp_from_object_id(object_id):
    generation_time = object_id.generation_time
    return int(generation_time.timestamp())


def return_decimal_bytes(binary):
    binary = binary[2:]
    rest = len(binary) % 8

    if rest != 0:
        binary = '0'*(8 - rest) + binary
    bytes = {}

    for i in range(0, len(binary)//8):
        bytes[i] = binary[:8]
        binary = binary[8:]

    return bytes


def uuid_to_object_id(uuid_object):
    """
    Converts UUID to ObjectId
    :param uuid_object: UUID
    :return: ObjectId
    """

    uuid_to_bin = bin(int(uuid_object))
    parts_of_uuid = return_decimal_bytes(uuid_to_bin)

    timestamp_of_uuid = hex(get_timestamp_from_uuid(uuid_object))
    timestamp_of_uuid = timestamp_of_uuid.replace('0x', '')

    uuid_time = uuid_object.time

    fourth = int(parts_of_uuid[8], 2) & 0x3F | (uuid_time << 6)
    fourth = str(hex(fourth))[-2:]

    fifth = str(hex(int(parts_of_uuid[9], 2)))
    sixth = str(hex(int(parts_of_uuid[10], 2)))
    seventh = str(hex(int(parts_of_uuid[11], 2)))
    eighth = str(hex(int(parts_of_uuid[12], 2)))
    ninth = str(hex(int(parts_of_uuid[13], 2)))
    tenth = str(hex(int(parts_of_uuid[14], 2)))

    try:
        eleventh = str(hex(int(parts_of_uuid[15], 2)))
    except Exception as e:
        print(e)
        eleventh = str(hex(1))

    def rep(el):
        if len(el) <= 3:
            return el.replace('x', '')
        else:
            return el.replace('0x', '')

    res = rep(fifth) + rep(sixth) + rep(seventh) + rep(eighth)\
        + rep(ninth) + rep(tenth) + rep(eleventh)

    return ObjectId(timestamp_of_uuid + fourth + res)
