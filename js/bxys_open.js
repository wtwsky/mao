import { _ } from 'assets://js/lib/cat.js';

let key = 'bxys';
let HOST = 'http://api.bxys.me'
let siteKey = '';
let siteType = 0;
const APP_VER = '1.1.2'

const UA = 'HUGVIR/1.1.2 (com.hugvir.tool; build:25; iOS 16.6.1) Alamofire/5.8.0';

async function request(reqUrl, method, data) {
    const headers = {
        'User-Agent': UA,
    };
    const res = await req(reqUrl, {
        method: method || 'get',
        headers: headers,
        data: data,
        postType: method === 'post' ? 'form' : '',
    });
    return res.content;
}

// cfg = {skey: siteKey, ext: extend}
async function init(cfg) {
    siteKey = cfg.skey;
    siteType = cfg.stype;
}

async function home(filter) {
    const url = HOST + '/bxys/api/type?app=bx1&type=phone&v=' + APP_VER;
    const homeResult = await request(url);
    const json = JSON.parse(homeResult);
    const filters = {};
    const classes = _.map(json.data, (item) => {
        const filter = getFilters(item);
        filters[item.id] = filter;
        return {
            type_id: item.id,
            type_name: item.channel,
        };
    });
    return {
        class: classes,
        filters: filters,
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
    const limit = 15;
    const areaPath = extend.area ? ('&area=' + extend.area) : '';
    const typePath = extend.class ? ('&type=' + extend.class) : '';
    const yearPath = extend.year ? ('&year=' + extend.year) : '';
    const langPath = extend.lang ? ('&lang=' + extend.lang) : '';
    const byPath = extend.by ? ('&by=' + extend.by) : '';
    const url = HOST + '/bxys/api/channel?app=bx1&id=' + tid + '&limit=' + limit + '&page=' + pg + areaPath + typePath + yearPath + langPath + byPath + '&v=' + APP_VER;
    const cateResult = await request(url);
    const json = JSON.parse(cateResult);
    const videos = _.map(json.data, (vObj) => {
        return {
            vod_id: vObj.id,
            vod_name: vObj.name,
            vod_pic: vObj.pic,
            vod_remarks: vObj.remarks,
        };
    });
    const hasMore = !_.isEmpty(videos);
    const page = parseInt(pg);
    const pageCount = hasMore ? page + 1 :page;
    return {
        page: page,
        pagecount: pageCount,
        limit: limit,
        total: pageCount * limit,
        list: videos,
    };
}


async function detail(id) {
    const url = HOST + '/bxys/api/vod/detail?app=bx1&id=' + id + '&v=' + APP_VER;
    const detailResult = await request(url);
    const content = JSON.parse(detailResult);
    const vObj = content.data;
    const vodAtom = {
        vod_id: id,
        vod_name: vObj.name,
        vod_pic: vObj.pic,
        vod_year: vObj.year,
        vod_area: vObj.area,
        vod_lang: vObj.lang,
        vod_remarks: vObj.remarks,
        vod_actor: vObj.actor,
        vod_director: vObj.director,
        vod_content: vObj.content,
    }
    const playInfo = vObj.source;
    const playVod = {};
    for (const info of playInfo) {
        const sourceName = info.name;
        const code = info.code;
        const epUrl = HOST + '/bxys/api/vod/episode?app=bx1&code=' + code + '&id=' + id + '&v=' + APP_VER;
        const epResult = await request(epUrl);
        const json = JSON.parse(epResult);
        const vodItems = _.map(json.data, (epObj) => {
            const epName = epObj.title;
            const playUrl = epObj.url;
            return epName + '$' + playUrl;
        });
        playVod[sourceName] = vodItems.join('#');
    }
    vodAtom.vod_play_from = _.keys(playVod).join('$$$');
    vodAtom.vod_play_url = _.values(playVod).join('$$$');
    return {
        list: [vodAtom],
    };
}

async function play(flag, id, flags) {
    return {
        parse: 0,
        url: id,
    };
}

async function search(wd, quick, pg) {
    const limit = 10;
    const url = HOST + '/bxys/api/search?app=bx1&limit=' + limit + '&page=' + pg + '&word=' + encodeURIComponent(wd) + '&v=' + APP_VER;
    const searchResult = await request(url);
    const json = JSON.parse(searchResult);
    const videos = _.map(json.data, (vObj) => {
        return {
            vod_id: vObj.id,
            vod_name: vObj.name,
            vod_pic: vObj.pic,
            vod_remarks: vObj.remarks,
        };
    });
    const hasMore = !_.isEmpty(videos);
    const page = parseInt(pg);
    const pageCount = hasMore ? page + 1 :page;
    return {
        page: page,
        pagecount: pageCount,
        limit: limit,
        total: pageCount * limit,
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