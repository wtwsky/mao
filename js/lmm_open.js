import { Crypto, load, _ } from 'assets://js/lib/cat.js';

let key = 'lmm';
let siteUrl = 'https://web.qg50.com/';
let HOST = '';
let siteKey = '';
let siteType = 0;
const parseHost = 'https://yun.366day.site';
const parseMap = new Map([
    ['189速播', {path:'/189tv/?vid=',referer:false,parse:getParseParam189,api:'/189tv/api.php'}],
    ['dev云播', {path:'/yunbox/?type=vxdev&vid=',referer:true,parse:getParseParamYun,api:'/yunbox/vxdev.php'}],
    ['vx云播', {path:'/yunbox/?type=wxcd&vid=',referer:true,parse:getParseParamYun,api:'/yunbox/api.php'}],
    ['wxv云播放', {path:'/yunbox/?type=wxv&vid=',referer:true,parse:getParseParamYun,api:'/yunbox/wxv.php'}],
    ['qqqy云播', {path:'/yunbox/?type=qqqy&vid=',referer:true,parse:getParseParamYun,api:'/yunbox/qqqy.php'}],
    ['qx云播', {path:'/yunbox/?type=qxyun&vid=',referer:true,parse:getParseParamYun,api:'/yunbox/qxyun.php'}],
    ['migu云播', {path:'/yunbox/?type=migu&vid=',referer:true,parse:getParseParamYun,api:'/yunbox/migu.php'}],
    ['box聚合', {path:'/yunbox/?type=yhxg&vid=',referer:true,parse:getParseParamYun,api:'/yunbox/yhxg.php'}],
    ['聚合线路', {path:'/mp4hls/?type=mp4&vid=',referer:true,parse:getParseParamYun,api:'/mp4hls/api.php'}],
    ['hls云播', {path:'/mp4hls/?type=hls&vid=',referer:true,parse:getParseParamYun,api:'/mp4hls/api.php'}],
    ['iq云播', {path:'/mp4hls/?type=hls&vid=',referer:true,parse:getParseParamYun,api:'/mp4hls/api.php'}],
    ['dp云播', {path:'/mp4hls/?vid=',referer:true,parse:getParseParamYun,api:'/mp4hls/api.php'}],
]);

const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1';

