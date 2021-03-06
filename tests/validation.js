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

const validateData = ((jsonData1, jsonData2) => {
    try {
        // Checks every object of the json and returns true if it has order, title, comments and points
        let data1 = JSON.parse(JSON.stringify(jsonData1));
        data1.forEach((obj) => {
            if(obj.order === undefined || obj.title == undefined 
                || obj.comments === undefined || obj.points === undefined)
                return false;
        });

        if(jsonData2 !== undefined)
        {
            let data2 = JSON.parse(JSON.stringify(jsonData2));
            data2.forEach((obj) => {
                if(obj.order === undefined || obj.title == undefined 
                    || obj.comments === undefined || obj.points === undefined)
                    return false;
            });
        }
        return true;

    } catch (e) {
        return false
    }
});

const validateIfSorted = ((jsonData, byPoints) => {
    try {
        // Checks every object of the filtered json files and returns true if it is sorted correctly
        let data = JSON.parse(JSON.stringify(jsonData));

        if(byPoints)
        {
            for(let i = 0, j = 1; i < data.length; i++ , j++)
            {
                if(j == data.length)
                    break;
                
                if(data[i].points - data[j].points < 0) 
                    return false;
            }
            return true;
        }
        else
        {
            for(let i = 0, j = 1; i < data.length; i++ , j++)
            {
                if(j == data.length)
                    break;
                
                if(data[i].comments - data[j].comments < 0) 
                    return false;
            }
            return true;
        }

    } catch(e) {
        return false;
    }
});

module.exports = {validateJsonFiles, validateEntries, validateData, validateIfSorted};