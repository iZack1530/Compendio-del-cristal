import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const PUBLICO = join(fileURLToPath(import.meta.url), '..', 'publico');
const PUERTO = process.env.PORT || 3000;
const BASE_API = process.env.MOOGLE_BASE || 'https://moogleapi.com';
const CLAVE_API = process.env.MOOGLE_API_KEY;
const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ttf': 'font/ttf',
};

const responder = (res, estado, cuerpo, cabeceras = {}) => {
  res.writeHead(estado, cabeceras);
  res.end(cuerpo);
};

async function reenviarApi(url, res) {
  const cabeceras = { Accept: 'application/json' };
  if (CLAVE_API) cabeceras['X-Api-Key'] = CLAVE_API;
  const respuesta = await fetch(BASE_API + url.pathname + url.search, { headers: cabeceras });
  const salida = { 'Content-Type': respuesta.headers.get('content-type') ?? 'application/json' };
  const espera = respuesta.headers.get('retry-after');
  if (espera) salida['Retry-After'] = espera;
  responder(res, respuesta.status, Buffer.from(await respuesta.arrayBuffer()), salida);
}

async function servirArchivo(url, req, res) {
  const ruta = normalize(join(PUBLICO, url.pathname === '/' ? 'index.html' : url.pathname));
  if (!ruta.startsWith(PUBLICO)) return responder(res, 403, 'Prohibido');
  const datos = await readFile(ruta);
  const tipo = TIPOS[extname(ruta)] ?? 'application/octet-stream';
  const rango = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range ?? '');
  if (!rango) return responder(res, 200, datos, { 'Content-Type': tipo, 'Accept-Ranges': 'bytes' });
  const inicio = rango[1] ? Number(rango[1]) : 0;
  const fin = rango[2] ? Math.min(Number(rango[2]), datos.length - 1) : datos.length - 1;
  if (inicio > fin) return responder(res, 416, '', { 'Content-Range': `bytes */${datos.length}` });
  responder(res, 206, datos.subarray(inicio, fin + 1), {
    'Content-Type': tipo,
    'Accept-Ranges': 'bytes',
    'Content-Range': `bytes ${inicio}-${fin}/${datos.length}`,
  });
}

http
  .createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://localhost');
      if (url.pathname.startsWith('/api/')) return await reenviarApi(url, res);
      await servirArchivo(url, req, res);
    } catch (error) {
      if (error.code === 'ENOENT') return responder(res, 404, 'No encontrado');
      responder(res, 502, JSON.stringify({ error: 'No se pudo contactar con moogleAPI' }), {
        'Content-Type': 'application/json',
      });
    }
  })
  .listen(PUERTO, () => console.log(`Compendio del Cristal en http://localhost:${PUERTO}`));
