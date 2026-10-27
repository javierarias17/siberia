# INSTRUCTIVO PARA IA · Biblioteca de estudio

> **Lee este archivo completo antes de tocar nada.**
> Este documento es el punto de entrada único para cualquier persona o IA que
> abra este repositorio. Explica **qué hay aquí**, **cómo está organizada la
> biblioteca**, **qué se puede modificar** y **cómo añadir temas nuevos**.
>
> Última actualización: 2026-10-26.

---

## 1. Resumen en treinta segundos

Este repositorio contiene **una sola cosa**: la **biblioteca de estudio**
(carpeta `guia/`), un libro HTML navegable que funciona **sin internet**.

No contiene el jailbreak de PS5. El host DNS/HTTPS y la GUI del exploit viven
**un nivel más arriba, en la carpeta padre**, y quedan fuera de este repositorio.

| # | Cosa | Dónde está | ¿Se toca? |
|---|------|-----------|-----------|
| 1 | **La biblioteca de estudio** (`guia/`) | dentro de este repo | **SÍ** · aquí se trabaja |
| 2 | **El jailbreak de PS5** (host DNS/HTTPS + GUI del exploit) | carpeta padre, **fuera** del repo | **NO** · no forma parte del repositorio |

La regla de oro: **lo que sirve a la consola no se toca. Lo que se lee sí se amplía.**

---

## 2. Mapa del repositorio

```
proyecto-estudio/                       ← raíz del repositorio (esto sube a GitHub)
├─ README.md                            ← portada: qué es y cómo navegarlo
├─ INSTRUCTIVO-IA.md                    ← este archivo
├─ guia-estudio.html                    ← PUENTE (redirige a guia/index.html)
│
└─ guia/                                ← LA BIBLIOTECA (aquí sí se trabaja)
   ├─ index.html                        ← portal: recorrido de temas (paradas)
   ├─ _estilo.css                       ← hoja de estilos COMPARTIDA por todos los temas
   ├─ _motor.js                         ← motor COMPARTIDO: índice, buscador, filtros, progreso
   ├─ _plantilla.html                   ← molde para crear un tema nuevo
   ├─ del-bit-al-exploit.html           ← Tema 01 (informática desde cero → exploit PS5)
   ├─ java-estructuras.html             ← Tema 02 (estructuras de datos en Java)
   └─ iac-azure-cicd.html               ← Tema 03 (IaC con Bicep + CI/CD con GitHub Actions/OIDC)
```

**Fuera del repositorio** (en la carpeta padre, en la máquina del autor) están
los archivos del jailbreak. Se listan aquí solo para que nadie tropiece con
ellos por accidente:

```
VALIDACION/                             ← carpeta padre (NO va a GitHub)
├─ index.html                           ← GUI real del exploit (5,9 MB) · NO TOCAR
├─ poops.html                           ← segunda página de la cadena · NO TOCAR
└─ webkit-autoloader-host_v0.6.1.py     ← host DNS/HTTPS (10,8 MB) · NO TOCAR
```

---

## 3. Contexto externo · El jailbreak (no está en este repo)

> Esta sección no describe el repositorio: describe lo que hay **fuera** de él.
> Se incluye para que una IA entienda el proyecto completo y no rompa nada si
> alguna vez trabaja en la máquina del autor. **Nada de esto se sube a GitHub.**

### 3.1 Qué es

Un **host local** que falsifica las respuestas DNS para el dominio
`manuals.playstation.net` y sirve por HTTPS las páginas del exploit. La PS5,
con el firmware adecuado (13.20 en este equipo), las carga como si fueran el
manual oficial y ahí ocurre la cadena de ataque.

### 3.2 Flujo técnico (para entender por qué no se toca)

