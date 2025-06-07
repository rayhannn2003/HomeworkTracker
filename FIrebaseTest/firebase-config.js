// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAY7trpx0U8wvd5a59t2roeTcc_oErcR84",
  authDomain: "homeworktrackerfirebase.firebaseapp.com",
  databaseURL: "https://homeworktrackerfirebase-default-rtdb.firebaseio.com", // make sure this is your Realtime DB URL
  projectId: "homeworktrackerfirebase",
  storageBucket: "homeworktrackerfirebase.appspot.com",
  messagingSenderId: "799548392721",
  appId: "1:799548392721:web:2a535687f7a1aed6d8b8b0"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };
