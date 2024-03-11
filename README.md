# BaseInt

Encode and decode strings to a custom base

Inspired by / derivative of [base62.js](https://github.com/base62/base62.js) and [Base-x](https://github.com/cryptocoinjs/base-x)

**WARNING:** This module is **NOT [RFC4648](https://datatracker.ietf.org/doc/html/rfc4648#page-10)
compliant** (formerly [RFC3548](https://datatracker.ietf.org/doc/html/rfc3548)).  Meaning base64 
and base64url will not encode/decode the same as `btoa()` and `atob()` or any of the native encodings 
(base16, base32)

## Installation

```sh
npm install baseint
```


## Usage

```js
import BaseInt, {
  BASE64URL,
  BASE64,
  BASE62,
  BASE32,
  BASE32HEX,
  BASE16
} from "baseint";

// Supply which base you want to use (BASE62 is default)
const baseInt = new BaseInt(BASE62);

// Or supply your own base
const charset = "abcd1234";
const baseInt = new BaseInt(charset);

const encoded = baseInt.encode(numstr);
const decoded = baseInt.decode(encoded);
```


### UUID Example

```js
const baseInt = new BaseInt();

const uuid = "b9b03417-a52a-47cf-8638-3c26b2628c98";

//  Convert uuid to bigint/number/numeric string
const bn = BigInt("0x" + uuid.replace(/-/g, ""));

const encoded = baseInt.encode(bn);
// FoYGiVxbLcGdqtB3H0Qzbi

//  Or encode directly
const encoded = baseInt.encodeUUID(uuid);
// FoYGiVxbLcGdqtB3H0Qzbi

const decoded = baseInt.decodeToUUID(encoded);
// b9b03417-a52a-47cf-8638-3c26b2628c98
```


## Predefined Bases / Character Sets

| Base        | Characters                                                           |
| ----------- | -------------------------------------------------------------------- |
| BASE64URL   | `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_`   |
| BASE64      | `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/`   |
| BASE62      | `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`     |
| BASE36      | `0123456789abcdefghijklmnopqrstuvwxyz`                               |
| BASE32Z     | `ybndrfg8ejkmcpqxot1uwisza345h769`                                   |
| BASE32HEX   | `0123456789ABCDEFGHIJKLMNOPQRSTUV`                                   |
| BASE32      | `ABCDEFGHIJKLMNOPQRSTUVWXYZ234567`                                   |
| BASE16      | `0123456789ABCDEF`                                                   |
| BASE8       | `01234567`                                                           |
| BASE2       | `01`                                                                 |



## License

[MIT](LICENSE)



