var origText = "";

// Add my email when the email button is hovered over (Not included in base HTML to hide it from web scrapers)
function revealEmail(){
    var emailSpan = document.getElementById("emailSpan");
    origText = emailSpan.innerText;
    emailSpan.innerText += " at lukebroglio@gmail.com";
}

function hideEmail(){
    var emailSpan = document.getElementById("emailSpan");
    emailSpan.innerText = origText;
}


// Get the highlighted projects from github and add them to the projects page 
function getHighlightedProjects() {
    // Get JSON
    fetch("highlighted.json")
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        let isFirst = true;
        // Add all projects to HTML
        for(let i=0; i < data.length; i++){
            setupProjectPage(data[i], isFirst)
            isFirst = false;
        }
    })
}


// Add a project to the HTML
function setupProjectPage(projectName, isFirst){
    // Read the names of highlighted projects from JSON file

    // Add pages for all of the highlighted projects
    // Retrieve the README file for the project

    // Define the API URL
    const apiUrl = ' https://api.github.com/repos/lbroglio/' + projectName +  '/contents/README.md';

    // Make a GET request
    fetch(apiUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}



var isMobile = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/);

if (isMobile) {
   document.location = "indexM.html";
}
