/* =========================================================================
   DIBUJOS SVG (todos dibujados a mano, sin imágenes externas). Usan los colores del tema.
   ========================================================================= */
window.HW = window.HW || {};
HW.svg = {};
var T = 'font-family="var(--font-body)" fill="var(--fg)"';

/* Recorrido de los datos de un juego */
HW.svg.path = '<svg viewBox="0 0 640 250" role="img" aria-label="Recorrido de los datos: SSD, RAM, CPU, VRAM, GPU, monitor">' +
 '<defs><marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--accent)"/></marker></defs>' +
 [['SSD', 'Despensa', 10, 'Guarda el juego'], ['RAM', 'Encimera', 115, 'Lo que se usa ya'], ['CPU', 'Jefe de cocina', 220, 'Lógica, IA, física'], ['VRAM', 'Mesa pinches', 325, 'Texturas, modelos'], ['GPU', 'Ejército de pinches', 430, 'Dibuja cada píxel'], ['Monitor', 'Ventanilla', 535, 'Sale el plato']].map(function (b, i) {
   return '<g><rect x="' + b[2] + '" y="60" width="95" height="70" rx="10" fill="var(--surface2)" stroke="var(--line)" stroke-width="2"/>' +
   '<text x="' + (b[2] + 47) + '" y="90" text-anchor="middle" font-size="17" font-weight="700" ' + T + '>' + b[0] + '</text>' +
   '<text x="' + (b[2] + 47) + '" y="112" text-anchor="middle" font-size="11" font-family="var(--font-body)" fill="var(--accent)">' + b[1] + '</text>' +
   '<text x="' + (b[2] + 47) + '" y="160" text-anchor="middle" font-size="11" font-family="var(--font-body)" fill="var(--muted)">' + b[3] + '</text></g>' +
   (i < 5 ? '<line x1="' + (b[2] + 96) + '" y1="95" x2="' + (b[2] + 113) + '" y2="95" stroke="var(--accent)" stroke-width="3" marker-end="url(#ar)"/>' : '');
 }).join('') +
 '<text x="62" y="40" text-anchor="middle" font-size="11" font-family="var(--font-mono)" fill="var(--muted)">≈7 GB/s</text>' +
 '<text x="167" y="40" text-anchor="middle" font-size="11" font-family="var(--font-mono)" fill="var(--muted)">≈60-90 GB/s</text>' +
 '<text x="377" y="40" text-anchor="middle" font-size="11" font-family="var(--font-mono)" fill="var(--muted)">300-1800 GB/s</text>' +
 '<text x="272" y="40" text-anchor="middle" font-size="11" font-family="var(--font-mono)" fill="var(--muted)">PCIe x16</text>' +
 '<path d="M62 170 C 62 230, 377 230, 377 170" fill="none" stroke="var(--b)" stroke-width="2" stroke-dasharray="6 5"/>' +
 '<text x="220" y="240" text-anchor="middle" font-size="11" font-family="var(--font-body)" fill="var(--b)">DirectStorage: SSD → VRAM con menos trabajo para la CPU (descomprime la GPU)</text></svg>';

