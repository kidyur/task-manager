import './scripts/common/index.css';

import CalendarView from './scripts/calendar/calendar-view.mjs';
import CalendarModel from './scripts/calendar/calendar-model.mjs';
import SchedulesTableModel from './scripts/schedules-table/schedules-table-model.mjs';
import ShiftEditor from "./scripts/shift-editor/shift-editor.mjs";
import Footer from './scripts/footer/footer.mjs';
import ScheduleEditor from './scripts/schedule-editor/schedule-editor.mjs';
import TaskList from './scripts/task-list/task-list.mjs';
import TaskEditor from './task-editor/task-editor.mjs';

window.addEventListener('beforeunload', () => {
    window.electronAPI.setSharedData({
        tasksData: TaskList.toJSON(),
        schedules: SchedulesTableModel.toJSON()
    });
})


document.addEventListener('DOMContentLoaded', async () => {
    const taskList = new TaskList();
    const calendarView = new CalendarView();
    const calendarViewModel = new CalendarModel();
    const schedulesTableModel = new SchedulesTableModel();
    const shiftEditor = new ShiftEditor();
    const scheduleEditor = new ScheduleEditor();
    const footer = new Footer();
    const taskEditor = new TaskEditor();

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

    taskList.addTask("Испробуй этих мягких французских булок")
    taskList.addTask("Испробуй булок 19-03-2026 #еда")
    taskList.addTask("Испробуй булок 15-02-22")
    taskList.addTask("Испробуй булок 15-02")
    taskList.addTask("Испробуй этих булок #еда");
    taskList.addTask("Испробуй этих булок #еда #вода");
    taskList.addTask("Испробуй этих булок #еда #вода #сон");


    footer.openPage(Footer.Pages.TasksPage);

    const data = await window.electronAPI.getSharedData();
    schedulesTableModel.parseJSON(data.schedules);
});
