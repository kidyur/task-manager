
import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import fs from "fs";

let sharedData = {
  tasksData: {
    tasks: [],
    tags: []
  },
  schedules: []
};

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

ipcMain.handle('get-shared-data', () => {
  return sharedData; // Возвращаем данные
});

ipcMain.on('set-shared-data', (event, value) => {
  sharedData = value; // Сохраняем новое значение
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  const dataPath = path.join(app.getPath('userData'), 'DATA.json');
  console.log(dataPath);
  loadData();
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

function loadData() {
  const dataPath = path.join(app.getPath('userData'), 'DATA.json');
  sharedData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  console.log(sharedData);
}

function saveData() {
  const dataPath = path.join(app.getPath('userData'), 'DATA.json');
  console.log("tasksData :: ", sharedData.tasksData);
  console.log("schedules :: ", sharedData.schedules);
  const data = JSON.stringify(sharedData, null, 2);
  fs.writeFileSync(dataPath, data);
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    saveData();
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
