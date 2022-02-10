const puppeteer = require('puppeteer');
const fs = require('fs');

const url = 'https://news.ycombinator.com/';

const scrapeData = (async (url) => 
{
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();

    await page.goto(url);

    const data = await page.evaluate(() => 
    {
        // Get all needed data elements
        const orderElements = document.querySelectorAll('.athing .title .rank');
        const titleElements = document.querySelectorAll('.athing .title a.titleLink');
        const commentsElements = document.querySelectorAll('.subtext');
        const pointsElements = document.querySelectorAll('.subtext .score')

        const pointsRows = [];

        // If there is at least one news without scores, then proceed to do another process
        if(pointsElements.length < 30)
        {
            for (let i = 0; i < commentsElements.length; i++) 
            {
                var numbersInInfo = commentsElements.item(i).innerText.match(/\d+/g);
                pointsRows.push(numbersInInfo.length < 2 ? 0 : parseInt(numbersInInfo[0]));
            }
        }
        else
        {
            for (let element of pointsElements)
            {
                pointsRows.push(parseInt(element.innerText.split(" ")[0]));
            }
        }
        
        const orderRows = [];
        for (let element of orderElements)
        {
            orderRows.push(parseInt(element.innerText));
        }

        const titleRows = [];
        for (let element of titleElements)
        {
            titleRows.push(element.innerText);
        }

        const commentRows = [];
        for (let element of commentsElements)
        {
            let text = element.lastElementChild.innerText.match(/\d+/g);
            commentRows.push(text != null ? parseInt(text[0]) : 0);
        }   

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

    // Return the objects array
    return data;
});

const allNews = scrapeData(url);

const filterByComments = (async (objectsArray) => 
{
    let filteredData = [];
    let toCheck = await objectsArray;

    // Get only the news with titles containing more than 5 words
    toCheck = toCheck.filter(filterTitlesGT);

    filteredData = toCheck.sort((a,b) => b.comments - a.comments)

    return filteredData;
});

const filterByPoints = (async (objectsArray) => 
{
    let filteredData = [];
    let toCheck = await objectsArray;

    // Get only the news with titles containing more than 5 words
    toCheck = toCheck.filter(filterTitlesLET);

    filteredData = toCheck.sort((a,b) => b.points - a.points)

    return filteredData;
});

(async () => 
{
    const news = JSON.stringify(await allNews);
    fs.writeFileSync("./data/news.json", news);

    const newsFilteredByComments = JSON.stringify(await filterByComments(allNews));
    fs.writeFileSync("./data/newsByComments.json", newsFilteredByComments)

    const newsFilteredByPoints = JSON.stringify(await filterByPoints(allNews));
    fs.writeFileSync("./data/newsByPoints.json", newsFilteredByPoints)
}
)();

// Filters object titles by checking if it got more than 5 words
function filterTitlesGT(obj) 
{
    if (obj.title.split(" ").length > 5)
        return true;
    else
        return false;
}

// Filters object titles by checking if it got less or equal than 5 words
function filterTitlesLET(obj) 
{
    if (obj.title.split(" ").length <= 5)
        return true;
    else
        return false;
}