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
    	darkModeButton.addEventListener("touchstart", toggleDarkMode);

        var expandButtons = document.querySelectorAll(".expand-button");
        expandButtons.forEach(function(expandButton) {
            expandButton.addEventListener("click", toggleExpand);
            expandButton.addEventListener("touchstart", toggleExpand);
        });
});