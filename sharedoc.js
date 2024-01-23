function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
}

function toggleDarkMode(event) {
    event.preventDefault();
    var element = document.body;
    element.classList.toggle("dark-mode");

    var darkModeButton = document.querySelector(".dark-mode-button");
    darkModeButton.classList.toggle("active");
}

function toggleExpand(event) {
    event.preventDefault();
    var container = event.target.closest('.announcements-container');
    container.classList.toggle("expand");

    var expandButton = container.querySelector(".expand-button");
    expandButton.classList.toggle("active");
}
	
document.addEventListener("DOMContentLoaded", function() {
    	var darkModeButton = document.querySelector(".dark-mode-button");
    	darkModeButton.addEventListener("click", toggleDarkMode);

        var expandButtons = document.querySelectorAll(".expand-button");
        expandButtons.forEach(function(expandButton) {
            expandButton.addEventListener("click", toggleExpand);
        });
});