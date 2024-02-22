import { Crypto, load, _ } from 'assets://js/lib/cat.js';

let key = 'juquanquan';
let HOST = 'https://www.jqqzx.cc';
let siteKey = '';
let siteType = 0;

const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1';

const parseUrlMap = new Map([
    ['*', ['https://www.mgplayer.cc/parse/videoParse.php?vid=']],
]);

async function request(reqUrl, timeout = 60000) {
    let res = await req(reqUrl, {
        method: 'get',
        headers: {
            'User-Agent': UA,
            'Referer': HOST
        },
        timeout: timeout,
    });
    return res.content;
}

// cfg = {skey: siteKey, ext: extend}
async function init(cfg) {
    siteKey = cfg.skey;
    siteType = cfg.stype;
}

async function home(filter) {
    let classes = [{"type_id":"dianying","type_name":"电影"},{"type_id":"juji","type_name":"剧集"},{"type_id":"dongman","type_name":"动漫"},{"type_id":"zongyi","type_name":"综艺"}];
    let filterObj = {
		"dianying":[{"key":"class","name":"剧情","init":"","value":[{"n":"全部","v":""},{"n":"Netflix","v":"Netflix"},{"n":"喜剧","v":"喜剧"},{"n":"爱情","v":"爱情"},{"n":"恐怖","v":"恐怖"},{"n":"动作","v":"动作"},{"n":"科幻","v":"科幻"},{"n":"剧情","v":"剧情"},{"n":"战争","v":"战争"},{"n":"犯罪","v":"犯罪"},{"n":"动画","v":"动画"},{"n":"奇幻","v":"奇幻"},{"n":"武侠","v":"武侠"},{"n":"冒险","v":"冒险"},{"n":"枪战","v":"枪战"},{"n":"恐怖","v":"恐怖"},{"n":"悬疑","v":"悬疑"},{"n":"惊悚","v":"惊悚"},{"n":"古装","v":"古装"},{"n":"历史","v":"历史"},{"n":"家庭","v":"家庭"},{"n":"同性","v":"同性"},{"n":"运动","v":"运动"},{"n":"儿童","v":"儿童"},{"n":"经典","v":"经典"},{"n":"青春","v":"青春"},{"n":"文艺","v":"文艺"},{"n":"微电影","v":"微电影"},{"n":"纪录片","v":"纪录片"},{"n":"网络电影","v":"网络电影"}]},{"key":"area","name":"地区","init":"","value":[{"n":"全部","v":""},{"n":"美国","v":"美国"},{"n":"韩国","v":"韩国"},{"n":"日本","v":"日本"},{"n":"泰国","v":"泰国"},{"n":"中国香港","v":"中国香港"},{"n":"中国台湾","v":"中国台湾"},{"n":"新加坡","v":"新加坡"},{"n":"马来西亚","v":"马来西亚"},{"n":"印度","v":"印度"},{"n":"英国","v":"英国"},{"n":"法国","v":"法国"},{"n":"德国","v":"德国"},{"n":"加拿大","v":"加拿大"},{"n":"西班牙","v":"西班牙"},{"n":"俄罗斯","v":"俄罗斯"},{"n":"其它","v":"其它"}]},{"key":"year","name":"年份","init":"","value":[{"n":"全部","v":""},{"n":"2023","v":"2023"},{"n":"2022","v":"2022"},{"n":"2021","v":"2021"},{"n":"2020","v":"2020"},{"n":"2019","v":"2019"},{"n":"2018","v":"2018"},{"n":"2017","v":"2017"},{"n":"2016","v":"2016"},{"n":"2015","v":"2015"},{"n":"2014","v":"2014"},{"n":"2013","v":"2013"},{"n":"2012","v":"2012"},{"n":"2011","v":"2011"},{"n":"2010","v":"2010"},{"n":"2009","v":"2009"},{"n":"2008","v":"2008"},{"n":"2007","v":"2007"},{"n":"2006","v":"2006"},{"n":"2005","v":"2005"},{"n":"2004","v":"2004"},{"n":"2003","v":"2003"},{"n":"2002","v":"2002"},{"n":"2001","v":"2001"},{"n":"2000","v":"2000"},{"n":"1990","v":"1990"},{"n":"1980","v":"1980"},{"n":"1970","v":"1970"},{"n":"1960","v":"1960"},{"n":"1950","v":"1950"}]},{"key":"letter","name":"字母","init":"","value":[{"n":"全部","v":""},{"n":"A","v":"A"},{"n":"B","v":"B"},{"n":"C","v":"C"},{"n":"D","v":"D"},{"n":"E","v":"E"},{"n":"F","v":"F"},{"n":"G","v":"G"},{"n":"H","v":"H"},{"n":"I","v":"I"},{"n":"J","v":"J"},{"n":"K","v":"K"},{"n":"L","v":"L"},{"n":"M","v":"M"},{"n":"N","v":"N"},{"n":"O","v":"O"},{"n":"P","v":"P"},{"n":"Q","v":"Q"},{"n":"R","v":"R"},{"n":"S","v":"S"},{"n":"T","v":"T"},{"n":"U","v":"U"},{"n":"V","v":"V"},{"n":"W","v":"W"},{"n":"X","v":"X"},{"n":"Y","v":"Y"},{"n":"Z","v":"Z"},{"n":"0-9","v":"0-9"}]},{"key":"by","name":"排序","value":[{"n":"时间","v":"time"},{"n":"人气","v":"hits"},{"n":"评分","v":"score"}]}],
        "juji":[{"key":"class","name":"类型","init":"","value":[{"n":"全部","v":""},{"n":"Netflix","v":"Netflix"},{"n":"爱情","v":"爱情"},{"n":"言情","v":"言情"},{"n":"都市","v":"都市"},{"n":"家庭","v":"家庭"},{"n":"战争","v":"战争"},{"n":"喜剧","v":"喜剧"},{"n":"古装","v":"古装"},{"n":"武侠","v":"武侠"},{"n":"偶像","v":"偶像"},{"n":"历史","v":"历史"},{"n":"悬疑","v":"悬疑"},{"n":"科幻","v":"科幻"},{"n":"冒险","v":"冒险"},{"n":"惊悚","v":"惊悚"},{"n":"犯罪","v":"犯罪"},{"n":"运动","v":"运动"},{"n":"恐怖","v":"恐怖"},{"n":"剧情","v":"剧情"},{"n":"奇幻","v":"奇幻"},{"n":"纪录片","v":"纪录片"},{"n":"灾难","v":"灾难"},{"n":"动作","v":"动作"}]},{"key":"area","name":"地区","init":"","value":[{"n":"全部","v":""},{"n":"美国","v":"美国"},{"n":"韩国","v":"韩国"},{"n":"日本","v":"日本"},{"n":"泰国","v":"泰国"},{"n":"中国香港","v":"中国香港"},{"n":"中国台湾","v":"中国台湾"},{"n":"新加坡","v":"新加坡"},{"n":"马来西亚","v":"马来西亚"},{"n":"印度","v":"印度"},{"n":"英国","v":"英国"},{"n":"法国","v":"法国"},{"n":"德国","v":"德国"},{"n":"加拿大","v":"加拿大"},{"n":"西班牙","v":"西班牙"},{"n":"俄罗斯","v":"俄罗斯"},{"n":"其它","v":"其它"}]},{"key":"year","name":"年份","init":"","value":[{"n":"全部","v":""},{"n":"2023","v":"2023"},{"n":"2022","v":"2022"},{"n":"2021","v":"2021"},{"n":"2020","v":"2020"},{"n":"2019","v":"2019"},{"n":"2018","v":"2018"},{"n":"2017","v":"2017"},{"n":"2016","v":"2016"},{"n":"2015","v":"2015"},{"n":"2014","v":"2014"},{"n":"2013","v":"2013"},{"n":"2012","v":"2012"},{"n":"2011","v":"2011"},{"n":"2010","v":"2010"},{"n":"2009","v":"2009"},{"n":"2008","v":"2008"},{"n":"2007","v":"2007"},{"n":"2006","v":"2006"},{"n":"2005","v":"2005"},{"n":"2004","v":"2004"},{"n":"2003","v":"2003"},{"n":"2002","v":"2002"},{"n":"2001","v":"2001"},{"n":"2000","v":"2000"},{"n":"1990","v":"1990"},{"n":"1980","v":"1980"},{"n":"1970","v":"1970"},{"n":"1960","v":"1960"},{"n":"1950","v":"1950"}]},{"key":"letter","name":"字母","init":"","value":[{"n":"全部","v":""},{"n":"A","v":"A"},{"n":"B","v":"B"},{"n":"C","v":"C"},{"n":"D","v":"D"},{"n":"E","v":"E"},{"n":"F","v":"F"},{"n":"G","v":"G"},{"n":"H","v":"H"},{"n":"I","v":"I"},{"n":"J","v":"J"},{"n":"K","v":"K"},{"n":"L","v":"L"},{"n":"M","v":"M"},{"n":"N","v":"N"},{"n":"O","v":"O"},{"n":"P","v":"P"},{"n":"Q","v":"Q"},{"n":"R","v":"R"},{"n":"S","v":"S"},{"n":"T","v":"T"},{"n":"U","v":"U"},{"n":"V","v":"V"},{"n":"W","v":"W"},{"n":"X","v":"X"},{"n":"Y","v":"Y"},{"n":"Z","v":"Z"},{"n":"0-9","v":"0-9"}]},{"key":"version","name":"版本","init":"","value":[{"n":"全部","v":""},{"n":"4K","v":"4K"},{"n":"热门连续剧","v":"热门连续剧"},{"n":"港台剧","v":"港台剧"},{"n":"日韩剧","v":"日韩剧"},{"n":"欧美剧","v":"欧美剧"}]},{"key":"by","name":"排序","value":[{"n":"时间","v":"time"},{"n":"人气","v":"hits"},{"n":"评分","v":"score"}]}],
		"dongman":[{"key":"class","name":"类型","init":"","value":[{"n":"全部","v":""},{"n":"Netflix","v":"Netflix"},{"n":"奇幻","v":"奇幻"},{"n":"动作","v":"动作"},{"n":"科幻","v":"科幻"},{"n":"喜剧","v":"喜剧"},{"n":"冒险","v":"冒险"},{"n":"后宫","v":"后宫"},{"n":"爱情","v":"爱情"},{"n":"悬疑","v":"悬疑"},{"n":"机战","v":"机战"},{"n":"战争","v":"战争"},{"n":"其他","v":"其他"}]},{"key":"area","name":"地区","init":"","value":[{"n":"全部","v":""},{"n":"日本","v":"日本"},{"n":"美国","v":"美国"},{"n":"韩国","v":"韩国"},{"n":"中国香港","v":"中国香港"},{"n":"中国台湾","v":"中国台湾"},{"n":"英国","v":"英国"},{"n":"法国","v":"法国"},{"n":"加拿大","v":"加拿大"},{"n":"西班牙","v":"西班牙"},{"n":"俄罗斯","v":"俄罗斯"},{"n":"其它","v":"其它"}]},{"key":"year","name":"年份","init":"","value":[{"n":"全部","v":""},{"n":"2023","v":"2023"},{"n":"2022","v":"2022"},{"n":"2021","v":"2021"},{"n":"2020","v":"2020"},{"n":"2019","v":"2019"},{"n":"2018","v":"2018"},{"n":"2017","v":"2017"},{"n":"2016","v":"2016"},{"n":"2015","v":"2015"},{"n":"2014","v":"2014"},{"n":"2013","v":"2013"},{"n":"2012","v":"2012"},{"n":"2011","v":"2011"},{"n":"2010","v":"2010"},{"n":"2009","v":"2009"},{"n":"2008","v":"2008"},{"n":"2007","v":"2007"},{"n":"2006","v":"2006"},{"n":"2005","v":"2005"},{"n":"2004","v":"2004"},{"n":"2003","v":"2003"},{"n":"2002","v":"2002"},{"n":"2001","v":"2001"},{"n":"2000","v":"2000"},{"n":"1990","v":"1990"},{"n":"1980","v":"1980"},{"n":"1970","v":"1970"},{"n":"1960","v":"1960"},{"n":"1950","v":"1950"}]},{"key":"letter","name":"字母","init":"","value":[{"n":"全部","v":""},{"n":"A","v":"A"},{"n":"B","v":"B"},{"n":"C","v":"C"},{"n":"D","v":"D"},{"n":"E","v":"E"},{"n":"F","v":"F"},{"n":"G","v":"G"},{"n":"H","v":"H"},{"n":"I","v":"I"},{"n":"J","v":"J"},{"n":"K","v":"K"},{"n":"L","v":"L"},{"n":"M","v":"M"},{"n":"N","v":"N"},{"n":"O","v":"O"},{"n":"P","v":"P"},{"n":"Q","v":"Q"},{"n":"R","v":"R"},{"n":"S","v":"S"},{"n":"T","v":"T"},{"n":"U","v":"U"},{"n":"V","v":"V"},{"n":"W","v":"W"},{"n":"X","v":"X"},{"n":"Y","v":"Y"},{"n":"Z","v":"Z"},{"n":"0-9","v":"0-9"}]},{"key":"by","name":"排序","value":[{"n":"时间","v":"time"},{"n":"人气","v":"hits"},{"n":"评分","v":"score"}]}],
        "zongyi":[{"key":"class","name":"类型","init":"","value":[{"n":"全部","v":""},{"n":"Netflix","v":"Netflix"},{"n":"真人秀","v":"真人秀"},{"n":"音乐","v":"音乐"},{"n":"喜剧","v":"喜剧"},{"n":"脱口秀","v":"脱口秀"},{"n":"文化","v":"文化"},{"n":"美食","v":"美食"}]},{"key":"area","name":"地区","init":"","value":[{"n":"全部","v":""},{"n":"美国","v":"美国"},{"n":"韩国","v":"韩国"},{"n":"日本","v":"日本"},{"n":"中国香港","v":"中国香港"},{"n":"中国台湾","v":"中国台湾"},{"n":"印度","v":"印度"},{"n":"英国","v":"英国"},{"n":"法国","v":"法国"},{"n":"德国","v":"德国"},{"n":"加拿大","v":"加拿大"},{"n":"西班牙","v":"西班牙"},{"n":"俄罗斯","v":"俄罗斯"},{"n":"其它","v":"其它"}]},{"key":"year","name":"年份","init":"","value":[{"n":"全部","v":""},{"n":"2023","v":"2023"},{"n":"2022","v":"2022"},{"n":"2021","v":"2021"},{"n":"2020","v":"2020"},{"n":"2019","v":"2019"},{"n":"2018","v":"2018"},{"n":"2017","v":"2017"},{"n":"2016","v":"2016"},{"n":"2015","v":"2015"},{"n":"2014","v":"2014"},{"n":"2013","v":"2013"},{"n":"2012","v":"2012"},{"n":"2011","v":"2011"},{"n":"2010","v":"2010"},{"n":"2009","v":"2009"},{"n":"2008","v":"2008"},{"n":"2007","v":"2007"},{"n":"2006","v":"2006"},{"n":"2005","v":"2005"},{"n":"2004","v":"2004"},{"n":"2003","v":"2003"},{"n":"2002","v":"2002"},{"n":"2001","v":"2001"},{"n":"2000","v":"2000"},{"n":"1990","v":"1990"},{"n":"1980","v":"1980"},{"n":"1970","v":"1970"},{"n":"1960","v":"1960"},{"n":"1950","v":"1950"}]},{"key":"letter","name":"字母","init":"","value":[{"n":"全部","v":""},{"n":"A","v":"A"},{"n":"B","v":"B"},{"n":"C","v":"C"},{"n":"D","v":"D"},{"n":"E","v":"E"},{"n":"F","v":"F"},{"n":"G","v":"G"},{"n":"H","v":"H"},{"n":"I","v":"I"},{"n":"J","v":"J"},{"n":"K","v":"K"},{"n":"L","v":"L"},{"n":"M","v":"M"},{"n":"N","v":"N"},{"n":"O","v":"O"},{"n":"P","v":"P"},{"n":"Q","v":"Q"},{"n":"R","v":"R"},{"n":"S","v":"S"},{"n":"T","v":"T"},{"n":"U","v":"U"},{"n":"V","v":"V"},{"n":"W","v":"W"},{"n":"X","v":"X"},{"n":"Y","v":"Y"},{"n":"Z","v":"Z"},{"n":"0-9","v":"0-9"}]},{"key":"by","name":"排序","value":[{"n":"时间","v":"time"},{"n":"人气","v":"hits"},{"n":"评分","v":"score"}]}],
	};

    return JSON.stringify({
        class: classes,
        filters: filterObj,
    });
}

