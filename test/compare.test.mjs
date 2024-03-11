import tap from "tap";

import BaseInt, {
  toHex,
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

import BaseX from "base-x";

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

const subjects = [
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

tap.test("BaseInt comparison to Base-X", function (t) {
  for (const [baseName, charset] of Object.entries(bases)) {
    t.test(`${baseName}`, function (t) {
      const baseInt = new BaseInt(BASE62);
      const baseX = BaseX(BASE62);

      for (const subject of subjects) {
        t.test(`input ${subject}`, function (t) {
          const baseEncoded = baseInt.encode(subject);

          const baseDecoded = baseInt.decode(baseEncoded);
          const bsDecoded = baseX.decode(baseEncoded);

          const baseHex = toHex(baseDecoded);
          const bsHex = toHex(bsDecoded);

          t.ok(baseDecoded, "BaseInt should decode");
          t.ok(bsDecoded, "BaseX should decode");

          t.equal(
            baseHex,
            bsHex,
            `should have same decoded value: ${baseDecoded}`,
          );

          t.end();
        });
      }

      t.end();
    });
  }

  t.end();
});
