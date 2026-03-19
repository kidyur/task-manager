import TaskList from "../scripts/task-list/task-list.mjs";
import Task from "../scripts/task/task.mjs";
import "./task-editor.css";

class TaskEditor {
  #element = null;
  #task = null;

  static #instance = null;

  constructor() {
    if (TaskEditor.#instance) {
      return TaskEditor.#instance;
    } else {
      TaskEditor.#instance = this;
    }

    this.#render();
    this.#pinListeners();
  }

  open(task = null) {
    if (task instanceof Task) {
      this.#task = task;
      this.#element.querySelector(".task-editor__title").textContent = "Измените задачу";
      this.#element.querySelector(".task-editor__input").value = task.title;
      this.#element.querySelector(".task-editor__submit-btn").textContent = "Изменить";
    } 
    else {
      this.#element.querySelector(".task-editor__title").textContent = "Создайте задачу";
      this.#element.querySelector(".task-editor__submit-btn").textContent = "Создать";
    }
    this.#element.style.display = "flex";
  }
  
  close() {
    this.#element.style.display = "none";
    this.#element.querySelector(".task-editor__input").value = "";
  }

  #submit() {
    const userInput = this.#element.querySelector(".task-editor__input").value;
    if (userInput == "") return;
    
    if (this.#task) {
      this.#task.editTask(userInput);
    } 
    else {
      const tl = new TaskList();
      tl.addTask(userInput);
    }
    this.close();  
  }

  #pinListeners() {
    this.#element.querySelector(".task-editor__close-btn").addEventListener("click", () => this.close());
    this.#element.querySelector(".task-editor__submit-btn").addEventListener("click", () => this.#submit());
  }

  #render() {
    this.#element = document.createElement("div");
    this.#element.className = "task-editor-outer";
    this.#element.innerHTML = `
      <div class="task-editor">
        <button class="task-editor__close-btn">Закрыть</button>
        <h2 class="task-editor__title">Создайте задачу</h2>
        <input class="task-editor__input" placeholder="Введите задачу" />
        <button class="task-editor__submit-btn">Создать</button>
      </div>
    `;
    document.querySelector('body').appendChild(this.#element);
  }
}

export default TaskEditor;