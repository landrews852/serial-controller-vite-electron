import { app, shell, BrowserWindow, powerSaveBlocker } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { initIpc } from '../app/ipc'
import pngIcon from '../../resources/icon.png?asset'
import icoIcon from '../../resources/icon.ico?asset'
import icnsIcon from '../../resources/icon.icns?asset'

export let mainWindow: BrowserWindow | null = null

const platform = [
  { platform: 'darwin', icon: icnsIcon },
  { platform: 'win32', icon: icoIcon },
  { platform: 'linux', icon: pngIcon }
]

function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 550,
    height: 500,
    show: false,
    autoHideMenuBar: true,
    resizable: false,
    icon: platform.find((p) => p.platform === process.platform)?.icon,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Enable auto-start on Windows
  app.setLoginItemSettings({
    openAtLogin: true, // Habilitar inicio automático
    path: app.getPath('exe') // Ruta del ejecutable
  })

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  powerSaveBlocker.start('prevent-app-suspension')

  // IPC test
  initIpc()
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  // if (process.platform !== 'darwin') {
  //   app.quit()
  // }
})
