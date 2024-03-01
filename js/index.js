// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { getDatabase, get, ref, child } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";

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
const dbref = ref(db);

let emailInput = document.getElementById("signup-email");
let passwordOriginalInput = document.getElementById("signup-original-password");

let SignInUser = evt => {
    evt.preventDefault();

    signInWithEmailAndPassword(auth, emailInput.value, passwordOriginalInput.value)
    .then((credentials) => {
        get(child(dbref, "UsersAuthList/" + credentials.user.uid)).then((snapshot) => {
            if(snapshot.exists) {
                sessionStorage.setItem("user-info", JSON.stringify({
                    fullname: snapshot.val().fullname,
                    username: snapshot.val().username,
                    organisation: snapshot.val().organisation,
                    usertype: snapshot.val().usertype
                }))
                sessionStorage.setItem("user-creds", JSON.stringify(credentials.user));
                
                if (snapshot.val().usertype === "student-user") {
                    window.location.href = "/announcements-student.html";
                }
                else if (snapshot.val().usertype === "staff-user") {
                    window.location.href = "/announcements-staff.html";
                }
                
            }
        })
    })
    .catch((error) => {
        alert(error.message);
        console.log(error.code);
        console.log(error.message);
    })
}

loginForm.addEventListener("submit", SignInUser);