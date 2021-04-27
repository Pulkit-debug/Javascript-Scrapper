const pup = require("puppeteer");
const url = "https://www.reddit.com/";
const $ = require("cheerio");


pup.launch()
    .then(function (brower) {
        return brower.newPage();
    })
    .then(function (page) {
        return page.goto(url).then(function () {
            return page.content();
        });
    })
    .then(function (html) {
        $("h3", html).each(function () {
            console.log($(this).text());
        });
    })
    .catch(function (err) {
        console.log(err);
    })