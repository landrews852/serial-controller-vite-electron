# PDV Serial Controller

PDV Serial Controller es una aplicación para controlar dispositivos seriales. Esta aplicación está construida con Electron, React y TypeScript, y utiliza TailwindCSS para el diseño.

## Características

- Conexión y control de dispositivos seriales.
- Configuración de hotkeys personalizadas.
- Interfaz de usuario moderna y responsiva.
- Soporte para múltiples plataformas (Windows, macOS, Linux).

## Requisitos

- Node.js
- npm o yarn

## Instalación

1. Clona el repositorio:

   ```sh
   git clone https://github.com/tu-usuario/pdv-serial-controller.git
   cd pdv-serial-controller
   ```

2. Instala las dependencias:
   ```sh
   yarn install
   ```

## Uso

### Desarrollo

Para iniciar la aplicación en modo desarrollo, ejecuta:

```sh
yarn dev
```

### Construcción

Para construir la aplicación para producción, ejecuta:

```sh
yarn build
```

Los archivos de salida se encontrarán en el directorio dist.

### Linting y Formateo

Para ejecutar ESLint y Prettier, usa:

```sh
yarn lint
yarn format
```

## Configuración

### Configuración de Hotkeys

Puedes configurar las hotkeys en la interfaz de usuario de la aplicación. Las configuraciones se guardan en un archivo hotkeys.json en el directorio de datos del usuario.

### Configuración de Puertos Seriales

La aplicación detecta automáticamente los puertos seriales disponibles. Puedes seleccionar y conectar el puerto deseado desde la interfaz de usuario.

### Estructura del Proyecto

- 📂 **src**: Código fuente de la aplicación.
  - 📄 **app/**: Código relacionado con el proceso principal de Electron.
  - 📄 **main/**: Código de inicialización del proceso principal.
  - 📄 **preload/**: Código de pre-carga para exponer APIs personalizadas al renderer.
  - 📄 **renderer/**: Código del proceso renderer (React).
- 📂 **build**: Archivos de configuración y recursos para la construcción.
- 📂 **resources**: Recursos estáticos como imágenes, íconos, etc.
