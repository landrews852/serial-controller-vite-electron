import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}
const serialAPI = {
  // Serial port API
  listSerialPorts: (): Promise<string[]> => ipcRenderer.invoke('listSerialPorts'),
  openSerialPort: (params): Promise<void> => ipcRenderer.invoke('openSerialPort', params),
  closeSerialPort: (): Promise<void> => ipcRenderer.invoke('closeSerialPort'),

  // Serial port events
  onData: (
    callback: (data: string) => void
  ): ((_event: Electron.IpcRendererEvent, data: string) => void) => {
    const listener = (_event: Electron.IpcRendererEvent, data: string): void => callback(data)
    ipcRenderer.on('onData', listener)
    return listener
  },
  offData: (listener: (event: Electron.IpcRendererEvent, data: string) => void): void => {
    ipcRenderer.removeListener('onData', listener)
  },
  onStatus: (callback): void => {
    ipcRenderer.on('onStatus', (_event, status) => callback(status))
  },
  onConnect: (callback): void => {
    ipcRenderer.on('onConnect', () => callback())
  },
  onClose: (callback): void => {
    ipcRenderer.on('onClose', () => callback())
  },
  onError: (callback): void => {
    ipcRenderer.on('onError', () => callback())
  },

  // Hotkeys API
  saveHotkeys: (hotkeys): Promise<void> => ipcRenderer.invoke('saveHotkeys', hotkeys),
  getHotkeys: (): Promise<void> => ipcRenderer.invoke('getHotkeys')
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
contextBridge.exposeInMainWorld('serialAPI', serialAPI)

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api

  // window.serialAPI = serialAPI
}
