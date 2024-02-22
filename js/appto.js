import { Crypto, _ } from 'assets://js/lib/cat.js';

let key = 'appto';
let IV = '1238389483762837';
let KEY = '';
let IC = '';
let TOKEN = '';
let API = '';
let URL = '';
let CONFIGURL = '';
let UA;
let parseLabs = {};
let classes = [];
let filters = {};
let siteKey = '';
let siteType = 0;

const DEF_UA = 'Dart/2.19 (dart:io)';

async function request(reqUrl, method, data) {
    const headers = {
        'User-Agent': UA || DEF_UA,
    };
    if (!_.isEmpty(TOKEN)) {
        headers['token'] = TOKEN;
    }
    const res = await req(reqUrl, {
        method: method || 'get',
        headers: headers,
        data: data,
        postType: method === 'post' ? 'form' : '',
        timeout: 20000,
    });
    return res.content;
}

// cfg = {skey: siteKey, ext: extend}
async function init(cfg) {
    siteKey = cfg.skey;
    siteType = cfg.stype;
    KEY = cfg.ext.key;
    IC = cfg.ext.ic;
    TOKEN = cfg.ext.token;
    API = cfg.ext.api;
    URL = cfg.ext.url.replace(/\/$/, '');
    let config = cfg.ext.config;
    if (!_.isEmpty(config)) {
        try {
            const cfg = await request(config);
            const urlCfg = JSON.parse(cfg);
            if (urlCfg && !_.isEmpty(urlCfg.domain)) {
                URL = urlCfg.domain.replace(/\/$/, '');
            }
        } catch(e) {
        }
    }
    CONFIGURL = cfg.ext.configurl;
    if (_.isEmpty(CONFIGURL)) {
        CONFIGURL = API + '/config/get?p=android';
    }
    UA = cfg.ext.ua;
    const url = URL + CONFIGURL;
    const content = await request(url);
    const json = JSON.parse(content);
    let jsonData = json.data;
    if (json.ENCRYPTION) {
        jsonData = JSON.parse(decrypt(json.data));
    }
    let getParsingArray;
    if (CONFIGURL.includes('v5') || CONFIGURL.includes('v2')) {
        getParsingArray = jsonData.get_parsing.lists;
    } else {
        getParsingArray = jsonData.get_parsing;
    }
    _.each(getParsingArray, (item) => {
        if (_.isEmpty(item.config)) return;
        const key = item.key;
        const labels = _.map(item.config, (labItem) => {
            return labItem.label;
        });
        parseLabs[key] = labels;
    });
    const getTypeArray = jsonData.get_type;
    const filterConfig = {};
    classes = _.map(getTypeArray, (vObj) => {
        filterConfig[vObj.type_id] = getFilters(vObj.type_extend);
        return {
            type_id: vObj.type_id,
            type_name: vObj.type_name,
        };
    });
    filters = filterConfig;
}