```
PS5 (navegador/manual)  →  DNS falso (UDP 53)  →  host local
                                                       ↓
                        HTTPS falso (TCP 443)  →  index.html  (exploit WebKit)
                                                       ↓
        WebKit ARW (Arbitrary Read/Write)  →  ROP  →  Kernel Exploit (Relapse/poops)
                                                       ↓
                              Privilegios root  →  ELF Loader (puerto 9021)
```

### 3.3 Requisitos de ejecución (para diagnosticar, no para modificar)

- Puertos **UDP 53** (DNS) y **TCP 443** (HTTPS) libres en el equipo.
- Si el puerto 53 está ocupado, detener el servicio `SharedAccess`
  (Internet Connection Sharing / Punto de acceso móvil) de Windows.
- El script es Python y **se puede ejecutar con el intérprete de LibreOffice**
  si no hay Python en el `PATH`:
  `C:\Program Files\LibreOffice\program\python.exe`

### 3.4 Archivos congelados — PROHIBIDO modificarlos

| Archivo | Qué es | Por qué no se toca |
|---------|--------|--------------------|
| `index.html` (raíz, 5,9 MB) | GUI real del exploit + tabla de offsets por firmware | Sobrescribirlo rompe el jailbreak. Un offset equivocado → kernel panic. |
| `poops.html` | Segunda página de la cadena de ataque | Forma parte del flujo servido a la consola. |
| `webkit-autoloader-host_v0.6.1.py` | El host DNS/HTTPS | Es el servidor; editarlo puede dejar la consola sin poder cargar nada. |

> **Nota de seguridad**: los offsets de la tabla dependen del firmware exacto.
> Si la tabla no coincide con el build de la consola, se produce un kernel panic
> y la única recuperación es un **reinicio en frío** (apagar y desenchufar).

---

## 4. La biblioteca de estudio (aquí se trabaja)

### 4.1 Qué es

Un **libro HTML navegable** que se abre con doble clic y funciona **sin
internet**: sin CDN, sin dependencias, sin imágenes externas. Un archivo por
tema, con estilo y motor compartidos.

### 4.2 Arquitectura

```
guia/
├─ index.html          PORTAL · portada, recorrido de temas y nota de
│                      mantenimiento. NO carga _motor.js (no tiene secciones
│                      de tema, solo el listado y la ayuda).
├─ _estilo.css         Todo el CSS, común a portal y temas.
├─ _motor.js           Todo el JS, común a los temas:
│                        · barra de progreso y botón "volver arriba"
│                        · índice como panel deslizable en móvil (#tocBtn,
│                          #sideOverlay, #sideClose abren/cierran #side)
│                        · resaltado de la sección activa en el índice
│                        · filtro del índice (#tocFilter)
│                        · filtro del glosario (#glossFilter)
│                        · tablas anchas con scroll horizontal propio (.tbl-scroll)
│                        · buscador global (#docSearch / #docResults)
│                        · tecla "/" para saltar al buscador
│                        · expone window.__guiaUtil = { escapeHtml, rxEsc,
│                          normalize, hex2, hexPad } para las herramientas
├─ _plantilla.html     Molde comentado para un tema nuevo.
├─ del-bit-al-exploit.html   Tema 01
├─ java-estructuras.html     Tema 02
└─ iac-azure-cicd.html       Tema 03
```

**Regla de oro de la arquitectura**: cada tema enlaza el motor con
`<script src="_motor.js"></script>` y usa la hoja con
`<link rel="stylesheet" href="_estilo.css">`. **El motor NO se duplica dentro
del tema.** Si ves un IIFE largo copiado dentro de un tema, es un error: debe
eliminarse y dejar solo la referencia externa.

### 4.3 Estructura obligatoria de un archivo de tema

