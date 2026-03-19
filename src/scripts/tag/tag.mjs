import TaskList from "../task-list/task-list.mjs";
import "./tag.css";

class Tag {
  #element = null;
  #color = "";
  #title = "";

  static Colors = {
    Red: "red", Orange: "orange",
    Yellow: "yellow", Green: "green", 
    Blue: "blue", Purple: "purple", 
    Brown: "brown", DarkBlue: "blue", 
  }
  
  constructor(title) {
    this.#render();
    this.#pinListeners();
    this.setTitle(title);
  }

  setTitle(title) {
    this.#title = title;
    this.#element.textContent = title;
  }

  #offLastTag() {
    const lastTag = document.querySelector(".task-list__tag--active");
    if (lastTag) lastTag.className = "task-list__tag";
    this.#element.className = "task-list__tag task-list__tag--active";
  }

  #pinListeners() {
    this.#element.addEventListener("click", () => {
      this.#offLastTag();
      const tl = new TaskList();
      tl.listTasksWithTag(this.#title);
    })
  }

  #render() {
    this.#element = document.createElement("button");
    this.#element.className = "task-list__tag";
    document.querySelector(".tasks-list__tag-list").appendChild(this.#element);
  }
}

export default Tag;