import { load, _ } from 'assets://js/lib/cat.js';
import { log } from './lib/utils.js';
import { initAli, detailContent, playContent } from './lib/ali.js';

let siteKey = 'tuier';
let siteType = 0;
let siteUrl = 'https://tuier.wordpress.com';
let patternAli = /(https:\/\/www\.(aliyundrive|alipan)\.com\/s\/[^"]+)/

async function request(reqUrl) {
    let res = await req(reqUrl, {
        method: 'get',
        headers: {
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
    const filterObj = {};
    return {
        class: classes,
        filters: filterObj,
    };
}

async function homeVod() {}

async function category(tid, pg, filter, extend) {
    if (pg <= 0) pg = 1;
    let page = '';
    if (pg > 1) {
        page = '/page/' + pg;
    }
    const html = await request(siteUrl + page + '/');
    return parseHtmlList(html, pg);
}

function parseHtmlList(html, pg) {
    const $ = load(html);
    const list = $('main .is-layout-grid:first .type-post');
    const videos = _.map(list, (item) => {
        const $item = $(item);
        const title = $item.find('h2 a');
        return {
            vod_id: title.attr('href').replace(siteUrl, ''),
            vod_name: formatTitle(title.text()),
            vod_pic: 'https://pic.rmb.bdstatic.com/bjh/6a2278365c10139b5b03229c2ecfeea4.jpeg',
            vod_remarks: '',
        };
    });
    const pgCount = $('.wp-block-query-pagination-next').length > 0 ? pg + 1 : pg;
    const limit = 50;
    return {
        page: pg,
        pagecount: pgCount,
        limit: limit,
        total: limit * pgCount,
        list: videos,
    };
}

function formatTitle(text) {
    return text.replace('\ud83d\uddbc', '')
              .replace('名称：', '')
              .replace('资源名称：', '')
              .replace('资源标题：', '')
              .replace('资源描述：', '');
}

async function detail(id) {
    try {
        let matches = id.match(patternAli);
        if (!_.isEmpty(matches)) return await detailContent(matches[0]);
        const html = await request(siteUrl + id);
        const $ = load(html);
        const link = $('.entry-content p:contains(链接) a:first').attr('href');
        matches = link.match(patternAli);
        if (!_.isEmpty(matches)) return await detailContent(matches[0]);
    } catch (e) {
        await log('detail:' + e.message + ' line:' + e.lineNumber);
    }
    return {};
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
    let page = '';
    if (pg > 1) {
        page = '/page/' + pg;
    }
    const html = await request(siteUrl + page + "/?s=" + encodeURIComponent(wd));
    return parseHtmlList(html, pg);
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