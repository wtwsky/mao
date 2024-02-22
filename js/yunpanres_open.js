import { load, _ } from 'assets://js/lib/cat.js';
import { log } from './lib/utils.js';
import { initAli, detailContent, playContent } from './lib/ali.js';

let siteKey = 'yunpanres';
let siteType = 0;
let siteUrl = 'https://res.yunpan.win';
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
    const classes = [{'type_id':'all','type_name':'首页'}];
    const filterObj = {
        'all':[{'key':'class','name':'分类','init':'','value':[{'n':'全部','v':''},{'n':'电影','v':'电影'},{'n':'电视剧','v':'电视剧'},{'n':'动画','v':'动画'},{'n':'纪录片','v':'纪录片'},{'n':'综艺','v':'综艺'}]},{'key':'class','name':'','init':'','wrap':1,'value':[{'n':'剧情','v':'剧情'},{'n':'动作','v':'动作'},{'n':'冒险','v':'冒险'},{'n':'奇幻','v':'奇幻'},{'n':'科幻','v':'科幻'},{'n':'喜剧','v':'喜剧'},{'n':'爱情','v':'爱情'},{'n':'悬疑','v':'悬疑'},{'n':'历史','v':'历史'},{'n':'战争','v':'战争'},{'n':'恐怖','v':'恐怖'},{'n':'惊悚','v':'惊悚'},{'n':'家庭','v':'家庭'},{'n':'搞笑','v':'搞笑'},{'n':'歌舞','v':'歌舞'},{'n':'音乐','v':'音乐'},{'n':'歌曲','v':'歌曲'},{'n':'真人秀','v':'真人秀'}]},{'key':'tag','name':'标签','init':'','value':[{'n':'全部','v':''},{'n':'1080p','v':'1080p'},{'n':'4k','v':'4k'},{'n':'高码率','v':'高码率'},{'n':'杜比视界','v':'杜比视界'},{'n':'画质控','v':'画质控'}]}],
   };
    return {
        class: classes,
        filters: filterObj,
    };
}

async function homeVod() {}

async function category(tid, pg, filter, extend) {
    if (pg <= 0) pg = 1;
    const limit = 12;
    const html = await request(siteUrl + '/?PageIndex=' + pg + '&PageSize=' + limit + '&Keyword=&Type=' + (extend.class || '') + '&Tag=' + (extend.tag || ''));
    return parseHtmlList(html, pg, limit);
}

function parseHtmlList(html, pg, limit) {
    const $ = load(html);
    const elements = $('.card');
    const videos = _.map(elements, (item) => {
        const $item = $(item);
        const matches = $item.find('.card-footer').html().match(/open\(\'(.*)\'\)/);
        const url = matches[1];
        const $img = $item.find('img:first');
        const $title = $item.find('.card-title');
        const $size = $item.find('.card-text:contains(大小)');
        return {
            vod_id: url,
            vod_name: $title.text().trim(),
            vod_pic: siteUrl + $img.attr('src'),
            vod_remarks: $size.text().trim(),
        };
    });
    const pageArea = $('.pagination');
    const hasMore = !_.isEmpty(pageArea) && pageArea.find('li.active').text() != pageArea.find('li:last').text();
    const page = parseInt(pg);
    const pgCount = hasMore ? page + 1 : page;
    return {
        page: page,
        pagecount: pgCount,
        limit: limit,
        total: limit * pgCount,
        list: videos,
    };
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
    const limit = 12;
    const html = await request(siteUrl + '/?PageIndex=' + pg + '&PageSize=' + limit + '&Keyword=' + encodeURIComponent(wd) + '&Type=&Tag=');
    return parseHtmlList(html, pg, limit);
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