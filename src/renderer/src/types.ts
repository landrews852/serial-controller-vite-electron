export type ActionType = 'ArrowLeft' | 'ArrowRight' | 'ArrowUp' | 'ArrowDown' | 'Space' // | 'GoToJusto'

export interface SerialPortOptions {
  baudRate: number
  dataBits?: 5 | 6 | 7 | 8
  parity?: 'none' | 'even' | 'odd'
  stopBits?: 1 | 1.5 | 2
  xon?: boolean
  xoff?: boolean
  rtscts?: boolean
  autoOpen?: boolean
}

export interface Hotkey {
  key: string
  // action: number | 'GoToJusto'
  action: number
}

export interface OpenSerialPortParams {
  path: string
  options: SerialPortOptions
}

export interface SerialAPI {
  // focusWindow: () => void
  listSerialPorts: () => Promise<{
    success: boolean
    ports?: { path: string }[]
    error?: string
  }>
  openSerialPort: (data: OpenSerialPortParams) => Promise<{ success: boolean; error?: string }>
  closeSerialPort: () => Promise<{ success: boolean; error?: string }>
  onData: (callback: (data: string) => void) => void
  // offData: (listener: (data: string) => void) => void
  offData: (listener: (event: Electron.IpcRendererEvent, data: string) => void) => void
  onStatus: (callback: (status: string) => void) => void
  onConnect: (callback: () => void) => void
  onClose: (callback: () => void) => void
  onError: (callback: () => void) => void
  saveHotkeys: (
    hotkeys: Hotkey[]
  ) => Promise<{ success: boolean; message?: string; error?: string }>
  getHotkeys: () => Hotkey[]
}
