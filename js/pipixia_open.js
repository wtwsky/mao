import { Crypto, load, _ } from 'assets://js/lib/cat.js';

let key = 'pipixia';
let HOST = 'http://pipixia.vip';
let parseMap = {};
let siteKey = '';
let siteType = 0;

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
    await initParseMap();
}

async function initParseMap() {
    const date = new Date();
    const t = '' + date.getFullYear() + (date.getMonth() + 1) + date.getDate();
    const js = await request(HOST + '/static/js/playerconfig.js?t=' + t);
    try {
        const jsEval = js + '\nMacPlayerConfig';
        const playerList = eval(jsEval).player_list;
        const players = _.values(playerList);
        _.each(players, (item) => {
            if (!item.ps || item.ps == '0') return;
            if (_.isEmpty(item.parse)) return;
            parseMap[item.show] = item.parse;
        });
    } catch(e) {
    }
}

async function home(filter) {
    const classes = [{'type_id':'1','type_name':'剧集'},{'type_id':'2','type_name':'电影'},{'type_id':'3','type_name':'动漫'},{'type_id':'4','type_name':'综艺'},{'type_id':'21','type_name':'短剧'}];
    const filterObj = {
        '1':[{'key':'class','name':'类型','init':'','value':[{'n':'全部','v':''},{'n':'剧情','v':'剧情'},{'n':'动作','v':'动作'},{'n':'科幻','v':'科幻'},{'n':'犯罪','v':'犯罪'},{'n':'惊悚','v':'惊悚'},{'n':'喜剧','v':'喜剧'},{'n':'爱情','v':'爱情'},{'n':'古装','v':'古装'},{'n':'战争','v':'战争'},{'n':'家庭','v':'家庭'},{'n':'奇幻','v':'奇幻'},{'n':'历史','v':'历史'},{'n':'经典','v':'经典'}]},{'key':'area','name':'地区','init':'','value':[{'n':'全部','v':''},{'n':'大陆','v':'大陆'},{'n':'韩国','v':'韩国'},{'n':'香港','v':'香港'},{'n':'日本','v':'日本'},{'n':'美国','v':'美国'},{'n':'泰国','v':'泰国'},{'n':'英国','v':'英国'}]},{'key':'year','name':'年代','init':'','value':[{'n':'全部','v':''},{'n':'2024','v':'2024'},{'n':'2023','v':'2023'},{'n':'2022','v':'2022'},{'n':'2021','v':'2021'},{'n':'2020','v':'2020'},{'n':'2019','v':'2019'},{'n':'2018','v':'2018'},{'n':'2017','v':'2017'},{'n':'2016','v':'2016'},{'n':'2015','v':'2015'},{'n':'2014','v':'2014'},{'n':'2013','v':'2013'},{'n':'2012','v':'2012'},{'n':'2011','v':'2011'},{'n':'2010','v':'2010'}]},{'key':'lang','name':'语言','init':'','value':[{'n':'全部','v':''},{'n':'国语','v':'国语'},{'n':'英语','v':'英语'},{'n':'粤语','v':'粤语'},{'n':'韩语','v':'韩语'},{'n':'日语','v':'日语'}]},{'key':'letter','name':'字母','init':'','value':[{'n':'全部','v':''},{'n':'A','v':'A'},{'n':'B','v':'B'},{'n':'C','v':'C'},{'n':'D','v':'D'},{'n':'E','v':'E'},{'n':'F','v':'F'},{'n':'G','v':'G'},{'n':'H','v':'H'},{'n':'I','v':'I'},{'n':'J','v':'J'},{'n':'K','v':'K'},{'n':'L','v':'L'},{'n':'M','v':'M'},{'n':'N','v':'N'},{'n':'O','v':'O'},{'n':'P','v':'P'},{'n':'Q','v':'Q'},{'n':'R','v':'R'},{'n':'S','v':'S'},{'n':'T','v':'T'},{'n':'U','v':'U'},{'n':'V','v':'V'},{'n':'W','v':'W'},{'n':'X','v':'X'},{'n':'Y','v':'Y'},{'n':'Z','v':'Z'},{'n':'0-9','v':'0-9'}]},{'key':'by','name':'排序','value':[{'n':'按最新','v':'time'},{'n':'按最热','v':'hits'},{'n':'按评分','v':'score'}]}],
        '2':[{'key':'class','name':'类型','init':'','value':[{'n':'全部','v':''},{'n':'喜剧','v':'喜剧'},{'n':'爱情','v':'爱情'},{'n':'科幻','v':'科幻'},{'n':'恐怖','v':'恐怖'},{'n':'战争','v':'战争'},{'n':'剧情','v':'剧情'},{'n':'警匪','v':'警匪'},{'n':'犯罪','v':'犯罪'},{'n':'动画','v':'动画'},{'n':'奇幻','v':'奇幻'},{'n':'武侠','v':'武侠'},{'n':'冒险','v':'冒险'},{'n':'悬疑','v':'悬疑'},{'n':'惊悚','v':'惊悚'},{'n':'青春','v':'青春'},{'n':'文艺','v':'文艺'},{'n':'古装','v':'古装'},{'n':'经典','v':'经典'}]},{'key':'area','name':'地区','init':'','value':[{'n':'全部','v':''},{'n':'中国','v':'中国'},{'n':'美国','v':'美国'},{'n':'香港','v':'香港'},{'n':'法国','v':'法国'},{'n':'韩国','v':'韩国'},{'n':'日本','v':'日本'},{'n':'英国','v':'英国'},{'n':'德国','v':'德国'}]},{'key':'year','name':'年代','init':'','value':[{'n':'全部','v':''},{'n':'2024','v':'2024'},{'n':'2023','v':'2023'},{'n':'2022','v':'2022'},{'n':'2021','v':'2021'},{'n':'2020','v':'2020'},{'n':'2019','v':'2019'},{'n':'2018','v':'2018'},{'n':'2017','v':'2017'},{'n':'2016','v':'2016'},{'n':'2015','v':'2015'},{'n':'2014','v':'2014'},{'n':'2013','v':'2013'},{'n':'2012','v':'2012'},{'n':'2011','v':'2011'},{'n':'2010','v':'2010'},{'n':'2009','v':'2009'},{'n':'2008','v':'2008'},{'n':'2007','v':'2007'},{'n':'2006','v':'2006'},{'n':'2005','v':'2005'},{'n':'2004','v':'2004'}]},{'key':'lang','name':'语言','init':'','value':[{'n':'全部','v':''},{'n':'国语','v':'国语'},{'n':'英语','v':'英语'},{'n':'粤语','v':'粤语'},{'n':'韩语','v':'韩语'},{'n':'日语','v':'日语'},{'n':'法语','v':'法语'},{'n':'德语','v':'德语'}]},{'key':'letter','name':'字母','init':'','value':[{'n':'全部','v':''},{'n':'A','v':'A'},{'n':'B','v':'B'},{'n':'C','v':'C'},{'n':'D','v':'D'},{'n':'E','v':'E'},{'n':'F','v':'F'},{'n':'G','v':'G'},{'n':'H','v':'H'},{'n':'I','v':'I'},{'n':'J','v':'J'},{'n':'K','v':'K'},{'n':'L','v':'L'},{'n':'M','v':'M'},{'n':'N','v':'N'},{'n':'O','v':'O'},{'n':'P','v':'P'},{'n':'Q','v':'Q'},{'n':'R','v':'R'},{'n':'S','v':'S'},{'n':'T','v':'T'},{'n':'U','v':'U'},{'n':'V','v':'V'},{'n':'W','v':'W'},{'n':'X','v':'X'},{'n':'Y','v':'Y'},{'n':'Z','v':'Z'},{'n':'0-9','v':'0-9'}]},{'key':'by','name':'排序','value':[{'n':'时间','v':'time'},{'n':'人气','v':'hits'},{'n':'评分','v':'score'}]}],
        '3':[{'key':'class','name':'类型','init':'','value':[{'n':'全部','v':''},{'n':'科幻','v':'科幻'},{'n':'热血','v':'热血'},{'n':'推理','v':'推理'},{'n':'搞笑','v':'搞笑'},{'n':'冒险','v':'冒险'},{'n':'萝莉','v':'萝莉'},{'n':'校园','v':'校园'},{'n':'动作','v':'动作'},{'n':'机战','v':'机战'},{'n':'运动','v':'运动'},{'n':'战争','v':'战争'},{'n':'少年','v':'少年'},{'n':'少女','v':'少女'},{'n':'社会','v':'社会'},{'n':'原创','v':'原创'},{'n':'亲子','v':'亲子'},{'n':'益智','v':'益智'},{'n':'励志','v':'励志'},{'n':'其他','v':'其他'}]},{'key':'area','name':'地区','init':'','value':[{'n':'全部','v':''},{'n':'大陆','v':'大陆'},{'n':'日本','v':'日本'},{'n':'欧美','v':'欧美'},{'n':'其他','v':'其他'}]},{'key':'year','name':'年代','init':'','value':[{'n':'全部','v':''},{'n':'2024','v':'2024'},{'n':'2023','v':'2023'},{'n':'2022','v':'2022'},{'n':'2021','v':'2021'},{'n':'2020','v':'2020'},{'n':'2019','v':'2019'},{'n':'2018','v':'2018'},{'n':'2017','v':'2017'},{'n':'2016','v':'2016'},{'n':'2015','v':'2015'},{'n':'2014','v':'2014'},{'n':'2013','v':'2013'},{'n':'2012','v':'2012'},{'n':'2011','v':'2011'},{'n':'2010','v':'2010'},{'n':'2009','v':'2009'},{'n':'2008','v':'2008'},{'n':'2007','v':'2007'},{'n':'2006','v':'2006'},{'n':'2005','v':'2005'},{'n':'2004','v':'2004'}]},{'key':'lang','name':'语言','init':'','value':[{'n':'全部','v':''},{'n':'国语','v':'国语'},{'n':'英语','v':'英语'},{'n':'粤语','v':'粤语'},{'n':'韩语','v':'韩语'},{'n':'日语','v':'日语'}]},{'key':'letter','name':'字母','init':'','value':[{'n':'全部','v':''},{'n':'A','v':'A'},{'n':'B','v':'B'},{'n':'C','v':'C'},{'n':'D','v':'D'},{'n':'E','v':'E'},{'n':'F','v':'F'},{'n':'G','v':'G'},{'n':'H','v':'H'},{'n':'I','v':'I'},{'n':'J','v':'J'},{'n':'K','v':'K'},{'n':'L','v':'L'},{'n':'M','v':'M'},{'n':'N','v':'N'},{'n':'O','v':'O'},{'n':'P','v':'P'},{'n':'Q','v':'Q'},{'n':'R','v':'R'},{'n':'S','v':'S'},{'n':'T','v':'T'},{'n':'U','v':'U'},{'n':'V','v':'V'},{'n':'W','v':'W'},{'n':'X','v':'X'},{'n':'Y','v':'Y'},{'n':'Z','v':'Z'},{'n':'0-9','v':'0-9'}]},{'key':'by','name':'排序','value':[{'n':'时间','v':'time'},{'n':'人气','v':'hits'},{'n':'评分','v':'score'}]}],
        '4':[{'key':'class','name':'类型','init':'','value':[{'n':'全部','v':''},{'n':'情感','v':'情感'},{'n':'访谈','v':'访谈'},{'n':'旅游','v':'旅游'},{'n':'音乐','v':'音乐'},{'n':'美食','v':'美食'},{'n':'纪实','v':'纪实'},{'n':'生活','v':'生活'},{'n':'游戏','v':'游戏'},{'n':'求职','v':'求职'}]},{'key':'area','name':'地区','init':'','value':[{'n':'全部','v':''},{'n':'大陆','v':'大陆'},{'n':'韩国','v':'韩国'},{'n':'香港','v':'香港'},{'n':'日本','v':'日本'},{'n':'美国','v':'美国'},{'n':'泰国','v':'泰国'},{'n':'英国','v':'英国'}]},{'key':'year','name':'年代','init':'','value':[{'n':'全部','v':''},{'n':'2024','v':'2024'},{'n':'2023','v':'2023'},{'n':'2022','v':'2022'},{'n':'2021','v':'2021'},{'n':'2020','v':'2020'},{'n':'2019','v':'2019'},{'n':'2018','v':'2018'},{'n':'2017','v':'2017'},{'n':'2016','v':'2016'},{'n':'2015','v':'2015'},{'n':'2014','v':'2014'},{'n':'2013','v':'2013'},{'n':'2012','v':'2012'},{'n':'2011','v':'2011'},{'n':'2010','v':'2010'},{'n':'2009','v':'2009'},{'n':'2008','v':'2008'},{'n':'2007','v':'2007'},{'n':'2006','v':'2006'},{'n':'2005','v':'2005'},{'n':'2004','v':'2004'}]},{'key':'lang','name':'语言','init':'','value':[{'n':'全部','v':''},{'n':'国语','v':'国语'},{'n':'英语','v':'英语'},{'n':'粤语','v':'粤语'},{'n':'韩语','v':'韩语'},{'n':'日语','v':'日语'}]},{'key':'letter','name':'字母','init':'','value':[{'n':'全部','v':''},{'n':'A','v':'A'},{'n':'B','v':'B'},{'n':'C','v':'C'},{'n':'D','v':'D'},{'n':'E','v':'E'},{'n':'F','v':'F'},{'n':'G','v':'G'},{'n':'H','v':'H'},{'n':'I','v':'I'},{'n':'J','v':'J'},{'n':'K','v':'K'},{'n':'L','v':'L'},{'n':'M','v':'M'},{'n':'N','v':'N'},{'n':'O','v':'O'},{'n':'P','v':'P'},{'n':'Q','v':'Q'},{'n':'R','v':'R'},{'n':'S','v':'S'},{'n':'T','v':'T'},{'n':'U','v':'U'},{'n':'V','v':'V'},{'n':'W','v':'W'},{'n':'X','v':'X'},{'n':'Y','v':'Y'},{'n':'Z','v':'Z'},{'n':'0-9','v':'0-9'}]},{'key':'by','name':'排序','value':[{'n':'时间','v':'time'},{'n':'人气','v':'hits'},{'n':'评分','v':'score'}]}],
        '21':[{'key':'by','name':'排序','value':[{'n':'时间','v':'time'},{'n':'人气','v':'hits'},{'n':'评分','v':'score'}]}]
    };
    return {
        class: classes,
        filters: filterObj,
    };
}

