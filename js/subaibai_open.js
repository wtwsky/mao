// 自动从 地址发布页 获取&跳转url地址
import { Crypto, load, _ } from 'assets://js/lib/cat.js';

let key = 'subaibai';
let host = 'https://subaibai.vip/'; // 素白白地址发布页
let url = '';
let siteKey = '';
let siteType = 0;
const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1';
const cookie = {};
const RESULT_KEY = 'result';

async function request(reqUrl) {
    const headers = {
        'User-Agent': UA,
    };
    const res = await req(reqUrl, {
        method: 'get',
        headers: headers,
    });
    return res.content;
}

async function init(cfg) {
    siteKey = cfg.skey;
    siteType = cfg.stype;
    const result = await local.get(key, RESULT_KEY);
    cookie.result = result || '31';
    cookie.esc_search_captcha = 1;
    url = await checkValidUrl(cfg.ext);
    console.debug('素白白跳转地址 =====>' + url); // js_debug.log
}

async function checkValidUrl(ext) {
    let validUrl = ext;
    if (_.isEmpty(ext)) {
        const html = await request(host);
        const $ = load(html);
        const link = $('.content a:first').attr('href');
        if (!_.isEmpty(link)) {
            validUrl = link;
        }
    }
    return validUrl;
}

async function home(filter) {
    const filterObj = {};
    const html = await request(url + '/movie_bt');
    const $ = load(html);
    const tags = $('div#beautiful-taxonomy-filters-tax-movie_bt_tags > a');
    const tag = {
        key: 'tag',
        name: '类型',
        value: _.map(tags, (n) => {
            let v = n.attribs['cat-url'] || '';
            v = v.substring(v.lastIndexOf('/') + 1);
            return { n: n.children[0].data, v: v };
        }),
    };
    tag.init = tag.value[0].v;
    const areas = $('div#beautiful-taxonomy-filters-tax-movie_bt_cat > a');
    const area = {
        key: 'area',
        name: '地区',
        value: _.map(areas, (n) => {
            let v = n.attribs['cat-url'] || '';
            v = v.substring(v.lastIndexOf('/') + 1);
            return { n: n.children[0].data, v: v };
        }),
    };
    area.init = area.value[0].v;
    const years = $('div#beautiful-taxonomy-filters-tax-movie_bt_year > a');
    const year = {
        key: 'year',
        name: '年份',
        value: _.map(years, (n) => {
            let v = n.attribs['cat-url'] || '';
            v = v.substring(v.lastIndexOf('/') + 1);
            return { n: n.children[0].data, v: v };
        }),
    };
    year.value = year.value.sort((a, b) => {
        if (a.v == '') {
            return -1;
        } else if (b.v == '') {
            return 1
        }
        return b.v.localeCompare(a.v);
    });
    year.init = year.value[0].v;
    const series = $('div#beautiful-taxonomy-filters-tax-movie_bt_series > a[cat-url*=movie_bt_series]');
    let classes = _.map(series, (s) => {
        let typeId = s.attribs['cat-url'];
        typeId = typeId.substring(typeId.lastIndexOf('/') + 1);
        filterObj[typeId] = [tag, area, year];
        return {
            type_id: typeId,
            type_name: s.children[0].data,
        };
    });
    const sortName = ['国产电影', '国产剧', '港台电影', '香港经典电影', '港台剧', '日韩电影', '日剧', '韩剧', '欧美电影', '欧美剧', '泰国电影', '泰剧', '印度电影', '动漫电影', '动漫剧', '纪录片', '综艺' ];
    classes = _.sortBy(classes, (c) => {
        const index = sortName.indexOf(c.type_name);
        return index === -1 ? sortName.length : index;
    });
    return {
        class: classes,
        filters: filterObj,
    };
}

async function homeVod() {
    return {};
}

