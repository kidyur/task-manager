import Calendar from "./scripts/calendar.mjs";
import DateData from "./scripts/dateData.mjs";
import Schedule from "./scripts/schedule.mjs";
import Shift from "./scripts/shift.mjs";

window.onload = () => {
    DateData.initDatePicker();
    Calendar.init();
    Calendar.update();
    Schedule.setupScheduleManager();
}

