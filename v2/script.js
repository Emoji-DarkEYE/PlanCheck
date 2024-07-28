document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const checkAllButton = document.getElementById('check-all');
    const deleteAllButton = document.getElementById('delete-all');
    const title = document.querySelector('.todo-container h2');

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date();
    const dayName = daysOfWeek[today.getDay()];
    const date = today.toLocaleDateString();
    title.textContent = `${dayName}, ${date}`;

    // Load tasks from local storage
    loadTasks();

    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addTodoItem(todoInput.value);
        todoInput.value = '';
    });

    checkAllButton.addEventListener('click', () => {
        const allTasks = todoList.querySelectorAll('input[type="checkbox"]');
        const allChecked = Array.from(allTasks).every(task => task.checked);
        allTasks.forEach(task => {
            task.checked = !allChecked;
            toggleTaskCompletion(task);
        });
        saveTasks();
    });

    deleteAllButton.addEventListener('click', () => {
        todoList.innerHTML = '';
        saveTasks();
    });

    function addTodoItem(task) {
        if (task.trim() === '') return;
        
        const li = document.createElement('li');
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.addEventListener('change', () => {
            toggleTaskCompletion(checkbox);
            saveTasks();
        });
        
        const span = document.createElement('span');
        span.textContent = task;
        
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => {
            li.remove();
            saveTasks();
        });

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteButton);
        
        todoList.appendChild(li);
        saveTasks();
    }

    function toggleTaskCompletion(checkbox) {
        if (checkbox.checked) {
            checkbox.parentElement.classList.add('completed');
        } else {
            checkbox.parentElement.classList.remove('completed');
        }
    }

    function saveTasks() {
        const tasks = [];
        todoList.querySelectorAll('li').forEach(li => {
            tasks.push({
                text: li.querySelector('span').textContent,
                completed: li.querySelector('input[type="checkbox"]').checked
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
        localStorage.setItem('lastSaveDate', new Date().toLocaleDateString());
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            addTodoItem(task.text);
            const li = todoList.lastChild;
            const checkbox = li.querySelector('input[type="checkbox"]');
            checkbox.checked = task.completed;
            toggleTaskCompletion(checkbox);
        });

        const lastSaveDate = localStorage.getItem('lastSaveDate');
        if (lastSaveDate && lastSaveDate !== new Date().toLocaleDateString()) {
            exportToExcel();
            localStorage.removeItem('tasks');
        }
    }

    function exportToExcel() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        if (tasks.length === 0) return;

        const data = tasks.map(task => ({
            'Task': task.text,
            'Completed': task.completed ? 'Yes' : 'No'
        }));

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Tasks');

        const fileName = `Tasks_${new Date().toLocaleDateString().replace(/\//g, '-')}.xlsx`;
        XLSX.writeFile(wb, fileName);
    }

    // Reset tasks if a new day starts
    const intervalId = setInterval(() => {
        const now = new Date();
        if (now.getHours() === 0 && now.getMinutes() === 0 && now.getSeconds() === 0) {
            exportToExcel();
            localStorage.removeItem('tasks');
            todoList.innerHTML = '';
        }
    }, 1000);
});
