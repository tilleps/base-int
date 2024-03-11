import tap from "tap";

import BaseInt, {
  BASE64URL,
  BASE64,
  BASE62,
  BASE36,
  BASE32Z,
  BASE32HEX,
  BASE32,
  BASE16,
  BASE8,
  BASE2,
} from "baseint";

const bases = {
  BASE64URL,
  BASE64,
  BASE62,
  BASE36,
  BASE32Z,
  BASE32HEX,
  BASE32,
  BASE16,
  BASE8,
  BASE2,
};

const numbers = [
  "0",
  "1",
  "2",
  "10",
  "15",
  "16",
  "31",
  "255",
  "256",
  "1234567890",
  "9876543210",
  String(Number.MAX_SAFE_INTEGER),
  String(Number.MAX_SAFE_INTEGER + 1),
  "246822080025974834485881087518675471512", // Example UUID
];

tap.test("BaseInt (non compliant RFC 4648)", function (t) {
  for (const [baseName, charset] of Object.entries(bases)) {
    t.test(baseName, function (t) {
      const baseInt = new BaseInt(charset);

      for (const numstr of numbers) {
        t.test(`NumString: ${numstr}`, function (t) {
          const encoded = baseInt.encode(numstr);
          const decoded = baseInt.decode(encoded);

          t.ok(encoded, `should encode to string: ${encoded}`);
          t.equal(numstr, decoded, `should decode back to original: ${numstr}`);
          t.end();
        });
      }

      t.end();
    });
  }

  t.end();
});

tap.test("UUID with Base62", function (t) {
  const baseInt = new BaseInt(BASE62);

  const uuid = "b9b03417-a52a-47cf-8638-3c26b2628c98";
  const bn = BigInt("0x" + uuid.replace(/-/g, ""));

  t.equal(
    bn,
    246822080025974834485881087518675471512n,
    "should convert to bigint",
  );

  const encoded = baseInt.encode(bn);
  const encodedUUID = baseInt.encodeUUID(uuid);

  t.equal(encoded, "FoYGiVxbLcGdqtB3H0Qzbi", "should encode by numstring");
  t.equal(encodedUUID, "FoYGiVxbLcGdqtB3H0Qzbi", "should encode by uuid");

  t.equal(
    encodedUUID,
    encoded,
    "should have matching outputs: encodeUUID() and encode()",
  );

  const decoded = baseInt.decode(encoded);

  t.equal(decoded, bn.toString(), "should decode back to numstr");

  const decodedUUID = baseInt.decodeToUUID(encoded);

  t.end();
});

tap.test("hex smaller than UUID", function (t) {
  const smallHex = "ffff";
  const bn = BigInt("0x" + smallHex.replace(/-/g, ""));

  t.equal(bn, 65535n, "should convert 'ffff' to bigint '65535n'");

  const baseInt = new BaseInt(BASE62);

  const encoded = baseInt.encode(bn);

  t.equal(encoded, "RDB", "should encode 'ffff' to 'RDB'");

  const uuid = baseInt.decodeToUUID(encoded);

  t.equal(
    uuid,
    "00000000-0000-0000-0000-ffff",
    "uuid should be 000000000-0000-0000-0000-ffff",
  );

  t.end();
});

tap.test("hex larger than UUID", function (t) {
  const largeHex = "ffffffff-ffff-ffff-ffff-ffffffffffff" + "00";
  const bn = BigInt("0x" + largeHex.replace(/-/g, ""));

  const baseInt = new BaseInt(BASE62);

  const encoded = baseInt.encode(bn);
  t.throws(
    function () {
      baseInt.decodeToUUID(encoded);
    },
    new RangeError(),
    "should throw RangeError",
  );

  t.end();
});
