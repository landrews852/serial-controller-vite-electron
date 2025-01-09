import { ipcMain } from 'electron'
import { SerialPort } from 'serialport'
import { mainWindow } from '../../main'

import { uIOhook, UiohookKey } from 'uiohook-napi'
import { SerialPortOptions } from '../../renderer/src/types'

export let currentPort: SerialPort

function sendKey(key: string) {
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

function openSerialPort(_event, params: { path: string; options: SerialPortOptions }) {
  const { path, options } = params
  try {
    if (currentPort?.isOpen) {
      currentPort.close()
    }
    console.log('asd')

    currentPort = new SerialPort({
      ...options,
      path,
      baudRate: 9600,
      dataBits: 8,
      parity: 'none',
      stopBits: 1,
      autoOpen: true
    })

    currentPort.on('open', () => {
      console.log('open')

      mainWindow?.webContents.send('onStatus', 'Conectado')
      mainWindow?.webContents.send('onConnect', null)
    })

    currentPort.on('data', (data: Buffer) => {
      const key = data.toString().trim()
      mainWindow?.webContents.send('onData', key)
      sendKey(key)
    })

    currentPort.on('error', (err: Error) => {
      console.log(err)

      mainWindow?.webContents.send('onStatus', `Error: ${err.message}`)
      mainWindow?.webContents.send('onError', null)
    })

    currentPort.on('close', () => {
      mainWindow?.webContents.send('onStatus', 'Puerto cerrado')
      mainWindow?.webContents.send('onClose', null)
    })

    setTimeout(() => {
      sendKey('o')
    }, 5000)

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }
  }
}

async function listSerialPorts() {
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

function closeSerialPort() {
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
