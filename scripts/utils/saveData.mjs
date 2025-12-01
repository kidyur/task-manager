import SchedulesData from "../schedulesData.mjs";
import TaskList from "../tasks/taskList.mjs";
import { saveAllData } from "./userSettings.mjs";


export async function saveAppData() {
    try {
        const allSchedules = SchedulesData.getSchedules();
        
        const schedules = allSchedules.map(schedule => ({
            name: schedule.name || '',
            shifts: schedule.getShiftsCopy().map(shift => ({
                name: shift.name || '',
                iconURL: shift.iconURL || ''
            })),
            beginningDate: schedule.beginningDate ? schedule.beginningDate.toISOString() : null,
            beginningShiftIndex: schedule.beginningShift 
                ? schedule.getShiftsCopy().indexOf(schedule.beginningShift) 
                : -1
        }));

        const currentSchedule = SchedulesData.currentSchedule;
        const currentScheduleIndex = allSchedules.indexOf(currentSchedule);

        const tasks = TaskList.tasks
            .filter(task => {
                return task.taskDate && task.taskDate.date && 
                       task.taskDate.date.getFullYear() !== 1971;
            })
            .map(task => ({
                name: task.name || '',
                date: task.taskDate && task.taskDate.date ? new Date(task.taskDate.date).toISOString() : null,
                tags: task.tags || []
            }));

        const tags = TaskList.tags.map(tag => ({
            name: tag.name || ''
        }));
        
        await saveAllData({
            schedules: schedules,
            currentScheduleIndex: currentScheduleIndex,
            tasks: tasks,
            tags: tags
        });
    } catch (error) {
        console.error('Ошибка при сохранении данных:', error);
    }
}
