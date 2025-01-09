export type ActionType = 'ArrowLeft' | 'ArrowRight' | 'ArrowUp5Times' | 'ArrowDown5Times' | 'Space'

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
  action: ActionType
}

export interface OpenSerialPortParams {
  path: string
  options: SerialPortOptions
}

export interface SerialAPI {
  listSerialPorts: () => Promise<{
    success: boolean
    ports?: { path: string }[]
    error?: string
  }>
  openSerialPort: (data: OpenSerialPortParams) => Promise<{ success: boolean; error?: string }>
  closeSerialPort: () => Promise<{ success: boolean; error?: string }>
  onData: (callback: (data: string) => void) => void
  onStatus: (callback: (status: string) => void) => void
  onConnect: (callback: () => void) => void
  onClose: (callback: () => void) => void
  onError: (callback: () => void) => void
}
