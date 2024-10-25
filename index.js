var origText = "";


function swap(arr, i ,j){
    let tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
}

function partition(arr, low, high, dict){
    let pivot = arr[high]
    let i = low -1;
    // Move all elements smaller than the pivot to left side of array
    for(let j = low; j <= high - 1; j++){
        if(dict[arr[j]] > dict[pivot]){
            i++;
            swap(arr, i, j);
        }
    }

    // Move the pivot 
    swap(arr, i + 1, high);
    return i + 1;
}

// Perform quick sort using the value in a dict as the reference
function quickSortFromDict(arr, low, high, dict){
    if(low < high){
        let partI = partition(arr, low, high, dict)
        //Recusively call
        quickSortFromDict(arr, low, partI -1, dict);
        quickSortFromDict(arr, partI + 1, high, dict);
    }
}


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

// Get the three projects with the most commits on GitHub in the last two weeks and 
// add them to the 'current' project section
async function getCurrentProjects(){
    let page = 1;
    let commitCount = {}
    let endEnum = false

    // Count commits in the last three weeks to get the most worked on
    while(!endEnum){
        let apiUrl = "https://api.github.com/users/lbroglio/events?per_page=100&page=" + page;
        await fetch(apiUrl)
        .then(async response => {
            if (!response.ok) {
                await new Promise(r => setTimeout(r, 2000));
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            endEnum = enumerateEventsResponsePage(data, commitCount);
            page += 1;        
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    // Add all repose to and array and sort it based on their number of commits
    let keysArr = Object.keys(commitCount);
    let repoArr = [...keysArr];
    
    // Sort the array based on the values in commitCount
    quickSortFromDict(repoArr, 0, repoArr.length - 1, commitCount);

    // Add the top three repos 
    for(let i=0; i < 3 && i < repoArr.length; i++){
        let proj = repoArr[i];
        startIndex = proj.indexOf("/") + 1
        proj = proj.substring(startIndex)
        setupProjectPage(proj, "currentCon")
    }
}


// Read through a response page from the GitHub events pages API and when encountering a commit to a repository
// increment that respositories count in the commitCount dict.
// Stops after it reads the last three weeks of events and has at least one project.
function enumerateEventsResponsePage(data, commitCount){
    for(let i =0; i < data.length; i++){
        let currEvent = data[i];
        // If this is a push event
        if(currEvent["type"] === "PushEvent" && currEvent["actor"]["login"] === "lbroglio"){
            // If this commit is more than three weeks old return false to indicate that the end of the 
            // search period has been reached. (If no repository has been found continue searching)
            let pushDate = Date.parse(currEvent["created_at"]);
            let currDate = Date.now();
            var diffTime = Math.abs(currDate - pushDate);
            var diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); 
            if(diffDays > 21 && Object.keys(commitCount).length > 0){
                return true;
            }

            // Add the commits to the dict
            let repoKey = currEvent["repo"]["name"]
            if(repoKey in commitCount){
                commitCount[repoKey] += currEvent["payload"]["commits"].length;
            }
            else{
                commitCount[repoKey] = currEvent["payload"]["commits"].length;
            }
        }
    }

    return false;
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
}



var isMobile = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/);

if (isMobile) {
   document.location = "indexM.html";
}
