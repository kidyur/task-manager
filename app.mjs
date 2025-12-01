import Calendar from "./scripts/calendar.mjs";
import DateData from "./scripts/dateData.mjs";
import Schedule from "./scripts/schedule.mjs";
import TaskList from "./scripts/tasks/taskList.mjs";
import { loadAllData } from "./scripts/utils/loadData.mjs";

window.onload = async () => {
    Calendar.init();
    DateData.initDatePicker();
    Calendar.update();
    Schedule.setupScheduleManager();
    TaskList.start();
    
    // Загружаем данные из файла настроек
    await loadAllData();
}

