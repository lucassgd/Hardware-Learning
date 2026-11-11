// Junta todo en un único HTML que funciona sin conexión.
// dist/la-cocina-del-pc.html → documento completo (ábrelo en el móvil o en el PC).
// dist/artifact.html → mismo contenido sin <html>/<head>/<body> (para publicarlo como Artifact).
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
const r = (p) => readFileSync(new URL(p, import.meta.url), 'utf8');
const css = r('./src/styles.css');
const order = ['data/cpus.js', 'data/gpus.js', 'data/platform.js', 'data/svg.js', 'data/lessons1.js', 'data/lessons2.js', 'data/questions.js', 'data/glossary.js',
  'js/engine.js', 'js/core.js', 'js/ui.js', 'js/tools.js', 'js/practice.js', 'js/main.js'];
const js = order.map((f) => `/* ==== ${f} ==== */\n` + r('./src/' + f)).join('\n');
const body = r('./src/index.html');
const head = `<title>La Cocina del PC</title>
<meta name="claude:viewport-fit-sides" content="cover">
<meta name="description" content="Aprende hardware de PC desde cero hasta nivel experto: lecciones, catálogo, comparador razonado y práctica.">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=JetBrains+Mono:wght@400;700&family=Space+Grotesk:wght@500;700&display=swap">
<style>${css}</style>`;
const scripts = `<script>${js.replace(/<\/script/gi, '<\\/script')}</script>`;
mkdirSync(new URL('./dist/', import.meta.url), { recursive: true });
writeFileSync(new URL('./dist/artifact.html', import.meta.url), `${head}\n${body}\n${scripts}\n`);
writeFileSync(new URL('./dist/la-cocina-del-pc.html', import.meta.url), `<!doctype html>\n<html lang="es">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n<meta name="theme-color" content="#0e1318">\n${head}\n</head>\n<body>\n${body}\n${scripts}\n</body>\n</html>\n`);
console.log('OK', (Buffer.byteLength(css + js + body) / 1024).toFixed(0) + ' KB');
