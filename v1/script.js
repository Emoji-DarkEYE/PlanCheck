document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const checkAllButton = document.getElementById('check-all');
    const deleteAllButton = document.getElementById('delete-all');

    // Load todos from local storage
    loadTodos();

    todoForm.addEventListener('submit', addTodo);
    checkAllButton.addEventListener('click', checkAllTodos);
    deleteAllButton.addEventListener('click', deleteAllTodos);

    function addTodo(event) {
        event.preventDefault();
        
        const newTodoText = todoInput.value.trim();
        if (newTodoText === '') {
            return;
        }

        const li = createTodoElement(newTodoText);
        todoList.appendChild(li);

        saveTodos();
        todoInput.value = '';
    }

    function createTodoElement(text) {
        const li = document.createElement('li');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('completed-checkbox');
        checkbox.addEventListener('change', () => {
            li.classList.toggle('completed');
            saveTodos();
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-btn');
        deleteButton.addEventListener('click', () => {
            li.remove();
            saveTodos();
        });

        li.appendChild(checkbox);
        li.appendChild(document.createTextNode(text));
        li.appendChild(deleteButton);

        return li;
    }

    function checkAllTodos() {
        const checkboxes = document.querySelectorAll('.completed-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = true;
            checkbox.parentElement.classList.add('completed');
        });
        saveTodos();
    }

    function deleteAllTodos() {
        todoList.innerHTML = '';
        saveTodos();
    }

    function saveTodos() {
        const todos = [];
        document.querySelectorAll('#todo-list li').forEach(li => {
            const text = li.childNodes[1].nodeValue;
            const completed = li.classList.contains('completed');
            todos.push({ text, completed });
        });
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    function loadTodos() {
        const todos = JSON.parse(localStorage.getItem('todos')) || [];
        todos.forEach(todo => {
            const li = createTodoElement(todo.text);
            if (todo.completed) {
                li.classList.add('completed');
                li.querySelector('.completed-checkbox').checked = true;
            }
            todoList.appendChild(li);
        });
    }
});
