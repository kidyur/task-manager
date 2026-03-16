import "./task-list.css";
import Task from "../task/task.mjs";

class TaskList {
  #element = null 
  #tasks = [];

  constructor() {
    this.#render();
  }

  addTask(rawString) {
    const task = new Task(rawString);
    this.#tasks.push(task);
  }

  #render() {
    this.#element = document.createElement("div");
    this.#element.className = "task-list";
    this.#element.innerHTML = `
      <h1 class="task-list__title">Задачи</h1>
      <div class="task-list__list"></div>
    `;
    document.querySelector("body").appendChild(this.#element);
  }
}

export default TaskList;