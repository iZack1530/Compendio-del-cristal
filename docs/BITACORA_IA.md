# Bitácora de programación con IA

Herramienta de IA utilizada: Claude. Cada entrada muestra el prompt real, copiado tal cual fue hecho, y se reporta lo que realmente ocurrió al probarlo.

## Entrada 1 — Generación inicial del proyecto

**Prompt (Fragmento):**
> Buenas noches, necesito que leas y analices el archivo .md adjunto y realices un proyecto que cumpla con absolutamente todas las indicaciones pedidas, no te preocupes por lo de Github pro evidentemente, ya me encargué de eso, como se indica, será una aplicación que consulte una API publica. Para este proyecto, crearemos una página dedicada enteramente a recopilar a los personajes importantes nombrados de la saga Final Fantasy en todos sus juegos principales, usando moggleAPI, para evitar saturarnos de datos, únicamente se tratará sobre los personajes nombrados (No los monstruos) y los juegos principales, con algunas piezas de arte seleccionadas para lo más importante hasta ahí. Debido a la naturaleza de la página, la interfaz debe simular y verse lo más posible a la UI de la propia saga en sus menús, usando las mismas fuentes (El título de la página será "Compendio del Cristal" y estará en la misma fuente que el título principal de Final Fantasy), el estilo visual a basarnos será principalmente el de Final Fantasy VII Remake como se aprecia en la imagen.  

**Respuesta de la IA:** buscó la documentación de moogleAPI, detectó que la versión `/api/v1` está obsoleta y que la actual es `moogleapi.com/api/characters?gameId=&page=&pageSize=`. Generó un servidor Node sin dependencias que actúa como proxy, un módulo de API con manejo de errores, y la interfaz.

**¿Funcionó a la primera?** Sí, la página funcionó a la primera. Evidentemente el diseño y sus funciones no estaban pulidos, pero funcionó sin apenas errores.

**Qué corregí o ajusté:** El diseño visual, la paleta de colores, detalles de la música, etc.

**Limitación conocida que declaró la IA:** no pudo llamar a la API desde su entorno, así que los nombres de los campos JSON (`name`, `imageUrl`, `role`…) son una suposición. Por eso `normalizarPersonaje` en `api.js` acepta varios nombres alternativos. Al ejecutar la página con la API real, los datos se mostraron correctamente.


## Entrada 2 — Audio y paleta por juego
**Prompt (tal cual):**
> Excelente, ahora que he visto la página, hay un par de sugerencias que tengo para comenzar a pulir todo. Antes que nada, quisiera pedirte el favor de que recuerdes lo máximo que puedas cada aporte, prompt y demás que haga por mi cuenta (Y tu ayuda) para mejorar el proyecto para incluirlo en la bitácora. Por ahora pregunto ¿Es plausible incorporar música de fondo a la página que sea posible de activar y desactivar al igual que un efecto de sonido al hacer click o cambiar de juego y por último, es posible que la interfaz cambie sus colores (Aunque no cambiará la disposición de la información o la funcionalidad) de juego a juego? De ser posible todo, quisiera que "Menu" sea la música de fondo, "Efecto click" el efecto de sonido al interactuar y la paleta de colores para cada juego será:  
• Final Fantasy I: 
#3498DB 
• Final Fantasy II: 
#E74C3C 
• Final Fantasy III: 
#F1C40F 
• Final Fantasy IV: 
#9B59B6 
• Final Fantasy V: 
#2ECC71 
• Final Fantasy VI: 
#E67E22 
• Final Fantasy VII: 
#1ABC9C 
• Final Fantasy VIII: 
#34495E
• Final Fantasy IX: 
#D35400
• Final Fantasy X: 
#2980B9 
• Final Fantasy XI: 
#7F8C8D 
• Final Fantasy XII: 
#95A5A6
• Final Fantasy XIII: 
#F39C12 
• Final Fantasy XIV: 
#130CB7 
• Final Fantasy XV: 
#111111 
• Final Fantasy XVI: 
#78281F

**Mis aportes:** los dos archivos de audio (`Menu.mp3`, 145 s; `Efecto_click.wav`, 1,7 s) y la paleta de 16 colores.

**Respuesta de la IA:** confirmó que era viable. Nuevo módulo `audio.js` (música con botón, efecto de click); colores guardados en `datos.js` y aplicados como variable CSS `--acento` al cambiar de juego; `estilos.css` ahora deriva todos sus tonos de `--acento` con `color-mix()`; `servidor.js` ahora acepta peticiones `Range` y sirve `.mp3`/`.wav`.

