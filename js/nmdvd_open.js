import { load, _ } from 'assets://js/lib/cat.js';

let key = 'nmdvd';
let siteUrl = 'https://www.nmdvd.com';
let HOST = '';
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
    HOST = await checkValidUrl(cfg.ext);
}

async function checkValidUrl(ext) {
    let validUrl = ext;
    if (_.isEmpty(ext)) {
        const html = await request(siteUrl);
        const matches = html.match(/最新地址\<\/p\>([\w\W]*)复制上面地址/);
        const $ = load(matches[1]);
        const $a = $('a');
        for (const item of $a) {
            const $item = $(item);
            const url = $item.attr('href');
            if (!_.isEmpty(url)) {
                validUrl = url;
                break;
            }
        }
    }
    return validUrl;
}

async function home(filter) {
    const classes = [{'type_id':'1','type_name':'电影'},{'type_id':'2','type_name':'连续剧'},{'type_id':'3','type_name':'综艺'},{'type_id':'4','type_name':'动漫'},{'type_id':'26','type_name':'短剧'}];
    const filterObj = {
        '1':[{'name':'类型','key':'cateId','init':'1','value':[{'n':'全部','v':'1'},{'n':'动作片','v':'5'},{'n':'喜剧片','v':'6'},{'n':'爱情片','v':'7'},{'n':'科幻片','v':'8'},{'n':'恐怖片','v':'9'},{'n':'剧情片','v':'10'},{'n':'战争片','v':'11'},{'n':'惊悚片','v':'16'},{'n':'奇幻片','v':'17'}]},{'name':'年份','key':'year','init':'','value':[{'n':'全部','v':''},{'n':'2024','v':'2024'},{'n':'2023','v':'2023'},{'n':'2022','v':'2022'},{'n':'2021','v':'2021'},{'n':'2020','v':'2020'},{'n':'2019','v':'2019'},{'n':'2018','v':'2018'},{'n':'2017','v':'2017'},{'n':'2016','v':'2016'},{'n':'2015','v':'2015'},{'n':'2014','v':'2014'},{'n':'2013','v':'2013'},{'n':'2012','v':'2012'},{'n':'2011','v':'2011'},{'n':'2010','v':'2010'}]},{'name':'地区','key':'area','init':'','value':[{'n':'全部','v':''},{'n':'大陆','v':'大陆'},{'n':'香港','v':'香港'},{'n':'台湾','v':'台湾'},{'n':'美国','v':'美国'},{'n':'韩国','v':'韩国'},{'n':'日本','v':'日本'},{'n':'泰国','v':'泰国'},{'n':'新加坡','v':'新加坡'},{'n':'马来西亚','v':'马来西亚'},{'n':'印度','v':'印度'},{'n':'英国','v':'英国'},{'n':'法国','v':'法国'},{'n':'加拿大','v':'加拿大'},{'n':'西班牙','v':'西班牙'},{'n':'俄罗斯','v':'俄罗斯'},{'n':'其它','v':'其它'}]},{'name':'排序','key':'by','value':[{'n':'时间','v':'time'},{'n':'人气','v':'hits'},{'n':'评分','v':'score'}]}],
        '2':[{'name':'类型','key':'cateId','init':'2','value':[{'n':'全部','v':'2'},{'n':'国产剧','v':'12'},{'n':'港台剧','v':'13'},{'n':'日韩剧','v':'14'},{'n':'欧美剧','v':'15'}]},{'name':'年份','key':'year','init':'','value':[{'n':'全部','v':''},{'n':'2024','v':'2024'},{'n':'2023','v':'2023'},{'n':'2022','v':'2022'},{'n':'2021','v':'2021'},{'n':'2020','v':'2020'},{'n':'2019','v':'2019'},{'n':'2018','v':'2018'},{'n':'2017','v':'2017'},{'n':'2016','v':'2016'},{'n':'2015','v':'2015'},{'n':'2014','v':'2014'},{'n':'2013','v':'2013'},{'n':'2012','v':'2012'},{'n':'2011','v':'2011'},{'n':'2010','v':'2010'}]},{'name':'地区','key':'area','init':'','value':[{'n':'全部','v':''},{'n':'大陆','v':'大陆'},{'n':'香港','v':'香港'},{'n':'台湾','v':'台湾'},{'n':'美国','v':'美国'},{'n':'韩国','v':'韩国'},{'n':'日本','v':'日本'},{'n':'泰国','v':'泰国'},{'n':'新加坡','v':'新加坡'},{'n':'马来西亚','v':'马来西亚'},{'n':'印度','v':'印度'},{'n':'英国','v':'英国'},{'n':'法国','v':'法国'},{'n':'加拿大','v':'加拿大'},{'n':'西班牙','v':'西班牙'},{'n':'俄罗斯','v':'俄罗斯'},{'n':'其它','v':'其它'}]},{'name':'排序','key':'by','value':[{'n':'时间','v':'time'},{'n':'人气','v':'hits'},{'n':'评分','v':'score'}]}],
        '3':[{'name':'类型','key':'cateId','init':'3','value':[{'n':'全部','v':'3'}]},{'name':'年份','key':'year','init':'','value':[{'n':'全部','v':''},{'n':'2024','v':'2024'},{'n':'2023','v':'2023'},{'n':'2022','v':'2022'},{'n':'2021','v':'2021'},{'n':'2020','v':'2020'},{'n':'2019','v':'2019'},{'n':'2018','v':'2018'},{'n':'2017','v':'2017'},{'n':'2016','v':'2016'},{'n':'2015','v':'2015'},{'n':'2014','v':'2014'},{'n':'2013','v':'2013'},{'n':'2012','v':'2012'},{'n':'2011','v':'2011'},{'n':'2010','v':'2010'}]},{'name':'地区','key':'area','init':'','value':[{'n':'全部','v':''},{'n':'大陆','v':'大陆'},{'n':'香港','v':'香港'},{'n':'台湾','v':'台湾'},{'n':'美国','v':'美国'},{'n':'韩国','v':'韩国'},{'n':'日本','v':'日本'},{'n':'泰国','v':'泰国'},{'n':'新加坡','v':'新加坡'},{'n':'马来西亚','v':'马来西亚'},{'n':'印度','v':'印度'},{'n':'英国','v':'英国'},{'n':'法国','v':'法国'},{'n':'加拿大','v':'加拿大'},{'n':'西班牙','v':'西班牙'},{'n':'俄罗斯','v':'俄罗斯'},{'n':'其它','v':'其它'}]},{'name':'排序','key':'by','value':[{'n':'时间','v':'time'},{'n':'人气','v':'hits'},{'n':'评分','v':'score'}]}],
        '4':[{'name':'类型','key':'cateId','init':'4','value':[{'n':'全部','v':'4'},{'n':'动漫剧','v':'18'},{'n':'动漫片','v':'19'}]},{'name':'年份','key':'year','init':'','value':[{'n':'全部','v':''},{'n':'2024','v':'2024'},{'n':'2023','v':'2023'},{'n':'2022','v':'2022'},{'n':'2021','v':'2021'},{'n':'2020','v':'2020'},{'n':'2019','v':'2019'},{'n':'2018','v':'2018'},{'n':'2017','v':'2017'},{'n':'2016','v':'2016'},{'n':'2015','v':'2015'},{'n':'2014','v':'2014'},{'n':'2013','v':'2013'},{'n':'2012','v':'2012'},{'n':'2011','v':'2011'},{'n':'2010','v':'2010'}]},{'name':'地区','key':'area','init':'','value':[{'n':'全部','v':''},{'n':'大陆','v':'大陆'},{'n':'香港','v':'香港'},{'n':'台湾','v':'台湾'},{'n':'美国','v':'美国'},{'n':'韩国','v':'韩国'},{'n':'日本','v':'日本'},{'n':'泰国','v':'泰国'},{'n':'新加坡','v':'新加坡'},{'n':'马来西亚','v':'马来西亚'},{'n':'印度','v':'印度'},{'n':'英国','v':'英国'},{'n':'法国','v':'法国'},{'n':'加拿大','v':'加拿大'},{'n':'西班牙','v':'西班牙'},{'n':'俄罗斯','v':'俄罗斯'},{'n':'其它','v':'其它'}]},{'name':'排序','key':'by','value':[{'n':'时间','v':'time'},{'n':'人气','v':'hits'},{'n':'评分','v':'score'}]}],
        '26':[{'name':'年份','key':'year','init':'','value':[{'n':'全部','v':''},{'n':'2024','v':'2024'},{'n':'2023','v':'2023'},{'n':'2022','v':'2022'},{'n':'2021','v':'2021'},{'n':'2020','v':'2020'},{'n':'2019','v':'2019'},{'n':'2018','v':'2018'},{'n':'2017','v':'2017'},{'n':'2016','v':'2016'},{'n':'2015','v':'2015'},{'n':'2014','v':'2014'},{'n':'2013','v':'2013'},{'n':'2012','v':'2012'},{'n':'2011','v':'2011'},{'n':'2010','v':'2010'}]},{'name':'地区','key':'area','init':'','value':[{'n':'全部','v':''},{'n':'大陆','v':'大陆'},{'n':'香港','v':'香港'},{'n':'台湾','v':'台湾'},{'n':'美国','v':'美国'},{'n':'韩国','v':'韩国'},{'n':'日本','v':'日本'},{'n':'泰国','v':'泰国'},{'n':'新加坡','v':'新加坡'},{'n':'马来西亚','v':'马来西亚'},{'n':'印度','v':'印度'},{'n':'英国','v':'英国'},{'n':'法国','v':'法国'},{'n':'加拿大','v':'加拿大'},{'n':'西班牙','v':'西班牙'},{'n':'俄罗斯','v':'俄罗斯'},{'n':'其它','v':'其它'}]},{'name':'排序','key':'by','value':[{'n':'时间','v':'time'},{'n':'人气','v':'hits'},{'n':'评分','v':'score'}]}],
    };

    return {
        class: classes,
        filters: filterObj,
    };
}

