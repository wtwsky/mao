// 自动从 地址发布页 获取&跳转url地址
import { Crypto, load, _ } from 'assets://js/lib/cat.js';

let key = 'czzy';
let host = 'https://cz01.vip/'; // 厂长地址发布页
let url = '';
let siteKey = '';
let siteType = 0;
const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1';
const cookie = {};

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

// cfg = {skey: siteKey, ext: extend}
async function init(cfg) {
    siteKey = cfg.skey;
    siteType = cfg.stype;
    url = await checkValidUrl(cfg.ext);
    console.debug('厂长跳转地址 =====>' + url); // js_debug.log
}

async function checkValidUrl(ext) {
    let validUrl = ext;
    if (_.isEmpty(ext)) {
        const html = await request(host);
        const matches = html.matchAll(/推荐访问<a href="(.*)"/g);
        for (const match of matches) {
            try {
                const rcmdUrl = match[1];
                const res = await req(rcmdUrl, {
                    method: 'get',
                    headers: {
                        'User-Agent': UA,
                    },
                    redirect: 0,
                });
                const location = res.headers['location'];
                if (!_.isEmpty(location)) {
                    validUrl = location;
                } else {
                    validUrl = rcmdUrl;
                    break;
                }
            } catch(e) {
            }
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
    const series = $('div#beautiful-taxonomy-filters-tax-movie_bt_series > a[cat-url*=movie_bt_series]');
    let classes = _.map(series, (s) => {
        let typeId = s.attribs['cat-url'];
        typeId = typeId.substring(typeId.lastIndexOf('/') + 1);
        filterObj[typeId] = [tag];
        return {
            type_id: typeId,
            type_name: s.children[0].data,
        };
    });
    const sortName = ['电影', '电视剧', '国产剧', '美剧', '韩剧', '日剧', '海外剧（其他）', '华语电影', '印度电影', '日本电影', '欧美电影', '韩国电影', '动画', '俄罗斯电影', '加拿大电影'];
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
    const link = url + '/movie_bt' + (tag.length > 0 ? `/movie_bt_tags/${tag}` : '') + '/movie_bt_series/' + tid + (pg > 1 ? `/page/${pg}` : '');
    const html = await request(link);
    const $ = load(html);
    const items = $('div.mrb > ul > li');
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
    const hasMore = $('div.mrb > div.pagenavi_txt > a:contains(>)').length > 0;
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

function stripHtmlTag(src) {
    return src
        .replace(/<\/?[^>]+(>|$)/g, '')
        .replace(/&.{1,5};/g, '')
        .replace(/\s{2,}/g, ' ');
}

async function detail(id) {
    const html = await request(url + '/movie/' + id + '.html');
    const $ = load(html);
    const detail = $('ul.moviedteail_list > li');
    let vod = {
        vod_id: id,
        vod_pic: $('div.dyimg img:first').attr('src'),
        vod_remarks: '',
        vod_content: stripHtmlTag($('div.yp_context').html()).trim(),
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
        list: [vod],
    };
}

async function play(flag, id, flags) {
    const link = url + '/v_play/' + id + '.html';
    const html = await request(link);
    const $ = load(html);
    const iframe = $('.videoplay iframe');
    if (iframe.length > 0) {
        const iframeUrl = iframe[0].attribs.src;
        const resp = await req(iframeUrl, {
            headers: {
                'Referer': link,
                'User-Agent': UA,
            },
        });
        const iframeHtml = resp.content;
        const player = iframeHtml.match(/var player = "(.*?)"/)[1];
        const rand = iframeHtml.match(/var rand = "(.*?)"/)[1];
        const config = decryptConfig(player, 'VFBTzdujpR9FWBhe', rand);
        const json = JSON.parse(config);
        return {
            parse: 0,
            url: json.url,
        };
    } else {
        const js = $('script:contains(window.wp_nonce)').html();
        const group = js.match(/(var.*)eval\((\w*\(\w*\))\)/);
        const md5 = Crypto;
        const result = eval(group[1] + group[2]);
        const playUrl = result.match(/url:.*?['"](.*?)['"]/)[1];
        return {
            parse: 0,
            url: playUrl,
        };
    }
}

function decryptConfig(text, key, iv) {
    const keyData = Crypto.enc.Utf8.parse(key || 'PBfAUnTdMjNDe6pL');
    const ivData = Crypto.enc.Utf8.parse(iv || 'sENS6bVbwSfvnXrj');
    const content = Crypto.AES.decrypt(text, keyData, {
        iv: ivData,
        padding: Crypto.pad.Pkcs7
    }).toString(Crypto.enc.Utf8);
    return content;
}

async function search(wd, quick, pg) {
    if (pg <= 0) pg = 1;
    let page = '';
    if (pg > 1) {
        page = '&f=_all&p=' + pg;
    }
    const searchUrl = url + '/xssearch?q=' + encodeURIComponent(wd) + page;
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
    const $captcha = $('.erphp-search-captcha');
    if (!_.isEmpty($captcha)) {
        const setCookie = _.isArray(res.headers['set-cookie']) ? res.headers['set-cookie'].join(';') : res.headers['set-cookie'];
        const cks = setCookie.split(';');
        for (const c of cks) {
            const tmp = c.trim();
            if (tmp.startsWith('PHPSESSID=')) {
                cookie.PHPSESSID = tmp.substring(10);
                break;
            }
        }
        headers['Cookie'] = getCookie();
        const captcha = getCaptchaValue($captcha.text());
        const param = {
            result: captcha,
        };
        await req(searchUrl, {
            method: 'post',
            headers: headers,
            data: param,
            postType: 'form',
        });
        res = await req(searchUrl,  {
            method: 'get',
            headers: headers,
        });
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
        search: search,
    };
}