import "./task-list.css";

class TaskList {
  #element = null 
 
  constructor() {
    this.#render();
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