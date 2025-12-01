const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;

let SETTINGS_FILE_PATH = 'userSettings.json';

if (isNode) {
    (async () => {
        const { fileURLToPath } = await import('url');
        const { dirname, join } = await import('path');
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);
        SETTINGS_FILE_PATH = join(__dirname, '..', '..', 'userSettings.json');
    })();
}

async function getFsModules() {
    if (!isNode) return null;
    const fs = await import('fs/promises');
    const fsSync = await import('fs');
    return { fs, existsSync: fsSync.existsSync };
}

function serializeSchedule(schedule) {
    if (!schedule || schedule.constructor?.name !== 'Schedule') {
        return null;
    }
    
    const shifts = schedule.getShiftsCopy ? schedule.getShiftsCopy() : [];
    const serializedShifts = shifts.map(shift => ({
        name: shift.name || '',
        iconURL: shift.iconURL || ''
    }));
    
    return {
        name: schedule.name || '',
        shifts: serializedShifts,
        beginningDate: schedule.beginningDate ? schedule.beginningDate.toISOString() : null,
        beginningShiftIndex: schedule.beginningShift ? shifts.indexOf(schedule.beginningShift) : -1
    };
}

function serializeTask(task) {
    if (!task || task.constructor?.name !== 'Task') {
        return null;
    }
    
    return {
        name: task.name || '',
        date: task.date ? new Date(task.date).toISOString() : null,
        tags: task.tags || []
    };
}

function serializeTag(tag) {
    if (!tag || tag.constructor?.name !== 'Tag') {
        return null;
    }
    
    return {
        name: tag.name || ''
    };
}

 
export async function createUserSettingsFile(data = {}) {
    try {
        const schedules = (data.schedules || []).map(serializeSchedule).filter(s => s !== null);
        const tasks = (data.tasks || []).map(serializeTask).filter(t => t !== null);
        const tags = (data.tags || []).map(serializeTag).filter(t => t !== null);
        
        const settingsData = {
            version: '1.0.0',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            schedules: schedules,
            currentScheduleIndex: data.currentScheduleIndex !== undefined ? data.currentScheduleIndex : -1,
            tasks: tasks,
            tags: tags
        };

        const jsonString = JSON.stringify(settingsData, null, 2);
        
        if (isNode) {
            const { fs } = await getFsModules();
            // Получаем актуальный путь
            const { fileURLToPath } = await import('url');
            const { dirname, join } = await import('path');
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = dirname(__filename);
            const filePath = join(__dirname, '..', '..', 'userSettings.json');
            await fs.writeFile(filePath, jsonString, 'utf-8');
            console.log(`Файл настроек создан: ${filePath}`);
            return filePath;
        } else {
            localStorage.setItem('userSettings', jsonString);
            console.log('Настройки сохранены в localStorage');
            return 'localStorage';
        }
    } catch (error) {
        console.error('Ошибка при создании файла настроек:', error);
        throw error;
    }
}

export async function getUserSettings() {
    try {
        let fileContent = null;
        
        if (isNode) {
            const { fs, existsSync } = await getFsModules();
            const { fileURLToPath } = await import('url');
            const { dirname, join } = await import('path');
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = dirname(__filename);
            const filePath = join(__dirname, '..', '..', 'userSettings.json');
            
            if (!existsSync(filePath)) {
                return null;
            }
            fileContent = await fs.readFile(filePath, 'utf-8');
        } else {
            fileContent = localStorage.getItem('userSettings');
            if (!fileContent) {
                return null;
            }
        }

        return JSON.parse(fileContent);
    } catch (error) {
        console.error('Ошибка при чтении файла настроек:', error);
        throw error;
    }
}

export async function updateUserSettings(data) {
    try {
        let existingSettings = null;

        if (isNode) {
            const { fs, existsSync } = await getFsModules();
            const { fileURLToPath } = await import('url');
            const { dirname, join } = await import('path');
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = dirname(__filename);
            const filePath = join(__dirname, '..', '..', 'userSettings.json');
            
            if (existsSync(filePath)) {
                const fileContent = await fs.readFile(filePath, 'utf-8');
                existingSettings = JSON.parse(fileContent);
            }
        } else {
            const stored = localStorage.getItem('userSettings');
            if (stored) {
                existingSettings = JSON.parse(stored);
            }
        }

        let schedules = existingSettings?.schedules || [];
        let tasks = existingSettings?.tasks || [];
        let tags = existingSettings?.tags || [];
        
        if (data.schedules !== undefined) {
            schedules = Array.isArray(data.schedules) && data.schedules.length > 0 && data.schedules[0]?.constructor?.name === 'Schedule'
                ? data.schedules.map(serializeSchedule).filter(s => s !== null)
                : data.schedules;
        }
        
        if (data.tasks !== undefined) {
            tasks = Array.isArray(data.tasks) && data.tasks.length > 0 && data.tasks[0]?.constructor?.name === 'Task'
                ? data.tasks.map(serializeTask).filter(t => t !== null)
                : data.tasks;
        }
        
        if (data.tags !== undefined) {
            tags = Array.isArray(data.tags) && data.tags.length > 0 && data.tags[0]?.constructor?.name === 'Tag'
                ? data.tags.map(serializeTag).filter(t => t !== null)
                : data.tags;
        }

        const updatedSettings = {
            version: existingSettings?.version || '1.0.0',
            createdAt: existingSettings?.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            schedules: schedules,
            currentScheduleIndex: data.currentScheduleIndex !== undefined ? data.currentScheduleIndex : (existingSettings?.currentScheduleIndex ?? -1),
            tasks: tasks,
            tags: tags
        };

        const jsonString = JSON.stringify(updatedSettings, null, 2);
        
        if (isNode) {
            const { fs } = await getFsModules();
            const { fileURLToPath } = await import('url');
            const { dirname, join } = await import('path');
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = dirname(__filename);
            const filePath = join(__dirname, '..', '..', 'userSettings.json');
            await fs.writeFile(filePath, jsonString, 'utf-8');
            console.log(`Файл настроек обновлен: ${filePath}`);
            return filePath;
        } else {
            localStorage.setItem('userSettings', jsonString);
            console.log('Настройки обновлены в localStorage');
            return 'localStorage';
        }
    } catch (error) {
        console.error('Ошибка при обновлении файла настроек:', error);
        throw error;
    }
}

export async function settingsFileExists() {
    if (isNode) {
        const { existsSync } = await getFsModules();
        const { fileURLToPath } = await import('url');
        const { dirname, join } = await import('path');
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);
        const filePath = join(__dirname, '..', '..', 'userSettings.json');
        return existsSync(filePath);
    } else {
        return localStorage.getItem('userSettings') !== null;
    }
}

export async function saveAllData(appData) {
    const schedules = appData.schedules || [];
    const currentScheduleIndex = appData.currentScheduleIndex !== undefined 
        ? appData.currentScheduleIndex 
        : (appData.currentSchedule ? schedules.indexOf(appData.currentSchedule) : -1);
    const tasks = appData.tasks || [];
    const tags = appData.tags || [];
    
    return await updateUserSettings({
        schedules: schedules,
        currentScheduleIndex: currentScheduleIndex,
        tasks: tasks,
        tags: tags
    });
}
