import { Crypto, load, _ } from 'assets://js/lib/cat.js';

let key = 'catw_moe';
let HOST = 'https://catw.moe';
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
}

async function home(filter) {
    const classes = [{'type_id':'1','type_name':'TV动画'},{'type_id':'2','type_name':'剧场版'},{'type_id':'20','type_name':'特摄剧'}];
    const filterObj = {
        '1':[{'key':'class','name':'类型','init':'','value':[{'n':'全部','v':''},{'n':'搞笑','v':'搞笑'},{'n':'运动','v':'运动'},{'n':'异世界','v':'异世界'},{'n':'励志','v':'励志'},{'n':'热血','v':'热血'},{'n':'战斗','v':'战斗'},{'n':'竞技','v':'竞技'},{'n':'校园','v':'校园'},{'n':'青春','v':'青春'},{'n':'恋爱','v':'恋爱'},{'n':'冒险','v':'冒险'},{'n':'后宫','v':'后宫'},{'n':'百合','v':'百合'},{'n':'治愈','v':'治愈'},{'n':'魔法','v':'魔法'},{'n':'悬疑','v':'悬疑'},{'n':'推理','v':'推理'},{'n':'奇幻','v':'奇幻'},{'n':'科幻','v':'科幻'},{'n':'游戏','v':'游戏'},{'n':'神魔','v':'神魔'},{'n':'恐怖','v':'恐怖'},{'n':'血腥','v':'血腥'},{'n':'机战','v':'机战'},{'n':'战争','v':'战争'},{'n':'犯罪','v':'犯罪'},{'n':'剧情','v':'剧情'},{'n':'耽美','v':'耽美'},{'n':'歌舞','v':'歌舞'},{'n':'肉番','v':'肉番'},{'n':'美少女','v':'美少女'},{'n':'轻小说','v':'轻小说'},{'n':'吸血鬼','v':'吸血鬼'},{'n':'女性向','v':'女性向'},{'n':'泡面番','v':'泡面番'},{'n':'欢乐向','v':'欢乐向'}]},{'key':'area','name':'月份','init':'','value':[{'n':'全部','v':''},{'n':'一月','v':'一月'},{'n':'二月','v':'二月'},{'n':'三月','v':'三月'},{'n':'四月','v':'四月'},{'n':'五月','v':'五月'},{'n':'六月','v':'六月'},{'n':'七月','v':'七月'},{'n':'八月','v':'八月'},{'n':'九月','v':'九月'},{'n':'十月','v':'十月'},{'n':'十一月','v':'十一月'},{'n':'十二月','v':'十二月'}]},{'key':'year','name':'年代','init':'','value':[{'n':'全部','v':''},{'n':'2024','v':'2024'},{'n':'2023','v':'2023'},{'n':'2022','v':'2022'},{'n':'2021','v':'2021'},{'n':'2020','v':'2020'},{'n':'2019','v':'2019'},{'n':'2018','v':'2018'},{'n':'2017','v':'2017'},{'n':'2016','v':'2016'},{'n':'2015','v':'2015'},{'n':'2014','v':'2014'},{'n':'2013','v':'2013'},{'n':'2012','v':'2012'},{'n':'2011','v':'2011'},{'n':'2010','v':'2010'}]},{'key':'letter','name':'字母','init':'','value':[{'n':'全部','v':''},{'n':'A','v':'A'},{'n':'B','v':'B'},{'n':'C','v':'C'},{'n':'D','v':'D'},{'n':'E','v':'E'},{'n':'F','v':'F'},{'n':'G','v':'G'},{'n':'H','v':'H'},{'n':'I','v':'I'},{'n':'J','v':'J'},{'n':'K','v':'K'},{'n':'L','v':'L'},{'n':'M','v':'M'},{'n':'N','v':'N'},{'n':'O','v':'O'},{'n':'P','v':'P'},{'n':'Q','v':'Q'},{'n':'R','v':'R'},{'n':'S','v':'S'},{'n':'T','v':'T'},{'n':'U','v':'U'},{'n':'V','v':'V'},{'n':'W','v':'W'},{'n':'X','v':'X'},{'n':'Y','v':'Y'},{'n':'Z','v':'Z'},{'n':'0-9','v':'0-9'}]},{'key':'by','name':'排序','value':[{'n':'按最新','v':'time'},{'n':'按最热','v':'hits'},{'n':'按评分','v':'score'}]}],
        '2':[{'key':'class','name':'类型','init':'','value':[{'n':'全部','v':''},{'n':'运动','v':'运动'},{'n':'励志','v':'励志'},{'n':'热血','v':'热血'},{'n':'战斗','v':'战斗'},{'n':'竞技','v':'竞技'},{'n':'校园','v':'校园'},{'n':'青春','v':'青春'},{'n':'恋爱','v':'恋爱'},{'n':'冒险','v':'冒险'},{'n':'后宫','v':'后宫'},{'n':'百合','v':'百合'},{'n':'治愈','v':'治愈'},{'n':'魔法','v':'魔法'},{'n':'悬疑','v':'悬疑'},{'n':'推理','v':'推理'},{'n':'奇幻','v':'奇幻'},{'n':'科幻','v':'科幻'},{'n':'游戏','v':'游戏'},{'n':'神魔','v':'神魔'},{'n':'恐怖','v':'恐怖'},{'n':'机战','v':'机战'},{'n':'战争','v':'战争'},{'n':'犯罪','v':'犯罪'},{'n':'剧情','v':'剧情'},{'n':'耽美','v':'耽美'},{'n':'歌舞','v':'歌舞'},{'n':'美少女','v':'美少女'},{'n':'轻小说','v':'轻小说'},{'n':'女性向','v':'女性向'},{'n':'欢乐向','v':'欢乐向'}]},{'key':'letter','name':'字母','init':'','value':[{'n':'全部','v':''},{'n':'A','v':'A'},{'n':'B','v':'B'},{'n':'C','v':'C'},{'n':'D','v':'D'},{'n':'E','v':'E'},{'n':'F','v':'F'},{'n':'G','v':'G'},{'n':'H','v':'H'},{'n':'I','v':'I'},{'n':'J','v':'J'},{'n':'K','v':'K'},{'n':'L','v':'L'},{'n':'M','v':'M'},{'n':'N','v':'N'},{'n':'O','v':'O'},{'n':'P','v':'P'},{'n':'Q','v':'Q'},{'n':'R','v':'R'},{'n':'S','v':'S'},{'n':'T','v':'T'},{'n':'U','v':'U'},{'n':'V','v':'V'},{'n':'W','v':'W'},{'n':'X','v':'X'},{'n':'Y','v':'Y'},{'n':'Z','v':'Z'},{'n':'0-9','v':'0-9'}]},{'key':'by','name':'排序','value':[{'n':'时间','v':'time'},{'n':'人气','v':'hits'},{'n':'评分','v':'score'}]}],
        '20':[{'key':'letter','name':'字母','init':'','value':[{'n':'全部','v':''},{'n':'A','v':'A'},{'n':'B','v':'B'},{'n':'C','v':'C'},{'n':'D','v':'D'},{'n':'E','v':'E'},{'n':'F','v':'F'},{'n':'G','v':'G'},{'n':'H','v':'H'},{'n':'I','v':'I'},{'n':'J','v':'J'},{'n':'K','v':'K'},{'n':'L','v':'L'},{'n':'M','v':'M'},{'n':'N','v':'N'},{'n':'O','v':'O'},{'n':'P','v':'P'},{'n':'Q','v':'Q'},{'n':'R','v':'R'},{'n':'S','v':'S'},{'n':'T','v':'T'},{'n':'U','v':'U'},{'n':'V','v':'V'},{'n':'W','v':'W'},{'n':'X','v':'X'},{'n':'Y','v':'Y'},{'n':'Z','v':'Z'},{'n':'0-9','v':'0-9'}]},{'key':'by','name':'排序','value':[{'n':'时间','v':'time'},{'n':'人气','v':'hits'},{'n':'评分','v':'score'}]}]
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
            vod_pic: item.vod_pic,
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

async function detail(id) {
    const html = await request(HOST + '/index.php/vod/detail/id/' + id + '.html');
    const $ = load(html);
    const vod = {
        vod_id: id,
        vod_name: $('.slide-info-title').text().trim(),
        vod_actor: $('.slide-info:contains(演员)').text().trim().substring(4),
        vod_director: $('.slide-info:contains(导演)').text().trim().substring(4),
        vod_pic: $('.detail-pic img:first').attr('data-src'),
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
    const scriptData = $('script:contains(player_aaaa)').html().replace('var player_aaaa=','');
    const js = JSON.parse(scriptData);
    let playUrl = js.url;
    if (js.encrypt == 1) {
        playUrl = unescape(playUrl);
    } else if (js.encrypt == 2) {
        playUrl = unescape(base64Decode(playUrl));
    }
    return {
        parse: 0,
        url: playUrl,
    };
}

function base64Decode(text) {
    return Crypto.enc.Utf8.stringify(Crypto.enc.Base64.parse(text));
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