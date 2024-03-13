// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { getDatabase, ref, get, update } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";

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

const userCreds = JSON.parse(sessionStorage.getItem("user-creds"));

const prevButton = document.getElementById("newer-sub-button");
const nextButton = document.getElementById("older-sub-button");

const downloadButton = document.getElementById("download-button");
const gradeButton = document.getElementById("grade-button");

const feedbackForm = document.getElementById("feedback-form");
const feedbackInput = document.getElementById("feedback-message-input");
const gradeDropdown = document.getElementById("grade-dropdown");
const submitFeedbackButton = document.getElementById("submit-feedback-button");

let CheckCred = () => {
  if (!sessionStorage.getItem("user-creds"))
  window.location.href = "index.html"
}

const getCurrentUserOrg = async () => {
  const userRef = ref(db, `UsersAuthList/${userCreds.uid}/organisation`);
  const snapshot = await get(userRef);
  if (snapshot.exists()) {
    return snapshot.val();
  }
};

let currentIndex = 0;
const submissionsPerPage = 3;

const displaySubmissions = async (startIndex = 0, numOfSubmissions = 3) => {
  const userOrg = await getCurrentUserOrg();
  const submissionsRef = ref(db, `SubmissionsList/`);
  const submissionsSnapshot = await get(submissionsRef);
  const submissionsReceivedContainer = document.querySelectorAll(".submissions-received-container");

  if (submissionsSnapshot.exists()) {
    let submissionsArray = [];

    for (const [userId, userSubmissions] of Object.entries(submissionsSnapshot.val())) {
      const userSnapshot = await get(ref(db, `UsersAuthList/${userId}`));
      if (userSnapshot.exists()) {
        const userFullName = userSnapshot.val().fullname;
        const userOrganisation = userSnapshot.val().organisation;

        if (userOrganisation === userOrg) {
          for (const [submissionKey, submissionDetails] of Object.entries(userSubmissions)) {
            const submission = {
              ...submissionDetails,
              key: submissionKey,
              fullName: userFullName,
              userId: userId
            };
            submissionsArray.push(submission);
          }
        }
      }
    }

    submissionsArray.sort((a, b) => b.timestamp - a.timestamp);
    const submissionsToShow = submissionsArray.slice(startIndex, startIndex + numOfSubmissions);

    submissionsToShow.forEach((submission, index) => {
      if (index < submissionsReceivedContainer.length) {
        const container = submissionsReceivedContainer[index];
        const submissionTitleElement = container.querySelector('h2');
        const submissionDateElement = container.querySelector('p');
        const submissionDate = new Date(submission.timestamp);

        submissionTitleElement.innerText = `${submission.fullName}: ${submission.title}`;
        submissionDateElement.innerText = `Submitted on: ${submissionDate.toLocaleString()}`;
        container.style.display = 'block';
        downloadButton.setAttribute('data-url', submission.url);
        downloadButton.removeEventListener('click', downloadSubmission);
        downloadButton.addEventListener('click', downloadSubmission);

        const gradeButton = container.querySelector('.grade-button');
        if (gradeButton) {
          gradeButton.setAttribute('data-id', submission.userId + '/' + submission.key);
          gradeButton.setAttribute('data-title', submission.title);
          gradeButton.setAttribute('data-fullname', submission.fullName);
          gradeButton.addEventListener('click', gradeSubmission);
        }
      }
    });

    for (let i = submissionsToShow.length; i < submissionsReceivedContainer.length; i++) {
      submissionsReceivedContainer[i].style.display = 'none';
    }

    currentIndex = startIndex;
  }
};


const loadOlderSubmissions = async () => {
  const newStartIndex = currentIndex + submissionsPerPage;
  await displaySubmissions(newStartIndex, submissionsPerPage);
};

const loadNewerSubmissions = async () => {
  const newStartIndex = Math.max(0, currentIndex - submissionsPerPage);
  await displaySubmissions(newStartIndex, submissionsPerPage);
};

const downloadSubmission = (event) => {
  const fileUrl = event.target.getAttribute('data-url');
  if (fileUrl) {
    window.open(fileUrl, '_blank');
  }
}

const gradeSubmission = (event) => {
  const button = event.target;
  const submissionId = button.getAttribute('data-id');
  const submissionTitle = button.getAttribute('data-title');
  const userFullName = button.getAttribute('data-fullname');
  
  feedbackForm.setAttribute('data-id', submissionId);
  feedbackForm.setAttribute('data-title', submissionTitle);
  feedbackForm.setAttribute('data-fullname', userFullName);

  const feedbackText = `Submission: ${userFullName} - ${submissionTitle}`;
  document.querySelector('.feedback-provided p').innerText = feedbackText;
};

async function submitFeedback() {
  const submissionId = feedbackForm.getAttribute('data-id');
  const submissionTitle = feedbackForm.getAttribute('data-title');

  if (!submissionId || !submissionTitle) {
    alert("No submission selected.");
    return;
  }

  const feedbackText = feedbackInput.value;
  const selectedGrade = gradeDropdown.value;

  const updates = {};
  updates[`/SubmissionsList/${submissionId}/feedback`] = feedbackText;
  updates[`/SubmissionsList/${submissionId}/grade`] = selectedGrade;

  try {
    await update(ref(db), updates);
    alert("Feedback submitted successfully.");
    feedbackInput.value = '';
    gradeDropdown.selectedIndex = 0;
    
    feedbackForm.removeAttribute('data-id');
    feedbackForm.removeAttribute('data-title');
  } catch (error) {
    console.error("Error submitting feedback:", error);
    alert("Failed to submit feedback.");
  }
}


window.addEventListener("load", CheckCred);
document.addEventListener("DOMContentLoaded", getCurrentUserOrg);
document.addEventListener("DOMContentLoaded", displaySubmissions(currentIndex, submissionsPerPage));

nextButton.addEventListener('click', loadOlderSubmissions);
prevButton.addEventListener('click', loadNewerSubmissions);

gradeButton.addEventListener("click", gradeSubmission);

submitFeedbackButton.addEventListener("click", function(event) {
  event.preventDefault();
  submitFeedback();
});