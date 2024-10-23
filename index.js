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
        
        // Remove back slash '\' characters because they are needed in the HTML
        decodedMD = decodedMD.replaceAll(new RegExp("\\\\", 'g'), "")

        // Convert the markdown to HTML
        var converter = new showdown.Converter();
        converter.setFlavor('github');
        html = converter.makeHtml(decodedMD);
        
        // Add some header elements to converted html
        html = "<h1 class=\"projectHeader\">" + projectName + "</h1>" + 
            "<a class=\"\" href=\"https://github.com/lbroglio/" + projectName + "\">See this project on GitHub</a>" + html;

        // Add converted HTML to page
        var containerDiv = document.createElement("div")
        containerDiv.classList.add("projectMDCon")
        containerDiv.id = projectName;
        containerDiv.innerHTML += html

        // Change image srcs to point at GitHub
        newPage.appendChild(containerDiv);
        var imgTags = newPage.getElementsByTagName("img")
        //imgTags = newPage.getElementsByTagName("image")
        for(let i =0; i < imgTags.length; i++){
            let origSrc = imgTags[i].src;
            // TODO: Find a more robust way to detect the start of the needed portion
            let neededStart;
            if(origSrc.includes("docs")){
                neededStart = origSrc.indexOf("docs")
            }
            else if(origSrc.includes("Documents"))(
                neededStart = origSrc.indexOf("Documents")
            )
            else{
                neededStart = 0;
            }

            imgTags[i].src = "https://github.com/lbroglio/" + projectName + "/blob/main/" + origSrc.substring(neededStart) +"?raw=true";
            
            // Add class to image to help formatting
            imgTags[i].classList.add("projectMDImage")
        }

    })
    .catch(error => {
        console.error('Error:', error);
    });

    // Add new page to HTML
    var highlightedCon = document.getElementById(sectionContainerName)
    highlightedCon.appendChild(newPage)

    // Add a link on the home page
    var linkCon = document.createElement("p")
    linkCon.classList.add("selectorLinkCon")
    var link = document.createElement("a")
    link.classList.add("selectorLink")
    link.href="#"+projectName
    link.innerText = projectName
    linkCon.appendChild(link)


    var hp = highlightedCon.getElementsByClassName("projectHomePage")[0];
    var selector = hp.getElementsByClassName("projectSelector")[0];
    selector.appendChild(linkCon)
    console.log(selector)

}



var isMobile = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/);

if (isMobile) {
   document.location = "indexM.html";
}
