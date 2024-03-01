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

const usernameInput = document.getElementById("updated-username");
const emailInput = document.getElementById("updated-email");
const passwordInput = document.getElementById("updated-password");
const fullnameInput = document.getElementById("updated-fullname");
const telnoInput = document.getElementById("updated-telno");
const pronounsInput = document.getElementById("updated-pronouns");
const notificationsInput = document.getElementById("updated-notifications");

let ProfilePic = document.getElementById("profile-pic");
let ChangeProfilePicButton = document.getElementById("updatepic-button");

let UpdateButton = document.getElementById("updateinfo-button");
let SignoutButton = document.getElementById("signout-button");

let DownloadButton = document.getElementById("download-button");
let DeleteButton = document.getElementById("delete-button");

const userInfo = JSON.parse(sessionStorage.getItem("user-info"));
const userCreds = JSON.parse(sessionStorage.getItem("user-creds"));
const userType = userInfo.usertype;

let AnnouncementsLink = document.getElementById("announcements-link");
let SubmissionsLink = document.getElementById("submissions-link");
let FeedbackLink = document.getElementById("feedback-link");

function fetchProfilePicture() {
  const userPicRef = ref(db, 'UsersAuthList/' + userCreds.uid + '/profilePicture');
  get(userPicRef).then((snapshot) => {
    if (snapshot.exists()) {
      const downloadURL = snapshot.val();
      ProfilePic.src = downloadURL;
    } else {
      console.log("No profile picture found.");
    }
  }).catch((error) => {
    console.error("Failed to fetch profile picture:", error);
  });
}

let UpdateInformation = (event) => {
  event.preventDefault();

  const user = auth.currentUser;
  const updates = {};

  if (emailInput.value) {
    updateEmail(user, emailInput.value)
    .then(() => {
      console.log("Email updated successfully!");
      alert("Email updated successfully!");
    })
    .catch((error) => {
      console.log("Error updating email, please retry.");
      alert("Error updating email, please retry.");
    });
  }

  if (passwordInput.value) {
    updatePassword(user, passwordInput.value)
    .then(() => {
      console.log("Password updated successfully!");
      alert("Password updated successfully!");
    })
    .catch(() => {
      console.log("Error updating password, please retry.");
      alert("Error updating password, please retry.");
    });
  }

  if (usernameInput.value) {
    updates['username'] = usernameInput.value;
  }
  if (fullnameInput.value) {
    updates['fullname'] = fullnameInput.value;
  }
  if (telnoInput.value) {
    updates['telno'] = telnoInput.value;
  }
  if (pronounsInput.value) {
    updates['pronouns'] = pronounsInput.value;
  }
  if (notificationsInput.value) {
    updates['notifications'] = notificationsInput.value;
  }

  if (Object.keys(updates).length > 0) {
    update(ref(db, "UsersAuthList/" + userCreds.uid), updates)
    .then(() => {
      console.log("User information updated successfully!");
      alert("User information updated successfully!");
    })
    .catch((error) => {
      console.error("Error updating user information: ", error);
      alert("Error updating user information, please retry.");
    });
  }
}

const storage = getStorage(app);

function ChangeProfilePic() {
  const fileInput = document.getElementById("input-profilepic");

  ChangeProfilePicButton.addEventListener('click', () => {
    fileInput.click();
  });

  fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) {
      console.log("No file selected.");
      return;
    }
    const metadata = {
      contentType: file.type
    };

    const uniqueFileName = `profile-pictures/${userCreds.uid}_${Date.now()}`;
    const fileRef = sRef(storage, uniqueFileName);

    const uploadTask = uploadBytesResumable(fileRef, file, metadata);

    uploadTask.on('state_changed',
      (error) => {
        console.error('Upload error:', error);
      }, 
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          ProfilePic.src = downloadURL;
          updateProfilePictureURL(downloadURL);
        });
      }
    );
  });
}

function updateProfilePictureURL(downloadURL) {
  const userRef = ref(db, "UsersAuthList/" + userCreds.uid);
  update(userRef, {
    profilePicture: downloadURL
  }).then(() => {
    console.log('Profile picture URL updated in Realtime DB.');
  }).catch((error) => {
    console.error('Error updating profile picture URL in Realtime DB:', error);
  });
}

let DownloadDataClick = () => {
  if (!auth.currentUser) {
    console.log("No user signed in.");
    return;
  }

  const userRef = ref(db, 'UsersAuthList/' + auth.currentUser.uid);

  get(userRef).then((snapshot) => {
    if (snapshot.exists()) {
      const userData = snapshot.val();
      const dataStr = JSON.stringify(userData, null, 2);

      const blob = new Blob([dataStr], { type: "application/json" });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.href = url;
      a.download = "UserData.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 100);
    } else {
      console.log("No user data found.");
    }
  }).catch((error) => {
    console.error("Failed to fetch user data:", error);
  });
};

let DeleteAccountClick = () => {
  if (!auth.currentUser) {
    console.log("No user signed in.");
    return;
  }

  const userRef = ref(db, 'UsersAuthList/' + user.uid);

  remove(userRef).then(() => {
    console.log("User's data deleted successfully from Realtime Database.");

    user.delete().then(() => {
      console.log('User account deleted successfully.');
      window.location.href = "/register.html";
    }).catch((error) => {
      console.error('Error deleting user account:', error);
    });
  }).catch((error) => {
    console.error("Error deleting user's data from Realtime Database:", error);
  });
};

let CheckCred = () => {
  if (!sessionStorage.getItem("user-creds"))
  window.location.href = "index.html"
}

let HandleAnnouncementsClick = () => {
    if (userType === "staff-user") {
      window.location.href = "/announcements-staff.html";
    } else if (userType === "student-user") {
      window.location.href = "/announcements-student.html";
    }
}

let HandleSubmissionsClick = () => {
    window.location.href = "/submissions-student.html";
}

let HandlePostedinfoClick = () => {
  if (userType === "staff-user") {
    window.location.href = "/postedinfo-staff.html";
  } else if (userType === "student-user") {
    window.location.href = "/postedinfo-student.html";
  }
}

let HandleFeedbackClick = () => {
  if (userType === "staff-user") {
    window.location.href = "/feedback-staff.html";
  } else if (userType === "student-user") {
    window.location.href = "/feedback-student.html";
  }
}

let Signout = () => {
  sessionStorage.removeItem("user-creds");
  sessionStorage.removeItem("user-info");
  window.location.href = "/index.html"
}

window.addEventListener("load", CheckCred);
window.addEventListener("load", fetchProfilePicture);
ChangeProfilePicButton.addEventListener("click", ChangeProfilePic);

SignoutButton.addEventListener("click", Signout);
UpdateButton.addEventListener("click", UpdateInformation);

DownloadButton.addEventListener("click", DownloadDataClick);
DeleteButton.addEventListener("click", DeleteAccountClick)

AnnouncementsLink.addEventListener("click", HandleAnnouncementsClick);
SubmissionsLink.addEventListener("click", HandleSubmissionsClick);
PostedinfoLink.addEventListener("click", HandlePostedinfoClick);
FeedbackLink.addEventListener("click", HandleFeedbackClick);