async function homeVod() {}

async function category(tid, pg, filter, extend) {
    if (pg <= 0) pg = 1;
    const area = getFilterUrlPart(extend, 'area');
    const by = getFilterUrlPart(extend, 'by');
    const cls = getFilterUrlPart(extend, 'class');
    const letter = getFilterUrlPart(extend, 'letter');
    let page = '';
    if (pg > 1) {
        page = '/page/' + pg;
    }
    const year = getFilterUrlPart(extend, 'year');
    const link = HOST + '/vodshow' + area + by + cls + '/id/' + tid + letter + page + year + '.html';    const html = await request(link);
    const $ = load(html);
    const items = $('.module-poster-item');
    let videos = _.map(items, (item) => {
        const link = $(item).attr('href');
        const title = $(item).attr('title');
        const itimg = $(item).find('img:first')[0];
        const remarks = $($(item).find('.module-item-note')[0]).text().trim();
        return {
            vod_id: link,
            vod_name: title,
            vod_pic: itimg.attribs['data-original'],
            vod_remarks: remarks || '',
        };
    });
    const hasMore = $('#page a.page-next:contains(下一页)').length > 0;
    const pgCount = hasMore ? parseInt(pg) + 1 : parseInt(pg);
    return JSON.stringify({
        page: parseInt(pg),
        pagecount: pgCount,
        limit: 24,
        total: 24 * pgCount,
        list: videos,
    });
}

