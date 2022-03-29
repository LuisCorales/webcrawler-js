const puppeteer = require('puppeteer');
const fs = require('fs');

const url = 'https://news.ycombinator.com/';

/**
 * Scrapes all the data of the specified URL. In this case, it works only for the Hacker News website.
 * @param {string} url The website url
 * @returns An array of objects of all the scraped data
 */
const scrapeData = (async (url) => 
{
    // Open the browser and go to the specified url
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.goto(url);

    const data = await page.evaluate(() => 
    {
        const orderRows = [];
        const titleRows = [];
        const commentRows = [];

        // Get all needed data elements (order, title, comments, points)
        document.querySelectorAll('.athing .title .rank').forEach((element) => orderRows.push(parseInt(element.innerText)));
        document.querySelectorAll('.athing .title a.titleLink').forEach((element) => titleRows.push(element.innerText));
        document.querySelectorAll('.subtext').forEach((element) => {
            let text = element.lastElementChild.innerText.match(/\d+/g);
            commentRows.push(text != null ? parseInt(text[0]) : 0);
        });

        const pointsElements = document.querySelectorAll('.subtext .score');

        const getPointsRow = (pointsElements, row = []) => {
            // If there is no news without points
            if(pointsElements.length === 30) {
                pointsElements.forEach((element) => row.push(parseInt(element.innerText.split(" ")[0])));
                return row;
            }

            // If there is at least one news without points, then proceed to do another process
            document.querySelectorAll('.subtext').forEach(element => {
                let numbersInInfo = element.innerText.match(/\d+/g);
                row.push(numbersInInfo.length < 2 ? 0 : parseInt(numbersInInfo[0]));
            });

            return row;
        };

        // Create an object of each news
        const createNewsArray = (orderRows, titleRows, commentRows, pointsRows) => {
            return orderRows.map((element, index) => {
                return {order: element, title: titleRows[index], comments: commentRows[index], points: pointsRows[index]};
            });
        };

        const pointsRows = getPointsRow(pointsElements);
        
        return createNewsArray(orderRows, titleRows, commentRows, pointsRows);
    });

    await browser.close();

    return data;
});

/**
 * Filter titles with less or equal than 5 words and sort by points.
 * @param {*} objectsArray The array of objects of filtered data
 * @returns An array of objects filtered by points.
 */
const filterDataByPoints = (objectsArray => {
    // Filters object titles by checking if it have less or equal than 5 words
    objectsArray = objectsArray.filter((obj) => {
        if (obj.title.split(" ").length <= 5) return true;
        return false;
    });
    return objectsArray.sort((a,b) => b.points - a.points);
});

/**
 * Filter titles with more than 5 words and sort by comments.
 * @param {*} objectsArray The array of objects of filtered data.
 * @returns An array of objects filtered by comments number.
 */
const filterDataByComments = (objectsArray => {
    // Filters object titles by checking if it have more than 5 words
    objectsArray = objectsArray.filter((obj) => {
        if (obj.title.split(" ").length > 5) return true;
        return false;
    });
    return objectsArray.sort((a,b) => b.comments - a.comments);
});

// Just an auto executed function to run all functions
(async () => {
    const allNews = await scrapeData(url);

    // Create a json file for all the news
    const news = JSON.stringify(allNews);
    fs.writeFileSync("./data/news.json", news);

    // Create a json file for the news filtered by comments
    const newsFilteredByComments = JSON.stringify(filterDataByComments(allNews));
    fs.writeFileSync("./data/newsByComments.json", newsFilteredByComments);

    // Create a json file for the news filtered by points
    const newsFilteredByPoints = JSON.stringify(filterDataByPoints(allNews));
    fs.writeFileSync("./data/newsByPoints.json", newsFilteredByPoints);
})();