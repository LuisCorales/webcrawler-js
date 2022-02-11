const {validateJsonFiles, validateEntries, validateData} = require('./validation');
const news = require('../data/news.json');
const newsByComments = require('../data/newsByComments.json');
const newsByPoints = require('../data//newsByPoints.json');

test("returns true if 30 entries json is written correctly", () => {
    expect(validateJsonFiles(news)).toBe(true);
});

test("returns true if there are 30 entries in file", () => {
    expect(validateEntries(news)).toBe(true);
});

test("returns true if every object of the 30 entries json have all required data (order, title, comments, points)", () => {
    expect(validateData(news)).toBe(true);
});

test("returns true if json by comments is written correctly", () => {
    expect(validateJsonFiles(newsByComments)).toBe(true);
});

test("returns true if json by points is written correctly", () => {
    expect(validateJsonFiles(newsByPoints)).toBe(true);
});

test("returns true if every object of the filtered json have all required data (order, title, comments, points)", () => {
    expect(validateData(newsByPoints, newsByComments)).toBe(true);
});