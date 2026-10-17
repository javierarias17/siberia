# Biblioteca de estudio

Un libro de informática **navegable y sin internet** que se abre con doble clic.
Cada tema es un archivo HTML independiente; todos comparten el mismo estilo y el
mismo motor de navegación.

> Abre **[`guia/index.html`](guia/index.html)** para empezar (o `guia-estudio.html`,
> que redirige ahí).

---

## Qué es

Una colección de temas explicados **desde cero**, pensados para entender de
verdad y no solo memorizar. El estilo de cada capítulo es siempre el mismo:

1. Primero una **analogía** de la vida diaria.
2. Después la **definición técnica** y el detalle real (con datos verificables).
3. Al final, una **autoevaluación** para comprobar que quedó claro.

No hay dependencias, ni CDN, ni imágenes remotas, ni build. Solo HTML, CSS y
JavaScript: se abre en cualquier navegador, incluso sin conexión.

## Cómo navegarlo

- **Índice lateral** con todas las secciones y subsecciones.
- **Buscador global** en la parte superior del panel (atajo: la tecla `/`).
- **Filtro de índice** para encontrar una sección por nombre.
- **Barra de progreso** de lectura y botón para volver arriba.
- **Glosario A–Z** con su propio filtro, en cada tema.
- **Herramientas interactivas** al final de cada tema (calculadoras, simuladores).

## Temas publicados

| # | Tema | De qué va |
|---|------|-----------|
| 01 | **Del bit al exploit** | Binario, hexadecimal, CPU, memoria y cómo se encadenan hasta un exploit real. |
| 02 | **Estructuras de datos en Java** | `List`, `Set`, `Map`, `Queue`, su complejidad, sus *imports* y cómo funcionan por dentro. |

La parada "Tema 03" del portal está reservada para el próximo.

## Estructura del repositorio

```
proyecto-estudio/
├─ README.md                  ← este archivo
├─ INSTRUCTIVO-IA.md          ← reglas completas de estilo y mantenimiento
├─ guia-estudio.html          ← puente: redirige a guia/index.html
└─ guia/
   ├─ index.html              ← portal con el recorrido de temas
   ├─ _estilo.css             ← estilos compartidos por todos los temas
   ├─ _motor.js               ← motor compartido (índice, buscador, filtros, progreso)
   ├─ _plantilla.html         ← molde comentado para crear un tema nuevo
   ├─ del-bit-al-exploit.html ← Tema 01
   └─ java-estructuras.html   ← Tema 02
```

## Cómo añadir un tema nuevo

Tienes la receta completa en **[`INSTRUCTIVO-IA.md`](INSTRUCTIVO-IA.md)**, pero en
resumen:

1. Copia `guia/_plantilla.html` a `guia/temaNN.html`.
2. Rellena los marcadores (`@@NUM@@`, `@@TITULO@@`, `@@SUBTITULO@@`, `@@DESCRIPCION@@`)
   y escribe tus secciones dentro de `<main>`.
3. Añade los enlaces de esas secciones al índice lateral (`nav#toc`).
4. Publica su parada nueva en `guia/index.html` (dentro de `<ol class="route">`).
5. Verifica que los enlaces del índice apunten a ids existentes.

No hace falta tocar `_estilo.css` ni `_motor.js`: los comparten todos los temas.

## Notas técnicas

- **Sin internet**: todo funciona en local; las herramientas interactivas se
  ejecutan en el navegador.
- **Un archivo por tema**: se puede leer, imprimir o compartir por separado.
- **Accesibilidad ligera**: navegación por teclado, `scroll-margin` en los
  títulos y contraste alto.

---

*Material de estudio personal. Se comparte por si a alguien más le sirve.*
