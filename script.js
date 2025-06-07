function addHomework() {
  const input = document.getElementById("homeworkInput");
  const homework = input.value.trim();
  if (homework === "") return;

  db.collection("homeworks")
    .add({
      text: homework,
      done: false,
      timestamp: new Date()
    })
    .then(() => {
      input.value = "";
    })
    .catch((error) => {
      console.error("Error adding homework: ", error);
    });
}

// Realtime listener
db.collection("homeworks").orderBy("timestamp", "desc").onSnapshot((snapshot) => {
  const list = document.getElementById("homeworkList");
  list.innerHTML = "";
  snapshot.forEach((doc) => {
    const item = document.createElement("li");
    item.textContent = doc.data().text;

    const doneBtn = document.createElement("button");
    doneBtn.textContent = doc.data().done ? "✅ Done" : "Mark as Done";
    doneBtn.onclick = () => {
      db.collection("homeworks").doc(doc.id).update({
        done: !doc.data().done
      });
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑 Delete";
    deleteBtn.onclick = () => {
      db.collection("homeworks").doc(doc.id).delete();
    };

    item.appendChild(doneBtn);
    item.appendChild(deleteBtn);
    list.appendChild(item);
  });
});
