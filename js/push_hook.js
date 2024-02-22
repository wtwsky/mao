import { Crypto } from 'assets://js/lib/cat.js';
import { __jsEvalReturn as fromEval } from './push_open.js';

let originJs;

// cfg = {skey: siteKey, ext: extend}
async function init(cfg) {
    hook();
    originJs = fromEval();
    const keys = Object.keys(originJs);
    console.debug("originJs: " + JSON.stringify(keys));
    const ret = await originJs.init(cfg);
    // console.debug(ret);
    return ret;
}

function hook() {
    const aesEncrypt = Crypto.AES.encrypt;
    Crypto.AES.encrypt = function(text, key, cfg) {
        console.debug("AES encrypt called: " + text + "," + key + "," + cfg);
        return aesEncrypt(text, key, cfg);
    };
    const aesDecrypt = Crypto.AES.decrypt;
    Crypto.AES.decrypt = function(text, key, cfg) {
        console.debug("AES decrypt called: " + text + "," + key + "," + cfg);
        return aesDecrypt(text, key, cfg);
    };
    const utf8Parse = Crypto.enc.Utf8.parse;
    Crypto.enc.Utf8.parse = function(text) {
        console.debug("UTF8 parse called: " + text);
        return utf8Parse(text);
    };
    const utf8Stringify = Crypto.enc.Utf8.stringify;
    Crypto.enc.Utf8.stringify = function(text) {
        console.debug("UTF8 stringify called: " + text);
        return utf8Stringify(text);
    };
    const base64Parse = Crypto.enc.Base64.parse;
    Crypto.enc.Base64.parse = function(text) {
        console.debug("Base64 parse called: " + text);
        return base64Parse(text);
    };
    const base64Stringify = Crypto.enc.Base64.stringify;
    Crypto.enc.Base64.stringify = function(text) {
        console.debug("Base64 stringify called: " + text);
        return base64Stringify(text);
    };
    const hexParse = Crypto.enc.Hex.parse;
    Crypto.enc.Hex.parse = function(text) {
        console.debug("Hex parse called: " + text);
        return hexParse(text);
    };
    const hexStringify = Crypto.enc.Hex.stringify;
    Crypto.enc.Hex.stringify = function(text) {
        console.debug("Hex stringify called: " + text);
        return hexStringify(text);
    };
    const md5Y = md5X;
    md5X = function(text) {
        console.debug("md5X called: " + text);
        return md5Y(text);
    };
    const rsaY = rsaX;
    rsaX = function(mode, pub, encrypt, input, inBase64, key, outBase64) {
        console.debug("rsaX called1: " + mode + "," + pub + "," + encrypt + "," + input);
        console.debug("rsaX called2: " + inBase64 + "," + key + "," + outBase64);
        let ret;
        try {
            ret = rsaY(mode, pub, encrypt, input, inBase64, key, outBase64);
        } catch(e) {
            console.debug("rsaX exception:" + e);
        }
        console.debug("rsaX result: " + ret);
        return ret;
    };
    const aesY = aesX;
    aesX = function(mode, encrypt, input, inBase64, key, iv, outBase64) {
        console.debug("aesX called1: " + mode + "," + encrypt + "," + input + "," + iv);
        console.debug("aesX called2: " + inBase64 + "," + key + "," + outBase64);
        let ret;
        try {
            ret = aesY(mode, encrypt, input, inBase64, key, iv, outBase64);
        } catch(e) {
            console.debug("aesX exception:" + e);
        }
        console.debug("aesX result: " + ret);
        return ret;
    };
    const desY = desX;
    desX = function(mode, encrypt, input, inBase64, key, iv, outBase64) {
        console.debug("desX called1: " + mode + "," + encrypt + "," + input + "," + iv);
        console.debug("desX called2: " + inBase64 + "," + key + "," + outBase64);
        let ret;
        try {
            ret = desY(mode, encrypt, input, inBase64, key, iv, outBase64);
        } catch(e) {
            console.debug("desX exception:" + e);
        }
        console.debug("desX result: " + ret);
        return ret;
    };
}

async function support(id) {
    let ret;
    console.debug("support param: " + id);
    try {
        ret = await originJs.support(id);
    } catch(e) {
        console.debug("support err: " + e);
    }
    console.debug("support ret: " + ret);
    return ret;
}

async function detail(id) {
    let ret;
    console.debug("detail param: " + id);
    try {
        ret = await originJs.detail(id);
    } catch(e) {
        console.debug("detail err: " + e);
    }
    console.debug("detail ret: " + ret);
    return ret;
}

async function play(flag, id, flags) {
    let ret;
    console.debug("play param: " + id);
    try {
        ret = await originJs.play(flag, id, flags);
    } catch(e) {
        console.debug("play err: " + e);
    }
    console.debug("play ret: " + ret);
    return ret;
}

async function search(wd, quick, pg) {
    let ret;
    try {
        ret = await originJs.search(wd, quick, pg);
    } catch(e) {
        console.debug("search err: " + e);
    }
    console.debug("search ret: " + ret);
    return ret;
}

export function __jsEvalReturn() {
    return {
        init: init,
        support: support,
        detail: detail,
        play: play,
        search: search,
    };
}