import { Crypto, load, _ } from 'assets://js/lib/cat.js';

let key = 'mimiju';
let host = 'https://mimiju.com';
let siteKey = '';
let siteType = 0;

const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1';

async function request(reqUrl, agentSp) {
    let res = await req(reqUrl, {
        method: 'get',
        headers: {
            'User-Agent': agentSp || UA,
            'Referer': host
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
    let classes = [{"type_id":20,"type_name":"短剧"}, {"type_id":21,"type_name":"电视剧"}];
    let filterObj = {
        "20": [{"key":"by","name":"排序","value":[{"n":"时间","v":"time"},{"n":"人气","v":"hits"},{"n":"评分","v":"score"}]}],
        "21": [{"key":"by","name":"排序","value":[{"n":"时间","v":"time"},{"n":"人气","v":"hits"},{"n":"评分","v":"score"}]}]};
    return JSON.stringify({
        class: classes,
        filters: filterObj,
    });
}

async function homeVod() {}

async function category(tid, pg, filter, extend) {
    if (pg <= 0 || typeof(pg) == 'undefined') pg = 1;
    const link = host + '/vodshow/' + tid + '--' + (extend.by || 'time') + '---' + '---' + pg + '---' + '.html';//https://mimiju.com/vodshow/20--hits---------.html
    const html = await request(link);
    const $ = load(html);
    const items = $('ul.hl-vod-list > li');
    let videos = _.map(items, (item) => {
        const it = $(item).find('a:first')[0];
        const remarks = $($(item).find('span.hl-lc-1')[0]).text().trim();
        return {
            vod_id: it.attribs.href.replace(/.*?\/voddetail\/(.*).html/g, '$1'),
            vod_name: it.attribs.title,
            vod_pic: host + it.attribs['data-original'],
            vod_remarks: remarks || '',
        };
    });
    const hasMore = $('ul.hl-page-wrap > li > a >span:contains(下一页)').length > 0;
    const pgCount = hasMore ? parseInt(pg) + 1 : parseInt(pg);
    return JSON.stringify({
        page: parseInt(pg),
        pagecount: pgCount,
        limit: 20,
        total: 20 * pgCount,
        list: videos,
    });
}

async function detail(id) {
    var html = await request(host + '/voddetail/' + id + '.html');
    var $ = load(html);
    var vod = {
        vod_id: id,
        vod_name: $('h2.hl-dc-title').text().trim(),
        vod_type: $('li.hl-col-xs-12:contains(类型：)').text().substring(3),
        vod_director: $('li.hl-col-xs-12:contains(导演：)').text().substring(3),
        vod_actor: $('li.hl-col-xs-12:contains(主演：)').text().substring(3),
        vod_pic: host + $('.hl-item-pic .hl-item-thumb').attr('data-original'),
        vod_remarks: $('li.hl-col-xs-12:contains(状态：)').text().substring(3) || '',
        vod_content: $('li.hl-col-xs-12:contains(简介：)').text().substring(3),
    };
    var playMap = {};
    var tabs = $('ul.hl-from-list > li >span');
    var playlists = $('ul#hl-plays-list');
    _.each(tabs, (tab, i) => {
        var from = tab.children[0].data;
        var list = playlists[i];
        list = $(list).find('a');
        _.each(list, (it) => {
            var title = it.children[0].data;
            if (title) {
                var playUrl = it.attribs.href.replace(/\/vodplay\/(.*).html/g, '$1');
                
                if (!playMap.hasOwnProperty(from)) {
                    playMap[from] = [];
                }
                playMap[from].push(title + '$' + playUrl);
            }
        });
    });
    vod.vod_play_from = _.keys(playMap).join('$$$');
    var urls = _.values(playMap);
    var vod_play_url = _.map(urls, (urlist) => {
        return urlist.join('#');
    });
    vod.vod_play_url = vod_play_url.join('$$$');
    return JSON.stringify({
        list: [vod],
    });
}

async function play(flag, id, flags) {
    const link = host + '/vodplay/' + id + '.html';
    const html = await request(link);
    const $ = load(html);
    const js = JSON.parse($('script:contains(player_a)').html().replace('var player_aaaa=', ''));
    const playUrl = js.url;
    return JSON.stringify({
        parse: 0,
        url: playUrl,
    });
}

async function search(wd, quick) {
    let data = JSON.parse(await request(host + '/index.php/ajax/suggest?mid=1&wd=' + wd)).list;
    let videos = [];
    for (const vod of data) {
        videos.push({
            vod_id: vod.id,
            vod_name: vod.name,
            vod_pic: vod.pic,
            vod_remarks: '',
        });
    }
    return JSON.stringify({
        list: videos,
    });
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