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
// studentNameInput.value = localStorage.getItem('studentName') || '';
// studentName = studentNameInput.value;
// studentNameInput.addEventListener('change', () => {
//   studentName = studentNameInput.value.trim();
//   localStorage.setItem('studentName', studentName);
//   renderHomework();
// });


// function createHomeworkElement(id, hw) {
//   const div = document.createElement('div');
//   div.className = 'homework-item';

//   const done = hw.studentStatus && hw.studentStatus[studentName];

//   div.innerHTML = `
//     <div class="homework-info">
//       <strong>${hw.subject}</strong> (${hw.dayName}, ${hw.date})<br/>
//       <em>${hw.description}</em><br/>
//       Deadline: ${hw.deadline}
//     </div>
//   `;

//   const markDoneBtn = document.createElement('button');
//   markDoneBtn.textContent = done ? 'Done' : 'Mark as Done';
//   markDoneBtn.disabled = done || !studentName;
//   markDoneBtn.className = 'markDoneBtn';

//   markDoneBtn.onclick = () => {
//     if (!studentName) {
//       alert('Please enter your name first!');
//       return;
//     }
//     const updateObj = {};
//     updateObj[`studentStatus/${studentName}`] = true;
//     update(ref(db, 'homeworks/' + id), updateObj);
//   };

//   div.appendChild(markDoneBtn);

//   return div;
// }
//function getCurrentTimestamp() {
function getCurrentTimestamp() {
  const now = new Date();
  return now.toLocaleString('en-GB', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
    hour12: false
  });
}

function createHomeworkElement(id, hw) {
  const div = document.createElement('div');
  div.className = 'homework-item';

  const done = hw.studentStatus && hw.studentStatus[studentName];
  const existingRemark = hw.remarks && hw.remarks[studentName] || '';

  div.innerHTML = `
    <div class="homework-info">
      <strong>${hw.subject}</strong> (${hw.dayName}, ${hw.date})<br/>
      <em>${hw.description}</em><br/>
      Deadline: ${hw.deadline}<br/><br/>
    </div>
  `;

  // "Mark as Done" Button
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
  updateObj[`studentStatus/${studentName}`] = {
    done: true,
    timestamp: getCurrentTimestamp()
  };

  update(ref(db, 'homeworks/' + id), updateObj)
    .then(() => {
      alert("Marked as done!");
    });
};


  // Remark Input
  const remarkInput = document.createElement('textarea');
  remarkInput.placeholder = 'Add your remark...';
  remarkInput.value = existingRemark;
  remarkInput.rows = 2;
  remarkInput.style.width = '100%';
  remarkInput.style.marginTop = '10px';

  const saveRemarkBtn = document.createElement('button');
  saveRemarkBtn.textContent = 'Save Remark';
  saveRemarkBtn.className = 'btn';
  saveRemarkBtn.style.marginTop = '5px';

  saveRemarkBtn.onclick = () => {
     const remark = remarkInput.value.trim();
  if (!studentName) {
    alert('Please enter your name first!');
    return;
  }
  const updateObj = {};
  updateObj[`remarks/${studentName}`] = {
    text: remark,
    timestamp: getCurrentTimestamp()
  };
  update(ref(db, 'homeworks/' + id), updateObj)
    .then(() => {
      alert('Remark saved!');
    });
  };

  div.appendChild(markDoneBtn);
  div.appendChild(remarkInput);
  div.appendChild(saveRemarkBtn);

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
