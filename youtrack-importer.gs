function youtrack(domain, token, author, from, project, timezone) {
  
  var duration = 0;
  var dateFormat = "yyyy-MM"
  
  head = {
    'Authorization':"Bearer " + token,
    'Content-Type': 'application/json'
  }
  params = {
    headers:  head,
    method : "get",
    muteHttpExceptions: true
  }
  
  var formatedDate = Utilities.formatDate(from, timezone, dateFormat)
  
  var issuesResponse = UrlFetchApp.fetch("https://" + domain + "/api/issues?query=work%20author:%20" + author +"%20project:%20" + project + "%20work%20date:%20" + formatedDate +"%20&fields=idReadable", params);
  
  if (issuesResponse.getResponseCode() == 200) {
    var issues = JSON.parse(issuesResponse.getContentText());
    
    for (i=0; i<issues.length; i++) {
      var issueId = issues[i].idReadable;
      
      var workItemResponse = UrlFetchApp.fetch("https://" + domain + "/api/issues/" + issueId + "/timeTracking?fields=workItems(duration(presentation,minutes),author(login),creator(login),created,updated,date)", params);
      
      if (workItemResponse.getResponseCode() == 200) {
        
        var workDuration = 0;
        var workItems = JSON.parse(workItemResponse.getContentText());
      
        for (j=0; j<workItems.workItems.length; j++) {
            
          var workItem = workItems.workItems[j];
          
          var workItemCreatedDate = new Date();
          workItemCreatedDate.setTime(workItem.created);
          var workItemFormatedCreatedDate = Utilities.formatDate(workItemCreatedDate, timezone, dateFormat)
          
          if ((workItem.author.login === author) && (workItem.creator.login === author) && workItemFormatedCreatedDate === formatedDate) {
            workDuration += workItem.duration.minutes;
          }
          
        } 
      } else {
        return errorHandler(JSON.parse(issuesResponse.getContentText()));
      }
      
      duration += workDuration;
    }
    
    return Number(duration);
  
  } else {
    return errorHandler(JSON.parse(response.getContentText()));
  }
}

function errorHandler(error) {
  var errorDesc = ""
  
  if (error.error_children != undefined) {
    for (i=0;i<error.error_children.length;i++) {
      errorDesc = errorDesc + error.error_children[i].error + " ";
    }
  }
  return errorDesc;
}