/* Placa base con conectores numerados (la usa también el juego de reconocer) */
HW.boardSpots = [
  { n: 1, x: 205, y: 150, k: 'Zócalo de la CPU', d: 'Donde va el procesador. Viene construido en la placa: decide qué CPU entran.' },
  { n: 2, x: 340, y: 150, k: 'Ranuras de RAM (DIMM)', d: 'Con 2 módulos van en A2 y B2 (la 2.ª y la 4.ª contando desde la CPU). Mira el manual.' },
  { n: 3, x: 435, y: 150, k: 'ATX 24 pines', d: 'Corriente principal de la placa, desde la fuente.' },
  { n: 4, x: 70, y: 40, k: 'EPS 4+4 / 8 pines (CPU)', d: 'Corriente del procesador. Se olvida mucho: sin él, no arranca.' },
  { n: 5, x: 180, y: 40, k: 'CPU_FAN', d: 'Cabezal de 4 pines del ventilador del disipador de la CPU.' },
  { n: 6, x: 60, y: 275, k: 'Ranura PCIe x16', d: 'Para la tarjeta gráfica. La de arriba suele ir directa a la CPU.' },
  { n: 7, x: 250, y: 245, k: 'M.2 (NVMe)', d: 'SSD en formato tarjeta, se atornilla. Puede compartir carriles con SATA.' },
  { n: 8, x: 440, y: 290, k: 'SATA de datos', d: 'Para SSD de 2,5" y discos duros. Llevan también cable SATA de corriente de la fuente.' },
  { n: 9, x: 360, y: 375, k: 'F_PANEL', d: 'Botón de encendido, reset y LED de la caja. Mira el dibujo del manual.' },
  { n: 10, x: 270, y: 375, k: 'USB 2.0 interno', d: 'Cabezal de 9 pines para los USB 2.0 de la caja.' },
  { n: 11, x: 440, y: 230, k: 'USB 3.0 interno (19 pines)', d: 'Conector grande y azul para los USB 3.0 frontales. Frágil: entra recto.' },
  { n: 12, x: 450, y: 70, k: 'USB-C frontal (Key-A)', d: 'Conector pequeño para el USB-C de la caja.' },
  { n: 13, x: 60, y: 375, k: 'HD_AUDIO', d: 'Audio frontal (cascos y micro) de la caja.' },
  { n: 14, x: 170, y: 375, k: 'ARGB 5 V (3 pines) / RGB 12 V (4 pines)', d: 'No los confundas: un ARGB de 5 V en un cabezal de 12 V se quema.' },
  { n: 15, x: 455, y: 375, k: 'SYS_FAN / CHA_FAN', d: 'Ventiladores de la caja.' },
  { n: 16, x: 300, y: 40, k: 'AIO_PUMP', d: 'Bomba de la refrigeración líquida, a máxima velocidad siempre.' },
  { n: 17, x: 20, y: 150, k: 'Panel trasero (I/O)', d: 'USB, red y salidas de vídeo de la placa. Con gráfica dedicada, el monitor NO va aquí.' }
];
HW.svg.board = function (opts) {
  opts = opts || {};
  var hide = opts.hideLabels;
  var s = '<svg viewBox="0 0 520 410" role="img" aria-label="Placa base con sus conectores numerados">' +
  '<rect x="5" y="5" width="510" height="400" rx="10" fill="var(--pcb)" stroke="var(--line)" stroke-width="2"/>' +
  '<rect x="10" y="25" width="30" height="190" rx="4" fill="var(--svg-dark)"/>' +
  // VRM
  '<rect x="60" y="80" width="260" height="22" rx="4" fill="var(--svg-dark)"/><rect x="60" y="80" width="22" height="140" rx="4" fill="var(--svg-dark)"/>' +
  '<text x="190" y="95" text-anchor="middle" font-size="10" font-family="var(--font-mono)" fill="var(--bg)">VRM</text>' +
  // socket
  '<rect x="150" y="110" width="110" height="110" rx="6" fill="var(--svg-fill)" stroke="var(--fg)" stroke-width="2"/>' +
  '<rect x="170" y="130" width="70" height="70" rx="4" fill="none" stroke="var(--muted)" stroke-dasharray="3 3"/>' +
  // ram
  [0, 1, 2, 3].map(function (i) { return '<rect x="' + (300 + i * 22) + '" y="40" width="12" height="200" rx="3" fill="' + (i % 2 ? 'var(--accent)' : 'var(--svg-fill)') + '" stroke="var(--line)"/>'; }).join('') +
  '<text x="322" y="255" text-anchor="middle" font-size="9" font-family="var(--font-mono)" fill="var(--bg)">A1 A2 B1 B2</text>' +
  // 24 pin
  '<rect x="400" y="95" width="22" height="120" rx="3" fill="var(--svg-fill)" stroke="var(--line)"/>' +
  // eps
  '<rect x="55" y="25" width="34" height="16" rx="3" fill="var(--svg-fill)"/>' +
  // cpu fan, aio
  '<rect x="165" y="25" width="30" height="10" rx="2" fill="var(--svg-fill)"/><rect x="285" y="25" width="30" height="10" rx="2" fill="var(--svg-fill)"/>' +
  // pcie
  '<rect x="40" y="265" width="330" height="16" rx="3" fill="var(--svg-fill)" stroke="var(--fg)"/>' +
  '<rect x="40" y="320" width="330" height="12" rx="3" fill="var(--svg-dark)"/>' +
  // m2
  '<rect x="170" y="238" width="160" height="14" rx="3" fill="var(--svg-dark)"/>' +
  // chipset
  '<rect x="395" y="300" width="50" height="50" rx="4" fill="var(--svg-dark)"/><text x="420" y="329" text-anchor="middle" font-size="9" font-family="var(--font-mono)" fill="var(--bg)">CHIPSET</text>' +
  // sata
  '<rect x="465" y="270" width="30" height="40" rx="3" fill="var(--svg-fill)"/>' +
  // usb3
  '<rect x="470" y="215" width="20" height="34" rx="3" fill="var(--b)"/><rect x="470" y="60" width="16" height="18" rx="2" fill="var(--svg-fill)"/>' +
  // bottom headers
  [50, 160, 260, 350, 445].map(function (x) { return '<rect x="' + x + '" y="385" width="40" height="10" rx="2" fill="var(--svg-fill)"/>'; }).join('');
  HW.boardSpots.forEach(function (p) {
    s += '<g class="hot" data-spot="' + p.n + '" tabindex="0"><circle cx="' + p.x + '" cy="' + p.y + '" r="11" fill="var(--accent)" stroke="var(--bg)" stroke-width="2"/>' +
      '<text x="' + p.x + '" y="' + (p.y + 4) + '" text-anchor="middle" font-size="11" font-weight="700" font-family="var(--font-mono)" fill="var(--accent-fg)">' + p.n + '</text></g>';
  });
  return s + '</svg>';
};

