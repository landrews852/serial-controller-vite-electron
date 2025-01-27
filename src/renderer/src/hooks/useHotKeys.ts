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

  // const getActionFunction = (action: Action | 'GoToJusto'): (() => void) => {
  const getActionFunction = (action: Action): (() => void) => {
    switch (action) {
      case Action.ArrowLeft:
        return () => dispatchKeyEvents('ArrowLeft')

      case Action.ArrowRight:
        return () => dispatchKeyEvents('ArrowRight')

      case Action.ArrowUp:
        return () => dispatchKeyEvents('ArrowUp', 5)

      case Action.ArrowDown:
        return () => dispatchKeyEvents('ArrowDown', 5)

      case Action.Space:
        return () => dispatchKeyEvents(' ')

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

function dispatchKeyEvents(key: string, count?: number): void {
  const event = new KeyboardEvent('keydown', { key: key })

  if (!count) window.dispatchEvent(event)

  new Array(count).fill(0).forEach(() => {
    window.dispatchEvent(event)
  })
}
