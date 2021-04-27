const rp = require("request-promise");
const url = "https://en.wikipedia.org/wiki/List_of_presidents_of_the_United_States";
const $ = require("cheerio");
const parse = require("./parse");

rp(url)
    .then(function (html) {
        // Success
        const wikiUrls = [];
        console.log($("table[class=wikitable] td > b > a", html).length);
        // console.log($("table[class=wikitable] td > b > a", html));

        wikiUrls.pop();

        for (let i = 0; i < 45; i++) {
            wikiUrls.push($("table[class=wikitable] td > b > a", html)[i].attribs.href);
        }


        // wikiUrls.map((url) => {
        //     return parse("https://en.wikipedia.org" + url);
        // })


        return Promise.all(
            wikiUrls.map(function (url) {
                return parse('https://en.wikipedia.org' + url);
            })
        );
    })

    .then(function (presidents) {
        console.log(presidents);
    })


    .catch(function (err) {
        console.log("Error", err);
    });