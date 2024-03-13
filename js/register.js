// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { getDatabase, set, ref } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAZo8CAqAyo2T-lijmHCQdq-_9W_-0rkGA",
  authDomain: "payperclip-d7e18.firebaseapp.com",
  databaseURL: "https://payperclip-d7e18-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "payperclip-d7e18",
  storageBucket: "payperclip-d7e18.appspot.com",
  messagingSenderId: "896354782092",
  appId: "1:896354782092:web:5edcc35ed31cc5c70264a9",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase();
const auth = getAuth(app);

let fullnameInput = document.getElementById("signup-fullname");
let emailInput = document.getElementById("signup-email");
let usernameInput = document.getElementById("signup-username");
let passwordOriginalInput = document.getElementById("signup-original-password");
let passwordSecondInput = document.getElementById("signup-second-password");
let organisationInput = document.getElementById("signup-organisation");
let usertypeInput = document.getElementById("signup-usertype");
let registerForm = document.getElementById("signup-form");

let RegisterUser = evt => {
    evt.preventDefault();

    if (passwordOriginalInput.value !== passwordSecondInput.value) {
        alert("Passwords do not match");
        return;
    }
    
    createUserWithEmailAndPassword(auth, emailInput.value, passwordOriginalInput.value)
    .then((credentials) => {
        set(ref(db, "UsersAuthList/" + credentials.user.uid), {
            fullname: fullnameInput.value,
            username: usernameInput.value,
            organisation: organisationInput.value,
            usertype: usertypeInput.value
        })

        .then(() => {
            window.location.href = "/index.html";
        })
    })
}

registerForm.addEventListener("submit", RegisterUser);