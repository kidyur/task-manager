import TaskEditor from "../../task-editor/task-editor.mjs";
import CalendarModel from "../calendar/calendar-model.mjs";
import "./task.css";

/**
 * изменять rawString
 * изменять дату отдельно
 * изменять теги отдельно
 */

class Task {
  #element = null;
  #date = {
    day: 0,
    month: 0,
    year: 0
  };
  #title = "";
  #tags = [];
  get tags() { return this.#tags; }
  get title() { return this.#title; }
  get date() { return this.#date; }

  constructor(rawString) {
    this.#render();
    this.#pinListeners();
    this.editTask(rawString);
  } 
 
  complete() {
    this.remove();
  }

  hide() {
    this.#element.style.display = "none";
  }

  show() {
    this.#element.style.display = "flex";
  }

  remove() {
    // TODO: it is not removed from the table[] list
    document.querySelector(".task-list__list").removeChild(this.#element);
  }

  #render() {
    this.#element = document.createElement("div");
    this.#element.className = "task";
    this.#element.innerHTML = `
      <p class="task__title"></p>
      <div class="task__footer">
        <p class="task__date"></p>
        <div class="task__tag-list"></div>
      </div>
    `;
    document.querySelector(".task-list__list").appendChild(this.#element);
  }

  #pinListeners() {
    this.#element.addEventListener("click", () => {
      const te = new TaskEditor();
      te.open(this);
    })
  }

  #setDate(day, month, year) {
    this.#date = {
      day: day, 
      month: month,
      year: year
    };
    this.#element.querySelector(".task__date").textContent = day + '.' + month;
  }

  #setTitle(title) {
    this.#title = title;
    this.#element.querySelector(".task__title").innerHTML = title;
  }

  editTask(rawString) {
    rawString = this.#parseTags(rawString);
    rawString = this.#parseDate(rawString);

    this.#setTitle(rawString);
  }

  #parseTags(rawStr) {
    this.#tags = [];
    const pattern = /(?<name>#[^ ]*)/g;
    const matches = rawStr.matchAll(pattern);
    for (const tag of matches) {
      rawStr = rawStr.replace(pattern, "");
      const tagEl = document.createElement("p");
      tagEl.className = "task__tag";
      tagEl.textContent = tag.groups.name;
      this.#element.querySelector(".task__tag-list").appendChild(tagEl);
      this.#tags.push(tag.groups.name);
    }
    return rawStr;
  }

  #parseDate(rawStr) {
    const patterns = [
      /(?<day>\d{2})[-\. ](?<month>\d{2})[-\. ](?<year>\d{4})/, // XX.XX.XXXX
      /(?<day>\d{2})[-\. ](?<month>\d{2})/,                    // XX.XX         
    ];

    for (const pat of patterns) {
      const match = rawStr.match(pat);
      if (match == null) continue;
      rawStr = rawStr.replace(pat, "");
      const cm = new CalendarModel();
      let [day, month, year] = [match.groups.day, match.groups.month, match.groups.year];
      if (!day) day = cm.day;
      if (!month) month = cm.month;
      if (!year) year = cm.year;
      this.#setDate(Number.parseInt(day), Number.parseInt(month), Number.parseInt(year));
      break;
    }

    return rawStr;
  }
}

export default Task;