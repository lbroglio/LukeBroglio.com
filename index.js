var pageIndex = 0;

function sideBar(newIndex){
    //Get the button to unfill
    var oldButton = document.getElementById("sideB" + pageIndex);

    //Unfill the old button
    var currCirc = oldButton.getElementsByTagName("circle")[0];
    oldButton.removeChild(currCirc);
    var newCirc = document.createElementNS("http://www.w3.org/2000/svg","path");
    newCirc.setAttribute("d","M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z");
    oldButton.appendChild(newCirc)

    //Set the current index to the page index and get the new button
    pageIndex = newIndex;
    var newButton = document.getElementById("sideB" + pageIndex);

    //Fill the new button
    currCirc = newButton.getElementsByTagName("path")[0];
    newButton.removeChild(currCirc);

    newCirc = document.createElementNS("http://www.w3.org/2000/svg","circle");
    newCirc.setAttribute("cx","8");
    newCirc.setAttribute("cy","8");;
    newCirc.setAttribute("r","8");;

    newButton.appendChild(newCirc);
    
}

function cycleProjects(direction){
    //Gets the list of all projects
    var projList = document.getElementsByClassName("projectIcon");
    //Gets the currently active project
    var activeProject = document.getElementsByClassName("activeProject")[0];
    
    //Hides the currently active project
    activeProject.style.display = "none";
    //Removes the active project class from the old active project
    activeProject.classList.remove("activeProject");

    var aProjIndex = 0;

    //Get the index of the active project
    for(var i =0; i < projList.length; i++){
        if(projList[i].id === activeProject.id){
            aProjIndex = i;
        }
    }

    //Gets the index of the new active project by adding one and wrapping around to the other side of the array if neccessary
    var newIndex = aProjIndex + direction;
    if(newIndex === projList.length){
        newIndex = 0;
    }
    else if(newIndex === -1){
        newIndex = projList.length -1;
    }

    //uses the index to get the new active project
    var newActive = projList[newIndex];

    //Adds the active class to the new active project
    newActive.classList.add("activeProject");
    //Changes the style of the new active project so its visible
    newActive.style.display = "block";
}

function loadProjectIcons(projects){
    //Convert projects to list of values
    projects = Object.values(projects)

    //Get the list of project cyclers
    var cyclers = document.getElementsByClassName("projectCycler");

    //For every project cycler - There is only one right now but more could be added hypothetically
    //This also prevents the code from running if there is no project cyclers
    for(var i=0; i < cyclers.length; i++){
        var cycler = cyclers[i];
        //For every project
        for(var j =0; j < projects.length; j++){
            var currProject = projects[j];

            //Create the div to hold this icon
            var currDiv = document.createElement("div");

            //Give the new div the proper class
            currDiv.classList.add("projectIcon");
            
            //If this is the first add the active class
            if(j === 0){
                currDiv.classList.add("activeProject");
            }
            else{
                currDiv.style.display = "none";
            }

            //Give the div the id for this project
            currDiv.id = currProject.id;

            //Create an anchor element
            var currAnchor =  document.createElement("a");

            //Add the proper link to the anchor
            currAnchor.href = "projects.html#" + currProject.id;

            //Create the image element to add to the div
            var currImg = document.createElement("img");

            //Set the src and alt for the image
            currImg.src = currProject.previewImage;
            currImg.alt = currProject.altText;

            //Add image to the anchor
            currAnchor.appendChild(currImg);

            //Add the anchor to the div
            currDiv.appendChild(currAnchor);

            //Create the h2 for this div
            var currH = document.createElement("h2");

            //Add the proper text to the h2
            var currText = document.createTextNode(currProject.name)
            currH.appendChild(currText);

            //Add the h2 to the div
            currDiv.appendChild(currH);

            //Add the div to the cycler
            cycler.insertBefore(currDiv,cycler.firstChild)
        }

    }

}


function loadNavbarDropDown(projects){
    //Convert projects to list of values
    projects = Object.values(projects)

    //Get the list of all navbar dropsdowns
    var dropDowns = document.getElementsByClassName("dropdown-menu");

    //For every drop down
    for(var i=0; i < dropDowns.length; i++){
        var currDrop = dropDowns[i];

        //For every project
        for(var j=0; j < projects.length; j++){
            var currProject = projects[j];

            //Make a list entry and an anchor
           var projectEntry = document.createElement("li");
           var projectAnchor = document.createElement("a");
            
           //Creates text for the anchor based on the id of the current element
           var projectText = document.createTextNode(currProject.name)

           //Add the text to the anchor
           projectAnchor.appendChild(projectText);

           //Set up anchor
           projectAnchor.classList.add("dropdown-item")
           projectAnchor.href = "projects.html#" + currProject.id;

           //Add anchor to list element
           projectEntry.appendChild(projectAnchor);

           //Add list element to dropdowm
           currDrop.appendChild(projectEntry)
        }
    }


}

