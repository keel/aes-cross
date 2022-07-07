/**
Pure typescript AES

Useage:
AES.create(key).encString(srcString,options);
AES.create(key).decString(srcString,options);

options = {
    mode: 'cbc', //only cbc(default)|ecb|cfb
    iv: new Uint8Array(16), // Uint8Array[16](default) | string : length is 16
    padding: 'pkcs5', //only pkcs5(default)
    output: 'base64', //base64(default)|binary|hex
};

const aesEnc = AES.create('abcdefg123456611').encString('test aes测试 一下。 有没有',{'mode':'cbc','iv':new Uint8Array(16),'output': 'base64'});
console.log('AES测试 aesEnc', aesEnc);
const aesDec = AES.create('abcdefg123456611').decString(aesEnc);
console.log('AES测试 aesDec', aesDec);

*/

export class AES {
    private readonly NK: number;
    private readonly NR: number;
    private readonly KEY: number[];

    private static AES_NB = 4;

    private static AES_SBOX: number[] = [
        // 0     1     2     3     4     5     6     7     8     9     a     b     c     d     e     f
        0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76, // 0
        0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0, // 1
        0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15, // 2
        0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75, // 3
        0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84, // 4
        0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf, // 5
        0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8, // 6
        0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2, // 7
        0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73, // 8
        0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb, // 9
        0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79, // a
        0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08, // b
        0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a, // c
        0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e, // d
        0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf, // e
        0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16 // f
    ];

    private static AES_INVERSE_SBOX: number[] = [
        // 0     1     2     3     4     5     6     7     8     9     a     b     c     d     e     f
        0x52, 0x09, 0x6a, 0xd5, 0x30, 0x36, 0xa5, 0x38, 0xbf, 0x40, 0xa3, 0x9e, 0x81, 0xf3, 0xd7, 0xfb, // 0
        0x7c, 0xe3, 0x39, 0x82, 0x9b, 0x2f, 0xff, 0x87, 0x34, 0x8e, 0x43, 0x44, 0xc4, 0xde, 0xe9, 0xcb, // 1
        0x54, 0x7b, 0x94, 0x32, 0xa6, 0xc2, 0x23, 0x3d, 0xee, 0x4c, 0x95, 0x0b, 0x42, 0xfa, 0xc3, 0x4e, // 2
        0x08, 0x2e, 0xa1, 0x66, 0x28, 0xd9, 0x24, 0xb2, 0x76, 0x5b, 0xa2, 0x49, 0x6d, 0x8b, 0xd1, 0x25, // 3
        0x72, 0xf8, 0xf6, 0x64, 0x86, 0x68, 0x98, 0x16, 0xd4, 0xa4, 0x5c, 0xcc, 0x5d, 0x65, 0xb6, 0x92, // 4
        0x6c, 0x70, 0x48, 0x50, 0xfd, 0xed, 0xb9, 0xda, 0x5e, 0x15, 0x46, 0x57, 0xa7, 0x8d, 0x9d, 0x84, // 5
        0x90, 0xd8, 0xab, 0x00, 0x8c, 0xbc, 0xd3, 0x0a, 0xf7, 0xe4, 0x58, 0x05, 0xb8, 0xb3, 0x45, 0x06, // 6
        0xd0, 0x2c, 0x1e, 0x8f, 0xca, 0x3f, 0x0f, 0x02, 0xc1, 0xaf, 0xbd, 0x03, 0x01, 0x13, 0x8a, 0x6b, // 7
        0x3a, 0x91, 0x11, 0x41, 0x4f, 0x67, 0xdc, 0xea, 0x97, 0xf2, 0xcf, 0xce, 0xf0, 0xb4, 0xe6, 0x73, // 8
        0x96, 0xac, 0x74, 0x22, 0xe7, 0xad, 0x35, 0x85, 0xe2, 0xf9, 0x37, 0xe8, 0x1c, 0x75, 0xdf, 0x6e, // 9
        0x47, 0xf1, 0x1a, 0x71, 0x1d, 0x29, 0xc5, 0x89, 0x6f, 0xb7, 0x62, 0x0e, 0xaa, 0x18, 0xbe, 0x1b, // a
        0xfc, 0x56, 0x3e, 0x4b, 0xc6, 0xd2, 0x79, 0x20, 0x9a, 0xdb, 0xc0, 0xfe, 0x78, 0xcd, 0x5a, 0xf4, // b
        0x1f, 0xdd, 0xa8, 0x33, 0x88, 0x07, 0xc7, 0x31, 0xb1, 0x12, 0x10, 0x59, 0x27, 0x80, 0xec, 0x5f, // c
        0x60, 0x51, 0x7f, 0xa9, 0x19, 0xb5, 0x4a, 0x0d, 0x2d, 0xe5, 0x7a, 0x9f, 0x93, 0xc9, 0x9c, 0xef, // d
        0xa0, 0xe0, 0x3b, 0x4d, 0xae, 0x2a, 0xf5, 0xb0, 0xc8, 0xeb, 0xbb, 0x3c, 0x83, 0x53, 0x99, 0x61, // e
        0x17, 0x2b, 0x04, 0x7e, 0xba, 0x77, 0xd6, 0x26, 0xe1, 0x69, 0x14, 0x63, 0x55, 0x21, 0x0c, 0x7d // f
    ];

