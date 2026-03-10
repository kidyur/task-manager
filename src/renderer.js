import './scripts/common/index.css';

import CalendarView from './scripts/calendar/calendar-view.mjs';
import CalendarModel from './scripts/calendar/calendar-model.mjs';
import TaskList from "/src/scripts/tasks/taskList.mjs";
import SchedulesTableModel from './scripts/schedules-table/schedules-table-model.mjs';
import ShiftEditor from "./scripts/shift-editor/shift-editor.mjs";
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

    schedulesTableModel.clear();
    schedulesTableModel.addSchedule("hoho");
    shiftEditor.open();

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
