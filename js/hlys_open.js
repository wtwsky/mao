import { _ } from 'assets://js/lib/cat.js';

let key = 'hlys';
let HOST = 'http://www.yoguo.vip'
let SITE = 'http://ytx.yinglvtv.com'
let siteKey = '';
let siteType = 0;
const APP_ID = '10105'

const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1';

async function request(reqUrl) {
    const res = await req(reqUrl, {
        method: 'get',
        headers: {
            'User-Agent': UA,
            'Referer': SITE,
            'Origin': SITE,
        },
    });
    return res.content;
}

// cfg = {skey: siteKey, ext: extend}
async function init(cfg) {
    siteKey = cfg.skey;
    siteType = cfg.stype;
}

async function home(filter) {
    const classes = [{'type_id':'0','type_name':'首页'},{'type_id':'1','type_name':'电影'},{'type_id':'2','type_name':'电视剧'},{'type_id':'3','type_name':'综艺'},{'type_id':'4','type_name':'动漫'}];
    const filters = {};
    for (const type of classes) {
        if (type.type_id == '0') {
            const filter = getHomeFilters();
            filters[type.type_id] = filter; 
        } else {
            const url = HOST + '/app/cms10/video/re_category?type=' + type.type_id + '&appId=' + APP_ID;
            const typeResult = await request(url);
            const json = JSON.parse(typeResult);
            const filter = getFilters(json.data);
            filters[type.type_id] = filter; 
        }
    }
    return {
        class: classes,
        filters: filters,
    };
}

function getHomeFilters() {
    return [{
        key: 'level',
        name: '分类',
        init: '',
        value: [
            {'n':'全部','v':''},
            {'n':'本月新剧','v':'1'},
            {'n':'热播电影','v':'2'},
        ]
    }];
}

function getFilters(data) {
    const filterArray = [];
    const clazz = convertTypeData(data, 'type', '类型');
    if (clazz) filterArray.push(clazz);
    const area = convertTypeData(data, 'arear', '地区');
    if (area) filterArray.push(area);
    const year = convertTypeData(data, 'year', '年份');
    if (year) filterArray.push(year);
    return filterArray;
}

function convertTypeData(typeData, typeKey, typeName) {
    if (!typeData || !typeData[typeKey] || _.isEmpty(typeData[typeKey])) {
        return null;
    }
    let valueList = typeData[typeKey];
    const values = _.map(valueList, (item) => {
        return {
            n: item.type_name,
            v: item.type_name == '全部' ? '' : item.type_name,
        };
    });
    const typeClass = {
        key: typeKey == 'arear' ? 'area' : typeKey,
        name: typeName,
        init: '',
        value: values,
    };
    return typeClass;
}

async function homeVod() {
    const url = HOST + '/app/cms10/video/home?appId=' + APP_ID;
    const homeResult = await request(url);
    const json = JSON.parse(homeResult);
    const videos = [];
    _.each(json.data.banner, (vObj) => {
        videos.push({
            vod_id: vObj.vodId,
            vod_name: vObj.vodName,
            vod_pic: vObj.vodPic,
        });
    });
    _.each(json.data.recommend, (vObj) => {
        videos.push({
            vod_id: vObj.vodId,
            vod_name: vObj.vodName,
            vod_pic: vObj.vodPic,
        });
    });
    return {
        list: videos,
    };
}

async function category(tid, pg, filter, extend) {
    if (pg <= 0) pg = 1;
    const limit = 20;
    let level = '';
    if (tid == '0') {
        tid = '';
        level = extend.level || '';
    }
    const url = HOST + '/app/cms10/video/list?pg=' + pg + '&type=' + tid + '&area=' + (extend.area || '') + '&year=' + (extend.year || '') + '&pagesize=' + limit + '&className=' + (extend.type || '') + '&ac=videolist&level=' + level + '&appId=' + APP_ID;
    const cateResult = await request(url);
    const json = JSON.parse(cateResult);
    const videos = _.map(json.data, (vObj) => {
        return {
            vod_id: vObj.vod_id,
            vod_name: vObj.vod_name,
            vod_pic: vObj.vod_pic,
            vod_remarks: vObj.vod_remarks,
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
    const url = HOST + '/app/cms10/video/vodDetail?vod=' + id + '&appId=' + APP_ID;
    const detailResult = await request(url);
    const content = JSON.parse(detailResult);
    const vObj = content.data;
    const vodAtom = {
        vod_id: id,
        vod_name: vObj.vod_name,
        type_name: vObj.type_name,
        vod_pic: vObj.vod_pic,
        vod_year: vObj.vod_year,
        vod_area: vObj.vod_area,
        vod_lang: vObj.vod_lang,
        vod_remarks: vObj.vod_remarks,
        vod_actor: vObj.vod_actor,
        vod_director: vObj.vod_director,
        vod_content: vObj.vod_content,
        vod_play_from: vObj.vod_play_from,
        vod_play_url: vObj.vod_play_url,
    }
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
    if (pg <= 0) pg = 1;
    const limit = 10;
    const url = HOST + '/app/cms10/video/search?text=' + encodeURIComponent(wd) + '&page=' + pg + '&appId=' + APP_ID;
    const searchResult = await request(url);
    const json = JSON.parse(searchResult);
    const videos = _.map(json.data, (vObj) => {
        return {
            vod_id: vObj.vod_id,
            vod_name: vObj.vod_name,
            vod_pic: vObj.vod_pic,
            vod_remarks: vObj.vod_remarks,
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