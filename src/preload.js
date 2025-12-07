const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getSharedData: () => ipcRenderer.invoke('get-shared-data'),
  setSharedData: (value) => ipcRenderer.send('set-shared-data', value)
});