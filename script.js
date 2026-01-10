/* ---------- GLOBAL STATE ---------- */
let editIndex = null;

/* ---------- ALERT SYSTEM ---------- */
function showAlert(message, type = "success") {
  const alert = document.createElement("div");
  alert.className = `alert ${type}`;
  alert.innerText = message;

  document.body.appendChild(alert);

  setTimeout(() => {
    alert.classList.add("hide");
    setTimeout(() => alert.remove(), 500);
  }, 3000);
}

/* ---------- AUTH ---------- */
function signup() {
  if (!signupName.value || !signupEmail.value || !signupPass.value) {
    showAlert("Please fill all fields", "error");
    return;
  }

  let users = JSON.parse(localStorage.users || "[]");

  if (users.find(u => u.email === signupEmail.value)) {
    showAlert("Email already exists", "error");
    return;
  }

  users.push({
    name: signupName.value,
    email: signupEmail.value,
    pass: signupPass.value
  });

  localStorage.users = JSON.stringify(users);
  showAlert("Account created successfully");
  showLogin();
}

function login() {
  let users = JSON.parse(localStorage.users || "[]");

  let user = users.find(
    u => u.email === loginEmail.value && u.pass === loginPass.value
  );

  if (!user) {
    showAlert("Wrong email or password", "error");
    return;
  }

  localStorage.currentUser = JSON.stringify(user);
  showAlert("Login successful");
  init();
}

function logout() {
  localStorage.removeItem("currentUser");
  location.reload();
}

function showLogin() {
  signupForm.style.display = "none";
  loginForm.style.display = "block";
}

function showSignup() {
  loginForm.style.display = "none";
  signupForm.style.display = "block";
}

/* ---------- INIT ---------- */
function init() {
  let user = JSON.parse(localStorage.currentUser);
  authSection.style.display = "none";
  taskSection.style.display = "flex";
  userName.innerText = user.name;
  renderTasks();
}

/* ---------- TASK CRUD ---------- */
function addTask(e) {
  e.preventDefault();

  let tasks = JSON.parse(localStorage.tasks || "[]");

  const taskData = {
    title: taskTitle.value.trim(),
    assignee: taskAssignee.value.trim(),
    dueDate: taskDueDate.value,
    status: taskStatus.value
  };

  if (!taskData.title) {
    showAlert("Task title is required", "error");
    return;
  }

  if (editIndex === null) {
    tasks.push(taskData);
    showAlert("Task added successfully");
  } else {
    tasks[editIndex] = taskData;
    editIndex = null;
    showAlert("Task updated successfully");
  }

  localStorage.tasks = JSON.stringify(tasks);
  e.target.reset();
  renderTasks();
}

/* ---------- RENDER TASKS ---------- */
function renderTasks() {
  let tasks = JSON.parse(localStorage.tasks || "[]");
  taskList.innerHTML = "";

  let fs = filterStatus.value;
  let fa = filterAssignee.value.toLowerCase();

  let filtered = tasks.filter(t =>
    (fs === "All" || t.status === fs) &&
    (t.assignee || "").toLowerCase().includes(fa)
  );

  totalTasks.innerText = filtered.length;
  completedTasks.innerText = filtered.filter(
    t => t.status === "Completed"
  ).length;

  filtered.forEach((t, i) => {
    let div = document.createElement("div");
    div.className = "taskCard";
    div.innerHTML = `
      <b>${t.title}</b><br>
      ${t.assignee || "Unassigned"}<br>
      ${t.dueDate || "-"}<br>
      ${t.status}<br>
      <button class="edit" onclick="editTask(${i})">Edit</button>
      <button class="delete" onclick="deleteTask(${i})">Delete</button>
    `;
    taskList.appendChild(div);
  });

  progressFill.style.width =
    filtered.length
      ? (completedTasks.innerText / filtered.length) * 100 + "%"
      : "0%";
}

/* ---------- EDIT & DELETE ---------- */
function editTask(i) {
  let tasks = JSON.parse(localStorage.tasks || "[]");
  let task = tasks[i];

  taskTitle.value = task.title;
  taskAssignee.value = task.assignee;
  taskDueDate.value = task.dueDate;
  taskStatus.value = task.status;

  editIndex = i;
  showAlert("Editing mode enabled");
}

function deleteTask(i) {
  let tasks = JSON.parse(localStorage.tasks || "[]");
  tasks.splice(i, 1);
  localStorage.tasks = JSON.stringify(tasks);
  showAlert("Task deleted", "error");
  renderTasks();
}
