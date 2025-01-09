import { fireEvent } from 'react-app-events'
import { SerialAPI } from './types'

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const electronAPI = (window as any).serialAPI as SerialAPI

electronAPI.onData((data: string) => {
  fireEvent('onData', data)
})

electronAPI.onStatus((data) => {
  fireEvent('onStatus', data)
})

electronAPI.onConnect(() => {
  fireEvent('onConnect', null)
})

electronAPI.onClose(() => {
  fireEvent('onClose', null)
})

electronAPI.onError(() => {
  fireEvent('onError', null)
})
