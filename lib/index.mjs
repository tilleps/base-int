/**
 * BaseInt
 *
 * Use any custom base to shorten a string
 *
 * WARNING: This module is NOT [RFC4648](https://datatracker.ietf.org/doc/html/rfc4648#page-10)
 * compliant (formerly RFC3548).  Meaning base64 and base64url will not encode/decode
 * the same as btoa() and atob() or any of the native encodings (base16, base32)
 *
 * Derivative of the following:
 *   https://gist.github.com/CatsMiaow/b479e96d5613dbd4711ab6d768b3eea0
 *   https://www.npmjs.com/package/base-x
 */

export const BASE64URL =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
export const BASE64 =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
export const BASE62 =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
export const BASE36 = "0123456789abcdefghijklmnopqrstuvwxyz";
export const BASE32Z = "ybndrfg8ejkmcpqxot1uwisza345h769";
export const BASE32HEX = "0123456789ABCDEFGHIJKLMNOPQRSTUV";
export const BASE32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
export const BASE16 = "0123456789ABCDEF";
export const BASE8 = "01234567";
export const BASE2 = "01";

/**
 * @param {string|Uint8Array} input
 * @return {string}
 */
export function toHex(input) {
  if (input instanceof Uint8Array) {
    return Buffer.from(input).toString("hex");
  }

  let hex = BigInt(input).toString(16);
  if (hex.length % 2) {
    hex = "0" + hex;
  }

  return hex;
}

class BaseInt {
  /**
   * @type {bigint} base
   */
  base;

  /**
   * @type {string} charset Character set used to encode/decode
   */
  charset;

  /**
   * @param {string} [charset]
   */
  constructor(charset) {
    this.charset = charset || BASE62;
    this.base = BigInt(this.charset.length);
  }

  /**
   * @param {string} str
   */
  decode(str) {
    return str
      .split("")
      .reverse()
      .reduce(
        /**
         * @this {BaseInt}
         * @param {bigint} prev
         * @param {string} char
         * @param {number} i
         */
        function (prev, char, i) {
          const x = this.base ** BigInt(i);

          return prev + BigInt(this.charset.indexOf(char)) * x;
        }.bind(this),
        BigInt(0),
      )
      .toString();
  }

  /**
   * @param {string} str
   * @return {string} UUID
   */
  decodeToUUID(str) {
    const decoded = this.decode(str);

    const n = BigInt(decoded);

    //  BigInt("0x" + "ffffffff-ffff-ffff-ffff-ffffffffffff".replace(/-/g, ""));
    if (n > 340282366920938463463374607431768211455n) {
      throw new RangeError(
        "The string cannot be converted to UUID because it is too large",
      );
    }

    const hex = n.toString(16);

    // Format for UUID
    const uuid = hex.padStart(24, "0");
    return `${uuid.substr(0, 8)}-${uuid.substr(8, 4)}-${uuid.substr(12, 4)}-${uuid.substr(16, 4)}-${uuid.substr(20)}`;

    return decoded;
  }

  /**
   * @param {string|number|bigint} integer
   */
  encode(integer) {
    if (Number(integer) === 0) {
      return this.charset[0];
    }

    let num = BigInt(integer);

    /**
     * @type {Array<string>}
     */
    let str = [];

    const i = -1;

    while (num > 0) {
      const offset = Number(num % this.base);

      str = [this.charset[offset], ...str];
      num = num / this.base;
    }

    return str.join("");
  }

  /**
   * @param {string} uuid
   */
  encodeUUID(uuid) {
    let hex = uuid.replace(/-/g, "");

    if (hex.length % 2) {
      hex = "0" + hex;
    }

    const bn = BigInt("0x" + hex);

    return this.encode(bn);
  }
}

export default BaseInt;
