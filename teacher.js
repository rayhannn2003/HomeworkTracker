import { db } from './firebase-config.js';
import {
  ref,
  push,
  set,
  onValue,
  remove,
  update
} from "https://www.gstatic.com/firebasejs/11.9.0/firebase-database.js";

const homeworkForm = document.getElementById('homeworkForm');
const homeworkIdInput = document.getElementById('homeworkId');
const subjectInput = document.getElementById('subject');
const descriptionInput = document.getElementById('description');
const dateInput = document.getElementById('date');
const deadlineInput = document.getElementById('deadline');
const homeworkList = document.getElementById('homeworkList');

const homeworksRef = ref(db, 'homeworks');

homeworkForm.addEventListener('submit', e => {
  e.preventDefault();

  const id = homeworkIdInput.value || push(homeworksRef).key;

  const homeworkData = {
    subject: subjectInput.value,
    description: descriptionInput.value,
    date: dateInput.value,
    dayName: new Date(dateInput.value).toLocaleDateString('en-US', { weekday: 'long' }),
    deadline: deadlineInput.value,
    studentStatus: {} // Initialize empty; students update this
  };

  set(ref(db, 'homeworks/' + id), homeworkData)
    .then(() => {
      clearForm();
    });
});

function clearForm() {
  homeworkIdInput.value = '';
  subjectInput.value = '';
  descriptionInput.value = '';
  dateInput.value = '';
  deadlineInput.value = '';
}

// function createHomeworkElement(id, hw) {
//   const div = document.createElement('div');
//   div.className = 'homework-item';

//   const studentsDone = hw.studentStatus ? Object.keys(hw.studentStatus).filter(s => hw.studentStatus[s]) : [];

//   div.innerHTML = `
//     <div class="homework-info">
//       <strong>${hw.subject}</strong> (${hw.dayName}, ${hw.date})<br/>
//       <em>${hw.description}</em><br/>
//       Deadline: ${hw.deadline}<br/>
//       <small>Completed by: ${studentsDone.length ? studentsDone.join(', ') : 'No one yet'}</small>
//     </div>
//     <div>
//       <button class="editBtn" data-id="${id}">Edit</button>
//       <button class="deleteBtn" data-id="${id}">Delete</button>
//     </div>
//   `;

//   // Edit button
//   div.querySelector('.editBtn').onclick = () => {
//     homeworkIdInput.value = id;
//     subjectInput.value = hw.subject;
//     descriptionInput.value = hw.description;
//     dateInput.value = hw.date;
//     deadlineInput.value = hw.deadline;
//   };
   function createHomeworkElement(id, hw) {
  const div = document.createElement('div');
  div.className = 'homework-item';

  const studentsDone = hw.studentStatus
  ? Object.keys(hw.studentStatus).filter(s => hw.studentStatus[s]?.done === true)
  : [];


 const remarkLines = hw.remarks
  ? Object.entries(hw.remarks).map(([student, remarkObj]) => {
      const text = remarkObj?.text || '(No remark)';
      const time = remarkObj?.timestamp || '';
      return `<li><strong>${student}</strong>: ${text} <br/><small>at ${time}</small></li>`;
    }).join('')
  : '<li><em>No remarks submitted yet.</em></li>';

  div.innerHTML = `
    <div class="homework-info">
      <strong>${hw.subject}</strong> (${hw.dayName}, ${hw.date})<br/>
      <em>${hw.description}</em><br/>
      Deadline: ${hw.deadline}<br/>
      <small><strong>Completed by:</strong> ${studentsDone.length ? studentsDone.join(', ') : 'No one yet'}</small>
      <br/><small>${studentsDone.map(s => `${s} @ ${hw.studentStatus[s]?.timestamp || ''}`).join('<br/>')}</small>
      <br/><br/>
      <details>
        <summary><strong>Student Remarks</strong></summary>
        <ul style="margin-top: 0.5rem; padding-left: 1rem;">${remarkLines}</ul>
      </details>
    </div>
    <div>
      <button class="editBtn" data-id="${id}">Edit</button>
      <button class="deleteBtn" data-id="${id}">Delete</button>
    </div>
  `;

  // Edit button
  div.querySelector('.editBtn').onclick = () => {
    homeworkIdInput.value = id;
    subjectInput.value = hw.subject;
    descriptionInput.value = hw.description;
    dateInput.value = hw.date;
    deadlineInput.value = hw.deadline;
  };

  // Delete button
  div.querySelector('.deleteBtn').onclick = () => {
    remove(ref(db, 'homeworks/' + id));
    if (homeworkIdInput.value === id) clearForm();
  };

  return div;
}

//   // Delete button
//   div.querySelector('.deleteBtn').onclick = () => {
//     remove(ref(db, 'homeworks/' + id));
//     if (homeworkIdInput.value === id) clearForm();
//   };

//   return div;
// }

onValue(homeworksRef, snapshot => {
  homeworkList.innerHTML = '';
  const data = snapshot.val();
  if (!data) {
    homeworkList.innerHTML = '<p>No homework added yet.</p>';
    return;
  }
  Object.entries(data).forEach(([id, hw]) => {
    homeworkList.appendChild(createHomeworkElement(id, hw));
  });
});