/* Tarjeta gráfica sin disipador */
HW.svg.gpu = '<svg viewBox="0 0 560 250" role="img" aria-label="Tarjeta gráfica sin disipador">' +
 '<rect x="10" y="20" width="520" height="170" rx="8" fill="var(--pcb)"/>' +
 '<rect x="40" y="190" width="300" height="22" rx="2" fill="var(--warn)"/><text x="190" y="206" text-anchor="middle" font-size="11" font-family="var(--font-mono)" fill="var(--bg)">PCIe x16 (contactos dorados)</text>' +
 '<rect x="530" y="10" width="20" height="200" fill="var(--svg-dark)"/><text x="540" y="235" text-anchor="middle" font-size="10" ' + T + '>Salidas</text>' +
 '<rect x="220" y="65" width="90" height="80" rx="4" fill="var(--svg-fill)" stroke="var(--fg)" stroke-width="2"/><text x="265" y="110" text-anchor="middle" font-size="13" font-weight="700" ' + T + '>GPU</text>' +
 [[160, 55], [160, 95], [160, 135], [330, 55], [330, 95], [330, 135]].map(function (p) { return '<rect x="' + p[0] + '" y="' + p[1] + '" width="34" height="24" rx="2" fill="var(--svg-dark)"/>'; }).join('') +
 '<text x="177" y="45" text-anchor="middle" font-size="10" ' + T + '>VRAM</text><text x="347" y="45" text-anchor="middle" font-size="10" ' + T + '>VRAM</text>' +
 [0, 1, 2, 3, 4, 5].map(function (i) { return '<rect x="' + (400 + i * 18) + '" y="60" width="12" height="20" rx="2" fill="var(--svg-fill)"/>'; }).join('') +
 '<text x="445" y="100" text-anchor="middle" font-size="10" ' + T + '>VRM de la gráfica</text>' +
 '<rect x="40" y="30" width="60" height="22" rx="3" fill="var(--svg-fill)" stroke="var(--fg)"/><text x="70" y="70" text-anchor="middle" font-size="10" ' + T + '>Conector</text><text x="70" y="82" text-anchor="middle" font-size="10" ' + T + '>8 pines / 12V-2x6</text>' +
 '<text x="265" y="160" text-anchor="middle" font-size="10" font-family="var(--font-body)" fill="var(--muted)">Cada chip de VRAM se conecta por 32 bits: 6 chips = bus de 192 bits</text></svg>';

