import { Crypto, load, _ } from 'assets://js/lib/cat.js';

let key = 'getapp';
let HOST = '';
let SECRET_KEY = '';
let APP_VER = '';
let DEVICE_ID = '';
let siteKey = '';
let siteType = 0;
let parseMap = {};

const UA = 'okhttp/3.14.9';

async function request(reqUrl, data) {
    const param = {
        method: 'post',
        headers: {
            'User-Agent': UA,
            'app-version-code': APP_VER,
            'app-user-device-id': DEVICE_ID,
        },
    };
    if (data) {
        param.data = data;
        param.postType = 'form';
    } else {
        param.data = {};
    }
    const res = await req(reqUrl, param);
    return res.content;
}

// cfg = {skey: siteKey, ext: extend}
async function init(cfg) {
    siteKey = cfg.skey;
    siteType = cfg.stype;
    HOST = cfg.ext.host;
    SECRET_KEY = cfg.ext.key;
    APP_VER = cfg.ext.ver;
    const deviceKey = 'deviceId';
    let deviceId = await local.get(key, deviceKey);
    if (_.isEmpty(deviceId)) {
        deviceId = generateDeviceId();
        await local.set(key, deviceKey, deviceId);
    }
    DEVICE_ID = deviceId;
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
    const resp = await request(HOST + '/api.php/getappapi.index/init');
    const configData = JSON.parse(decrypt(JSON.parse(resp).data));
    const typeList = configData.type_list.filter((vObj) => {
        return vObj.type_id != 0;
    });
    const filterConfig = {};
    const classes = _.map(typeList, (vObj) => {
        filterConfig[vObj.type_id] = getFilters(vObj.type_extend);
        return {
            type_id: vObj.type_id,
            type_name: vObj.type_name,
        };
    });
    const videos = _.map(configData.recommend_list, (vObj) => {
        return {
            vod_id: vObj.vod_id,
            vod_name: vObj.vod_name,
            vod_pic: vObj.vod_pic,
            vod_remarks: vObj.vod_remarks,
        };
    });
    return {
        class: classes,
        filters: filterConfig,
        list: videos,
    };
}

function getFilters(filterStr) {
    if (!filterStr) return;
    const data = JSON.parse(filterStr);
    const filterArray = [];
    const clazz = convertTypeData(data, 'class', '类型');
    if (clazz) filterArray.push(clazz);
    const area = convertTypeData(data, 'area', '地区');
    if (area) filterArray.push(area);
    const year = convertTypeData(data, 'year', '年份');
    if (year) filterArray.push(year);
    const lang = convertTypeData(data, 'lang', '语言');
    if (lang) filterArray.push(lang);
    const sort = {
        key: 'sort',
        name: '排序',
        value: [
            {'n':'最新','v':'最新'},
            {'n':'最热','v':'最热'},
            {'n':'最赞','v':'最赞'},
        ]
    };
    filterArray.push(sort);
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
        v: '全部',
    });
    const typeClass = {
        key: typeKey,
        name: typeName,
        init: '全部',
        value: values,
    };
    return typeClass;
}

function decrypt(text, cfgKey = SECRET_KEY, cfgIv = SECRET_KEY) {
    const data = {
        ciphertext: Crypto.enc.Base64.parse(text),
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

async function homeVod() {}

async function category(tid, pg, filter, extend) {
    if (pg <= 0) pg = 1;
    let param = {
        type_id: tid,
        page: pg,
    };
    let api, prop, limit;
    if (extend.class || extend.area || extend.year || extend.lang || extend.sort) {
        api = 'typeFilterVodList';
        prop = 'recommend_list';
        limit = 30;
        param = Object.assign(param, extend);
    } else {
        api = 'rankList';
        prop = 'rank_list';
        limit = 20;
    }
    const resp = await request(HOST + '/api.php/getappapi.index/' + api, param);
    const cateData = JSON.parse(decrypt(JSON.parse(resp).data));
    const videos = _.map(cateData[prop], (vObj) => {
        return {
            vod_id: vObj.vod_id,
            vod_name: vObj.vod_name,
            vod_pic: vObj.vod_pic,
            vod_remarks: vObj.vod_remarks,
        };
    });
    const hasMore = videos.length == limit;
    const page = parseInt(pg);
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
    const param = {
        vod_id: id,
    };
    const resp = await request(HOST + '/api.php/getappapi.index/vodDetail', param);
    const detailData = JSON.parse(decrypt(JSON.parse(resp).data));
    const vObj = detailData.vod;
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
    }
    const playInfo = detailData.vod_play_list;
    const playVod = {};
    _.each(playInfo, (obj) => {
        if (obj.player_info.parse_type == 2) return;
        const sourceName = obj.player_info.show;
        const parse = obj.player_info.parse || '';
        parseMap[sourceName] = parse;
        let playList = '';
        const videoInfo = obj.urls;
        const vodItems = _.map(videoInfo, (epObj) => {
            const epName = epObj.name;
            const playUrl = epObj.url;
            return epName + '$' + playUrl;
        });
        if (_.isEmpty(vodItems)) return;
        playList = vodItems.join('#');
        playVod[sourceName] = playList;
    });
    vodAtom.vod_play_from = _.keys(playVod).join('$$$');
    vodAtom.vod_play_url = _.values(playVod).join('$$$');
    return {
        list: [vodAtom],
    };
}

async function play(flag, id, flags) {
    let playUrl = id;
    const parse = parseMap[flag];
    if (!_.isEmpty(parse)) {
        const resp = await req(parse + playUrl, {
            method: 'get',
        });
        let json;
        try {
            json = JSON.parse(resp.content);
        } catch(e) {
        }
        if (json) {
            if (!_.isEmpty(json.url)) playUrl = json.url;
            if (json.data && !_.isEmpty(json.data.url)) playUrl = json.data.url;
        }
    }
    return {
        parse: 0,
        url: playUrl,
    };
}

async function search(wd, quick, pg) {
    const param = {
        keywords: wd,
        page: pg,
    };
    const resp = await request(HOST + '/api.php/getappapi.index/searchList', param);
    const searchData = JSON.parse(decrypt(JSON.parse(resp).data));
    const videos = _.map(searchData.search_list, (vObj) => {
        return {
            vod_id: vObj.vod_id,
            vod_name: vObj.vod_name,
            vod_pic: vObj.vod_pic,
            vod_remarks: vObj.vod_remarks,
        };
    });
    const limit = 10;
    const hasMore = videos.length == limit;
    const page = parseInt(pg);
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
        homeVod: homeVod,
        category: category,
        detail: detail,
        play: play,
        search: search,
    };
}