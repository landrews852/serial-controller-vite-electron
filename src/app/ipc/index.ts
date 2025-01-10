import { ipcMain } from 'electron'
import { SerialPort } from 'serialport'
import { mainWindow } from '../../main'

import { uIOhook, UiohookKey } from 'uiohook-napi'
import { SerialPortOptions } from '../../renderer/src/types'

export let currentPort: SerialPort

function sendKey(key: string): void {
  const keys = [
    { key: 'o', command: UiohookKey.ArrowLeft },
    { key: 'p', command: UiohookKey.ArrowRight },
    { key: 'a', command: UiohookKey.PageUp },
    { key: 'b', command: UiohookKey.PageDown },
    { key: 'k', command: UiohookKey.Space }
  ]

  const keyData = keys.find((val) => key === val.key)
  if (!keyData) return

  uIOhook.keyTap(keyData.command as number)
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
  ipcMain.handle('listSerialPorts', listSerialPorts)
  ipcMain.handle('openSerialPort', openSerialPort)
  ipcMain.handle('closeSerialPort', closeSerialPort)
}