async function category(tid, pg, filter, extend) {
    if (pg <= 0) pg = 1;
    const tag = extend.tag || '';
    const tagPath = (tag.length > 0 ? `/movie_bt_tags/${tag}` : '');
    const area = extend.area || '';
    const areaPath = (area.length > 0 ? `/movie_bt_cat/${area}` : '');
    const year = extend.year || '';
    const yearPath = (year.length > 0 ? `/year/${year}` : '');
    const link = url + '/movie_bt' + tagPath + areaPath + yearPath + '/movie_bt_series/' + tid + (pg > 1 ? `/page/${pg}` : '');
    const html = await request(link);
    const $ = load(html);
    const items = $('div.mrb > ul > li');
    const videos = _.map(items, (item) => {
        const img = $(item).find('img:first')[0];
        const a = $(item).find('a:first')[0];
        const hdinfo = $($(item).find('div.hdinfo')[0]).text().trim();
        const jidi = $($(item).find('div.jidi')[0]).text().trim();
        return {
            vod_id: a.attribs.href.replace(/.*?\/movie\/(.*).html/g, '$1'),
            vod_name: img.attribs.alt,
            vod_pic: img.attribs['data-original'],
            vod_remarks: jidi || hdinfo || ''
        };
    });
    const hasMore = $('div.mrb > div.pagenavi_txt > a:contains(>)').length > 0;
    const pgIndex = parseInt(pg);
    const pgCount = hasMore ? pgIndex + 1 : pgIndex;
    const limit = 25;
    return {
        page: pgIndex,
        pagecount: pgCount,
        limit: limit,
        total: limit * pgCount,
        list: videos
    };
}

function stripHtmlTag(src) {
    return src.replace(/<\/?[^>]+(>|$)/g, "").replace(/&.{1,5};/g, "").replace(/\s{2,}/g, " ")
}

async function detail(id) {
    const html = await request(url + "/movie/" + id + ".html");
    const $ = load(html);
    const detail = $("ul.moviedteail_list > li");
    const vod = {
        vod_id: id,
        vod_pic: $("div.dyimg img:first").attr("src"),
        vod_remarks: "",
        vod_content: stripHtmlTag($("div.yp_context").html()).trim()
    };
    for (const info of detail) {
        const i = $(info).text().trim();
        if (i.startsWith('地区：')) {
            vod.vod_area = i.substring(3);
        } else if (i.startsWith('年份：')) {
            vod.vod_year = i.substring(3);
        } else if (i.startsWith('导演：')) {
            vod.vod_director = _.map($(info).find('a'), (a) => {
                return a.children[0].data;
            }).join('/');
        } else if (i.startsWith('主演：')) {
            vod.vod_actor = _.map($(info).find('a'), (a) => {
                return a.children[0].data;
            }).join('/');
        } else if (i.startsWith('语言：')) {
            vod.vod_lang = i.substring(3);
        }
    }
    const playlist = _.map($('div.paly_list_btn > a'), (a) => {
        return a.children[0].data + '$' + a.attribs.href.replace(/.*?\/v_play\/(.*).html/g, '$1');
    });
    vod.vod_play_from = key;
    vod.vod_play_url = playlist.join('#');
    return {
        list: [vod]
    };
}

