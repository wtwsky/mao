import { Crypto, dayjs, load, _ } from 'assets://js/lib/cat.js';
import { log } from './lib/utils.js';
import { initAli, detailContent, playContent } from './lib/ali.js';

let siteKey = 'bqrdh';
let siteType = 0;
let siteUrl = 'https://news.bqrdh.com';
let patternAli = /(https:\/\/www\.(aliyundrive|alipan)\.com\/s\/[^"]+)/;

const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1';

async function request(reqUrl, method, data, redirect) {
    const res = await req(reqUrl, {
        method: 'get',
        headers: {
            'User-Agent': UA,
            'Referer': siteUrl,
        },
    });
    return res.content;
}

// cfg = {skey: siteKey, ext: extend}
async function init(cfg) {
    try {
        siteKey = _.isEmpty(cfg.skey) ? '' : cfg.skey;
        siteType = _.isEmpty(cfg.stype) ? '' : cfg.stype;
        await initAli(cfg.ext);
    } catch (e) {
        await log('init:' + e.message + ' line:' + e.lineNumber);
    }
}

async function home(filter) {
    const classes = [{'type_id':'1','type_name':'电影'},{'type_id':'6','type_name':'电视'},{'type_id':'11','type_name':'动漫'},{'type_id':'15','type_name':'视频'},{'type_id':'20','type_name':'音乐'}];
    const filterObj = {
        '1':[{'key':'cateId','name':'分类','init':'2','value':[{'n':'华语','v':'2'},{'n':'日韩','v':'3'},{'n':'欧美','v':'4'},{'n':'其他','v':'5'}]},{'key':'order','name':'排序','init':'newest','value':[{'n':'最新','v':'newest'},{'n':'最热','v':'popular'}]}],
        '6':[{'key':'cateId','name':'分类','init':'7','value':[{'n':'华语','v':'7'},{'n':'日韩','v':'8'},{'n':'欧美','v':'9'},{'n':'其他','v':'10'}]},{'key':'order','name':'排序','init':'newest','value':[{'n':'最新','v':'newest'},{'n':'最热','v':'popular'}]}],
        '11':[{'key':'cateId','name':'分类','init':'12','value':[{'n':'国漫','v':'12'},{'n':'日本','v':'13'},{'n':'欧美','v':'14'}]},{'key':'order','name':'排序','init':'newest','value':[{'n':'最新','v':'newest'},{'n':'最热','v':'popular'}]}],
        '15':[{'key':'cateId','name':'分类','init':'16','value':[{'n':'纪录','v':'16'},{'n':'综艺','v':'17'},{'n':'教育','v':'18'},{'n':'其他','v':'19'}]},{'key':'order','name':'排序','init':'newest','value':[{'n':'最新','v':'newest'},{'n':'最热','v':'popular'}]}],
        '20':[{'key':'cateId','name':'分类','init':'21','value':[{'n':'华语','v':'21'},{'n':'日韩','v':'22'},{'n':'欧美','v':'23'},{'n':'其他','v':'24'}]},{'key':'order','name':'排序','init':'newest','value':[{'n':'最新','v':'newest'},{'n':'最热','v':'popular'}]}],
  };
    return {
        class: classes,
        filters: filterObj,
    };
}

async function homeVod() {}

async function category(tid, pg, filter, extend) {
    if (pg <= 0) pg = 1;
    const limit = 25;
    const url = siteUrl + '/api/busi/res/list?typeId=' + (extend.cateId || tid) + '&source=ALI_WP&q=&statuses=PUBLISH&statuses=INVALID&orderBy2=' + (extend.order || '') + '&pageSize=' + limit + '&pageNum=' + pg + '&total=0&_t=' + new Date().getTime();
    const resp = await request(url);
    return parseVodList(resp);
}

function parseVodList(resp) {
    const rspData = JSON.parse(resp);
    const jsonData = base64Decode(rspData.payload.substring(9));
    const json = JSON.parse(jsonData);
    const videos = _.map(json.payload, (item) => {
        return {
            vod_id: item.fullSourceUrl,
            vod_name: item.title,
            vod_pic: "https://inews.gtimg.com/newsapp_bt/0/13263837859/1000",
            vod_remarks: dayjs(item.modifyTime).format('YY/MM/DD hh:mm'),
        };
    });
    return {
        page: json.pageNum,
        pagecount: json.pages,
        limit: json.pageSize,
        total: json.total,
        list: videos,
    };
}

function base64Decode(text) {
    return Crypto.enc.Utf8.stringify(Crypto.enc.Base64.parse(text));
}

async function detail(id) {
    try {
        const matches = id.match(patternAli);
        if (!_.isEmpty(matches)) return await detailContent(matches[1]);
        return {};
    } catch (e) {
        await log('detail:' + e.message + ' line:' + e.lineNumber);
    }
}

async function play(flag, id, flags) {
    try {
        return await playContent(flag, id, flags);
    } catch (e) {
        await log('play:' + e.message + ' line:' + e.lineNumber);
    }
}

async function search(wd, quick, pg) {
    if (pg <= 0) pg = 1;
    const limit = 25;
    const url = siteUrl + '/api/busi/res/list?source=ALI_WP&q=' + encodeURIComponent(wd) + '&statuses=PUBLISH&statuses=INVALID&orderBy2=newest&pageSize=' + limit + '&pageNum=' + pg + '&total=0&_t=' + new Date().getTime();
    const resp = await request(url);
    return parseVodList(resp);
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