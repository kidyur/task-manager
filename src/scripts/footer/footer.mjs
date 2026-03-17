import "./footer.css";
import TaskList from "../task-list/task-list.mjs";
import SchedulesTable from "../schedules-table/schedules-table-model.mjs";
import CalendarView from "../calendar/calendar-view.mjs";


class Footer {
  #element = null;
  #openedPage = null;
  #btnPairs = [
    [new TaskList(), ".footer__tasks-btn"],
    [new CalendarView(), ".footer__calendar-btn"],
    [new SchedulesTable(), ".footer__schedule-btn"]
  ]

  static Pages = {
    CalendarPage: new CalendarView(),
    TasksPage: new TaskList(),
    SchedulesPage: new SchedulesTable()
  }

  constructor() {
    this.#render();
    this.#pinListeners();
    this.offAllPages();
  }

  openPage(page) {
    if (this.#openedPage) {
      this.#openedPage.close();
    }
    page.open();
    this.#openedPage = page;
  }

  offAllPages() {
    for (const [page, trash] of this.#btnPairs) {
      page.close();
    }
  }

  #render() {
    this.#element = document.createElement("div");
    this.#element.className = "footer";
    this.#element.innerHTML = `
      <button class="footer__btn footer__tasks-btn">
        <div class="footer__icon"></div>
        <p class="footer__btn-title">Задачи</p>
      </button>
      <button class="footer__btn footer__calendar-btn">
        <div class="footer__icon"></div>
        <p class="footer__btn-title">Календарь</p>
      </button>
      <button class="footer__btn footer__schedule-btn">
        <div class="footer__icon"></div>
        <p class="footer__btn-title">Расписания</p>
      </button>
    `;
    document.querySelector('body').appendChild(this.#element);
  }

  #pinListeners() {
    for (const [page, pageElClassName] of this.#btnPairs) {
      this.#element.querySelector(pageElClassName).addEventListener("click", () => {
        this.openPage(page);
      }) 
    }
  }
}

export default Footer;