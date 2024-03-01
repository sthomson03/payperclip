// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { getDatabase, set, ref, update, get, remove } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js";
import { getAuth, updateEmail, updatePassword } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";
import { getStorage, ref as sRef, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-storage.js";

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

// Check user is signed in
let CheckCred = () => {
    if (!sessionStorage.getItem("user-creds"))
    window.location.href = "index.html"
  }

const App = () => {
    return React.createElement(
      React.Fragment,
      null,
      React.createElement(
        "div",
        {
          style:
            { height: "500px", width: "100%"},
        },
        React.createElement(ExcalidrawLib.Excalidraw),
      ),
    );
};
  
const excalidrawWrapper = document.getElementById("app");
const root = ReactDOM.createRoot(excalidrawWrapper);
root.render(React.createElement(App));

window.addEventListener("load", CheckCred);