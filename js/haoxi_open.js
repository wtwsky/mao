import { Crypto, load, _ } from 'assets://js/lib/cat.js';

let key = 'haoxi';
let HOST = 'https://haoxi.xyz';
let parseMap = {};
const vipParser = 'https://huiyuan.haokantv.cyou';
let siteKey = '';
let siteType = 0;

const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1';

async function request(reqUrl, referer) {
    let res = await req(reqUrl, {
        method: 'get',
        headers: {
            'User-Agent': UA,
            'Referer': referer || HOST
        },
        timeout: 20000,
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
    let classes = [{"type_id":"1","type_name":"电影"},{"type_id":"2","type_name":"连续剧"},{"type_id":"4","type_name":"动漫"},{"type_id":"3","type_name":"综艺"},{"type_id":"60","type_name":"短剧"},{"type_id":"43","type_name":"电影解说"}];
    let filterObj = {
        "1":[{"key":"class","name":"类型","init":"","value":[{"n":"全部","v":""},{"n":"Netflix","v":"Netflix"},{"n":"剧情","v":"剧情"},{"n":"喜剧","v":"喜剧"},{"n":"动作","v":"动作"},{"n":"爱情","v":"爱情"},{"n":"恐怖","v":"恐怖"},{"n":"惊悚","v":"惊悚"},{"n":"犯罪","v":"犯罪"},{"n":"科幻","v":"科幻"},{"n":"悬疑","v":"悬疑"},{"n":"奇幻","v":"奇幻"},{"n":"冒险","v":"冒险"},{"n":"战争","v":"战争"},{"n":"历史","v":"历史"},{"n":"古装","v":"古装"},{"n":"家庭","v":"家庭"},{"n":"传记","v":"传记"},{"n":"武侠","v":"武侠"},{"n":"歌舞","v":"歌舞"},{"n":"短片","v":"短片"},{"n":"动画","v":"动画"},{"n":"儿童","v":"儿童"},{"n":"职场","v":"职场"}]},{"key":"area","name":"地区","init":"","value":[{"n":"全部","v":""},{"n":"大陆","v":"大陆"},{"n":"香港","v":"香港"},{"n":"台湾","v":"台湾"},{"n":"美国","v":"美国"},{"n":"日本","v":"日本"},{"n":"韩国","v":"韩国"},{"n":"英国","v":"英国"},{"n":"法国","v":"法国"},{"n":"德国","v":"德国"},{"n":"印度","v":"印度"},{"n":"泰国","v":"泰国"},{"n":"丹麦","v":"丹麦"},{"n":"瑞典","v":"瑞典"},{"n":"巴西","v":"巴西"},{"n":"加拿大","v":"加拿大"},{"n":"俄罗斯","v":"俄罗斯"},{"n":"比利时","v":"比利时"},{"n":"爱尔兰","v":"爱尔兰"},{"n":"西班牙","v":"西班牙"},{"n":"澳大利亚","v":"澳大利亚"}]},{"key":"year","name":"年份","init":"","value":[{"n":"全部","v":""},{"n":"2024","v":"2024"},{"n":"2023","v":"2023"},{"n":"2022","v":"2022"},{"n":"2021","v":"2021"},{"n":"2020","v":"2020"},{"n":"2019","v":"2019"},{"n":"2018","v":"2018"},{"n":"2017","v":"2017"},{"n":"2016","v":"2016"},{"n":"2015","v":"2015"},{"n":"2014","v":"2014"},{"n":"2013","v":"2013"},{"n":"2012","v":"2012"},{"n":"2011","v":"2011"},{"n":"2010","v":"2010"},{"n":"2009","v":"2009"},{"n":"2008","v":"2008"},{"n":"2007","v":"2007"}]},{"key":"lang","name":"语言","init":"","value":[{"n":"全部","v":""},{"n":"英语","v":"英语"},{"n":"法语","v":"法语"},{"n":"国语","v":"国语"},{"n":"粤语","v":"粤语"},{"n":"日语","v":"日语"},{"n":"韩语","v":"韩语"},{"n":"泰语","v":"泰语"},{"n":"德语","v":"德语"},{"n":"俄语","v":"俄语"},{"n":"闽南语","v":"闽南语"},{"n":"丹麦语","v":"丹麦语"},{"n":"波兰语","v":"波兰语"},{"n":"瑞典语","v":"瑞典语"},{"n":"印地语","v":"印地语"},{"n":"挪威语","v":"挪威语"},{"n":"意大利语","v":"意大利语"},{"n":"西班牙语","v":"西班牙语"},{"n":"其他","v":"其他"}]},{"key":"version","name":"版本","init":"","value":[{"n":"全部","v":""},{"n":"4K","v":"4K"},{"n":"蓝光","v":"蓝光"},{"n":"高清版","v":"高清版"},{"n":"剧场版","v":"剧场版"},{"n":"抢先版","v":"抢先版"},{"n":"TV","v":"TV"},{"n":"影院版","v":"影院版"}]},{"key":"letter","name":"字母","init":"","value":[{"n":"全部","v":""},{"n":"A","v":"A"},{"n":"B","v":"B"},{"n":"C","v":"C"},{"n":"D","v":"D"},{"n":"E","v":"E"},{"n":"F","v":"F"},{"n":"G","v":"G"},{"n":"H","v":"H"},{"n":"I","v":"I"},{"n":"J","v":"J"},{"n":"K","v":"K"},{"n":"L","v":"L"},{"n":"M","v":"M"},{"n":"N","v":"N"},{"n":"O","v":"O"},{"n":"P","v":"P"},{"n":"Q","v":"Q"},{"n":"R","v":"R"},{"n":"S","v":"S"},{"n":"T","v":"T"},{"n":"U","v":"U"},{"n":"V","v":"V"},{"n":"W","v":"W"},{"n":"X","v":"X"},{"n":"Y","v":"Y"},{"n":"Z","v":"Z"},{"n":"0-9","v":"0-9"}]},{"key":"by","name":"排序","value":[{"n":"时间","v":"time"},{"n":"人气","v":"hits"},{"n":"评分","v":"score"}]}],
        "2":[{"key":"class","name":"类型","init":"","value":[{"n":"全部","v":""},{"n":"Netflix","v":"Netflix"},{"n":"剧情","v":"剧情"},{"n":"爱情","v":"爱情"},{"n":"喜剧","v":"喜剧"},{"n":"犯罪","v":"犯罪"},{"n":"悬疑","v":"悬疑"},{"n":"古装","v":"古装"},{"n":"动作","v":"动作"},{"n":"家庭","v":"家庭"},{"n":"惊悚","v":"惊悚"},{"n":"奇幻","v":"奇幻"},{"n":"美剧","v":"美剧"},{"n":"科幻","v":"科幻"},{"n":"历史","v":"历史"},{"n":"战争","v":"战争"},{"n":"韩剧","v":"韩剧"},{"n":"武侠","v":"武侠"},{"n":"言情","v":"言情"},{"n":"恐怖","v":"恐怖"},{"n":"冒险","v":"冒险"},{"n":"都市","v":"都市"},{"n":"职场","v":"职场"}]},{"key":"area","name":"地区","init":"","value":[{"n":"全部","v":""},{"n":"大陆","v":"大陆"},{"n":"香港","v":"香港"},{"n":"韩国","v":"韩国"},{"n":"美国","v":"美国"},{"n":"日本","v":"日本"},{"n":"法国","v":"法国"},{"n":"英国","v":"英国"},{"n":"德国","v":"德国"},{"n":"台湾","v":"台湾"},{"n":"泰国","v":"泰国"},{"n":"印度","v":"印度"},{"n":"其他","v":"其他"}]},{"key":"year","name":"年份","init":"","value":[{"n":"全部","v":""},{"n":"2024","v":"2024"},{"n":"2023","v":"2023"},{"n":"2022","v":"2022"},{"n":"2021","v":"2021"},{"n":"2020","v":"2020"},{"n":"2019","v":"2019"},{"n":"2018","v":"2018"},{"n":"2017","v":"2017"},{"n":"2016","v":"2016"},{"n":"2015","v":"2015"},{"n":"2014","v":"2014"},{"n":"2013","v":"2013"},{"n":"2012","v":"2012"},{"n":"2011","v":"2011"},{"n":"2010","v":"2010"},{"n":"2009","v":"2009"},{"n":"2008","v":"2008"},{"n":"2007","v":"2007"}]},{"key":"lang","name":"语言","init":"","value":[{"n":"全部","v":""},{"n":"国语","v":"国语"},{"n":"英语","v":"英语"},{"n":"粤语","v":"粤语"},{"n":"闽南语","v":"闽南语"},{"n":"韩语","v":"韩语"},{"n":"日语","v":"日语"},{"n":"其他","v":"其他"}]},{"key":"version","name":"版本","init":"","value":[{"n":"全部","v":""},{"n":"4K","v":"4K"},{"n":"热门连续剧","v":"热门连续剧"},{"n":"港台剧","v":"港台剧"},{"n":"日韩剧","v":"日韩剧"},{"n":"欧美剧","v":"欧美剧"}]},{"key":"letter","name":"字母","init":"","value":[{"n":"全部","v":""},{"n":"A","v":"A"},{"n":"B","v":"B"},{"n":"C","v":"C"},{"n":"D","v":"D"},{"n":"E","v":"E"},{"n":"F","v":"F"},{"n":"G","v":"G"},{"n":"H","v":"H"},{"n":"I","v":"I"},{"n":"J","v":"J"},{"n":"K","v":"K"},{"n":"L","v":"L"},{"n":"M","v":"M"},{"n":"N","v":"N"},{"n":"O","v":"O"},{"n":"P","v":"P"},{"n":"Q","v":"Q"},{"n":"R","v":"R"},{"n":"S","v":"S"},{"n":"T","v":"T"},{"n":"U","v":"U"},{"n":"V","v":"V"},{"n":"W","v":"W"},{"n":"X","v":"X"},{"n":"Y","v":"Y"},{"n":"Z","v":"Z"},{"n":"0-9","v":"0-9"}]},{"key":"by","name":"排序","value":[{"n":"时间","v":"time"},{"n":"人气","v":"hits"},{"n":"评分","v":"score"}]}],
        "3":[{"key":"class","name":"类型","init":"","value":[{"n":"全部","v":""},{"n":"Netflix","v":"Netflix"},{"n":"真人秀","v":"真人秀"},{"n":"情感","v":"情感"},{"n":"爱情","v":"爱情"},{"n":"记录","v":"记录"},{"n":"脱口秀","v":"脱口秀"},{"n":"剧情","v":"剧情"},{"n":"访谈","v":"访谈"},{"n":"历史","v":"历史"},{"n":"喜剧","v":"喜剧"},{"n":"相声","v":"相声"},{"n":"节目","v":"节目"},{"n":"歌舞","v":"歌舞"},{"n":"冒险","v":"冒险"},{"n":"运动","v":"运动"},{"n":"Season","v":"Season"},{"n":"犯罪","v":"犯罪"},{"n":"短片","v":"短片"},{"n":"搞笑","v":"搞笑"},{"n":"晚会","v":"晚会"}]},{"key":"year","name":"年份","init":"","value":[{"n":"全部","v":""},{"n":"2024","v":"2024"},{"n":"2023","v":"2023"},{"n":"2022","v":"2022"},{"n":"2021","v":"2021"},{"n":"2020","v":"2020"},{"n":"2019","v":"2019"},{"n":"2018","v":"2018"},{"n":"2017","v":"2017"},{"n":"2016","v":"2016"},{"n":"2015","v":"2015"},{"n":"2014","v":"2014"},{"n":"2013","v":"2013"},{"n":"2012","v":"2012"},{"n":"2011","v":"2011"},{"n":"2010","v":"2010"},{"n":"2009","v":"2009"},{"n":"2008","v":"2008"},{"n":"2007","v":"2007"}]},{"key":"lang","name":"语言","init":"","value":[{"n":"全部","v":""},{"n":"国语","v":"国语"},{"n":"英语","v":"英语"},{"n":"粤语","v":"粤语"},{"n":"闽南语","v":"闽南语"},{"n":"韩语","v":"韩语"},{"n":"日语","v":"日语"},{"n":"其他","v":"其他"}]},{"key":"version","name":"版本","init":"","value":[{"n":"全部","v":""},{"n":"4K","v":"4K"},{"n":"蓝光","v":"蓝光"},{"n":"高清版","v":"高清版"}]},{"key":"letter","name":"字母","init":"","value":[{"n":"全部","v":""},{"n":"A","v":"A"},{"n":"B","v":"B"},{"n":"C","v":"C"},{"n":"D","v":"D"},{"n":"E","v":"E"},{"n":"F","v":"F"},{"n":"G","v":"G"},{"n":"H","v":"H"},{"n":"I","v":"I"},{"n":"J","v":"J"},{"n":"K","v":"K"},{"n":"L","v":"L"},{"n":"M","v":"M"},{"n":"N","v":"N"},{"n":"O","v":"O"},{"n":"P","v":"P"},{"n":"Q","v":"Q"},{"n":"R","v":"R"},{"n":"S","v":"S"},{"n":"T","v":"T"},{"n":"U","v":"U"},{"n":"V","v":"V"},{"n":"W","v":"W"},{"n":"X","v":"X"},{"n":"Y","v":"Y"},{"n":"Z","v":"Z"},{"n":"0-9","v":"0-9"}]},{"key":"by","name":"排序","value":[{"n":"时间","v":"time"},{"n":"人气","v":"hits"},{"n":"评分","v":"score"}]}],
        "4":[{"key":"class","name":"类型","init":"","value":[{"n":"全部","v":""},{"n":"Netflix","v":"Netflix"},{"n":"剧情","v":"剧情"},{"n":"动画","v":"动画"},{"n":"喜剧","v":"喜剧"},{"n":"冒险","v":"冒险"},{"n":"动作","v":"动作"},{"n":"奇幻","v":"奇幻"},{"n":"科幻","v":"科幻"},{"n":"儿童","v":"儿童"},{"n":"搞笑","v":"搞笑"},{"n":"爱情","v":"爱情"},{"n":"家庭","v":"家庭"},{"n":"短片","v":"短片"},{"n":"热血","v":"热血"},{"n":"益智","v":"益智"},{"n":"悬疑","v":"悬疑"},{"n":"经典","v":"经典"},{"n":"校园","v":"校园"},{"n":"Anime","v":"Anime"},{"n":"运动","v":"运动"},{"n":"亲子","v":"亲子"},{"n":"青春","v":"青春"},{"n":"恋爱","v":"恋爱"},{"n":"武侠","v":"武侠"},{"n":"惊悚","v":"惊悚"},{"n":"动态漫画","v":"动态漫画"}]},{"key":"year","name":"年份","init":"","value":[{"n":"全部","v":""},{"n":"2024","v":"2024"},{"n":"2023","v":"2023"},{"n":"2022","v":"2022"},{"n":"2021","v":"2021"},{"n":"2020","v":"2020"},{"n":"2019","v":"2019"},{"n":"2018","v":"2018"},{"n":"2017","v":"2017"},{"n":"2016","v":"2016"},{"n":"2015","v":"2015"},{"n":"2014","v":"2014"},{"n":"2013","v":"2013"},{"n":"2012","v":"2012"},{"n":"2011","v":"2011"},{"n":"2010","v":"2010"},{"n":"2009","v":"2009"},{"n":"2008","v":"2008"},{"n":"2007","v":"2007"}]},{"key":"lang","name":"语言","init":"","value":[{"n":"全部","v":""},{"n":"国语","v":"国语"},{"n":"英语","v":"英语"},{"n":"粤语","v":"粤语"},{"n":"闽南语","v":"闽南语"},{"n":"韩语","v":"韩语"},{"n":"日语","v":"日语"},{"n":"其他","v":"其他"}]},{"key":"version","name":"版本","init":"","value":[{"n":"全部","v":""},{"n":"4K","v":"4K"},{"n":"TV版","v":"TV版"},{"n":"电影版","v":"电影版"},{"n":"OVA版","v":"OVA版"},{"n":"真人版","v":"真人版"}]},{"key":"letter","name":"字母","init":"","value":[{"n":"全部","v":""},{"n":"A","v":"A"},{"n":"B","v":"B"},{"n":"C","v":"C"},{"n":"D","v":"D"},{"n":"E","v":"E"},{"n":"F","v":"F"},{"n":"G","v":"G"},{"n":"H","v":"H"},{"n":"I","v":"I"},{"n":"J","v":"J"},{"n":"K","v":"K"},{"n":"L","v":"L"},{"n":"M","v":"M"},{"n":"N","v":"N"},{"n":"O","v":"O"},{"n":"P","v":"P"},{"n":"Q","v":"Q"},{"n":"R","v":"R"},{"n":"S","v":"S"},{"n":"T","v":"T"},{"n":"U","v":"U"},{"n":"V","v":"V"},{"n":"W","v":"W"},{"n":"X","v":"X"},{"n":"Y","v":"Y"},{"n":"Z","v":"Z"},{"n":"0-9","v":"0-9"}]},{"key":"by","name":"排序","value":[{"n":"时间","v":"time"},{"n":"人气","v":"hits"},{"n":"评分","v":"score"}]}],
        "60":[{"key":"class","name":"类型","init":"","value":[{"n":"全部","v":""},{"n":"都市","v":"都市"},{"n":"逆袭","v":"逆袭"},{"n":"穿越","v":"穿越"},{"n":"剧情","v":"剧情"},{"n":"言情","v":"言情"},{"n":"虐恋","v":"虐恋"},{"n":"重生","v":"重生"}]},{"key":"letter","name":"字母","init":"","value":[{"n":"全部","v":""},{"n":"A","v":"A"},{"n":"B","v":"B"},{"n":"C","v":"C"},{"n":"D","v":"D"},{"n":"E","v":"E"},{"n":"F","v":"F"},{"n":"G","v":"G"},{"n":"H","v":"H"},{"n":"I","v":"I"},{"n":"J","v":"J"},{"n":"K","v":"K"},{"n":"L","v":"L"},{"n":"M","v":"M"},{"n":"N","v":"N"},{"n":"O","v":"O"},{"n":"P","v":"P"},{"n":"Q","v":"Q"},{"n":"R","v":"R"},{"n":"S","v":"S"},{"n":"T","v":"T"},{"n":"U","v":"U"},{"n":"V","v":"V"},{"n":"W","v":"W"},{"n":"X","v":"X"},{"n":"Y","v":"Y"},{"n":"Z","v":"Z"},{"n":"0-9","v":"0-9"}]},{"key":"by","name":"排序","value":[{"n":"时间","v":"time"},{"n":"人气","v":"hits"},{"n":"评分","v":"score"}]}],
        "43":[{"key":"class","name":"类型","init":"","value":[{"n":"全部","v":""},{"n":"Netflix","v":"Netflix"},{"n":"仙侠","v":"仙侠"},{"n":"剧情","v":"剧情"},{"n":"科幻","v":"科幻"},{"n":"动作","v":"动作"},{"n":"喜剧","v":"喜剧"},{"n":"爱情","v":"爱情"},{"n":"冒险","v":"冒险"},{"n":"儿童","v":"儿童"},{"n":"歌舞","v":"歌舞"},{"n":"音乐","v":"音乐"},{"n":"奇幻","v":"奇幻"},{"n":"动画","v":"动画"},{"n":"恐怖","v":"恐怖"},{"n":"惊悚","v":"惊悚"},{"n":"丧尸","v":"丧尸"},{"n":"战争","v":"战争"},{"n":"传记","v":"传记"},{"n":"纪录","v":"纪录"},{"n":"犯罪","v":"犯罪"},{"n":"悬疑","v":"悬疑"},{"n":"西部","v":"西部"},{"n":"灾难","v":"灾难"}]},{"key":"area","name":"地区","init":"","value":[{"n":"全部","v":""},{"n":"大陆","v":"大陆"},{"n":"香港","v":"香港"},{"n":"台湾","v":"台湾"},{"n":"美国","v":"美国"},{"n":"日本","v":"日本"},{"n":"韩国","v":"韩国"},{"n":"英国","v":"英国"},{"n":"法国","v":"法国"},{"n":"德国","v":"德国"},{"n":"印度","v":"印度"},{"n":"泰国","v":"泰国"},{"n":"丹麦","v":"丹麦"},{"n":"瑞典","v":"瑞典"},{"n":"巴西","v":"巴西"},{"n":"加拿大","v":"加拿大"},{"n":"俄罗斯","v":"俄罗斯"},{"n":"比利时","v":"比利时"},{"n":"爱尔兰","v":"爱尔兰"},{"n":"西班牙","v":"西班牙"},{"n":"澳大利亚","v":"澳大利亚"}]},{"key":"year","name":"年份","init":"","value":[{"n":"全部","v":""},{"n":"2024","v":"2024"},{"n":"2023","v":"2023"},{"n":"2022","v":"2022"},{"n":"2021","v":"2021"},{"n":"2020","v":"2020"},{"n":"2019","v":"2019"},{"n":"2018","v":"2018"},{"n":"2017","v":"2017"},{"n":"2016","v":"2016"},{"n":"2015","v":"2015"},{"n":"2014","v":"2014"},{"n":"2013","v":"2013"},{"n":"2012","v":"2012"},{"n":"2011","v":"2011"},{"n":"2010","v":"2010"},{"n":"2009","v":"2009"},{"n":"2008","v":"2008"},{"n":"2007","v":"2007"}]},{"key":"lang","name":"语言","init":"","value":[{"n":"全部","v":""},{"n":"英语","v":"英语"},{"n":"法语","v":"法语"},{"n":"国语","v":"国语"},{"n":"粤语","v":"粤语"},{"n":"日语","v":"日语"},{"n":"韩语","v":"韩语"},{"n":"泰语","v":"泰语"},{"n":"德语","v":"德语"},{"n":"俄语","v":"俄语"},{"n":"闽南语","v":"闽南语"},{"n":"丹麦语","v":"丹麦语"},{"n":"波兰语","v":"波兰语"},{"n":"瑞典语","v":"瑞典语"},{"n":"印地语","v":"印地语"},{"n":"挪威语","v":"挪威语"},{"n":"意大利语","v":"意大利语"},{"n":"西班牙语","v":"西班牙语"},{"n":"其他","v":"其他"}]},{"key":"by","name":"排序","value":[{"n":"时间","v":"time"},{"n":"人气","v":"hits"},{"n":"评分","v":"score"}]}],
    };
    return {
        class: classes,
        filters: filterObj,
    };
}

async function homeVod() {}

async function category(tid, pg, filter, extend) {
    if (pg <= 0) pg = 1;
    let version = '';
    if (extend.version) {
        version = '/version/' + extend.version;
    }
    let page = '';
    if (pg > 1) {
        page = pg;
    }
    const link = HOST + '/vodshow/' + (extend.cateId || tid) + '-' + (extend.area || '') + '-' + (extend.by || '') + '-' + (extend.class || '') + '-' + (extend.lang || '') + '-' + (extend.letter || '') + '---' + page + '---' + (extend.year || '') + version + '/';//https://haoxi.vip/vodshow/1----%E8%8B%B1%E8%AF%AD-------2023/version/4K/
    const html = await request(link);
    const $ = load(html);
    const items = $('.public-list-div');
    let videos = _.map(items, (item) => {
        const itname = $(item).find('a:first')[0];
        const itimg = $(item).find('img:first')[0];
        const remarks = $($(item).find('span.public-list-prb')[0]).text().trim();
        return {
            vod_id: itname.attribs.href.replace(/.*?\/voddetail\/(.*)\//g, '$1'),
            vod_name: itname.attribs.title,
            vod_pic: itimg.attribs['data-src'],
            vod_remarks: remarks || '',
        };
    });
    const hasMore = $('div.page-info > a.page-link:contains(下一页)').length > 0;
    const pgCount = hasMore ? parseInt(pg) + 1 : parseInt(pg);
    return {
        page: parseInt(pg),
        pagecount: pgCount,
        limit: 24,
        total: 24 * pgCount,
        list: videos,
    };
}

async function detail(id) {
    let html = await request(HOST + '/voddetail/' + id + '/');
    let $ = load(html);
    let vod = {
        vod_id: id,
        vod_name: $('h3.slide-info-title').text().trim(),
        vod_type: $('.detail-info .slide-info span:eq(2)').text().trim(),
        vod_area: $('.detail-info .slide-info span:eq(1)').text(),
        vod_year: $('.detail-info .slide-info span:eq(0)').text(),
        vod_director: $('.search-show em.cor4:contains(导演：)').parent().text().substring(3),
        vod_actor: $('.search-show em.cor4:contains(主演：)').parent().text().substring(3),
        vod_pic: $('.detail-pic img:first').attr('data-src'),
        vod_remarks : $('.search-show em.cor4:contains(状态：)').parent().text().substring(3) || '',
        vod_content: $('#height_limit').text().trim(),
    };
    let playMap = {};
    let tabs = $('a.swiper-slide');
    let playlists = $('ul.anthology-list-play');
    _.each(tabs, (tab, i) => {
        let from = tab.children[1].data;
        let list = playlists[i];
        list = $(list).find('a');
        _.each(list, (it) => {
            let title = it.children[0].data.trim();
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
    return {
        list: [vod],
    };
}

async function play(flag, id, flags) {
    const link = HOST + id;
    const html = await request(link);
    const $ = load(html);
    const json = $('script:contains(player_aaaa)').text().replace('var player_aaaa=','');
    const js = JSON.parse(json);
    let playUrl = js.url;
    if (js.encrypt == 1) {
        playUrl = unescape(playUrl);
    } else if (js.encrypt == 2) {
        playUrl = unescape(base64Decode(playUrl));
    }
    if (playUrl.includes('.2kj.org/')) {
        playUrl = await parse2kj(playUrl);
    } else {
        let parseUrl = parseMap[flag];
        if (parseUrl) {
            if (parseUrl.includes(vipParser)) {
                playUrl = parseVip(playUrl);
            } else {
                const reqUrl = parseUrl + playUrl;
                const parseHtml = await request(reqUrl);
                const matches = parseHtml.match(/let ConFig = {([\w\W]*)},box/);
                if (!_.isEmpty(matches)) {
                    const configJson = '{' + matches[1].trim() + '}';
                    const config = JSON.parse(configJson);
                    playUrl = decryptUrl(config);
                }
            }
        } else {
            const vid = id.match(/.*\/(.*)-.*-.*/)[1];
            const reqUrl = HOST + '/addons/dp/player/dp.php?key=0&from=&id=' + vid + '&api=&url=' + playUrl + '&jump=';
            const parseHtml = await request(reqUrl);
            const matches = parseHtml.match(/\"url\": \"(.*)\"/);
            if (!_.isEmpty(matches)) {
                playUrl = matches[1];
            }
        }
    }
    return {
        parse: 0,
        url: playUrl,
    };
}

async function parse2kj(url) {
    const html = await request(url);
    const json = html.match(/var config = {([\w\W]*)}/)[1];
    const config = JSON.parse('{' + json.trim().replace(/,$/g, '') + '}');
    let urlstr = config.url;
    urlstr = urlstr.replaceAll('-','1');
    urlstr = urlstr.replaceAll('&','5');
    urlstr = urlstr.replaceAll('*','9');
    return base64Decode(urlstr);
}

async function parseVip(url) {
    const parseHost = vipParser;
    const parseUrl = parseHost + '/player/analysis.php?v=' + url;
    const refererUrl = parseHost + '/player/?url=' + url;
    const html = await request(parseUrl, refererUrl);
    const json = html.match(/var config = {([\w\W]*)}[\w\W]*config./)[1];
    const config = JSON.parse('{' + json.trim().replace(/,$/g, '') + '}');
    return decryptUrl(config.url, '202305051826239865');
}

function decryptUrl(url, decryptKey) {
    let cipher = '';
    const key = [];
    const box = [];
    const pwd = decryptKey;
    const pwdLength = pwd.length;
    const decoded = Crypto.enc.Base64.parse(url);
    const data = wordArrayToUint8Array(decoded.words);
    for (let i = 0; i < 256; i++) {
        key[i] = pwd.charCodeAt(i % pwdLength);
        box[i] = i;
    }
    for (let j = 0, i = 0; i < 256; i++) {
        j = (j + box[i] + key[i]) % 256;
        const tmp = box[i];
        box[i] = box[j];
        box[j] = tmp;
    }
    const dataLength = data.length;
    for (let a = 0, j = 0, i = 0, k = 0; i < dataLength; i++) {
        a = (a + 1) % 256;
        j = (j + box[a]) % 256;
        const tmp = box[a];
        box[a] = box[j];
        box[j] = tmp;
        k = box[((box[a] + box[j]) % 256)];
        cipher += String.fromCharCode(data[i] ^ k);
    }
    return decodeURIComponent(cipher);
}

function wordArrayToUint8Array(words) {
    let len = words.length;
    let u8Array = new Uint8Array(len << 2);
    let offset = 0, word;
    for (let i = 0; i < len; i++) {
        word = words[i];
        u8Array[offset++] = word >> 24;
        u8Array[offset++] = (word >> 16) & 0xff;
        u8Array[offset++] = (word >> 8) & 0xff;
        u8Array[offset++] = word & 0xff;
    }
    return u8Array;
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