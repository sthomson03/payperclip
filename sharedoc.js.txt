function toggleDarkMode(event) {
    event.preventDefault();
    var element = document.body;
    element.classList.toggle("dark-mode");

    var darkModeButton = document.querySelector(".dark-mode-button");
    darkModeButton.classList.toggle("active");
}
	
document.addEventListener("DOMContentLoaded", function() {
    	var darkModeButton = document.querySelector(".dark-mode-button");
    	darkModeButton.addEventListener("click", toggleDarkMode);
    	darkModeButton.addEventListener("touchstart", toggleDarkMode);
});