```html
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>TÍTULO - Biblioteca de estudio</title>
<link rel="stylesheet" href="_estilo.css">
</head>
<body>
<div id="prog"></div>
<div id="wrap">

  <aside id="side">
    <button id="sideClose" aria-label="Cerrar índice">✕</button>
    <a class="backlink" href="index.html">Volver a la biblioteca</a>
    <h1>TÍTULO</h1>
    <p class="sub">Tema NN - Subtítulo</p>
    <input id="docSearch" placeholder="Buscar en toda la guía..." autocomplete="off">
    <div id="docResults"></div>
    <input id="tocFilter" placeholder="Filtrar índice..." autocomplete="off">
    <nav id="toc">
      <div class="grp">Grupo</div>
      <a href="#intro">Cómo usar este tema</a>
      <a href="#c1">1. ...</a>
      ...
    </nav>
  </aside>

  <main id="main">
    <header class="cover inner"> ... portada ... </header>
    <section id="intro" class="inner"> ... </section>
    <section id="c1" class="inner"> ... </section>
    ...
    <section id="glosario" class="inner"> ... </section>
    <section id="refs" class="inner"> ... </section>
    <section id="herramientas" class="inner"> ... </section>
  </main>

</div>

<button id="top" title="Volver arriba">^</button>
<button id="tocBtn" title="Abrir índice" aria-expanded="false">☰ Índice</button>
<div id="sideOverlay"></div>

<script src="_motor.js"></script>
<script>
/* Herramientas interactivas propias de este tema.
   Dependen del motor: esperan que _motor.js ya se haya ejecutado. */
(function () {
  "use strict";
  var escapeHtml = window.__guiaUtil.escapeHtml;
  /* ... tus herramientas ... */
})();
</script>
</body>
</html>
```

### 4.4 Componentes y sus clases CSS

**Cajas de color** (cada una lleva `<span class="lbl">Título</span>` dentro):

| Clase | Color | Cuándo usarla |
|-------|-------|---------------|
| `<div class="box analogy">` | violeta | Comparación con la vida diaria |
| `<div class="box real">` | verde | Dato medido o verificable |
| `<div class="box warn">` | ámbar | Cuidado: algo que puede romperse |
| `<div class="box danger">` | rojo | Consecuencia grave |
| `<div class="box exploit">` | azul | Cómo lo hace el exploit real del proyecto |
| `<div class="box key">` | blanco | La idea que hay que llevarse |

**Desplegables**

```html
<details class="saber"><summary>Saber más: tema</summary>
  <div class="body"> ... profundización opcional ... </div>
</details>

<details class="quiz"><summary>Autoevaluación</summary>
  <div class="body">
    <ol>
      <li>Pregunta<br><em>Respuesta.</em></li>
    </ol>
  </div>
</details>
```

**Herramienta interactiva** (usa `input.ctl` / `textarea.ctl` y `div.out`):

```html
<div class="tool">
  <h4>1 · Nombre de la herramienta</h4>
  <p>Qué hace y con qué sección del tema se relaciona.</p>
  <p><span class="pill">nota</span><span class="pill">nota</span></p>
  <input class="ctl" id="miEntrada" value="algo" autocomplete="off">
  <div class="out" id="miSalida"></div>
</div>
```

**Glosario** (orden alfabético dentro de `dl.gl`, un `div.ge` por término):

```html
<dl class="gl">
  <div class="ge"><dt>Término <span class="en">english</span></dt>
    <dd>Definición breve (sección N).</dd></div>
</dl>
```

**Código resaltado** dentro de `<pre>` (el CSS define las clases):

```html
<pre><span class="c">// comentario</span>
<span class="b">String</span> s = <span class="r">"hola"</span>;
<span class="g">public void</span> <span class="y">metodo</span>() { }</pre>
```
`c` = comentario · `b` = tipo/clase · `r` = literal · `g` = palabra clave
(`public`, `import`, `for`) · `y` = nombre de método · `p` = anotación.

### 4.5 Convenciones de estilo del contenido (respetarlas siempre)

- Español, variante colombiana. Trato de **"tú"**. Tono de profesor paciente,
  nunca condescendiente.
