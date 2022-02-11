# Web Crawler for Hacker News

Web crawler exercise to get data from [Hacker News](https://news.ycombinator.com/news) website using scraping techniques.

## Features

- Scrape all first 30 entries from the website.
	- For each entry, get its order, title, points and comments number.
- Filter all previous entries with more than five words in the title and sort them by the number of comments first.  
- Filter all previous entries with less than or equal to five words in the title and sort them by points.
- Store the 30 entries and both filters results in separate _.json_ files for further uses of the data.

- Automated testing to check the scraped data is correct.

## Package dependency

- [Puppeteer](https://pptr.dev/) →  Web crawler and scraping library

## How to run it?

Clone or download the code and just run the following command on the directory.

`npm install`

_Wait for the package installation._

`npm run start`

_Wait for the execution of the code to get the scraped data as_ .json _files.

<sup>**NOTE**: Running the script will retrieve the most recent data of the website once. The data may change every now and then as other news get to the top.</sup>

## How to test it?

By using the next command, you can validate all the data scraped is correct:

`npx jest tests/scrapedData.test.js`

There are several validations running with each test:
- Checks if it collects all 30 entries correctly.
- Checks if the json files with all 30 entries, filtered by comments and filtered by points are written correctly.
- Checks if every object of each file has the expected values (order, title. comments and points).
- Checks if the filtered data is sorted correctly.

# _How does it work?_

Using the [Puppeteer](https://pptr.dev/) library, launch a browser and set it to go to the specified URL (https://news.ycombinator.com/).

After a deep analysis of the website code, we know that the data from every entry (order, title, points and comments) is located in the following classes of the HTML:
- Order = '.athing .title .rank'
- Title = '.athing .title a.titleLink'
- Points = '.subtext .score' _or_ '.subtext' (checking the numbers of the element innerText).
- Comments = '.subtext' (it's last element child)

<sup>**NOTE**: Some news may not have any points, but can't be rated either. Therefore, by checking the '.subtext' element innerText, if it have less than 2 numbers in total (just the time it was uploaded), then there are no points to get, hence it will be 0 points.</sup>

As the script is made on JavaScript, use the querySelectorAll function for each element of the data required and asign them into an array of objects:
`[{order: number, title: string, comments: number, points: number}]`

Once you have the results as objects, call the filterData function passing the array of objects and true or false (depending on the type of filter you want to do, true to filter by points and false to filter by comments number). Each filter will return a new array of objects.

Finally, create a _.json_ file to store each type of data results:
- The 30 original entries.
- The entries filtered by points.
- The entries filtered by comments.

The files are stored in the _data_ folder.

## Comments

- The data is stored as _.json_ files to use those results in future projects if necessary.
- More data could be scraped of each news if necessary, such as the URLs and authors.