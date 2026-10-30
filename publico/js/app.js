import { JUEGOS, DESTACADOS, EXCLUIDOS, LOGOS_DE_TEXTO_OSCURO, ESCALA_LOGO } from './datos.js';
import { obtenerPersonajes, ErrorApi } from './api.js';
import { iniciarAudio, sonarClick } from './audio.js';

const $ = (selector) => document.querySelector(selector);
const estado = { indiceJuego: 6, modo: 'destacados', personajes: [], seleccionado: 0, busqueda: '' };
const elementos = { logo: $('#logo-juego'), lista: $('#lista'), detalle: $('#detalle'), estado: $('#estado'), juego: $('#juego-actual'), busqueda: $('#busqueda') };

const normalizar = (texto) => texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

function crear(etiqueta, atributos = {}, texto = '') {
  const nodo = Object.assign(document.createElement(etiqueta), atributos);
  if (texto) nodo.textContent = texto;
  return nodo;
}

function personajesVisibles() {
  const juego = JUEGOS[estado.indiceJuego];
  let lista = estado.personajes;
  if (estado.modo !== 'todos') {
    const clavesDestacadas = (DESTACADOS[juego.id] ?? []).map(normalizar);
    const clavesExcluidas = (EXCLUIDOS[juego.id] ?? []).map(normalizar);
    lista = lista.filter((p) => {
      const nombre = normalizar(p.nombre);
      return clavesDestacadas.some((clave) => nombre.includes(clave)) && !clavesExcluidas.some((clave) => nombre.includes(clave));
    });
    if (estado.modo === 'arte') lista = lista.filter((p) => p.imagen);
  }
  const filtro = normalizar(estado.busqueda);
  return filtro ? lista.filter((p) => normalizar(p.nombre).includes(filtro)) : lista;
}

function imagenConRespaldo(p, clase) {
  const img = crear('img', { src: p.imagen, alt: `Arte de ${p.nombre}`, loading: 'lazy', referrerPolicy: 'no-referrer' });
  img.className = clase ?? '';
  img.addEventListener('error', () => img.replaceWith(crear('span', { className: 'sin-imagen' }, p.nombre[0])));
  return img;
}

function dibujarLista() {
  const visibles = personajesVisibles();
  elementos.lista.replaceChildren();
  elementos.lista.className = estado.modo === 'arte' ? 'lista cuadricula' : 'lista';
  if (!visibles.length) {
    elementos.lista.append(crear('li', { className: 'vacio' }, 'Sin resultados. Prueba otra pestaña o búsqueda.'));
    elementos.detalle.replaceChildren();
    return;
  }
  estado.seleccionado = Math.min(estado.seleccionado, visibles.length - 1);
  visibles.forEach((p, i) => {
    const item = crear('li', { tabIndex: i === estado.seleccionado ? 0 : -1, role: 'option' });
    item.setAttribute('aria-selected', String(i === estado.seleccionado));
    if (estado.modo === 'arte') item.append(imagenConRespaldo(p), crear('span', {}, p.nombre));
    else item.textContent = p.nombre;
    item.addEventListener('click', () => seleccionar(i));
    elementos.lista.append(item);
  });
  dibujarDetalle(visibles[estado.seleccionado]);
}

function dibujarDetalle(p) {
  const retrato = crear('div', { className: 'retrato' });
  const marco = crear('div');
  marco.append(p.imagen ? imagenConRespaldo(p) : crear('span', { className: 'sin-imagen' }, p.nombre[0]));
  retrato.append(marco);

  const atributos = crear('dl', { className: 'atributos' });
  [['Rol', p.rol], ['Raza', p.raza], ['Origen', p.origen], ['Edad', p.edad], ['Género', p.genero], ['Juego', JUEGOS[estado.indiceJuego].nombre]].forEach(([nombre, valor]) =>
    atributos.append(crear('dt', {}, nombre), crear('dd', {}, String(valor))),
  );
  const ficha = crear('div', { className: 'ficha' });
  ficha.append(crear('h2', {}, p.nombre), atributos);

  elementos.detalle.replaceChildren(retrato, ficha, crear('p', { className: 'descripcion' }, p.descripcion || 'Sin descripción disponible.'));
}

