import { useState, useEffect } from 'react'
import useSerialPort from '../../hooks/useSerialPort'
import { HotkeysConfig } from '../HotKeysConfig'
import { Button } from '../ui/button'
import useHotKeysConfig from '../../hooks/useHotkeysConfig'

export default function HomeSerialController(): JSX.Element {
  const { ports, loadPorts, openPort, connected, status, disconnect } = useSerialPort()
  const [port, setPort] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [configOpen, setConfigOpen] = useState(false)
  const [shouldAutoConnect, setShouldAutoConnect] = useState(true)
  const { getHotkeys } = useHotKeysConfig()

  const handleConfigOpen = (): void => {
    setConfigOpen(!configOpen)
  }

  const handleOpenPort = async (): Promise<void> => {
    if (!port) {
      setError('No se ha seleccionado ningún puerto')
      return
    }
    try {
      await openPort({
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
    } catch (error) {
      console.error('Error al conectar el puerto:', error)
      setError('Error al conectar el puerto')
    }
  }

  const handleLoadPorts = async (): Promise<void> => {
    try {
      setError(null)
      setLoading(true)
      await loadPorts()
      if (ports.length === 0) {
        setError('No se encontraron puertos seriales')
      }
    } catch (error) {
      console.error('Error al cargar los puertos:', error)
      setError('Error al cargar los puertos')
    } finally {
      setLoading(false)
    }
  }

  const fetchHotkeys = async (): Promise<void> => {
    await getHotkeys()
  }

  useEffect(() => {
    fetchHotkeys()
    handleLoadPorts()
  }, [])

  // useEffect para seleccionar el primer puerto disponible cuando los puertos cambian
  useEffect(() => {
    const selectFirstPort = (): void => {
      if (ports.length > 0 && shouldAutoConnect) {
        const firstPort = ports[0].path
        setPort(firstPort)
      }
    }
    selectFirstPort()
  }, [ports, shouldAutoConnect])

  // useEffect para abrir el puerto seleccionado cuando 'port' cambia
  useEffect(() => {
    const openSelectedPort = async (): Promise<void> => {
      if (port && !connected && shouldAutoConnect) {
        await handleOpenPort()
      }
    }
    openSelectedPort()
  }, [port, connected, shouldAutoConnect])

  const handleDisconnect = async (): Promise<void> => {
    await disconnect()
    setShouldAutoConnect(false) // Deshabilita la auto-conexión después de desconectar
  }

  if (connected) {
    return (
      <div className="p-4 w-screen flex-1">
        {!configOpen ? (
          <>
            <h2 className="text-center text-2xl font-bold my-10 pb-4 text-white">
              Conectado correctamente...
            </h2>
            <div className="flex flex-col space-y-4">
              <Button color="secondary" onClick={handleConfigOpen}>
                Configuración
              </Button>

              <Button onClick={handleDisconnect}>Desconectar</Button>
            </div>
          </>
        ) : (
          <HotkeysConfig handleConfigOpen={handleConfigOpen} />
        )}
      </div>
    )
  }

  if (!ports.length) {
    return (
      <div className="p-6 max-w-lg mx-auto">
        <h2 className="text-2xl font-bold mb-4">No se han encontrado puertos seriales</h2>
        {error && <p className="text-md pb-2 font-semibold text-red-500">{error}</p>}
        <div className="flex justify-end">
          <Button onClick={handleLoadPorts} disabled={loading}>
            {loading ? 'Cargando...' : 'Cargar puertos'}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 w-screen flex-1">
      <div>
        <h2 className="text-2xl font-bold mb-1 text-white">Serial Port Controller</h2>
        <p className="mb-4 italic text-white opacity-80">
          Selecciona el puerto donde se conectó el teclado
        </p>
      </div>
      <div className="mb-4 space-y-2">
        <select
          value={port}
          onChange={(e) => setPort(e.target.value)}
          className="w-full p-2 border rounded-lg text-black"
        >
          <option value="" disabled>
            Seleccione un puerto
          </option>
          {ports.map((port) => (
            <option key={port.path} value={port.path}>
              {port.path}
            </option>
          ))}
        </select>
        <div className="text-md pb-2 font-semibold">{status}</div>

        <div className="flex flex-col w-full pt-4 space-y-2">
          {port ? (
            <Button onClick={handleOpenPort} disabled={connected}>
              Conectar
            </Button>
          ) : (
            <Button onClick={handleLoadPorts} disabled={loading}>
              {loading ? 'Cargando...' : 'Cargar puertos'}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