function getFilterUrlPart(extend, part) {
    let result = '';
    if (extend[part]) {
        result = '/' + part + '/' + extend[part];
    }
    return result;
}

async function detail(id) {
    let html = await request(HOST + id);
    let $ = load(html);
    let vod = {
        vod_id: id,
        vod_name: $('h1').text().trim(),
        vod_type: $('.module-info-tag-link a:eq(3)').text(),
        vod_area: $('.module-info-tag-link a:eq(2)').text(),
        vod_year: $('.module-info-tag-link a:eq(1)').text(),
        vod_director: $('.module-info-item:contains(导演：)').text().substring(3).trim().replace(/\/$/g, ''),
        vod_actor: $('.module-info-item:contains(主演：)').text().substring(3).trim().replace(/\/$/g, ''),
        vod_pic: $('.module-info-poster .module-item-pic img:first').attr('data-original'),
        vod_remarks : $('.module-info-item:contains(备注：)').text().substring(3) || '',
        vod_content: $('.module-info-introduction-content').text().trim(),
    };
    let playMap = {};
    let tabs = $('.module-tab-items-box .module-tab-item');
    let playlists = $('.module-play-list .module-play-list-content');
    _.each(tabs, (tab, i) => {
        let from = tab.children[0].children[0].data;
        let list = playlists[i];
        list = $(list).find('a');
        _.each(list, (it) => {
            let title = it.children[0].children[0].data.trim();
            let playUrl = it.attribs.href;
            if (!playMap.hasOwnProperty(from)) {
                playMap[from] = [];
            }
            playMap[from].push(title + '$' + playUrl);
        });
    });
    vod.vod_play_from = _.keys(playMap).join('$$$');
    let urls = _.values(playMap);
    let vod_play_url = _.map(urls, (urlist) => {
        return urlist.join('#');
    });
    vod.vod_play_url = vod_play_url.join('$$$');
    return JSON.stringify({
        list: [vod],
    });
}