function seleccionar(indice) {
  const total = personajesVisibles().length;
  if (!total) return;
  estado.seleccionado = (indice + total) % total;
  dibujarLista();
  elementos.lista.children[estado.seleccionado]?.scrollIntoView({ block: 'nearest' });
}

function mostrarError(error) {
  const titulos = { 'sin-conexion': 'Sin conexión', limite: 'Demasiadas peticiones', vacio: 'Sin datos', tiempo: 'Tiempo agotado' };
  const caja = crear('div', { className: 'mensaje', role: 'alert' });
  const reintentar = crear('button', { className: 'tecla' }, 'Reintentar');
  reintentar.addEventListener('click', cargarJuego);
  caja.append(crear('h2', {}, titulos[error.tipo] ?? 'No se pudo cargar'), crear('p', {}, error.message), reintentar);
  elementos.lista.replaceChildren();
  elementos.detalle.replaceChildren(caja);
  elementos.estado.textContent = 'Error';
}

async function cargarJuego() {
  const juego = JUEGOS[estado.indiceJuego];
  elementos.juego.textContent = juego.nombre;
  document.documentElement.style.setProperty('--acento', juego.color);
  elementos.logo.classList.toggle('texto-oscuro', LOGOS_DE_TEXTO_OSCURO.has(juego.id));
  elementos.logo.style.setProperty('--escala', ESCALA_LOGO[juego.id] ?? 1);
  elementos.logo.firstElementChild.src = `logos/ff${juego.id}.png`;
  elementos.logo.firstElementChild.alt = `Logo de ${juego.nombre}`;
  elementos.estado.textContent = 'Cargando';
  elementos.estado.className = 'cargando';
  elementos.detalle.replaceChildren();
  try {
    estado.personajes = await obtenerPersonajes(juego.id);
    estado.seleccionado = 0;
    dibujarLista();
    elementos.estado.textContent = `${estado.personajes.length} personajes cargados`;
  } catch (error) {
    mostrarError(error instanceof ErrorApi ? error : new ErrorApi('http', 'Ocurrió un error inesperado.'));
  } finally {
    elementos.estado.classList.remove('cargando');
  }
}

function cambiarJuego(paso) {
  estado.indiceJuego = (estado.indiceJuego + paso + JUEGOS.length) % JUEGOS.length;
  cargarJuego();
}

document.querySelectorAll('.pestanas button').forEach((boton) =>
  boton.addEventListener('click', () => {
    estado.modo = boton.dataset.modo;
    estado.seleccionado = 0;
    document.querySelectorAll('.pestanas button').forEach((b) => b.setAttribute('aria-selected', String(b === boton)));
    dibujarLista();
  }),
);
elementos.busqueda.addEventListener('input', () => { estado.busqueda = elementos.busqueda.value; estado.seleccionado = 0; dibujarLista(); });
$('#juego-anterior').addEventListener('click', () => cambiarJuego(-1));
$('#juego-siguiente').addEventListener('click', () => cambiarJuego(1));
document.addEventListener('keydown', (e) => {
  if (e.target === elementos.busqueda) return;
  const acciones = { ArrowDown: () => seleccionar(estado.seleccionado + 1), ArrowUp: () => seleccionar(estado.seleccionado - 1), q: () => cambiarJuego(-1), e: () => cambiarJuego(1) };
  const accion = acciones[e.key.length === 1 ? e.key.toLowerCase() : e.key];
  if (accion) { e.preventDefault(); sonarClick(); accion(); }
});
window.addEventListener('online', cargarJuego);
document.addEventListener('click', (e) => {
  if (e.target.closest('button:not(#musica), #lista li:not(.vacio)')) sonarClick();
}, true);

iniciarAudio($('#musica'));

cargarJuego();