    private static AES_R: number[] = [0x02, 0x00, 0x00, 0x00];

    private static subWord(w: number[]) {
        for (let i = 0; i < 4; i++) {
            w[i] = AES.AES_SBOX[16 * ((w[i] & 0xf0) >> 4) + (w[i] & 0x0f)];
        }
    }
    private static rotWord(w: number[]) {
        let tmp = w[0];
        for (let i = 0; i < 3; i++) {
            w[i] = w[i + 1];
        }
        w[3] = tmp;
    }
    private static gmult(a: number, b: number) {
        let p = 0,
            hbs = 0;

        for (let i = 0; i < 8; i++) {
            if (b & 1) {
                p ^= a;
            }

            hbs = a & 0x80;
            a <<= 1;
            if (hbs) {
                a ^= 0x1b;
            }
            b >>= 1;
        }

        return p;
    }
    private static coefAdd(a: number[], b: number[], d: number[]) {
        d[0] = a[0] ^ b[0];
        d[1] = a[1] ^ b[1];
        d[2] = a[2] ^ b[2];
        d[3] = a[3] ^ b[3];
    }
    private static coefMult(a: number[], b: number[], d: number[]) {
        d[0] = AES.gmult(a[0], b[0]) ^ AES.gmult(a[3], b[1]) ^ AES.gmult(a[2], b[2]) ^ AES.gmult(a[1], b[3]);
        d[1] = AES.gmult(a[1], b[0]) ^ AES.gmult(a[0], b[1]) ^ AES.gmult(a[3], b[2]) ^ AES.gmult(a[2], b[3]);
        d[2] = AES.gmult(a[2], b[0]) ^ AES.gmult(a[1], b[1]) ^ AES.gmult(a[0], b[2]) ^ AES.gmult(a[3], b[3]);
        d[3] = AES.gmult(a[3], b[0]) ^ AES.gmult(a[2], b[1]) ^ AES.gmult(a[1], b[2]) ^ AES.gmult(a[0], b[3]);
    }

    constructor(key: Uint8Array) {
        if (!key) {
            throw new Error('AES requires key!');
        }
        const keyLength = key.length;

        switch (keyLength) {
            case 16:
                this.NK = 4;
                this.NR = 10;
                break;
            case 24:
                this.NK = 6;
                this.NR = 12;
                break;
            case 32:
                this.NK = 8;
                this.NR = 14;
                break;
            default:
                throw new Error('AES supports only 16, 24 and 32 bytes keys!');
        }

        this.KEY = new Array(AES.AES_NB * (this.NR + 1) * 4);
        this.expandKey(key);
    }

    static xor(a: Uint8Array, b: Uint8Array) {
        const c = new Uint8Array(a.length);
        for (let i = 0; i < c.length; i++) {
            c[i] = a[i] ^ b[i % b.length];
        }
        return c;
    }

