let todos = JSON.parse(localStorage.getItem('todos')) || [];
let taskInput;
let addBtn;
let todoList;
let clearAllBtn;
let emptyState;
function initializeElements() {
    taskInput = document.getElementById('taskInput');
    addBtn = document.getElementById('addBtn');
    todoList = document.getElementById('todoList');
    clearAllBtn = document.getElementById('clearAllBtn');
    emptyState = document.getElementById('emptyState');
}
function bindEvents() {
    addBtn.addEventListener('click', () => addTask());
    clearAllBtn.addEventListener('click', () => clearAllTasks());
    taskInput.focus();
}
function addTask() {
    const text = taskInput.value.trim();
    if (text === '') return;
    if (text.length > 100) return;
    const todo = {
        id: generateId(),
        text: text,
        completed: false
    };
    todos.unshift(todo);
    taskInput.value = '';
    saveTodos();
    render();
}
function toggleTask(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveTodos();
        render();
    }
}
function editTask(id) {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    const newText = prompt('Edit task:', todo.text);
    if (newText === null || newText.trim() === '' || newText.trim().length > 100) return;

    todo.text = newText.trim();
    saveTodos();
    render();
}
function deleteTask(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        todos = todos.filter(t => t.id !== id);
        saveTodos();
        render();
    }
}
function clearAllTasks() {
    if (todos.length === 0) return;
    if (confirm('Are you sure you want to delete all tasks? This action cannot be undone.')) {
        todos = [];
        saveTodos();
        render();
    }
}
function render() {
    if (todos.length === 0) {
        todoList.innerHTML = '';
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
        renderTodos(todos);
    }
}
function renderTodos(todosToRender) {
    todoList.innerHTML = todosToRender.map(todo => createTodoHTML(todo)).join('');
    todoList.querySelectorAll('.todo-item').forEach(item => {
        const id = parseFloat(item.dataset.id);
        const checkbox = item.querySelector('.todo-checkbox');
        const text = item.querySelector('.todo-text');
        checkbox.addEventListener('click', () => toggleTask(id));
        text.addEventListener('click', () => toggleTask(id));
        const editBtn = item.querySelector('.edit-btn');
        editBtn.addEventListener('click', (e) => {
            editTask(id);
        });
        const deleteBtn = item.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', (e) => {
            deleteTask(id);
        });
    });
}
function createTodoHTML(todo) {
    const completedClass = todo.completed ? 'completed' : '';
    const checkedClass = todo.completed ? 'checked' : '';
    return `
        <li class="todo-item ${completedClass}" data-id="${todo.id}">
            <div class="todo-checkbox ${checkedClass}"></div>
            <span class="todo-text">${escapeHtml(todo.text)}</span>
            <div class="todo-actions">
                <button class="action-btn edit-btn" title="Edit task">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete-btn" title="Delete task">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </li>
    `;
}
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}
function generateId() {
    return Math.random();
}
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
function init() {
    initializeElements();
    bindEvents();
    render();
}
document.addEventListener('DOMContentLoaded', () => {
    init();
});
