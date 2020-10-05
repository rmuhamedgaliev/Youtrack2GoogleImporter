let token = ""
let youtrackUrl = ""

head = {
  'Authorization':"Bearer " + token,
  'Content-Type': 'application/json'
};

params = {
  headers:  head,
  method : "get",
  muteHttpExceptions: true
};

function getProjectTeam() {
  let sheet = SpreadsheetApp.getActiveSheet();
  let popup = SpreadsheetApp.getUi();
  let projectKey = sheet.getRange("D1");
  let urlGetProjectInfo = youtrackUrl + "/hub/api/rest/resources?query=key:%20" + projectKey.getCell(1, 1).getValue();
  let projectResponse = UrlFetchApp.fetch(urlGetProjectInfo, params);
  let project = JSON.parse(projectResponse.getContentText()).resources[0];

  let urlGetProjectTeam = youtrackUrl + "/hub/api/rest/projects/" + project.project.id + "/team/ownUsers?fields=id,name,login,teamOwnUser&orderBy=name;"
  let projectTeamResponse = UrlFetchApp.fetch(urlGetProjectTeam, params);
  let team = JSON.parse(projectTeamResponse.getContentText()).ownUsers;

  let userCells = sheet.getRange("A:B");

  for (let userRow = 0; userRow < team.length; userRow++) {
    userCells.getCell(userRow + 2, 1).setValue(
      team[userRow].name
    );
    userCells.getCell(userRow + 2, 2).setValue(
      team[userRow].login
    );
  }
}

function spentTime(author) {
    let sheet = SpreadsheetApp.getActiveSheet();
    let projectKey = sheet.getRange("D1");

    let duration = 0;

    let response = UrlFetchApp.fetch('/project/spenttime?author=' + author + '&project=' + projectKey.getCell(1, 1).getValue());
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
    var errorDesc = ""

    if (error.error_children != undefined) {
        for (let i=0 ; i<error.error_children.length; i++) {
            errorDesc = errorDesc + error.error_children[i].error + " ";
        }
    }
    return errorDesc;
}

function onOpen() {
    var spreadsheet = SpreadsheetApp.getActive();
    var menuItems = [
        {name: 'Импортировать пользователей из YouTrack', functionName: 'getProjectTeam'}
    ];
    spreadsheet.addMenu('YouTrack', menuItems);
}