    static hex(bytes: Uint8Array): string {
        let output = '';
        for (let i = 0; i < Uint8Array.length; i++) {
            output += Uint8Array[i].toString(16).padStart(2, '0');
        }
        return output;
    }

    static str2bytes(str: string): Uint8Array {
        const encoder = new TextEncoder();
        return encoder.encode(str);
    }

    static concat(...arg: (Uint8Array | number[])[]) {
        const length = arg.reduce((a, b) => a + b.length, 0);
        const c = new Uint8Array(length);
        let ptr = 0;
        for (let i = 0; i < arg.length; i++) {
            c.set(arg[i], ptr);
            ptr += arg[i].length;
        }
        return c;
    }

    static random_bytes(length: number): Uint8Array {
        const n = new Uint8Array(length);
        for (let i = 0; i < length; i++) n[i] = ((Math.random() * 254) | 0) + 1;
        return n;
    }


    static pad(m: Uint8Array): Uint8Array {
        const blockNumber = Math.ceil((m.length + 1) / 16);
        const paddedMessageLength = blockNumber * 16;
        const remainedLength = paddedMessageLength - m.length;
        const paddedMessage = new Uint8Array(paddedMessageLength);
        paddedMessage.set(m, 0);
        paddedMessage.set(new Array(remainedLength).fill(remainedLength), m.length);

        return paddedMessage;
    }

    static unpad(m: Uint8Array): Uint8Array {
        const lastByte = m[m.length - 1];
        return new Uint8Array(m.slice(0, m.length - lastByte));
    }

    static base64(inArr: Uint8Array): string {
        return btoa(String.fromCharCode.apply(null, inArr));
    }

