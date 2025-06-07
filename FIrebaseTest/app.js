import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  push,
  onChildAdded,
  onChildChanged,
  onChildRemoved,
  remove,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.9.0/firebase-database.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAY7trpx0U8wvd5a59t2roeTcc_oErcR84",
  authDomain: "homeworktrackerfirebase.firebaseapp.com",
  projectId: "homeworktrackerfirebase",
  storageBucket: "homeworktrackerfirebase.firebasestorage.app",
  messagingSenderId: "799548392721",
  appId: "1:799548392721:web:2a535687f7a1aed6d8b8b0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const homeworksRef = ref(db, "homeworks");

// DOM elements
const homeworkForm = document.getElementById("homeworkForm");
const subject = document.getElementById("subject");
const description = document.getElementById("description");
const dueDate = document.getElementById("dueDate");
const hiddenId = document.getElementById("hiddenId");
const homeworks = document.getElementById("homeworks");

// Event handlers
setupEventHandlers();

function setupEventHandlers() {
  homeworkForm.addEventListener("submit", e => {
    e.preventDefault();
    handleSubmit();
    Materialize.updateTextFields();
  });

  homeworks.addEventListener("click", e => {
    updateHomework(e);
    deleteHomework(e);
  });

  onChildAdded(homeworksRef, snapshot => {
    readHomeworks(snapshot);
  });

  onChildChanged(homeworksRef, snapshot => {
    const node = document.getElementById(snapshot.key);
    node.innerHTML = homeworkTemplate(snapshot.val());
  });

  onChildRemoved(homeworksRef, snapshot => {
    const node = document.getElementById(snapshot.key);
    if (node && node.parentNode) node.parentNode.removeChild(node);
  });
}

function handleSubmit() {
  if (!subject.value || !description.value || !dueDate.value) return;

  const id = hiddenId.value || push(homeworksRef).key;

  set(ref(db, "homeworks/" + id), {
    subject: subject.value,
    description: description.value,
    dueDate: dueDate.value,
    createdAt: serverTimestamp()
  });

  clearForm();
}

function readHomeworks(snapshot) {
  const li = document.createElement("li");
  li.id = snapshot.key;
  li.innerHTML = homeworkTemplate(snapshot.val());
  homeworks.appendChild(li);
}

function updateHomework(e) {
  const node = e.target.closest("li");
  if (e.target.classList.contains("edit")) {
    subject.value = node.querySelector(".subject").innerText;
    description.value = node.querySelector(".description").innerText;
    dueDate.value = node.querySelector(".dueDate").innerText;
    hiddenId.value = node.id;
    Materialize.updateTextFields();
  }
}

function deleteHomework(e) {
  const node = e.target.closest("li");
  if (e.target.classList.contains("delete")) {
    const id = node.id;
    remove(ref(db, "homeworks/" + id));
    clearForm();
  }
}

function homeworkTemplate({ subject, description, dueDate, createdAt }) {
  const createdAtFormatted = createdAt
    ? new Date(createdAt).toLocaleString()
    : "Just now";

  return `
    <div>
      <label>Subject:</label>
      <label class="subject"><strong>${subject}</strong></label>
    </div>
    <div>
      <label>Description:</label>
      <label class="description">${description}</label>
    </div>
    <div>
      <label>Due Date:</label>
      <label class="dueDate">${dueDate}</label>
    </div>
    <div>
      <label>Created:</label>
      <label class="createdAt">${createdAtFormatted}</label>
    </div>
    <br>
    <button class="waves-effect waves-light btn delete">Delete</button>
    <button class="waves-effect waves-light btn edit">Edit</button>
    <br><br><br><br>
  `;
}

function clearForm() {
  subject.value = "";
  description.value = "";
  dueDate.value = "";
  hiddenId.value = "";
}
