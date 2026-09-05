# Elihú Ángeles Pérez — Portafolio

Este es una presentacion de mi trayectoria profesional, pero tu puedes generarlo y modificarlo por ti mismo

## Ejecutar en local

```bash
pnpm install
pnpm dev
```

Para generar la versión de producción:

```bash
pnpm build
```

## Proyectos sincronizados con GitHub

La sección de proyectos consulta la API pública de GitHub al cargar la página. Todos los repositorios públicos, los nuevos y sus actualizaciones aparecen automáticamente, ordenados por actividad reciente. No requiere una nueva compilación del sitio; basta con recargar la página publicada.

La vista incluye también forks, repositorios archivados y el repositorio especial del perfil. Si GitHub no está disponible temporalmente, se muestra el catálogo local completo de respaldo.

## Certificados y certificaciones desde Google Drive

Las dos galerías consultan las carpetas públicas configuradas en `api/drive-files.js`. Cada PDF se muestra con una vista previa de Google Drive y un enlace para abrir el documento completo. Los cambios en Drive se reflejan automáticamente en el sitio; la respuesta se conserva en caché durante cinco minutos para proteger la cuota de la API.

Para activar la sincronización:

1. Comparte las dos carpetas de Drive como **Cualquier persona con el enlace — Lector**.
2. Habilita **Google Drive API** en un proyecto de Google Cloud.
3. Crea una API key y restríngela para que solo pueda utilizar Google Drive API.
4. En Vercel abre **Project Settings → Environment Variables** y agrega `GOOGLE_DRIVE_API_KEY` para Production, Preview y Development.
5. Vuelve a desplegar el proyecto.

Para desarrollo local, copia `.env.example` como `.env` y sustituye el valor de ejemplo. El archivo `.env` está excluido de Git y nunca debe subirse al repositorio.

## Idiomas

La navegación incluye un selector entre Español (Latinoamérica) e English. La preferencia queda guardada en el navegador y se aplica también a las fechas, metadatos, estados de sincronización y descripciones locales de los proyectos.

## Contacto

La sección final incluye accesos con iconos y comportamiento específico: correo mediante `mailto:`, perfil profesional de LinkedIn y repositorios de GitHub en pestañas nuevas seguras.

## Identidad visual

El sitio utiliza un favicon SVG corporativo con el monograma `ENAP`, correspondiente a Elihú Neftalí Ángeles Pérez, visible en la pestaña del navegador y reutilizado como logotipo en la navegación.
