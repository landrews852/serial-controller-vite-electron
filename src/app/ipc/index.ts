import { app, ipcMain } from 'electron'
import { SerialPort } from 'serialport'
import { mainWindow } from '../../main'
import fs from 'fs'
import path from 'path'
import { uIOhook } from 'uiohook-napi'
import { SerialPortOptions } from '../../renderer/src/types'
import { HotkeysConfig, Key } from '../../types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let winControl: { getWindows?: () => any[] } = {}

if (process.platform === 'win32') {
  // Carga win-control solamente en Windows
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  winControl = require('win-control')
}

export let currentPort: SerialPort
export let hotkeysConfig: HotkeysConfig = []

async function focusWindow(
  _event,
  primaryTitle: string,
  fallbackTitle: string
): Promise<{ success: boolean; message?: string; error?: string }> {
  // Si no está en Windows, retornamos un error
  if (!winControl) {
    return { success: false, message: 'No se está ejecutando en Windows' }
  }

  try {
    const { getWindows } = winControl
    if (!getWindows) {
      return { success: false, message: 'getWindows is undefined' }
    }
    const allWindows = getWindows()
    let targetWindow = allWindows.find((w) =>
      w.getTitle()?.toLowerCase().includes(primaryTitle.toLowerCase())
    )
    if (!targetWindow) {
      targetWindow = allWindows.find((w) =>
        w.getTitle()?.toLowerCase().includes(fallbackTitle.toLowerCase())
      )
    }
    if (targetWindow) {
      targetWindow.bringToTop()
      return { success: true }
    }
    return {
      success: false,
      message: `No se encontró ventana con título: ${primaryTitle} ni ${fallbackTitle}`
    }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

function getHotkeys(): HotkeysConfig {
  try {
    const userData = app.getPath('userData')
    const raw = fs.readFileSync(path.join(userData, 'hotkeys.json'), 'utf-8')
    const hotkeys = JSON.parse(raw)
    hotkeysConfig = hotkeys

    return hotkeys
  } catch {
    return DEFAULT_HOTKEYS
  }
}

async function saveHotkeys(
  _event,
  hotkeys: HotkeysConfig
): Promise<{ success: boolean; message?: string; error?: string }> {
  const userData = app.getPath('userData')
  const filePath = path.join(userData, 'hotkeys.json')
  try {
    fs.writeFileSync(filePath, JSON.stringify(hotkeys, null, 2))

    return { success: true, message: filePath }
  } catch (error) {
    return {
      success: false,
      message: filePath,
      error: error instanceof Error ? error.message : String(error)
    }
  }
}

function sendKey(key: string): void {
  const found = hotkeysConfig.find((val) => val.key === key)
  if (!found) return

  if (found.action === Key.GoToJusto) {
    focusWindow(null, 'JustoHub', 'Google Chrome')
    return
  }

  uIOhook.keyTap(found.action)
}

function openSerialPort(
  _event,
  params: { path: string; options: SerialPortOptions }
): { success: boolean; error?: string } {
  const { path, options } = params
  try {
    if (currentPort?.isOpen) {
      currentPort.close()
    }

    currentPort = new SerialPort({
      ...options,
      path,
      baudRate: 9600,
      dataBits: 8,
      parity: 'none',
      stopBits: 1,
      xon: true,
      xoff: true,
      rtscts: true,
      autoOpen: true
    })

    currentPort.on('open', () => {
      mainWindow?.webContents.send('onStatus', 'Conectado')
      mainWindow?.webContents.send('onConnect', null)
    })

    currentPort.on('data', (data: Buffer) => {
      const key = data.toString().trim()
      mainWindow?.webContents.send('onData', key)
      sendKey(key)
    })

    currentPort.on('error', (err: Error) => {
      mainWindow?.webContents.send('onStatus', `Error: ${err.message}`)
      mainWindow?.webContents.send('onError', null)
    })

    currentPort.on('close', () => {
      mainWindow?.webContents.send('onStatus', 'Puerto cerrado')
      mainWindow?.webContents.send('onClose', null)
    })

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }
  }
}

async function listSerialPorts(): Promise<{
  success: boolean
  ports?: { path: string; manufacturer?: string }[]
  error?: string
}> {
  try {
    const ports = await SerialPort.list()
    return { success: true, ports }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }
  }
}

function closeSerialPort(): { success: boolean; error?: string } {
  try {
    if (currentPort?.isOpen) {
      currentPort.close()
      currentPort
      return { success: true }
    }
    return { success: false, error: 'No hay puerto abierto.' }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }
  }
}

export function initIpc(): void {
  ipcMain.handle('focusWindow', focusWindow)
  ipcMain.handle('listSerialPorts', listSerialPorts)
  ipcMain.handle('openSerialPort', openSerialPort)
  ipcMain.handle('closeSerialPort', closeSerialPort)
  ipcMain.handle('saveHotkeys', saveHotkeys)
  ipcMain.handle('getHotkeys', getHotkeys)
}

const DEFAULT_HOTKEYS: HotkeysConfig = [
  { key: 'o', action: Key.ArrowLeft },
  { key: 'p', action: Key.ArrowRight },
  { key: 'a', action: Key.ArrowUp },
  { key: 'b', action: Key.ArrowDown },
  { key: 'k', action: Key.Space },
  { key: 'h', action: Key.GoToJusto }
]
