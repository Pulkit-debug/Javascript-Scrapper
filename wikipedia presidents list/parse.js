const rp = require("request-promise");
const $ = require("cheerio");
const url = "https://en.wikipedia.org/wiki/George_Washington";


const parse = function (url) {
    return rp(url)
        .then(function (html) {
            let name = $("h1[id=firstHeading]", html).text();
            let bday = $("td[class=infobox-data] > span > span[class=bday]", html).text();

            return {
                name,
                bday
            }
        })
        .catch(function (err) {
            console.log("Error", err);
        });
}

module.exports = parse;