- **Primero la analogía, después la definición técnica.** Nunca al revés.
- Los números deben ser **reales y verificables**. No inventar medidas, offsets
  ni resultados.
- Referencias cruzadas en formato **`(sección N)`** / **`(cap. N)`** /
  **`(apéndice X)`**, y enlaces internos `<a href="#cN">`.
- Explicar las convenciones como **decisiones**, no como leyes naturales.
- No prometer nada que el texto no demuestre con un ejemplo.
- Cada sección numerada termina con un `<details class="quiz">`.

---

## 5. Cómo añadir un tema nuevo a la biblioteca

**Receta completa (cinco pasos):**

1. **Copia** `guia/_plantilla.html` a `guia/temaNN.html` (por ejemplo
   `tema03.html`).
2. **Reemplaza los marcadores** del molde: `@@NUM@@`, `@@TITULO@@`,
   `@@SUBTITULO@@`, `@@DESCRIPCION@@`. Escribe las secciones dentro de
   `<main id="main">`, usando el patrón de la sección 4.3.
3. **Construye el índice lateral** (`nav#toc`): un `<div class="grp">` por
   grupo y un `<a href="#id">` por sección. Los `href` deben apuntar a ids que
   **existan** en el documento.
4. **Publica su parada** en `guia/index.html`: dentro de `<ol class="route">`,
   copia un bloque `<li class="stop">` de un tema existente y cámbialo
   (el `<h3>`, el texto, las etiquetas y el `href`). Quita la clase `soon`
   cuando el tema ya esté publicado.
5. **Actualiza el contador** de la portada del portal
   ("N temas publicados · M en preparación").

**No hace falta tocar `_estilo.css` ni `_motor.js`**: los comparten todos los
temas. Solo se modifican si hay que añadir una clase o comportamiento nuevo
**común a toda la biblioteca**.

### 5.1 Cómo añadir una sección a un tema existente

1. Elige el id siguiente (`#c16`, `#c17`…).
2. Copia el patrón `<section id="..." class="inner">` de otra sección.
3. Añade el enlace en `nav#toc`, en el grupo que corresponda.
4. Si es un apéndice, usa `#apd`, `#ape`… (letra siguiente).
5. El resaltado de sección activa y la barra de progreso lo detectan
   **automáticamente** (el motor recorre `main section[id]`).

### 5.2 Cómo añadir un término al glosario

1. Localiza la letra dentro de `#glosario`. Cada letra es un
   `<h4 class="gl-letter" id="gl-x">X</h4>` seguido de su propio `<dl class="gl">`
   (la clase `gl-letter` es la que hace que el filtro oculte la letra cuando no
   quedan términos visibles).
2. Inserta el `<div class="ge">` en **orden alfabético**, no al final.
3. Si la letra no existe todavía, crea su `h4` + `dl` en su sitio y añade la
   letra a la barra `<div class="az">` con un enlace al nuevo id.

### 5.3 Cómo añadir una herramienta interactiva

1. Un `<div class="tool">` nuevo dentro de `#herramientas`.
2. Una sección numerada nueva al final del `<script>` del tema, siguiendo el
   patrón de las existentes. Usa `window.__guiaUtil` para escapar HTML.

---

## 6. Verificación después de cualquier cambio

Checklist mínimo antes de dar por terminado un cambio:

- [ ] **Etiquetas balanceadas**: `<section>`/`</section>`,
      `<details>`/`</details>`, `<table>`/`</table>`, `<pre>`/`</pre>`,
      `<dl class="gl">`/`</dl>`.
- [ ] **Todos los `href` del índice** apuntan a ids que existen en el archivo.
- [ ] **No hay motor duplicado** dentro de un tema (solo la referencia externa
      a `_motor.js`).
- [ ] **El contador de la portada** (nº de secciones/apéndices/términos) sigue
      siendo cierto.
- [ ] El tema abre con doble clic y funciona sin internet.

Comando PowerShell útil para contar etiquetas (ajusta la ruta):

