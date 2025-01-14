import { useEffect, useState } from 'react'
import { DEFAULT_HOTKEYS } from '../constants'
import type { Hotkey } from '../types'
import { Action } from '../constants'

export default function useHotKeys() {
  const [hotkeys, setHotkeys] = useState<Hotkey[]>(DEFAULT_HOTKEYS)

  useEffect(() => {
    window.addEventListener('keydown', (e) => {
      const key = e.key.toLowerCase()
      if (key === 'f1') {
        setHotkeys(DEFAULT_HOTKEYS)
      }
    })
  })

  const getActionFunction = (action: Action): (() => void) => {
    switch (action) {
      case Action.ArrowLeft:
        return () => {
          window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }))
        }
      case Action.ArrowRight:
        return () => {
          window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
        }
      case Action.ArrowUp:
        return () => {
          for (let i = 0; i < 8; i++) {
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }))
          }
        }
      case Action.ArrowDown:
        return () => {
          for (let i = 0; i < 8; i++) {
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }))
          }
        }
      case Action.Space:
        return () => {
          window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }))
        }
      default:
        return () => {}
    }
  }

  const keysMap: { [key: string]: () => void } = hotkeys.reduce(
    (map, { key, action }) => {
      map[key] = getActionFunction(action)
      return map
    },
    {} as { [key: string]: () => void }
  )

  return (key: string): void => {
    const func = keysMap[key]
    if (!func) return
    func()
  }
}
