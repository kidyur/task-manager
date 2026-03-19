import CalendarModel from "../calendar/calendar-model.mjs";
import CalendarView from "../calendar/calendar-view.mjs";
import "./day-panel.css";
import TaskList from "../task-list/task-list.mjs";

class DayPanel {
  #element = null;

  static #instance = null;

  constructor() {
    if (DayPanel.#instance) {
      return DayPanel.#instance;
    } else {
      DayPanel.#instance = this;
    }

    this.#render();
  }

  #render() {
    this.#element = document.createElement("div");
    this.#element.className = "day-panel";
    this.#element.innerHTML = `
      <p class="day-panel__date">12 Февраля 2024</p>
      <div class="day-panel__schedule-list">
        <div class="day-panel__schedule-icon"></div>
        <p class="day-panel__schedule-title">смена</p>
      </div>
      <div class="day-panel__tasks-list"></div>
    `;
    document.querySelector(".calendarView").appendChild(this.#element);
  }

  updateView() {
    const cm = new CalendarModel();
    const cv = new CalendarView();
    this.#element.querySelector(".day-panel__date").textContent = `${cm.day} ${cv.monthsNames[cm.month - 1]} ${cm.year}`;
    this.#element.querySelector(".day-panel__schedule-title").textContent = cv.getCurrentDay().shiftTitle;
    this.#showTasks();
  }

  #clearTasks() {
    this.#element.querySelector(".day-panel__tasks-list").innerHTML = "";
  }

  #showTasks() {
    const tl = new TaskList();
    const cm = new CalendarModel();
    this.#clearTasks();
    for (const task of tl.getTasksByDate(cm.day, cm.month, cm.year)) {
      const taskElem = document.createElement("div");
      taskElem.className = "day-panel__task";
      taskElem.innerHTML = `
        <button class="task__complete-btn"></button>
        <p class="task__title">${task.title}</p>
        <div class="task__tag-list"></div>
      `;
      for (const tag of task.tags) {
        const tagElem = document.createElement("div");
        tagElem.className = "task__tag";
        tagElem.textContent = tag;
        taskElem.querySelector('.task__tag-list').appendChild(tagElem);
      }
      this.#element.querySelector(".day-panel__tasks-list").appendChild(taskElem);
    }
  }
}

export default DayPanel;