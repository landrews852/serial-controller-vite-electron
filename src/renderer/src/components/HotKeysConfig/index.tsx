import React, { useState, useEffect } from 'react'
import { Button } from '../ui/button'

interface Hotkey {
  key: string // tecla que se recibe
  action: string // acción a ejecutar
}

interface ActionMap {
  action: string
  display: string
}

interface HotkeysConfigProps {
  handleConfigOpen: () => void
}

const DEFAULT_HOTKEYS: Hotkey[] = [
  { key: 'o', action: 'ArrowLeft' },
  { key: 'p', action: 'ArrowRight' },
  { key: 'a', action: 'ArrowUp' },
  { key: 'b', action: 'ArrowDown' },
  { key: 'k', action: 'Space' }
]

const ACTIONS: ActionMap[] = [
  { action: 'ArrowLeft', display: '←' },
  { action: 'ArrowRight', display: '→' },
  { action: 'ArrowUp', display: '↑' },
  { action: 'ArrowDown', display: '↓' },
  { action: 'Space', display: 'Completar' }
]

export const HotkeysConfig: React.FC<HotkeysConfigProps> = ({ handleConfigOpen }) => {
  const [hotkeys, setHotkeys] = useState<Hotkey[]>(DEFAULT_HOTKEYS)
  // const [error, setError] = useState<string | null>(null)

  // Cargar desde localStorage si existe
  useEffect(() => {
    const saved = localStorage.getItem('hotkeys')
    if (saved) {
      setHotkeys(JSON.parse(saved))
    } else {
      setHotkeys(DEFAULT_HOTKEYS)
    }
  }, [])

  // Guardar en localStorage
  const handleSave = (): void => {
    localStorage.setItem('hotkeys', JSON.stringify(hotkeys))
    alert('Configuración guardada')
  }

  // Manejar cambios de teclas
  const handleKeyChange = (index: number, newKey: string): void => {
    const lastKey = newKey.slice(-1) // Tomar solo el último carácter ingresado

    // Validar si la tecla ya está en uso
    if (hotkeys.some((hotkey, idx) => hotkey.key === lastKey && idx !== index)) {
      alert(`La tecla "${lastKey === ' ' ? 'Space' : lastKey}" ya está asignada a otra acción.`)
      return
    }

    // setError(null) // Limpiar error si no hay conflictos
    const updated = [...hotkeys]
    updated[index].key = lastKey
    setHotkeys(updated)
  }

  return (
    <div className="p-4">
      <h2 className="font-bold text-xl mb-4">Configurar Hotkeys</h2>
      <div className="grid grid-cols-1 gap-1 place-items-center">
        {hotkeys.map((hotkey, idx) => {
          const foundAction = ACTIONS.find((a) => a.action === hotkey.action)

          return (
            <div key={hotkey.key} className="mb-2">
              <input
                className="border p-1 mr-2 font-bold text-black text-center"
                value={hotkey.key === ' ' ? 'Space' : hotkey.key}
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
        <Button color="transparent" onClick={() => setHotkeys(DEFAULT_HOTKEYS)}>
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
