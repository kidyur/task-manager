import Calendar from "./scripts/calendar.mjs";
import DateData from "./scripts/dateData.mjs";
import Schedule from "./scripts/schedule.mjs";

window.onload = () => {
    Calendar.init();
    DateData.initDatePicker();
    Calendar.update();
    Schedule.setupScheduleManager();
}

