var issueContainerEl = document.querySelector("#issues-container");

//reference for limit warning container on html
var limitWarningEl = document.querySelector("#limit-warning");

//reference to add repo name to header of page
var repoNameEl = document.querySelector("#repo-name");


//extract query string
var getRepoName = function() {
    //assign query string to a var
    var queryString = document.location.search;

    var repoName = queryString.split("=")[1];
    
    //check if values for search/handle errors
    if (repoName) {
        //display repo name on page
        repoNameEl.textContent = repoName;

        getRepoIssues(repoName);
        //revert to homepage if nothing found
    }else {
        document.location.replace("./index.html");
    }

    repoNameEl.textContent = repoName;
}

var getRepoIssues = function(repo) {
    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";
    console.log(repo);
    
    fetch(apiUrl).then(function(response) {
        //request was successful
        if (response.ok) {
            response.json().then(function(data) {
                //pass response data to DOM function
                displayIssues(data);

                //check if api has paginated issues (ie more than 30 issues gets a link to view additional)
                if (response.headers.get("Link")) {
                    displayWarning(repo);
                }
            });
        }
        else {
            // if not successful, redirect to homepage
            document.location.replace("./index.html");
        }
    });
}

//display response data
var displayIssues = function(issues) {
    //no open issues
    if (issues.length === 0) {
        issueContainerEl.textContent = "This repo has no open issues!";
        return;
    }

    // loop over given issues
    for (var i = 0; i < issues.length; i++) {
        //create a link element to take users to the issue on github
        var issueEl = document.createElement("a");
        issueEl.classList = "list-item flex-row justify-space-between align-center";
        //issue objects have html_url properties that link to an actual page
        issueEl.setAttribute("href", issues[i].html_url);
        //use target and _blank to open link in new tab
        issueEl.setAttribute("target", "_blank");
    
    //create span to hold issue title
        var titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title;

        issueEl.appendChild(titleEl);

    //create a type element
    var typeEl = document.createElement("span");
    
    //check if issue is an actual issue or a pull request
    if (issues[i].pull_request) {
        typeEl.textContent = "(Pull Request)";
    } else {
        typeEl.textContent = "(Issue)";
    }
    
    //append to container
    issueEl.appendChild(typeEl);

     // append to the dom
     issueContainerEl.appendChild(issueEl);
    }
};

//display warning message functon
var displayWarning = function(repo) {
    //add text to warning container
    limitWarningEl.textContent = "To see more than 30 issues, visit "

    //append link element to warning container
    var linkEl = document.createElement("a");
    linkEl.textContent = "See More Issues on GitHub.com";
    linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
    linkEl.setAttribute ("target", "_blank");

    //append warning to container
    limitWarningEl.appendChild(linkEl);
;}



// getRepoIssues();
getRepoName()