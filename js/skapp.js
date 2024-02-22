import { Crypto, _ } from 'assets://js/lib/cat.js';

let key = 'skapp';
let IV = '';
let KEY = '';
let TOKEN = '';
let HOST = '';
let ENCRYPTION = true;
let AUTH;
let siteKey = '';
let siteType = 0;

const UA = 'Dart/2.19 (dart:io)';

async function request(reqUrl, auth, method, data) {
    const headers = {
        'User-Agent': UA,
    };
    if (!_.isEmpty(TOKEN)) {
        headers['token'] = TOKEN;
    }
    if (auth) {
        headers['Authorization'] = 'Bearer ' + auth;
    }
    if (method == 'post') {
        headers['Content-Type'] = 'application/json';
    }
    const res = await req(reqUrl, {
        method: method || 'get',
        headers: headers,
        data: data,
    });
    return res.content;
}

// cfg = {skey: siteKey, ext: extend}
async function init(cfg) {
    siteKey = cfg.skey;
    siteType = cfg.stype;
    KEY = cfg.ext.key;
    IV = cfg.ext.iv;
    TOKEN = cfg.ext.token;
    HOST = cfg.ext.url;
    if (_.isEmpty(KEY) || _.isEmpty(IV)) {
        ENCRYPTION = false;
    }
    const config = cfg.ext.config;
    if (!_.isEmpty(config)) {
        try {
            const cfg = await request(config);
            const content = ENCRYPTION ? decrypt(cfg) : cfg;
            if (!_.isEmpty(content)) {
                let urlCfg = '';
                try {
                    urlCfg = JSON.parse(content);
                    if (urlCfg && !_.isEmpty(urlCfg.list)) {
                        HOST = urlCfg.list;
                    }
                } catch(e) {
                    const matches = content.match(/.*\/\/.*/g);
                    if (!_.isEmpty(matches)) {
                        HOST = content;
                    }
                }
            }
        } catch(e) {
        }
    }
    const sign = cfg.ext.sign;
    if (!_.isEmpty(sign)) {
        const cfgUrl = HOST + '/get_config';
        const postData = { 
            sign: sign,
            ck: getCk(HOST),
        };
        const resp = await request(cfgUrl, undefined, 'post', JSON.stringify(postData));
        const auth = ENCRYPTION ? decrypt(resp) : resp;
        AUTH = auth;
    }
}

function getCk(text) {
    let data = `${text}##5843##${new Date().getTime()}##ckzmbc`;
    data = base64Encode(data);
    data = data.replaceAll('\n', '');
    data = base64Encode(data);
    data = data.replaceAll('\n', '');
    const key = Crypto.enc.Utf8.parse('ygcnbcrvaervztmw');
    const iv = Crypto.enc.Utf8.parse('1212164105143708');
    const encrypt = Crypto.AES.encrypt(data, key, {
        iv: iv,
        mode: Crypto.mode.CBC,
        padding: Crypto.pad.Pkcs7
    });
    const hex = encrypt.ciphertext.toString(Crypto.enc.Hex);
    const ck = base64Encode(hex);
    return ck.replaceAll('\n', '');
}

function base64Encode(text) {
    return Crypto.enc.Base64.stringify(Crypto.enc.Utf8.parse(text));
}

function decrypt(text, cfgKey = KEY, cfgIv = IV) {
    const str = text.replace('FROMSKZZJM', '');
    const data = {
        ciphertext: Crypto.enc.Hex.parse(str),
    };
    const key = Crypto.enc.Utf8.parse(cfgKey);
    const iv = Crypto.enc.Utf8.parse(cfgIv);
    const decrypted = Crypto.AES.decrypt(data, key, {
        iv: iv,
        mode: Crypto.mode.CBC,
        padding: Crypto.pad.Pkcs7
    });
    return Crypto.enc.Utf8.stringify(decrypted);
}

async function home(filter) {
    const url = HOST + '/sk-api/type/list';
    const resp = await request(url, AUTH);
    const content = ENCRYPTION ? decrypt(resp) : resp;
    const json = JSON.parse(content);
    const classes = _.map(json.data, (item)=> {
        return {
            type_id: item.type_id,
            type_name: item.type_name,
        };
    });
    const filterConfig = {};
    for (const clazz of classes) {
        const typeUrl = HOST + '/sk-api/type/alltypeextend?typeId=' + clazz.type_id;
        const typeRsp = await request(typeUrl, AUTH);
        const typeData = ENCRYPTION ? decrypt(typeRsp) : typeRsp;
        const typeJson = JSON.parse(typeData);
        const filterArray = getFilters(typeJson.data);
        filterConfig[clazz.type_id] = filterArray;
    }
    return {
        class: classes,
        filters: filterConfig,
    };
}

function getFilters(data) {
    const filterArray = [];
    const clazz = convertTypeData(data, 'class', '类型');
    if (clazz) filterArray.push(clazz);
    const area = convertTypeData(data, 'area', '地区');
    if (area) filterArray.push(area);
    const year = convertTypeData(data, 'year', '年份');
    if (year) filterArray.push(year);
    const lang = convertTypeData(data, 'lang', '语言');
    if (lang) filterArray.push(lang);
    const by = {
        key: 'by',
        name: '排序',
        value: [
            {'n':'最新','v':'updateTime'},
            {'n':'人气','v':'hot'},
            {'n':'评分','v':'score'},
        ]
    };
    filterArray.push(by);
    return filterArray;
}

