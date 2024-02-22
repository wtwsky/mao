import { Crypto, dayjs, load, _ } from 'assets://js/lib/cat.js';

let key = 'yhdm';
let siteUrl = 'https://www.88dm.fans/';
let HOST = '';
let parseMap = {};
let siteKey = '';
let siteType = 0;

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
    HOST = await checkValidUrl(cfg.ext);
    await initParseMap();
}

async function checkValidUrl(ext) {
    let validUrl = ext;
    if (_.isEmpty(ext)) {
        const html = await request(siteUrl);
        const $ = load(html);
        const link = $('div.item:contains(新樱花动漫) a:first').attr('href');
        if (!_.isEmpty(link)) {
            validUrl = link.replace(/\/$/, '');
        }
    }
    return validUrl;
}

async function initParseMap() {
    const t = dayjs(new Date()).format('YYYYMMDD');
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
    const classes = [{'type_id':'ribendongman','type_name':'日本动漫'},{'type_id':'guochandongman','type_name':'国产动漫'},{'type_id':'dongmandianying','type_name':'动漫电影'},{'type_id':'omeidongman','type_name':'欧美动漫'}];
    const filters = [{'key':'class','name':'剧情','init':'','value':[{'n':'全部','v':''},{'n':'搞笑','v':'搞笑'},{'n':'运动','v':'运动'},{'n':'励志','v':'励志'},{'n':'武侠','v':'武侠'},{'n':'特摄','v':'特摄'},{'n':'热血','v':'热血'},{'n':'战斗','v':'战斗'},{'n':'竞技','v':'竞技'},{'n':'校园','v':'校园'},{'n':'青春','v':'青春'},{'n':'爱情','v':'爱情'},{'n':'冒险','v':'冒险'},{'n':'后宫','v':'后宫'},{'n':'百合','v':'百合'},{'n':'治愈','v':'治愈'},{'n':'萝莉','v':'萝莉'},{'n':'魔法','v':'魔法'},{'n':'悬疑','v':'悬疑'},{'n':'推理','v':'推理'},{'n':'奇幻','v':'奇幻'},{'n':'神魔','v':'神魔'},{'n':'恐怖','v':'恐怖'},{'n':'血腥','v':'血腥'},{'n':'机战','v':'机战'},{'n':'战争','v':'战争'},{'n':'犯罪','v':'犯罪'},{'n':'社会','v':'社会'},{'n':'职场','v':'职场'},{'n':'剧情','v':'剧情'},{'n':'伪娘','v':'伪娘'},{'n':'耽美','v':'耽美'},{'n':'歌舞','v':'歌舞'},{'n':'肉番','v':'肉番'},{'n':'美少女','v':'美少女'},{'n':'吸血鬼','v':'吸血鬼'},{'n':'泡面番','v':'泡面番'},{'n':'欢乐向','v':'欢乐向'}]},{'key':'year','name':'年份','init':'','value':[{'n':'全部','v':''},{'n':'2024','v':'2024'},{'n':'2023','v':'2023'},{'n':'2022','v':'2022'},{'n':'2021','v':'2021'},{'n':'2020','v':'2020'},{'n':'2019','v':'2019'},{'n':'2018','v':'2018'},{'n':'2017','v':'2017'},{'n':'2016','v':'2016'},{'n':'2015','v':'2015'},{'n':'2014','v':'2014'},{'n':'2013','v':'2013'},{'n':'2012','v':'2012'},{'n':'2011','v':'2011'},{'n':'2010','v':'2010'},{'n':'2009','v':'2009'},{'n':'2008','v':'2008'},{'n':'2007','v':'2007'},{'n':'2006','v':'2006'},{'n':'2005','v':'2005'},{'n':'2004','v':'2004'},{'n':'2003','v':'2003'},{'n':'2002','v':'2002'},{'n':'更早','v':'更早'}]},{'key':'letter','name':'字母','init':'','value':[{'n':'全部','v':''},{'n':'A','v':'A'},{'n':'B','v':'B'},{'n':'C','v':'C'},{'n':'D','v':'D'},{'n':'E','v':'E'},{'n':'F','v':'F'},{'n':'G','v':'G'},{'n':'H','v':'H'},{'n':'I','v':'I'},{'n':'J','v':'J'},{'n':'K','v':'K'},{'n':'L','v':'L'},{'n':'M','v':'M'},{'n':'N','v':'N'},{'n':'O','v':'O'},{'n':'P','v':'P'},{'n':'Q','v':'Q'},{'n':'R','v':'R'},{'n':'S','v':'S'},{'n':'T','v':'T'},{'n':'U','v':'U'},{'n':'V','v':'V'},{'n':'W','v':'W'},{'n':'X','v':'X'},{'n':'Y','v':'Y'},{'n':'Z','v':'Z'},{'n':'0-9','v':'0-9'}]},{'key':'by','name':'排序','value':[{'n':'按最新','v':'time'},{'n':'按最热','v':'hits'},{'n':'按评分','v':'score'}]}];
    const filterObj = {};
    _.each(classes, (item) => {
        filterObj[item.type_id] = filters;
    });
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
    const url = HOST + '/show/' + tid + '--' + (extend.by || '') + '-' + (extend.class || '') + '--' + (extend.letter || '') + '---' + page + '---' + (extend.year || '') + '.html';
    const html = await request(url);
    const $ = load(html);
    const items = $('.hl-vod-list li');
    const videos = _.map(items, (item) => {
        const $item = $(item);
        const link = $item.find('a:first').attr('href');
        const title = $item.find('.hl-item-title').text().trim();
        const img = $item.find('a:first').attr('data-original');
        const remarks = $item.find('.hl-pic-text').text().trim();
        return {
            vod_id: link.replace(/\/video\/(.*)\.html/g, '$1'),
            vod_name: title,
            vod_pic: img,
            vod_remarks: remarks,
        };
    });
    const hasMore = $('.hl-page-wrap a:contains(下一页)').length > 0;
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
    const html = await request(HOST + '/video/' + id + '.html');
    const $ = load(html);
    const vod = {
        vod_id: id,
        vod_name: $('.hl-dc-title').text(),
        type_name: $('.hl-full-box .hl-col-xs-12:contains(类型) a:last').text(),
        vod_area: $('.hl-full-box .hl-col-xs-12:contains(地区)').text().substring(3),
        vod_year: $('.hl-full-box .hl-col-xs-12:contains(年份)').text().substring(3),
        vod_lang: $('.hl-full-box .hl-col-xs-12:contains(语言)').text().substring(3),
        vod_pic: $('.hl-item-thumb').attr('data-original'),
        vod_remarks : $('.hl-full-box .hl-col-xs-12:contains(状态)').text().substring(3),
        vod_content: $('.hl-content-text').text(),
    };
    const playMap = {};
    const tabs = $('.hl-plays-from a');
    const playlists = $('#hl-plays-list');
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
    const $ = load(html);
    const scriptData = $('script:contains(player_)').html().replace('var player_aaaa=','');
    const js = JSON.parse(scriptData);
    let playUrl = js.url;
    const parseUrl = parseMap[flag];
    if (parseUrl) {
        const fullUrl = parseUrl + playUrl;
        const parseHtml = await request(fullUrl);
        const urlMatch = parseHtml.match(/getVideoInfo\("(.*?)"\)/);
        const tkMatch = parseHtml.match(/var bt_token = "(.*)"/);
        playUrl = decryptUrl(urlMatch[1], tkMatch[1]);
    }
    return {
        parse: 0,
        url: playUrl,
    };
}

function decryptUrl(data, btToken) {
    const key = Crypto.enc.Utf8.parse('57A891D97E332A9D');
    const iv = Crypto.enc.Utf8.parse(btToken);
    const decrypted = Crypto.AES.decrypt(data, key, {
        iv: iv,
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
        category: category,
        detail: detail,
        play: play,
        search: search,
    };
}