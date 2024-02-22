import { Crypto, load, _ } from 'assets://js/lib/cat.js';

let key = 'dm84';
let HOST = 'https://dm84.tv';
let parseMap = {};
let siteKey = '';
let siteType = 0;

const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1';

async function request(reqUrl, referer, method, data) {
    let res = await req(reqUrl, {
        method: method || 'get',
        headers: {
            'User-Agent': UA,
            'Referer': referer || HOST
        },
        data: data,
        postType: method == 'post' ? 'form' : '',
    });
    return res.content;
}

// cfg = {skey: siteKey, ext: extend}
async function init(cfg) {
    siteKey = cfg.skey;
    siteType = cfg.stype;
}

async function home(filter) {
    const classes = [{'type_id':'1','type_name':'国产动漫'},{'type_id':'2','type_name':'日本动漫'},{'type_id':'3','type_name':'欧美动漫'},{'type_id':'4','type_name':'电影'}];
    const filterObj = {
        '1':[{'key':'class','name':'类型','init':'','value':[{'n':'全部','v':''},{'n':'奇幻','v':'奇幻'},{'n':'战斗','v':'战斗'},{'n':'玄幻','v':'玄幻'},{'n':'穿越','v':'穿越'},{'n':'科幻','v':'科幻'},{'n':'武侠','v':'武侠'},{'n':'热血','v':'热血'},{'n':'耽美','v':'耽美'},{'n':'搞笑','v':'搞笑'},{'n':'动态漫画','v':'动态漫画'}]},{'key':'year','name':'年代','init':'','value':[{'n':'全部','v':''},{'n':'2024','v':'2024'},{'n':'2023','v':'2023'},{'n':'2022','v':'2022'},{'n':'2021','v':'2021'},{'n':'2020','v':'2020'},{'n':'2019','v':'2019'},{'n':'2018','v':'2018'},{'n':'2017','v':'2017'},{'n':'2016','v':'2016'},{'n':'2015','v':'2015'}]},{'key':'by','name':'排序','value':[{'n':'时间','v':'time'},{'n':'人气','v':'hits'},{'n':'评分','v':'score'}]}],
        '2':[{'key':'class','name':'类型','init':'','value':[{'n':'全部','v':''},{'n':'冒险','v':'冒险'},{'n':'奇幻','v':'奇幻'},{'n':'战斗','v':'战斗'},{'n':'后宫','v':'后宫'},{'n':'热血','v':'热血'},{'n':'励志','v':'励志'},{'n':'搞笑','v':'搞笑'},{'n':'校园','v':'校园'},{'n':'机战','v':'机战'},{'n':'悬疑','v':'悬疑'},{'n':'治愈','v':'治愈'},{'n':'百合','v':'百合'},{'n':'恐怖','v':'恐怖'},{'n':'泡面番','v':'泡面番'},{'n':'恋爱','v':'恋爱'},{'n':'推理','v':'推理'}]},{'key':'year','name':'年代','init':'','value':[{'n':'全部','v':''},{'n':'2024','v':'2024'},{'n':'2023','v':'2023'},{'n':'2022','v':'2022'},{'n':'2021','v':'2021'},{'n':'2020','v':'2020'},{'n':'2019','v':'2019'},{'n':'2018','v':'2018'},{'n':'2017','v':'2017'},{'n':'2016','v':'2016'},{'n':'2015','v':'2015'}]},{'key':'by','name':'排序','value':[{'n':'时间','v':'time'},{'n':'人气','v':'hits'},{'n':'评分','v':'score'}]}],
        '3':[{'key':'class','name':'类型','init':'','value':[{'n':'全部','v':''},{'n':'科幻','v':'科幻'},{'n':'冒险','v':'冒险'},{'n':'战斗','v':'战斗'},{'n':'百合','v':'百合'},{'n':'奇幻','v':'奇幻'},{'n':'热血','v':'热血'},{'n':'搞笑','v':'搞笑'}]},{'key':'year','name':'年代','init':'','value':[{'n':'全部','v':''},{'n':'2024','v':'2024'},{'n':'2023','v':'2023'},{'n':'2022','v':'2022'},{'n':'2021','v':'2021'},{'n':'2020','v':'2020'},{'n':'2019','v':'2019'},{'n':'2018','v':'2018'},{'n':'2017','v':'2017'},{'n':'2016','v':'2016'},{'n':'2015','v':'2015'}]},{'key':'by','name':'排序','value':[{'n':'时间','v':'time'},{'n':'人气','v':'hits'},{'n':'评分','v':'score'}]}],
        '4':[{'key':'class','name':'类型','init':'','value':[{'n':'全部','v':''},{'n':'搞笑','v':'搞笑'},{'n':'奇幻','v':'奇幻'},{'n':'治愈','v':'治愈'},{'n':'科幻','v':'科幻'},{'n':'喜剧','v':'喜剧'},{'n':'冒险','v':'冒险'},{'n':'动作','v':'动作'},{'n':'爱情','v':'爱情'}]},{'key':'year','name':'年代','init':'','value':[{'n':'全部','v':''},{'n':'2024','v':'2024'},{'n':'2023','v':'2023'},{'n':'2022','v':'2022'},{'n':'2021','v':'2021'},{'n':'2020','v':'2020'},{'n':'2019','v':'2019'},{'n':'2018','v':'2018'},{'n':'2017','v':'2017'},{'n':'2016','v':'2016'},{'n':'2015','v':'2015'}]},{'key':'by','name':'排序','value':[{'n':'时间','v':'time'},{'n':'人气','v':'hits'},{'n':'评分','v':'score'}]}]
    };
    return {
        class: classes,
        filters: filterObj,
    };
}

