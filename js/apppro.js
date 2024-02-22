import { Crypto, _ } from 'assets://js/lib/cat.js';

let key = 'apppro';
let HOST = '';
let UUID = '';
let APP_VER = '';
let APP_VER_NAME = '';
let APP_VER_CODE = '';
let PLAY_KEY = '';
let PLAY_IV = '';
let siteKey = '';
let siteType = 0;

const UA = 'okhttp/3.12.3';

async function request(reqUrl, data) {
    const defParam = {
        versionName: APP_VER_NAME,
        version: APP_VER,
        versionCode: APP_VER_CODE,
        uuid: UUID,
        ctime: getTime(),
    };
    let param = defParam;
    if (data) {
        param = _.merge(param, data);
    }
    const sign = signParam(param);
    param.sign = sign;
    const res = await req(reqUrl, {
        method: 'post',
        headers: {
            'User-Agent': UA,
        },
        data: param,
        postType: 'form',
    });
    return res.content;
}

function signParam(param) {
    const sortedKeys = _.keys(param).sort();
    let s = '';
    for (const key of sortedKeys){
        let value = param[sortedKeys[key]];
        if (value != undefined) {
            s += value;
        }
    }
    return md5X(s + 'alskeuscli');
}

function getTime() {
    const ts = Math.round(new Date().getTime()/1000).toString();
    return ts;
}

// cfg = {skey: siteKey, ext: extend}
async function init(cfg) {
    siteKey = cfg.skey;
    siteType = cfg.stype;
    const uuidKey = 'uuid';
    let uuid = await local.get(key, uuidKey);
    if (_.isEmpty(uuid)) {
        uuid = generateDeviceId();
        await local.set(key, uuidKey, uuid);
    }
    UUID = uuid;
    APP_VER = cfg.ext.ver;
    APP_VER_NAME = cfg.ext.vername;
    APP_VER_CODE = cfg.ext.vercode;
    PLAY_KEY = cfg.ext.key;
    PLAY_IV = cfg.ext.iv;
    HOST = cfg.ext.host;
    const config = cfg.ext.config;
    if (!_.isEmpty(config)) {
        const res = await req(config, {
            method: 'get',
            headers: {
                'User-Agent': UA,
            },
        });
        if (!_.isEmpty(res.content)) {
            HOST = host;
        }
    }
}

function generateDeviceId() {
    const chars = '0123456789abcdef';
    const uuid = [];
    for (let i = 0; i < 33; i++) {
        const randomIndex = Math.floor(Math.random() * 16);
        uuid[i] = chars.charAt(randomIndex);
    }
    return uuid.join('');
}

