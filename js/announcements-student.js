// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js";
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

document.querySelector('.group-dropdown').addEventListener('change', function() {
  const selectedGroup = this.value;
  fetchAnnouncements(auth.currentUser.uid, selectedGroup);
});

const fetchAnnouncements = (selectedGroup) => {
  const announcementsRef = ref(db, 'AnnouncementList');

  get(announcementsRef).then((snapshot) => {
    if (snapshot.exists()) {
      const announcements = [];
      snapshot.forEach((userSnapshot) => {
        userSnapshot.forEach((announcementSnapshot) => {
          const announcement = announcementSnapshot.val();
          if (announcement.group === selectedGroup) {
            announcements.push({
              id: announcementSnapshot.key,
              ...announcement
            });
          }
        });
      });

      displayAnnouncements(announcements);
    } else {
      displayAnnouncements([]);
    }
  })
};

function toggleExpand(event) {
  event.preventDefault();
  var container = event.target.closest('.announcements-container');
  var content = container.querySelector('p');
  content.style.display = content.style.display === 'none' ? 'block' : 'none';
}

function attachExpandListeners() {
  const expandButtons = document.querySelectorAll('.expand-button');
  expandButtons.forEach(button => {
      button.removeEventListener('click', toggleExpand);
      button.addEventListener('click', toggleExpand);
  });
}

const displayAnnouncements = (announcements) => {
  const announcementContainers = document.querySelectorAll('.announcements-container');

  announcementContainers.forEach(container => {
    container.style.display = 'none';
  });

  const validAnnouncements = announcements.filter(announcement => announcement.title && announcement.announcement);

  validAnnouncements.forEach((announcement, index) => {
    if (index < announcementContainers.length) {
      const container = announcementContainers[index];
      container.style.display = 'block';

      const titleElement = container.querySelector('h2');
      const messageElement = container.querySelector('p');
      const expandButton = container.querySelector('.expand-button');
      const reactButton = container.querySelector('.react-button');
      const thumbsUpCountSpan = container.querySelector('.thumbs-up-count');

      titleElement.innerText = announcement.title;
      messageElement.innerText = announcement.announcement;
      expandButton.style.display = 'inline';
      reactButton.setAttribute('data-announcement-id', announcement.id);
      reactButton.style.display = 'inline';
      thumbsUpCountSpan.setAttribute('data-announcement-id', announcement.id);
      thumbsUpCountSpan.innerText = announcement.reactions?.thumbsUp || 0;
      thumbsUpCountSpan.style.display = 'inline';

      attachExpandListeners();
    }
  });
};


document.querySelector('.group-dropdown').addEventListener('change', function() {
  const selectedGroup = this.value;
  fetchAnnouncements(selectedGroup);
});

document.addEventListener('click', function(e) {
  if (e.target && e.target.classList.contains('react-button')) {
    const announcementId = e.target.dataset.announcementId;
    addThumbsUp(announcementId, e.target.closest('.announcements-container'));
  }
});

function addThumbsUp(announcementId, container) {
  const userId = auth.currentUser.uid;
  const userReactionRef = ref(db, `AnnouncementList/${announcementId}/reactions/users/${userId}`);

  get(userReactionRef).then((snapshot) => {
    if (snapshot.exists()) {
      alert('User has already reacted.');
    } else {
      const thumbsUpRef = ref(db, `AnnouncementList/${announcementId}/reactions/thumbsUp`);

      get(thumbsUpRef).then((snapshot) => {
        let currentCount = (snapshot.exists() && typeof snapshot.val() === 'number') ? snapshot.val() : 0;
        const newCount = currentCount + 1;

        set(thumbsUpRef, newCount).then(() => {
          const thumbsUpCountSpan = container.querySelector('.thumbs-up-count');
          thumbsUpCountSpan.innerText = newCount;

          set(userReactionRef, true).catch((error) => {
            console.error('Error recording user reaction:', error);
          });
        })
      })}
  })
}

const displaySubmissions = async () => {
  const user = auth.currentUser;
  if (!user) return;
  
  const submissionsRef = ref(db, `SubmissionsList/${user.uid}`);
  const snapshot = await get(submissionsRef);

  if (snapshot.exists()) {
      const submissionData = snapshot.val();
      const submissionArray = Object.entries(submissionData)
        .map(([key, value]) => ({ id: key, ...value }))
        .sort((a, b) => b.timestamp - a.timestamp);
      const submissionContainers = document.querySelectorAll('.prevsubmission-container');

      submissionContainers.forEach((container, index) => {
          const submission = submissionArray[index];
          if (submission) {
              const h2 = container.querySelector('h2');
              const p = container.querySelector('p');
              const subDate = new Date(submission.timestamp);
              const grade = submission.grade || "Ungraded";

              h2.textContent = submission.title;
              p.textContent = `Submitted on: ${subDate.toLocaleDateString()} | Grade: ${grade}`;
              container.style.display = 'block';
          } else {
              container.style.display = 'none';
          }
      });
  } else {
      document.querySelectorAll('.prevsubmission-container').forEach(container => {
          container.style.display = 'none';
      });
  }
};

auth.onAuthStateChanged(user => {
  if (user) {
    fetchAnnouncements('group1');
    displaySubmissions();
  } else {
    window.location.href = "index.html";
  }
});
