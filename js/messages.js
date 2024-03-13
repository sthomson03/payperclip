// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { getDatabase, ref, get, set, push, query, orderByChild, equalTo } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js";
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

const sendButton = document.getElementById("send-message-button");
const filterInput = document.getElementById("filter-contact");

filterInput.addEventListener("keyup", function() {
    filterContacts(this.value);
});

let CheckCred = () => {
    if (!sessionStorage.getItem("user-creds"))
    window.location.href = "index.html";
}

let currentChatPartner = null;

const displayContacts = async (filteredContactsArray) => {
    let contactsArray = filteredContactsArray;

    if (!contactsArray) {
        const contactsRef = ref(db, "UsersAuthList/");
        const snapshot = await get(contactsRef);
        if (snapshot.exists()) {
            const contactsData = snapshot.val();
            contactsArray = Object.entries(contactsData).map(([key, contact]) => ({
                ...contact,
                id: key
            }));
        }
    }

    const contactsContainers = document.querySelectorAll('.contacts-container');

    contactsContainers.forEach(container => {
        container.style.display = 'none';
    });

    for (let i = 0; i < Math.min(contactsArray.length, contactsContainers.length); i++) {
        const contact = contactsArray[i];
        const h2 = contactsContainers[i].querySelector('h2');
        const button = contactsContainers[i].querySelector('button.message-contact');
        h2.textContent = `${contact.fullname} | ${contact.username}`;
        button.setAttribute('data-uid', contact.id);
        button.style.display = 'block';
        contactsContainers[i].style.display = 'flex';

        button.removeEventListener('click', handleSendMessageClick);
        button.addEventListener('click', handleSendMessageClick);
    }
};

function handleSendMessageClick(event) {
    const partnerUid = event.currentTarget.getAttribute('data-uid');
    console.log(partnerUid);
    currentChatPartner = partnerUid;
    loadMessages(auth.currentUser.uid, partnerUid);
}

const filterContacts = (searchText) => {
    const contactsRef = ref(db, "UsersAuthList/");
  
    get(contactsRef).then((snapshot) => {
      if (snapshot.exists()) {
        const allContacts = snapshot.val();
  
        let filteredContacts = Object.entries(allContacts).map(([key, contact]) => ({
            ...contact,
            id: key
        }));
  
        if (searchText) {
          filteredContacts = filteredContacts.filter(contact =>
            contact.fullname && contact.fullname.toLowerCase().includes(searchText.toLowerCase())
          );
        }
  
        displayContacts(filteredContacts);
      } else {
        displayContacts([]);
      }
    })
};

const loadMessages = (currentUserUid, partnerUid) => {
    const conversationId = [currentUserUid, partnerUid].sort().join('_');
    const messagesRef = ref(db, 'MessageList');
    
    const messagesQuery = query(messagesRef, orderByChild('conversation'), equalTo(conversationId));

    get(messagesQuery).then((snapshot) => {
        const messagesContainer = document.querySelector('.messages-container');
        messagesContainer.innerHTML = '';

        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                const messageData = childSnapshot.val();

                const messageElement = document.createElement('div');
                messageElement.classList.add('message');

                const messageText = document.createElement('p');
                messageText.textContent = messageData.message;
                if (messageData.senderUid === currentUserUid) {
                    messageText.classList.add('message-user');
                } else {
                    messageText.classList.add('message-partner');
                }

                const timestampElement = document.createElement('span');
                timestampElement.classList.add('message-timestamp');
                const date = new Date(messageData.timestamp);
                timestampElement.textContent = date.toLocaleString([], {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'});

                messageElement.appendChild(timestampElement);
                messageElement.appendChild(messageText);

                messagesContainer.appendChild(messageElement);
            });
        }
    })
};

const sendMessage = async () => {
    const messageInput = document.querySelector('.message-input input');
    const messageText = messageInput.value.trim();

    if (messageText && currentChatPartner) {
        const conversationId = [auth.currentUser.uid, currentChatPartner].sort().join('_');
        const newMessageRef = push(ref(db, 'MessageList'));
        
        await set(newMessageRef, {
            senderUid: auth.currentUser.uid,
            receiverUid: currentChatPartner,
            message: messageText,
            timestamp: Date.now(),
            conversation: conversationId
        });
        loadMessages(auth.currentUser.uid, currentChatPartner);
        messageInput.value = '';
    }
};

window.addEventListener("load", async () => {
    CheckCred();
    await displayContacts();

    document.querySelectorAll('.message-contact').forEach(button => {
        button.addEventListener('click', function() {
            const partnerUid = this.getAttribute('data-uid');
            currentChatPartner = partnerUid;
            loadMessages(auth.currentUser.uid, partnerUid);
        });
    });
});

sendButton.addEventListener("click", sendMessage);