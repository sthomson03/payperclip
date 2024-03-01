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
  console.log(selectedGroup);
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
      console.log("No announcements found for selected group");
      displayAnnouncements([]);
    }
  }).catch((error) => {
    console.error("Error fetching announcements: ", error);
  });
};

function toggleExpand(event) {
  event.preventDefault();
  var container = event.target.closest('.announcements-container');
  var content = container.querySelector('p');
  content.style.display = content.style.display === 'none' ? 'block' : 'none'; // Toggle visibility
}

function attachExpandListeners() {
  const expandButtons = document.querySelectorAll('.expand-button');
  expandButtons.forEach(button => {
      // Remove existing event listeners to avoid duplicates
      button.removeEventListener('click', toggleExpand);
      // Attach the event listener
      button.addEventListener('click', toggleExpand);
  });
}

const displayAnnouncements = (announcements) => {
  const announcementContainers = document.querySelectorAll('.announcements-container');
  
  announcementContainers.forEach(container => {
    container.querySelector('h2').innerText = '';
    container.querySelector('p').innerText = '';
    container.querySelector('.expand-button').style.display = 'none';
    container.querySelector('.react-button').style.display = 'none';
    container.querySelector('.thumbs-up-count').style.display = 'none';
  });

  announcements.forEach((announcement, i) => {
    if (i < announcementContainers.length) {
      const container = announcementContainers[i];
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
    
      const thumbsUpRef = ref(db, `AnnouncementList/${announcement.id}/reactions/thumbsUp`);
      get(thumbsUpRef).then((snapshot) => {
        const thumbsUpCount = snapshot.exists() ? snapshot.val() : 0;
        thumbsUpCountSpan.innerText = thumbsUpCount;
        thumbsUpCountSpan.style.display = 'inline';
      }).catch((error) => {
        console.error('Error fetching thumbs up count: ', error);
      });
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
          console.log('Thumbs up count updated successfully.');
          const thumbsUpCountSpan = container.querySelector('.thumbs-up-count');
          thumbsUpCountSpan.innerText = newCount;

          // Record that the user has reacted
          set(userReactionRef, true).catch((error) => {
            console.error('Error recording user reaction:', error);
          });
        })
      })}
  })
}

auth.onAuthStateChanged(user => {
  if (user) {
    fetchAnnouncements('group1');
    console.log("fetch group1 ");
  } else {
    console.log("No user signed in.");
    window.location.href = "index.html";
  }
});
