const puppeteer = require('puppeteer');

const url = 'https://news.ycombinator.com/';

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url);
    await page.screenshot({path: 'webpage1.jpg'})

    const news = await page.evaluate(() => {
        const elements = document.querySelectorAll('.athing .title a');

        const rows = [];
        for(let element of elements)
        {
            rows.push(element.href);
        }

        return rows;
    });

    console.log(news.length);

    await browser.close();
})();