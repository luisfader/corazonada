# La Corazonada — banda sonora

Las canciones de Natalia, con versos de Oxana, de la novela **«La Corazonada»** de Luis Fader.

> En la fortaleza turquesa, Natalia tocaba el violín. Un día Oxana le mostró un poema, y Natalia descubrió que también sabía cantar.

Sitio estático para GitHub Pages: el desierto está en penumbra y con estrellas; cuando suena una canción, el cielo se vuelve turquesa y sube un polvo brillante.

## Canciones

| # | Título | Dónde suena en la novela | Archivo |
|---|--------|--------------------------|---------|
| 1 | Mañana siempre es mejor | Capítulo 23 | `audio/01-manana-siempre-es-mejor.mp3` |
| 2 | La puerta abierta | Capítulo 24 | `audio/02-la-puerta-abierta.mp3` |
| 3 | Bajo un cielo turquesa | Capítulo 35 | `audio/03-bajo-un-cielo-turquesa.mp3` |

## Estructura

```
index.html               página con el reproductor
assets/js/canciones.js   lista de canciones (título, escena, capítulo, duración)
assets/js/app.js         reproductor y letras
assets/css/style.css     diseño
assets/img/              imágenes de Natalia y portada
audio/                   mp3
letras/                  letras, un .md por canción
```

## Cómo agregar una canción

1. Poner el mp3 en `audio/` con el nombre `NN-titulo.mp3`.
2. Crear `letras/NN-titulo.md` con la letra.
3. Agregar una entrada en `assets/js/canciones.js` con el mismo `id`.

## Formato de las letras

La primera línea es `# Título`; después, estrofas separadas por una línea vacía. Una estrofa que empieza con `[Estribillo]` se muestra como estribillo; `[Puente]` y `[Final]` aparecen como rótulos.
