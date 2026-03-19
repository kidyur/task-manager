import "./task-list.css";
import Task from "../task/task.mjs";
import CalendarModel from "../calendar/calendar-model.mjs";
import CalendarView from "../calendar/calendar-view.mjs";
import TaskEditor from "../../task-editor/task-editor.mjs";

class TaskList {
  #element = null 
  #tasks = [];
  #tags = new Map();

  static #instance = null;

  constructor() {
    if (TaskList.#instance) {
      return TaskList.#instance;
    } else {
      TaskList.#instance = this;
    }

    this.#render();
    this.#pinListeners();
  }

  addTask(rawString) {
    const task = new Task(rawString);
    this.#tasks.push(task);

    for (const tag of task.tags) {
      if (this.#tags.get(tag) == undefined) {
        this.#tags.set(tag, 1);
        this.#createTag(tag);
      } else {
        this.#tags[tag] += 1;
      }
    }

    this.#notifyObservers();
  }

  close() {
      this.#element.style.display = "none";
  }

  open() {
      this.#element.style.display = "flex";
  }

  getTasksByDate(day, month, year) {
    const tasks = [];
    for (const task of this.#tasks) {
      if (task.date.day == day && task.date.month == month && task.date.year == year) {
        tasks.push(task);
      }
    } 
    return tasks;
  }

  listTasksWithTag(tag) {
    for (const task of this.#tasks) {
      task.hide();
      for (const taskTag of task.tags) {
        if (tag == taskTag) {
          task.show();
          break;
        }
      }
    }
  }

  listTasksWithNoTag() {
    for (const task of this.#tasks) {
      if (task.tags.length == 0) task.show();
      else task.hide();
    }
  }

  #createTag(name) {
    const tagElem = document.createElement("button");
    tagElem.textContent = name;
    tagElem.addEventListener("click", () => {
      this.listTasksWithTag(name);
    })
    tagElem.className = "task-list__tag";
    this.#element.querySelector(".tasks-list__tag-list").appendChild(tagElem);
  }

  #render() {
    this.#element = document.createElement("div");
    this.#element.className = "task-list";
    this.#element.innerHTML = `
      <h1 class="task-list__title">Задачи</h1>
      <div class="tasks-list__tag-list"></div>
      <div class="task-list__list"></div>
      <button class="task-list__add-btn schedules-table__add-btn ">+</button>
    `;
    document.querySelector("body").appendChild(this.#element);
  }

  #pinListeners() {
    this.#element.querySelector(".task-list__add-btn").addEventListener("click", () => {
      const te = new TaskEditor();
      te.open();
    })
  }

  #notifyObservers() {
    const cv = new CalendarView();
    cv.updateView();
  }
}

export default TaskList;