function convertTypeData(typeData, typeKey, typeName) {
    if (!typeData || !typeData[typeKey] || _.isEmpty(typeData[typeKey])) {
        return null;
    }
    let valueList = typeData[typeKey].split(',');
    const values = _.map(valueList, (item) => {
        return {
            n: item,
            v: item,
        };
    });
    values.unshift({
        n: '全部',
        v: '',
    });
    const typeClass = {
        key: typeKey,
        name: typeName,
        init: '',
        value: values,
    };
    return typeClass;
}

async function homeVod() {
    const vUrl = HOST + '/sk-api/vod/list?page=1&limit=12&type=randomlikeindex&area=&lang=&year=&mtype';
    const resp = await request(vUrl, AUTH);
    const homeResult = ENCRYPTION ? decrypt(resp) : resp;
    const json = JSON.parse(homeResult);
    const jsonArray = json.data;
    const videos = _.map(jsonArray, (obj) => {
        return {
            vod_id: obj.vod_id,
            vod_name: obj.vod_name,
            vod_pic: obj.vod_pic,
            vod_remarks: obj.vod_remarks,
        };
    });
    return {
        list: videos,
    };
}

async function category(tid, pg, filter, extend) {
    const limit = 18;
    const url = HOST + '/sk-api/vod/list?typeId=' + tid + '&page=' + pg + '&limit=' + limit + '&type=' + (extend.by || '') + '&area=' + (extend.area || '') + '&lang=' + (extend.lang || '') + '&year=' + (extend.year || '') + '&mtype=&extendtype=' + (extend.class || '');
    const resp = await request(url, AUTH);
    const cateResult = ENCRYPTION ? decrypt(resp) : resp;
    const json = JSON.parse(cateResult);
    const jsonArray = json.data;
    const videos = _.map(jsonArray, (vObj) => {
        return {
            vod_id: vObj.vod_id,
            vod_name: vObj.vod_name,
            vod_pic: vObj.vod_pic,
            vod_remarks: vObj.vod_remarks,
        };
    });
    const page = parseInt(pg);
    let pageCount = page;
    if (jsonArray.length == limit) {
        pageCount = page + 1;
    }
    return {
        page: page,
        pagecount: pageCount,
        limit: limit,
        total: pageCount,
        list: videos,
    };
}

async function detail(id) {
    const url = HOST + '/sk-api/vod/one?vodId=' + id;
    const resp = await request(url, AUTH);
    const detailResult = ENCRYPTION ? decrypt(resp) : resp;
    const json = JSON.parse(detailResult);
    const vObj = json.data;
    const vodAtom = {
        vod_id: id,
        vod_name: vObj.vod_name,
        vod_pic: vObj.vod_pic,
        vod_year: vObj.vod_year,
        vod_area: vObj.vod_area,
        vod_remarks: vObj.vod_remarks,
        vod_actor: vObj.vod_actor,
        vod_director: vObj.vod_director,
        vod_content: vObj.vod_content.replaceAll(/<\/?[^>]+>/g, '').trim(),
        vod_play_from: vObj.vod_play_from,
        vod_play_url: vObj.vod_play_url,
    }
    return {
        list: [vodAtom],
    };
}

async function play(flag, id, flags) {
    let playUrl = id;
    if (!isVideoFormat(id)) {
        const url = HOST + '/sk-api/vod/skjson?url=' + id + '&skjsonindex=0';
        const resp = await request(url, AUTH);
        const parseResult = ENCRYPTION ? decrypt(resp) : resp;
        const json = JSON.parse(parseResult);
        playUrl = json.data.url;
    }
    return {
        parse: 0,
        url: playUrl,
    };
}

const snifferMatch = /http((?!http).){26,}?\.(m3u8|mp4|flv|avi|mkv|rm|wmv|mpg)\?.*|http((?!http).){26,}\.(m3u8|mp4|flv|avi|mkv|rm|wmv|mpg)|http((?!http).){26,}\/m3u8\?pt=m3u8.*|http((?!http).)*?default\.ixigua\.com\/.*|http((?!http).)*?cdn-tos[^\?]*|http((?!http).)*?\/obj\/tos[^\?]*|http.*?\/player\/m3u8play\.php\?url=.*|http.*?\/player\/.*?[pP]lay\.php\?url=.*|http.*?\/playlist\/m3u8\/\?vid=.*|http.*?\.php\?type=m3u8&.*|http.*?\/download.aspx\?.*|http.*?\/api\/up_api.php\?.*|https.*?\.66yk\.cn.*|http((?!http).)*?netease\.com\/file\/.*/;

function isVideoFormat(url) {
    if (snifferMatch.test(url)) {
        return !url.includes('cdn-tos') || !url.includes('.js');
    }
    return false;
}

async function search(wd, quick, pg) {
    const limit = 12;
    const url = HOST + '/sk-api/search/pages?keyword=' + encodeURIComponent(wd) + '&page=' + pg + '&limit=' + limit + '&typeId=-1';
    const resp = await request(url, AUTH);
    const searchResult = ENCRYPTION ? decrypt(resp) : resp;
    const json = JSON.parse(searchResult);
    const jsonArray = json.data;
    const videos = _.map(jsonArray, (vObj) => {
        return {
            vod_id: vObj.vod_id,
            vod_name: vObj.vod_name,
            vod_pic: vObj.vod_pic,
            vod_remarks: vObj.vod_remarks,
        };
    });
    const page = parseInt(pg);
    let pageCount = page;
    if (jsonArray.length == limit) {
        pageCount = page + 1;
    }
    return {
        page: page,
        pagecount: pageCount,
        limit: limit,
        total: pageCount,
        list: videos,
    };
}

export function __jsEvalReturn() {
    return {
        init: init,
        home: home,
        homeVod: homeVod,
        category: category,
        detail: detail,
        play: play,
        search: search,
    };
}