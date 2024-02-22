import { load, _ } from 'assets://js/lib/cat.js';

let key = 'saohuo';
let siteUrl = 'http://shapp.us';
let HOST = '';
let CODE_HOST = 'http://api.95man.com:8888';
let siteKey = '';
let siteType = 0;
let taken = '';
const cookie = {};
const SESSID_KEY = 'sessId';

const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1';

async function request(reqUrl, referer, method, data) {
    const res = await req(reqUrl, {
        method: method || 'get',
        headers: {
            'User-Agent': UA,
            'Referer': referer || HOST,
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
    if (cfg.hasOwnProperty('ext')) {
        if (cfg.ext.hasOwnProperty('host')) {
            HOST = cfg.ext.host;
        }
        if (cfg.ext.hasOwnProperty('taken')) {
            taken = cfg.ext.taken;
        }
    }
    const sessId = await local.get(key, SESSID_KEY);
    if (!_.isEmpty(sessId)) {
        cookie.PHPSESSID = sessId;
    }
    if (_.isEmpty(HOST)) {
        HOST = await checkValidUrl();
    }
}

async function checkValidUrl() {
    let validUrl = '';
    const html = await request(siteUrl);
    const $ = load(html);
    const links = $('.main a');
    if (!_.isEmpty(links)) {
        validUrl = $(links[0]).attr('href');
    }
    return validUrl;
}

async function home(filter) {
    const classes = [{'type_id':'1','type_name':'电影'},{'type_id':'2','type_name':'电视剧'},{'type_id':'4','type_name':'动漫'}];
    const filterObj = {
        '1':[{'key':'cateId','name':'类型','init':'1','value':[{'v':'1','n':'全部'},{'v':'6','n':'喜剧'},{'v':'7','n':'爱情'},{'v':'8','n':'恐怖'},{'v':'9','n':'动作'},{'v':'10','n':'科幻'},{'v':'11','n':'战争'},{'v':'12','n':'犯罪'},{'v':'13','n':'动画'},{'v':'14','n':'奇幻'},{'v':'15','n':'剧情'},{'v':'16','n':'冒险'},{'v':'17','n':'悬疑'},{'v':'18','n':'惊悚'},{'v':'19','n':'其它'}]}],
        '2':[{'key':'cateId','name':'类型','init':'2','value':[{'v':'2','n':'全部'},{'v':'20','n':'大陆'},{'v':'21','n':'TVB'},{'v':'22','n':'韩剧'},{'v':'23','n':'美剧'},{'v':'24','n':'日剧'},{'v':'25','n':'英剧'},{'v':'26','n':'台剧'},{'v':'27','n':'其它'}]}],
        '4':[{'key':'cateId','name':'类型','init':'4','value':[{'v':'4','n':'全部'},{'v':'38','n':'搞笑'},{'v':'39','n':'恋爱'},{'v':'40','n':'热血'},{'v':'41','n':'格斗'},{'v':'42','n':'美少女'},{'v':'43','n':'魔法'},{'v':'44','n':'机战'},{'v':'45','n':'校园'},{'v':'46','n':'亲子'},{'v':'47','n':'童话'},{'v':'48','n':'冒险'},{'v':'49','n':'真人'},{'v':'50','n':'LOLI'},{'v':'51','n':'其它'}]}],
        // '28':[{'key':'cateId','name':'综艺','init':'28','value':[{'v':'28','n':'脱口秀'},{'v':'29','n':'真人秀'},{'v':'30','n':'选秀'},{'v':'31','n':'美食'},{'v':'32','n':'旅游'},{'v':'33','n':'汽车'},{'v':'34','n':'访谈'},{'v':'35','n':'纪实'},{'v':'36','n':'搞笑'},{'v':'37','n':'其它'}]}]
    };
    return {
        class: classes,
        filters: filterObj,
    };
}

async function category(tid, pg, filter, extend) {
    if (pg <= 0) pg = 1;
    let page = '';
    if (pg > 1) {
        page = '-' + pg;
    }
    const url = HOST + '/list/' + (extend.cateId || tid) + page + '.html';
    const html = await request(url);
    const $ = load(html);
    const items = $('.v_list li:not([class])');
    const videos = _.map(items, (item) => {
        const $item = $(item);
        const link = $item.find('a:first').attr('href');
        const title = $item.find('.v_title').text().trim();
        const img = $item.find('img:first').attr('data-original');
        const remarks = $item.find('.v_note').text().trim();
        return {
            vod_id: link.replace(/\/movie\/(.*)\.html/g, '$1'),
            vod_name: title,
            vod_pic: img,
            vod_remarks: remarks,
        };
    });
    const hasMore = $('.page a:contains(下一页)').length > 0;
    const pgIndex = parseInt(pg);
    const pgCount = hasMore ? pgIndex + 1 : pgIndex;
    const limit = 36;
    return {
        page: pgIndex,
        pagecount: pgCount,
        limit: limit,
        total: limit * pgCount,
        list: videos,
    };
}

async function detail(id) {
    const html = await request(HOST + '/movie/' + id + '.html');
    const $ = load(html);
    const info = $('.v_info_box p').text();
    const infoData = info.split('\/');
    const vod = {
        vod_id: id,
        vod_name: $('h1.v_title').text().trim(),
        vod_director: matchData(info, /导演：(.*?)\//),
        vod_actor: matchData(info, /主演：(.*)/),
        vod_pic: $('.m_background').attr('style').match(/url\((.*)\)/)[1],
        vod_content: $('.p_txt').text().trim(),
    };
    const playMap = {};
    const tabs = $('.from_list li');
    const playlists = $('#play_link li');
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

function matchData(info, regex) {
    const matches = info.match(regex);
    if (!_.isEmpty(matches)) {
        return matches[1].trim();
    }
    return '';
}

async function play(flag, id, flags) {
    let html = await request(HOST + id);
    let $ = load(html);
    const iframeSrc = $('iframe:first').attr('src');
    let apiUrl = '';
    if (/play\.hhplayer/.test(iframeSrc)) {
        apiUrl = 'https://play.hhplayer.com/hhjx/api.php';
    } else {
        const matches = iframeSrc.match(/(.*\:\/\/.*?\/)/);
        if (!_.isEmpty(matches)) {
            apiUrl = matches[1] + 'api.php';
        }
    }
    html = await request(iframeSrc);
    $ = load(html);
    const script = $('body script:first').html();
    const url = script.match(/var url = \"(.*)\";/)[1];
    const t = script.match(/var t = \"(.*)\";/)[1];
    const key = script.match(/var key = \"(.*)\";/)[1];
    const act = script.match(/var act = \"(.*)\";/)[1];
    const play = script.match(/var play = \"(.*)\";/)[1];
    const param = {
        url: url,
        t: t,
        key: key,
        act: act,
        play: play,
    };
    const resp = await request(apiUrl, iframeSrc, 'post', param);
    const json = JSON.parse(resp);
    let playUrl = json.url;
    if (!playUrl.startsWith('http')) {
        playUrl = 'https://api.hhplayer.com' + playUrl;
    }
    return {
        parse: 0,
        url: playUrl,
        header: {
            'User-Agent': UA,
        }
    };
}

async function search(wd, quick, pg) {
    if (pg <= 0) pg = 1;
    const headers = {
        'User-Agent': UA,
        'Referer': HOST,
        'Cookie': getCookie(),
    };
    const searchUrl = HOST + '/search.php?page=' + pg + '&searchword=' + encodeURIComponent(wd) + '&searchtype=';
    let resp = await req(searchUrl, {
        method: 'get',
        headers: headers,
    });
    let html = resp.content;
    let $ = load(html);
    const $captcha = $('img#vdimgck');
    if (!_.isEmpty($captcha)) {
        await parseSetCookie(resp.headers);
        headers['Cookie'] = getCookie();
        let captcha = '';
        let count = 0;
        do {
            count++;
            captcha = await getCaptchaValue(searchUrl);
        } while(_.isEmpty(captcha) && count <= 1);
        if (!_.isEmpty(captcha)) {
            const param = {
                validate: captcha,
                searchword: wd,
            };
            resp = await req(HOST + '/search.php?scheckAC=check&page=&searchtype=&order=&tid=&area=&year=&letter=&yuyan=&state=&money=&ver=&jq=',  {
                method: 'post',
                headers: headers,
                data: param,
                postType: 'form',
            });
            html = resp.content;
            $ = load(html);
        } else {
            return {
                list: [],
            };
        }
    }
    const items = $('.v_list li:not([class])');
    const videos = _.map(items, (item) => {
        const $item = $(item);
        const link = $item.find('a:first').attr('href');
        const title = $item.find('.v_title').text().trim();
        const img = $item.find('img:first').attr('data-original');
        const remarks = $item.find('.v_note').text().trim();
        return {
            vod_id: link.replace(/\/movie\/(.*)\.html/g, '$1'),
            vod_name: title,
            vod_pic: img,
            vod_remarks: remarks,
        };
    });
    const hasMore = $('.page a:contains(下一页)').length > 0;
    const pgIndex = parseInt(pg);
    const pgCount = hasMore ? pgIndex + 1 : pgIndex;
    const limit = 36;
    return {
        page: pgIndex,
        pagecount: pgCount,
        limit: limit,
        total: limit * pgCount,
        list: videos,
    };
}

async function parseSetCookie(headers) {
    const setCookie = _.isArray(headers['set-cookie']) ? headers['set-cookie'].join(';') : headers['set-cookie'];
    if (!setCookie) {
        return;
    }
    const cks = setCookie.split(';');
    for (const c of cks) {
        const tmp = c.trim();
        if (tmp.startsWith('PHPSESSID=')) {
            cookie.PHPSESSID = tmp.substring(10);
            await local.set(key, SESSID_KEY, cookie.PHPSESSID);
            break;
        }
    }
}

function getCookie() {
    return _.map(cookie, (value, key) => {
            return `${key}=${value}`;
        }).join(';');
}

async function getCaptchaValue(searchUrl) {
    const reqUrl = HOST + '/include/vdimgck.php';
    const res = await req(reqUrl, {
        method: 'get',
        headers: {
            'User-Agent': UA,
            'Referer': searchUrl,
            'Cookie': getCookie(),
        },
        buffer: 2,
    });
    const imgBase64 = res.content;
    const postUrl = CODE_HOST + '/api/Http/Recog?Taken=' + taken + '&imgtype=1&len=4';
    const param = {
        'ImgBase64': encodeURIComponent(imgBase64),
    };
    const resp = await req(postUrl, {
        method: 'post',
        data: param,
        postType: 'form',
    });
    const data = resp.content.split('|');
    let result = '';
    if (data[0] && parseInt(data[0]) > 0) {
        result = data[1];
    }
    return result;
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