async function play(flag, id, flags) {
    const link = url + "/v_play/" + id + ".html";
    const html = await request(link);
    const $ = load(html);
    const iframe = $("body iframe[src*=Cloud]");
    if (0 < iframe.length) {
        const iframeHtml = (await req(iframe[0].attribs.src, {
            headers: {
                Referer: link,
                "User-Agent": UA
            }
        })).content;
        let code = iframeHtml.match(/var url = '(.*?)'/)[1].split("").reverse().join(""),
            temp = "";
        for (let i = 0; i < code.length; i += 2) temp += String.fromCharCode(parseInt(code[i] + code[i + 1], 16));
        const playUrl = temp.substring(0, (temp.length - 7) / 2) + temp.substring((temp.length - 7) / 2 + 7);
        return {
            parse: 0,
            url: playUrl
        };
    } else {
        const js = $("script:contains(window.wp_nonce)").html();
        const group = js.match(/(var.*)eval\((\w*\(\w*\))\)/);
        const md5 = Crypto;
        const result = eval(group[1] + group[2]);
        const playUrl = result.match(/url:.*?['"](.*?)['"]/)[1];
        return {
            parse: 0,
            url: playUrl
        };
    }
}

async function search(wd, quick, pg) {
    if (pg <= 0) pg = 1;
    let page = '';
    if (pg > 1) {
        page = 'page/' + pg + '/';
    }
    const searchUrl = url + '/' + page + '?s=' + encodeURIComponent(wd);
    const headers = {
        'User-Agent': UA,
        'Cookie': getCookie(),
    };
    let res = await req(searchUrl, {
        method: 'get',
        headers: headers,
    });
    let html = res.content;
    let $ = load(html);
    const capthchaClass = '.erphp-search-captcha';
    const $captcha = $(capthchaClass);
    if (!_.isEmpty($captcha)) {
        let captcha = getCaptchaValue($captcha.text());
        let param = {
            result: captcha,
        };
        res = await req(searchUrl, {
            method: 'post',
            headers: headers,
            data: param,
            postType: 'form',
        });
        const setCookie = _.isArray(res.headers['set-cookie']) ? res.headers['set-cookie'].join(';') : res.headers['set-cookie'];
        if (!_.isEmpty(setCookie)) {
            const cks = setCookie.split(';');
            for (const c of cks) {
                const tmp = c.trim();
                if (tmp.startsWith('result=')) {
                    cookie.result = tmp.substring(7);
                    cookie.esc_search_captcha = 1;
                    await local.set(key, RESULT_KEY, cookie.result);
                    break;
                }
            }
            headers['Cookie'] = getCookie();
            param = {
                result: cookie.result,
            };
            res = await req(searchUrl, {
                method: 'post',
                headers: headers,
                data: param,
                postType: 'form',
            });
        }
        html = res.content;
        $ = load(html);
    }
    const items = $('div.search_list > ul > li');
    let videos = _.map(items, (item) => {
        const img = $(item).find('img:first')[0];
        const a = $(item).find('a:first')[0];
        const hdinfo = $($(item).find('div.hdinfo')[0]).text().trim();
        const jidi = $($(item).find('div.jidi')[0]).text().trim();
        return {
            vod_id: a.attribs.href.replace(/.*?\/movie\/(.*).html/g, '$1'),
            vod_name: img.attribs.alt,
            vod_pic: img.attribs['data-original'],
            vod_remarks: jidi || hdinfo || '',
        };
    });
    const $pagenavi = $('div.search_list > div.pagenavi_txt');
    const hasMore = $pagenavi.find('a.current').text() != $pagenavi.find('a:last').text();
    const pgIndex = parseInt(pg);
    const pgCount = hasMore ? pgIndex + 1 : pgIndex;
    const limit = 20;
    return {
        page: pgIndex,
        pagecount: pgCount,
        limit: limit,
        total: limit * pgCount,
        list: videos,
    };
}

function getCookie() {
    return _.map(cookie, (value, key) => {
            return `${key}=${value}`;
        }).join(';');
}

function getCaptchaValue(captcha) {
    let result = 0;
    try {
        const calc = captcha.split('=')[0].trim();
        const matches = captcha.match(/(\d+)(.*?)(\d+)/);
        const number1 = parseInt(matches[1]);
        const number2 = parseInt(matches[3]);
        const sign = matches[2].trim();
        switch (sign) {
            case '-':
                result = number1 - number2;
                break;
            case '+':
            default:
                result = number1 + number2;
                break;
        }
    } catch(e) {
    }
    return result;
}

export function __jsEvalReturn() {
    return {
        init: init,
        home: home,
        homeVod: homeVod,
        category: category,
        detail: detail,
        play: play,
        search: search
    }
}