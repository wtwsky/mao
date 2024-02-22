import { _ } from 'assets://js/lib/cat.js';

let key = 'ttian';
let host = 'http://op.ysdqjs.cn';
let siteKey = '';
let siteType = 0;

const UA = 'Dart/3.0 (dart:io)';

async function request(reqUrl, method, data) {
    const res = await req(reqUrl, {
        method: method || 'get',
        headers: {
            'User-Agent': UA,
        },
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
    const json = await postData(host + '/v2/type/top_type');
    const classes = _.map(json.data.list, (item) => {
        return {
            type_id: item.type_id,
            type_name: item.type_name,
        };
    });
    const filterConfig = {};
    // const sort = {'key':'order','name':'排序','value':[{'n':'时间','v':'time'},{'n':'人气','v':'hits'},{'n':'评分','v':'score'}]};
    _.each(json.data.list, (item) => {
        const extend = convertTypeData(item, 'extend', '剧情');
        const area = convertTypeData(item, 'area', '地区');
        const lang = convertTypeData(item, 'lang', '语言');
        const year = convertTypeData(item, 'year', '年份');
        const filterArray = [extend, area, lang, year].filter((type) => type !== null);
        filterConfig[item.type_id] = filterArray;
    });
    return {
        class: classes,
        filters: filterConfig,
    };
}

async function postData(url, data) {
    const timestamp = Math.floor(new Date().getTime() / 1000);
    const key = 'kj5649ertj84ks89r4jh8s45hf84hjfds04k';
    const sign = md5X(key + timestamp);
    let defaultData = {
        sign: sign,
        timestamp: timestamp,
    };
    const reqData = data ? _.merge(defaultData, data) : defaultData;
    const resp = await request(url, 'post', reqData);
    return JSON.parse(resp);
}

function convertTypeData(typeData, key, name) {
    if (!typeData || !typeData[key] || typeData[key].length <= 2) {
        return null;
    }
    const typeClass = {
        key: key == 'extend' ? 'class' : key,
        name: name,
        init: '',
        value: _.map(typeData[key], (item) => {
            return {
                n: item,
                v: item == '全部' ? '' : item,
            };
        }),
    };
    return typeClass;
}

async function homeVod() {
    const json = await postData(host + '/v2/type/tj_vod');
    const videos = [];
    _.each(json.data.cai, (obj) => {
        const v = {
            vod_id: obj.vod_id,
            vod_name: obj.vod_name,
            vod_pic: obj.vod_pic,
            vod_remarks: obj.vod_remarks,
        };
        videos.push(v);
    });
    _.each(json.data.loop, (obj) => {
        const v = {
            vod_id: obj.vod_id,
            vod_name: obj.vod_name,
            vod_pic: obj.vod_pic,
            vod_remarks: obj.vod_remarks,
        };
        videos.push(v);
    });
    return {
        list: videos,
    };
}

async function category(tid, pg, filter, extend) {
    const limit = 12;
    const param = generateParam(tid, pg, extend, limit);
    const json = await postData(host + '/v2/home/type_search', param);
    const jsonArray = json.data.list;
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

function generateParam(tid, pg, extend, limit) {
    const param = {
        type_id: tid,
        page: pg,
        limit: limit,
    };
    if (extend.class) {
        param.class = extend.class;
    }
    if (extend.area) {
        param.area = extend.area;
    }
    if (extend.lang) {
        param.lang = extend.lang;
    }
    if (extend.year) {
        param.year = extend.year;
    }
    // if (extend.order) {
    //     param.order = extend.order;
    // }
    return param;
}

async function detail(id) {
    const param = {
        vod_id: id,
    };
    const json = await postData(host + '/v2/home/vod_details', param);
    const vObj = json.data;
    const vodAtom = {
        vod_id: id,
        vod_name: vObj.vod_name,
        vod_pic: vObj.vod_pic,
        vod_year: vObj.vod_year,
        vod_area: vObj.vod_area,
        vod_lang: vObj.vod_lang,
        vod_remarks: vObj.vod_remarks,
        vod_actor: vObj.vod_actor,
        vod_director: vObj.vod_director,
        vod_content: formatContent(vObj.vod_content),
    }
    const playInfo = vObj.vod_play_list;
    const playVod = {};
    _.each(playInfo, (obj) => {
        const sourceName = obj.name;
        let playList = '';
        const videoInfo = obj.urls;
        const vodItems = _.map(videoInfo, (epObj) => {
            const epName = epObj.name;
            const parse = obj.parse_urls.join(';');
            const playUrl = epObj.url + '@' + parse;
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

function formatContent(content) {
    return content.replaceAll('&amp;', '&')
        .replaceAll('&lt;', '<')
        .replaceAll('&gt;', '>')
        .replaceAll('&quot;', '\"')
        .replaceAll(/<\/?[^>]+>/g, '');
}

async function play(flag, id, flags) {
    const str = id.split('@');
    let playUrl = str[0];
    const parsers = str[1].split(';');
    if (!_.isEmpty(parsers)) {
        for (const parser of parsers) {
            if (_.isEmpty(parser)) continue;
            try {
                const resp = await request(parser + playUrl);
                const json = JSON.parse(resp);
                if (json.url) {
                    playUrl = json.url;
                    break;
                }
            } catch(e) {
            }
        }
    }
    return {
        parse: 0,
        url: playUrl,
    };
}

async function search(wd, quick, pg) {
    const limit = 12;
    const param = {
        keyword: wd,
        page: pg,
        limit: limit,
    };
    const json = await postData(host + '/v2/home/search', param);
    const jsonArray = json.data.list;
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