/* Cocina: la analogía completa */
HW.svg.kitchen = '<svg viewBox="0 0 600 300" role="img" aria-label="La cocina del restaurante como un PC">' +
 '<rect x="5" y="5" width="590" height="290" rx="12" fill="var(--surface2)" stroke="var(--line)"/>' +
 '<text x="20" y="28" font-size="12" font-weight="700" ' + T + '>EL EDIFICIO = PLACA BASE</text>' +
 '<rect x="20" y="45" width="110" height="200" rx="8" fill="var(--surface)" stroke="var(--line)"/><text x="75" y="70" text-anchor="middle" font-size="12" font-weight="700" ' + T + '>Despensa</text><text x="75" y="86" text-anchor="middle" font-size="11" fill="var(--muted)" font-family="var(--font-body)">SSD / HDD</text>' +
 '<rect x="150" y="45" width="190" height="60" rx="8" fill="var(--accent-soft)" stroke="var(--accent)"/><text x="245" y="70" text-anchor="middle" font-size="12" font-weight="700" ' + T + '>Encimera = RAM</text><text x="245" y="88" text-anchor="middle" font-size="11" fill="var(--muted)" font-family="var(--font-body)">Doble canal: encimera completa</text>' +
 '<circle cx="245" cy="155" r="34" fill="var(--surface)" stroke="var(--fg)" stroke-width="2"/><text x="245" y="152" text-anchor="middle" font-size="12" font-weight="700" ' + T + '>Jefe</text><text x="245" y="167" text-anchor="middle" font-size="10" fill="var(--muted)" font-family="var(--font-body)">CPU</text>' +
 '<rect x="290" y="140" width="40" height="14" rx="3" fill="var(--accent)"/><text x="310" y="170" text-anchor="middle" font-size="9" fill="var(--muted)" font-family="var(--font-body)">bandeja = caché</text>' +
 '<rect x="360" y="45" width="215" height="150" rx="8" fill="var(--b-soft)" stroke="var(--b)"/><text x="467" y="68" text-anchor="middle" font-size="12" font-weight="700" ' + T + '>Pinches = GPU</text>' +
 Array.apply(null, Array(24)).map(function (_, i) { return '<circle cx="' + (380 + (i % 8) * 24) + '" cy="' + (95 + Math.floor(i / 8) * 22) + '" r="7" fill="var(--b)"/>'; }).join('') +
 '<text x="467" y="180" text-anchor="middle" font-size="11" fill="var(--muted)" font-family="var(--font-body)">su mesa = VRAM (soldada)</text>' +
 '<rect x="360" y="210" width="215" height="35" rx="8" fill="var(--surface)" stroke="var(--line)"/><text x="467" y="232" text-anchor="middle" font-size="11" ' + T + '>Ventanilla al comedor = monitor</text>' +
 '<rect x="150" y="210" width="190" height="35" rx="8" fill="var(--surface)" stroke="var(--line)"/><text x="245" y="232" text-anchor="middle" font-size="11" ' + T + '>Acometida = fuente de alimentación</text>' +
 '<text x="20" y="275" font-size="11" fill="var(--muted)" font-family="var(--font-body)">Camareros de la presión (VRM) · Encargado (chipset) · Campana (refrigeración) · Local (caja)</text></svg>';

