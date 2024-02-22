import { Crypto, load, _ } from 'assets://js/lib/cat.js';

let key = 'maolvys';
let HOST = 'https://www.maolvys.com';
let siteKey = '';
let siteType = 0;
let cookie = '';

const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1';

async function request(reqUrl) {
    const headers = {
        'User-Agent': UA,
        'Referer': HOST,
    };
    if (!_.isEmpty(cookie)) {
        headers['Cookie'] = cookie;
    }
    let res = await req(reqUrl, {
        method: 'get',
        headers: headers,
    });
    if (res.code == 403) {
        const path = res.content.match(/window\.location\.href ="(.*?)"/)[1];
        const setCookie = _.isArray(res.headers['set-cookie']) ? res.headers['set-cookie'].join(';') : res.headers['set-cookie'];
        cookie = setCookie;
        headers['Cookie'] = cookie;
        res = await req(HOST + path, {
            method: 'get',
            headers: headers,
        });
    }
    return res.content;
}

// cfg = {skey: siteKey, ext: extend}
async function init(cfg) {
    siteKey = cfg.skey;
    siteType = cfg.stype;
    if (!_.isEmpty(cfg.ext)) {
        HOST = cfg.ext;
    }
}

async function home(filter) {
    const classes = [{'type_name':'电影','type_id':'1'},{'type_name':'电视剧','type_id':'2'},{'type_name':'综艺','type_id':'3'},{'type_name':'动漫','type_id':'4'}];
    const filterObj = {
        '1':[{'key':'class','name':'类型','init':'','value':[{'n':'全部','v':''},{'n':'喜剧','v':'喜剧'},{'n':'爱情','v':'爱情'},{'n':'恐怖','v':'恐怖'},{'n':'动作','v':'动作'},{'n':'科幻','v':'科幻'},{'n':'剧情','v':'剧情'},{'n':'战争','v':'战争'},{'n':'警匪','v':'警匪'},{'n':'犯罪','v':'犯罪'},{'n':'动画','v':'动画'},{'n':'奇幻','v':'奇幻'},{'n':'武侠','v':'武侠'},{'n':'冒险','v':'冒险'},{'n':'枪战','v':'枪战'},{'n':'悬疑','v':'悬疑'},{'n':'惊悚','v':'惊悚'},{'n':'经典','v':'经典'},{'n':'青春','v':'青春'},{'n':'文艺','v':'文艺'},{'n':'微电影','v':'微电影'},{'n':'古装','v':'古装'},{'n':'历史','v':'历史'},{'n':'运动','v':'运动'},{'n':'农村','v':'农村'},{'n':'儿童','v':'儿童'},{'n':'网络电影','v':'网络电影'}]},{'key':'area','name':'地区','init':'','value':[{'n':'全部','v':''},{'n':'大陆','v':'大陆'},{'n':'香港','v':'香港'},{'n':'台湾','v':'台湾'},{'n':'美国','v':'美国'},{'n':'法国','v':'法国'},{'n':'英国','v':'英国'},{'n':'日本','v':'日本'},{'n':'韩国','v':'韩国'},{'n':'德国','v':'德国'},{'n':'泰国','v':'泰国'},{'n':'印度','v':'印度'},{'n':'意大利','v':'意大利'},{'n':'西班牙','v':'西班牙'},{'n':'加拿大','v':'加拿大'},{'n':'其他','v':'其他'}]},{'key':'year','name':'年份','init':'','value':[{'n':'全部','v':''},{'n':'2024','v':'2024'},{'n':'2023','v':'2023'},{'n':'2022','v':'2022'},{'n':'2021','v':'2021'},{'n':'2020','v':'2020'},{'n':'2019','v':'2019'},{'n':'2018','v':'2018'},{'n':'2017','v':'2017'},{'n':'2016','v':'2016'},{'n':'2015','v':'2015'},{'n':'2014','v':'2014'},{'n':'2013','v':'2013'},{'n':'2012','v':'2012'},{'n':'2010','v':'2010'},{'n':'2009','v':'2009'},{'n':'2008','v':'2008'},{'n':'2007','v':'2007'},{'n':'2006','v':'2006'},{'n':'2005','v':'2005'},{'n':'2004','v':'2004'}]},{'key':'lang','name':'语言','init':'','value':[{'n':'全部','v':''},{'n':'国语','v':'国语'},{'n':'英语','v':'英语'},{'n':'粤语','v':'粤语'},{'n':'闽南语','v':'闽南语'},{'n':'韩语','v':'韩语'},{'n':'日语','v':'日语'},{'n':'法语','v':'法语'},{'n':'德语','v':'德语'},{'n':'其它','v':'其它'}]},{'key':'version','name':'版本','init':'','value':[{'n':'全部','v':''},{'n':'高清版','v':'高清版'},{'n':'剧场版','v':'剧场版'},{'n':'抢先版','v':'抢先版'},{'n':'OVA','v':'OVA'},{'n':'TV','v':'TV'},{'n':'影院版','v':'影院版'}]},{'key':'letter','name':'字母','init':'','value':[{'n':'全部','v':''},{'n':'A','v':'A'},{'n':'B','v':'B'},{'n':'C','v':'C'},{'n':'D','v':'D'},{'n':'E','v':'E'},{'n':'F','v':'F'},{'n':'G','v':'G'},{'n':'H','v':'H'},{'n':'I','v':'I'},{'n':'J','v':'J'},{'n':'K','v':'K'},{'n':'L','v':'L'},{'n':'M','v':'M'},{'n':'N','v':'N'},{'n':'O','v':'O'},{'n':'P','v':'P'},{'n':'Q','v':'Q'},{'n':'R','v':'R'},{'n':'S','v':'S'},{'n':'T','v':'T'},{'n':'U','v':'U'},{'n':'V','v':'V'},{'n':'W','v':'W'},{'n':'X','v':'X'},{'n':'Y','v':'Y'},{'n':'Z','v':'Z'},{'n':'0-9','v':'0-9'}]},{'key':'by','name':'排序','value':[{'n':'时间','v':'time'},{'n':'人气','v':'hits'},{'n':'评分','v':'score'}]}],
        '2':[{'key':'class','name':'类型','init':'','value':[{'n':'全部','v':''},{'n':'古装','v':'古装'},{'n':'战争','v':'战争'},{'n':'青春偶像','v':'青春偶像'},{'n':'喜剧','v':'喜剧'},{'n':'家庭','v':'家庭'},{'n':'犯罪','v':'犯罪'},{'n':'动作','v':'动作'},{'n':'奇幻','v':'奇幻'},{'n':'剧情','v':'剧情'},{'n':'历史','v':'历史'},{'n':'经典','v':'经典'},{'n':'乡村','v':'乡村'},{'n':'情景','v':'情景'},{'n':'商战','v':'商战'},{'n':'网剧','v':'网剧'},{'n':'其他','v':'其他'}]},{'key':'area','name':'地区','init':'','value':[{'n':'全部','v':''},{'n':'内地','v':'内地'},{'n':'韩国','v':'韩国'},{'n':'香港','v':'香港'},{'n':'台湾','v':'台湾'},{'n':'日本','v':'日本'},{'n':'美国','v':'美国'},{'n':'泰国','v':'泰国'},{'n':'英国','v':'英国'},{'n':'新加坡','v':'新加坡'},{'n':'其他','v':'其他'}]},{'key':'year','name':'年份','init':'','value':[{'n':'全部','v':''},{'n':'2024','v':'2024'},{'n':'2023','v':'2023'},{'n':'2022','v':'2022'},{'n':'2021','v':'2021'},{'n':'2020','v':'2020'},{'n':'2019','v':'2019'},{'n':'2018','v':'2018'},{'n':'2017','v':'2017'},{'n':'2016','v':'2016'},{'n':'2015','v':'2015'},{'n':'2014','v':'2014'},{'n':'2013','v':'2013'},{'n':'2012','v':'2012'},{'n':'2010','v':'2010'},{'n':'2009','v':'2009'},{'n':'2008','v':'2008'},{'n':'2007','v':'2007'},{'n':'2006','v':'2006'},{'n':'2005','v':'2005'},{'n':'2004','v':'2004'}]},{'key':'lang','name':'语言','init':'','value':[{'n':'全部','v':''},{'n':'国语','v':'国语'},{'n':'英语','v':'英语'},{'n':'粤语','v':'粤语'},{'n':'闽南语','v':'闽南语'},{'n':'韩语','v':'韩语'},{'n':'日语','v':'日语'},{'n':'其它','v':'其它'}]},{'key':'version','name':'版本','init':'','value':[{'n':'全部','v':''},{'n':'高清版','v':'高清版'},{'n':'剧场版','v':'剧场版'},{'n':'抢先版','v':'抢先版'},{'n':'OVA','v':'OVA'},{'n':'TV','v':'TV'},{'n':'影院版','v':'影院版'}]},{'key':'letter','name':'字母','init':'','value':[{'n':'全部','v':''},{'n':'A','v':'A'},{'n':'B','v':'B'},{'n':'C','v':'C'},{'n':'D','v':'D'},{'n':'E','v':'E'},{'n':'F','v':'F'},{'n':'G','v':'G'},{'n':'H','v':'H'},{'n':'I','v':'I'},{'n':'J','v':'J'},{'n':'K','v':'K'},{'n':'L','v':'L'},{'n':'M','v':'M'},{'n':'N','v':'N'},{'n':'O','v':'O'},{'n':'P','v':'P'},{'n':'Q','v':'Q'},{'n':'R','v':'R'},{'n':'S','v':'S'},{'n':'T','v':'T'},{'n':'U','v':'U'},{'n':'V','v':'V'},{'n':'W','v':'W'},{'n':'X','v':'X'},{'n':'Y','v':'Y'},{'n':'Z','v':'Z'},{'n':'0-9','v':'0-9'}]},{'key':'by','name':'排序','value':[{'n':'时间','v':'time'},{'n':'人气','v':'hits'},{'n':'评分','v':'score'}]}],
        '3':[{'key':'class','name':'类型','init':'','value':[{'n':'全部','v':''},{'n':'选秀','v':'选秀'},{'n':'情感','v':'情感'},{'n':'访谈','v':'访谈'},{'n':'播报','v':'播报'},{'n':'旅游','v':'旅游'},{'n':'音乐','v':'音乐'},{'n':'美食','v':'美食'},{'n':'纪实','v':'纪实'},{'n':'曲艺','v':'曲艺'},{'n':'生活','v':'生活'},{'n':'游戏互动','v':'游戏互动'},{'n':'财经','v':'财经'},{'n':'求职','v':'求职'}]},{'key':'area','name':'地区','init':'','value':[{'n':'全部','v':''},{'n':'内地','v':'内地'},{'n':'港台','v':'港台'},{'n':'日韩','v':'日韩'},{'n':'欧美','v':'欧美'}]},{'key':'year','name':'年份','init':'','value':[{'n':'全部','v':''},{'n':'2024','v':'2024'},{'n':'2023','v':'2023'},{'n':'2022','v':'2022'},{'n':'2021','v':'2021'},{'n':'2020','v':'2020'},{'n':'2019','v':'2019'},{'n':'2018','v':'2018'},{'n':'2017','v':'2017'},{'n':'2016','v':'2016'},{'n':'2015','v':'2015'},{'n':'2014','v':'2014'},{'n':'2013','v':'2013'},{'n':'2012','v':'2012'},{'n':'2010','v':'2010'},{'n':'2009','v':'2009'},{'n':'2008','v':'2008'},{'n':'2007','v':'2007'},{'n':'2006','v':'2006'},{'n':'2005','v':'2005'},{'n':'2004','v':'2004'}]},{'key':'lang','name':'语言','init':'','value':[{'n':'全部','v':''},{'n':'国语','v':'国语'},{'n':'英语','v':'英语'},{'n':'粤语','v':'粤语'},{'n':'闽南语','v':'闽南语'},{'n':'韩语','v':'韩语'},{'n':'日语','v':'日语'},{'n':'其它','v':'其它'}]},{'key':'letter','name':'字母','init':'','value':[{'n':'全部','v':''},{'n':'A','v':'A'},{'n':'B','v':'B'},{'n':'C','v':'C'},{'n':'D','v':'D'},{'n':'E','v':'E'},{'n':'F','v':'F'},{'n':'G','v':'G'},{'n':'H','v':'H'},{'n':'I','v':'I'},{'n':'J','v':'J'},{'n':'K','v':'K'},{'n':'L','v':'L'},{'n':'M','v':'M'},{'n':'N','v':'N'},{'n':'O','v':'O'},{'n':'P','v':'P'},{'n':'Q','v':'Q'},{'n':'R','v':'R'},{'n':'S','v':'S'},{'n':'T','v':'T'},{'n':'U','v':'U'},{'n':'V','v':'V'},{'n':'W','v':'W'},{'n':'X','v':'X'},{'n':'Y','v':'Y'},{'n':'Z','v':'Z'},{'n':'0-9','v':'0-9'}]},{'key':'by','name':'排序','value':[{'n':'时间','v':'time'},{'n':'人气','v':'hits'},{'n':'评分','v':'score'}]}],
        '4':[{'key':'class','name':'类型','init':'','value':[{'n':'全部','v':''},{'n':'情感','v':'情感'},{'n':'科幻','v':'科幻'},{'n':'热血','v':'热血'},{'n':'推理','v':'推理'},{'n':'搞笑','v':'搞笑'},{'n':'冒险','v':'冒险'},{'n':'萝莉','v':'萝莉'},{'n':'校园','v':'校园'},{'n':'动作','v':'动作'},{'n':'机战','v':'机战'},{'n':'运动','v':'运动'},{'n':'战争','v':'战争'},{'n':'少年','v':'少年'},{'n':'少女','v':'少女'},{'n':'社会','v':'社会'},{'n':'原创','v':'原创'},{'n':'亲子','v':'亲子'},{'n':'益智','v':'益智'},{'n':'励志','v':'励志'},{'n':'其他','v':'其他'}]},{'key':'area','name':'地区','init':'','value':[{'n':'全部','v':''},{'n':'国产','v':'国产'},{'n':'日本','v':'日本'},{'n':'欧美','v':'欧美'},{'n':'其他','v':'其他'}]},{'key':'year','name':'年份','init':'','value':[{'n':'全部','v':''},{'n':'2024','v':'2024'},{'n':'2023','v':'2023'},{'n':'2022','v':'2022'},{'n':'2021','v':'2021'},{'n':'2020','v':'2020'},{'n':'2019','v':'2019'},{'n':'2018','v':'2018'},{'n':'2017','v':'2017'},{'n':'2016','v':'2016'},{'n':'2015','v':'2015'},{'n':'2014','v':'2014'},{'n':'2013','v':'2013'},{'n':'2012','v':'2012'},{'n':'2010','v':'2010'},{'n':'2009','v':'2009'},{'n':'2008','v':'2008'},{'n':'2007','v':'2007'},{'n':'2006','v':'2006'},{'n':'2005','v':'2005'},{'n':'2004','v':'2004'}]},{'key':'lang','name':'语言','init':'','value':[{'n':'全部','v':''},{'n':'国语','v':'国语'},{'n':'英语','v':'英语'},{'n':'粤语','v':'粤语'},{'n':'闽南语','v':'闽南语'},{'n':'韩语','v':'韩语'},{'n':'日语','v':'日语'},{'n':'其它','v':'其它'}]},{'key':'version','name':'版本','init':'','value':[{'n':'全部','v':''},{'n':'TV版','v':'TV版'},{'n':'电影版','v':'电影版'},{'n':'OVA版','v':'OVA版'},{'n':'真人版','v':'真人版'}]},{'key':'letter','name':'字母','init':'','value':[{'n':'全部','v':''},{'n':'A','v':'A'},{'n':'B','v':'B'},{'n':'C','v':'C'},{'n':'D','v':'D'},{'n':'E','v':'E'},{'n':'F','v':'F'},{'n':'G','v':'G'},{'n':'H','v':'H'},{'n':'I','v':'I'},{'n':'J','v':'J'},{'n':'K','v':'K'},{'n':'L','v':'L'},{'n':'M','v':'M'},{'n':'N','v':'N'},{'n':'O','v':'O'},{'n':'P','v':'P'},{'n':'Q','v':'Q'},{'n':'R','v':'R'},{'n':'S','v':'S'},{'n':'T','v':'T'},{'n':'U','v':'U'},{'n':'V','v':'V'},{'n':'W','v':'W'},{'n':'X','v':'X'},{'n':'Y','v':'Y'},{'n':'Z','v':'Z'},{'n':'0-9','v':'0-9'}]},{'key':'by','name':'排序','value':[{'n':'时间','v':'time'},{'n':'人气','v':'hits'},{'n':'评分','v':'score'}]}],
    };
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
    const clazz = getFilterUrlPart(extend, 'class');
    const area = getFilterUrlPart(extend, 'area');
    const by = getFilterUrlPart(extend, 'by');
    const lang = getFilterUrlPart(extend, 'lang');
    const letter = getFilterUrlPart(extend, 'letter');
    const version = getFilterUrlPart(extend, 'version');
    const year = getFilterUrlPart(extend, 'year');
    const reqUrl = HOST + '/vod/show' + area + by + clazz + '/id/' + (extend.cateId || tid) + lang + page + letter + version + year + '.html';
    const html = await request(reqUrl);
    const $ = load(html);
    const items = $('.public-list-box');
    const videos = _.map(items, (item) => {
        const $item = $(item);
        const link = $item.find('a:first').attr('href');
        const title = $item.find('.time-title').text().trim();
        const img = $item.find('img:first').attr('data-src');
        const remarks = $item.find('.public-list-prb').text().trim();
        return {
            vod_id: link.replace(/\/vod\/detail\/id\/(.*)\//g, '$1'),
            vod_name: title,
            vod_pic: img,
            vod_remarks: remarks,
        };
    });
    const hasMore = $('.page-info a:contains(下一页)').length > 0;
    const pgIndex = parseInt(pg);
    const pgCount = hasMore ? pgIndex + 1 : pgIndex;
    const limit = 40;
    return {
        page: pgIndex,
        pagecount: pgCount,
        limit: limit,
        total: limit * pgCount,
        list: videos,
    };
}

function getFilterUrlPart(extend, part) {
    let result = '';
    if (extend[part]) {
        result = '/' + part + '/' + extend[part];
    }
    return result;
}

async function detail(id) {
    const html = await request(HOST + '/vod/detail/id/' + id + '.html');
    const $ = load(html);
    const vod = {
        vod_id: id,
        vod_name: $('.slide-info-title').text(),
        type_name: $('.search-show li:contains(类型) a:last').text(),
        vod_area: $('.search-show li:contains(地区)').text().substring(3),
        vod_year: $('.search-show li:contains(年份)').text().substring(3),
        vod_lang: $('.search-show li:contains(语言)').text().substring(3),
        vod_pic: $('.detail-pic img:first').attr('data-src'),
        vod_remarks : $('.search-show li:contains(状态)').text().substring(3),
        vod_content: $('#height_limit').text(),
    };
    const playMap = {};
    const tabs = $('.anthology-tab a');
    const playlists = $('.anthology-list-play');
    _.each(tabs, (tab, i) => {
        const $tab = $(tab);
        const from = $tab.text().trim();
        let list = playlists[i];
        list = $(list).find('a');
        _.each(list, (it) => {
            const $it = $(it);
            const title = $it.text();
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
    let $ = load(html);
    const scriptData = $('script:contains(player_aaaa)').html().replace('var player_aaaa=','');
    const js = JSON.parse(scriptData);
    let playUrl = js.url;
    if (js.encrypt == 1) {
        playUrl = unescape(playUrl);
    } else if (js.encrypt == 2) {
        playUrl = unescape(base64Decode(playUrl));
    }
    const playerUrl = HOST + '/player/?url=';
    const fullUrl = playerUrl + playUrl;
    const playHtml = await request(fullUrl);
    const matches = playHtml.match(/var config = {([\w\W]*?)}/);
    const config = JSON.parse('{' + matches[1] + '}');
    if (!isVideoFormat(config.url)) {
        const decodedToken = decodeData(config.token);
        const param = {
            url: config.url,
            title: config.title,
            time: config.time,
            token: getDecryptData(decodedToken),
        };
        const parseUrl = HOST + '/player/MiKA.php';
        const keys = playHtml.match(/var _0x185315='(.*?)';/);
        const postData = encodeData(JSON.stringify(param), keys[1]);
        const resp = await req(parseUrl, {
            method: 'post',
            headers: {
                'User-Agent': UA,
                'Origin': HOST,
                'Content-Type': 'text/plain;charset=utf-8',
                'MiKA': postData,
            },
            data: postData,
        });
        const respData = decodeData(resp.content);
        const json = JSON.parse(respData);
        playUrl = json.url;
    } else {
        playUrl = config.url;
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

function base64Decode(text) {
    return Crypto.enc.Utf8.stringify(Crypto.enc.Base64.parse(text));
}

function base64Encode(text) {
    return Crypto.enc.Base64.stringify(Crypto.enc.Utf8.parse(text));
}

function atob(text) {
    return Crypto.enc.Latin1.stringify(Crypto.enc.Base64.parse(text));
}

function btoa(text) {
    return Crypto.enc.Base64.stringify(Crypto.enc.Latin1.parse(text));
}

function decodeData(data) {
    const key = 'e950ca022a249e264dc9c3d0970fe849';
    const bytes = atob(data);
    const result = handleBytes(bytes, key);
    return decodeURIComponent(result);
}

function handleBytes(bytes, key) {
    let result = '';
    const keyLength = key.length;
    const byteLength = bytes.length;
    const arr1 = []
    const arr2 = [];
    for (let i = 0; i < 256; i++) {
        arr1[i] = key[i % keyLength].charCodeAt(),
        arr2[i] = i;
    }
    let j = 0;
    for (let i = 0; i < 256; i++) {
        j = (j + arr2[i] + arr1[i]) % 256;
        const tmp = arr2[i];
        arr2[i] = arr2[j];
        arr2[j] = tmp;
    }
    let a = 0;
    j = 0;
    for (let i = 0; i < byteLength; i++) {
        a = (a + 1) % 256;
        j = (j + arr2[a]) % 256;
        const tmp = arr2[a];
        arr2[a] = arr2[j];
        arr2[j] = tmp;
        const k = arr2[(arr2[a] + arr2[j]) % 256];
        result += String.fromCharCode(bytes.charCodeAt(i) ^ k);
    }
    return result;
}

function encodeData(data, key) {
    const bytes = encodeURIComponent(data);
    const result = handleBytes(bytes, key);
    return btoa(result);
}

function getDecryptData(str) {
    const data = {
        ciphertext: Crypto.enc.Base64.parse(str),
    };
    const key = Crypto.enc.Utf8.parse('2bbc06a6eb1d9e95');
    const iv = Crypto.enc.Utf8.parse('5dd4bcc0e39bd620');
    return Crypto.AES.decrypt(data, key, {
        iv: iv
    }).toString(Crypto.enc.Utf8);
}

async function search(wd, quick, pg) {
    const reqUrl = HOST + '/vod/search/wd/' + encodeURIComponent(wd);
    const html = await request(reqUrl);
    const $ = load(html);
    const items = $('.public-list-box');
    const videos = _.map(items, (item) => {
        const $item = $(item);
        const link = $item.find('a:first').attr('href');
        const title = $item.find('.time-title').text().trim();
        const img = $item.find('img:first').attr('data-src');
        const remarks = $item.find('.public-list-prb').text().trim();
        return {
            vod_id: link.replace(/\/vod\/detail\/id\/(.*)\//g, '$1'),
            vod_name: title,
            vod_pic: img,
            vod_remarks: remarks,
        };
    });
    const hasMore = $('.page-info a:contains(下一页)').length > 0;
    const pgIndex = parseInt(pg);
    const pgCount = hasMore ? pgIndex + 1 : pgIndex;
    const limit = 10;
    return {
        page: pgIndex,
        pagecount: pgCount,
        limit: limit,
        total: limit * pgCount,
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