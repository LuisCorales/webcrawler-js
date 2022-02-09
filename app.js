const puppeteer = require('puppeteer');
const { stringify } = require('querystring');

const url = 'https://news.ycombinator.com/';

(async () => {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();

    await page.goto(url);

    const data = await page.evaluate(() => {
        const orderElements = document.querySelectorAll('.athing .title .rank');
        const titleElements = document.querySelectorAll('.athing .title a.titleLink');
        const scoreElements = document.querySelectorAll('.subtext .score');
        const commentsElements = document.querySelectorAll('.subtext');
        
        const orderRows = [];
        for (let element of orderElements)
        {
            orderRows.push(element.innerText);
        }

        const titleRows = [];
        for (let element of titleElements)
        {
            titleRows.push(element.innerText);
        }

        const scoreRows = [];
        for (let element of scoreElements)
        {
            scoreRows.push(element.innerText);
        }

        const commentRows = [];
        for (let element of commentsElements)
        {
            let text = element.lastElementChild.innerText.split(' ')[0];
            let comment = isNaN(text) ? text : 0;
            commentRows.push(comment);
        }

        const dataRow = [];
        for (let i = 0; i < 30; i++) {
            const tmp = {};
            tmp.order = orderRows[i];
            tmp.title = titleRows[i];
            tmp.comments = commentRows[i];
            tmp.score = scoreRows[i];

            dataRow.push(tmp);
        }

        return dataRow;
    });

    console.log(data);

    await browser.close();
})();