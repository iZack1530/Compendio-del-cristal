const CLAVE_MUSICA = 'compendio:musica';
const musica = new Audio('audio/menu.mp3');
const efecto = new Audio('audio/click.wav');
musica.loop = true;
musica.volume = 0.35;
efecto.volume = 0.6;

let boton = null;

const guardar = (valor) => {
  try {
    localStorage.setItem(CLAVE_MUSICA, valor ? '1' : '0');
  } catch {
    /* almacenamiento bloqueado: se ignora */
  }
};

const dibujarBoton = () => {
  const activa = !musica.paused;
  boton.setAttribute('aria-pressed', String(activa));
  boton.textContent = `♪ Música: ${activa ? 'sí' : 'no'}`;
};

async function alternarMusica() {
  if (musica.paused) {
    try {
      await musica.play();
    } catch {
      /* el navegador bloqueó la reproducción: el botón queda en "no" */
    }
  } else {
    musica.pause();
  }
  guardar(!musica.paused);
  dibujarBoton();
}

export function sonarClick() {
  const copia = efecto.cloneNode();
  copia.volume = efecto.volume;
  copia.play().catch(() => {});
}

export function iniciarAudio(botonMusica) {
  boton = botonMusica;
  boton.addEventListener('click', alternarMusica);
  dibujarBoton();
  // Los navegadores exigen un gesto del usuario: si la música estaba activa, se reanuda en la primera interacción.
  let deseaMusica = false;
  try {
    deseaMusica = localStorage.getItem(CLAVE_MUSICA) === '1';
  } catch {
    /* sin preferencia guardada */
  }
  if (deseaMusica) {
    document.addEventListener('pointerdown', () => musica.paused && alternarMusica(), { once: true });
  }
}
