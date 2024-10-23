var origText = "";

// Add my email when the email button is hovered over (Not included in base HTML to hide it from web scrapers)
function revealEmail(){
    // Add email href attribute
    var emailAnchor = document.getElementById("emailAnchor");
    emailAnchor.setAttribute("href", "mailto:lukebroglio@gmail.com")

    // Add email text
    var emailSpan = document.getElementById("emailSpan");
    origText = emailSpan.innerText;
    emailSpan.innerText += " at lukebroglio@gmail.com";
}

function hideEmail(){
    var emailSpan = document.getElementById("emailSpan");
    emailSpan.innerText = origText;
    emailAnchor.setAttribute("href", "")
}


// Get the highlighted projects from github and add them to the projects page 
function getHighlightedProjects() {
    // Get JSON
    fetch("highlighted.json")
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        // Add all projects to HTML
        for(let i=0; i < data.length; i++){
            setupProjectPage(data[i], "highlightedCon")
        }
    })
}


// Add a project to the HTML
function setupProjectPage(projectName, sectionContainerName){
    // Read the names of highlighted projects from JSON file

    // Add pages for all of the highlighted projects
    // Retrieve the README file for the project

    // Define the API URL
    const apiUrl = ' https://api.github.com/repos/lbroglio/' + projectName +  '/contents/README.md';

    // Add page to put this projects info on
    var newPage = document.createElement("div");
    newPage.classList.add("page");
    newPage.classList.add("snapPoint");

    // Make a GET request to get the README to display on the projects page
    fetch(apiUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Decode the base64 encoded markdown
        var decodedMD = atob(data.content);

        // Convert the markdown to HTML
        var converter = new showdown.Converter();
        converter.setFlavor('github');
        html = converter.makeHtml(decodedMD);
        
        // Add some header values to converted html
        html = "<h1 class=\"projectHeader\">" + projectName + "</h1>" + 
            "<a class=\"\" href=\"https://github.com/repos/lbroglio/" + projectName + "\">See this project on GitHub</a>" + html;

        // Add converted HTML to doc
        var containerDiv = document.createElement("div")
        containerDiv.classList.add("projectMDCon")
        containerDiv.innerHTML += html
        console.log(containerDiv)
        newPage.appendChild(containerDiv);

    })
    .catch(error => {
        console.error('Error:', error);
    });

    // Add new page to HTML
    var highlightedCon = document.getElementById(sectionContainerName)
    highlightedCon.appendChild(newPage)
}



var isMobile = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/);

if (isMobile) {
   document.location = "indexM.html";
}
