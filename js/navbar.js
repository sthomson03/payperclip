function attachEventListeners() {
    applyDarkModePreference();
    var darkModeButton = document.querySelector(".dark-mode-button");
    var isDarkModeEnabled = localStorage.getItem("darkModeEnabled");
    if (darkModeButton) {
        darkModeButton.removeEventListener("click", toggleDarkMode);
        darkModeButton.addEventListener("click", toggleDarkMode);
    }
        
    if (isDarkModeEnabled === "true") {
        document.body.classList.add("dark-mode");
        darkModeButton.classList.add("active");
    }
}

function applyDarkModePreference() {
    var isDarkModeEnabled = localStorage.getItem("darkModeEnabled");
    if (isDarkModeEnabled === null) {
        localStorage.setItem("darkModeEnabled", "true");
        isDarkModeEnabled = "true";
    }

    var shouldBeDarkMode = isDarkModeEnabled === "true";
    document.body.classList.toggle("dark-mode", shouldBeDarkMode);

    var darkModeButton = document.querySelector(".dark-mode-button");
    if (darkModeButton) {
        darkModeButton.classList.toggle("active", shouldBeDarkMode);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const userInfo = JSON.parse(sessionStorage.getItem("user-info"));
    const userType = userInfo.usertype;
    console.log(userType);

    const navbar = document.querySelector('.navbar');

    if (userType === 'student-user') {
        navbar.innerHTML += '<h3><a href="/announcements-student.html">Announcements</a></h3>';
        navbar.innerHTML += '<h3><a href="/submissions-student.html">Submissions</a></h3>';
        navbar.innerHTML += '<h3><a href="/whiteboard.html">Whiteboard</a></h3>';
        navbar.innerHTML += '<h3><a href="/messages.html">Messages</a></h3>';
        navbar.innerHTML += '<h3><a href="/account.html">Account</a></h3>';
        navbar.innerHTML += '<h3><a href="#" class="dark-mode-button">Dark Mode</a></h3>';
        attachEventListeners();
    } else if (userType === 'staff-user') {
        navbar.innerHTML += '<h3><a href="/announcements-staff.html">Announcements</a></h3>';
        navbar.innerHTML += '<h3><a href="/feedback-staff.html">Feedback</a></h3>';
        navbar.innerHTML += '<h3><a href="/whiteboard.html">Whiteboard</a></h3>';
        navbar.innerHTML += '<h3><a href="/messages.html">Messages</a></h3>';
        navbar.innerHTML += '<h3><a href="/account.html">Account</a></h3>';
        navbar.innerHTML += '<h3><a href="#" class="dark-mode-button">Dark Mode</a></h3>';
        attachEventListeners();
    }
    attachEventListeners();
})