    static base64_to_binary(b: string): Uint8Array {
        let binaryString = window.atob(b);
        let len = binaryString.length;
        let bytes = new Uint8Array(len);

        for (var i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
    }


    private static computeMessage(m: Uint8Array | string) {
        return typeof m === 'string' ? new TextEncoder().encode(m) : m;
    }

    private outMap = {
        base64: AES.base64,
        hex: AES.hex,
        binary: (input: Uint8Array) => input,
    }

    private inMap = {
        base64: AES.base64_to_binary,
        hex: AES.str2bytes,
        binary: (input: Uint8Array) => input,
    }

    private static blockSize: number = 16;

    private modMap = {
        cbc: {
            mEncrypt(cipher: AES, m: Uint8Array, iv: Uint8Array) {
                m = AES.pad(m);
                const output = new Uint8Array(m.length);
                let prev = iv;
                for (let i = 0; i < m.length; i += AES.blockSize) {
                    prev = cipher.encrypt(AES.xor(m.slice(i, i + AES.blockSize), prev));
                    output.set(prev, i);
                }
                return output;
            },
            mDecrypt(cipher: AES, m: Uint8Array, iv: Uint8Array) {
                const output = new Uint8Array(m.length);
                let prev = iv;
                for (let i = 0; i < m.length; i += AES.blockSize) {
                    const t = m.slice(i, i + AES.blockSize);
                    output.set(AES.xor(cipher.decrypt(t), prev), i);
                    prev = t;
                }
                return AES.unpad(output);
            }
        },
        cfb: {
            mEncrypt(cipher: AES,
                m: Uint8Array,
                iv: Uint8Array,
            ) {
                const output = new Uint8Array(m.length);
                let prev = iv;
                for (let i = 0; i < m.length; i += AES.blockSize) {
                    prev = AES.xor(m.slice(i, i + AES.blockSize), cipher.encrypt(prev));
                    output.set(prev, i);
                }
                return output;
            },
            mDecrypt(cipher: AES,
                m: Uint8Array,
                iv: Uint8Array,
            ) {
                const output = new Uint8Array(m.length);
                let prev = iv;
                for (let i = 0; i < m.length; i += AES.blockSize) {
                    const t = m.slice(i, Math.min(i + AES.blockSize, m.length));
                    output.set(AES.xor(t, cipher.encrypt(prev)), i);
                    prev = t;
                }
                return output;
            }
        },
        ecb: {
            mEncrypt(cipher: AES, m: Uint8Array) {
                m = AES.pad(m);
                if (m.length % AES.blockSize !== 0) { throw 'Message is not properly padded'; }
                const output = new Uint8Array(m.length);
                for (let i = 0; i < m.length; i += AES.blockSize) {
                    output.set(cipher.encrypt(m.slice(i, i + AES.blockSize)), i);
                }
                return output;
            },
            mDecrypt(cipher: AES, m: Uint8Array) {
                if (m.length % AES.blockSize !== 0) { throw 'Message is not properly padded'; }
                const output = new Uint8Array(m.length);
                for (let i = 0; i < m.length; i += AES.blockSize) {
                    output.set(cipher.decrypt(m.slice(i, i + AES.blockSize)), i);
                }
                return AES.unpad(output);
            }
        }
    }

    private opt = {
        mode: 'cbc',
        iv: new Uint8Array(16),
        padding: 'pkcs5', //暂不支持其他形式的padding
        output: 'base64',
    };

    public static create(key: Uint8Array | string, options ? : any): AES {
        const computedKey = AES.computeMessage(key);
        const aes: AES = new AES(computedKey);
        if (options) {
            for (const i in aes.opt) {
                if (options[i]) {
                    aes.opt[i] = options[i];
                }
            }
            if (typeof aes.opt.iv === 'string') {
                aes.opt.iv = AES.computeMessage(aes.opt.iv);
            }
        }
        return aes;
    }

    public encString(str: string) {
        const mode = this.modMap[this.opt.mode];
        if (!mode) {
            throw 'Unknown mode:' + this.opt.mode;
        }
        const outBytes = mode.mEncrypt(this, AES.computeMessage(str), this.opt.iv);
        const out = this.outMap[this.opt.output];
        return out(outBytes);
    }

    public decString(str: string) {
        const mode = this.modMap[this.opt.mode];
        if (!mode) {
            throw 'Unknown mode:' + this.opt.mode;
        }
        const inFn = this.inMap[this.opt.output];
        const outBytes = mode.mDecrypt(this, inFn(str), this.opt.iv);
        return new TextDecoder().decode(outBytes);
    }

    public encrypt(block: Uint8Array): Uint8Array {
        let state = this.createState(block);

        this.addRoundKey(state, 0);

        for (let r = 1; r < this.NR; r++) {
            this.subBytes(state);
            this.shiftRows(state);
            this.mixColumns(state);
            this.addRoundKey(state, r);
        }

        this.subBytes(state);
        this.shiftRows(state);
        this.addRoundKey(state, this.NR);

        return this.stateToResult(state);
    }

    public decrypt(block: Uint8Array): Uint8Array {
        let state = this.createState(block);

        this.addRoundKey(state, this.NR);

        for (let r = this.NR - 1; r >= 1; r--) {
            this.shiftRows(state, true);
            this.subBytes(state, true);
            this.addRoundKey(state, r);
            this.mixColumns(state, true);
        }

        this.shiftRows(state, true);
        this.subBytes(state, true);
        this.addRoundKey(state, 0);

        return this.stateToResult(state);
    }

    private createState(block: Uint8Array): Uint8Array {
        let state = new Uint8Array(4 * AES.AES_NB);

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < AES.AES_NB; j++) {
                state[AES.AES_NB * i + j] = block[i + 4 * j];
            }
        }

