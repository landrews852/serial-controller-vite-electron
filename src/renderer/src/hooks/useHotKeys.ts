import type { ActionType } from '../types'

export default function useHotKeys() {
  const keys: { key: string; action: ActionType }[] = [
    { key: 'o', action: 'ArrowLeft' },
    { key: 'p', action: 'ArrowRight' },
    { key: 'a', action: 'ArrowUp5Times' },
    { key: 'b', action: 'ArrowDown5Times' },
    { key: 'k', action: 'Space' }
  ]

  // 2. Transforma las acciones a funciones reales
  const getActionFunction = (action: ActionType): (() => void) => {
    switch (action) {
      case 'ArrowLeft':
        return () => {
          window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }))
        }
      case 'ArrowRight':
        return () => {
          window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
        }
      case 'ArrowUp5Times':
        return () => {
          for (let i = 0; i < 5; i++) {
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }))
          }
        }
      case 'ArrowDown5Times':
        return () => {
          for (let i = 0; i < 5; i++) {
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }))
          }
        }
      case 'Space':
        return () => {
          window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }))
        }
      default:
        return () => {}
    }
  }

  const keysMap: { [key: string]: () => void } = keys.reduce(
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
