import { useState, useEffect } from 'react'
import useSerialPort from '../../hooks/useSerialPort'
import { HotkeysConfig } from '../HotKeysConfig'
import { Button } from '../ui/button'

export default function HomeSerialController(): JSX.Element {
  const { ports, loadPorts, openPort, connected, status, disconnect } = useSerialPort()
  const [port, setPort] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [configOpen, setConfigOpen] = useState(false)

  const handleConfigOpen = (): void => {
    setConfigOpen(!configOpen)
  }

  const handleLoadPorts = async (): Promise<void> => {
    try {
      setError(null)
      setLoading(true)
      await new Promise<void>((resolve) =>
        setTimeout(() => {
          resolve()
        }, 500)
      )
      await loadPorts()
      await loadPorts()
      if (ports.length === 0) {
        setError('Error al cargar los puertos')
      }
    } catch (error) {
      setError('Error al cargar los puertos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPorts()
  }, [])

  useEffect(() => {
    ports?.length && setPort(ports[0].path)
  }, [ports])

  if (connected) {
    return (
      <div className="p-4 w-screen flex-1">
        <h2 className="text-center text-2xl font-bold my-10 pb-4 text-white">
          Conectado correctamente...
        </h2>
        <div className="flex justify-end">
          <Button
            onClick={async () => {
              disconnect()
            }}
          >
            Desconectar
          </Button>
        </div>
      </div>
    )
  }

  if (!ports?.length) {
    return (
      <div className="p-6 max-w-lg mx-auto">
        <h2 className="text-2xl font-bold mb-4">No se han encontrado puertos seriales</h2>
        <p className="text-md pb-2 font-semibold">{error}</p>
        <div className="flex justify-end">
          <Button
            onClick={async () => {
              handleLoadPorts()
            }}
          >
            {loading ? 'Cargando...' : 'Cargar puertos'}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 w-screen flex-1">
      {!configOpen ? (
        <>
          <div className="">
            <h2 className="text-2xl font-bold mb-1">Serial Port Controller</h2>
            <p className="mb-4 italic opacity-80">
              Selecciona el puerto donde se conectó el teclado
            </p>
          </div>
          {/* <button onClick={() => window.serialAPI.openHotkeys()}>Configurar Hotkeys</button> */}
          <div className="mb-4 space-y-2">
            <select
              value={port}
              onChange={(e) => setPort(e.target.value)}
              className="w-full p-2 border rounded-lg text-black"
            >
              <option disabled>Seleccione un puerto</option>
              {ports.map((port) => (
                <option key={port.path} value={port.path}>
                  {port.path}
                </option>
              ))}
            </select>
            <div className="text-md pb-2 font-semibold">{status}</div>

            <div className="flex flex-1 w-full justify-between">
              <Button
                color="secondary"
                onClick={() => {
                  setConfigOpen(!configOpen)
                }}
              >
                Configuración
              </Button>
              {port ? (
                <Button
                  onClick={() => {
                    openPort({
                      path: port,
                      options: {
                        baudRate: 9600,
                        dataBits: 8,
                        parity: 'none',
                        stopBits: 1,
                        xon: true,
                        xoff: true,
                        rtscts: true,
                        autoOpen: true
                      }
                    })
                  }}
                >
                  Conectar
                </Button>
              ) : (
                <Button
                  onClick={async () => {
                    loadPorts()
                  }}
                >
                  Cargar puertos
                </Button>
              )}
            </div>
          </div>
        </>
      ) : (
        <HotkeysConfig handleConfigOpen={handleConfigOpen} />
      )}
    </div>
  )
}
