import './scripts/common/index.css';

import CalendarView from './scripts/calendar/calendar-view.mjs';
import CalendarModel from './scripts/calendar/calendar-model.mjs';
import TaskList from "/src/scripts/tasks/taskList.mjs";
import SchedulesTableModel from './scripts/schedules-table/schedules-table-model.mjs';
import ShiftEditor from "./scripts/shift-editor/shift-editor.mjs";
import Footer from './scripts/footer/footer.mjs';
import ScheduleEditor from './scripts/schedule-editor/schedule-editor.mjs';

window.addEventListener('beforeunload', () => {
    window.electronAPI.setSharedData({
        tasksData: TaskList.toJSON(),
        schedules: SchedulesTableModel.toJSON()
    });
})


document.addEventListener('DOMContentLoaded', async () => {
    const calendarView = new CalendarView();
    const calendarViewModel = new CalendarModel();
    const schedulesTableModel = new SchedulesTableModel();
    const shiftEditor = new ShiftEditor();
    const scheduleEditor = new ScheduleEditor();
    const footer = new Footer();


    schedulesTableModel.clear();
    schedulesTableModel.addSchedule("Учёба");
    schedulesTableModel.currentSchedule.addShift("1. Ботаем матан", "student");
    schedulesTableModel.currentSchedule.addShift("2. Полевой, C++", "");
    schedulesTableModel.currentSchedule.addShift("3. Чертим-чертим", "");




    schedulesTableModel.addSchedule("Работа");
    schedulesTableModel.currentSchedule.addShift("1. Утро", "sun");
    schedulesTableModel.currentSchedule.addShift("2. В ночь", "");
    schedulesTableModel.currentSchedule.addShift("3. Из ночи", "");
    schedulesTableModel.currentSchedule.addShift("3. Выходной", "");

    schedulesTableModel.addSchedule("Хобби");
    schedulesTableModel.currentSchedule.addShift("1. Играем на гитаре", "sun");
    schedulesTableModel.currentSchedule.addShift("2. Вышиваем крестиком", "");
    schedulesTableModel.currentSchedule.addShift("3. Поем в хоре", "");
    schedulesTableModel.currentSchedule.addShift("3. Играем на гармошке", "");

    schedulesTableModel.addSchedule("Спорт");
    schedulesTableModel.currentSchedule.addShift("1. Теннис", "sun");
    schedulesTableModel.currentSchedule.addShift("2. Отдых", "");
    schedulesTableModel.currentSchedule.addShift("3. Отдых", "");
    schedulesTableModel.currentSchedule.addShift("3. Отдых", "");

    schedulesTableModel.addSchedule("Персонал");
    schedulesTableModel.addSchedule("Завод");
    schedulesTableModel.addSchedule("Фазы луны");

    schedulesTableModel.addSchedule("Тренировка");
    schedulesTableModel.currentSchedule.addShift("1. День ног", "sun");
    schedulesTableModel.currentSchedule.addShift("2. Отдых", "");
    schedulesTableModel.currentSchedule.addShift("3. День рук", "");
    schedulesTableModel.currentSchedule.addShift("3. Отдых", "");

    shiftEditor.close();


    TaskList.start();

    const data = await window.electronAPI.getSharedData();
    schedulesTableModel.parseJSON(data.schedules);
    TaskList.parseJSON(data.tasksData);
});


document.addEventListener('keydown', (ev) => {
    if (ev.code == 'KeyZ') {
        console.log(TaskList.tasks);
        console.log(TaskList.dates);
        TaskList.toJSON();
    }
});
