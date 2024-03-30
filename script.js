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
    const deletedTask = todoList.splice(index, 1)[0]; 
    let deletedTasks = localStorage.getItem("deletedTasks");
    deletedTasks = deletedTasks ? JSON.parse(deletedTasks) : [];
    deletedTasks.push(deletedTask);
    localStorage.setItem("todoList", JSON.stringify(todoList));
    localStorage.setItem("deletedTasks", JSON.stringify(deletedTasks));

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
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const todayFormatted = today.toLocaleDateString('en-GB', options); 
    let todoList = localStorage.getItem("todoList");
    todoList = todoList ? JSON.parse(todoList) : [];

    const todayTasks = todoList.filter(task => {
        const taskDateParts = task.date.split('-');
        const taskDate = new Date(taskDateParts[0], taskDateParts[1] - 1, taskDateParts[2]); 
        const todayWithoutTime = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        return taskDate.getTime() <= todayWithoutTime.getTime() && !task.completed;
    });
    

    const futureTasks = todoList.filter(task => {
        const taskDateParts = task.date.split('-');
        const taskDate = new Date(taskDateParts[0], taskDateParts[1] - 1, taskDateParts[2]); 
        return taskDate > today || (taskDate.toDateString() === today.toDateString() && task.completed);
    });

    const completedTasks = todoList.filter(task => task.completed);

    const todayTasksList = document.getElementById("today-tasks-list");
    todayTasksList.innerHTML = "";
    todayTasks.forEach((task, index) => {
        const item = createTaskElement(task, index);
        item.classList.add("past-due"); 
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

    const itemName = document.createElement("span");
    itemName.textContent = `${index + 1}. ${task.name}`;
    item.appendChild(itemName);

    const dateSpan = document.createElement("span");
    const dateParts = task.date.split('-');
    const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
    dateSpan.textContent = formattedDate;
    item.appendChild(dateSpan);

    const priority = document.createElement("span");
    priority.classList.add("priority");
    priority.textContent = `Priority: ${task.priority}`;
    item.appendChild(priority);

    const buttons = document.createElement("div");
    buttons.classList.add("buttons");

    const toggleIcon = document.createElement("i");
    toggleIcon.classList.add("fas", "fa-check");
    toggleIcon.addEventListener("click", () => toggleCompleted(index));
    buttons.appendChild(toggleIcon);

    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fas", "fa-trash-alt");
    deleteIcon.addEventListener("click", () => deleteItem(index)); 
    buttons.appendChild(deleteIcon);

    item.appendChild(buttons);

    return item;
}
