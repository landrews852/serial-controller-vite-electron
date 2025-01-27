import { app, ipcMain } from 'electron'
import { SerialPort } from 'serialport'
import { mainWindow } from '../../main'
import fs from 'fs'
import path from 'path'
import { uIOhook } from 'uiohook-napi'
import { Hotkey, SerialPortOptions } from '../../renderer/src/types'
import { Action, DEFAULT_HOTKEYS } from '../../renderer/src/constants'

export let currentPort: SerialPort
export let hotkeysArr: Hotkey[] = []

function getHotkeys(): Hotkey[] {
  try {
    const userData = app.getPath('userData')
    const raw = fs.readFileSync(path.join(userData, 'hotkeys.json'), 'utf-8')
    const hotkeys = JSON.parse(raw)

    if (!Array.isArray(hotkeys)) {
      return DEFAULT_HOTKEYS
    }

    hotkeysArr = DEFAULT_HOTKEYS.map((hotkey) => {
      const item = hotkeys.find((val) => val.key !== hotkey.key && val.action === hotkey.action)
      return !item ? hotkey : item
    })

    return hotkeysArr
  } catch {
    return DEFAULT_HOTKEYS
  }
}

async function saveHotkeys(
  _event,
  hotkeys: Hotkey[]
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
  const found = hotkeysArr.find((val) => val.key === key)
  if (!found) return

  uIOhook.keyTap(found.action as Action)
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
  // ipcMain.handle('focusWindow', focusWindow)
  ipcMain.handle('listSerialPorts', listSerialPorts)
  ipcMain.handle('openSerialPort', openSerialPort)
  ipcMain.handle('closeSerialPort', closeSerialPort)
  ipcMain.handle('saveHotkeys', saveHotkeys)
  ipcMain.handle('getHotkeys', getHotkeys)
}