async function play(flag, id, flags) {
    const link = HOST + id;
    const html = await request(link);
    const $ = load(html);
    const json = $('script:contains(player_aaaa)').text().replace('var player_aaaa=','');
    const js = JSON.parse(json);
    const playurl = js.url;
    let playUrl = unescape(playurl); 
    if (playUrl.startsWith('mogu-')) {
        let parseUrls = parseUrlMap.get(flag);
        if (!parseUrls) {
            parseUrls = parseUrlMap.get('*');
        }
        const result = await getFinalVideo(parseUrls, playUrl);
        if (result !== null) {
            return JSON.stringify(result);
        }
    }
    return JSON.stringify({
        parse: 0,
        url: playUrl,
    });
}

async function getFinalVideo(parseUrls, url) {
    for (const parseUrl of parseUrls) {
        if (parseUrl === "" || parseUrl === "null") {
            continue;
        }
        const playUrl = parseUrl + url;
        const content = await request(playUrl, 10000); // 10秒请求，兼容bilibili
        let tryJson = null;
        try {
            tryJson = jsonParse(url, content);
        } catch (error) {
        }

        if (tryJson !== null && tryJson.hasOwnProperty("url") && tryJson.hasOwnProperty("header")) {
            tryJson.header = JSON.stringify(tryJson.header);
            return tryJson;
        }
    }
    const result = {
            parse: 0,
            playUrl: "",
            url: url
        };
    return JSON.stringify(result);
}