/* Núcleos, hilos y caché */
HW.svg.cpu = '<svg viewBox="0 0 600 230" role="img" aria-label="Dentro de un procesador: núcleos, cachés">' +
 '<rect x="5" y="5" width="590" height="220" rx="10" fill="var(--surface2)" stroke="var(--line)"/>' +
 [0, 1, 2, 3, 4, 5].map(function (i) { var x = 20 + i * 70; return '<rect x="' + x + '" y="20" width="60" height="70" rx="6" fill="var(--accent-soft)" stroke="var(--accent)"/><text x="' + (x + 30) + '" y="45" text-anchor="middle" font-size="11" font-weight="700" ' + T + '>P-core</text><rect x="' + (x + 8) + '" y="55" width="20" height="10" fill="var(--accent)"/><rect x="' + (x + 32) + '" y="55" width="20" height="10" fill="var(--accent)"/><text x="' + (x + 30) + '" y="82" text-anchor="middle" font-size="9" fill="var(--muted)" font-family="var(--font-body)">L1 + L2</text>'; }).join('') +
 [0, 1, 2, 3].map(function (i) { var x = 445 + (i % 2) * 70, y = 20 + Math.floor(i / 2) * 38; return '<rect x="' + x + '" y="' + y + '" width="60" height="32" rx="5" fill="var(--b-soft)" stroke="var(--b)"/><text x="' + (x + 30) + '" y="' + (y + 20) + '" text-anchor="middle" font-size="10" ' + T + '>4 E-cores</text>'; }).join('') +
 '<rect x="20" y="105" width="555" height="40" rx="6" fill="var(--svg-fill)" stroke="var(--fg)"/><text x="297" y="130" text-anchor="middle" font-size="12" font-weight="700" ' + T + '>Caché L3 compartida (en X3D: una capa extra encima o debajo, 64 MB más)</text>' +
 '<rect x="20" y="160" width="555" height="50" rx="6" fill="var(--surface)" stroke="var(--line)"/><text x="297" y="182" text-anchor="middle" font-size="11" ' + T + '>Controlador de memoria → RAM · Carriles PCIe → gráfica y M.2 · Gráfica integrada (si no es "F")</text>' +
 '<text x="297" y="200" text-anchor="middle" font-size="10" fill="var(--muted)" font-family="var(--font-body)">2 rectángulos por P-core = 2 hilos (Hyper-Threading / SMT): las dos manos del chef</text></svg>';

/* Doble canal */
HW.svg.dual = '<svg viewBox="0 0 560 170" role="img" aria-label="Doble canal frente a un solo módulo">' +
 '<text x="140" y="20" text-anchor="middle" font-size="12" font-weight="700" ' + T + '>1 módulo: media encimera</text>' +
 '<text x="420" y="20" text-anchor="middle" font-size="12" font-weight="700" ' + T + '>2 módulos en A2 + B2: encimera completa</text>' +
 ['A1', 'A2', 'B1', 'B2'].map(function (l, i) { var x = 50 + i * 50; return '<rect x="' + x + '" y="35" width="16" height="110" rx="3" fill="' + (i === 1 ? 'var(--accent)' : 'var(--svg-fill)') + '" stroke="var(--line)"/><text x="' + (x + 8) + '" y="162" text-anchor="middle" font-size="10" font-family="var(--font-mono)" fill="var(--muted)">' + l + '</text>'; }).join('') +
 ['A1', 'A2', 'B1', 'B2'].map(function (l, i) { var x = 330 + i * 50; return '<rect x="' + x + '" y="35" width="16" height="110" rx="3" fill="' + (i === 1 || i === 3 ? 'var(--accent)' : 'var(--svg-fill)') + '" stroke="var(--line)"/><text x="' + (x + 8) + '" y="162" text-anchor="middle" font-size="10" font-family="var(--font-mono)" fill="var(--muted)">' + l + '</text>'; }).join('') +
 '<text x="140" y="95" text-anchor="middle" font-size="11" font-family="var(--font-mono)" fill="var(--bad)" transform="translate(110 0)">64 bits</text>' +
 '<text x="420" y="95" text-anchor="middle" font-size="11" font-family="var(--font-mono)" fill="var(--ok)" transform="translate(110 0)">128 bits</text></svg>';

