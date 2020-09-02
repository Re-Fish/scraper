const fs = require("fs");
const jsdom = require("jsdom");
const jquery = require('jquery');
const countBy = require('lodash/countBy');
const sortBy = require('lodash/sortBy');
const reverse = require('lodash/reverse');
const open = require('open');

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
    const countedArray = Object.keys(counted).map((value) => ({
        value,
        count: counted[value],
    }));
    // sort
    return reverse(sortBy(countedArray, 'count'));
};

const generateHtmlOutput = (result) => {
    let html = '<html><body>';
    Object.keys(result).forEach((key) => {
        html += `<h2>${key}</h2>`;
        html += '<table style="width:100%;max-width:800px">';
        html += '<tr><th style="width:80%">Value</th><th>Count</th></tr>';
        if (result[key].length) {
            result[key].forEach(({ value, count }) => {
                html += `<tr><td>${value}</td><td>${count}</td></tr>`;
            });
        } else {
            html += `<tr><td colspan="2" style="color:lightcoral"><i>No data found</i></td></tr>`;
        }
        html += '</table>';
    });
    html += '</table></body></html>';
    return html;
};

fs.readFile('./innoscripta GmbH.htm', 'utf8', (err, data) => {
    const page = $(data);

    const words = extractWords(page);
    const otherSiteLinks = extractLinks(page);
    const pictures = extractPictures(page);

    const results = {
        Words: getStats(words),
        Links: getStats(otherSiteLinks),
        Pictures: getStats(pictures)
    };
    const htmlOutput = generateHtmlOutput(results);
    fs.writeFile('output.html', htmlOutput, () => {
        console.log('Results are here in output.html! It will be opened in default browser...');
        return open('./output.html');
    });
});