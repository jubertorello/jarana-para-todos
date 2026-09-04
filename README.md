# Jarana Para Todos — landing

Next.js 14 (App Router). Deploy en Vercel sin configuración extra.

## Arrancar en local

\`\`\`bash
npm install
cp .env.example .env.local   # rellena los valores
npm run dev
\`\`\`

## Variables de entorno

| Variable | Qué es |
| --- | --- |
| \`BEHOLD_FEED_URL\` | URL del feed JSON de Behold. En behold.so conectas \`@jarana_para_todos\`, plan gratis, y copias la URL. Sin esta variable la grid muestra placeholders. |
| \`NEXT_PUBLIC_TICKET_URL\` | Enlace de venta. Por defecto \`https://site.fourvenues.com/es/jarana\`. |
| \`NEXT_PUBLIC_WHATSAPP\` | Número en formato internacional sin \`+\` ni espacios. |
| \`NEXT_PUBLIC_IG_HANDLE\` | Handle con arroba. |

En Vercel: Project Settings → Environment Variables. Las mismas cuatro.

## Instagram

\`lib/instagram.js\` lee el feed **en el servidor** con \`revalidate: 600\` (se refresca cada 10 min, cacheado por Vercel). Si el fetch falla o no hay variable, cae a placeholders — la página nunca se rompe.

## Pendiente

- **Vídeos**: servidos desde Cloudinary con \`f_auto:video,q_auto\` (Cloudinary transcodifica y elige formato/bitrate por dispositivo). Las URLs están al principio de \`components/Landing.jsx\`. No hay vídeo en el repo.
- **Tipografía**: falta \`public/assets/fonts/Arsenica-ExtraBold.woff2\`. Sin ella los titulares caen a Montserrat 700.
- **Logos de prensa**: sustituir los placeholders de \`PARTNERS\` en \`lib/copy.js\` por \`<img>\` reales.
- **Legales**: los enlaces del footer apuntan a \`#\`.