async function homeVod() {}

async function category(tid, pg, filter, extend) {
    if (pg <= 0) pg = 1;
    const link = HOST + '/show-' + tid + '--' + (extend.by || 'time') + '-' + (extend.class || '') + '--' + (extend.year || '') + '-' + pg + '.html';
    const html = await request(link);
    const $ = load(html);
    const items = $('ul.v_list div.item');
    const videos = _.map(items, (item) => {
        const $item = $(item);
        const a = $item.find('a.title');
        const img = $item.find('a.cover');
        const remarks = $item.find('span.desc').text().trim();
        return {
            vod_id: a.attr('href').replace(/.*?\/v\/(.*).html/g, '$1'),
            vod_name: a.attr('title'),
            vod_pic: img.attr('data-bg'),
            vod_remarks: remarks,
        };
    });
    const limit = 36;
    const hasMore = $('div.pages > a:contains(下一页)').length > 0;
    const pgCount = hasMore ? parseInt(pg) + 1 : parseInt(pg);
    return {
        page: parseInt(pg),
        pagecount: pgCount,
        limit: limit,
        total: limit * pgCount,
        list: videos,
    };
}

async function detail(id) {
    const html = await request(HOST + '/v/' + id + '.html');
    const $ = load(html);
    const vod = {
        vod_id: id,
        vod_name: $('.v_title').text().trim(),
        vod_type: $('p.v_desc a:first').next().text().trim(),
        vod_year: $('p.v_desc').text().split('|')[1].trim(),
        vod_area: $('p.v_desc').text().split('|')[2].trim(),
        vod_actor: $('div#intro p:contains(主演：)').text().trim().substring(3),
        vod_director: $('div#intro p:contains(导演：)').text().trim().substring(3),
        vod_pic: $('div.cover img:first').attr('src'),
        vod_remarks : $('p.v_desc span:first').text(),
        vod_content: $('div#intro p:contains(剧情：)').text().trim().substring(3),
    };
    const playMap = {};
    const tabs = $('.play_from li');
    const playlists = $('.play_list');
    _.each(tabs, (tab, i) => {
        const $tab = $(tab);
        const from = $tab.text().trim();
        let list = playlists[i];
        list = $(list).find('a');
        _.each(list, (it) => {
            const $it = $(it);
            let title = $it.text();
            const playUrl = $it.attr('href');
            if (_.isEmpty(title)) title = $it.text();
            if (!playMap.hasOwnProperty(from)) {
                playMap[from] = [];
            }
            playMap[from].push(title + '$' + playUrl);
        });
    });
    vod.vod_play_from = _.keys(playMap).join('$$$');
    const urls = _.values(playMap);
    const vod_play_url = _.map(urls, (urlist) => {
        return urlist.join('#');
    });
    vod.vod_play_url = vod_play_url.join('$$$');
    return {
        list: [vod],
    };
}

async function play(flag, id, flags) {
    const link = HOST + id;
    const html = await request(link);
    const $ = load(html);
    const parseUrl = $('.p_box iframe').attr('src');
    const parseHtml = await request(parseUrl);
    const url = parseHtml.match(/var url = \"(.*)\";/)[1];
    const t = parseHtml.match(/var t = \"(.*)\";/)[1];
    const key = parseHtml.match(/var key = \"(.*)\";/)[1];
    const act = parseHtml.match(/var act = \"(.*)\";/)[1];
    const play = parseHtml.match(/var play = \"(.*)\";/)[1];
    const reqUrl = parseUrl.match(/(.*\:\/\/.*)\/.*/)[1] + '/api.php';
    const param = {
        url: url,
        t: t,
        key: key,
        act: act,
        play: play,
    };
    const resp = await request(reqUrl, parseUrl, 'post', param);
    const json = JSON.parse(resp);
    const playUrl = json.url;
    return {
        parse: 0,
        url: playUrl,
        header: {
            'User-Agent': UA,
        }
    };
}

async function search(wd, quick) {
    const data = JSON.parse(await request(HOST + '/index.php/ajax/suggest?mid=1&limit=50&wd=' + wd)).list;
    const videos = _.map(data, (vod) => {
        return {
            vod_id: vod.id,
            vod_name: vod.name,
            vod_pic: vod.pic,
            vod_remarks: '',
        };
    });
    return {
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