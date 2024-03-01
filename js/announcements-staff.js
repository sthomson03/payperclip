// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { getDatabase, set, ref, get, push, update, remove } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js";
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

let announcementTitle = document.getElementById("announcement-title-input");
let announcementMessage = document.getElementById("announcement-message-input");
let announcementGroup = document.getElementById("announcements-group");
let announcementReactions = document.getElementById("announcements-reaction");
let announcementForm = document.getElementById("create-announcement-form");

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

let CreateAnnouncement = evt => {
  evt.preventDefault();

  const newAnnouncementRef = push(ref(db, "AnnouncementList/" + auth.currentUser.uid));
  set(newAnnouncementRef, {
      title: announcementTitle.value,
      announcement: announcementMessage.value,
      group: announcementGroup.value,
      reactions: announcementReactions.value
  })
  .then(() => {
      console.log("Announcement Created Successfully!");
  })
  .catch((error) => {
      console.error("Error creating announcement: ", error);
  });
}

const fetchAnnouncements = (userId, selectedGroup) => {
  const announcementsRef = ref(db, `AnnouncementList/${userId}`);

  get(announcementsRef).then((snapshot) => {
    const announcementsContainers = document.querySelectorAll('.announcements-container');
    if (snapshot.exists()) {
      const announcements = [];
      snapshot.forEach((childSnapshot) => {
        const announcement = childSnapshot.val();
        if (announcement.group === selectedGroup) {
          announcements.push({
            id: childSnapshot.key,
            ...announcement
          });
        }
      });

      if (announcements.length === 0) {
        announcementsContainers.forEach(container => {
          container.querySelector("h2").innerText = 'No Announcements Found';
          container.querySelector("p").innerText = 'There are no announcements for this group at the moment.';
        });
      } else {
        announcements.reverse();
        announcements.forEach((announcement, i) => {
          if (i < announcementsContainers.length) {
            const container = announcementsContainers[i];
            container.setAttribute('data-announcement-id', announcement.id);
            container.querySelector("h2").innerText = announcement.title;
            container.querySelector("p").innerText = announcement.announcement;
            container.querySelector('.expand-button').style.display = 'none';
            container.querySelector('.edit-button').style.display = 'none';
            container.querySelector('.delete-button').style.display = 'none';
            attachExpandListeners();
          }
        });
      }
    } else {
      // No announcements at all for this user
      announcementsContainers.forEach(container => {
        container.querySelector("h2").innerText = 'No Announcements Found';
        container.querySelector("p").innerText = '';
        attachExpandListeners();
      });
    }
  }).catch((error) => {
    console.error("Error fetching announcements: ", error);
  });
};

auth.onAuthStateChanged(user => {
  if (user) {
    const selectedGroup = document.querySelector('.group-dropdown').value || 'group1';
    fetchAnnouncements(user.uid, selectedGroup);
    
    document.querySelector('.group-dropdown').addEventListener('change', function() {
      const newSelectedGroup = this.value;
      fetchAnnouncements(user.uid, newSelectedGroup);
    });

    document.getElementById('cancel-edit-button').addEventListener('click', function() {
      document.getElementById('edit-announcement-modal').style.display = 'none';
    });
  } else {
    console.log("No user signed in.");
    window.location.href = "index.html"; // Redirect to login page
  }
});

document.querySelector('.group-dropdown').addEventListener('change', function() {
  const selectedGroup = this.value;
  fetchAnnouncements(auth.currentUser.uid, selectedGroup);
});

document.addEventListener('click', function(e) {
  if (e.target && e.target.classList.contains('edit-button')) {
      const announcementContainer = e.target.closest('.announcements-container');
      const announcementId = announcementContainer.getAttribute('data-announcement-id');
      console.log("Editing announcement ID:", announcementId);

      const currentTitle = announcementContainer.querySelector("h2").innerText;
      const currentMessage = announcementContainer.querySelector("p").innerText;

      document.getElementById('edit-announcement-title').value = currentTitle;
      document.getElementById('edit-announcement-message').value = currentMessage;

      document.getElementById('edit-announcement-form').setAttribute('data-announcement-id', announcementId);
      document.getElementById('edit-announcement-modal').setAttribute('data-container-id', announcementContainer.id);

      document.getElementById('edit-announcement-modal').style.display = 'block';
  }
});

document.addEventListener('click', function(e) {
  if (e.target && e.target.classList.contains('delete-button')) {
    const announcementContainer = e.target.closest('.announcements-container');
    const announcementId = announcementContainer.getAttribute('data-announcement-id');
    deleteAnnouncement(announcementId, announcementContainer);
  }
});

document.getElementById('edit-announcement-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const announcementId = this.getAttribute('data-announcement-id');
  const containerId = document.getElementById('edit-announcement-modal').getAttribute('data-container-id');
  const announcementContainer = document.getElementById(containerId);

  const updatedTitle = document.getElementById('edit-announcement-title').value;
  const updatedMessage = document.getElementById('edit-announcement-message').value;

  updateAnnouncement(announcementId, updatedTitle, updatedMessage, announcementContainer);
});

function updateAnnouncement(announcementId, title, announcement, container) {
  const announcementRef = ref(db, `AnnouncementList/${auth.currentUser.uid}/${announcementId}`);
  update(announcementRef, { title, announcement })
    .then(() => {
      console.log('Announcement updated successfully.');

      if (container) {
        container.querySelector("h2").innerText = title;
        container.querySelector("p").innerText = announcement;
        attachExpandListeners();
      }

      document.getElementById('edit-announcement-modal').style.display = 'none';
    })
    .catch((error) => {
      console.error('Error updating announcement: ', error);
    });
}

function deleteAnnouncement(announcementId, container) {
  const announcementRef = ref(db, `AnnouncementList/${auth.currentUser.uid}/${announcementId}`);
  
  remove(announcementRef)
    .then(() => {
      console.log('Announcement deleted successfully.');

      if (container) {
        container.querySelector("h2").innerText = "";
        container.querySelector("p").innerText = "";
      }
    })
    .catch((error) => {
      console.error('Error deleting announcement: ', error);
    });
}

announcementForm.addEventListener("submit", CreateAnnouncement);