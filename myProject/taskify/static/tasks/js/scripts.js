const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;

// Optionally set a default transition
body.style.transition = "background-color 2.5s ease, color 2.5s ease";

darkModeToggle.addEventListener('click', () => {
    if (body.dataset.theme === 'light' || !body.dataset.theme) {
        // Switching to dark mode: use a 1s transition
        body.style.transition = "background-color 2.5s ease, color 1s ease";
        body.dataset.theme = 'dark';
        localStorage.setItem('theme', 'dark');
    } else {
        // Switching back to light mode: use a 2.5s transition
        body.style.transition = "background-color 2.5s ease, color 2.5s ease";
        body.dataset.theme = 'light';
        localStorage.setItem('theme', 'light');
    }
});


// Load Theme on Page Load
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    body.dataset.theme = savedTheme;
});

// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Function to save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to generate a unique ID for tasks
function generateTaskId() {
    return `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Function to add a task
function addTask(taskText, taskCategory, taskPriority, taskDateTime, taskDescription, taskId = null, completed = false) {
    const taskList = document.getElementById('taskList');

    const li = document.createElement('li');
    li.dataset.id = taskId || generateTaskId(); // Assign unique ID
    li.classList.toggle('completed', completed);

    li.innerHTML = `
        <span>${taskText} (${taskCategory}, ${taskPriority}, Due: ${new Date(taskDateTime).toLocaleString()})</span>
        <div>
            <button class="tick" onclick="completeTask('${li.dataset.id}')">✔️</button>
            <button onclick="removeTask('${li.dataset.id}')">
                <img src="https://img.icons8.com/ios-filled/24/ff3b30/trash.png" alt="Delete" style="width: 20px; height: 20px;"/>
            </button>
        </div>
    `;

    li.addEventListener('click', () => displayDescription(taskDescription));
    taskList.appendChild(li);

    // Add task to array if it's a new task
    if (!taskId) {
        tasks.push({
            id: li.dataset.id,
            text: taskText,
            category: taskCategory,
            priority: taskPriority,
            dateTime: taskDateTime,
            description: taskDescription,
            completed: false
        });
        saveTasks();
    }
}

// Function to display the task description
function displayDescription(description) {
    const displayText = document.getElementById('displayText');
    displayText.textContent = description || "No description available.";
}

// Function to remove a task
function removeTask(taskId) {
    const taskList = document.getElementById('taskList');
    const taskElement = document.querySelector(`[data-id='${taskId}']`);

    if (taskElement) {
        taskList.removeChild(taskElement);
        tasks = tasks.filter(task => task.id !== taskId);
        saveTasks();
    }
}

// Function to mark a task as completed
function completeTask(taskId) {
    const taskElement = document.querySelector(`[data-id='${taskId}']`);

    if (taskElement) {
        taskElement.classList.toggle('completed');
        const task = tasks.find(task => task.id === taskId);
        task.completed = !task.completed;
        saveTasks();
    }
}

// Function to search tasks
document.getElementById('searchInput').addEventListener('input', function(event) {
    const searchText = event.target.value.toLowerCase();
    const taskList = document.getElementById('taskList');

    taskList.querySelectorAll('li').forEach(li => {
        const taskText = li.querySelector('span').textContent.toLowerCase();
        li.style.display = taskText.includes(searchText) ? 'flex' : 'none';
    });
});

// Load tasks on page load
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('taskList').innerHTML = ''; // Prevent duplicates
    tasks.forEach(task => {
        addTask(task.text, task.category, task.priority, task.dateTime, task.description, task.id, task.completed);
    });
});

// Handle form submission
document.getElementById('taskForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const taskInput = document.getElementById('taskInput');
    const taskCategory = document.getElementById('taskCategory').value;
    const taskPriority = document.getElementById('taskPriority').value;
    const taskDateTime = document.getElementById('taskDateTime').value;
    const taskText = taskInput.value.trim();
    const taskDescription = document.getElementById('taskDescription').value.trim();

    if (taskText !== '' && taskDateTime) {
        addTask(taskText, taskCategory, taskPriority, taskDateTime, taskDescription);
        taskInput.value = '';
        document.getElementById('taskDescription').value = '';
    }
});