        return state;
    }

    private stateToResult(state: Uint8Array): Uint8Array {
        let result: Uint8Array = new Uint8Array(16);
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < AES.AES_NB; j++) {
                result[i + 4 * j] = state[AES.AES_NB * i + j];
            }
        }
        return result;
    }

    private expandKey(key: Uint8Array) {
        let tmp = new Array(4);
        const length = AES.AES_NB * (this.NR + 1);

        for (let i = 0; i < this.NK; i++) {
            this.KEY[4 * i] = key[4 * i];
            this.KEY[4 * i + 1] = key[4 * i + 1];
            this.KEY[4 * i + 2] = key[4 * i + 2];
            this.KEY[4 * i + 3] = key[4 * i + 3];
        }

        for (let i = this.NK; i < length; i++) {
            tmp[0] = this.KEY[4 * (i - 1)];
            tmp[1] = this.KEY[4 * (i - 1) + 1];
            tmp[2] = this.KEY[4 * (i - 1) + 2];
            tmp[3] = this.KEY[4 * (i - 1) + 3];

            if (i % this.NK === 0) {
                AES.rotWord(tmp);
                AES.subWord(tmp);
                AES.coefAdd(tmp, AES.roundConstant(i / this.NK), tmp);
            } else if (this.NK > 6 && i % this.NK === 4) {
                AES.subWord(tmp);
            }

            this.KEY[4 * i] = this.KEY[4 * (i - this.NK)] ^ tmp[0];
            this.KEY[4 * i + 1] = this.KEY[4 * (i - this.NK) + 1] ^ tmp[1];
            this.KEY[4 * i + 2] = this.KEY[4 * (i - this.NK) + 2] ^ tmp[2];
            this.KEY[4 * i + 3] = this.KEY[4 * (i - this.NK) + 3] ^ tmp[3];
        }
    }

    private static roundConstant(i: number) {
        if (i == 1) {
            AES.AES_R[0] = 0x01;
        } else if (i > 1) {
            AES.AES_R[0] = 0x02;
            i--;
            while (i - 1 > 0) {
                AES.AES_R[0] = AES.gmult(AES.AES_R[0], 0x02);
                i--;
            }
        }

        return AES.AES_R;
    }

    private addRoundKey(state: Uint8Array, round: number) {
        for (let c = 0; c < AES.AES_NB; c++) {
            state[c] ^= this.KEY[4 * AES.AES_NB * round + 4 * c];
            state[AES.AES_NB + c] ^= this.KEY[4 * AES.AES_NB * round + 4 * c + 1];
            state[AES.AES_NB * 2 + c] ^= this.KEY[4 * AES.AES_NB * round + 4 * c + 2];
            state[AES.AES_NB * 3 + c] ^= this.KEY[4 * AES.AES_NB * round + 4 * c + 3];
        }
    }

    private mixColumns(state: Uint8Array, inverse: boolean = false) {
        const a: number[] = inverse ? [0x0e, 0x09, 0x0d, 0x0b] : [0x02, 0x01, 0x01, 0x03];
        const col: number[] = new Array(4);
        let result: number[] = new Array(4);

        for (let j = 0; j < AES.AES_NB; j++) {
            for (let i = 0; i < 4; i++) {
                col[i] = state[AES.AES_NB * i + j];
            }
            AES.coefMult(a, col, result);
            for (let i = 0; i < 4; i++) {
                state[AES.AES_NB * i + j] = result[i];
            }
        }
    }

    private shiftRows(state: Uint8Array, inverse: boolean = false) {
        for (let i = 1; i < 4; i++) {
            let s = 0;
            while (s < i) {
                const tmp = inverse ? state[AES.AES_NB * i + AES.AES_NB - 1] : state[AES.AES_NB * i + 0];

                if (inverse) {
                    for (let k = AES.AES_NB - 1; k > 0; k--) {
                        state[AES.AES_NB * i + k] = state[AES.AES_NB * i + k - 1];
                    }

                    state[AES.AES_NB * i] = tmp;
                } else {
                    for (let k = 1; k < AES.AES_NB; k++) {
                        state[AES.AES_NB * i + k - 1] = state[AES.AES_NB * i + k];
                    }

                    state[AES.AES_NB * i + AES.AES_NB - 1] = tmp;
                }
                s++;
            }
        }
    }

    private subBytes(state: Uint8Array, inverse: boolean = false) {
        const SBOX = inverse ? AES.AES_INVERSE_SBOX : AES.AES_SBOX;
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < AES.AES_NB; j++) {
                const row = (state[AES.AES_NB * i + j] & 0xf0) >> 4;
                const col = state[AES.AES_NB * i + j] & 0x0f;
                state[AES.AES_NB * i + j] = SBOX[16 * row + col];
            }
        }
    }



}