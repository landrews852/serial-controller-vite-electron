import { ElectronAPI } from '@electron-toolkit/preload'
import { SerialAPI } from '@renderer/types'

declare global {
  interface Window {
    electron: ElectronAPI
    api: unknown
    serialAPI: SerialAPI
  }
}