**Decisiones técnicas para explicar:**
- La música no arranca sola porque los navegadores bloquean el audio sin un gesto del usuario; por eso es un botón. Si estaba activada, se reanuda en el primer click.
- El servidor necesitó soporte `Range`; sin él, algunos navegadores no repiten (`loop`) correctamente un MP3.
- Colores muy oscuros (FFXV `#111111`, FFVIII `#34495E`) se verían invisibles como acento, por lo que el texto y las líneas usan una versión aclarada con `color-mix(... white)`.
- El click se escucha también con las teclas ↑ ↓ Q E.
- Un error corregido durante el desarrollo: el sonido de click no sonaba al elegir un personaje porque la lista se redibujaba antes de que el evento llegara al `document`; se resolvió escuchando en fase de captura.

**Prueba realizada:** Sí, el audio de los efectos de sonido y la música se escucha claramente.

## Entrada 3 — Ajuste de personajes principales
**Prompt (tal cual):**
> Excelente, ahora, las siguiente correciones serán únicamente respecto a la selección de ciertos personajes, en Final Fantasy VII "Sephiroth-Clone" no debe estar en personajes principales, por otro lado, Zack Fair, Vincent Valentine, Cid Highwind, Yuffie Yuffie Kisaragi y Cait Sith si deben estar en esa zona. En Final Fantasy VIII, Edea debe estar como personaje principal. En Final Fantasy XV Aranea Highwind debe ser personaje principal. Por el momento son las correciones en lo que continuo la supervisión.

**Mi aporte:** En base a mi experiencia en la saga, noté un personaje que sobraba en los personajes principales del séptimo juego y agregué a otros personajes que debían ser mencionados como principales en varios juegos.

**Respuesta de la IA:** agregó los personajes a `DESTACADOS` en `datos.js`. "Sephiroth-Clone" aparecía porque la búsqueda es por coincidencia parcial y contiene "Sephiroth"; se creó `EXCLUIDOS` en `datos.js` y `app.js` lo aplica después del filtro. Detalles: en el prompt aparecía "Yuffie Yuffie Kisaragi" (repetido); se usó "Yuffie" para que coincida con el nombre real de la API; para Aranea se usó "Aranea".

**Lección:** la coincidencia parcial es flexible pero produce falsos positivos; corregirlos requiere una lista de exclusión.

## Entrada 4 — Logos por juego, tipografía Highwind y texto lateral
**Prompt (tal cual):**
> Excelente, ahora mis sugerencias de diseño, para darle más vida a la interfaz en la esquina inferior derecha la cual no se usa en lo más mínimo, estará el logo correspondiente a cada juego (Evidentemente asegurándonos de que pueda verse bien), todos los logos están en el ZIP adjunto bajo el nombre "FF" del 1 al 16 respectivamente y todas tienen transparencia. Lo siguiente es que la letra del título principal "Compendio del cristal" estará en tipografía "Higwind" también adjunta, por último, el texto "Personajes y arte" está demasiado pegado al menú y creo que podría alejarse más y estirarse para cubrir más espacio vertical sin verse exagerado.

**Mis aportes:** los 16 logos, la fuente Highwind y una captura que mostró el texto lateral pegado al borde del menú.

**Respuesta de la IA:** revisó los logos sobre los fondos de cada tema y vio que varios (IV a VIII) tienen texto oscuro y se pierden sobre fondo oscuro. Solución: una placa clara detrás de esos cinco logos (lista en `datos.js`) y una placa oscura translúcida para los demás. Además recortó los márgenes transparentes, redujo el peso de las imágenes (el de FFVII medía 2400 px) y quitó del logo de FFXI la leyenda "MUSIC PORTAL". El título usa Highwind con `@font-face`; el texto lateral se separó del menú, se centró en vertical y se estiró con `letter-spacing` y tamaño según la altura de la pantalla.

**Prueba realizada:** En efecto, la tipografía Highwind se ve muy bien para la página, y de igual forma la distribución del texto es óptima.

## Entrada 5 — Corrección de logos
**Prompt (tal cual):**
> Como se aprecia en las imágenes, muchas de estas no quedaron del todo bien con el fondo blanco, por otro lado, las de fondo negro se ven bien, pero podemos hacer la prueba a no darles fondo y ver los resultados, por otro lado, el cuadrado que rodea los logotipos no queda del todo bien por lo que será eliminado, los logos son algo pequeños, por lo que pueden ser agrandados y usados en un área más grande como se indica en la última captura, por último, hay bastantes logos (VII, VIII, XII, XIII, XV, XVI, etc) que se salen de los bordes hacia abajo, eso debe ser corregido. Todas las correcciones por ahora

**Mis aportes:** 11 capturas de pantalla que mostraron los fallos de diseño (placa blanca poco atractiva, logos pequeños y desbordados) y un área sugerida (última captura).

