const PREFIJO_CACHE = 'compendio:';
const VIGENCIA_MS = 30 * 60 * 1000;
const TAMANO_PAGINA = 100;
const MAX_PAGINAS = 8;

export class ErrorApi extends Error {
  constructor(tipo, mensaje) {
    super(mensaje);
    this.tipo = tipo;
  }
}

const dormir = (ms) => new Promise((resolver) => setTimeout(resolver, ms));

async function pedir(ruta, reintentos = 2) {
  if (!navigator.onLine) throw new ErrorApi('sin-conexion', 'Sin conexión a internet. Revisa tu red e inténtalo de nuevo.');
  const control = new AbortController();
  const temporizador = setTimeout(() => control.abort(), 10000);
  try {
    const respuesta = await fetch(`/api${ruta}`, { signal: control.signal, headers: { Accept: 'application/json' } });
    if (respuesta.status === 429) {
      if (reintentos > 0) {
        const espera = Number(respuesta.headers.get('Retry-After')) || 5;
        await dormir(Math.min(espera, 10) * 1000);
        return pedir(ruta, reintentos - 1);
      }
      throw new ErrorApi('limite', 'Se alcanzó el límite de 60 peticiones por minuto. Espera un momento.');
    }
    if (!respuesta.ok) throw new ErrorApi('http', `moogleAPI respondió con el código ${respuesta.status}.`);
    return await respuesta.json();
  } catch (error) {
    if (error instanceof ErrorApi) throw error;
    if (error.name === 'AbortError') throw new ErrorApi('tiempo', 'La petición tardó demasiado en responder.');
    throw new ErrorApi('red', 'No se pudo conectar con moogleAPI.');
  } finally {
    clearTimeout(temporizador);
  }
}

const extraerLista = (datos) =>
  Array.isArray(datos) ? datos : (datos?.items ?? datos?.data ?? datos?.results ?? []);

const primero = (...valores) => valores.find((v) => v !== undefined && v !== null && v !== '');

export const normalizarPersonaje = (p) => ({
  id: primero(p.id, p.name),
  nombre: primero(p.name, 'Sin nombre'),
  descripcion: primero(p.description, p.bio, ''),
  imagen: primero(p.imageUrl, p.image, p.pictureUrl, p.picture, p.pictures?.[0]?.url, p.thumbnailUrl, ''),
  rol: primero(p.role, p.job, p.occupation, 'Desconocido'),
  raza: primero(p.race, 'Desconocida'),
  origen: primero(p.hometown, p.origin, 'Desconocido'),
  edad: primero(p.age, '—'),
  genero: primero(p.gender, '—'),
});

function leerCache(clave) {
  try {
    const guardado = JSON.parse(sessionStorage.getItem(PREFIJO_CACHE + clave));
    return guardado && Date.now() - guardado.hora < VIGENCIA_MS ? guardado.datos : null;
  } catch {
    return null;
  }
}

function guardarCache(clave, datos) {
  try {
    sessionStorage.setItem(PREFIJO_CACHE + clave, JSON.stringify({ hora: Date.now(), datos }));
  } catch {
    /* almacenamiento lleno o bloqueado: se ignora */
  }
}

export async function obtenerPersonajes(idJuego) {
  const clave = `personajes-${idJuego}`;
  const enCache = leerCache(clave);
  if (enCache) return enCache;

  const vistos = new Set();
  const todos = [];
  for (let pagina = 1; pagina <= MAX_PAGINAS; pagina++) {
    const lote = extraerLista(await pedir(`/characters?gameId=${idJuego}&page=${pagina}&pageSize=${TAMANO_PAGINA}`));
    const nuevos = lote.map(normalizarPersonaje).filter((p) => !vistos.has(p.id));
    if (!nuevos.length) break;
    nuevos.forEach((p) => vistos.add(p.id));
    todos.push(...nuevos);
    if (lote.length < TAMANO_PAGINA) break;
  }
  if (!todos.length) throw new ErrorApi('vacio', 'moogleAPI no devolvió personajes para este juego.');
  guardarCache(clave, todos);
  return todos;
}
