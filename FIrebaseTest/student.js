import { db } from './firebase-config.js';
import {
  ref,
  onValue,
  update
} from "https://www.gstatic.com/firebasejs/11.9.0/firebase-database.js";

const studentNameInput = document.getElementById('studentName');
const homeworkList = document.getElementById('homeworkList');

let studentName = '';

studentNameInput.addEventListener('change', () => {
  studentName = studentNameInput.value.trim();
  renderHomework();
});

function createHomeworkElement(id, hw) {
  const div = document.createElement('div');
  div.className = 'homework-item';

  const done = hw.studentStatus && hw.studentStatus[studentName];

  div.innerHTML = `
    <div class="homework-info">
      <strong>${hw.subject}</strong> (${hw.dayName}, ${hw.date})<br/>
      <em>${hw.description}</em><br/>
      Deadline: ${hw.deadline}
    </div>
  `;

  const markDoneBtn = document.createElement('button');
  markDoneBtn.textContent = done ? 'Done' : 'Mark as Done';
  markDoneBtn.disabled = done || !studentName;
  markDoneBtn.className = 'markDoneBtn';

  markDoneBtn.onclick = () => {
    if (!studentName) {
      alert('Please enter your name first!');
      return;
    }
    const updateObj = {};
    updateObj[`studentStatus/${studentName}`] = true;
    update(ref(db, 'homeworks/' + id), updateObj);
  };

  div.appendChild(markDoneBtn);

  return div;
}

function renderHomework() {
  if (!studentName) {
    homeworkList.innerHTML = '<p>Please enter your name to view homework.</p>';
    return;
  }
  const homeworksRef = ref(db, 'homeworks');
  onValue(homeworksRef, snapshot => {
    homeworkList.innerHTML = '';
    const data = snapshot.val();
    if (!data) {
      homeworkList.innerHTML = '<p>No homework assigned yet.</p>';
      return;
    }
    Object.entries(data).forEach(([id, hw]) => {
      homeworkList.appendChild(createHomeworkElement(id, hw));
    });
  });
}
