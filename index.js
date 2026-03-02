let inputTask = document.querySelector(".inputTask");
let teamInput = document.querySelector(".teamInput")
let btnAdd = document.querySelector(".addTask");
let content = document.querySelector(".task-board");
let noTasks = document.querySelector(".noTasks");
let errorMsg = document.querySelector(".error-message")
let numTasks = document.querySelector(".numTasks");
let tasksContainer = document.querySelector(".tasks-list");
let popup = document.querySelector(".popup-overlay")
let counter = 0;
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let membersData = JSON.parse(localStorage.getItem("membersData")) || [];


function addMember() {

  let names = teamInput.value
    .split(',')
    .map(name => name.trim())
    .filter(name => name !== "");

  if (names.length === 0) {
    errorMsg.innerHTML = "You must add at least one valid member!";
    errorMsg.style.color = "red";
    return;
  }

  names.forEach(name => {
    membersData.push({
      name: name,
      tasks: []
    });
  });

  localStorage.setItem("membersData", JSON.stringify(membersData));
  errorMsg.innerHTML = "Added Successfully!";
  errorMsg.style.color = "green";

  setTimeout(() => {
    popup.style.display = "none"
    displayMembers()

  }, 1000);

  teamInput.value = "";
}

function displayMembers() {
  let container = document.querySelector('.members');
  container.innerHTML = '';
  membersData.forEach(function (member) {
    let card = document.createElement('div');
    card.className = "card";
    card.innerHTML = `
      <div class="member-info">
        <div class="header">
          <h3>👤 ${member.name}</h3>
          <p class="memberTask"
             style="background: linear-gradient(to right, #5266ba 40%, #585caa, #5f4c8f);">
             ${member.tasks.length}
          </p>
        </div>
        <div class="member-tasks"></div>
      </div>
    `;
    container.appendChild(card);
  });

  let allTaskAreas = document.querySelectorAll('.member-tasks');
  membersData.forEach(function (member, memberIndex) {
    let taskArea = allTaskAreas[memberIndex];
    member.tasks.forEach(function (task, taskIndex) {
      let taskDiv = document.createElement("div");
      taskDiv.classList.add("task2");
      taskDiv.classList.add(task.status);
      let topRow = document.createElement("div");
      topRow.className = "top-row";
      let title = document.createElement("h4");
      title.innerText = task.text;

      let deleteBtn = document.createElement("span");
      deleteBtn.innerText = "×";
      deleteBtn.className = "delete-btn";

      topRow.appendChild(title);
      topRow.appendChild(deleteBtn);

      let select = document.createElement("select");
      select.className = "task-select";
      select.innerHTML = `
        <option value="not">Not Started</option>
        <option value="ongoing">Ongoing</option>
        <option value="done">Done</option>
      `;
      select.value = task.status;

      select.addEventListener("change", function () {

        membersData[memberIndex].tasks[taskIndex].status = this.value;

        taskDiv.classList.remove("not", "ongoing", "done");
        taskDiv.classList.add(this.value);

        localStorage.setItem("membersData", JSON.stringify(membersData));
      });

      deleteBtn.addEventListener("click", function () {

        membersData[memberIndex].tasks.splice(taskIndex, 1);

        localStorage.setItem("membersData", JSON.stringify(membersData));

        displayMembers();
      });

      taskDiv.appendChild(topRow);
      taskDiv.appendChild(select);
      taskArea.appendChild(taskDiv);
    });

    taskArea.addEventListener("dragover", function (e) {
      e.preventDefault();
      taskArea.classList.add("drag-active");
    });

    taskArea.addEventListener("dragleave", function () {
      taskArea.classList.remove("drag-active");
    });

    taskArea.addEventListener("drop", function (e) {

      e.preventDefault();
      taskArea.classList.remove("drag-active");

      let taskIndex = e.dataTransfer.getData("taskIndex");

      if (taskIndex !== null) {

        membersData[memberIndex].tasks.push({
          text: tasks[taskIndex],
          status: "not"
        });

        tasks.splice(taskIndex, 1);

        localStorage.setItem("tasks", JSON.stringify(tasks));
        localStorage.setItem("membersData", JSON.stringify(membersData));

        displayTasks();
        displayMembers();
      }
    });

  });

}

function hidePopup() {
  document.querySelector(".popup").style.display = "none";
  document.querySelector(".popup-overlay").style.display = "none";
}


btnAdd.addEventListener("click", () => {
  if (inputTask.value !== "") {
    tasks.push(inputTask.value.trim());
    noTasks.style.display = "none";
    localStorage.setItem("tasks", JSON.stringify(tasks));
    inputTask.value = "";
    displayTasks();
  }
});

displayTasks()
displayMembers()

function displayTasks() {
  tasksContainer.innerHTML = "";
  if (tasks.length === 0) {
    noTasks.style.display = "block";
  } else {
    noTasks.style.display = "none";
  }

  tasks.forEach((task, index) => {
    let taskDiv = document.createElement("div");
    taskDiv.className = "task";

    taskDiv.innerHTML = `
      ${task}
      <button class="delete">X</button>
    `;

    taskDiv.querySelector(".delete").onclick = function () {
      tasks.splice(index, 1);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      displayTasks();
    };

    tasksContainer.appendChild(taskDiv);

    taskDiv.draggable = true;

    taskDiv.addEventListener("dragstart", function (e) {
      e.dataTransfer.setData("taskIndex", index);
    });
  });

  numTasks.textContent = tasks.length;
}
