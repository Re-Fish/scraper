const fs = require("fs");
const jsdom = require("jsdom");
const jquery = require('jquery');
const countBy = require('lodash/countBy');
const sortBy = require('lodash/sortBy');
const reverse = require('lodash/reverse');

const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;
const $ = jquery(window);

const extractWords = (page) => {
    const allTextRows = [];
    $("span", page).each((ix, val) => {
        allTextRows.push(val.textContent);
    });
    return allTextRows.map((txt) =>
        txt.split(' ')
            .map((word) => word.replace(/\n/g, ''))
            .filter((word) => word && word !== '\n')
    ).flatMap((w) => w);
};

const extractLinks = (page) => {
    const allLinks = [];
    $("a", page).each((ix, val) => {
        const { href } = val;
        if (href.startsWith('http') && !href.match(/innoscripta\.de/)) {
            allLinks.push(href);
        }
    });
    return allLinks;
};

const extractPictures = (page) => {
    const allPics = [];
    $("img", page).each((ix, val) => {
        const { src } = val;
        allPics.push(src);
    });
    return allPics;
};

const getStats = (allStrings) => {
    // count unique
    const counted = countBy(allStrings);
    // make array
    const countedArray = Object.keys(counted).map((text) => ({
        text,
        count: counted[text],
    }));
    // sort
    return reverse(sortBy(countedArray, 'count'));
};

fs.readFile('./innoscripta GmbH.html', 'utf8', (err, data) => {
    const page = $(data);

    const words = extractWords(page);
    const otherSiteLinks = extractLinks(page);
    const pictures = extractPictures(page);

    console.log({
        words: getStats(words),
        links: getStats(otherSiteLinks),
        images: getStats(pictures)
    });
});