import "./task.css";

/**
 * изменять rawString
 * изменять дату отдельно
 * изменять теги отдельно
 */

class Task {
  #element = null;
  #date = null;

  constructor(rawString) {
    this.#render();
    this.#parseRawString(rawString);
  } 
 
  complete() {
    this.remove();
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

  #setDate(day, month, year) {
    this.#date = new Date(day, month);
    this.#element.querySelector(".task__date").textContent = day + '.' + month;
  }

  #setTitle(title) {
    this.#element.querySelector(".task__title").innerHTML = title;
  }

  #parseRawString(rawString) {
    this.#setTitle(rawString);

    this.#parseTags(rawString);
    this.#parseDate(rawString);
  }

  #parseTags(rawStr) {
    const matches = rawStr.matchAll(/(?<name>#[^ ]*)/g);
    for (const tag of matches) {
      const tagEl = document.createElement("p");
      tagEl.className = "task__tag";
      tagEl.textContent = tag.groups.name;
      this.#element.querySelector(".task__tag-list").appendChild(tagEl);
    }
  }

  #parseDate(rawStr) {
    const patterns = [
      /(?<day>\d{2})[-\. ](?<month>\d{2})[-\. ](?<year>\d{2})/, // XX.XX.XX
      /(?<day>\d{2})[-\. ](?<month>\d{2})/,                    // XX.XX         
    ];

    for (const pat of patterns) {
      const match = rawStr.match(pat);
      if (match == null) continue;
      this.#setDate(match.groups.day, match.groups.month);
      break;
    }
  }
}

export default Task;