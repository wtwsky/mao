import { Crypto, load, _ } from 'assets://js/lib/cat.js';

let key = 'freeok';
let HOST = 'https://www.freeok.vip';
let CODE_HOST = 'http://api.95man.com:8888';
let siteKey = '';
let siteType = 0;
let taken = '';
const cookie = {};
const SESSID_KEY = 'sessId';

const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1';

async function request(reqUrl) {
    const res = await req(reqUrl, {
        method: 'get',
        headers: {
            'User-Agent': UA,
            'Referer': HOST,
        },
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
}

async function home(filter) {
    const classes = [{'type_id':'1','type_name':'电影'},{'type_id':'2','type_name':'剧集'},{'type_id':'3','type_name':'动漫'},{'type_id':'4','type_name':'综艺'},{'type_id':'5','type_name':'少儿'}];
    const filterObj = {
        '1':[{'key':'class','name':'剧情','init':'','value':[{'n':'全部','v':''},{'n':'动作','v':'动作'},{'n':'喜剧','v':'喜剧'},{'n':'爱情','v':'爱情'},{'n':'科幻','v':'科幻'},{'n':'剧情','v':'剧情'},{'n':'悬疑','v':'悬疑'},{'n':'惊悚','v':'惊悚'},{'n':'恐怖','v':'恐怖'},{'n':'犯罪','v':'犯罪'},{'n':'谍战','v':'谍战'},{'n':'冒险','v':'冒险'},{'n':'奇幻','v':'奇幻'},{'n':'灾难','v':'灾难'},{'n':'战争','v':'战争'},{'n':'动画','v':'动画'},{'n':'歌舞','v':'歌舞'},{'n':'历史','v':'历史'},{'n':'纪录','v':'纪录'},{'n':'其他','v':'其他'}]},{'key':'area','name':'地区','init':'','value':[{'n':'全部','v':''},{'n':'中国大陆','v':'中国大陆'},{'n':'中国香港','v':'中国香港'},{'n':'中国台湾','v':'中国台湾'},{'n':'美国','v':'美国'},{'n':'法国','v':'法国'},{'n':'英国','v':'英国'},{'n':'日本','v':'日本'},{'n':'韩国','v':'韩国'},{'n':'德国','v':'德国'},{'n':'泰国','v':'泰国'},{'n':'印度','v':'印度'},{'n':'意大利','v':'意大利'},{'n':'西班牙','v':'西班牙'},{'n':'加拿大','v':'加拿大'},{'n':'其他','v':'其他'}]},{'key':'lang','name':'语言','init':'','value':[{'n':'全部','v':''},{'n':'国语','v':'国语'},{'n':'英语','v':'英语'},{'n':'粤语','v':'粤语'},{'n':'闽南语','v':'闽南语'},{'n':'韩语','v':'韩语'},{'n':'日语','v':'日语'},{'n':'法语','v':'法语'},{'n':'德语','v':'德语'},{'n':'其它','v':'其它'}]},{'key':'year','name':'年份','init':'','value':[{'n':'全部','v':''},{'n':'2024','v':'2024'},{'n':'2023','v':'2023'},{'n':'2022','v':'2022'},{'n':'2021','v':'2021'},{'n':'2020','v':'2020'},{'n':'2019','v':'2019'},{'n':'2018','v':'2018'},{'n':'2017','v':'2017'},{'n':'2016','v':'2016'},{'n':'2015','v':'2015'},{'n':'2014','v':'2014'},{'n':'2013','v':'2013'},{'n':'2012','v':'2012'},{'n':'2011','v':'2011'},{'n':'2010','v':'2010'}]},{'key':'by','name':'排序','init':'','value':[{'n':'时间','v':'time'},{'n':'人气','v':'hits'},{'n':'评分','v':'score'}]}],
        '2':[{'key':'cateId','name':'类型','init':'2','value':[{'n':'全部','v':'2'},{'n':'国产剧','v':'6'},{'n':'港台剧','v':'7'},{'n':'日韩剧','v':'8'},{'n':'欧美剧','v':'9'},{'n':'海外剧','v':'10'},{'n':'其他剧','v':'11'}]},{'key':'class','name':'剧情','init':'','value':[{'n':'全部','v':''},{'n':'古装','v':'古装'},{'n':'战争','v':'战争'},{'n':'青春偶像','v':'青春偶像'},{'n':'喜剧','v':'喜剧'},{'n':'家庭','v':'家庭'},{'n':'犯罪','v':'犯罪'},{'n':'动作','v':'动作'},{'n':'奇幻','v':'奇幻'},{'n':'剧情','v':'剧情'},{'n':'历史','v':'历史'},{'n':'经典','v':'经典'},{'n':'乡村','v':'乡村'},{'n':'情景','v':'情景'},{'n':'商战','v':'商战'},{'n':'网剧','v':'网剧'},{'n':'其他','v':'其他'}]},{'key':'area','name':'地区','init':'','value':[{'n':'全部','v':''},{'n':'中国大陆','v':'中国大陆'},{'n':'中国香港','v':'中国香港'},{'n':'中国台湾','v':'中国台湾'},{'n':'美国','v':'美国'},{'n':'法国','v':'法国'},{'n':'英国','v':'英国'},{'n':'日本','v':'日本'},{'n':'韩国','v':'韩国'},{'n':'德国','v':'德国'},{'n':'泰国','v':'泰国'},{'n':'印度','v':'印度'},{'n':'意大利','v':'意大利'},{'n':'西班牙','v':'西班牙'},{'n':'加拿大','v':'加拿大'},{'n':'其他','v':'其他'}]},{'key':'lang','name':'语言','init':'','value':[{'n':'全部','v':''},{'n':'国语','v':'国语'},{'n':'英语','v':'英语'},{'n':'粤语','v':'粤语'},{'n':'闽南语','v':'闽南语'},{'n':'韩语','v':'韩语'},{'n':'日语','v':'日语'},{'n':'其它','v':'其它'}]},{'key':'year','name':'年份','init':'','value':[{'n':'全部','v':''},{'n':'2024','v':'2024'},{'n':'2023','v':'2023'},{'n':'2022','v':'2022'},{'n':'2021','v':'2021'},{'n':'2020','v':'2020'},{'n':'2019','v':'2019'},{'n':'2018','v':'2018'},{'n':'2017','v':'2017'},{'n':'2016','v':'2016'},{'n':'2015','v':'2015'},{'n':'2014','v':'2014'},{'n':'2013','v':'2013'},{'n':'2012','v':'2012'},{'n':'2011','v':'2011'},{'n':'2010','v':'2010'}]},{'key':'by','name':'排序','init':'','value':[{'n':'时间','v':'time'},{'n':'人气','v':'hits'},{'n':'评分','v':'score'}]}],
        '3':[{'key':'class','name':'剧情','init':'','value':[{'n':'全部','v':''},{'n':'情感','v':'情感'},{'n':'科幻','v':'科幻'},{'n':'热血','v':'热血'},{'n':'推理','v':'推理'},{'n':'搞笑','v':'搞笑'},{'n':'冒险','v':'冒险'},{'n':'萝莉','v':'萝莉'},{'n':'校园','v':'校园'},{'n':'动作','v':'动作'},{'n':'机战','v':'机战'},{'n':'运动','v':'运动'},{'n':'战争','v':'战争'},{'n':'少年','v':'少年'}]},{'key':'area','name':'地区','init':'','value':[{'n':'全部','v':''},{'n':'中国大陆','v':'中国大陆'},{'n':'中国香港','v':'中国香港'},{'n':'中国台湾','v':'中国台湾'},{'n':'美国','v':'美国'},{'n':'法国','v':'法国'},{'n':'英国','v':'英国'},{'n':'日本','v':'日本'},{'n':'韩国','v':'韩国'},{'n':'德国','v':'德国'},{'n':'泰国','v':'泰国'},{'n':'印度','v':'印度'},{'n':'意大利','v':'意大利'},{'n':'西班牙','v':'西班牙'},{'n':'加拿大','v':'加拿大'},{'n':'其他','v':'其他'}]},{'key':'lang','name':'语言','init':'','value':[{'n':'全部','v':''},{'n':'国语','v':'国语'},{'n':'英语','v':'英语'},{'n':'粤语','v':'粤语'},{'n':'闽南语','v':'闽南语'},{'n':'韩语','v':'韩语'},{'n':'日语','v':'日语'},{'n':'其它','v':'其它'}]},{'key':'year','name':'年份','init':'','value':[{'n':'全部','v':''},{'n':'2024','v':'2024'},{'n':'2023','v':'2023'},{'n':'2022','v':'2022'},{'n':'2021','v':'2021'},{'n':'2020','v':'2020'},{'n':'2019','v':'2019'},{'n':'2018','v':'2018'},{'n':'2017','v':'2017'},{'n':'2016','v':'2016'},{'n':'2015','v':'2015'},{'n':'2014','v':'2014'},{'n':'2013','v':'2013'},{'n':'2012','v':'2012'},{'n':'2011','v':'2011'},{'n':'2010','v':'2010'}]},{'key':'by','name':'排序','init':'','value':[{'n':'时间','v':'time'},{'n':'人气','v':'hits'},{'n':'评分','v':'score'}]}],
        '4':[{'key':'class','name':'剧情','init':'','value':[{'n':'全部','v':''},{'n':'脱口秀','v':'脱口秀'},{'n':'真人秀','v':'真人秀'},{'n':'选秀','v':'选秀'},{'n':'八卦','v':'八卦'},{'n':'访谈','v':'访谈'},{'n':'情感','v':'情感'},{'n':'生活','v':'生活'},{'n':'晚会','v':'晚会'},{'n':'搞笑','v':'搞笑'},{'n':'音乐','v':'音乐'},{'n':'时尚','v':'时尚'},{'n':'游戏','v':'游戏'},{'n':'少儿','v':'少儿'},{'n':'体育','v':'体育'},{'n':'纪实','v':'纪实'},{'n':'科教','v':'科教'},{'n':'曲艺','v':'曲艺'},{'n':'歌舞','v':'歌舞'},{'n':'财经','v':'财经'},{'n':'汽车','v':'汽车'},{'n':'播报','v':'播报'},{'n':'其他','v':'其他'}]},{'key':'area','name':'地区','init':'','value':[{'n':'全部','v':''},{'n':'中国大陆','v':'中国大陆'},{'n':'中国香港','v':'中国香港'},{'n':'中国台湾','v':'中国台湾'},{'n':'美国','v':'美国'},{'n':'法国','v':'法国'},{'n':'英国','v':'英国'},{'n':'日本','v':'日本'},{'n':'韩国','v':'韩国'},{'n':'德国','v':'德国'},{'n':'泰国','v':'泰国'},{'n':'印度','v':'印度'},{'n':'意大利','v':'意大利'},{'n':'西班牙','v':'西班牙'},{'n':'加拿大','v':'加拿大'},{'n':'其他','v':'其他'}]},{'key':'lang','name':'语言','init':'','value':[{'n':'全部','v':''},{'n':'国语','v':'国语'},{'n':'英语','v':'英语'},{'n':'粤语','v':'粤语'},{'n':'闽南语','v':'闽南语'},{'n':'韩语','v':'韩语'},{'n':'日语','v':'日语'},{'n':'其它','v':'其它'}]},{'key':'year','name':'年份','init':'','value':[{'n':'全部','v':''},{'n':'2024','v':'2024'},{'n':'2023','v':'2023'},{'n':'2022','v':'2022'},{'n':'2021','v':'2021'},{'n':'2020','v':'2020'},{'n':'2019','v':'2019'},{'n':'2018','v':'2018'},{'n':'2017','v':'2017'},{'n':'2016','v':'2016'},{'n':'2015','v':'2015'},{'n':'2014','v':'2014'},{'n':'2013','v':'2013'},{'n':'2012','v':'2012'},{'n':'2011','v':'2011'},{'n':'2010','v':'2010'}]},{'key':'by','name':'排序','init':'','value':[{'n':'时间','v':'time'},{'n':'人气','v':'hits'},{'n':'评分','v':'score'}]}],
        '5':[{'key':'by','name':'排序','init':'','value':[{'n':'时间','v':'time'},{'n':'人气','v':'hits'},{'n':'评分','v':'score'}]}],
    }
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
        page = pg;
    }
    const link = HOST + '/vod-show/' + (extend.cateId || tid) + '-' + (extend.area || '') + '-' + (extend.by || '') + '-' + (extend.class || '') + '-' + (extend.lang || '') + '----' + page + '---' + (extend.year || '') + '.html';
    const html = await request(link);
    const $ = load(html);
    const items = $('a.module-item');
    const covers = $('.module-item-cover');
    const videos = _.map(items, (item, index) => {
        const $item = $(item);
        const cover = $(covers[index]);
        const img = cover.find('img:first');
        const remarks = cover.find('div.module-item-note').text().trim();
        return {
            vod_id: $item.attr('href').replace(/.*?\/vod-detail\/(.*).html/g, '$1'),
            vod_name: $item.attr('title'),
            vod_pic: img.attr('data-original'),
            vod_remarks: remarks,
        };
    });
    const hasMore = $('a.page-next:contains(下一页)').length > 0;
    const pgIndex = parseInt(pg);
    const pgCount = hasMore ? pgIndex + 1 : pgIndex;
    const limit = 24;
    return {
        page: pgIndex,
        pagecount: pgCount,
        limit: limit,
        total: limit * pgCount,
        list: videos,
    };
}

async function detail(id) {
    const html = await request(HOST + '/vod-detail/' + id + '.html');
    const $ = load(html);
    const vod = {
        vod_id: id,
        vod_name: $('h1:first').text(),
        vod_type: $('.module-info-tag-link:eq(2) a:first').text().trim(),
        vod_year: $('.module-info-tag-link:eq(0)').text().trim(),
        vod_area: $('.module-info-tag-link:eq(1)').text().trim(),
        vod_director: $('.module-info-item:contains(导演：)').text().trim().substring(3).trim().replace(/\/$/g, ''),
        vod_actor: $('.module-info-item:contains(主演：)').text().trim().substring(3).trim().replace(/\/$/g, ''),
        vod_pic: $('.module-info-poster .module-item-pic img:first').attr('data-original'),
        vod_remarks : $('.module-info-item:contains(集数：)').text().trim().substring(3) || '',
        vod_content: $('.module-info-introduction-content').text().trim(),
    };
    const playMap = {};
    const tabs = $('.module-tab-items-box .module-tab-item');
    const playlists = $('.module-play-list');
    _.each(tabs, (tab, i) => {
        const $tab = $(tab);
        const from = $tab.text().trim();
        if (from.includes('夸克')) {
            return;
        }
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
    const $ = load(html, true);
    const js = JSON.parse($('script:contains(player_)').html().replace('var player_aaaa=',''));
    let playUrl = js.url;
    if (js.encrypt == 1) {
        playUrl = unescape(playUrl);
    } else if (js.encrypt == 2) {
        playUrl = unescape(base64Decode(playUrl));
    }
    const playHtml = await request(HOST + '/okplayer/?url=' + playUrl);
    playUrl = decryptUrl(playHtml);
    return {
        parse: 0,
        url: playUrl,
        header: {
            'User-Agent': UA,
        }
    };
}

function decryptUrl(html) {
    const result = html.match(/var config = {[\w\W]*}[\w\W]*player/);
    const jsConfig = eval(result[0].replace(/player$/g, ';config'));
    const url = jsConfig.url;
    const $ = load(html);
    const textStr = $('meta[name="viewport"]').attr('id').replace('now_', '');
    const idStr = $('meta[charset="UTF-8"]').attr('id').replace('now_', '');
    let keyList = [];
    let sortedList = [];
    let keyStr = '';
    for (let index = 0; index < idStr.length; index++) {
        keyList.push({
            id: idStr[index],
            text: textStr[index]
        });
    }
    sortedList = keyList.sort((a, b)=> a.id - b.id);
    for (const item of sortedList) {
        keyStr += item.text;
    }
    const md5Key = md5X(keyStr + 'freeok@2024');
    const endStr = Crypto.enc.Utf8.parse(md5Key.substring(16));
    const iv = Crypto.enc.Utf8.parse(md5Key.substring(0, 16));
    const decrypted = Crypto.AES.decrypt(url, endStr, {
        iv: iv,
        mode: Crypto.mode.CBC,
        padding: Crypto.pad.Pkcs7,
    });
    const decryptedUrl = Crypto.enc.Utf8.stringify(decrypted);
    return decryptedUrl;
}

function base64Decode(text) {
    return Crypto.enc.Utf8.stringify(Crypto.enc.Base64.parse(text));
}

async function search(wd, quick, pg) {
    if (pg <= 0) pg = 1;
    let page = '';
    if (pg > 1) {
        page = pg;
    }
    const headers = {
        'User-Agent': UA,
        'Referer': HOST,
        'Cookie': getCookie(),
    };
    const searchUrl = HOST + '/so1so/' + encodeURIComponent(wd) + '----------' + page + '---.html';
    let resp = await req(searchUrl, {
        method: 'get',
        headers: headers,
    });
    const lastTime = new Date().getTime();
    let html = resp.content;
    let $ = load(html);
    const $captcha = $('input.mac_verify');
    if (!_.isEmpty($captcha)) {
        await parseSetCookie(resp.headers);
        headers['Cookie'] = getCookie();
        let verify = false;
        let count = 0;
        do {
            count++;
            verify = await autoVerifyCaptcha(headers, searchUrl);
        } while(!verify && count <= 1);
        if (verify) {
            const currTime = new Date().getTime();
            let diff = currTime - lastTime;
            if (diff < 0) {
                diff = 0;
            }
            await sleep(5000 - diff); //限制了5秒搜索一次
            resp = await req(searchUrl,  {
                method: 'get',
                headers: headers,
            });
            html = resp.content;
            $ = load(html);
        } else {
            return {
                list: [],
            };
        }
    }
    const items = $('div.module-card-item');
    const videos = _.map(items, (item) => {
        const $item = $(item);
        const title = $item.find('.module-card-item-title a:first');
        const cover = $item.find('.module-item-cover');
        const img = cover.find('img:first');
        const remarks = cover.find('.module-item-note').text().trim();
        return {
            vod_id: title.attr('href').replace(/.*?\/vod-detail\/(.*).html/g, '$1'),
            vod_name: title.text().trim(),
            vod_pic: img.attr('data-original'),
            vod_remarks: remarks,
        };
    });
    const hasMore = $('a.page-next:contains(下一页)').length > 0;
    const pgIndex = parseInt(pg);
    const pgCount = hasMore ? pgIndex + 1 : pgIndex;
    const limit = 16;
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

async function autoVerifyCaptcha(headers, searchUrl) {
    const captcha = await getCaptchaValue(searchUrl);
    const result = await req(HOST + '/index.php/ajax/verify_check?type=search&verify=' + captcha, {
        method: 'post',
        headers: _.merge({}, headers, {
            'X-Requested-With': 'XMLHttpRequest',
            'Referer': searchUrl,
        }),
        data: {},
    });
    const json = JSON.parse(result.content);
    return json.code == 1;
}

async function getCaptchaValue(searchUrl) {
    const reqUrl = HOST + '/index.php/verify/index.html?';
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
    const postUrl = CODE_HOST + '/api/Http/Recog?Taken=' + taken + '&imgtype=2&len=4';
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

function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
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