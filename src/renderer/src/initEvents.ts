import { fireEvent } from 'react-app-events'
import { SerialAPI } from './types'

export const electronAPI = (window as unknown as { serialAPI: SerialAPI }).serialAPI

electronAPI.onData((data: string) => {
  fireEvent('onData', data)
})

electronAPI.offData((data) => {
  fireEvent('offData', data)
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
