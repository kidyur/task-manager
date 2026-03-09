import './index.css';
import './styles/tasks_page.css';

import Calendar from "/src/scripts/calendar.mjs";
import DateData from "/src/scripts/dateData.mjs";
import TaskList from "/src/scripts/tasks/taskList.mjs";
import SchedulesData from "/src/scripts/schedulesData.mjs";
import Editor from './scripts/editor.mjs';

window.addEventListener('beforeunload', () => {
    window.electronAPI.setSharedData({
        tasksData: TaskList.toJSON(),
        schedules: SchedulesData.toJSON()
    });
})


document.addEventListener('DOMContentLoaded', async () => {
    const calendar = new Calendar();
    const dateData = new DateData();
    const schedulesData = new SchedulesData();
    const editor = new Editor();

    schedulesData.clear();
    schedulesData.addSchedule("temp");
    schedulesData.currentSchedule.addShift("1", "student");
    schedulesData.currentSchedule.addShift("2", '');
    schedulesData.currentSchedule.addShift("3", '');

    editor.hide();

    TaskList.start();

    const data = await window.electronAPI.getSharedData();
    schedulesData.parseJSON(data.schedules);
    TaskList.parseJSON(data.tasksData);
});


document.addEventListener('keydown', (ev) => {
    if (ev.code == 'KeyZ') {
        console.log(TaskList.tasks);
        console.log(TaskList.dates);
        TaskList.toJSON();
    }
});
