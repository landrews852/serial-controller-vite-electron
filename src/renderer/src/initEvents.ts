import { fireEvent } from 'react-app-events'
import { SerialAPI } from './types'

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const electronAPI = (window as any).serialAPI as SerialAPI

electronAPI.onData((data: string) => {
  fireEvent('onData', data)
})

electronAPI.onStatus((data) => {
  console.log('onstatus', data)
  fireEvent('onStatus', data)
})

electronAPI.onConnect(() => {
  console.log('connected')

  fireEvent('onConnect', null)
})

electronAPI.onClose(() => {
  fireEvent('onClose', null)
})

electronAPI.onError(() => {
  fireEvent('onError', null)
})