async function home(filter) {
    const url = HOST + '/api.php/type/get_list';
    const resp = await request(url);
    const typeData = JSON.parse(resp).data;
    const classes = _.map(typeData.list, (vObj) => {
        return {
            type_id: vObj.type_id,
            type_name: vObj.type_name,
        };
    });
    const filterConfig = {};
    _.each(typeData.list, (vObj) => {
        filterConfig[vObj.type_id] = getFilters(vObj.type_extend);
    })
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
    const year = convertTypeData(data, 'year', '年代');
    if (year) filterArray.push(year);
    const lang = convertTypeData(data, 'lang', '语言');
    if (lang) filterArray.push(lang);
    const by = {
        key: 'by',
        name: '排序',
        init: '',
        value: [
            {'n':'最新更新','v':''},
            {'n':'最多播放','v':'hits'},
            {'n':'最高评分','v':'score'},
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

async function category(tid, pg, filter, extend) {
    if (pg <= 0) pg = 1;
    const limit = 20;
    const param = {
        type_id: tid,
        vod_name: '',
        vod_class: extend.class || '',
        vod_area: extend.area || '',
        vod_year: extend.year || '',
        vod_lang: extend.lang || '',
        orderby: extend.by || '',
        page: pg,
        limit: limit,
    };
    const url = HOST + '/api.php/video/get_list';
    const resp = await request(url, param);
    const cateData = JSON.parse(resp).data;
    const videos = _.map(cateData.list, (vObj) => {
        return {
            vod_id: vObj.vod_id,
            vod_name: vObj.vod_name,
            vod_pic: vObj.vod_pic,
            vod_remarks: vObj.vod_remarks,
        };
    });
    const page = parseInt(pg);
    const hasMore = pg * limit < cateData.count;
    const pagecount = hasMore ? page + 1 : page;
    return {
        page: page,
        pagecount: pagecount,
        limit: limit,
        total: pagecount * limit,
        list: videos,
    };
}

async function detail(id) {
    const url = HOST + '/api.php/video/get_detail';
    const param = {
        vod_id: id,
    };
    const resp = await request(url, param);
    const detailData = JSON.parse(resp).data;
    const vObj = detailData;
    const vodAtom = {
        vod_id: id,
        vod_name: vObj.vod_name,
        vod_pic: vObj.vod_pic,
        type_name: vObj.vod_class,
        vod_year: vObj.vod_year,
        vod_area: vObj.vod_area,
        vod_remarks: vObj.vod_remarks,
        vod_actor: vObj.vod_actor,
        vod_director: vObj.vod_director,
        vod_content: vObj.vod_content,
    }
    const playInfo = vObj.player;
    const playVod = {};
    for (const ep of playInfo) {
        const sourceName = ep.name;
        const playerCode = ep.code;
        const url = HOST + '/api.php/video/get_player';
        const param = {
            vod_id: id,
            player: playerCode,
            limit: 5000,
            page: 1,
        };
        const resp = await request(url, param);
        const playData = JSON.parse(resp).data;
        const vodItems = _.map(playData.list, (obj) => {
            const epName = obj.drama;
            const playUrl = obj.ju_id + '|' + obj.plyer + '|' + obj.video_id;
            return epName + '$' + playUrl;
        });
        if (_.isEmpty(vodItems)) return;
        const playList = vodItems.join('#');
        playVod[sourceName] = playList;
    }
    vodAtom.vod_play_from = _.keys(playVod).join('$$$');
    vodAtom.vod_play_url = _.values(playVod).join('$$$');
    return {
        list: [vodAtom],
    };
}

async function play(flag, id, flags) {
    const playData = id.split('|');
    const juId = playData[0];
    const playerId = playData[1];
    const videoId = playData[2];
    const url = HOST + '/api.php/video/get_definition';
    const param = {
        player_id: playerId,
        ju_id: juId,
        vod_id: videoId,
    };
    const resp = await request(url, param);
    const parseData = JSON.parse(resp).data;
    let playUrl = parseData[0].url.trim();
    if (!_.isEmpty(PLAY_KEY) && !_.isEmpty(PLAY_IV)) {
        playUrl = decryptUrl(playUrl);
    }
    return {
        parse: 0,
        url: playUrl,
    };
}

function decryptUrl(url) {
    const key = Crypto.enc.Hex.parse(PLAY_KEY);
    const iv = Crypto.enc.Utf8.parse(PLAY_IV);
    const decrypted = Crypto.AES.decrypt(url, key, {
        iv: iv,
        mode: Crypto.mode.CBC,
        padding: Crypto.pad.Pkcs7
    });
    return decrypted.toString(Crypto.enc.Utf8);
}

async function search(wd, quick, pg) {
    if (pg <= 0) pg = 1;
    const limit = 20;
    const url = HOST + '/api.php/video/get_list';
    const param = {
        vod_name: wd,
        vod_class: '',
        vod_area: '',
        vod_year: '',
        vod_lang: '',
        orderby: '',
        page: pg,
        limit: limit,
    };
    const resp = await request(url, param);
    const searchData = JSON.parse(resp).data;
    const videos = _.map(searchData.list, (vObj) => {
        return {
            vod_id: vObj.vod_id,
            vod_name: vObj.vod_name,
            vod_pic: vObj.vod_pic,
            vod_remarks: vObj.vod_remarks,
        };
    });
    const page = parseInt(pg);
    const hasMore = pg * limit < searchData.count;
    const pagecount = hasMore ? page + 1 : page;
    return {
        page: page,
        pagecount: pagecount,
        limit: limit,
        total: pagecount * limit,
        list: videos,
    };
}

export function __jsEvalReturn() {
    return {
        init: init,
        home: home,
        category: category,
        detail: detail,
        play: play,
        search: search,
    };
}