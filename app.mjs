import Calendar from "./scripts/calendar.mjs";
import DateData from "./scripts/dateData.mjs";
import Schedule from "./scripts/schedule.mjs";
import TaskList from "./scripts/tasks/taskList.mjs";

window.onload = () => {
    Calendar.init();
    DateData.initDatePicker();
    Calendar.update();
    Schedule.setupScheduleManager();
    TaskList.start();
}

