(function(g){
  const SHIFT = [7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21];
  const K = [
    0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee,
    0xf57c0faf, 0x4787c62a, 0xa8304613, 0xfd469501,
    0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be,
    0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821,
    0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa,
    0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8,
    0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed,
    0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a,
    0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c,
    0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70,
    0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x04881d05,
    0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665,
    0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039,
    0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1,
    0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1,
    0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391
  ];

  function utf8ToBytes(str) {
    if (typeof TextEncoder !== 'undefined') {
      return new TextEncoder().encode(str);
    }
    const escaped = unescape(encodeURIComponent(str));
    const out = new Uint8Array(escaped.length);
    for (let i = 0; i < escaped.length; i += 1) out[i] = escaped.charCodeAt(i);
    return out;
  }

  function leftRotate(value, shift) {
    return ((value << shift) | (value >>> (32 - shift))) >>> 0;
  }

  function md5(bytes) {
    const input = Array.from(bytes);
    const bitLength = input.length * 8;
    input.push(0x80);
    while (input.length % 64 !== 56) input.push(0x00);
    for (let i = 0; i < 8; i += 1) {
      input.push(bitLength >>> (i * 8) & 0xff);
    }

    const blocks = [];
    for (let i = 0; i < input.length; i += 64) {
      blocks.push(input.slice(i, i + 64));
    }

    let a = 0x67452301;
    let b = 0xefcdab89;
    let c = 0x98badcfe;
    let d = 0x10325476;

    blocks.forEach((block) => {
      const words = [];
      for (let i = 0; i < block.length; i += 4) {
        words.push(((block[i] | (block[i + 1] << 8) | (block[i + 2] << 16) | (block[i + 3] << 24)) >>> 0));
      }
      const aa = a;
      const bb = b;
      const cc = c;
      const dd = d;

      for (let i = 0; i < 64; i += 1) {
        let f;
        let g;
        if (i < 16) {
          f = (b & c) | ((~b) & d);
          g = i;
        } else if (i < 32) {
          f = (d & b) | ((~d) & c);
          g = (5 * i + 1) % 16;
        } else if (i < 48) {
          f = b ^ c ^ d;
          g = (3 * i + 5) % 16;
        } else {
          f = c ^ (b | (~d));
          g = (7 * i) % 16;
        }
        const temp = d;
        d = c;
        c = b;
        b = (b + leftRotate((a + f + K[i] + words[g]) >>> 0, SHIFT[i])) >>> 0;
        a = temp;
      }
      a = (a + aa) >>> 0;
      b = (b + bb) >>> 0;
      c = (c + cc) >>> 0;
      d = (d + dd) >>> 0;
    });

    return [a, b, c, d].map((value) => value.toString(16).padStart(8, '0')).join('');
  }

  function hashText(text, utf8) {
    const bytes = utf8 === false ? (function(){
      const out = new Uint8Array(text.length * 2);
      for (let i = 0; i < text.length; i += 1) {
        const code = text.charCodeAt(i);
        out[i * 2] = code & 0xff;
        out[i * 2 + 1] = (code >> 8) & 0xff;
      }
      return out;
    })() : utf8ToBytes(text);
    return md5(bytes);
  }

  g.DTH_MD5 = { hashText, hashBytes: md5 };
})(window);