/* Conectores de la fuente */
HW.svg.psu = '<svg viewBox="0 0 600 200" role="img" aria-label="Conectores de la fuente de alimentación">' +
 (function () {
   function pins(x, y, cols, rows, lbl, sub, col) {
     var r = '<rect x="' + x + '" y="' + y + '" width="' + (cols * 14 + 8) + '" height="' + (rows * 14 + 8) + '" rx="4" fill="var(--surface2)" stroke="' + (col || 'var(--fg)') + '" stroke-width="2"/>';
     for (var i = 0; i < cols; i++) for (var j = 0; j < rows; j++) r += '<rect x="' + (x + 5 + i * 14) + '" y="' + (y + 5 + j * 14) + '" width="10" height="10" rx="2" fill="var(--svg-dark)"/>';
     return r + '<text x="' + (x + (cols * 14 + 8) / 2) + '" y="' + (y + rows * 14 + 26) + '" text-anchor="middle" font-size="11" font-weight="700" ' + T + '>' + lbl + '</text>' +
       '<text x="' + (x + (cols * 14 + 8) / 2) + '" y="' + (y + rows * 14 + 40) + '" text-anchor="middle" font-size="10" fill="var(--muted)" font-family="var(--font-body)">' + sub + '</text>';
   }
   return pins(10, 30, 12, 2, 'ATX 24 pines', 'a la placa') + pins(210, 30, 4, 2, 'EPS 4+4', 'CPU (arriba izq.)', 'var(--accent)') +
     pins(300, 30, 4, 2, 'PCIe 6+2', 'gráfica', 'var(--b)') + pins(390, 30, 8, 2, '12V-2x6', 'gráfica moderna', 'var(--b)') +
     '<rect x="520" y="40" width="60" height="14" rx="3" fill="var(--surface2)" stroke="var(--fg)" stroke-width="2"/><text x="550" y="80" text-anchor="middle" font-size="11" font-weight="700" ' + T + '>SATA</text><text x="550" y="94" text-anchor="middle" font-size="10" fill="var(--muted)" font-family="var(--font-body)">corriente</text>';
 })() +
 '<text x="300" y="150" text-anchor="middle" font-size="11" fill="var(--bad)" font-family="var(--font-body)">EPS y PCIe tienen 8 pines y se parecen, pero sus pestañas y cableado son distintos. Nunca fuerces.</text>' +
 '<text x="300" y="172" text-anchor="middle" font-size="11" fill="var(--muted)" font-family="var(--font-body)">12V-2x6: empuja hasta oír el clic y que no quede hueco. Sin doblar el cable pegado al conector.</text></svg>';

/* Flujo de aire */
HW.svg.airflow = '<svg viewBox="0 0 560 240" role="img" aria-label="Flujo de aire en la caja">' +
 '<defs><marker id="af" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--b)"/></marker><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--bad)"/></marker></defs>' +
 '<rect x="90" y="20" width="380" height="200" rx="10" fill="var(--surface2)" stroke="var(--fg)" stroke-width="2"/>' +
 '<text x="100" y="40" font-size="11" ' + T + '>Frontal: entra aire frío</text><text x="460" y="40" text-anchor="end" font-size="11" ' + T + '>Trasera y techo: sale caliente</text>' +
 [70, 120, 170].map(function (y) { return '<line x1="20" y1="' + y + '" x2="120" y2="' + y + '" stroke="var(--b)" stroke-width="3" marker-end="url(#af)"/>'; }).join('') +
 '<line x1="440" y1="80" x2="540" y2="80" stroke="var(--bad)" stroke-width="3" marker-end="url(#ah)"/>' +
 '<line x1="320" y1="40" x2="320" y2="5" stroke="var(--bad)" stroke-width="3" marker-end="url(#ah)"/><line x1="380" y1="40" x2="380" y2="5" stroke="var(--bad)" stroke-width="3" marker-end="url(#ah)"/>' +
 '<rect x="260" y="60" width="60" height="70" rx="4" fill="var(--svg-fill)"/><text x="290" y="100" text-anchor="middle" font-size="10" ' + T + '>CPU</text>' +
 '<rect x="160" y="150" width="240" height="28" rx="4" fill="var(--svg-dark)"/><text x="280" y="168" text-anchor="middle" font-size="10" font-family="var(--font-body)" fill="var(--bg)">Gráfica</text>' +
 '<text x="280" y="210" text-anchor="middle" font-size="11" fill="var(--muted)" font-family="var(--font-body)">Más aire entrando que saliendo = presión positiva (menos polvo)</text></svg>';

