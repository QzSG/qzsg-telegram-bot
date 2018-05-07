const fetch = require('node-fetch');
const cheerio = require('cheerio');
module.exports = {
    getLink: async function (url) {
        let response = await fetch(url);
        let body = await response.text();
        var $ = cheerio.load(body);
        var type = $('meta[name="medium"]').attr('content');
        console.log(type);
        if (type === "image") {
            link = $('meta[property="og:image"]').attr('content');
            console.log(link);
            return { type, link };
        }
        else if (type === "video") {
            link = $('meta[property="og:video"]').attr('content');
            console.log(link);
            return { type, link };
        }
        
    }
};