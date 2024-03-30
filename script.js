document.addEventListener("DOMContentLoaded", function() {
    displayTasks();
});

function addItem() {
    const name = document.getElementById("item-name").value;
    const date = document.getElementById("item-date").value;
    const priority = document.getElementById("priority").value;

    const todoItem = { name, date, priority, completed: false };
    let todoList = localStorage.getItem("todoList");
    todoList = todoList ? JSON.parse(todoList) : [];
    todoList.push(todoItem);
    localStorage.setItem("todoList", JSON.stringify(todoList));

    displayTasks();
}

function deleteItem(index) {
    let todoList = JSON.parse(localStorage.getItem("todoList"));
    todoList.splice(index, 1);
    localStorage.setItem("todoList", JSON.stringify(todoList));

    displayTasks();
}

function toggleCompleted(index) {
    let todoList = JSON.parse(localStorage.getItem("todoList"));
    todoList[index].completed = !todoList[index].completed;
    localStorage.setItem("todoList", JSON.stringify(todoList));

    displayTasks();
}

function displayTasks() {
    const today = new Date();
    const options = { year: '2-digit', month: '2-digit', day: '2-digit' };
    const todayFormatted = today.toLocaleDateString('en-GB', options).replace(/\//g, '-');

    let todoList = localStorage.getItem("todoList");
    todoList = todoList ? JSON.parse(todoList) : [];

    const todayTasks = todoList.filter(task => task.date === todayFormatted && !task.completed);
    const futureTasks = todoList.filter(task => new Date(task.date) > today || (new Date(task.date) === today && task.completed));
    const completedTasks = todoList.filter(task => task.completed);

    const todayTasksList = document.getElementById("today-tasks-list");
    todayTasksList.innerHTML = "";
    todayTasks.forEach((task, index) => {
        const item = createTaskElement(task, index);
        todayTasksList.appendChild(item);
    });

    const futureTasksList = document.getElementById("future-tasks-list");
    futureTasksList.innerHTML = "";
    futureTasks.forEach((task, index) => {
        const item = createTaskElement(task, index);
        futureTasksList.appendChild(item);
    });

    const completedTasksList = document.getElementById("completed-tasks-list");
    completedTasksList.innerHTML = "";
    completedTasks.forEach((task, index) => {
        const item = createTaskElement(task, index);
        completedTasksList.appendChild(item);
    });
}

function createTaskElement(task, index) {
    const item = document.createElement("div");
    item.classList.add("task-item");

    // Item name
    const itemName = document.createElement("span");
    itemName.textContent = `${index + 1}. ${task.name}`;
    item.appendChild(itemName);

    // Deadline
    const deadline = document.createElement("span");
    deadline.classList.add("deadline");
    deadline.textContent = `Deadline: ${task.date}`;
    item.appendChild(deadline);

    // Priority
    const priority = document.createElement("span");
    priority.classList.add("priority");
    priority.textContent = `Priority: ${task.priority}`;
    item.appendChild(priority);

    // Buttons
    const buttons = document.createElement("div");
    buttons.classList.add("buttons");

    // Toggle completion icon
    const toggleIcon = document.createElement("i");
    toggleIcon.classList.add("fas", "fa-check");
    toggleIcon.addEventListener("click", () => toggleCompleted(index));
    buttons.appendChild(toggleIcon);

    // Delete icon
    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fas", "fa-trash-alt");
    deleteIcon.addEventListener("click", () => deleteItem(index)); // Changed from "deleteItem()" to "deleteItem(index)"
    buttons.appendChild(deleteIcon);

    item.appendChild(buttons);

    return item;
}
