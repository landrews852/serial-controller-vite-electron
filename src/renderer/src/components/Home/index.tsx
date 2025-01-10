import { useState, useEffect } from 'react'
import useSerialPort from '../../hooks/useSerialPort'
import logo from '../../assets/logo.svg'
// import { HotkeysConfig } from '../HotKeysConfig'
import { Button } from '../ui/button'

export default function HomeSerialController(): JSX.Element {
  const [port, setPort] = useState<string>('')
  const { ports, loadPorts, openPort, connected, status, disconnect } = useSerialPort()
  // const [configOpen, setConfigOpen] = useState(false)

  // const handleConfigOpen = (): void => {
  //   setConfigOpen(!configOpen)
  // }

  useEffect(() => {
    loadPorts()
  }, [])

  if (connected) {
    return (
      <div className="p-6 max-w-lg mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-white">Conectado correctamente...</h2>

        <button
          type="button"
          className="bg-blue-500 hover:bg-blue-700 text-slate-900 font-bold py-2 px-4 rounded"
          onClick={async () => {
            disconnect()
          }}
        >
          Desconectar
        </button>
      </div>
    )
  }

  if (!ports?.length) {
    return (
      <div className="p-6 max-w-lg mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-black">
          No se han encontrado puertos seriales
        </h2>
      </div>
    )
  }

  return (
    <div className="p-4 min-w-screen flex-1">
      <img width={100} className="flex-1 ml-auto" src={logo} alt="logo" />
      {/* {!configOpen ? ( */}
      <div className="p-6 min-w-screen flex-1">
        <div className="">
          <h2 className="text-2xl font-bold mb-1">Serial Port Controller</h2>
          <p className="mb-4 italic opacity-80">Por defecto se asigna el puerto 1</p>
        </div>
        {/* <button onClick={() => window.serialAPI.openHotkeys()}>Configurar Hotkeys</button> */}
        <div className="mb-4 space-y-2">
          <select
            value={port}
            onChange={(e) => setPort(e.target.value)}
            className="w-full p-2 border rounded-lg text-black"
          >
            <option value={ports?.[0].path}>Seleccione un puerto</option>
            {ports.map((port) => (
              <option key={port.path} value={port.path}>
                {port.path}
              </option>
            ))}
          </select>
          <div className="text-md pb-2 font-semibold">{status}</div>

          <div className="flex flex-1 w-full justify-between">
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

            {/* <Button
              onClick={() => {
                setConfigOpen(!configOpen)
              }}
            >
              Configuracion
            </Button> */}
          </div>
        </div>
      </div>
      {/* ) : (
        <HotkeysConfig handleConfigOpen={handleConfigOpen} />
      )} */}
    </div>
  )
}
