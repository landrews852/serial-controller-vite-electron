import { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { ACTIONS, BUMPBAR_KEYS, DEFAULT_HOTKEYS } from '../../constants'
import { Hotkey } from '../../types'
import useHotKeysConfig from '../../hooks/useHotkeysConfig'

export const HotkeysConfig = ({
  handleConfigOpen
}: {
  handleConfigOpen: () => void
}): JSX.Element => {
  const { hotkeys, saveHotkeys, getHotkeys } = useHotKeysConfig()
  const [newHotkeys, setNewHotkeys] = useState<Hotkey[]>(DEFAULT_HOTKEYS)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const fetchHotkeys = async (): Promise<void> => {
    await getHotkeys()
  }

  useEffect(() => {
    fetchHotkeys()
  }, [])

  useEffect(() => {
    setNewHotkeys(hotkeys)
  }, [hotkeys])

  useEffect(() => {
    const listener = window.serialAPI.onData((key: string) => {
      if (activeIndex !== null) {
        setNewHotkeys((prev) => {
          const updated = [...prev]
          updated[activeIndex].key = key === ' ' ? ' ' : key
          return updated
        })
      }
    })

    return (): void => {
      window.serialAPI.offData(
        listener as unknown as (event: Electron.IpcRendererEvent, data: string) => void
      )
    }
  }, [activeIndex])

  const handleSave = async (): Promise<void> => {
    await saveHotkeys(newHotkeys)
    await fetchHotkeys()

    handleConfigOpen()
  }

  // onChange SOLO aplica cuando se escribe con teclado normal
  const handleKeyChange = (index: number, newKey: string): void => {
    const lastKey = newKey.slice(-1)
    setNewHotkeys((prev) => {
      const updated = [...prev]
      updated[index].key = lastKey === ' ' ? ' ' : lastKey
      return updated
    })
  }

  return (
    <div className="p-4">
      <h2 className="font-bold text-xl mb-4">Configurar Hotkeys</h2>
      <div className="flex flex-col">
        {newHotkeys?.map((hotkey, idx) => {
          const foundAction = ACTIONS.find((a) => a.action === hotkey.action)

          return (
            <div key={`hotkey-${idx}`} className="grid grid-cols-2 gap-2 mb-2">
              <input
                className="border p-1 font-bold text-center text-black"
                value={
                  hotkey.key === ' '
                    ? 'Space'
                    : BUMPBAR_KEYS.find((bumpbarKey) => bumpbarKey.value === hotkey.key)
                      ?.bumpbarName || hotkey.key
                }
                onFocus={() => setActiveIndex(idx)}
                onChange={(e) => handleKeyChange(idx, e.target.value)}
              />
              <input
                disabled
                className="border p-1 font-bold text-center text-white bg-white/15"
                value={foundAction?.display ?? 'N/A'}
              />
            </div>
          )
        })}
      </div>
      <div className="grid grid-cols-2 gap-2 mt-6">
        <Button onClick={handleSave}>Guardar</Button>
        <Button color="transparent" onClick={async () => setNewHotkeys(DEFAULT_HOTKEYS)}>
          Restaurar por defecto
        </Button>
      </div>
      <div className="flex flex-col mt-4">
        <Button color="secondary" onClick={() => handleConfigOpen()}>
          Volver
        </Button>
      </div>
    </div>
  )
}

declare global {
  interface Window {
    serialAPI: {
      onData: (cb: (data: string) => void) => void
      offData: (listener: (event: Electron.IpcRendererEvent, data: string) => void) => void
    }
  }
}