function expandImages(id){
    var moreImages = document.getElementById(id+"ExtraImages");

    moreImages.style.display = "flex";

    var projectCon = document.getElementById(id+"Con");

    projectCon.style.display = "none";
}

function hideImages(id){
    var moreImages = document.getElementById(id+"ExtraImages");

    moreImages.style.display = "none";

    var projectCon = document.getElementById(id+"Con");

    projectCon.style.display = "flex";
}

//Populate the page for a specific project with the data for that project
//Page is the div to that is the anscestor of all the elements that need to be populated
//Project data is the information to add retrieved from a JSON  file
function createProjectPage(page, projectData){
    //List of children of the page element these are what need to be populated with information
    children = page.children;

    //ID for this project
    let id = projectData["id"]

    //Set the title 
    let projTitle = page.querySelectorAll(".projectTitle")[0]
    projTitle.setHTML(projectData["name"])

    //Set the id of the page
    page.id = id

    //Set the id of the project containter
    let projCon = page.querySelectorAll(".projectCon")[0]
    projCon.id = id + "Con"

    // Set the id of the div which holds the visuals 
    let visDiv = page.querySelectorAll(".projectVisuals")[0]
    visDiv.id = id + "Visuals"

    // Add the image caption to the viusal
    let caption = document.createElement("h3")
    caption.setHTML(projectData["desPageImg"]["caption"])
    visDiv.insertBefore(caption, visDiv.firstChild)

    // Add the image to the visual 
    let wrapper = document.createElement("div")
    wrapper.classList.add("imageWrapper")
    
    let imgEl = document.createElement("img")
    imgEl.setAttribute("src",projectData["desPageImg"]["imageSrc"])
    wrapper.appendChild(imgEl)
    visDiv.insertBefore(wrapper, visDiv.children[1])

    // Set up the expand button
    let showButton = visDiv.querySelectorAll(".imageButton")[0]
    showButton.setAttribute("onclick", "expandImages('"+id+"')")

    // Add the text to the information div 
    let infoDiv = page.querySelectorAll(".projectInformation")[0]

    //Add the overview text
    let overviewEl = document.createElement("p")
    overviewEl.setHTML(projectData["pageText"]["overview"])

    let overviewHeader = infoDiv.querySelectorAll(".projectOverview")[0]
    overviewHeader.after(overviewEl)

    //Add the details text

    //Create an element to hold a high level description for the details
    let highLevelEl = document.createElement("p")
    highLevelEl.setHTML(projectData["pageText"]["details"]["highLevel"])
    
    // Create a list holding the details included in the JSON
    let detailsListEl = document.createElement("ul")
    let detailsTextList = projectData["pageText"]["details"]["detailList"]

    for(let i =0; i < detailsTextList.length; i++){
        let tempEL = document.createElement("li")
        let tempPar = document.createElement("p")
        tempPar.setHTML(detailsTextList[i])
        tempEL.appendChild(tempPar)
        detailsListEl.appendChild(tempEL)
    }
    

    // Append the overview and the list after the appropriate header
    let detailsHeader = infoDiv.querySelectorAll(".projectDetails")[0]
    detailsHeader.after(highLevelEl)
    highLevelEl.after(detailsListEl)

    //Create a list with the challenges bullet points
    let challengeListEL = document.createElement("ul")
    let challengeTextList =  projectData["pageText"]["challenges"]
    
    for(let i=0; i < challengeTextList.length;  i++){
        let tempEL = document.createElement("li")
        let tempPar = document.createElement("p")
        tempPar.setHTML(challengeTextList[i])
        tempEL.appendChild(tempPar)
        challengeListEL.appendChild(tempEL)
    }

    //Append the list after the appropriate header
    let challengesHeader = infoDiv.querySelectorAll(".projectChallenges")[0]
    challengesHeader.after(challengeListEL)

    //Set the github link to the proper one according to the project data
    let githubLink = infoDiv.querySelectorAll(".github-link")[0]
    githubLink.setAttribute("href", projectData["github-link"])

    //Set up the image gallery
    let galleryDiv = infoDiv.querySelectorAll("projectImagesFull")

    

    
}



var isMobile = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/);

if (isMobile) {
   document.location = "indexM.html";
}

fetch('./projectInfo.json')
.then(function (response) {
    return response.json();
})
.then(function (data) {
    let page = document.getElementsByClassName("projectPage")[0]
    createProjectPage(page, data["i281Asm"])
    loadProjectIcons(data);
    loadNavbarDropDown(data);
})
