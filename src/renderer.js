/**
 * This file will automatically be loaded by vite and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/process-model
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import './index.css';
import './styles/calendar_page.css';
import './styles/schedule_page.css';
import './styles/tasks_page.css';

import Calendar from "/src/scripts/calendar.mjs";
import DateData from "/src/scripts/dateData.mjs";
import Schedule from "/src/scripts/schedule.mjs";
import TaskList from "/src/scripts/tasks/taskList.mjs";
import SchedulesData from "/src/scripts/schedulesData.mjs";
import DatePicker from './scripts/datePicker.mjs';

window.addEventListener('beforeunload', () => {
    window.electronAPI.setSharedData({
        tasksData: TaskList.toJSON(),
        schedules: SchedulesData.toJSON()
    });
})


document.addEventListener('DOMContentLoaded', async () => {
    const calendar = new Calendar();
    const datePicker = new DatePicker();
    const dateData = new DateData();
    Schedule.setupScheduleManager();
    TaskList.start();

    const data = await window.electronAPI.getSharedData();
    SchedulesData.parseJSON(data.schedules);
    TaskList.parseJSON(data.tasksData);
});


document.addEventListener('keydown', (ev) => {
    if (ev.code == 'KeyZ') {
        console.log(TaskList.tasks);
        console.log(TaskList.dates);
        TaskList.toJSON();
    }
});