async function request(reqUrl, method, data) {
    const res = await req(reqUrl, {
        method: method || 'get',
        headers: {
            'User-Agent': UA,
            'Referer': HOST,
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
    HOST = await checkValidUrl(cfg.ext);
}

async function checkValidUrl(ext) {
    let validUrl = ext;
    if (_.isEmpty(ext)) {
        const html = await request(siteUrl);
        const $ = load(html);
        const link = $('.list a:first').attr('href');
        if (!_.isEmpty(link)) {
            validUrl = link;
        }
    }
    return validUrl;
}

async function home(filter) {
    const classes = [{'type_id':'0','type_name':'新作','land': 1},{'type_id':'1','type_name':'番剧','land': 1},{'type_id':'2','type_name':'电影','land': 1}];
    const filterObj = {
        '0':[{'key':'label','name':'标签','init':'new','value':[{'n':'最近更新','v':'new'},{'n':'热门影片','v':'hot'}]}],
        '1':[{'key':'cateId','name':'类型','init':'1','value':[{'n':'全部','v':'1'},{'n':'日本动漫','v':'6'},{'n':'国产动漫','v':'7'},{'n':'欧美动漫','v':'8'}]},{'key':'year','name':'年代','init':'','value':[{'n':'全部','v':''},{'n':'2024','v':'2024'},{'n':'2023','v':'2023'},{'n':'2022','v':'2022'},{'n':'2021','v':'2021'},{'n':'2020','v':'2020'},{'n':'2019','v':'2019'},{'n':'2018','v':'2018'},{'n':'2017','v':'2017'},{'n':'2016','v':'2016'},{'n':'2015','v':'2015'},{'n':'更早','v':'2014-1980'}]},{'key':'by','name':'排序','init':'time','value':[{'n':'最近更新','v':'time'},{'n':'最高人气','v':'hits'},{'n':'最高评分','v':'score'},{'n':'最多点赞','v':'up'}]}],
        '2':[{'key':'cateId','name':'类型','init':'2','value':[{'n':'全部','v':'2'},{'n':'日本动画电影','v':'3'},{'n':'国产动画电影','v':'4'},{'n':'欧美动画电影','v':'5'}]},{'key':'year','name':'年代','init':'','value':[{'n':'全部','v':''},{'n':'2024','v':'2024'},{'n':'2023','v':'2023'},{'n':'2022','v':'2022'},{'n':'2021','v':'2021'},{'n':'2020','v':'2020'},{'n':'2019','v':'2019'},{'n':'2018','v':'2018'},{'n':'2017','v':'2017'},{'n':'2016','v':'2016'},{'n':'2015','v':'2015'},{'n':'更早','v':'2014-1980'}]},{'key':'by','name':'排序','init':'time','value':[{'n':'最近更新','v':'time'},{'n':'最高人气','v':'hits'},{'n':'最高评分','v':'score'},{'n':'最多点赞','v':'up'}]}],
    };
    return {
        class: classes,
        filters: filterObj,
    };
}

async function homeVod() {}

async function category(tid, pg, filter, extend) {
    if (pg <= 0) pg = 1;
    const pagePath = pg > 1 ? '/page/' + pg : '';
    let link = '';
    if (tid == 0) {
        link = HOST + '/label/' + extend.label + pagePath + '.html';
    } else {
        const byPath = extend.by ? '/by/' + extend.by : '';
        const catePath = extend.cateId ? '/id/' + extend.cateId : '';
        const yearPath = extend.year ? '/year/' + extend.year : '';
        link = HOST + '/vod/show' + byPath + catePath + pagePath + yearPath + '.html';
    }
    const html = await request(link);
    const $ = load(html);
    const list = $('#mdym .video-img-box')
    const videos = _.map(list, (item) => {
        const $item = $(item);
        const url = $item.find('a:first').attr('href');
        const name = $item.find('.title').text();
        const pic = $item.find('img:first').attr('data-src');
        const remarks = $item.find('.label').text();
        return {
            vod_id: url.replace(/\/.*\/(.*).html/, '$1'),
            vod_name: name,
            vod_pic: pic,
            vod_remarks: remarks,
        };
    });
    const limit = 20;
    const lastPage = $('.pagination .page-link:contains(最后)').attr('href').replace(/.*\/(\d+)\.html/, '$1');
    const pgCount = parseInt(lastPage);
    return {
        page: pg,
        pagecount: pgCount,
        limit: limit,
        total: limit * pgCount,
        list: videos,
    };
}

async function detail(id) {
    const html = await request(HOST + '/detail/' + id + '.html');
    const $ = load(html);
    const vod = {
        vod_id: id,
        vod_name: $('.page-title').text().trim(),
        vod_actor: $('.video-info-items:contains(主演) div:first').text().replace(/\s+\//g, ' ').trim(),
        vod_director: $('.video-info-items:contains(导演) div:first').text().replaceAll('\/', ' ').trim(),
        vod_pic: $('.module-item-cover img:first').attr('src'),
        vod_remarks : $('.video-info-items:contains(集数) div:first').text().trim(),
        vod_content: $('.video-info-items:contains(剧情) div:first').text().trim(),
    };
    const playMap = {};
    const tabs = $('.module-tab-content span');
    const playlists = $('.module-blocklist');
    _.each(tabs, (tab, i) => {
        const $tab = $(tab);
        const from = $tab.text().trim();
        let list = playlists[i];
        list = $(list).find('a');
        _.each(list, (it) => {
            const $it = $(it);
            const title = $it.text().trim();
            const playUrl = $it.attr('href');
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
    const scriptData = $('script:contains(player_)').html().replace('var player_aaaa=','');
    const js = JSON.parse(scriptData);
    let playUrl = js.url;
    let config;
    if (isVideoFormat(playUrl)) {
        config = parseMap.get('dp云播');
    } else {
        config = parseMap.get(flag);
    }
    if (config) {
        const parseFrame = parseHost + config.path;
        let fullUrl = parseFrame + playUrl;
        if (config.referer) {
            fullUrl += '&referer=' + link;
        }
        const parseHtml = await request(fullUrl);
        try {
            const param = config.parse.call(play, parseHtml);
            const parseUrl = parseHost + config.api;
            const resp = await request(parseUrl, 'post', param);
            const json = JSON.parse(resp);
            playUrl = json.url;
        } catch (e) {
        }
    }
    return {
        parse: 0,
        url: playUrl,
    };
}

const snifferMatch = /http((?!http).){26,}?\.(m3u8|mp4|flv|avi|mkv|rm|wmv|mpg)\?.*|http((?!http).){26,}\.(m3u8|mp4|flv|avi|mkv|rm|wmv|mpg)|http((?!http).){26,}\/m3u8\?pt=m3u8.*|http((?!http).)*?default\.ixigua\.com\/.*|http((?!http).)*?cdn-tos[^\?]*|http((?!http).)*?\/obj\/tos[^\?]*|http.*?\/player\/m3u8play\.php\?url=.*|http.*?\/player\/.*?[pP]lay\.php\?url=.*|http.*?\/playlist\/m3u8\/\?vid=.*|http.*?\.php\?type=m3u8&.*|http.*?\/download.aspx\?.*|http.*?\/api\/up_api.php\?.*|https.*?\.66yk\.cn.*|http((?!http).)*?netease\.com\/file\/.*/;

function isVideoFormat(url) {
    if (snifferMatch.test(url)) {
        return !url.includes("cdn-tos") || !url.includes(".js");
    }
    return false;
}

function getParseParam189(parseHtml) {
    const vid = parseHtml.match(/"vid": "(.*?)"/)[1];
    const type = parseHtml.match(/"type": "(.*?)"/)[1];
    const sing = parseHtml.match(/"sing": "(.*?)"/)[1];
    const token = parseHtml.match(/"token":"(.*?)"/)[1];
    const token1 = parseHtml.match(/"token1":"(.*?)"/)[1];
    const token2 = parseHtml.match(/"token2":"(.*?)"/)[1];
    const token3 = parseHtml.match(/"token3":"(.*?)"/)[1];
    const t = parseHtml.match(/"t":"(.*?)"/)[1];
    const ti = parseHtml.match(/"ti":(\d+)/)[1];
    const param = {
        vid: vid,
        type: type,
        sing: sing,
        token: token,
        token1: token1,
        token2: token2,
        token3: token3,
        t: t,
        ti: ti,
    };
    return param;
}

function getParseParamYun(parseHtml) {
    const vid = parseHtml.match(/var vid = "(.*?)"/)[1];
    const t = parseHtml.match(/var t = "(.*?)"/)[1];
    const token = parseHtml.match(/var token = "(.*?)"/)[1];
    const act = parseHtml.match(/var act = "(.*?)"/)[1];
    const play = parseHtml.match(/var play = "(.*?)"/)[1];
    const param = {
        vid: vid,
        t: t,
        token: getc(token),
        act: act,
        play: play,
    };
    return param;
}

function getc(token) {
    const t = gett('BlILGwo2OBoAATIXE1NXCwQALg0KE1xS');
    const key = sortt(t);
    return getDAesString(token, key, '1348987635684651');
}

function gett(param) {
    const key = 'daolianlaopowanrenlun';
    const len = key.length;
    const tData = base64Decode(param);
    let code = '';
    for (let i = 0; i < tData.length; i++) {
        let k = i % len;
        code += String.fromCharCode(tData.charCodeAt(i) ^ key.charCodeAt(k));
    }
    const ttcode = base64Decode(code);
    return ttcode;
}

function base64Decode(text) {
    return Crypto.enc.Utf8.stringify(Crypto.enc.Base64.parse(text));
}

function sortt(t) {
    return [...t].sort((a, b) => {
        return a.localeCompare(b);
    }).join('');
}

function getDAesString(data, key, iv) {
    const keyData = Crypto.enc.Utf8.parse(key);
    const ivData = Crypto.enc.Utf8.parse(iv);
    const decrypted = Crypto.AES.decrypt(data, keyData, {
        iv: ivData,
        mode: Crypto.mode.CBC,
        padding: Crypto.pad.Pkcs7
    });
    return Crypto.enc.Utf8.stringify(decrypted);
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