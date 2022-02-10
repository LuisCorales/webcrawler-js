const puppeteer = require('puppeteer');

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
    const filteredData = await objectsArray;
    const toReturn = [];
    let max = 0;
    let min = 99999;

    for (let i = 0; i < filteredData.length; i++) 
    {
        let title = filteredData[i].title;
        //console.log(filteredData[i].title + " | " + filteredData[i].comments + " | " + filteredData[i].points);

        // If the title has less than 6 words, then go to the next object
        if (title.split(" ").length <= 5)
        {
            continue;
        }

        console.log(filteredData[i]);
        if(filteredData[i].commets > max)
        {
            toReturn.push(filteredData[i]);
        }
        else
        {
            
        }
    }

    return toReturn;
});

(async () => 
{
    console.log(await filterByComments(allNews));
})();

const filterByPoints = (async (objectsArray) => 
{
    const filteredData = [];

    let max = 0;
    let min = 99999;
    for (let object in objectsArray) 
    {
        if (object.title.split(" ").length <= 5) 
        {

            console.log(object.title);
            
        }
    }

    //console.log(await objectsArray);
});