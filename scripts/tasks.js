const taskContainer = document.getElementById("tasks-page__task-list");
const addTaskButton = document.getElementById("tasks-page__add-task-button");
const taskNameInput = document.getElementById("tasks-page__task-name-input");

console.log(taskNameInput)

addTaskButton.addEventListener('click', createNewTask);


function createNewTask() {    
    let task = document.createElement('div');   
    task.className = 'tasks-page__task';
    task.innerHTML = `
        <div class="tasks-page__task-name"></div>
        <button class="tasks-page__complete-task-btn"></button>
    `; 

    taskContainer.appendChild(task);
    task.getElementsByClassName('tasks-page__complete-task-btn')[0].addEventListener('click', () => deleteTask(task));
    task.getElementsByClassName('tasks-page__task-name')[0].textContent = taskNameInput.value;
    taskNameInput.value = '';
}

function deleteTask(task) {
    task.remove();
}