async function category(tid, pg, filter, extend) {
    if (pg <= 0) pg = 1;
    const link = HOST + '/vod-list-id-' + (extend.cateId || tid) + '-pg-' + pg + '-order--by-' + (extend.by || '') + '-class-0-year-' + (extend.year || '') + '-letter--area-' + (extend.area || '') + '-lang-.html';
    const html = await request(link);
    const $ = load(html);
    const items = $('.globalPicList li');
    const videos = _.map(items, (item) => {
        const $item = $(item);
        const link = $item.find('a:first').attr('href');
        const title = $item.find('.sTit').text().trim();
        const img = $item.find('.pic img:first').attr('src');
        const remarks = '评分:' + $item.find('.sBottom em').text().trim();
        return {
            vod_id: link.replace(/\/vod-detail-id-(.*)\.html/g, '$1'),
            vod_name: title,
            vod_pic: img,
            vod_remarks: remarks || '',
        };
    });
    const hasMore = $('.page a:contains(下一页)').length > 0;
    const page = parseInt(pg);
    const pgCount = hasMore ? page + 1 : page;
    const limit = 30;
    return {
        page: page,
        pagecount: pgCount,
        limit: limit,
        total: limit * pgCount,
        list: videos,
    };
}

async function detail(id) {
    const html = await request(HOST + '/vod-detail-id-' + id + '.html');
    const $ = load(html);
    const vod = {
        vod_id: id,
        vod_name: $('h1.title').text().trim(),
        vod_type: $('h1.type-title').text().trim(),
        vod_year: $('.mod-media-page .desc_item:contains(年代:)').text().substring(3).trim(),
        vod_director: $('.mod-media-page .desc_item:contains(导演:)').text().substring(3).trim(),
        vod_actor: $('.mod-media-page .desc_item:contains(主演:)').text().substring(3).trim(),
        vod_pic: $('.mod-media-page img:first').attr('src'),
        vod_content: $('.detail-con p').text().trim().substring(11).trim(),
    };
    const playMap = {};
    const tabs = $('.numlistBox .hd li');
    const playlists = $('.numlistBox .bd .numList');
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
            playMap[from].push(title + '$' + playUrl + '|' + title);
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
    const info = id.split('|');
    const link = HOST + info[0];
    const html = await request(link);
    let $ = load(html);
    const script = $('.content script:first').text();
    const macCfg = eval(script + 'var mac_cfg={from:mac_from,url:mac_url};mac_cfg');
    const macUrls = macCfg.url.split('#');
    const macFrom = macCfg.from;
    const title = info[1];
    let playId = '';
    for (const macUrl of macUrls) {
        const urlInfo = macUrl.split('$');
        const playTitle = urlInfo[0];
        if (playTitle != title) continue;
        playId = urlInfo[1];
        break;
    }
    let playUrl = '';
    if (!_.isEmpty(playId)) {
        const parseType = macFrom.includes('m3u8') ? 'm3u8' : 'nmm';
        const parseUrl = 'https://api.cnmcom.com/webcloud/' + parseType + '.php?url=';
        const parseHtml = await request(parseUrl + playId);
        if (parseType == 'm3u8') {
            const matches = parseHtml.match(/var url=\'(.*)\';/);
            if (!_.isEmpty(matches)) {
                playUrl = matches[1];
            }
        } else {
            $ = load(parseHtml);
            const iframeUrl = $('iframe#WANG').attr('src');
            const playHtml = await request(iframeUrl);
            let matches = playHtml.match(/url: \'(.*)\',/);
            if (!_.isEmpty(matches)) {
                playUrl = matches[1];
            } else {
                matches = playHtml.match(/\<video src=\"(.*?)\" /);
                if (!_.isEmpty(matches)) {
                    playUrl = matches[1];
                }
            }
        }
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
    const param = {
        wd: wd,
    };
    const html = await request(HOST + '/index.php?m=vod-search', 'post', param);
    const $ = load(html);
    const list = $('.searchMain #data_list li')
    const videos = _.map(list, (item) => {
        const $item = $(item);
        const link = $item.find('a:first').attr('href');
        const title = $item.find('.sTit').text().trim();
        const img = $item.find('.pic img:first').attr('data-src');
        const remarks = $item.find('.sDes:contains(评分)').text().trim();
        return {
            vod_id: link.replace(/\/vod-detail-id-(.*)\.html/g, '$1'),
            vod_name: title,
            vod_pic: img,
            vod_remarks: remarks || '',
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