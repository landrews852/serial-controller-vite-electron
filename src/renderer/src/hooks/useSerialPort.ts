import { useState } from 'react'
import { electronAPI } from '../initEvents'
import useHotKeys from './useHotKeys'
import type { SerialPortOptions } from '../../src/types'
import { useOnEvent } from 'react-app-events'

export default function useSerialPort() {
  const sendHotKey = useHotKeys()
  const [ports, setPorts] = useState<{ path: string }[]>([])
  const [status, setStatus] = useState<string>('')
  const [connected, setConnected] = useState<boolean>()

  useOnEvent('onConnect', () => {
    console.log('connected')

    setConnected(true)
  })

  useOnEvent('onClose', () => {
    setConnected(false)
  })

  useOnEvent('onStatus', (text: string) => {
    setStatus(text)
  })

  useOnEvent('onData', (key: string) => {
    sendHotKey(key)
  })

  useOnEvent('onError', () => {
    setConnected(false)
  })

  const openPort = async (params: {
    path: string
    options?: SerialPortOptions
    onData?: (key: string) => void
    onConnect?: () => void
    onError?: () => void
  }) => {
    const { path, options } = params

    if (!path) {
      await electronAPI?.closeSerialPort()
      return
    }

    electronAPI.openSerialPort({
      path,
      options: options as SerialPortOptions
    })
  }

  const loadPorts = async () => {
    const response = await electronAPI?.listSerialPorts()
    setPorts(response?.success && response?.ports ? response.ports : [])
  }

  const disconnect = () => {
    electronAPI.closeSerialPort()
  }

  return {
    status,
    ports,
    connected,
    openPort,
    loadPorts,
    disconnect
  }
}
