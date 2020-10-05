function compare(a, b) {
    const firstName = a.name.toUpperCase();
    const secondName = b.name.toUpperCase();

    let comparison = 0;
    if (firstName > secondName) {
        comparison = 1;
    } else if (firstName < secondName) {
        comparison = -1;
    }
    return comparison;
}

function prepareRequestHeaders() {
    let token = "";

    const headers = {
        'Authorization': "Bearer " + token,
        'Content-Type' : 'application/json'
    };

    return headers;
}

function sendRequest(url) {

    const params = {
        headers           : prepareRequestHeaders(),
        method            : "get",
        muteHttpExceptions: true
    };

    let response = UrlFetchApp.fetch(url, params);
    if (response.getResponseCode() === 200) {
        return JSON.parse(response.getContentText());
    } else {
        const error = errorHandler(JSON.parse(issuesResponse.getContentText()));
        console.log(error);
    }
}


function importAllUsersFromYouTrack() {

    let sheet = SpreadsheetApp.getActiveSheet();
    let cells = sheet.getRange("A:B");


    let url = "/hub/api/rest/users?fields=id,login,name&orderBy=creationTime:asc&query=not%20is:%20banned";

    let usersResponse = sendRequest(url);
    let users = usersResponse.users;
    let filteredUsers = filterSystemUsers(users);

    for (userRow = 0; userRow < filteredUsers.length; userRow++) {
        cells.getCell(userRow + 3, 1).setValue(
            filteredUsers[userRow].name
        );
        cells.getCell(userRow + 3, 2).setValue(
            filteredUsers[userRow].login
        );
    }
}

function filterSystemUsers(users) {
    let filteredUsers = [];
    let systemUsers = ['root', 'pshalagin'];

    for (user of users) {
        if (!systemUsers.includes(user.login)) {
            filteredUsers.push(user);
        }
    }

    return filteredUsers.sort(compare);
}

function calculateWorkHours() {
    const sheet = SpreadsheetApp.getActiveSheet();
    const cells = sheet.getActiveRange();
    cells.clearFormat();
    const effectiveHours = 6;

    const date = cells.getCell(1,1).getValue();

    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    const lastDayOnMonth = new Date(year, month, 0).getDate();

    cells.getCell(1, 2).setFormula('=NETWORKDAYS(DATE(' + year + ', ' + month +  ', 1), DATE(' + year + ', '+ month + ', ' + lastDayOnMonth + '))*' + effectiveHours);
}

function spentTimeByMonth(author, from) {

    let duration = 0;

    const formatedDate = Utilities.formatDate(from, "GMT+3", "yyyy-MM");

    let response = UrlFetchApp.fetch('/spenttime?author='+ author +'&date=' + formatedDate);
    if (response.getResponseCode() === 200) {
        duration = response.getContentText();
    } else {
        const error = errorHandler(JSON.parse(issuesResponse.getContentText()));
        console.log(error);
        return error
    }

    return Number(duration);
}

function errorHandler(error) {
    var errorDesc = "";

    if (error.error_children !== undefined) {
        for (i = 0; i < error.error_children.length; i++) {
            errorDesc = errorDesc + error.error_children[i].error + " ";
        }
    }
    return errorDesc;
}

function onOpen() {
    var spreadsheet = SpreadsheetApp.getActive();
    var menuItems = [
        {name: 'Импортировать пользователей из YouTrack', functionName: 'importAllUsersFromYouTrack'},
        {name: 'Расчитать количество рабочих часов', functionName: 'calculateWorkHours'}
    ];
    spreadsheet.addMenu('YouTrack', menuItems);

    let cells = spreadsheet.getRange("C:C");
    const date = cells.getCell(2,1).getValue();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    const endDate = new Date(year, month, 0);

    cells.getCell(2,1).setValue(randomDate(date, endDate));
}

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}