async function homeVod() {}

async function category(tid, pg, filter, extend) {
    if (pg <= 0) pg = 1;
    const time = Math.floor(new Date().getTime() / 1000);
    const key = getSignKey(time);
    const param = {
        type: tid,
        page: pg,
        time: time,
        key: key,
        class: extend.class || '',
        area: extend.area || '',
        year: extend.year || '',
        lang: extend.lang || '',
        letter: extend.letter || '',
    };
    const link = HOST + '/index.php/api/vod';
    const resp = await request(link, 'post', param);
    const data = JSON.parse(resp);
    const videos = _.map(data.list, (item) => {
        return {
            vod_id: item.vod_id,
            vod_name: item.vod_name,
            vod_pic: getPicUrl(item.vod_pic),
            vod_remarks: item.vod_remarks,
        };
    });
    const limit = data.limit;
    const pgCount = data.pagecount;
    return {
        page: pg,
        pagecount: pgCount,
        limit: limit,
        total: limit * pgCount,
        list: videos,
    };
}

function getSignKey(time) {
    return md5X('DS' + time + 'DCC147D11943AF75');
}

function getPicUrl(pic) {
    return pic.startsWith('http') ? pic : HOST + '/' + pic;
}

async function detail(id) {
    const html = await request(HOST + '/v/' + id + '.html');
    const $ = load(html);
    const vod = {
        vod_id: id,
        vod_name: $('.slide-info-title').text().trim(),
        vod_actor: $('.slide-info:contains(演员)').text().trim().substring(4),
        vod_director: $('.slide-info:contains(导演)').text().trim().substring(4),
        vod_pic: getPicUrl($('.detail-pic').attr('data-original')),
        vod_remarks : $('span.slide-info-remarks:first').text(),
        vod_content: $('#height_limit').text().trim(),
    };
    const playMap = {};
    const tabs = $('.anthology-tab a');
    const playlists = $('.anthology-list-box');
    _.each(tabs, (tab, i) => {
        const $tab = $(tab);
        $tab.find('.fa').remove();
        $tab.find('.badge').remove();
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
    const scriptData = $('script:contains(player_)').html().replace('var player_aaaa','').replace('=','');
    const js = JSON.parse(scriptData);
    let playUrl = js.url;
    const parseUrl = parseMap[flag];
    if (parseUrl) {
        const fullUrl = parseUrl + playUrl;
        const parseHtml = await request(fullUrl);
        const matches = parseHtml.match(/let ConFig = {([\w\W]*)},box/);
        if (!_.isEmpty(matches)) {
            const configJson = '{' + matches[1].trim() + '}';
            const config = JSON.parse(configJson);
            playUrl = decryptUrl(config);
        }
    }
    return {
        parse: 0,
        url: playUrl,
    };
}

function decryptUrl(jsConfig) {
    const key = Crypto.enc.Utf8.parse('2890' + jsConfig.config.uid + 'tB959C');
    const iv = Crypto.enc.Utf8.parse('2F131BE91247866E');
    const mode = Crypto.mode.CBC;
    const padding = Crypto.pad.Pkcs7;
    const decrypted = Crypto.AES.decrypt(jsConfig.url, key, {
        iv: iv,
        mode: mode,
        padding: padding
    });
    const decryptedUrl = Crypto.enc.Utf8.stringify(decrypted);
    return decryptedUrl;
}

async function search(wd, quick) {
    const data = JSON.parse(await request(HOST + '/index.php/ajax/suggest?mid=1&limit=50&wd=' + wd)).list;
    const videos = _.map(data, (vod) => {
        return {
            vod_id: vod.id,
            vod_name: vod.name,
            vod_pic: getPicUrl(vod.pic),
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