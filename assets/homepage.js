//var to store reference to form element
var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");

//var to display github api to page
var repoContainerEl = document.querySelector('#repos-container');
var repoSearchTerm = document.querySelector('#repo-search-term');

//function executed upon a form sumission browser event
var formSubmitHandler = function(event) {
    event.preventDefault();
    //console.log(event);

    //get value from input element
    var username = nameInputEl.value.trim();
    
    if(username) {
        getUserRepos(username);
        nameInputEl.value="";
        //if empty field show alert and prevent page moving forward
    } else {
        alert("Please enter a GitHub username");
    }
}

//function to access github api and make fetch request
var getUserRepos = function(user) {
    // format the github api url
    var apiUrl = "https://api.github.com/users/" + user + "/repos";

    // make a request to the url
    fetch(apiUrl).then(function(response) {
        // request was successful
    if (response.ok) {
        response.json().then(function(data) {
        displayRepos(data, user);
    });
    } else {
    alert('Error: GitHub User Not Found');
    }
})

//function to display if internet/github server issue
.catch(function(error) {
    // Notice this `.catch()` getting chained onto the end of the `.then()` method
    alert("Unable to connect to GitHub");
    });
};

//accept array of repo data and the term searched for 
var displayRepos = function(repos, searchTerm) {
    //check if api returned any repos
    if (repos.length === 0) {
        repoContainerEl.textContent = "No repositories found.";
        return;
    }
    // console.log(repos);
    // console.log(searchTerm);

    //clear old content
    repoContainerEl.textContent ="";
    repoSearchTerm.textContent = searchTerm;

    //display list of repos to page
    //loop over repos
    for (var i = 0; i< repos.length; i++) {
        //format repo name
        var repoName = repos[i].owner.login + "/" + repos[i].name;

        //create a container for each repo
        var repoEl = document.createElement("div");
        repoEl.classList = "list-item flex-row justify-space-between align-center";

        //create a span element to hold repo name
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;

        //append container
        repoEl.appendChild(titleEl);

        //create a status element
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        //check if current repo has issues or not
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML = 
            "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        } else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }

        //append issues to container
        repoEl.appendChild(statusEl);

        //append container to DOM
        repoContainerEl.appendChild(repoEl);
    }
};

//submit event listener for when submit button is clicked
userFormEl.addEventListener("submit", formSubmitHandler);

//codes that got replaced above but good for study materials!
//call getUserRepos
// getUserRepos("alexisn84");