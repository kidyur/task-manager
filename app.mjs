import Calendar from "./scripts/calendar.mjs";
import DateData from "./scripts/dateData.mjs";
import Schedule from "./scripts/schedule.mjs";
import Shift from "./scripts/shift.mjs";
import TaskList from "./scripts/tasks/taskList.mjs";

window.onload = () => {
    DateData.initDatePicker();
    Calendar.init();
    Calendar.update();
    Schedule.setupAddScheduleBtn();
    Shift.setupAddShiftBtn();
    TaskList.start();
}
