// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { getDatabase, set, ref, get } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-storage.js";

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

document.addEventListener("DOMContentLoaded", () => {
  CheckCred();
});

let CheckCred = () => {
  auth.onAuthStateChanged(user => {
    if (user) {
      // User is signed in, now safe to display submissions
      displaySubmissions();
    } else {
      // User is not signed in, redirect to login page
      window.location.href = "index.html";
    }
  });
}

const clickArea = document.getElementById("click-area");
const submissionTitle = document.getElementById("submission-title");
const inputFile = document.getElementById("input-submissionfile");

inputFile.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    handleFileUpload(file);
  }
});

function handleFileUpload(file) {
  const user = auth.currentUser;
  if (!user) return;

  const fileName = submissionTitle.value;
  const fileRef = storageRef(getStorage(app), `student-submissions/${user.uid}/${fileName}`);
  const uploadTask = uploadBytesResumable(fileRef, file);

  uploadTask.on('state_changed', null, null, () => {
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      const submissionRef = ref(db, `SubmissionsList/${user.uid}/${submissionTitle.value}`);
      set(submissionRef, {
        title: submissionTitle.value,
        url: downloadURL,
        timestamp: Date.now()
      }).then(() => {
        displaySubmissions();
      });
    });
  });
}

const displaySubmissions = async () => {
  const user = auth.currentUser;
  if (!user) return;
  
  const submissionsRef = ref(db, `SubmissionsList/${user.uid}`);
  const snapshot = await get(submissionsRef);

  if (snapshot.exists()) {
      const submissionData = snapshot.val();
      const submissionArray = Object.values(submissionData).sort((a, b) => b.timestamp - a.timestamp);
      const submissionContainers = document.querySelectorAll('.prevsubmission-container');

      submissionContainers.forEach((container, index) => {
          if (submissionArray[index]) {
              const submission = submissionArray[index];
              const h2 = container.querySelector('h2');
              const p = container.querySelector('p');
              const subDate = new Date(submission.timestamp);
              var grade;
              if (grade === undefined) {
                grade = "Ungraded";
              }
              else {
                grade = submission.grade;
              }
              h2.textContent = `${submission.title}`;
              p.textContent = `Submitted on: ${subDate.toLocaleDateString()} | Grade: ${grade}`;
          } else {
            container.style.display = 'none';
          }
      });
  } else {
      console.log("No submissions available.");
  }
};

clickArea.addEventListener("click", () => inputFile.click());
