const signUpForm = document.querySelector("#signup-form");

signUpForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Get user info
    const email = signUpForm['signup-email'].value;
    const password = signUpForm['signup-password'].value;
    console.log(email, password);
});