function jsonParse(input, json) {
    // 处理解析接口返回的报文，如果返回的报文中包含header信息，就加到返回值中
    let jsonPlayData = JSON.parse(json);
    // 处理293的解析结果url在data字段的解析
    if (jsonPlayData.hasOwnProperty("data") && typeof jsonPlayData.data === "object" && !jsonPlayData.hasOwnProperty("url")) {
        jsonPlayData = jsonPlayData.data;
    }

    let url = jsonPlayData.url;

    if (url.startsWith("//")) {
        url = "https:" + url;
    }
    if (!url.trim().startsWith("http")) {
        return null;
    }
    if (url === input) {
        if (!isVideoFormat(url)) {
            return null;
        }
    }

    let headers = {};
    if (jsonPlayData.hasOwnProperty("header")) {
        headers = jsonPlayData.header;
    } else if (jsonPlayData.hasOwnProperty("Header")) {
        headers = jsonPlayData.Header;
    } else if (jsonPlayData.hasOwnProperty("headers")) {
        headers = jsonPlayData.headers;
    } else if (jsonPlayData.hasOwnProperty("Headers")) {
        headers = jsonPlayData.Headers;
    }

    let ua = "";
    if (jsonPlayData.hasOwnProperty("user-agent")) {
        ua = jsonPlayData["user-agent"];
    } else if (jsonPlayData.hasOwnProperty("User-Agent")) {
        ua = jsonPlayData["User-Agent"];
    }
    if (ua.trim().length > 0) {
        headers["User-Agent"] = " " + ua;
    }

    let referer = "";
    if (jsonPlayData.hasOwnProperty("referer")) {
        referer = jsonPlayData.referer;
    } else if (jsonPlayData.hasOwnProperty("Referer")) {
        referer = jsonPlayData.Referer;
    }
    if (referer.trim().length > 0) {
        headers["Referer"] = " " + referer;
    }

    headers = fixJsonVodHeader(headers, input, url);

    const taskResult = {
        header: headers,
        url: url,
        parse: 0
    };

    return taskResult;
}

function fixJsonVodHeader(headers, input, url) {
    if (headers === null) {
        headers = {};
    }

    if (input.includes("www.mgtv.com")) {
        headers["Referer"] = " ";
        headers["User-Agent"] = " Mozilla/5.0";
    } else if (url.includes("titan.mgtv")) {
        headers["Referer"] = " ";
        headers["User-Agent"] = " Mozilla/5.0";
    } else if (input.includes("bilibili")) {
        headers["Referer"] = " https://www.bilibili.com/";
        headers["User-Agent"] = " " + UA;
    }

    return headers;
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

async function search(wd, quick) {
    let data = JSON.parse(await request(HOST + '/index.php/ajax/suggest?mid=1&limit=50&wd=' + wd)).list;
    let videos = [];
    for (const vod of data) {
        videos.push({
            vod_id: '/vod/' + vod.id,
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