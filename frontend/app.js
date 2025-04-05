const API_URL = "http://127.0.0.1:8000/tasks";
const taskList = document.getElementById("task-list");
const form = document.getElementById("task-form");
const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");

let editingTaskId = null; // usado para saber se estamos editando

async function fetchTasks() {
    const response = await fetch(API_URL);
    const tasks = await response.json();
    renderTasks(tasks);
}

function renderTasks(tasks) {
    taskList.innerHTML = "";
    tasks.forEach((task) => {
    const li = document.createElement("li");
    li.innerHTML = `
        <span><strong>${task.title}</strong>: ${task.description}</span>
        <div>
        <button onclick="editTask(${task.id}, '${task.title}', '${task.description}')">Editar</button>
        <button onclick="deleteTask(${task.id})">Remover</button>
        </div>
    `;
    taskList.appendChild(li);
    });
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const task = {
    title: titleInput.value,
    description: descriptionInput.value,
    };

    if (editingTaskId) {
    // Editando
    await fetch(`${API_URL}/${editingTaskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
    });
    editingTaskId = null;
    } else {
    // Criando
    await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
    });
    }

    form.reset();
    fetchTasks();
});

async function deleteTask(id) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchTasks();
}

function editTask(id, title, description) {
    titleInput.value = title;
    descriptionInput.value = description;
    editingTaskId = id;
}

// Inicializa a lista
fetchTasks();