/* Placa por tamaño */
HW.svg.formats = '<svg viewBox="0 0 560 220" role="img" aria-label="Formatos de placa base">' +
 '<rect x="10" y="10" width="244" height="200" rx="6" fill="var(--surface2)" stroke="var(--fg)"/><text x="132" y="110" text-anchor="middle" font-size="13" font-weight="700" ' + T + '>ATX</text><text x="132" y="128" text-anchor="middle" font-size="10" fill="var(--muted)" font-family="var(--font-mono)">305 × 244 mm</text>' +
 '<rect x="280" y="45" width="165" height="165" rx="6" fill="var(--surface2)" stroke="var(--fg)"/><text x="362" y="125" text-anchor="middle" font-size="13" font-weight="700" ' + T + '>Micro-ATX</text><text x="362" y="143" text-anchor="middle" font-size="10" fill="var(--muted)" font-family="var(--font-mono)">244 × 244 mm</text>' +
 '<rect x="465" y="115" width="91" height="95" rx="6" fill="var(--surface2)" stroke="var(--fg)"/><text x="510" y="160" text-anchor="middle" font-size="12" font-weight="700" ' + T + '>Mini-ITX</text><text x="510" y="176" text-anchor="middle" font-size="9" fill="var(--muted)" font-family="var(--font-mono)">170 × 170</text></svg>';

/* Almacenamiento */
HW.svg.storage = '<svg viewBox="0 0 560 170" role="img" aria-label="HDD, SSD SATA y SSD M.2 NVMe">' +
 '<rect x="10" y="20" width="150" height="110" rx="8" fill="var(--svg-dark)"/><circle cx="85" cy="75" r="40" fill="var(--svg-fill)"/><circle cx="85" cy="75" r="6" fill="var(--svg-dark)"/><text x="85" y="152" text-anchor="middle" font-size="11" font-weight="700" ' + T + '>HDD · ≈200 MB/s</text>' +
 '<rect x="190" y="30" width="140" height="95" rx="6" fill="var(--svg-fill)" stroke="var(--fg)"/><text x="260" y="82" text-anchor="middle" font-size="11" ' + T + '>2,5"</text><text x="260" y="152" text-anchor="middle" font-size="11" font-weight="700" ' + T + '>SSD SATA · ≈550 MB/s</text>' +
 '<rect x="360" y="60" width="190" height="34" rx="4" fill="var(--pcb)"/><rect x="380" y="66" width="40" height="22" fill="var(--svg-dark)"/><rect x="430" y="66" width="40" height="22" fill="var(--svg-dark)"/><rect x="480" y="66" width="40" height="22" fill="var(--svg-dark)"/><text x="455" y="152" text-anchor="middle" font-size="11" font-weight="700" ' + T + '>M.2 NVMe · 3.500-14.000 MB/s</text>' +
 '<text x="455" y="120" text-anchor="middle" font-size="10" fill="var(--muted)" font-family="var(--font-body)">M.2 = la forma · NVMe = el idioma</text></svg>';

/* Cuello de botella */
HW.svg.bottle = '<svg viewBox="0 0 560 150" role="img" aria-label="Cuello de botella">' +
 '<text x="10" y="20" font-size="12" font-weight="700" ' + T + '>Platos por minuto que puede preparar cada uno</text>' +
 '<rect x="10" y="35" width="400" height="26" rx="4" fill="var(--accent)"/><text x="20" y="53" font-size="12" font-family="var(--font-body)" fill="var(--accent-fg)">Jefe (CPU): 140 FPS</text>' +
 '<rect x="10" y="70" width="170" height="26" rx="4" fill="var(--b)"/><text x="20" y="88" font-size="12" font-family="var(--font-body)" fill="var(--surface)">Pinches (GPU): 60 FPS</text>' +
 '<text x="10" y="125" font-size="12" ' + T + '>Salen 60 FPS: manda el más lento. Mejorar la CPU aquí no da ni un FPS.</text></svg>';

