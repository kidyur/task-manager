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
    rawString = this.#parseTags(rawString);
    rawString = this.#parseDate(rawString);

    this.#setTitle(rawString);
  }

  #parseTags(rawStr) {
    const pattern = /(?<name>#[^ ]*)/g;
    const matches = rawStr.matchAll(pattern);
    for (const tag of matches) {
      rawStr = rawStr.replace(pattern, "");
      const tagEl = document.createElement("p");
      tagEl.className = "task__tag";
      tagEl.textContent = tag.groups.name;
      this.#element.querySelector(".task__tag-list").appendChild(tagEl);
    }
    return rawStr;
  }

  #parseDate(rawStr) {
    const patterns = [
      /(?<day>\d{2})[-\. ](?<month>\d{2})[-\. ](?<year>\d{2})/, // XX.XX.XX
      /(?<day>\d{2})[-\. ](?<month>\d{2})/,                    // XX.XX         
    ];

    for (const pat of patterns) {
      const match = rawStr.match(pat);
      if (match == null) continue;
      rawStr = rawStr.replace(pat, "");
      this.#setDate(match.groups.day, match.groups.month);
      break;
    }

    return rawStr;
  }
}

export default Task;