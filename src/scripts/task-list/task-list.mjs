import "./task-list.css";
import Task from "../task/task.mjs";
import CalendarModel from "../calendar/calendar-model.mjs";
import CalendarView from "../calendar/calendar-view.mjs";
import TaskEditor from "../../task-editor/task-editor.mjs";
import Tag from "../tag/tag.mjs";

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

    for (const tagTitle of task.tags) {
      if (this.#tags.get(tagTitle) == undefined) {
        // TODO: remove tags with cnt = 0
        this.#tags.set(tagTitle, 1);
        // Add it somewhere to spy on it
        const tag = new Tag(tagTitle);
      } else {
        this.#tags[tagTitle] += 1;
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

  #render() {
    this.#element = document.createElement("div");
    this.#element.className = "task-list";
    this.#element.innerHTML = `
      <h1 class="task-list__title">Задачи</h1>
      <div class="tasks-list__tag-list">
        <button class="task-list__tag task-list__show-untagged-btn">Без тега</button>
      </div>
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
    
    const showUntaggedBtn = this.#element.querySelector(".task-list__show-untagged-btn");
    showUntaggedBtn.addEventListener("click", () => {
      this.listTasksWithNoTag();
      const lastTag = this.#element.querySelector(".task-list__tag--active");
      if (lastTag) lastTag.className = "task-list__tag";
      showUntaggedBtn.classList.add("task-list__tag--active");
    })
  }

  #notifyObservers() {
    const cv = new CalendarView();
    cv.updateView();
  }
}

export default TaskList;