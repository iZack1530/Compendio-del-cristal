# ¿Qué es el Compendio del Cristal?

Es una aplicación web que reúne a los personajes principales de los 16 juegos numerados de Final Fantasy, con una interfaz inspirada en los menús de Final Fantasy VII Remake y ligeramente en Final Fantasy XV. Consume la API pública [moogleAPI](https://moogleapi.com).

Es un proyecto fan desarrollado con asistencia de inteligencia artificial y sin fines de lucro. Final Fantasy es marca de Square Enix; los datos provienen de moogleAPI (basada en Final Fantasy Wiki).

## Funciones de la página
- Cambio de juego (botones L2/R2 en pantalla o teclas **Q** / **E**).
- Pestañas: *Principales* (selección curada), *Todos* y *Arte*.
- Música de fondo con botón de activar/desactivar y efecto de sonido al interactuar.
- Paleta de colores distinta y seleccionada específicamente para cada juego y logo del juego en la esquina inferior derecha.
- Búsqueda por nombre y navegación con las flechas direccionales ↑ ↓.
- Manejo de errores: sin conexión, tiempo agotado, respuesta vacía y límite de peticiones (429, con reintento).
- Caché en `sessionStorage` para ahorrar peticiones (límite: 60/min).

## Requisitos
Node.js 22.9 o superior. No hay dependencias que instalar.

## Ejecución
```bash
git clone https://github.com/iZack1530/compendio-del-cristal.git
cd compendio-del-cristal
npm run inicio
```
Después, abre http://localhost:3000 en el navegador.

moogleAPI no necesita clave. Si tienes una, copia `.env.example` a `.env` y escribe `MOOGLE_API_KEY=tu_clave`. El archivo `.env` está en `.gitignore`; la clave solo la usa `servidor.js` y nunca llega al navegador.

## Estructura
- `servidor.js`: sirve `publico/` y reenvía `/api/*` a moogleAPI (evita problemas de CORS y protege la clave).
- `publico/js/api.js`: peticiones, errores, reintentos, caché y normalización de datos.
- `publico/js/datos.js`: lista de juegos y personajes principales.
- `publico/js/app.js`: estado e interfaz.
- `publico/js/audio.js`: música de fondo y efecto de sonido.
- `publico/css/estilos.css`: estilo visual.
- `publico/audio/`, `publico/fuentes/` y `publico/logos/`: música y efecto de sonido, tipografía Highwind y logos de cada juego.

## Fuentes
Títulos: Highwind (fuente aportada por el autor; de uso completamente público, inspirada en la tipografía real del logo de la franquicia). Texto: Hind.

Logos de cada juego: aportados por el autor; ilustraciones realizadas en su totalidad por Yoshitaka Amano. Música de fondo: arreglo de uso libre del famoso Preludio, compuesto por Nobuo Uematsu. Efectos de sonido: provienen directamente de Final Fantasy XV. Todos son marcas y obras de Square Enix, todos los derechos reservados.

## Declaración de uso de IA
| Herramienta | Uso |
|---|---|
| Claude (Anthropic) | Generó el código base (servidor, módulo de API, interfaz y estilos), creó la estructura base de la documentación, sugerencias de diseño y la estructura de la bitácora. |

No se utilizó ninguna otra inteligencia artificial

Parte del proyecto realizada sin ayuda de IA: La idea base en crear una página dedicada en su totalidad a recopilar a los personajes más importantes de una de mis sagas favoritas, precisamente por eso me tomé la libertad de darle una interfaz muy única, inspirada directamente en las propias UIs de la franquicia, cada prueba de funcionamiento de la página, ajustes a ciertos personajes, imágenes, colores, tipografía y todo lo que llevó a la página a tomar su diseño actual, fue ideado por mí y desarrollado con Claude, la idea de los efectos de sonido y la música de fondo. Todos los cambios y errores fueron detectados durante mis correcciones (Y documentados en la bitácora) durante las pruebas realizadas a la página y también resueltos por Claude.

Bitácora completa: [`docs/BITACORA_IA.md`](docs/BITACORA_IA.md).
