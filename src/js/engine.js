/* =========================================================================
   LÓGICA · MOTOR DE REGLAS (sin interfaz). Todo funciona a partir de los datos,
   así que sirve para cualquier pareja de piezas del catálogo.
   ========================================================================= */
window.HW = window.HW || {};
HW.E = (function () {
  var E = {};
  function norm(s) { return String(s || '').toLowerCase().replace(/^(amd|intel|nvidia|geforce|radeon)\s+/g, '').replace(/geforce\s+|radeon\s+/g, '').replace(/[^a-z0-9+]/g, ''); }
  E.norm = norm;
  function normCpu(s) { return norm(s).replace(/^intel/, '').replace(/^amd/, '').replace(/^core(?=i\d)/, ''); }
  E.findCpu = function (n) { var k = normCpu(n); return HW.cpus.find(function (c) { return normCpu(c.n) === k || c.id === n; }); };
  E.findGpu = function (n) { var k = norm(n); return HW.gpus.find(function (g) { return norm(g.n) === k || g.id === n; }); };
  E.byId = function (id) { return HW.cpus.find(function (c) { return c.id === id; }) || HW.gpus.find(function (g) { return g.id === id; }); };
  E.arch = function (c) { return HW.archs[c.arch] || { name: c.arch, ipc: 140, y: c.y, gen: 0 }; };
  E.pct = function (a, b) { return Math.round((a / b - 1) * 100); };
  E.fmt = function (x, d) { if (x == null || isNaN(x)) return '—'; return Number(x).toLocaleString('es-ES', { maximumFractionDigits: d == null ? 1 : d }); };
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  E.cap = cap;

  /* ---------------- Procesadores: métricas derivadas ---------------- */
  E.perCore = function (c) { return E.arch(c).ipc * c.bo / 100; };          // ≈ IPC × GHz
  E.effCores = function (c) { return c.c + 0.55 * c.e + 0.35 * (c.lpe || 0); }; // un E-core rinde ≈ 50-60 % de un P-core (aprox.)
  E.tier = function (c) { var m = c.n.match(/(?:i|Ryzen |Ultra |Core )([3579])\b/); if (/Ultra X/.test(c.n)) { var x = c.n.match(/X([579])/); return x ? +x[1] : 7; } return m ? +m[1] : 5; };
  E.gameIdx = function (c) {
    if (c.g != null) return { v: c.g, est: c.conf !== 'rev' };
    // Portátiles (muy aproximado): 1) "equivalente de sobremesa" con una regresión ajustada a los
    // índices de los procesadores de sobremesa (error medio ≈ 3 puntos); 2) recorte según la potencia
    // sostenida (TDP), porque en portátil el chef trabaja con menos agua y gas.
    var desk = 8.1 * E.perCore(c) + 0.93 * Math.log2(c.l3) + 1.7 * Math.min(E.effCores(c), 8) - 9.5 + (c.x3d ? 6 : 0);
    var f = c.tdp >= 55 ? .92 : c.tdp >= 35 ? .88 : c.tdp >= 25 ? .84 : .74;
    return { v: Math.round(desk * f), est: true };
  };
  E.cpuPrice = function (c) { var p = HW.prices.cpu[c.n]; return p ? { v: p, cur: '€', note: 'precio orientativo ' + HW.PRICE_DATE } : (c.msrp ? { v: c.msrp, cur: '$', note: 'precio de salida' } : null); };
  E.alive = function (c) {
    var s = c.socket;
    if (s === 'AM5') return { ok: true, t: 'AM5 seguirá recibiendo procesadores (AMD habla de soporte hasta 2027 o más; Zen 6 apunta a AM5, por verificar).' };
    if (s === 'AM4') return { ok: false, t: 'AM4 está terminada: lo máximo que pondrás es un Ryzen 7 5800X3D / 5700X3D.' };
    if (s === 'LGA1700') return { ok: false, t: 'LGA1700 está terminada: el techo es un i9-14900K.' };
    if (s === 'LGA1851') return { ok: false, t: 'LGA1851 no tendrá más generaciones: Nova Lake cambiará a LGA1954.' };
    if (/BGA/.test(s)) return { ok: false, t: 'En portátil el procesador va soldado: no se cambia.' };
    return { ok: false, t: s + ' es una plataforma antigua y terminada.' };
  };

  var USES = {
    g1080: { t: 'juegos a 1080p', w: { game: .7, core: .15, eff: .05, price: .1 }, scale: 1 },
    g1440: { t: 'juegos a 1440p', w: { game: .65, core: .15, eff: .05, price: .15 }, scale: .6 },
    g4k:   { t: 'juegos a 4K', w: { game: .55, core: .1, eff: .1, price: .25 }, scale: .3 },
    stream:{ t: 'jugar y hacer streaming', w: { game: .45, multi: .35, eff: .05, price: .15 }, scale: 1 },
    edit:  { t: 'edición de vídeo y render 3D', w: { multi: .75, core: .1, eff: .05, price: .1 }, scale: 1 },
    prog:  { t: 'programación (compilar, máquinas virtuales)', w: { multi: .5, core: .35, eff: .05, price: .1 }, scale: 1 },
    ai:    { t: 'IA local', w: { multi: .35, core: .25, eff: .1, price: .3 }, scale: 1 },
    eff:   { t: 'eficiencia y silencio', w: { eff: .6, game: .15, multi: .15, price: .1 }, scale: 1 },
    value: { t: 'relación calidad-precio', w: { value: .7, game: .15, multi: .15 }, scale: 1 }
  };
  E.USES = USES;

  E.compareCpu = function (a, b, use) {
    var U = USES[use] || USES.g1080, A = E.arch(a), B = E.arch(b);
    var ga = E.gameIdx(a), gb = E.gameIdx(b), pa = E.cpuPrice(a), pb = E.cpuPrice(b);
    var va = { game: ga.v, multi: a.m, core: E.perCore(a), eff: 1 / a.pmax, value: null };
    var vb = { game: gb.v, multi: b.m, core: E.perCore(b), eff: 1 / b.pmax, value: null };
    if (pa && pb && pa.cur === pb.cur) { va.price = 1 / pa.v; vb.price = 1 / pb.v; va.value = (ga.v + a.m) / 2 / pa.v; vb.value = (gb.v + b.m) / 2 / pb.v; }
    function d(k) { var x = va[k], y = vb[k]; if (x == null || y == null) return 0; return (x - y) / Math.max(x, y); }
    var score = 0;
    Object.keys(U.w).forEach(function (k) { score += U.w[k] * d(k) * (k === 'game' ? U.scale : 1); });
    var R = [], traps = [], side = function (s) { return s > 0 ? 'a' : s < 0 ? 'b' : null; };
    var N = { a: a.n, b: b.n };
    function W(s) { return N[s]; }

    // 1. Arquitectura e IPC
    if (A.name !== B.name) {
      var newer = A.y > B.y ? 'a' : A.y < B.y ? 'b' : (A.ipc >= B.ipc ? 'a' : 'b');
      var ipcGap = Math.round((Math.max(A.ipc, B.ipc) / Math.min(A.ipc, B.ipc) - 1) * 100);
      R.push({ s: newer, k: 'arch', t: W(newer) + ' usa una arquitectura más nueva (' + (newer === 'a' ? A.name + ', ' + A.y : B.name + ', ' + B.y) + ' frente a ' + (newer === 'a' ? B.name + ', ' + B.y : A.name + ', ' + A.y) + '). ' + (ipcGap >= 3 ? 'Eso da ≈' + ipcGap + ' % más IPC (trabajo por cada movimiento de manos del chef; cifra aproximada).' : 'El IPC es casi el mismo.') });
    } else {
      R.push({ s: null, k: 'arch', t: 'Los dos usan la misma arquitectura (' + A.name + '): el IPC es igual. Aquí decide la ficha: núcleos, GHz y caché.' });
    }
    // 2. Rendimiento por núcleo
    var pc = E.pct(va.core, vb.core);
    if (Math.abs(pc) >= 3) R.push({ s: side(pc), k: 'core', t: 'Rendimiento por núcleo ≈ IPC × GHz turbo: ' + W(side(pc)) + ' saca ≈' + Math.abs(pc) + ' % más por núcleo (' + E.fmt(Math.max(a.bo, b.bo) === a.bo ? a.bo : b.bo) + ' frente a ' + E.fmt(Math.max(a.bo, b.bo) === a.bo ? b.bo : a.bo) + ' GHz y su IPC).' });
    else R.push({ s: null, k: 'core', t: 'Por núcleo van casi empatados (diferencia < 3 %, estimado como IPC × GHz).' });
    // 3. Núcleos según el uso
    var ea = E.effCores(a), eb = E.effCores(b);
    var gameUse = /^g/.test(use) || use === 'stream';
    if (gameUse) {
      var okA = a.c >= 6 && a.t >= 12 || a.c >= 8, okB = b.c >= 6 && b.t >= 12 || b.c >= 8;
      if (okA && okB) R.push({ s: null, k: 'cores', t: 'Núcleos: los juegos aprovechan sobre todo 6-8 núcleos rápidos, y los dos llegan (' + a.c + (a.e ? 'P+' + a.e + 'E' : '') + ' frente a ' + b.c + (b.e ? 'P+' + b.e + 'E' : '') + '). Los núcleos de más casi no dan FPS.' });
      else R.push({ s: okA ? 'a' : 'b', k: 'cores', t: W(okA ? 'b' : 'a') + ' se queda corto de núcleos/hilos para juegos actuales (' + (okA ? b.c + ' núcleos, ' + b.t + ' hilos' : a.c + ' núcleos, ' + a.t + ' hilos') + '): eso se nota en los 1 % lows (tirones).' });
      if (use === 'stream') R.push({ s: side(ea - eb), k: 'cores', t: 'Para emitir a la vez que juegas, los núcleos extra sí ayudan si codificas con la CPU: ' + W(side(ea - eb) || 'a') + ' tiene más (≈' + E.fmt(Math.max(ea, eb), 0) + ' núcleos "equivalentes" frente a ' + E.fmt(Math.min(ea, eb), 0) + '). Aun así, lo normal es codificar con la gráfica (NVENC/AMF/QuickSync), que casi no resta FPS.' });
    } else {
      var mp = E.pct(a.m, b.m);
      R.push({ s: side(mp), k: 'cores', t: 'Para ' + U.t + ' cuentan todos los núcleos: ' + W(side(mp) || 'a') + ' tiene ' + (side(mp) === 'b' ? b.c + (b.e ? 'P+' + b.e + 'E' : '') + ' / ' + b.t + ' hilos' : a.c + (a.e ? 'P+' + a.e + 'E' : '') + ' / ' + a.t + ' hilos') + ' y saca ≈' + Math.abs(mp) + ' % más en multinúcleo (índice aproximado tipo Cinebench).' });
    }
    // 4. Caché
    if (Math.abs(a.l3 - b.l3) >= 8) {
      var cs = a.l3 > b.l3 ? 'a' : 'b';
      R.push({ s: gameUse ? cs : null, k: 'cache', t: W(cs) + ' tiene más caché L3 (' + Math.max(a.l3, b.l3) + ' MB frente a ' + Math.min(a.l3, b.l3) + ' MB)' + ((cs === 'a' ? a : b).x3d ? ', es 3D V-Cache: una bandeja gigante pegada al chef que evita viajes a la RAM.' : '.') + (gameUse ? ' En juegos esto pesa mucho.' : ' En render y compilación pesa poco.') });
    }
    // 5. Índices de reseñas
    if (gameUse || use === 'value') {
      var gp = E.pct(ga.v, gb.v);
      R.push({ s: Math.abs(gp) >= 2 ? side(gp) : null, k: 'bench', t: 'Índice de juegos a 1080p con gráfica tope de gama (aprox., recopilado de TechPowerUp y Hardware Unboxed): ' + a.n + ' ' + ga.v + ' frente a ' + b.n + ' ' + gb.v + ' (' + (gp === 0 ? 'empate' : (gp > 0 ? '+' : '') + gp + ' %') + ')' + (ga.est || gb.est ? '; alguno es estimado' : '') + '.' + (U.scale < 1 ? ' A ' + (use === 'g4k' ? '4K' : '1440p') + ' la diferencia real se encoge (≈' + Math.round(U.scale * 100) + ' % de ella) porque manda la gráfica.' : '') });
    }
    // 6. Consumo
    var pw = a.pmax - b.pmax;
    if (Math.abs(pw) >= 25) R.push({ s: use === 'eff' ? (pw < 0 ? 'a' : 'b') : null, k: 'eff', t: W(pw < 0 ? 'a' : 'b') + ' gasta menos: ' + Math.min(a.pmax, b.pmax) + ' W frente a ' + Math.max(a.pmax, b.pmax) + ' W de máximo (PL2/PPT). Menos calor, disipador más barato y menos ruido.' });
    // 7. Plataforma
    var la = E.alive(a), lb = E.alive(b);
    if (a.socket !== b.socket) {
      R.push({ s: la.ok && !lb.ok ? 'a' : lb.ok && !la.ok ? 'b' : null, k: 'plat', t: 'Plataforma: ' + a.n + ' va en ' + a.socket + ' y ' + b.n + ' en ' + b.socket + '. ' + (la.ok ? la.t : lb.ok ? lb.t : la.t) });
      if (a.ddr.join() !== b.ddr.join()) R.push({ s: null, k: 'ddr', t: 'Memoria: ' + a.n + ' usa ' + a.ddr.join(' o ') + ' y ' + b.n + ' ' + b.ddr.join(' o ') + '. Con los precios de la RAM en 2026, poder reutilizar tu DDR4 ahorra mucho.' });
    }
    // 8. Gráfica integrada
    if (!!a.igpu !== !!b.igpu) {
      var ig = a.igpu ? 'a' : 'b';
      R.push({ s: (use === 'edit' || use === 'stream') && (ig === 'a' ? a : b).brand === 'Intel' ? ig : null, k: 'igpu', t: W(ig === 'a' ? 'b' : 'a') + ' no tiene gráfica integrada: sin gráfica dedicada no da imagen, y si la tuya se estropea no puedes ni diagnosticar.' + ((ig === 'a' ? a : b).brand === 'Intel' ? ' La integrada de Intel además trae Quick Sync, muy útil para editar vídeo.' : '') });
    }
    // 9. Precio
    if (pa && pb && pa.cur === pb.cur) {
      var pr = E.pct(pa.v, pb.v);
      if (Math.abs(pr) >= 5) R.push({ s: use === 'value' || use === 'g4k' ? (pr < 0 ? 'a' : 'b') : null, k: 'price', t: 'Precio: ' + a.n + ' ' + pa.v + ' ' + pa.cur + ' frente a ' + b.n + ' ' + pb.v + ' ' + pb.cur + ' (' + pa.note + '). ' + (use === 'value' ? W(va.value > vb.value ? 'a' : 'b') + ' da más rendimiento por cada ' + pa.cur + '.' : '') });
    }

    // ---- Trampas ----
    var ta = E.tier(a), tb = E.tier(b);
    if (ta !== tb && A.name !== B.name) {
      var hiOld = (ta > tb && A.ipc < B.ipc) ? 'a' : (tb > ta && B.ipc < A.ipc) ? 'b' : null;
      if (hiOld) { var H = hiOld === 'a' ? a : b, L = hiOld === 'a' ? b : a; traps.push('Gama alta antigua frente a gama media nueva: ' + H.n + ' es "más gama" pero de ' + H.y + '. Entre generaciones lejanas pesa más la generación (IPC) que el número 9/7/5. Mira los datos, no el apellido.'); }
    }
    [a, b].forEach(function (c) {
      if (c.plat === 'zen4apu') traps.push(c.n + ': la serie 8000G NO es más nueva que la 9000. Es Zen 4 con solo 16 MB de L3 y menos PCIe: un 7600/7700 juega mejor si vas a poner gráfica.');
      if (/7900X3D|9900X3D/.test(c.n)) traps.push(c.n + ': para jugar solo usa los 6 núcleos del chiplet con 3D V-Cache. El 7800X3D/9800X3D de 8 núcleos suele jugar igual o mejor y cuesta menos.');
      if (c.degr) traps.push(c.n + ': los Intel de 13.ª/14.ª (i7/i9 sobre todo) sufrieron degradación por voltaje. Necesitas BIOS con microcódigo 0x12B o posterior. Si es de segunda mano, desconfía.');
      if (!c.igpu && c.seg === 'desktop') traps.push(c.n + ' no tiene gráfica integrada (sufijo F o modelo sin iGPU): obligatoria una gráfica dedicada.');
      if (/^Core [3579] \d/.test(c.n)) traps.push(c.n + ': "Core 5/7" sin "Ultra" es arquitectura antigua (Raptor/Alder Lake) con nombre nuevo.');
      if (c.seg === 'laptop' && /^Ryzen \d 7\d2\d/.test(c.n)) traps.push(c.n + ': en los Ryzen 7000 de portátil el tercer dígito es la arquitectura. El 2 = Zen 2 (2019), muy inferior a un 7840U (Zen 4).');
      if (/5500$|5700$|4500$/.test(c.n)) traps.push(c.n + ': es un chip de APU sin gráfica: menos L3 (8-16 MB) y PCIe 3.0. Juega peor que su número sugiere.');
      if (/3400G|3200G/.test(c.n)) traps.push(c.n + ': aunque es "3000", usa Zen+ (como la serie 2000).');
    });
    if (a.seg !== b.seg) traps.push('Estás comparando un procesador de portátil con uno de sobremesa: el de portátil trabaja con mucha menos potencia (W), así que rinde bastante menos aunque el nombre se parezca.');

    var win = Math.abs(score) < 0.03 ? null : score > 0 ? 'a' : 'b';
    var verdict, say;
    var Wc = win ? (win === 'a' ? a : b) : null, Lc = win ? (win === 'a' ? b : a) : null;
    var key = R.filter(function (r) { return r.s === win && win; }).slice(0, 3);
    if (!win) {
      verdict = 'Empate práctico para ' + U.t + '. La diferencia estimada es menor del 3 %: decide por precio, plataforma o consumo.';
      say = 'Para ' + U.t + ' son casi iguales: ' + (A.name === B.name ? 'misma arquitectura y fichas muy parecidas' : 'lo que uno gana en una cosa lo pierde en otra') + '. Yo cogería el que esté más barato o el que tenga mejor plataforma.';
    } else {
      verdict = 'Para ' + U.t + ' gana ' + Wc.n + (Math.abs(score) < 0.08 ? ' por poco.' : Math.abs(score) < 0.2 ? ' con claridad.' : ' por mucho.');
      var why = [];
      if (key.some(function (r) { return r.k === 'cache'; }) && Wc.x3d) why.push('su caché L3 de ' + Wc.l3 + ' MB (3D V-Cache) evita viajes a la RAM');
      if (key.some(function (r) { return r.k === 'arch'; })) why.push('su arquitectura es más nueva (' + E.arch(Wc).name + '), así que hace más trabajo por ciclo');
      if (key.some(function (r) { return r.k === 'cores'; }) && !gameUse) why.push('tiene ' + Wc.c + (Wc.e ? '+' + Wc.e : '') + ' núcleos y aquí se aprovechan todos');
      if (key.some(function (r) { return r.k === 'core'; }) && why.length < 2) why.push('rinde más por núcleo');
      if (key.some(function (r) { return r.k === 'eff'; })) why.push('gasta bastante menos');
      if (key.some(function (r) { return r.k === 'price'; }) && why.length < 2) why.push('cuesta menos');
      if (!why.length) why.push('en conjunto su ficha encaja mejor con este uso');
      // Uso donde ganaría el otro
      var other = '';
      var alt = gameUse ? 'edit' : 'g1080';
      var s2 = 0; Object.keys(USES[alt].w).forEach(function (k) { s2 += USES[alt].w[k] * d(k); });
      var w2 = Math.abs(s2) < 0.03 ? null : s2 > 0 ? 'a' : 'b';
      if (w2 && w2 !== win) other = ' Para ' + USES[alt].t + ' ganaría el ' + Lc.n + (alt === 'edit' ? ' por sus ' + Lc.c + (Lc.e ? '+' + Lc.e : '') + ' núcleos.' : ' por su rendimiento en juegos.');
      if (gameUse && Wc.c < Lc.c + Lc.e && Wc.x3d) why.push('tiene menos núcleos, pero los juegos no aprovechan más de 6-8');
      say = 'Para ' + U.t + ', el ' + Wc.n + ', porque ' + why.slice(0, 3).join('; ') + '.' + (Wc.pmax < Lc.pmax - 30 ? ' Además gasta mucho menos.' : '') + other;
    }
    var rows = cpuRows(a, b, ga, gb, pa, pb);
    return { win: win, score: score, reasons: R, traps: traps, verdict: verdict, say: say, rows: rows, use: U.t };
  };

  function rowN(label, x, y, better, unit, d) { var w = null; if (x != null && y != null && x !== y) w = (better === 'hi' ? x > y : x < y) ? 'a' : 'b'; return { l: label, a: x == null ? '—' : E.fmt(x, d) + (unit || ''), b: y == null ? '—' : E.fmt(y, d) + (unit || ''), w: better ? w : null }; }
  function rowT(label, x, y) { return { l: label, a: x == null || x === '' ? '—' : x, b: y == null || y === '' ? '—' : y, w: null }; }
  function cpuRows(a, b, ga, gb, pa, pb) {
    return [
      rowT('Año', a.y, b.y), rowT('Arquitectura', E.arch(a).name, E.arch(b).name), rowT('Nombre en clave', a.code, b.code), rowT('Nodo', a.node, b.node), rowT('Zócalo', a.socket, b.socket),
      rowN('Núcleos P', a.c, b.c, 'hi'), rowN('Núcleos E', a.e + (a.lpe || 0), b.e + (b.lpe || 0), 'hi'), rowN('Hilos', a.t, b.t, 'hi'),
      rowN('GHz base', a.b, b.b, 'hi', ' GHz'), rowN('GHz turbo', a.bo, b.bo, 'hi', ' GHz'), rowN('IPC relativo (aprox.)', E.arch(a).ipc, E.arch(b).ipc, 'hi'),
      rowN('Por núcleo ≈ IPC×GHz', E.perCore(a), E.perCore(b), 'hi'), rowN('Caché L2', a.l2, b.l2, 'hi', ' MB'), rowN('Caché L3', a.l3, b.l3, 'hi', ' MB'),
      rowN('TDP / PBP', a.tdp, b.tdp, 'lo', ' W', 0), rowN('Máximo PL2/PPT', a.pmax, b.pmax, 'lo', ' W', 0), rowT('Gráfica integrada', a.igpu || 'No', b.igpu || 'No'),
      rowT('Memoria', a.mem, b.mem), rowT('PCIe', a.pcie, b.pcie), rowN('Índice juegos (aprox.)', ga.v, gb.v, 'hi', ga.est || gb.est ? '*' : ''), rowN('Índice multinúcleo (aprox.)', a.m, b.m, 'hi'),
      rowT('Precio', pa ? pa.v + ' ' + pa.cur : '—', pb ? pb.v + ' ' + pb.cur : '—')
    ];
  }

  /* ---------------- Gráficas ---------------- */
  E.gpuPerf = function (g, res) {
    var p = g.p;
    if (res === '1080') return Math.round(100 * Math.pow(p / 100, 0.85) * 10) / 10;
    if (res === '4k') { var v = 100 * Math.pow(p / 100, 1.15); if (g.vram <= 4) v *= .6; else if (g.vram <= 6) v *= .72; else if (g.vram <= 8) v *= .82; else if (g.vram <= 10) v *= .92; return Math.round(v * 10) / 10; }
    return p;
  };
  E.vramNeed = function (res, use) { if (use === 'ai') return { min: 12, ok: 16, ideal: 24 }; return res === '4k' ? { min: 12, ok: 16, ideal: 20 } : res === '1440' ? { min: 10, ok: 12, ideal: 16 } : { min: 8, ok: 10, ideal: 12 }; };
  E.upscaler = function (g) {
    if (g.brand === 'NVIDIA' && g.rt >= 4) return { r: 5, t: 'DLSS 4 con Multi Frame Generation' };
    if (g.brand === 'NVIDIA' && g.rt === 3) return { r: 4.5, t: 'DLSS 4 + Frame Generation ×2' };
    if (g.brand === 'NVIDIA' && g.rt >= 1) return { r: 4, t: 'DLSS 4 (solo superresolución)' };
    if (g.brand === 'AMD' && g.rt >= 3) return { r: 3.8, t: 'FSR 4 (por IA)' };
    if (g.brand === 'Intel') return { r: 3.2, t: 'XeSS 2 con XMX' };
    return { r: 2, t: 'FSR 3 / XeSS genérico (sin escalado por IA propio)' };
  };
  E.encoder = function (g) {
    if (g.brand === 'NVIDIA') return g.rt >= 3 ? 'NVENC con AV1' : g.rt === 0 && /1650$/.test(g.n) ? 'NVENC antiguo (Volta)' : g.y >= 2018 ? 'NVENC (Turing/Ampere, H.264/HEVC)' : 'NVENC (Pascal)';
    if (g.brand === 'AMD') return /6500|6400/.test(g.n) ? 'Sin codificador' : g.rt >= 2 ? 'AMF con AV1' : 'AMF (H.264/HEVC)';
    return 'QuickSync con AV1 (muy bueno)';
  };
  E.gpuBf = function (g) { var now = HW.prices.gpu[g.n], bf = HW.bfPrices && HW.bfPrices.gpu[g.n]; if (!now || !bf) return null; return { now: now, bf: bf, pct: Math.round((1 - bf / now) * 100) }; };
  E.gpuPrice = function (g) { var p = HW.prices.gpu[g.n]; return p ? { v: p, cur: '€', note: 'precio orientativo ' + HW.PRICE_DATE } : (g.msrp ? { v: g.msrp, cur: '$', note: 'precio de salida' } : null); };
  var GUSES = {
    g1080: { t: 'juegos a 1080p', res: '1080' }, g1440: { t: 'juegos a 1440p', res: '1440' }, g4k: { t: 'juegos a 4K', res: '4k' },
    stream: { t: 'jugar y hacer streaming', res: '1080' }, edit: { t: 'edición de vídeo y render 3D', res: '1440' }, prog: { t: 'programación', res: '1080' },
    ai: { t: 'IA local', res: '1440' }, eff: { t: 'eficiencia y silencio', res: '1440' }, value: { t: 'relación calidad-precio', res: '1440' }
  };
  E.GUSES = GUSES;
  E.compareGpu = function (a, b, use, opt) {
    opt = opt || {};
    var U = GUSES[use] || GUSES.g1440, res = U.res, R = [], traps = [];
    var pa = E.gpuPerf(a, res), pb = E.gpuPerf(b, res), need = E.vramNeed(res, use);
    var ua = E.upscaler(a), ub = E.upscaler(b), $a = E.gpuPrice(a), $b = E.gpuPrice(b);
    var N = { a: a.n, b: b.n };
    function side(x) { return x > 0 ? 'a' : x < 0 ? 'b' : null; }
    var score = 0;
    var dp = (pa - pb) / Math.max(pa, pb);
    var wPerf = { g1080: .6, g1440: .6, g4k: .55, stream: .5, edit: .45, prog: .3, ai: .25, eff: .25, value: .3 }[use] || .5;
    score += wPerf * dp;
    var pp = E.pct(pa, pb);
    R.push({ s: Math.abs(pp) >= 3 ? side(pp) : null, k: 'perf', t: 'Rendimiento a ' + (res === '4k' ? '4K' : res + 'p') + ' (índice aproximado, RTX 5090 = 100, a partir de TechPowerUp y Hardware Unboxed' + (res !== '1440' ? '; estimado desde 1440p' : '') + '): ' + a.n + ' ' + E.fmt(pa) + ' frente a ' + b.n + ' ' + E.fmt(pb) + ' → ' + (Math.abs(pp) < 3 ? 'empate técnico.' : (N[side(pp)] + ' ≈' + Math.abs(pp) + ' % más rápida.')) });
    // Arquitectura
    if (a.arch !== b.arch) R.push({ s: null, k: 'arch', t: 'Arquitecturas: ' + a.n + ' es ' + a.arch + ' (' + a.y + ') y ' + b.n + ' es ' + b.arch + ' (' + b.y + '). Los shaders (' + E.fmt(a.sh, 0) + ' frente a ' + E.fmt(b.sh, 0) + ') no se pueden comparar entre marcas ni entre generaciones: cada uno hace distinto trabajo por ciclo.' });
    // VRAM
    function vr(g) { return g.vram >= need.ok ? 'ok' : g.vram >= need.min ? 'justa' : 'corta'; }
    var vA = vr(a), vB = vr(b);
    var wV = { g1080: .12, g1440: .15, g4k: .2, stream: .1, edit: .2, prog: .1, ai: .45, eff: .05, value: .12 }[use] || .1;
    var rank = { ok: 2, justa: 1, corta: 0 };
    score += wV * ((rank[vA] - rank[vB]) / 2 + (use === 'ai' ? (a.vram - b.vram) / Math.max(a.vram, b.vram) : 0));
    R.push({ s: rank[vA] !== rank[vB] || (use === 'ai' && a.vram !== b.vram) ? (rank[vA] > rank[vB] || (rank[vA] === rank[vB] && a.vram > b.vram) ? 'a' : 'b') : null, k: 'vram', t: 'VRAM (la mesa de los pinches, no se amplía): ' + a.n + ' ' + a.vram + ' GB ' + a.vt + ' (' + vA + ') y ' + b.n + ' ' + b.vram + ' GB ' + b.vt + ' (' + vB + '). Para ' + U.t + ' recomiendo ≥ ' + need.ok + ' GB (mínimo ' + need.min + ').' + (vA === 'corta' || vB === 'corta' ? ' Con poca VRAM aparecen texturas borrosas, pop-in y tirones aunque la media de FPS parezca buena.' : '') });
    R.push({ s: null, k: 'bw', t: 'Ancho de banda: ' + E.fmt(a.bw, 0) + ' GB/s (bus ' + a.bus + ' bits) frente a ' + E.fmt(b.bw, 0) + ' GB/s (bus ' + b.bus + ' bits). Bus estrecho con caché grande (Infinity Cache, L2 de NVIDIA) puede funcionar bien a 1080p y sufrir a 4K.' });
    // Escalado y RT
    var du = ua.r - ub.r;
    if (du !== 0) { score += .12 * du / 5; R.push({ s: side(du), k: 'up', t: 'Escalado: ' + a.n + ' → ' + ua.t + '; ' + b.n + ' → ' + ub.t + '. ' + N[side(du)] + ' tiene mejor escalado, y eso a la práctica son FPS gratis con buena imagen.' }); }
    if (a.rt !== b.rt) { var dr = a.rt - b.rt; score += ({ g4k: .08, g1440: .06 }[use] || .04) * Math.sign(dr); R.push({ s: side(dr), k: 'rt', t: 'Trazado de rayos: ' + N[side(dr)] + ' tiene núcleos RT de generación más nueva o más capaces' + ((a.rt === 0 || b.rt === 0) ? ' (la otra no tiene núcleos RT: algunos juegos de 2025-2026 exigen RT y no arrancan o van fatal)' : '') + '.' }); }
    // Streaming / edición
    if (use === 'stream' || use === 'edit') { var ea = E.encoder(a), eb = E.encoder(b); R.push({ s: ea === eb ? null : (/AV1/.test(ea) && !/AV1/.test(eb) ? 'a' : /AV1/.test(eb) && !/AV1/.test(ea) ? 'b' : null), k: 'enc', t: 'Codificador de vídeo: ' + a.n + ' → ' + ea + '; ' + b.n + ' → ' + eb + '. Codificar con la gráfica casi no quita FPS al juego.' }); if (/AV1/.test(ea) !== /AV1/.test(eb)) score += .08 * (/AV1/.test(ea) ? 1 : -1); }
    // IA local
    if (use === 'ai') { var cA = a.brand === 'NVIDIA', cB = b.brand === 'NVIDIA'; if (cA !== cB) { score += .2 * (cA ? 1 : -1); R.push({ s: cA ? 'a' : 'b', k: 'cuda', t: 'IA local: casi todo el software (PyTorch, Stable Diffusion, LLM con llama.cpp/Ollama) va primero y mejor con CUDA de NVIDIA. AMD (ROCm) e Intel funcionan cada vez mejor, pero con más pegas.' }); } R.push({ s: null, k: 'aimodel', t: 'Regla práctica: un modelo de lenguaje de 8 mil millones de parámetros cuantizado a 4 bits ocupa ≈5-6 GB; uno de 32 mil millones ≈20 GB. Si no cabe en la VRAM, va muchísimo más lento.' }); }
    // Consumo
    var dw = a.tbp - b.tbp;
    if (Math.abs(dw) >= 20) { score += ({ eff: .4 }[use] || .05) * (-dw / Math.max(a.tbp, b.tbp)); R.push({ s: use === 'eff' ? side(-dw) : null, k: 'pw', t: 'Consumo: ' + a.n + ' ' + a.tbp + ' W y ' + b.n + ' ' + b.tbp + ' W. Fuente recomendada por el fabricante: ' + a.psu + ' W frente a ' + b.psu + ' W. Conectores: ' + a.conn + ' / ' + b.conn + '.' }); }
    // Precio
    if ($a && $b && $a.cur === $b.cur) {
      var va = pa / $a.v, vb = pb / $b.v, dv = (va - vb) / Math.max(va, vb);
      score += ({ value: .35, g1080: .15, g1440: .15, g4k: .1, stream: .15, edit: .1, prog: .4, ai: .1, eff: .1 }[use] || .1) * dv;
      R.push({ s: Math.abs(dv) > .05 ? side(dv) : null, k: 'price', t: 'Precio: ' + $a.v + ' ' + $a.cur + ' frente a ' + $b.v + ' ' + $b.cur + ' (' + $a.note + '). Rendimiento por cada 100 ' + $a.cur + ': ' + E.fmt(va * 100) + ' frente a ' + E.fmt(vb * 100) + '.' });
    }
    // Trampas
    [a, b].forEach(function (g) {
      if (g.lanes < 16 && opt.pcie3) traps.push(g.n + ' usa PCIe x' + g.lanes + '. En una placa PCIe 3.0 trabaja con la mitad (o la cuarta parte) del ancho de banda: pierde rendimiento, sobre todo si se le acaba la VRAM.');
      else if (g.lanes < 16) traps.push(g.n + ' solo usa PCIe x' + g.lanes + '. En placas PCIe 3.0 (B450, A520, B840, Intel 10.ª gen…) pierde rendimiento.');
      if (g.vram < need.min) traps.push(g.n + ': ' + g.vram + ' GB de VRAM se quedan cortos para ' + U.t + ' hoy. La media de FPS engaña: mira los 1 % lows y la calidad de texturas.');
      if (g.rebar) traps.push(g.n + ': las Intel Arc necesitan Resizable BAR activado en la BIOS. Con procesadores antiguos (Zen/Zen+, Intel 8.ª-10.ª) rinden bastante menos.');
      if (/^RTX 3050 6GB|^RTX 3060$/.test(g.n)) traps.push(g.n + ': existen versiones con el mismo nombre y memoria o bus recortados. Mira bien la ficha exacta.');
      if (/12V-2x6|12VHPWR/.test(g.conn)) traps.push(g.n + ' usa el conector de 16 pines: enchúfalo hasta el fondo (que haga clic y no quede hueco) y no dobles el cable justo al salir. Mejor con fuente ATX 3.1 con cable nativo.');
    });
    var win = Math.abs(score) < 0.03 ? null : score > 0 ? 'a' : 'b';
    var Wg = win ? (win === 'a' ? a : b) : null, Lg = win ? (win === 'a' ? b : a) : null, verdict, say;
    if (!win) { verdict = 'Empate práctico para ' + U.t + '. Decide el precio del día, el consumo o el software que uses.'; say = 'Para ' + U.t + ' están muy parejas; yo miraría cuál está más barata y si necesito DLSS o más VRAM.'; }
    else {
      verdict = 'Para ' + U.t + ' gana la ' + Wg.n + (Math.abs(score) < .08 ? ' por poco.' : Math.abs(score) < .2 ? ' con claridad.' : ' por mucho.');
      var why = [];
      var pw = win === 'a' ? pp : -pp;
      if (pw >= 5) why.push('es ≈' + pw + ' % más rápida a ' + (res === '4k' ? '4K' : res + 'p'));
      if (Wg.vram > Lg.vram && (rank[vr(Lg)] < 2 || use === 'ai')) why.push('tiene ' + Wg.vram + ' GB de VRAM frente a ' + Lg.vram + ', y aquí hacen falta');
      if (use === 'ai' && Wg.brand === 'NVIDIA' && Lg.brand !== 'NVIDIA') why.push('tiene CUDA, que es lo que mejor soporta el software de IA');
      if (E.upscaler(Wg).r > E.upscaler(Lg).r && why.length < 3) why.push('su escalado (' + E.upscaler(Wg).t + ') es mejor');
      if (Wg.tbp < Lg.tbp - 30 && (use === 'eff' || why.length < 2)) why.push('gasta ' + (Lg.tbp - Wg.tbp) + ' W menos');
      if (!why.length) why.push('su relación entre rendimiento, VRAM y precio encaja mejor');
      say = 'Para ' + U.t + ', la ' + Wg.n + ', porque ' + why.slice(0, 3).join('; ') + '.' + (Lg.vram > Wg.vram && use !== 'ai' ? ' La ' + Lg.n + ' tiene más VRAM, que la hará envejecer mejor.' : '');
    }
    var rows = [
      rowT('Año', a.y, b.y), rowT('Arquitectura', a.arch, b.arch), rowT('Chip', a.code, b.code), rowT('Nodo', a.node, b.node),
      rowN('VRAM', a.vram, b.vram, 'hi', ' GB', 0), rowT('Tipo de VRAM', a.vt, b.vt), rowN('Bus', a.bus, b.bus, 'hi', ' bits', 0), rowN('Ancho de banda', a.bw, b.bw, 'hi', ' GB/s', 0),
      rowT('Shaders', E.fmt(a.sh, 0), E.fmt(b.sh, 0)), rowT('Núcleos RT', a.rt ? a.rt + '.ª gen' : 'No', b.rt ? b.rt + '.ª gen' : 'No'), rowT('Núcleos de IA', a.ai, b.ai),
      rowN('Consumo (TGP/TBP)', a.tbp, b.tbp, 'lo', ' W', 0), rowT('Conector', a.conn, b.conn), rowN('Fuente recomendada', a.psu, b.psu, 'lo', ' W', 0), rowT('PCIe', a.pcie + ' x' + a.lanes, b.pcie + ' x' + b.lanes),
      rowT('Escalado', ua.t, ub.t), rowN('Índice 1080p (est.)', E.gpuPerf(a, '1080'), E.gpuPerf(b, '1080'), 'hi'), rowN('Índice 1440p', a.p, b.p, 'hi'), rowN('Índice 4K (est.)', E.gpuPerf(a, '4k'), E.gpuPerf(b, '4k'), 'hi'),
      rowT('Precio', $a ? $a.v + ' ' + $a.cur : '—', $b ? $b.v + ' ' + $b.cur : '—')
    ];
    return { win: win, score: score, reasons: R, traps: traps, verdict: verdict, say: say, rows: rows, use: U.t };
  };

  /* ---------------- Descodificador de nombres ---------------- */
  E.decode = function (raw) {
    var s = String(raw || '').trim().replace(/\s+/g, ' ');
    if (!s) return null;
    var m, P = [], meta = { seg: 'desktop' };
    function part(t, k, lbl, exp) { P.push({ t: t, k: k, lbl: lbl, exp: exp }); }
    var laptopWord = /\b(laptop|port[aá]til|mobile|max-q)\b/i.test(s);
    var clean = s.replace(/\b(laptop|port[aá]til|mobile|max-q)\b/ig, '').trim();
    var sufI = {
      K: 'Desbloqueado: se puede hacer overclock (con placa Z). Gama más potente.', F: 'Sin gráfica integrada. Necesitas gráfica dedicada sí o sí.', KF: 'Desbloqueado y sin gráfica integrada.',
      KS: 'Edición especial: los mejores chips, más GHz.', T: 'Bajo consumo (35 W) para mini PC.', H: 'Portátil de alto rendimiento (45 W aprox.).', HX: 'Portátil tope: casi un procesador de sobremesa (55 W o más).',
      HK: 'Portátil H desbloqueado.', U: 'Portátil ultrafino de bajo consumo (15-28 W).', P: 'Portátil fino de consumo medio (28 W).', G7: 'Portátil con gráfica integrada mejorada (11.ª gen).', V: 'Lunar Lake: portátil eficiente con la RAM dentro del procesador.', S: 'Sobremesa (serie 200S).'
    };
    // Intel Core iX
    if ((m = clean.match(/^(?:intel\s+)?(?:core\s+)?i([3579])[-\s]?(\d{4,5})([a-z0-9]{0,3})$/i))) {
      var dg = m[2], gen = dg.length === 5 ? dg.slice(0, 2) : dg.slice(0, 1), pos = dg.slice(gen.length), suf = m[3].toUpperCase();
      meta.brand = 'Intel'; meta.type = 'cpu';
      part('Intel Core', 'k1', 'Marca y familia', 'Familia Core de Intel.');
      part('i' + m[1], 'k2', 'Gama', 'i3 básico · i5 medio · i7 alto · i9 tope. Es la gama dentro de su generación, no entre generaciones.');
      part(gen, 'k3', 'Generación', gen + '.ª generación' + ({ '8': ' (Coffee Lake, 2017)', '9': ' (Coffee Lake Refresh, 2018)', '10': ' (Comet Lake, 2020)', '11': ' (Rocket Lake / Tiger Lake, 2021)', '12': ' (Alder Lake, 2021-22: primeros P-cores y E-cores)', '13': ' (Raptor Lake, 2022-23)', '14': ' (Raptor Lake Refresh, 2023-24)' }[gen] || '') + '.');
      part(pos, 'k4', 'Posición', 'Posición dentro de la gama: más alto = más rápido (' + pos + '). Un 600 está por encima de un 400 en la misma gama.');
      if (suf) part(suf, 'k5', 'Sufijo', sufI[suf] || 'Sufijo de variante.');
      else part('(sin letra)', 'k6', 'Sufijo', 'Sin letra: sobremesa normal, bloqueado, con gráfica integrada y 65 W.');
      meta.seg = /^(H|HX|HK|U|P|G\d|Y)$/.test(suf) ? 'laptop' : 'desktop';
      meta.year = { '8': 2017, '9': 2018, '10': 2020, '11': 2021, '12': 2022, '13': 2023, '14': 2024 }[gen];
    }
    // Core Ultra
    else if ((m = clean.match(/^(?:intel\s+)?core\s+ultra\s+(x)?([3579])\s+(\d)(\d{2})([a-z]{0,2})(\s*plus)?$/i))) {
      var ser = m[3], sf = (m[5] || '').toUpperCase();
      meta.brand = 'Intel'; meta.type = 'cpu';
      part('Intel Core Ultra', 'k1', 'Marca y familia', 'Nombre nuevo de Intel desde 2023. Siempre arquitectura moderna.');
      part((m[1] ? 'X' : '') + m[2], 'k2', 'Gama', 'Ultra 5 medio · Ultra 7 alto · Ultra 9 tope.' + (m[1] ? ' La X (Panther Lake) indica la gráfica integrada grande (12 núcleos Xe3).' : ''));
      part(ser, 'k3', 'Serie (generación)', ({ '1': 'Serie 100: Meteor Lake (portátil, 2023).', '2': 'Serie 200: Arrow Lake (200S sobremesa, 200H/HX portátil) o Lunar Lake (200V). 2024-2025.', '3': 'Serie 300: Panther Lake (portátil, 2026, Intel 18A).', '4': 'Serie 400: Nova Lake (sobremesa, prevista para 2027, LGA1954; por verificar).' }[ser] || 'Serie ' + ser + '.'));
      part(m[4], 'k4', 'Posición', 'Posición dentro de la serie: 85 > 65 > 45 > 25.');
      if (sf) part(sf, 'k5', 'Sufijo', sufI[sf] || 'Variante.'); else part('(sin letra)', 'k6', 'Sufijo', 'Sin letra: sobremesa bloqueado de 65 W.');
      if (m[6]) part('Plus', 'k5', 'Refresh', 'Plus = Arrow Lake Refresh (marzo 2026): más núcleos E, más caché o más GHz por el mismo precio.');
      meta.seg = /^(H|HX|V|U)$/.test(sf) || ser === '3' || ser === '1' ? 'laptop' : 'desktop';
      meta.year = { '1': 2023, '2': sf === 'V' ? 2024 : 2024, '3': 2026, '4': 2027 }[ser]; if (m[6]) meta.year = 2026;
    }
    // Core 3/5/7 sin Ultra
    else if ((m = clean.match(/^(?:intel\s+)?core\s+([3579])\s+(\d)(\d{2})([a-z]{0,2})$/i))) {
      meta.brand = 'Intel'; meta.type = 'cpu';
      part('Intel Core', 'k1', 'Marca', 'Ojo: "Core" sin "Ultra".');
      part(m[1], 'k2', 'Gama', 'Core 3/5/7: gama baja/media/alta.');
      part(m[2], 'k3', 'Serie', 'Serie ' + m[2] + '. Trampa: son arquitecturas antiguas (Raptor/Alder Lake) con nombre nuevo.');
      part(m[3], 'k4', 'Posición', 'Posición dentro de la serie.');
      if (m[4]) part(m[4].toUpperCase(), 'k5', 'Sufijo', sufI[m[4].toUpperCase()] || 'Variante.');
      meta.seg = /U|H/i.test(m[4]) ? 'laptop' : 'desktop'; meta.year = m[2] === '1' ? 2024 : 2025;
    }
    // Ryzen AI
    else if ((m = clean.match(/^(?:amd\s+)?ryzen\s+ai\s+(max\+?\s+)?(?:pro\s+)?(?:([3579])\s+)?(hx\s*)?(\d)(\d)(\d)$/i))) {
      meta.brand = 'AMD'; meta.type = 'cpu'; meta.seg = 'laptop';
      part('AMD Ryzen AI', 'k1', 'Marca y familia', 'Ryzen AI: portátiles con NPU para IA (≥ 40-50 TOPS, válido para Copilot+).');
      if (m[1]) part(m[1].trim(), 'k2', 'Max', 'Max / Max+ = Strix Halo: gráfica integrada enorme (hasta 40 CU) y hasta 128 GB de RAM unificada.');
      if (m[2]) part(m[2], 'k2', 'Gama', 'Ryzen AI 5 / 7 / 9.');
      if (m[3]) part('HX', 'k5', 'Sufijo', 'HX = el más potente de la serie.');
      part(m[4], 'k3', 'Generación', ({ '3': 'Serie 300 (2024-2025): Zen 5 (Strix Point, Krackan Point, Strix Halo).', '4': 'Serie 400 (2026): Gorgon Point, actualización de Zen 5. Por verificar.' }[m[4]] || 'Serie ' + m[4] + '00.'));
      part(m[5] + m[6], 'k4', 'Posición', 'Más alto = mejor dentro de la serie.');
      meta.year = m[4] === '4' ? 2026 : 2024;
    }
    // Ryzen clásico
    else if ((m = clean.match(/^(?:amd\s+)?ryzen\s+([3579])\s+(?:pro\s+)?(\d)(\d)(\d)(\d)\s*(x3d2|x3d|xt|x|ge|g|f|hx3d|hx|hs|h|u|c)?$/i))) {
      var g1 = m[2], s2 = (m[6] || '').toUpperCase(), lap = /^(U|H|HS|HX|HX3D|C)$/.test(s2);
      meta.brand = 'AMD'; meta.type = 'cpu'; meta.seg = lap ? 'laptop' : 'desktop';
      part('AMD Ryzen', 'k1', 'Marca y familia', 'Familia Ryzen de AMD (desde 2017).');
      part(m[1], 'k2', 'Gama', 'Ryzen 3 básico · 5 medio · 7 alto · 9 tope.');
      if (lap && +g1 >= 7) {
        part(g1, 'k3', 'Año del modelo', g1 === '7' ? '7 = 2023' : g1 === '8' ? '8 = 2024' : 'Año del portátil.');
        part(m[3], 'k4', 'Segmento', 'Segmento: 1 muy básico, 3-4 básico, 5-6 medio, 7-8 alto, 9 tope.');
        part(m[4], 'k5', 'Arquitectura', ({ '1': 'Zen / Zen+ (2017-2018)', '2': 'Zen 2 (2019): ¡arquitectura vieja!', '3': 'Zen 3 / Zen 3+ (2020-2022)', '4': 'Zen 4 (2022-2023)', '5': 'Zen 5' }[m[4]] || '?') + '. El tercer dígito es la clave en los portátiles 7000/8000.');
        part(m[5], 'k6', 'Variante', m[5] === '5' ? '5 = versión superior del mismo modelo.' : '0 = versión inferior.');
      } else {
        part(g1, 'k3', 'Generación', ({ '1': '1000: Zen (2017), AM4.', '2': '2000: Zen+ (2018), AM4. Las 2000G son Zen.', '3': '3000: Zen 2 (2019), AM4. Ojo: 3200G/3400G son Zen+.', '4': '4000: Zen 2 (APU de 2020-22), AM4.', '5': lap ? '5000 portátil: mezcla Zen 2 y Zen 3.' : '5000: Zen 3 (2020), AM4.', '6': '6000: Zen 3+ (portátil, 2022).', '7': '7000: Zen 4 (2022), AM5.', '8': '8000: Zen 4 con gráfica (2024), AM5. No es más nueva que la 9000.', '9': '9000: Zen 5 (2024), AM5.' }[g1] || 'Generación ' + g1 + '000.'));
        part(m[3] + m[4] + m[5], 'k4', 'Posición', 'Posición dentro de la generación: 800 > 700 > 600 > 500.');
      }
      var sAMD = { X: 'Más GHz (y más consumo) que la versión sin letra.', XT: 'X algo más rápido (refresco de Zen 2/3).', X3D: '3D V-Cache: caché L3 gigante (96-128 MB). Lo mejor para juegos.', X3D2: '3D V-Cache en los dos chiplets (9950X3D2, 2026).', G: 'Con gráfica integrada potente (APU). Menos caché.', GE: 'G de bajo consumo (35 W).', F: 'Sin gráfica integrada.', U: 'Portátil de bajo consumo (15-28 W).', H: 'Portátil potente (45 W).', HS: 'Portátil potente y fino (35 W).', HX: 'Portátil tope (55 W o más).', HX3D: 'Portátil tope con 3D V-Cache.', C: 'Chromebook.' };
      if (s2) part(s2, 'k5', 'Sufijo', sAMD[s2] || 'Variante.'); else part('(sin letra)', 'k6', 'Sufijo', 'Sin letra: sobremesa de 65 W, algo menos de GHz que la X y suele traer disipador.');
      meta.year = lap ? ({ '7': 2023, '8': 2024, '5': 2021, '6': 2022 }[g1]) : ({ '1': 2017, '2': 2018, '3': 2019, '4': 2022, '5': 2020, '7': 2022, '8': 2024, '9': 2024 }[g1]);
    }
    // NVIDIA
    else if ((m = clean.match(/^(?:nvidia\s+)?(?:geforce\s+)?(gtx|rtx|gt)\s*(\d{2})(\d{2})\s*(ti)?\s*(super)?\s*(\d+\s*gb)?$/i))) {
      meta.brand = 'NVIDIA'; meta.type = 'gpu';
      var gg = m[2], tr = m[3];
      part('NVIDIA ' + m[1].toUpperCase(), 'k1', 'Marca y familia', m[1].toUpperCase() === 'RTX' ? 'RTX = con núcleos RT (trazado de rayos) y Tensor (DLSS). Desde 2018.' : m[1].toUpperCase() === 'GTX' ? 'GTX = sin núcleos RT ni DLSS.' : 'GT = gama mínima, solo para dar imagen.');
      part(gg, 'k3', 'Generación', ({ '10': 'Serie 10: Pascal (2016).', '16': 'Serie 16: Turing sin RT (2019).', '20': 'Serie 20: Turing (2018), primeras RTX.', '30': 'Serie 30: Ampere (2020).', '40': 'Serie 40: Ada Lovelace (2022), DLSS Frame Generation.', '50': 'Serie 50: Blackwell (2025), Multi Frame Generation y GDDR7.', '60': 'Serie 60: Rubin (aún no anunciada a 11/2026).' }[gg] || 'Serie ' + gg + '.'));
      part(tr, 'k2', 'Gama', '50 básica · 60 media · 70 media-alta · 80 alta · 90 tope. Pesa más que la generación entre series seguidas.');
      if (m[4]) part('Ti', 'k5', 'Ti', 'Ti = un escalón por encima del modelo normal.');
      if (m[5]) part('SUPER', 'k5', 'SUPER', 'SUPER = refresco a mitad de generación, algo más rápida (2019 y 2024).');
      if (m[6]) part(m[6].toUpperCase().replace(/\s/g, ''), 'k6', 'VRAM', 'Cantidad de VRAM cuando hay dos versiones con el mismo nombre.');
      meta.year = { '10': 2016, '16': 2019, '20': 2018, '30': 2020, '40': 2022, '50': 2025 }[gg];
      meta.seg = laptopWord ? 'laptop' : 'desktop';
    }
    // AMD Radeon
    else if ((m = clean.match(/^(?:amd\s+)?(?:radeon\s+)?rx\s*(\d)(\d)(\d{2})\s*(xtx|xt|gre)?\s*(\d+\s*gb)?$/i))) {
      meta.brand = 'AMD'; meta.type = 'gpu';
      part('AMD Radeon RX', 'k1', 'Marca y familia', 'Gráficas Radeon de AMD.');
      part(m[1], 'k3', 'Generación', ({ '5': 'RX 5000: RDNA 1 (2019).', '6': 'RX 6000: RDNA 2 (2020), primer RT de AMD e Infinity Cache.', '7': 'RX 7000: RDNA 3 (2022), chiplets.', '9': 'RX 9000: RDNA 4 (2025), FSR 4. AMD se saltó la 8000.' }[m[1]] || 'Generación ' + m[1] + '000.'));
      part(m[2] + m[3], 'k2', 'Gama', 'Segundo dígito = gama: 5 básica, 6 media, 7 media-alta, 8 alta, 9 tope. En RX 9000: 9060 media, 9070 alta.');
      if (m[4]) part(m[4].toUpperCase(), 'k5', 'Sufijo', { XT: 'XT = versión más potente.', XTX: 'XTX = la más potente de la generación.', GRE: 'GRE (Golden Rabbit Edition) = versión recortada, nació para China y luego salió al resto del mundo.' }[m[4].toUpperCase()]);
      if (m[5]) part(m[5].toUpperCase().replace(/\s/g, ''), 'k6', 'VRAM', 'Versión de VRAM.');
      meta.year = { '5': 2019, '6': 2020, '7': 2022, '9': 2025 }[m[1]];
      meta.seg = laptopWord ? 'laptop' : 'desktop';
    }
    // Intel Arc
    else if ((m = clean.match(/^(?:intel\s+)?arc\s+(?:pro\s+)?([ab])(\d)(\d{2})$/i))) {
      meta.brand = 'Intel'; meta.type = 'gpu';
      part('Intel Arc', 'k1', 'Marca', 'Gráficas dedicadas de Intel.');
      part(m[1].toUpperCase(), 'k3', 'Generación', m[1].toUpperCase() === 'A' ? 'A = Alchemist (2022).' : 'B = Battlemage (2024-25). Las letras siguen el alfabeto: C = Celestial.');
      part(m[2], 'k2', 'Gama', '3 básica · 5 media · 7 alta.');
      part(m[3], 'k4', 'Posición', 'Posición dentro de la gama.');
      meta.year = m[1].toUpperCase() === 'A' ? 2022 : 2024;
    }
    else return { parts: [], meta: null, s: s };
    var match = meta.type === 'cpu' ? E.findCpu(clean) : E.findGpu(clean);
    if (!match && meta.type === 'gpu') match = E.findGpu(clean.replace(/\s*\d+\s*gb$/i, ''));
    if (match && match.y) meta.year = match.y;
    if (match && match.seg) meta.seg = match.seg;
    return { parts: P, meta: meta, match: match, s: s };
  };

  /* ---------------- Fuente de alimentación ---------------- */
  E.ceil50 = function (x) { return Math.ceil(x / 50) * 50; };
  E.psuCalc = function (cpu, gpu, extra) {
    extra = extra || 0;
    var cpuW = cpu ? cpu.pmax : 120, gpuW = gpu ? gpu.tbp : 0, rest = 100 + extra;
    var total = cpuW + gpuW + rest;
    var spike = gpu && gpu.y >= 2020 && gpu.tbp >= 200 ? 1.35 : 1.25;
    var min = E.ceil50(total * 1.1), rec = E.ceil50(total * spike);
    var maker = gpu ? gpu.psu : null;
    var conns = ['ATX 24 pines (placa)', cpu && cpu.pmax > 180 ? 'EPS 8 + 4/8 pines (CPU; muchas placas tienen dos)' : 'EPS 4+4 / 8 pines (CPU)'];
    if (gpu) conns.push('Gráfica: ' + gpu.conn);
    conns.push('SATA de corriente para SSD/HDD de 2,5"/3,5" (los M.2 no lo necesitan)');
    return { cpuW: cpuW, gpuW: gpuW, rest: rest, total: total, min: min, rec: Math.max(rec, maker || 0), maker: maker, conns: conns, spike: spike };
  };

  /* ---------------- Cuello de botella ---------------- */
  E.bottleneck = function (cpu, gpu, res) {
    var cIdx = E.gameIdx(cpu).v * 1.5;
    // Calibrado (aprox.): un Ryzen 7 9800X3D (índice 100 → 150) queda casi equilibrado con una RTX 5090 a 1080p
    var k = { '1080': 1.45, '1440': 1.05, '4k': .62 }[res] || 1;
    var gIdx = E.gpuPerf(gpu, res) * k;
    var ratio = cIdx / gIdx, who, t;
    if (ratio > 1.15) { who = 'gpu'; t = 'Manda la gráfica (los pinches): la CPU podría preparar ≈' + Math.round((ratio - 1) * 100) + ' % más platos de los que la gráfica dibuja. Es lo normal y lo deseable: la GPU irá al 95-100 %.'; }
    else if (ratio < 0.87) { who = 'cpu'; t = 'Manda el procesador (el jefe): la gráfica podría dar ≈' + Math.round((1 / ratio - 1) * 100) + ' % más si la CPU le pasara las órdenes más rápido. Verías la GPU por debajo del 90 % y 1 % lows peores.'; }
    else { who = 'eq'; t = 'Equilibrado: los dos trabajan cerca de su límite. Según el juego mandará uno u otro.'; }
    return { cpu: cIdx, gpu: gIdx, ratio: ratio, who: who, t: t };
  };

  /* ---------------- Comprobador de compatibilidad ---------------- */
  E.check = function (p) {
    var out = [];
    function add(lv, t) { out.push({ lv: lv, t: t }); }
    var cpu = p.cpu, b = p.board, ch = b ? HW.chipset(b.chip) : null, ram = p.ram, gpu = p.gpu, psu = p.psu, cs = p.case, k = p.cooler, st = p.storage || [];
    if (cpu && ch) {
      if (HW.platSocket[cpu.plat] !== ch.s) add('bad', 'Zócalo: el ' + cpu.n + ' es ' + cpu.socket + ' y la placa ' + b.chip + ' es ' + ch.s + '. No entra físicamente.');
      else {
        var sp = ch.sup[cpu.plat];
        if (sp === 'ok') add('ok', 'Zócalo y chipset: el ' + cpu.n + ' funciona en ' + ch.id + ' sin tocar nada.');
        else if (sp === 'bios') add('warn', 'BIOS: el ' + cpu.n + ' entra en ' + ch.id + ', pero la placa necesita una BIOS actualizada. Si viene antigua, actualízala con la CPU vieja o con BIOS Flashback (sin CPU).');
        else add('bad', 'Chipset: ' + ch.id + ' no admite el ' + cpu.n + ' aunque el zócalo coincida.');
        if (ch.id === 'A620' && cpu.pmax >= 200) add('warn', 'VRM: muchas A620 no aguantan bien CPU de 170 W o más. Revisa la lista de CPU de la placa.');
        if (b.vrm <= 1 && cpu.pmax > 150) add('warn', 'VRM: una placa ' + ch.id + ' básica con un ' + cpu.n + ' (hasta ' + cpu.pmax + ' W) puede calentarse y bajar el rendimiento (throttling). Busca placa con mejor VRM.');
        if (/K/.test(cpu.n) && !ch.oc && cpu.brand === 'Intel') add('info', 'Overclock: el ' + cpu.n + ' es K, pero ' + ch.id + ' no permite overclock de CPU. Pagas por algo que no usas.');
        if (cpu.degr) add('warn', 'Intel 13.ª/14.ª: actualiza la BIOS a una con microcódigo 0x12B o posterior para evitar la degradación.');
      }
    }
    if (ram && b) {
      if (ram.ddr !== b.ddr) add('bad', 'Memoria: la placa es ' + b.ddr + ' y la RAM es ' + ram.ddr + '. Tienen la muesca en otro sitio: no entra.');
      else add('ok', 'Memoria: ' + ram.ddr + ' coincide con la placa.');
      if (ram.mods === 1) add('warn', 'Un solo módulo = un canal (media encimera). Pierdes rendimiento, sobre todo con gráfica integrada y en juegos con mucha CPU.');
      if (ch && !ch.moc) add('warn', 'XMP/EXPO: ' + ch.id + ' no permite subir la memoria de su velocidad base: la RAM puede quedarse por debajo de lo que pone en la caja.');
      if (b.ff === 'Mini-ITX') add('info', 'Mini-ITX: solo 2 ranuras de RAM. Para ampliar tendrás que cambiar los dos módulos.');
    }
    if (cpu && ram && cpu.ddr.indexOf(ram.ddr) < 0) add('bad', 'El ' + cpu.n + ' no admite ' + ram.ddr + '.');
    if (cpu && !cpu.igpu && !gpu) add('bad', 'El ' + cpu.n + ' no tiene gráfica integrada y no has puesto gráfica dedicada: el PC no dará imagen.');
    if (gpu && cs) {
      if (gpu.len > cs.gpuMax) add('bad', 'Longitud: una ' + gpu.n + ' típica mide ≈' + gpu.len + ' mm y la caja admite ' + cs.gpuMax + ' mm. Mide el modelo exacto.');
      else if (gpu.len > cs.gpuMax - 15) add('warn', 'Longitud justa: ' + gpu.len + ' mm en una caja de ' + cs.gpuMax + ' mm. Puede chocar con ventiladores frontales.');
      else add('ok', 'Longitud de la gráfica: cabe (≈' + gpu.len + ' de ' + cs.gpuMax + ' mm).');
    }
    if (b && cs && cs.ff.indexOf(b.ff) < 0) add('bad', 'Formato: la placa es ' + b.ff + ' y la caja solo admite ' + cs.ff.join(', ') + '.');
    if (k && cs) {
      if (k.type === 'aio') { if (k.rad > cs.rad) add('bad', 'Radiador: la AIO de ' + k.rad + ' mm no cabe; la caja admite hasta ' + cs.rad + ' mm.'); else add('ok', 'Radiador de ' + k.rad + ' mm: cabe.'); }
      else if (k.h > cs.coolerMax) add('bad', 'Altura del disipador: ' + k.h + ' mm y la caja admite ' + cs.coolerMax + ' mm. La tapa no cerrará.');
      else add('ok', 'Altura del disipador: ' + k.h + ' de ' + cs.coolerMax + ' mm.');
    }
    if (k && cpu) {
      if (k.w < cpu.pmax * 0.8) add('warn', 'Refrigeración: el ' + k.n.toLowerCase() + ' disipa ≈' + k.w + ' W y el ' + cpu.n + ' puede llegar a ' + cpu.pmax + ' W. Irá caliente, ruidoso o bajará frecuencia.');
      if (k.price === 0 && (/K|X3D|X$/.test(cpu.n) && cpu.brand === 'Intel' ? true : cpu.tdp > 65)) add('warn', 'El ' + cpu.n + ' no suele traer disipador de serie (o el de serie se queda corto). Cuenta con comprar uno.');
    }
    if (psu) {
      var c = E.psuCalc(cpu, gpu);
      if (psu.tier === 'F') add('bad', 'Fuente: una genérica sin certificación fiable puede dar mucho menos de lo que pone y no proteger bien al resto. Es la pieza que no se escatima.');
      if (psu.real < c.min) add('bad', 'Potencia: estimo ' + c.total + ' W de consumo máximo y la fuente da ' + psu.real + ' W reales. Mínimo ' + c.min + ' W.');
      else if (psu.real < c.rec) add('warn', 'Potencia justa: ' + psu.real + ' W para ≈' + c.total + ' W. Recomendado ' + c.rec + ' W para aguantar los picos de la gráfica.');
      else add('ok', 'Potencia: ' + psu.real + ' W para ≈' + c.total + ' W de máximo. Recomendado ' + c.rec + ' W.');
      if (gpu && /12V-2x6|12VHPWR/.test(gpu.conn) && !psu.native) add('warn', 'Conector: la ' + gpu.n + ' usa 16 pines y la fuente no lo trae nativo. Tendrás que usar el adaptador de la gráfica (encájalo hasta el fondo) o cambiar a fuente ATX 3.1.');
      var need8 = gpu ? (/3 × 8|\(3/.test(gpu.conn) ? 3 : /2 × 8|8 \+ 6|8 \+ 8/.test(gpu.conn) ? 2 : /1 × 8|6 pines/.test(gpu.conn) ? 1 : 0) : 0;
      if (gpu && !/12V-2x6|12VHPWR/.test(gpu.conn) && need8 > psu.pcie8) add('bad', 'Conectores: la gráfica pide ' + need8 + ' cables PCIe y la fuente trae ' + psu.pcie8 + '.');
    }
    if (gpu && ch && /^3\.0/.test(ch.gpu) && gpu.lanes < 16) add('warn', 'PCIe: la ' + gpu.n + ' es x' + gpu.lanes + ' y la placa ' + ch.id + ' da PCIe 3.0: perderá algo de rendimiento (mucho si es x4).');
    if (gpu && gpu.rebar && cpu && /zen1|zenplus|skylake/.test(cpu.arch)) add('warn', 'Intel Arc con un procesador antiguo: sin Resizable BAR o con poca CPU rinde bastante menos.');
    if (b) {
      var m2 = st.filter(function (s) { return s.m2; }).length, sata = st.length - m2;
      if (m2 > b.m2) add('bad', 'M.2: has puesto ' + m2 + ' SSD M.2 y la placa tiene ' + b.m2 + ' ranuras.');
      if (sata > b.sata) add('bad', 'SATA: ' + sata + ' discos SATA y la placa tiene ' + b.sata + ' puertos.');
      if (m2 >= 2 && b.share) add('info', 'Carriles compartidos: ' + b.share);
      if (ch && st.some(function (s) { return s.type === 'NVMe 5.0'; }) && !/5\.0/.test(ch.m2)) add('info', 'El SSD PCIe 5.0 funcionará a la velocidad del M.2 de la placa (' + ch.m2 + '). Para jugar no se nota.');
    }
    return out;
  };

  return E;
})();
