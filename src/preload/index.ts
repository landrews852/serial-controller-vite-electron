import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
// Custom APIs for renderer
const api = {}
const serialAPI = {
  listSerialPorts: () => ipcRenderer.invoke('listSerialPorts'),
  openSerialPort: (params) => ipcRenderer.invoke('openSerialPort', params),
  closeSerialPort: () => ipcRenderer.invoke('closeSerialPort'),

  onData: (callback: (data: any) => void) =>
    ipcRenderer.on('onData', (_event, data) => callback(data)),
  onStatus: (callback) => ipcRenderer.on('onStatus', (_event, status) => callback(status)),
  onConnect: (callback) => ipcRenderer.on('onConnect', () => callback()),
  onClose: (callback) => ipcRenderer.on('onClose', () => callback()),
  onError: (callback) => ipcRenderer.on('onError', () => callback())
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('serialAPI', serialAPI)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api

  window.serialAPI = serialAPI
}
// preload.js
