import { useState, useEffect } from 'react'
import { Hotkey } from '../types'
import { electronAPI } from '../initEvents'

export default function useHotKeysConfig(): {
  hotkeys: Hotkey[]
  getHotkeys: () => Promise<void>
  saveHotkeys: (newHotkeys: Hotkey[]) => Promise<void>
} {
  const [hotkeys, setHotkeys] = useState<Hotkey[]>([])

  useEffect(() => {
    // Cargar al montar el hook (si así lo deseas)
    getHotkeys()
  }, [])

  const getHotkeys = async (): Promise<void> => {
    try {
      const res: Hotkey[] = await electronAPI.getHotkeys()
      console.log('Hotkeys loaded NO:', res)
      if (res?.length) {
        console.log('Hotkeys loaded:', res)

        setHotkeys(res)
      }
    } catch (err) {
      console.error('Error al cargar hotkeys:', err)
    }
  }

  const saveHotkeys = async (newHotkeys: Hotkey[]): Promise<void> => {
    try {
      const res = await electronAPI.saveHotkeys(newHotkeys)
      console.log('Hotkeys saved:', res.message)
      if (res?.success) {
        setHotkeys(newHotkeys)
      }
    } catch (err) {
      console.error('Error al guardar hotkeys:', err)
    }
  }

  return {
    hotkeys,
    getHotkeys,
    saveHotkeys
  }
}
