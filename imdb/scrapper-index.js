const pup = require("puppeteer");
const $ = require("cheerio");
const json2csv = require("json2csv").Parser;
const fs = require("fs");
const movies = [
    "https://www.imdb.com/title/tt7888964/?ref_=hm_tpks_tt_i_1_pd_tp1_cp",
    "https://www.imdb.com/title/tt8368512/?ref_=tt_sims_tt",
    "https://www.imdb.com/title/tt9203694/?ref_=tt_sims_tt",
    "https://www.imdb.com/title/tt0293429/?ref_=tt_sims_tt",
    "https://www.imdb.com/title/tt9208876/?ref_=tt_sims_tt",
    "https://www.imdb.com/title/tt9140554/?ref_=tt_sims_tt",
    "https://www.imdb.com/title/tt3480822/?ref_=tt_sims_tt",
    "https://www.imdb.com/title/tt13623126/?ref_=tt_sims_tt",
];

(async () => {
    const browser = await pup.launch({
        headless: false,
        headers: {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "en-US,en;q=0.9,la;q=0.8",
            "cookie": "uu=eyJpZCI6InV1ZjQ1ZDY5MTdmYTgxNDNmZTk3MTQiLCJwcmVmZXJlbmNlcyI6eyJmaW5kX2luY2x1ZGVfYWR1bHQiOmZhbHNlfX0=; session-id=136-1804730-3096941; adblk=adblk_no; ubid-main=133-6421560-1371365; session-id-time=2082787201l; session-token=lRwo/TbBZEAzLhnyABVnQcr/lA7EXgVygX2ZN+s/YAZBqEvFY2FwQilAO4ilY66XVyFfYegUqA9xeEbwTW8a0DCFxN6bGGa4++BT4UwrXvXgGGgOWTeUDWv8qnNTwJhD9q7R3EV1z59ebLW8J5typy8FMpBxduZ2RXzsPIjZnQdJsz554OwPThUN1Q1cOleR; csm-hit=tb:1X9601V6PW91G6F48B8M+b-0TASPVEBT08DSHVKDPCZ|1619535154855&t:1619535154856&adb:adblk_yes"

        },
        gzip: true,
    });
    const page = await browser.newPage();
    let movieData = [];
    for (let movie of movies) {
        await page.goto(movie).then(function () {
            return page.content();
        })
            .then(function (html) {





                let movieName = $("div[class=title_wrapper] > h1 ", html).text().trim();
                let rating = $("div[class=ratingValue] > strong > span[itemprop=ratingValue]", html).text().trim();
                let genres = $("a[href*='/search/title?genres']", html).text();
                let releaseDate = $("a[href*='releaseinfo']", html).text();



                // let checkString = "";

                (categoriesModification = () => {
                    releaseDate = releaseDate.split("\n")[0].replace("Release Dates", "");
                    for (let i = 0; i < genres.length; i++) {
                        if (genres.charAt(i) == " ") {
                            genres = genres.slice(i).trim();
                            break;
                        }
                    }
                    if (!rating) {
                        rating = "Not Released!"
                    }
                    else {
                        rating = rating + "/10";
                    }
                })();




                movieData.push({
                    movieName,
                    rating,
                    releaseDate,
                    genres

                });



            })
    }

    const j2c = new json2csv();
    const csv = j2c.parse(movieData)
    fs.writeFileSync("./imdbMovieData.csv", csv, "utf-8");
    await browser.close();

})();