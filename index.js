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
async function getHighlightedProjects(dataCon) {
    // Get JSON
    await fetch("highlighted.json")
    .then(function (response) {
        return response.json();
    })
    .then(async function (data) {
        let highlightedRepos = []
        // Add all projects to HTML
        for(let i=0; i < data.length; i++){
            let tmp = await getReadMe(data[i]);
            dataCon[data[i]] = tmp;
            highlightedRepos.push(data[i])
        }
        dataCon["highlightedProjs"] = highlightedRepos;
    })
  
}

// Get the three projects with the most commits on GitHub in the last two weeks and 
// add them to the 'current' project section
async function getCurrentProjects(dataCon){
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

    let currentRepos = []
    let reposAdded = 0;

    // Add the top three repos 
    for(let i=0; reposAdded < 3 && i < repoArr.length; i++){
        let proj = repoArr[i];
        startIndex = proj.indexOf("/") + 1
        proj = proj.substring(startIndex)
        let readME = await getReadMe(proj);
        if(readME != null){
            reposAdded += 1;
            dataCon[proj] = readME;
            currentRepos.push(proj)
        }
    }
    dataCon["currentProjs"] = currentRepos;
    console.log(dataCon)
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


// Retrieve a README file for a repository
async function getReadMe(projectName){
    // Read the names of highlighted projects from JSON file

    // Add pages for all of the highlighted projects
    // Retrieve the README file for the project

    // Define the API URL
    const apiUrl = ' https://api.github.com/repos/lbroglio/' + projectName +  '/contents/README.md';
        
    // Make a GET request to get the README to display on the projects page
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        return null;
    }

}

// Add a project to the HTML
function setupProjectPage(readme, projectName, sectionContainerName){

    // Add page to put this projects info on
    var newPage = document.createElement("div");
    newPage.classList.add("page");
    newPage.classList.add("snapPoint");

    // Make a GET request to get the README to display on the projects page

    // Decode the base64 encoded markdown
    var decodedMD = atob(readme.content);
        
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

function addHighlightedProjects(){
    // Get the stored api data from session storage
    let dataCon = JSON.parse(sessionStorage.getItem("apiData"));
    // Add the pages
    for(let i =0; i < dataCon["highlightedProjs"].length; i++){
        let projName = dataCon["highlightedProjs"][i];
        setupProjectPage(dataCon[projName], projName,  "highlightedCon");
    }
}

function addCurrentProjects(){
    // Get the stored api data from session storage
    let dataCon = JSON.parse(sessionStorage.getItem("apiData"));

    // Add the pages
    for(let i =0; i < dataCon["currentProjs"].length; i++){
        let projName = dataCon["currentProjs"][i];
        setupProjectPage(dataCon[projName], projName,  "currentCon");
    }
}

// Make API requests for README data and add them to session storage
async function makeAPIRequests(){
    console.log("API Requests")
    let dataCon = {}
    // Make requests to github API
    await getHighlightedProjects(dataCon);
    await getCurrentProjects(dataCon);

    sessionStorage.setItem("apiData", JSON.stringify(dataCon));
}


window.onload = async function(){

    // If the project data isn't already set
    let dataCon = sessionStorage.getItem("apiData")
    if(dataCon === null){
        await makeAPIRequests();
    }

    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    // Get current file name
    
    var locName = location.pathname.split("/").slice(-1).pop()
    console.log(locName)
    if(locName === "index.html" && check){
        document.location = "indexM.html";
    }
    else if(locName === "projects.html" && check){
        document.location = "projectsM.html";
    }

    

    if(locName === "projects.html" || locName === "projectsM.html"){
        addHighlightedProjects();
        addCurrentProjects();
    }
    

}
