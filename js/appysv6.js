import { load, _ } from 'assets://js/lib/cat.js';

let key = 'appysv6';
let HOST = '';
let PUBLIC_KEY = '';
let parseMap = {};
let siteKey = '';
let siteType = 0;

const UA = 'Dart/2.18 (dart:io)';

async function request(reqUrl) {
    const param = {
        method: 'get',
        headers: {
            'user-agent': UA,
            'accept-encoding': 'gzip',
        },
    };
    const res = await req(reqUrl, param);
    return res.content;
}

// cfg = {skey: siteKey, ext: extend}
async function init(cfg) {
    siteKey = cfg.skey;
    siteType = cfg.stype;
    let url = cfg.ext.url;
    const api = cfg.ext.api;
    const config = cfg.ext.config;
    if (!_.isEmpty(config)) {
        try {
            const cfg = await request(config);
            const urlCfg = JSON.parse(cfg);
            if (urlCfg && !_.isEmpty(urlCfg)) {
                url = urlCfg[0];
            }
        } catch(e) {
        }
    }
    HOST = url + api;
    PUBLIC_KEY = cfg.ext.publicKey;
}

async function home(filter) {
    const csrf = generateCsrf();
    const resp = await request(HOST + '/nav?token=&csrf=' + csrf);
    const typeList = JSON.parse(resp).data;
    const filterConfig = {};
    const classes = _.map(typeList, (vObj) => {
        filterConfig[vObj.type_id] = getFilters(vObj.type_extend);
        return {
            type_id: vObj.type_id,
            type_name: vObj.type_name,
        };
    });
    return {
        class: classes,
        filters: filterConfig,
    };
}

function generateCsrf() {
    if (_.isEmpty(PUBLIC_KEY)) {
        return '';
    }
    const timestamp = new Date().getTime().toString();
    return rsaX('RSA/PKCS1', true, true, timestamp, false, PUBLIC_KEY, true);
}

function getFilters(data) {
    if (!data) return;
    const filterArray = [];
    const clazz = convertTypeData(data, 'class', '类型');
    if (clazz) filterArray.push(clazz);
    const area = convertTypeData(data, 'area', '地区');
    if (area) filterArray.push(area);
    const year = convertTypeData(data, 'year', '年份');
    if (year) filterArray.push(year);
    const lang = convertTypeData(data, 'lang', '语言');
    if (lang) filterArray.push(lang);
    const order = {
        key: 'order',
        name: '排序',
        value: [
            {'n':'最新','v':'time'},
            {'n':'最热','v':'hits'},
            {'n':'好评','v':'score'},
        ]
    };
    filterArray.push(order);
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

async function homeVod() {}

async function category(tid, pg, filter, extend) {
    if (pg <= 0) pg = 1;
    const csrf = generateCsrf();
    const url = HOST + '/video?' + 'pg=' + pg + '&tid=' + tid + '&class=' + (extend.class || '') + '&area=' + (extend.area || '') + '&lang=' + (extend.lang || '') + '&year=' + (extend.year || '') + '&order=' + (extend.order || '') + '&token=&csrf=' + csrf;
    const resp = await request(url);
    const cateData = JSON.parse(resp);
    const videos = _.map(cateData.data, (vObj) => {
        return {
            vod_id: vObj.vod_id,
            vod_name: vObj.vod_name,
            vod_pic: vObj.vod_pic,
            vod_remarks: vObj.vod_remarks,
        };
    });
    const page = parseInt(pg);
    return {
        page: page,
        pagecount: cateData.pagecount,
        limit: cateData.limit,
        total: cateData.total,
        list: videos,
    };
}

async function detail(id) {
    const csrf = generateCsrf();
    const url = HOST + '/video_detail?id=' + id + '&ck=&csrf=' + csrf;
    const resp = await request(url);
    const detailData = JSON.parse(resp);
    const vObj = detailData.data.vod_info;
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
    const playInfo = vObj.vod_url_with_player;
    const playVod = {};
    _.each(playInfo, (obj) => {
        const sourceName = obj.name;
        const parse = obj.parse_api || '';
        if (!_.isEmpty(parse)) parseMap[sourceName] = parse;
        playVod[sourceName] = obj.url;
    });
    vodAtom.vod_play_from = _.keys(playVod).join('$$$');
    vodAtom.vod_play_url = _.values(playVod).join('$$$');
    return {
        list: [vodAtom],
    };
}

async function play(flag, id, flags) {
    let playUrl = id;
    const parseUrl = parseMap[flag];
    if (parseUrl) {
        const reqUrl = parseUrl + playUrl;
        const resp = await request(reqUrl);
        const json = JSON.parse(resp);
        if (!_.isEmpty(json.url)) {
            playUrl = json.url;
        }
    }
    return {
        parse: 0,
        url: playUrl,
        header: {
            'Icy-MetaData': '1',
        },
    };
}

async function search(wd, quick, pg) {
    const csrf = generateCsrf();
    const url = HOST + '/search?pg=' + pg + '&tid=0&text=' + wd + '&token=&csrf=' + csrf;
    const resp = await request(url);
    const searchData = JSON.parse(resp);
    const videos = _.map(searchData.data, (vObj) => {
        return {
            vod_id: vObj.vod_id,
            vod_name: vObj.vod_name,
            vod_pic: vObj.vod_pic,
            vod_remarks: vObj.vod_remarks,
        };
    });
    const page = parseInt(pg);
    return {
        page: page,
        pagecount: parseInt(searchData.total / searchData.limit),
        limit: searchData.limit,
        total: searchData.total,
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