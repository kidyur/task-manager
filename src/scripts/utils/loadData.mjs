import SchedulesData from "../schedulesData.mjs";
import Schedule from "../schedule.mjs";
import Shift from "../shift.mjs";
import TaskList from "../tasks/taskList.mjs";
import Task from "../tasks/task.mjs";
import Tag from "../tasks/tag.mjs";
import { getUserSettings } from "./userSettings.mjs";


export async function loadAllData() {
    try {
        const settings = await getUserSettings();
        
        if (!settings) {
            console.log('Файл настроек не найден, используем данные по умолчанию');
            return;
        }

        if (settings.schedules && Array.isArray(settings.schedules)) {
            SchedulesData.reload();
            
            for (const scheduleData of settings.schedules) {
                const schedule = new Schedule();
                schedule.name = scheduleData.name || '';
                
                if (scheduleData.shifts && Array.isArray(scheduleData.shifts)) {
                    for (const shiftData of scheduleData.shifts) {
                        const shift = new Shift();
                        shift.name = shiftData.name || '';
                        if (shiftData.iconURL) {
                            shift.iconURL = shiftData.iconURL;
                        }
                        schedule.addShift(shift);
                    }
                }
                
                if (scheduleData.beginningDate) {
                    const beginningDate = new Date(scheduleData.beginningDate);
                    schedule.setBeginning(
                        scheduleData.beginningShiftIndex >= 0 && schedule.getShiftsCopy()[scheduleData.beginningShiftIndex]
                            ? schedule.getShiftsCopy()[scheduleData.beginningShiftIndex]
                            : (schedule.getShiftsCopy()[0] || null)
                    );
                }
                
                SchedulesData.addSchedule(schedule);
            }
            
            if (settings.currentScheduleIndex >= 0 && 
                settings.currentScheduleIndex < settings.schedules.length) {
                const schedules = SchedulesData.getSchedules();
                if (schedules[settings.currentScheduleIndex]) {
                    schedules[settings.currentScheduleIndex].select();
                }
            } else if (SchedulesData.getSchedulesLength() > 0) {
                SchedulesData.getSchedules()[0].select();
            }
        }

        if (settings.tags && Array.isArray(settings.tags) && settings.tags.length > 0) {
            const existingTags = TaskList.tags.filter(t => t.name);
            existingTags.forEach(tag => {
                if (tag.el && tag.el.parentNode) {
                    tag.el.parentNode.removeChild(tag.el);
                }
            });
            TaskList.tags = TaskList.tags.filter(t => !t.name);
            
            for (const tagData of settings.tags) {
                if (tagData.name) {
                    new Tag().init(tagData.name);
                }
            }
        }

        if (settings.tasks && Array.isArray(settings.tasks)) {
            const existingTasks = TaskList.tasks.filter(t => 
                t.taskDate && t.taskDate.date && t.taskDate.date.getFullYear() !== 1971
            );
            existingTasks.forEach(task => {
                if (task.el && task.el.parentNode) {
                    task.el.parentNode.removeChild(task.el);
                }
                if (task.taskDate && task.taskDate.tasks) {
                    const idx = task.taskDate.tasks.indexOf(task);
                    if (idx >= 0) {
                        task.taskDate.tasks.splice(idx, 1);
                    }
                    task.taskDate.update();
                }
            });
            TaskList.tasks = TaskList.tasks.filter(t => 
                t.taskDate && t.taskDate.date && t.taskDate.date.getFullYear() === 1971
            );
            
            for (const taskData of settings.tasks) {
                if (taskData.name && taskData.date) {
                    const taskDate = new Date(taskData.date);
                    if (taskData.tags && Array.isArray(taskData.tags)) {
                        TaskList.deselectAllTags();
                        for (const tagName of taskData.tags) {
                            const tag = TaskList.tags.find(t => t.name === tagName);
                            if (tag) {
                                tag.setSelected(true);
                            }
                        }
                    }
                    new Task().init(taskData.name, taskDate);
                }
            }
            
            TaskList.deselectAllTags();
        }

        console.log('Данные успешно загружены из файла настроек');
    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
    }
}