**Respuesta de la IA:** eliminó placas y marcos. Los logos de texto oscuro (IV a VIII) usan un halo claro con `drop-shadow` en lugar de fondo blanco; los demás, un resplandor suave del color del tema. El logo ocupa ahora una fila propia del menú, más grande (hasta 520 × 200 px).

**Error de la IA detectado con mis capturas:** el desborde se debía a que la fila del menú no podía crecer. `html, body` tenían `height: 100%` y `.menu` tenía `min-height: 0`, así que el contenido sobrepasaba el marco. Se quitaron ambas reglas y se verificó con capturas de pantalla (Playwright, con la API simulada) en FFVII, FFXII y FFXVI. Un segundo ajuste: con la ficha vacía el logo quedaba flotando a mitad de pantalla, se corrigió con `grid-template-rows: 1fr auto`.

**Lección:** las capturas con el defecto marcado fueron la mejor forma de pedirle correcciones visuales a la IA.

## Entrada 6 — Tamaño de logos de FFVIII y FFXII
**Prompt (tal cual):**
> Excelente, casi todos los logos están mucho mejor, sin embargo, 2 logos en particular son muy pequeños comparados al resto y en proporción a la página siendo el del VIII en menor medida pero sobre todo el del XII, una vez corregido eso habremos terminado. Al final ¿Podrías confirmarme que el proyecto cumple con toda la indicación inicial y que ya tengo el suficiente material para la bitacora por favor?

**Mis aportes:** dos capturas que identificaron los logos pequeños.

**Respuesta de la IA:** los logos altos y estrechos (FFXII: proporción 0,7; FFVIII: 1,22) quedaban limitados por la altura de la caja. Se agregó `ESCALA_LOGO` en `datos.js` (1,35 y 1,7) y la altura de la caja se multiplica por esa escala mediante la variable CSS `--escala`. Verificado con capturas.

## Un error de la IA que detecté
Como se documentó en la Entrada 5, a la hora de incluir los logos de todos los juegos por primera vez, estos se veían fuera de lugar, inicialmente debido a que muchos contaban con un recuadro blanco o negro en el fondo que los hacía destacar para mal con bordes que denotaban mucho la imagen, pero principalmente se notó que muchos logos se salían de los bordes establecidos en la página lo que era poco atractivo visualmente. El desbordamiento ocurría porque el contenedor del menú tenía un tamaño fijo heredado. Las propiedades height: 100% en html, body junto con min-height: 0 en .menu impedían que la fila creciera con el contenido. Se eliminaron ambas reglas y se validó el comportamiento visual mediante capturas de pantalla con Playwright (usando una API simulada) en FFVII, FFXII y FFXVI. Adicionalmente, se corrigió un problema donde el logo quedaba flotando a mitad de la pantalla cuando la ficha estaba vacía, aplicando grid-template-rows: 1fr auto. Por último, después de dicha corrección, los logos del octavo y doceavo juego se veían demasiado pequeños en comparación a los demás, cosa que también fue corregida

## Qué aprendí y qué haría distinto
Aprendí muchísimas cosas gracias a esta actividad, principalmente sobre lo increíblemente útiles y versátiles que pueden ser las APIs para el desarrollo de páginas o herramientas de carácter similar. Por ejemplo, aprendí que la especialización es la clave del progreso: Ninguna aplicación moderna se construye desde cero. Las API enseñan que no necesitas ser un experto en mapas, pasarelas de pago y seguridad al mismo tiempo; puedes delegar y conectar con los mejores en cada área. También aprendí sobre las APIs que llevan y traen información bajo demanda (por ejemplo, el clima actual, el precio de una acción o un mensaje de texto), asegurando que solo viaje lo estrictamente necesario y protegiendo el resto del sistema. Lo siguiente que aprendí es el enorme aporte que puede dar el uso de la Inteligencia Artificial acompañada por una idea clave y una filosofía de diseño diseñadas y claras desde un inicio, lo cual nos dejó con un resultado bastante aceptable para el tiempo de desarrollo y aún tener cosas que aprender, me gustó mucho realizar este proyecto, y pese a que el uso de la IA es algo que reconozco que es increíble, lo que yo hubiera hecho diferente sería precisamente el proceso de creación de la página totalmente desde cero y por mi cuenta, me gustaría en un futuro retarme a recrear esta página lo mejor posible e incluso buscando mejorarla estudiando el código generado para no ser simplemente alguien que copia y pega sin entender realmente de qué se está hablando. De igual forma, algo que hubiera hecho distinto dentro de este mismo proyecto es haber compartido la visión completa, para de esta forma haber tenido una base mucho más sólida sobre la cual trabajar en lugar de simplemente hacer pequeños añadidos que terminaron creando múltiples versiones antes de llegar a la final.
