// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { getDatabase, ref, update, get, remove } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js";
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

let currentGroupContainer = document.getElementById("current-group");
let prevGroupContainer = document.getElementById("prev-group");

let DownloadButton = document.getElementById("download-button");
let DeleteButton = document.getElementById("delete-button");

const userCreds = JSON.parse(sessionStorage.getItem("user-creds"));

function fetchProfilePicture() {
  const userPicRef = ref(db, 'UsersAuthList/' + userCreds.uid + '/profilePicture');
  get(userPicRef).then((snapshot) => {
    if (snapshot.exists()) {
      const downloadURL = snapshot.val();
      ProfilePic.src = downloadURL;
    }
  })
}

let UpdateInformation = (event) => {
  event.preventDefault();

  const user = auth.currentUser;
  const updates = {};

  if (emailInput.value) {
    updateEmail(user, emailInput.value)
    .then(() => {
      alert("Email updated successfully!");
    })
    .catch((error) => {
      alert("Error updating email, please retry.");
    });
  }

  if (passwordInput.value) {
    updatePassword(user, passwordInput.value)
    .then(() => {
      alert("Password updated successfully!");
    })
    .catch(() => {
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
      alert("User information updated successfully!");
    })
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

    const metadata = {
      contentType: file.type
    };

    const uniqueFileName = `profile-pictures/${userCreds.uid}_${Date.now()}`;
    const fileRef = sRef(storage, uniqueFileName);

    const uploadTask = uploadBytesResumable(fileRef, file, metadata);

    uploadTask.on('state_changed', () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          ProfilePic.src = downloadURL;
          updateProfilePictureURL(downloadURL);
        });
      }
    );
  });
}

function loadProfileGroups() {
  const currentGroup = ref(db, "UsersAuthList/" + userCreds.uid + "/organisation");
  const prevGroup = ref(db, "UsersAuthList/" + userCreds.uid + "/prevorganisation");

  get(currentGroup).then((snapshot) => {
    if (snapshot.exists()) {
      const currentOrg = snapshot.val();
      currentGroupContainer.querySelector("p").innerText = currentOrg;
    } else {
      currentGroupContainer.querySelector("p").innerText = "No current organisation";
    }
  })

  get(prevGroup).then((snapshot) => {
    if (snapshot.exists()) {
      const prevOrg = snapshot.val();
      prevGroupContainer.querySelector("p").innerText = prevOrg ? prevOrg : "No previous organisation";
    } else {
      prevGroupContainer.querySelector("p").innerText = "No Previous Organisation";
    }
  })
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
    }
  })
};

let DeleteAccountClick = () => {
  const userRef = ref(db, 'UsersAuthList/' + user.uid);

  remove(userRef).then(() => {
    user.delete().then(() => {
      window.location.href = "/register.html";
    })
  })
};

let CheckCred = () => {
  if (!sessionStorage.getItem("user-creds"))
  window.location.href = "index.html"
}

let Signout = () => {
  sessionStorage.removeItem("user-creds");
  sessionStorage.removeItem("user-info");
  window.location.href = "/index.html"
}

window.addEventListener("load", CheckCred);
window.addEventListener("load", fetchProfilePicture);
window.addEventListener("load", loadProfileGroups);
ChangeProfilePicButton.addEventListener("click", ChangeProfilePic);

SignoutButton.addEventListener("click", Signout);
UpdateButton.addEventListener("click", UpdateInformation);

DownloadButton.addEventListener("click", DownloadDataClick);
DeleteButton.addEventListener("click", DeleteAccountClick);