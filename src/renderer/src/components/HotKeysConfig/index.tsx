import React, { useState, useEffect } from 'react'

interface Hotkey {
  key: string // tecla que se recibe
  action: string // acción a ejecutar
}

const DEFAULT_HOTKEYS: Hotkey[] = [
  { key: 'o', action: 'ArrowLeft' },
  { key: 'p', action: 'ArrowRight' },
  { key: 'a', action: 'ArrowUp5Times' },
  { key: 'b', action: 'ArrowDown5Times' },
  { key: 'k', action: 'Space' }
]

export const HotkeysConfig: React.FC<{ handleConfigOpen: () => void }> = ({ handleConfigOpen }) => {
  const [hotkeys, setHotkeys] = useState<Hotkey[]>(DEFAULT_HOTKEYS)

  // Cargar desde localStorage si existe
  useEffect(() => {
    const saved = localStorage.getItem('hotkeys')
    if (saved) {
      setHotkeys(JSON.parse(saved))
    }
  }, [])

  // Guardar en localStorage
  const handleSave = (): void => {
    localStorage.setItem('hotkeys', JSON.stringify(hotkeys))
    alert('Configuración guardada')
  }

  // Manejar cambios de teclas
  const handleKeyChange = (index: number, newKey: string): void => {
    const updated = [...hotkeys]
    updated[index].key = newKey
    setHotkeys(updated)
  }

  // Manejar cambios de acción
  const handleActionChange = (index: number, newAction: string): void => {
    const updated = [...hotkeys]
    updated[index].action = newAction
    setHotkeys(updated)
  }

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">Configurar Hotkeys</h2>
      {hotkeys.map((hotkey, idx) => (
        <div key={hotkey.key} className="mb-2">
          <input
            className="border p-1 mr-2"
            value={hotkey.key}
            onChange={(e) => handleKeyChange(idx, e.target.value)}
          />
          <select
            className="border p-1"
            value={hotkey.action}
            onChange={(e) => handleActionChange(idx, e.target.value)}
          >
            <option value="ArrowLeft">←</option>
            <option value="ArrowRight">→</option>
            <option value="ArrowUp5Times">↑ x5</option>
            <option value="ArrowDown5Times">↓ x5</option>
            <option value="Space">Espacio</option>
          </select>
        </div>
      ))}
      <button type="button" className="border p-2 mt-2" onClick={handleSave}>
        Guardar
      </button>
      <button onClick={() => handleConfigOpen()}>Volver</button>
    </div>
  )
}