function decrypt(text, cfgKey = KEY, cfgIv = IV) {
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
        init: 'time',
        value: [
            {'n':'时间','v':'time'},
            {'n':'人气','v':'hits'},
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

async function home(filter) {
    return {
        class: classes,
        filters: filters,
    };
}

async function homeVod() {
    const videos = [];
    let vUrl = '';
    if (CONFIGURL.includes('v5')) {
        vUrl = URL + API + '/home/data?id=1&mold=1';
    } else if (CONFIGURL.includes('v2')) {
        vUrl = URL + API + '/home/cateData?id=1';
    } else {
        vUrl = URL + API + '/home/cateData?id=6';
    }
    const homeResult = await request(vUrl);
    const json = JSON.parse(homeResult);
    let jsonData = json.data;
    if (json.ENCRYPTION) {
        jsonData = JSON.parse(decrypt(json.data));
    }
    const jsonArray = jsonData.sections;
    _.each(jsonArray, (item) => {
        const objArr = item.items;
        _.each(objArr, (obj) => {
            const v = {
                vod_id: obj.vod_id,
                vod_name: obj.vod_name,
                vod_pic: fixPic(obj.vod_pic),
                vod_remarks: obj.vod_remarks,
            };
            videos.push(v);
        });
    });
    return {
        list: videos,
    };
}

function fixPic(url) {
    const pattern = /(.*\/\/).*/
    const matches = url.match(pattern);
    if (!_.isEmpty(matches)) {
        if (!matches[1].includes('http')) {
            url = url.replace(matches[1], 'http://');
        }
    } else {
        url = URL + '/' + url;
    }
    return url;
}

async function category(tid, pg, filter, extend) {
    let listApi = '/vod/getLists';
    if (CONFIGURL.includes('v5')) {
        listApi = '/vod/lists';
    }
    const url = URL + API + listApi + '?type_id=' + tid + '&area=' + (extend.area || '') + '&lang=' + (extend.lang || '') + '&year=' + (extend.year || '') + '&order=' + (extend.by || 'time') + '&type_name=' + (extend.class || '') + '&page=' + pg + '&pageSize=21';
    const cateResult = await request(url);
    const json = JSON.parse(cateResult);
    let jsonData = json.data;
    if (json.ENCRYPTION) {
        jsonData = JSON.parse(decrypt(json.data));
    }
    const jsonArray = jsonData.data;
    const videos = _.map(jsonArray, (vObj) => {
        return {
            vod_id: vObj.vod_id,
            vod_name: vObj.vod_name,
            vod_pic: fixPic(vObj.vod_pic),
            vod_remarks: vObj.vod_remarks,
        };
    });
    return {
        page: parseInt(pg),
        pagecount: jsonData.last_page,
        limit: jsonData.per_page,
        total: jsonData.total,
        list: videos,
    };
}

async function detail(id) {
    const url = URL + API + '/vod/getVod?id=' + id + '&__platform=android&__ic=' + IC;
    const detailResult = await request(url);
    const content = JSON.parse(detailResult);
    let jsonData = content.data;
    if (content.ENCRYPTION) {
        jsonData = JSON.parse(decrypt(content.data));
    }
    const vObj = jsonData;
    const vodAtom = {
        vod_id: id,
        vod_name: vObj.vod_name,
        vod_pic: fixPic(vObj.vod_pic),
        vod_year: vObj.vod_year,
        vod_area: vObj.vod_area,
        vod_remarks: vObj.vod_remarks,
        vod_actor: vObj.vod_actor,
        vod_director: vObj.vod_director,
        vod_content: vObj.vod_content.replaceAll(/<\/?[^>]+>/g, '').trim(),
    }
    const playInfo = vObj.vod_play_list;
    const playVod = {};
    _.each(playInfo, (obj) => {
        const sourceName = obj.player_info.show;
        let playList = '';
        const videoInfo = obj.urls;
        const vodItems = _.map(videoInfo, (epObj) => {
            const epName = epObj.name;
            const from = epObj.from;
            const playUrl = epObj.url + '@' + from;
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
    const str = id.split('@');
    const vUrl = str[0];
    const from = str[1];
    const labels = parseLabs.hasOwnProperty(from) ? parseLabs[from] : [from];
    const postUrl = URL + API + '/parsing/proxy';
    let playUrl = '';
    for (const label of labels) {
        const requestBody = {
            play_url: vUrl,
            label: label,
            key: from,
        };
        const resp = await request(postUrl, 'post', requestBody);
        let json;
        try {
            json = JSON.parse(resp);
        } catch(e) {
        }
        if (json && json.data) {
            let jsonData = json.data;
            if (json.ENCRYPTION) {
                jsonData = JSON.parse(decrypt(json.data));
            }
            if (!_.isEmpty(jsonData.url)) {
                playUrl = jsonData.url;
                break;
            }
        }
        playUrl = vUrl;
    }
    return {
        parse: 0,
        url: playUrl,
    };
}

async function search(wd, quick, pg) {
    const url = URL + API + '/vod/getVodSearch?wd=' + encodeURIComponent(wd) + '&page=' + pg + '&type=';
    const searchResult = await request(url);
    const json = JSON.parse(searchResult);
    let jsonData = json.data;
    if (json.ENCRYPTION) {
        jsonData = JSON.parse(decrypt(json.data));
    }
    const jsonArray = jsonData.data;
    const videos = _.map(jsonArray, (vObj) => {
        return {
            vod_id: vObj.vod_id,
            vod_name: vObj.vod_name,
            vod_pic: fixPic(vObj.vod_pic),
            vod_remarks: vObj.vod_remarks,
        };
    });
    return {
        page: parseInt(pg),
        pagecount: jsonData.last_page,
        limit: jsonData.per_page,
        total: jsonData.total,
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