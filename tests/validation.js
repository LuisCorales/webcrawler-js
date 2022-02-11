const validateJsonFiles = ((jsonData) => {
    try {
        // Check if the json files are formatted correctly
        JSON.parse(JSON.stringify(jsonData));
        return true;
    } catch (e) {
        // If there is an error, it means the json is not correct
        return false;
    }
});

const validateEntries = ((jsonData) => {
    try {
        // Check if the json file has 30 entries
        if(JSON.parse(JSON.stringify(jsonData)).length == 30)
            return true;
        else
            return false;
    } catch (e) {
        // If there is an error, it means the json is not correct or there are not 30 entries
        return false;
    }
});

module.exports = {validateJsonFiles, validateEntries};