/* Placa VRM */
HW.svg.vrm = '<svg viewBox="0 0 560 140" role="img" aria-label="Cómo funciona el VRM">' +
 '<defs><marker id="av" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--accent)"/></marker></defs>' +
 '<rect x="10" y="40" width="110" height="60" rx="8" fill="var(--surface2)" stroke="var(--fg)"/><text x="65" y="68" text-anchor="middle" font-size="12" font-weight="700" ' + T + '>Fuente</text><text x="65" y="86" text-anchor="middle" font-size="11" font-family="var(--font-mono)" fill="var(--muted)">12 V</text>' +
 '<line x1="122" y1="70" x2="180" y2="70" stroke="var(--accent)" stroke-width="3" marker-end="url(#av)"/>' +
 [0, 1, 2, 3, 4, 5, 6, 7].map(function (i) { return '<rect x="' + (185 + i * 26) + '" y="45" width="20" height="50" rx="3" fill="var(--svg-dark)"/>'; }).join('') +
 '<text x="285" y="118" text-anchor="middle" font-size="11" ' + T + '>Fases del VRM (los camareros)</text>' +
 '<line x1="395" y1="70" x2="440" y2="70" stroke="var(--accent)" stroke-width="3" marker-end="url(#av)"/>' +
 '<rect x="445" y="40" width="105" height="60" rx="8" fill="var(--accent-soft)" stroke="var(--accent)"/><text x="497" y="68" text-anchor="middle" font-size="12" font-weight="700" ' + T + '>CPU</text><text x="497" y="86" text-anchor="middle" font-size="11" font-family="var(--font-mono)" fill="var(--muted)">≈1,2 V · 150 A</text></svg>';

/* Icono de marca */
HW.svg.logo = '<svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true"><rect x="6" y="6" width="20" height="20" rx="4" fill="var(--accent)"/><rect x="11" y="11" width="10" height="10" rx="2" fill="var(--surface)"/>' +
 [9, 14, 19, 23].map(function (p) { return '<rect x="' + p + '" y="1" width="2" height="5" fill="var(--accent)"/><rect x="' + p + '" y="26" width="2" height="5" fill="var(--accent)"/><rect x="1" y="' + p + '" width="5" height="2" fill="var(--accent)"/><rect x="26" y="' + p + '" width="5" height="2" fill="var(--accent)"/>'; }).join('') + '</svg>';

/* Iconos de la barra inferior */
HW.icons = {
  aprender: '<path d="M4 5h7a3 3 0 0 1 3 3v12a2 2 0 0 0-2-2H4z"/><path d="M20 5h-4a3 3 0 0 0-2 1"/><path d="M20 5v13h-6"/>',
  catalogo: '<rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="4" width="7" height="7" rx="1"/><rect x="4" y="13" width="7" height="7" rx="1"/><rect x="13" y="13" width="7" height="7" rx="1"/>',
  comparar: '<path d="M12 3v18"/><path d="M5 8l-3 6h6z"/><path d="M19 8l-3 6h6z"/><path d="M5 6h14"/>',
  nombres: '<path d="M4 7V5h16v2"/><path d="M12 5v14"/><path d="M8 19h8"/>',
  herramientas: '<path d="M14 6a4 4 0 0 0 5 5l-8 8a2 2 0 0 1-3-3z"/><path d="M14 6l3-3 4 4-3 3"/>',
  practicar: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1"/>',
  glosario: '<path d="M5 4h11l3 3v13H5z"/><path d="M9 9h6M9 13h6M9 17h4"/>'
};