```powershell
$p='c:\Users\Angie\Downloads\VALIDACION\proyecto-estudio\guia\java-estructuras.html'
$t=[System.IO.File]::ReadAllText($p)
foreach($tag in '<section','</section>','<details','</details>','<table','</table>','<pre','</pre>'){
  "$tag = " + ([regex]::Matches($t,[regex]::Escape($tag))).Count
}
```

---

## 7. Ruido conocido (no es un error)

Cada comando de PowerShell en este equipo imprime una advertencia:

```
. : No se puede cargar el archivo powershell-profile-snapshot.ps1
porque la ejecución de scripts está deshabilitada en este sistema
(about_Execution_Policies)
```

**No es un fallo**: el comando termina con *exit code 0*. Se debe a una
restricción de políticas de ejecución del perfil de PowerShell, no al comando.

---

## 8. Estado actual del repositorio

| Archivo | Estado |
|---------|--------|
| `README.md` | Publicado (portada del repo) |
| `INSTRUCTIVO-IA.md` | Publicado (este archivo) |
| `guia-estudio.html` | Redirección a `guia/index.html` |
| `guia/index.html` (portal) | Publicado (portada + recorrido de temas) |
| `guia/_estilo.css` | Publicado (estilos + bloque de biblioteca/portal) |
| `guia/_motor.js` | Publicado |
| `guia/_plantilla.html` | Publicado |
| `guia/del-bit-al-exploit.html` | Publicado (Tema 01, 3.427 líneas) |
| `guia/java-estructuras.html` | Publicado (Tema 02, 1.544 líneas) |
| `guia/iac-azure-cicd.html` | Publicado (Tema 03, IaC con Bicep + CI/CD con GitHub Actions/OIDC) |

**Temas previstos / ideas**: queda libre la parada "Tema 04" y siguientes.
Ideas anotadas por el usuario: más temas de estructuras de datos, redes,
sistemas operativos.

---

## 9. Prompt de traspaso (si la IA no lee este archivo, pégaselo tal cual)

```
Vas a ayudarme a ampliar una biblioteca de estudio que ya existe en
C:\Users\Angie\Downloads\VALIDACION\proyecto-estudio

Antes de escribir nada, LEE completo
C:\Users\Angie\Downloads\VALIDACION\proyecto-estudio\INSTRUCTIVO-IA.md .
Es el punto de entrada del repositorio y explica:
 - que el repositorio contiene SOLO la biblioteca de estudio (la carpeta guia/);
 - que el jailbreak de PS5 vive en la carpeta padre y NO forma parte del repo
   (index.html, poops.html, webkit-autoloader-host_v0.6.1.py) y no se toca;
 - la arquitectura de la biblioteca en la carpeta guia/ (portal, _estilo.css
   y _motor.js compartidos, _plantilla.html, un archivo por tema);
 - las clases CSS (box analogy/real/warn/danger/exploit/key, details saber/quiz,
   div.tool, dl.gl con div.ge, h4.gl-letter con barra .az,
   pre con spans de color);
 - las convenciones de estilo (español, trato de "tú", primero la analogía,
   después la definición técnica, datos reales y verificables, referencias
   cruzadas "(sección N)").

No dupliques el motor dentro de un tema: enlaza <script src="_motor.js">.

TAREA: ...
```

---

## 10. Principios que nunca se rompen

1. **La consola manda.** Este repositorio solo contiene material de lectura; el
   jailbreak vive fuera, en la carpeta padre. Si algo pudiera afectarlo, no se
   hace desde aquí.
2. **El motor es único.** Estilo y JS se comparten; no se copian por tema.
3. **Datos reales.** Si no se puede medir o verificar, no se afirma.
4. **Sin internet.** Nada de CDN, fuentes remotas ni imágenes externas.
5. **Analogía primero.** Es lo que hace que el tema se entienda y no se olvide.
