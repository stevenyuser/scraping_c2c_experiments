import * as cheerio from "cheerio";

// import makeFetchCookie from 'fetch-cookie'

// const fetchCookie = makeFetchCookie(fetch)

// step 1: go to main page and get/generate form data for step 2
const step1 = async () => {
    const response = await fetch('https://c2cbus.ipp.cornell.edu/mobile/', {
        method: 'GET', 
        "headers": {
            // 'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'user-agent': "PostmanRuntime/7.35.0",
        },
    });

    const body = await response.text();
    // console.log(body);

    const $ = cheerio.load(body);

    const $eventvalidation = $("#__EVENTVALIDATION");
    const eventvalidation = $eventvalidation.val().toString();
    // console.log(eventvalidation);

    const $vs_gid = $("#vs_gid");
    const vs_gid = $vs_gid.val().toString();
    // console.log(vs_gid);

    // console.log("setcookie:", response.headers.getSetCookie());

    const cookie = response.headers.getSetCookie().map((cookie) => {
        return cookie.split(';')[0];
    }).join('; ').toString();
    // console.log(cookie);

    const formData = new URLSearchParams({
        'ctl00$cph$smg': 'ctl00$cph$smg|ctl00$cph$ddlTripType',
        '__EVENTTARGET': 'ctl00$cph$ddlTripType',
        '__EVENTARGUMENT': '',
        '__LASTFOCUS': '',
        '__VIEWSTATE': '',
        '__EVENTVALIDATION': eventvalidation,
        'ctl00$cph$ddlTripType': 'One Way',
        'ctl00$cph$ddlQty': '1',
        'ctl00$cph$ddlDepPickLocation': '',
        'vs_gid': vs_gid,
        '__ASYNCPOST': 'true',
    });

    return [cookie, formData];
}
// step1();
var [cookie, formData] = await step1();
console.log("Step 1 cookie", cookie.toString());
console.log("Step 1 form", formData.toString());

// step 2: set triptype to one way and qty to 1 and get/generate form data for step 2
const step2 = async () => {
    var [cookie, formData] = await step1();

    const response = await fetch('https://c2cbus.ipp.cornell.edu/mobile/', {
        method: 'POST',
        headers: {
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "cookie": cookie.toString(),
            // "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            'user-agent': "PostmanRuntime/7.35.0",
        },
        body: formData.toString(),
    });

    const body = await response.text();
    console.log(body);
}
step2();