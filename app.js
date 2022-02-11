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
        const pointsRows = [];

        // Get all needed data elements (order, title, comments, points)
        document.querySelectorAll('.athing .title .rank').forEach((element) => orderRows.push(parseInt(element.innerText)));
        document.querySelectorAll('.athing .title a.titleLink').forEach((element) => titleRows.push(element.innerText));
        document.querySelectorAll('.subtext').forEach((element) => {
            let text = element.lastElementChild.innerText.match(/\d+/g);
            commentRows.push(text != null ? parseInt(text[0]) : 0);
        });

        const pointsElements = document.querySelectorAll('.subtext .score');  

        // If there is at least one news without points, then proceed to do another process
        if(pointsElements.length < 30)
        {
            const infoText = document.querySelectorAll('.subtext');
            // Check each news to get its points info, if there are none, then add a 0. Else, just add the points number
            for (let i = 0; i < infoText.length; i++) 
            {
                let numbersInInfo = infoText.item(i).innerText.match(/\d+/g);
                pointsRows.push(numbersInInfo.length < 2 ? 0 : parseInt(numbersInInfo[0]));
            }
        }
        else
            pointsElements.forEach((element) => pointsRows.push(parseInt(element.innerText.split(" ")[0])));
    
        // Create an object of each news
        const dataRow = [];
        for (let i = 0; i < 30; i++) {
            const tmp = {};
            tmp.order = orderRows[i];
            tmp.title = titleRows[i];
            tmp.comments = commentRows[i];
            tmp.points = pointsRows[i];

            dataRow.push(tmp);
        }

        return dataRow;
    });

    await browser.close();

    return data;
});

/**
 * Filters the data of the array of objects obtained in the scrapeData function
 * @param {*} objectsArray The array of objects of filtered data
 * @param {bool} byPoints If true, filter titles with less or equal than 5 words and sort by points. If false, filter titles with more than 5 words and sort by comments.
 * @returns An array of objects filtered by points or comments number
 */
const filterData = (async (objectsArray, byPoints) => 
{
    let filteredData = [];
    let toCheck = await objectsArray;

    // Check if byPoints is true, meaning it will filter the data by its points
    // otherwise, if false, it will filter the data by the number of comments
    if(byPoints)
    {
        // Filters object titles by checking if it have less or equal than 5 words
        toCheck = toCheck.filter((obj) => {
            if (obj.title.split(" ").length <= 5)
                return true;
            else
                return false;
        });
        filteredData = toCheck.sort((a,b) => b.points - a.points);
    }
    else
    {
        // Filters object titles by checking if it have more than 5 words
        toCheck = toCheck.filter((obj) => {
            if (obj.title.split(" ").length > 5)
                return true;
            else
                return false;
        });
        filteredData = toCheck.sort((a,b) => b.comments - a.comments);
    }
    
    return filteredData;
});

// Just an auto executed function to run all functions
(async () => 
{
    const allNews = scrapeData(url);

    // Create a json file for all the news
    const news = JSON.stringify(await allNews);
    fs.writeFileSync("./data/news.json", news);

    // Create a json file for the news filtered by comments
    const newsFilteredByComments = JSON.stringify(await filterData(allNews, false));
    fs.writeFileSync("./data/newsByComments.json", newsFilteredByComments);

    // Create a json file for the news filtered by points
    const newsFilteredByPoints = JSON.stringify(await filterData(allNews, true));
    fs.writeFileSync("./data/newsByPoints.json", newsFilteredByPoints);
}
)();