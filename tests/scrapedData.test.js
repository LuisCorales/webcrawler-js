const {validateJsonFiles, validateEntries} = require('./validation');
const news = require('../data/news.json');
const newsByComments = require('../data/newsByComments.json');
const newsByPoints = require('../data//newsByPoints.json');

test("returns true if there are 30 entries in file", () => {
    expect(validateEntries(news)).toBe(true);
});

test("returns true if json 30 is written correctly", () => {
    expect(validateJsonFiles(news)).toBe(true);
});

test("returns true if json by comments is written correctly", () => {
    expect(validateJsonFiles(newsByComments)).toBe(true);
});

test("returns true if json by points is written correctly", () => {
    expect(validateJsonFiles(newsByPoints)).toBe(true);
});