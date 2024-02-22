import { _ } from 'assets://js/lib/cat.js';

let key = 'ys23';
let HOST = 'http://tv.ersanyun.cn';
let siteKey = '';
let siteType = 0;

const UA = 'Dart/3.1 (dart:io)';

async function request(reqUrl) {
    const res = await req(reqUrl, {
        method: 'get',
        headers: {
            'user-agent': UA,
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
    const url = HOST + '/openapi/template/vod/category';
    const resp = await request(url);
    const typeList = JSON.parse(resp);
    const classes = _.map(typeList, (vObj) => {
        return {
            type_id: vObj.id.toString(),
            type_name: vObj.name,
        };
    });
    const filterConfig = {};
    _.each(typeList, (vObj) => {
        const filterList = _.map(vObj.children, (cate) => {
            return {
                n: cate.name,
                v: cate.id.toString(),
            };
        });
        filterList.unshift({
            n: '全部',
            v: '',
        });
        filterConfig[vObj.id] = [{
            key: 'cateId',
            name: '分类',
            init: '',
            value: filterList, 
        }];
    })
    return {
        class: classes,
        filters: filterConfig,
    };
}

async function category(tid, pg, filter, extend) {
    if (pg <= 0) pg = 1;
    const limit = 24;
    const offset = (pg - 1) * limit;
    let categoryId = '';
    if (extend.cateId) {
        categoryId = '&categoryId=' + extend.cateId;
    }
    const url = HOST + '/openapi/template/vod?limit=' + limit + '&offset=' + offset + '&categoryPid=' + tid + categoryId;
    const resp = await request(url);
    const cateData = JSON.parse(resp);
    const videos = _.map(cateData.list, (vObj) => {
        return {
            vod_id: vObj.id,
            vod_name: vObj.name,
            vod_pic: HOST + (vObj.verticalPoster || vObj.surfacePlot),
            vod_remarks: vObj.note,
        };
    });
    const page = parseInt(pg);
    const hasMore = pg * limit < cateData.total;
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
    const url = HOST + '/openapi/template/vod/brief/' + id;
    const resp = await request(url);
    const detailData = JSON.parse(resp);
    const vObj = detailData.info;
    const vodAtom = {
        vod_id: id,
        vod_name: vObj.name || vObj.info.title,
        vod_pic: vObj.verticalPoster,
        vod_year: vObj.info.year,
        vod_area: vObj.info.region,
        vod_remarks: vObj.info.note,
        vod_actor: vObj.info.actors,
        vod_director: vObj.info.directors,
        vod_content: vObj.info.introduce,
    }
    const playInfo = vObj.playLines || vObj.info.lines;
    const playVod = {};
    _.each(playInfo, (obj) => {
        const sourceName = obj.name;
        const videoInfo = obj.addr || obj.playline;
        const vodItems = _.map(videoInfo, (epObj) => {
            const epName = epObj.name;
            const playUrl = epObj.url || epObj.file;
            return epName + '$' + playUrl;
        });
        if (_.isEmpty(vodItems)) return;
        const playList = vodItems.join('#');
        playVod[sourceName] = playList;
    });
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
    if (pg <= 0) pg = 1;
    const limit = 10;
    const offset = (pg - 1) * limit;
    const url = HOST + '/openapi/template/vod?limit=' + limit + '&offset=' + offset + '&keyword=' + encodeURIComponent(wd);
    const resp = await request(url);
    const searchData = JSON.parse(resp);
    const videos = _.map(searchData.list, (vObj) => {
        return {
            vod_id: vObj.id,
            vod_name: vObj.name,
            vod_pic: HOST + (vObj.verticalPoster || vObj.surfacePlot),
            vod_remarks: vObj.note,
        };
    });
    const page = parseInt(pg);
    const hasMore = pg * limit < searchData.total;
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