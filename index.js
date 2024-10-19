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



var isMobile = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/);

if (isMobile) {
   document.location = "indexM.html";
}
