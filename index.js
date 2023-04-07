



function cycleProjects(direction){
    //Gets the list of all projects
    var projList = document.getElementsByClassName("projectIcon");
    //Gets the currently active project
    var activeProject = document.getElementsByClassName("activeProject")[0];
    
    //Hides the currently active project
    activeProject.style.display = "none";
    //Removes the active project class from the old active project
    activeProject.classList.remove("activeProject");

    //Gets the of the old active project
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

            //Create the image element to add to the div
            var currImg = document.createElement("img");

            //Set the src and alt for the image
            currImg.src = currProject.previewImage;
            currImg.alt = "Project Preview";

            //Add image to the div
            currDiv.appendChild(currImg);

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
    //Get the list of all navbar dropsdowns
    var dropDowns = document.getElementsByClassName("dropdown-menu");

    //For every drop down
    for(var i=0; i < dropDowns.length; i++){
        var currDrop = dropDowns[i];

        //For rvery project
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

fetch('./projectInfo.json')
.then(function (response) {
    return response.json();
})
.then(function (data) {
    loadProjectIcons(data);
    loadNavbarDropDown(data);
})