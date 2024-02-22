import { Crypto, load, _ } from 'assets://js/lib/cat.js';

let key = 'anfun';
let HOST = 'https://www.anfuns.cc';
let siteKey = '';
let siteType = 0;

const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1';

async function request(reqUrl, agentSp) {
    let res = await req(reqUrl, {
        method: 'get',
        headers: {
            'User-Agent': agentSp || UA,
            'Referer': HOST
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
    let classes = [{"type_id":1,"type_name":"新旧番剧"},{"type_id":2,"type_name":"蓝光无修"},{"type_id":3,"type_name":"动漫剧场"},{"type_id":4,"type_name":"欧美动漫"}];
    let filterObj = {
        "1":[{"key":"class","name":"类型","init":"","value":[{"n":"全部","v":""},{"n":"原创","v":"原创"},{"n":"搞笑","v":"搞笑"},{"n":"日常","v":"日常"},{"n":"运动","v":"运动"},{"n":"励志","v":"励志"},{"n":"热血","v":"热血"},{"n":"战斗","v":"战斗"},{"n":"竞技","v":"竞技"},{"n":"校园","v":"校园"},{"n":"青春","v":"青春"},{"n":"偶像","v":"偶像"},{"n":"爱情","v":"爱情"},{"n":"恋爱","v":"恋爱"},{"n":"冒险","v":"冒险"},{"n":"后宫","v":"后宫"},{"n":"百合","v":"百合"},{"n":"治愈","v":"治愈"},{"n":"致郁","v":"致郁"},{"n":"胃痛","v":"胃痛"},{"n":"萝莉","v":"萝莉"},{"n":"魔法","v":"魔法"},{"n":"悬疑","v":"悬疑"},{"n":"猎奇","v":"猎奇"},{"n":"推理","v":"推理"},{"n":"奇幻","v":"奇幻"},{"n":"科幻","v":"科幻"},{"n":"游戏","v":"游戏"},{"n":"神魔","v":"神魔"},{"n":"恐怖","v":"恐怖"},{"n":"血腥","v":"血腥"},{"n":"机战","v":"机战"},{"n":"战争","v":"战争"},{"n":"犯罪","v":"犯罪"},{"n":"历史","v":"历史"},{"n":"社会","v":"社会"},{"n":"职场","v":"职场"},{"n":"剧情","v":"剧情"},{"n":"伪娘","v":"伪娘"},{"n":"耽美","v":"耽美"},{"n":"童年","v":"童年"},{"n":"教育","v":"教育"},{"n":"亲子","v":"亲子"},{"n":"真人","v":"真人"},{"n":"歌舞","v":"歌舞"},{"n":"肉番","v":"肉番"},{"n":"美少女","v":"美少女"},{"n":"吸血鬼","v":"吸血鬼"},{"n":"女性向","v":"女性向"},{"n":"漫画改","v":"漫画改"},{"n":"小说改","v":"小说改"},{"n":"异世界","v":"异世界"},{"n":"泡面番","v":"泡面番"},{"n":"欢乐向","v":"欢乐向"},{"n":"游戏改","v":"游戏改"},{"n":"NTR","v":"NTR"}]},{"key":"area","name":"地区","init":"","value":[{"n":"全部","v":""},{"n":"大陆","v":"大陆"},{"n":"日本","v":"日本"},{"n":"欧美","v":"欧美"}]},{"key":"year","name":"年份","init":"","value":[{"n":"全部","v":""},{"n":"2024","v":"2024"},{"n":"2023","v":"2023"},{"n":"2022","v":"2022"},{"n":"2021","v":"2021"},{"n":"2020","v":"2020"},{"n":"2019","v":"2019"},{"n":"2018","v":"2018"},{"n":"2017","v":"2017"},{"n":"2016","v":"2016"},{"n":"2015","v":"2015"},{"n":"2014","v":"2014"},{"n":"2013","v":"2013"},{"n":"2012","v":"2012"},{"n":"2011","v":"2011"},{"n":"2010","v":"2010"},{"n":"2009","v":"2009"},{"n":"2008","v":"2008"},{"n":"2007","v":"2007"},{"n":"2006","v":"2006"},{"n":"2005","v":"2005"},{"n":"2004","v":"2004"},{"n":"2003","v":"2003"},{"n":"2002","v":"2002"},{"n":"2001","v":"2001"},{"n":"2000","v":"2000"}]},{"key":"lang","name":"语言","init":"","value":[{"n":"全部","v":""},{"n":"国语","v":"国语"},{"n":"日语","v":"日语"},{"n":"英语","v":"英语"}]},{"key":"letter","name":"字母","init":"","value":[{"n":"全部","v":""},{"n":"A","v":"A"},{"n":"B","v":"B"},{"n":"C","v":"C"},{"n":"D","v":"D"},{"n":"E","v":"E"},{"n":"F","v":"F"},{"n":"G","v":"G"},{"n":"H","v":"H"},{"n":"I","v":"I"},{"n":"J","v":"J"},{"n":"K","v":"K"},{"n":"L","v":"L"},{"n":"M","v":"M"},{"n":"N","v":"N"},{"n":"O","v":"O"},{"n":"P","v":"P"},{"n":"Q","v":"Q"},{"n":"R","v":"R"},{"n":"S","v":"S"},{"n":"T","v":"T"},{"n":"U","v":"U"},{"n":"V","v":"V"},{"n":"W","v":"W"},{"n":"X","v":"X"},{"n":"Y","v":"Y"},{"n":"Z","v":"Z"},{"n":"0-9","v":"0-9"}]},{"key":"by","name":"排序","value":[{"n":"最新","v":"time"},{"n":"最热","v":"hits"},{"n":"评分","v":"score"}]}],
        "2":[{"key":"class","name":"类型","init":"","value":[{"n":"全部","v":""},{"n":"原创","v":"原创"},{"n":"搞笑","v":"搞笑"},{"n":"日常","v":"日常"},{"n":"运动","v":"运动"},{"n":"励志","v":"励志"},{"n":"热血","v":"热血"},{"n":"战斗","v":"战斗"},{"n":"竞技","v":"竞技"},{"n":"校园","v":"校园"},{"n":"青春","v":"青春"},{"n":"偶像","v":"偶像"},{"n":"爱情","v":"爱情"},{"n":"恋爱","v":"恋爱"},{"n":"冒险","v":"冒险"},{"n":"后宫","v":"后宫"},{"n":"百合","v":"百合"},{"n":"治愈","v":"治愈"},{"n":"致郁","v":"致郁"},{"n":"胃痛","v":"胃痛"},{"n":"萝莉","v":"萝莉"},{"n":"魔法","v":"魔法"},{"n":"悬疑","v":"悬疑"},{"n":"猎奇","v":"猎奇"},{"n":"推理","v":"推理"},{"n":"奇幻","v":"奇幻"},{"n":"科幻","v":"科幻"},{"n":"游戏","v":"游戏"},{"n":"神魔","v":"神魔"},{"n":"恐怖","v":"恐怖"},{"n":"血腥","v":"血腥"},{"n":"机战","v":"机战"},{"n":"战争","v":"战争"},{"n":"犯罪","v":"犯罪"},{"n":"历史","v":"历史"},{"n":"社会","v":"社会"},{"n":"职场","v":"职场"},{"n":"剧情","v":"剧情"},{"n":"伪娘","v":"伪娘"},{"n":"耽美","v":"耽美"},{"n":"童年","v":"童年"},{"n":"教育","v":"教育"},{"n":"亲子","v":"亲子"},{"n":"真人","v":"真人"},{"n":"歌舞","v":"歌舞"},{"n":"肉番","v":"肉番"},{"n":"美少女","v":"美少女"},{"n":"吸血鬼","v":"吸血鬼"},{"n":"女性向","v":"女性向"},{"n":"漫画改","v":"漫画改"},{"n":"小说改","v":"小说改"},{"n":"异世界","v":"异世界"},{"n":"泡面番","v":"泡面番"},{"n":"欢乐向","v":"欢乐向"},{"n":"游戏改","v":"游戏改"},{"n":"NTR","v":"NTR"}]},{"key":"area","name":"地区","init":"","value":[{"n":"全部","v":""},{"n":"大陆","v":"大陆"},{"n":"日本","v":"日本"},{"n":"欧美","v":"欧美"}]},{"key":"year","name":"年份","init":"","value":[{"n":"全部","v":""},{"n":"2024","v":"2024"},{"n":"2023","v":"2023"},{"n":"2022","v":"2022"},{"n":"2021","v":"2021"},{"n":"2020","v":"2020"},{"n":"2019","v":"2019"},{"n":"2018","v":"2018"},{"n":"2017","v":"2017"},{"n":"2016","v":"2016"},{"n":"2015","v":"2015"},{"n":"2014","v":"2014"},{"n":"2013","v":"2013"},{"n":"2012","v":"2012"},{"n":"2011","v":"2011"},{"n":"2010","v":"2010"},{"n":"2009","v":"2009"},{"n":"2008","v":"2008"},{"n":"2007","v":"2007"},{"n":"2006","v":"2006"},{"n":"2005","v":"2005"},{"n":"2004","v":"2004"},{"n":"2003","v":"2003"},{"n":"2002","v":"2002"},{"n":"2001","v":"2001"},{"n":"2000","v":"2000"}]},{"key":"lang","name":"语言","init":"","value":[{"n":"全部","v":""},{"n":"国语","v":"国语"},{"n":"日语","v":"日语"},{"n":"英语","v":"英语"}]},{"key":"letter","name":"字母","init":"","value":[{"n":"全部","v":""},{"n":"A","v":"A"},{"n":"B","v":"B"},{"n":"C","v":"C"},{"n":"D","v":"D"},{"n":"E","v":"E"},{"n":"F","v":"F"},{"n":"G","v":"G"},{"n":"H","v":"H"},{"n":"I","v":"I"},{"n":"J","v":"J"},{"n":"K","v":"K"},{"n":"L","v":"L"},{"n":"M","v":"M"},{"n":"N","v":"N"},{"n":"O","v":"O"},{"n":"P","v":"P"},{"n":"Q","v":"Q"},{"n":"R","v":"R"},{"n":"S","v":"S"},{"n":"T","v":"T"},{"n":"U","v":"U"},{"n":"V","v":"V"},{"n":"W","v":"W"},{"n":"X","v":"X"},{"n":"Y","v":"Y"},{"n":"Z","v":"Z"},{"n":"0-9","v":"0-9"}]},{"key":"by","name":"排序","value":[{"n":"最新","v":"time"},{"n":"最热","v":"hits"},{"n":"评分","v":"score"}]}],
        "3":[{"key":"class","name":"类型","init":"","value":[{"n":"全部","v":""},{"n":"原创","v":"原创"},{"n":"搞笑","v":"搞笑"},{"n":"日常","v":"日常"},{"n":"运动","v":"运动"},{"n":"励志","v":"励志"},{"n":"热血","v":"热血"},{"n":"战斗","v":"战斗"},{"n":"竞技","v":"竞技"},{"n":"校园","v":"校园"},{"n":"青春","v":"青春"},{"n":"偶像","v":"偶像"},{"n":"爱情","v":"爱情"},{"n":"恋爱","v":"恋爱"},{"n":"冒险","v":"冒险"},{"n":"后宫","v":"后宫"},{"n":"百合","v":"百合"},{"n":"治愈","v":"治愈"},{"n":"致郁","v":"致郁"},{"n":"胃痛","v":"胃痛"},{"n":"萝莉","v":"萝莉"},{"n":"魔法","v":"魔法"},{"n":"悬疑","v":"悬疑"},{"n":"猎奇","v":"猎奇"},{"n":"推理","v":"推理"},{"n":"奇幻","v":"奇幻"},{"n":"科幻","v":"科幻"},{"n":"游戏","v":"游戏"},{"n":"神魔","v":"神魔"},{"n":"恐怖","v":"恐怖"},{"n":"血腥","v":"血腥"},{"n":"机战","v":"机战"},{"n":"战争","v":"战争"},{"n":"犯罪","v":"犯罪"},{"n":"历史","v":"历史"},{"n":"社会","v":"社会"},{"n":"职场","v":"职场"},{"n":"剧情","v":"剧情"},{"n":"伪娘","v":"伪娘"},{"n":"耽美","v":"耽美"},{"n":"童年","v":"童年"},{"n":"教育","v":"教育"},{"n":"亲子","v":"亲子"},{"n":"真人","v":"真人"},{"n":"歌舞","v":"歌舞"},{"n":"肉番","v":"肉番"},{"n":"美少女","v":"美少女"},{"n":"吸血鬼","v":"吸血鬼"},{"n":"女性向","v":"女性向"},{"n":"漫画改","v":"漫画改"},{"n":"小说改","v":"小说改"},{"n":"异世界","v":"异世界"},{"n":"泡面番","v":"泡面番"},{"n":"欢乐向","v":"欢乐向"},{"n":"游戏改","v":"游戏改"},{"n":"NTR","v":"NTR"}]},{"key":"area","name":"地区","init":"","value":[{"n":"全部","v":""},{"n":"大陆","v":"大陆"},{"n":"日本","v":"日本"},{"n":"欧美","v":"欧美"}]},{"key":"year","name":"年份","init":"","value":[{"n":"全部","v":""},{"n":"2024","v":"2024"},{"n":"2023","v":"2023"},{"n":"2022","v":"2022"},{"n":"2021","v":"2021"},{"n":"2020","v":"2020"},{"n":"2019","v":"2019"},{"n":"2018","v":"2018"},{"n":"2017","v":"2017"},{"n":"2016","v":"2016"},{"n":"2015","v":"2015"},{"n":"2014","v":"2014"},{"n":"2013","v":"2013"},{"n":"2012","v":"2012"},{"n":"2011","v":"2011"},{"n":"2010","v":"2010"},{"n":"2009","v":"2009"},{"n":"2008","v":"2008"},{"n":"2007","v":"2007"},{"n":"2006","v":"2006"},{"n":"2005","v":"2005"},{"n":"2004","v":"2004"},{"n":"2003","v":"2003"},{"n":"2002","v":"2002"},{"n":"2001","v":"2001"},{"n":"2000","v":"2000"}]},{"key":"lang","name":"语言","init":"","value":[{"n":"全部","v":""},{"n":"国语","v":"国语"},{"n":"日语","v":"日语"},{"n":"英语","v":"英语"}]},{"key":"letter","name":"字母","init":"","value":[{"n":"全部","v":""},{"n":"A","v":"A"},{"n":"B","v":"B"},{"n":"C","v":"C"},{"n":"D","v":"D"},{"n":"E","v":"E"},{"n":"F","v":"F"},{"n":"G","v":"G"},{"n":"H","v":"H"},{"n":"I","v":"I"},{"n":"J","v":"J"},{"n":"K","v":"K"},{"n":"L","v":"L"},{"n":"M","v":"M"},{"n":"N","v":"N"},{"n":"O","v":"O"},{"n":"P","v":"P"},{"n":"Q","v":"Q"},{"n":"R","v":"R"},{"n":"S","v":"S"},{"n":"T","v":"T"},{"n":"U","v":"U"},{"n":"V","v":"V"},{"n":"W","v":"W"},{"n":"X","v":"X"},{"n":"Y","v":"Y"},{"n":"Z","v":"Z"},{"n":"0-9","v":"0-9"}]},{"key":"by","name":"排序","value":[{"n":"最新","v":"time"},{"n":"最热","v":"hits"},{"n":"评分","v":"score"}]}],
        "4":[{"key":"area","name":"地区","init":"","value":[{"n":"全部","v":""},{"n":"欧美","v":"欧美"}]},{"key":"year","name":"年份","init":"","value":[{"n":"全部","v":""},{"n":"2024","v":"2024"},{"n":"2023","v":"2023"},{"n":"2022","v":"2022"},{"n":"2021","v":"2021"},{"n":"2020","v":"2020"},{"n":"2019","v":"2019"},{"n":"2018","v":"2018"},{"n":"2017","v":"2017"},{"n":"2016","v":"2016"},{"n":"2015","v":"2015"},{"n":"2014","v":"2014"},{"n":"2013","v":"2013"},{"n":"2012","v":"2012"},{"n":"2011","v":"2011"},{"n":"2010","v":"2010"},{"n":"2009","v":"2009"},{"n":"2008","v":"2008"},{"n":"2007","v":"2007"},{"n":"2006","v":"2006"},{"n":"2005","v":"2005"},{"n":"2004","v":"2004"},{"n":"2003","v":"2003"},{"n":"2002","v":"2002"},{"n":"2001","v":"2001"},{"n":"2000","v":"2000"}]},{"key":"lang","name":"语言","init":"","value":[{"n":"全部","v":""},{"n":"国语","v":"国语"},{"n":"日语","v":"日语"},{"n":"英语","v":"英语"}]},{"key":"letter","name":"字母","init":"","value":[{"n":"全部","v":""},{"n":"A","v":"A"},{"n":"B","v":"B"},{"n":"C","v":"C"},{"n":"D","v":"D"},{"n":"E","v":"E"},{"n":"F","v":"F"},{"n":"G","v":"G"},{"n":"H","v":"H"},{"n":"I","v":"I"},{"n":"J","v":"J"},{"n":"K","v":"K"},{"n":"L","v":"L"},{"n":"M","v":"M"},{"n":"N","v":"N"},{"n":"O","v":"O"},{"n":"P","v":"P"},{"n":"Q","v":"Q"},{"n":"R","v":"R"},{"n":"S","v":"S"},{"n":"T","v":"T"},{"n":"U","v":"U"},{"n":"V","v":"V"},{"n":"W","v":"W"},{"n":"X","v":"X"},{"n":"Y","v":"Y"},{"n":"Z","v":"Z"},{"n":"0-9","v":"0-9"}]},{"key":"by","name":"排序","value":[{"n":"最新","v":"time"},{"n":"最热","v":"hits"},{"n":"评分","v":"score"}]}]
    };

    return {
        class: classes,
        filters: filterObj,
    };
}

async function homeVod() {}

async function category(tid, pg, filter, extend) {
    if (pg <= 0) pg = 1;
    const area = getFilterUrlPart(extend, 'area');
    const by = getFilterUrlPart(extend, 'by');
    const lang = getFilterUrlPart(extend, 'lang');
    let page = '';
    if (pg > 1) {
        page = '/page/' + pg;
    }
    const link = HOST + '/show/' + tid + '-' + (extend.class || '') + '-' + (extend.letter || '') + '-' + (extend.year || '') + area + by + lang + page + '.html';//https://www.anfuns.cc/show/1-%E5%8E%9F%E5%88%9B--/area/%E6%97%A5%E6%9C%AC/lang/%E6%97%A5%E8%AF%AD/page/2.html
    const html = await request(link);
    const $ = load(html);
    const items = $('ul.hl-vod-list > li');
    let videos = _.map(items, (item) => {
        const it = $(item).find('a:first')[0];
        const remarks = $($(item).find('span.hl-lc-1')[0]).text().trim();
        return {
            vod_id: it.attribs.href.replace(/.*?\/anime\/(.*).html/g, '$1'),
            vod_name: it.attribs.title,
            vod_pic: it.attribs['data-original'],
            vod_remarks: remarks || '',
        };
    });
    const hasMore = $('ul.hl-page-wrap > li > a > span.hl-hidden-xs:contains(下一页)').length > 0;
    const pgCount = hasMore ? parseInt(pg) + 1 : parseInt(pg);
    return {
        page: parseInt(pg),
        pagecount: pgCount,
        limit: 24,
        total: 24 * pgCount,
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
    var html = await request(HOST + '/anime/' + id + '.html');
    var $ = load(html);
    var vod = {
        vod_id: id,
        vod_name: $('h2:first').text().trim(),
        vod_type: $('.hl-mob-type').text(),
        vod_area: $('.hl-full-box li:contains(地区：)').text(),
        vod_year: $('.hl-full-box li:contains(年份：)').text(),
        vod_director: $('.hl-full-box li:contains(导演：)').text().substring(3).replace(/\/$/g, ''),
        vod_actor: $('.hl-full-box li:contains(主演：)').text().substring(3).replace(/\/$/g, ''),
        vod_pic: $('.hl-full-box .hl-item-thumb').attr('data-original'),
        vod_remarks : $('.hl-full-box li:contains(状态：)').text().substring(3),
        vod_content: $('.hl-full-box li:contains(简介：)').text().substring(3),
    };
    var playMap = {};
    var tabs = $('ul.hl-from-list > li > span');
    var playlists = $('ul.hl-plays-list');
    _.each(tabs, (tab, i) => {
        var from = tab.children[0].data;
        var list = playlists[i];
        list = $(list).find('li a');
        _.each(list, (it) => {
            var title = it.children[0].data;
            var playUrl = it.attribs.href;
          
            if (!playMap.hasOwnProperty(from)) {
                playMap[from] = [];
            }
            playMap[from].push( title + '$' + playUrl);
        });
    });
    vod.vod_play_from = _.keys(playMap).join('$$$');
    var urls = _.values(playMap);
    var vod_play_url = _.map(urls, (urlist) => {
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
    const js = JSON.parse($('script:contains(player_)').html().replace('var player_aaaa=',''));
    const playurl = js.url;
    const playUrl = unescape(base64Decode(playurl));
    return {
        parse: 0,
        url: playUrl,
    };
}

function base64Decode(text) {
    return Crypto.enc.Utf8.stringify(Crypto.enc.Base64.parse(text));
}

async function search(wd, quick) {
    let data = JSON.parse(await request(HOST + '/index.php/ajax/suggest?mid=1&limit=50&wd=' + wd)).list;
    let videos = [];
    for (const vod of data) {
        videos.push({
            vod_id: vod.id,
            vod_name: vod.name,
            vod_pic: vod.pic,
            vod_remarks: '',
        });
    }
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