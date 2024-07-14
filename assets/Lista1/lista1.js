let toDoList = [];

function renderToDoList() {
    const toDoListTable = document.querySelector(".toDo-list tbody");
    toDoListTable.innerHTML = '';
    toDoList.forEach((name, index) => {
        const row = document.createElement('tr');
        const taskCell = document.createElement('td');
        taskCell.textContent = name;
        row.appendChild(taskCell);
        const buttonCell = document.createElement('td');
        const doneButton = document.createElement('button');
        doneButton.textContent = '✔';
        doneButton.className = 'done-Button';
        if (localStorage.getItem(`doneButton${index}`) === 'true') {
            doneButton.style.backgroundColor = '#c6ff00';
        }
        buttonCell.appendChild(doneButton);
        row.appendChild(buttonCell);
        const actionsCell = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-toDo-button';
        deleteButton.textContent = 'X';
        deleteButton.setAttribute('data-index', index);
        actionsCell.appendChild(deleteButton);
        row.appendChild(actionsCell);
        toDoListTable.appendChild(row);
    });

    document.querySelectorAll(".delete-toDo-button").forEach(deleteButton => {
        deleteButton.addEventListener("click", (event) => {
            const index = event.target.getAttribute("data-index");
            toDoList.splice(index, 1);
            saveToDoListLocalStorage();
            renderToDoList();
        });
    });

    document.querySelectorAll(".done-Button").forEach((doneButton, index) => {
        doneButton.addEventListener("click", (event) => {
            const currentColor = window.getComputedStyle(event.target).backgroundColor;
            const activeColor = 'rgb(198, 255, 0)';
            if (currentColor === activeColor) {
                event.target.style.backgroundColor = "";
                localStorage.removeItem(`doneButton${index}`);
            } else {
                event.target.style.backgroundColor = "#c6ff00";
                localStorage.setItem(`doneButton${index}`, 'true');
            }
        });
    });
}

function saveToDoListLocalStorage() {
    localStorage.setItem("toDoList", JSON.stringify(toDoList));
}
function loadToDoListLocalStoragee() {
    const toDoListString = localStorage.getItem("toDoList");
    if (toDoListString) {
        toDoList = JSON.parse(toDoListString);
        renderToDoList();
    }
}
document.addEventListener("DOMContentLoaded", () => {
    loadToDoListLocalStoragee();
});
document.querySelector(".add-button").addEventListener("click", () => {
    const inputElement = document.querySelector(".name-input");
    const name = inputElement.value.trim();
    if (name !== '') {
        toDoList.push(name);
        saveToDoListLocalStorage();
        inputElement.value = '';
        renderToDoList();
    }
});