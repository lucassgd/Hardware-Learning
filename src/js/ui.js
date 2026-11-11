/* =========================================================================
   VISTAS: Aprender, Lección, Catálogo, Comparar, Nombres, Glosario
   ========================================================================= */
(function () {
  var h = HW.h, E = HW.E;

  /* ---------------- Preguntas: todas en un mismo banco ---------------- */
  HW.allQuestions = function () {
    if (HW._qpool) return HW._qpool;
    var pool = [];
    HW.lessons.forEach(function (L) { (L.quiz || []).forEach(function (q, i) { pool.push(Object.assign({ id: L.id + '-' + i, l: L.id, lvl: L.lvl }, q)); }); });
    HW.questions.forEach(function (q, i) { pool.push(Object.assign({ id: 'x-' + i }, q)); });
    return (HW._qpool = pool);
  };
  HW.lesson = function (id) { return HW.lessons.find(function (l) { return l.id === id; }); };

  /* ---------------- Componente de test ---------------- */
  HW.ui.quiz = {};
  HW.quizHtml = function (ctx, qs, opts) {
    opts = opts || {};
    HW.ui.quiz[ctx] = { qs: qs, done: {}, ok: 0, opts: opts };
    return '<div class="stack" id="quiz-' + ctx + '">' + qs.map(function (q, i) {
      var order = opts.noShuffle ? q.o.map(function (_, j) { return j; }) : HW.shuffle(q.o.map(function (_, j) { return j; }));
      return '<div class="card q" data-qi="' + i + '"><div class="eyebrow">Pregunta ' + (i + 1) + ' de ' + qs.length + (q.lvl ? ' · ' + q.lvl : '') + '</div><b>' + h(q.q) + '</b>' +
        order.map(function (j) { return '<button class="opt" data-act="ans" data-ctx="' + ctx + '" data-qi="' + i + '" data-o="' + j + '">' + h(q.o[j]) + '</button>'; }).join('') + '<div class="explain" hidden></div></div>';
    }).join('') + '<div class="card" id="quizres-' + ctx + '" hidden></div></div>';
  };
  HW.A.ans = function (el) {
    var ctx = el.dataset.ctx, Q = HW.ui.quiz[ctx]; if (!Q) return;
    var i = +el.dataset.qi, q = Q.qs[i]; if (Q.done[i] != null) return;
    var o = +el.dataset.o, ok = o === q.a; Q.done[i] = ok; if (ok) Q.ok++;
    var card = el.closest('.q');
    card.querySelectorAll('.opt').forEach(function (b) { b.disabled = true; if (+b.dataset.o === q.a) b.classList.add('right'); else if (b === el) b.classList.add('wrong'); });
    var ex = card.querySelector('.explain'); ex.hidden = false; ex.innerHTML = (ok ? '<b>Correcto.</b> ' : '<b>No.</b> La respuesta es: ' + h(q.o[q.a]) + '. ') + h(q.x || '') + (q.l ? ' <a href="#leccion-' + q.l + '">Ir a la lección ' + q.l + '</a>' : '');
    HW.stat(q.l || 'otros', ok);
    if (q.id) { if (ok) { if (HW.S.cards['q:' + q.id]) HW.cardAnswer('q:' + q.id, true); } else HW.cardFail('q:' + q.id); }
    if (Object.keys(Q.done).length === Q.qs.length) {
      var pct = Math.round(Q.ok / Q.qs.length * 100), res = document.getElementById('quizres-' + ctx);
      res.hidden = false;
      res.innerHTML = '<h3>Resultado: ' + Q.ok + ' de ' + Q.qs.length + ' (' + pct + ' %)</h3><p>' + (pct >= 80 ? 'Muy bien. Lo dominas.' : pct >= 60 ? 'Bien. Repasa las que fallaste: volverán antes en las tarjetas de repaso.' : 'Toca repasar. Las falladas se han añadido a tus tarjetas de repaso.') + '</p>' + (Q.opts.onEnd ? Q.opts.onEnd(pct) : '');
    }
  };

  /* ---------------- Tablas generadas desde los datos ---------------- */
  HW.dyn = {
    sockets: function () { return '<div class="table-wrap"><table><thead><tr><th>Zócalo</th><th>Años</th><th>RAM</th><th>Procesadores</th></tr></thead><tbody>' + HW.sockets.map(function (s) { return '<tr><td><b>' + s.id + '</b></td><td class="num">' + s.from + '–' + (s.to || '?') + '</td><td>' + s.ddr + '</td><td>' + h(s.gens) + '<div class="tiny muted">' + h(s.note) + '</div></td></tr>'; }).join('') + '</tbody></table></div>'; },
    chipsets: function () {
      var socks = ['AM4', 'AM5', 'LGA1700', 'LGA1851', 'LGA1200', 'LGA1151 (v2)'];
      return socks.map(function (s) { var list = HW.chipsets.filter(function (c) { return c.s === s; }); return '<details class="more"' + (s === 'LGA1700' || s === 'AM5' ? ' open' : '') + '><summary>Chipsets ' + s + '</summary><div><div class="table-wrap"><table><thead><tr><th>Chipset</th><th>OC CPU</th><th>OC RAM</th><th>PCIe gráfica</th><th>M.2</th><th>Nota</th></tr></thead><tbody>' + list.map(function (c) { return '<tr><td><b>' + c.id + '</b></td><td>' + (c.oc ? 'Sí' : 'No') + '</td><td>' + (c.moc ? 'Sí' : 'No') + '</td><td>' + h(c.gpu) + '</td><td>' + h(c.m2) + '</td><td class="small">' + h(c.note) + '</td></tr>'; }).join('') + '</tbody></table></div></div></details>'; }).join('');
    },
    latency: function () {
      return '<div class="card"><h4>Calculadora de latencia real</h4><div class="grid2"><label class="field">MT/s<input id="latMts" type="number" inputmode="numeric" value="6000" data-inp="lat"></label><label class="field">CL<input id="latCl" type="number" inputmode="numeric" value="30" data-inp="lat"></label></div><p id="latOut" class="mono">10,0 ns</p>' +
        '<div class="table-wrap"><table><thead><tr><th>Memoria</th><th class="num">ns</th></tr></thead><tbody>' + [['DDR4-2666 CL19', 2666, 19], ['DDR4-3200 CL16', 3200, 16], ['DDR4-3600 CL18', 3600, 18], ['DDR5-4800 CL40', 4800, 40], ['DDR5-6000 CL30', 6000, 30], ['DDR5-6000 CL36', 6000, 36], ['DDR5-7200 CL34', 7200, 34]].map(function (r) { return '<tr><td>' + r[0] + '</td><td class="num">' + E.fmt(r[2] * 2000 / r[1], 1) + '</td></tr>'; }).join('') + '</tbody></table></div></div>';
    },
    psuTable: function () {
      var names = ['GTX 1660 SUPER', 'RTX 5050', 'RTX 5060', 'RTX 5060 Ti 16GB', 'RTX 5070', 'RTX 5070 Ti', 'RTX 5080', 'RTX 5090', 'Arc B580', 'RX 9060 XT 16GB', 'RX 9070 GRE', 'RX 9070', 'RX 9070 XT', 'RX 7900 XTX', 'RTX 4090'];
      return '<div class="table-wrap"><table><thead><tr><th>Gráfica</th><th class="num">Consumo</th><th class="num">Fabricante</th><th class="num">Yo pondría</th><th>Conector</th></tr></thead><tbody>' + names.map(function (n) { var g = E.findGpu(n); if (!g) return ''; var mine = E.ceil50((150 + g.tbp + 100) * 1.3); mine = Math.max(mine, g.psu); return '<tr><td>' + h(g.n) + (g.mine ? ' <span class="pill me">mi PC</span>' : '') + '</td><td class="num">' + g.tbp + ' W</td><td class="num">' + g.psu + ' W</td><td class="num"><b>' + mine + ' W</b></td><td class="small">' + h(g.conn) + '</td></tr>'; }).join('') + '</tbody></table></div>';
    },
    spots: function () { return '<div class="table-wrap"><table><thead><tr><th class="num">N.º</th><th>Conector</th><th>Para qué</th></tr></thead><tbody>' + HW.boardSpots.map(function (s) { return '<tr><td class="num"><b>' + s.n + '</b></td><td><b>' + h(s.k) + '</b></td><td class="small">' + h(s.d) + '</td></tr>'; }).join('') + '</tbody></table></div>'; },
    upgradeTable: function () {
      var mg = HW.myGpu(), mc = HW.myCpu(); if (!mg || !mc) return '';
      var opts = ['Arc B580', 'RTX 5060', 'RX 9060 XT 16GB', 'RTX 5060 Ti 16GB', 'RX 9070 GRE', 'RTX 5070', 'RX 9070', 'RX 9070 XT', 'RTX 5070 Ti'];
      return '<p class="small muted">Estimación con tu ' + h(mc.n) + ' a 1080p: ganancia según los índices del catálogo, limitada por tu procesador con el detector de cuello de botella. Precios orientativos ' + HW.PRICE_DATE + '.</p><div class="table-wrap"><table><thead><tr><th>Gráfica</th><th class="num">Mejora aprox.</th><th class="num">Precio</th><th class="num">€ por cada +10 %</th><th class="num">Fuente</th></tr></thead><tbody>' + opts.map(function (n) {
        var g = E.findGpu(n); if (!g) return ''; var b0 = E.bottleneck(mc, mg, '1080'), b1 = E.bottleneck(mc, g, '1080');
        var fps0 = Math.min(b0.cpu, b0.gpu), fps1 = Math.min(b1.cpu, b1.gpu), gain = Math.round((fps1 / fps0 - 1) * 100), pr = HW.prices.gpu[n];
        return '<tr><td>' + h(n) + '</td><td class="num">+' + gain + ' %</td><td class="num">' + (pr ? pr + ' €' : '—') + '</td><td class="num">' + (pr ? E.fmt(pr / (gain / 10), 0) + ' €' : '—') + '</td><td class="num">' + g.psu + ' W</td></tr>';
      }).join('') + '</tbody></table></div>';
    }
  };
  HW.A.lat = function () { var m = +document.getElementById('latMts').value, c = +document.getElementById('latCl').value; document.getElementById('latOut').textContent = m > 0 ? E.fmt(c * 2000 / m, 2) + ' ns  (= ' + c + ' × 2000 / ' + m + ')' : '—'; };

  function block(b) {
    if (b.p) return '<p>' + b.p + '</p>';
    if (b.h) return '<h3>' + b.h + '</h3>';
    if (b.c) { var c = b.c; return '<article class="concept"><h3>' + c.h + '</h3><span class="term">' + c.term + '</span><dl><div><dt class="k-que">Qué es</dt><dd>' + c.q + '</dd></div><div><dt class="k-ana">En la cocina</dt><dd>' + c.a + '</dd></div><div><dt class="k-eje">Ejemplo real</dt><dd>' + c.e + '</dd></div><div><dt class="k-tra">Trampa típica</dt><dd>' + c.t + '</dd></div></dl></article>'; }
    if (b.mine) return '<div class="box mine"><h4>Con tu PC</h4><p>' + b.mine + '</p></div>';
    if (b.tip) return '<div class="box tip"><p>' + b.tip + '</p></div>';
    if (b.warn) return '<div class="box warn"><p>' + b.warn + '</p></div>';
    if (b.svg) { var s = HW.svg[b.svg]; return '<figure class="figure">' + (typeof s === 'function' ? s(b.opts) : s) + (b.cap ? '<figcaption>' + b.cap + '</figcaption>' : '') + '</figure>'; }
    if (b.ul) return '<ul>' + b.ul.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>';
    if (b.ol) return '<ol>' + b.ol.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ol>';
    if (b.table) return '<div class="table-wrap"><table><thead><tr>' + b.table.head.map(function (x) { return '<th>' + x + '</th>'; }).join('') + '</tr></thead><tbody>' + b.table.rows.map(function (r) { return '<tr>' + r.map(function (x) { return '<td>' + x + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>';
    if (b.dyn) return HW.dyn[b.dyn] ? HW.dyn[b.dyn]() : '';
    return '';
  }

  /* ---------------- Aprender ---------------- */
  HW.ui.lvl = '';
  HW.V.aprender = function () {
    var total = HW.lessons.length, done = HW.lessons.filter(function (l) { return HW.S.done[l.id]; }).length, pc = HW.S.myPc;
    var lv = ['Básico', 'Intermedio', 'Avanzado', 'Experto'];
    return '<section class="stack"><div class="section-title"><h1>Aprender</h1><span class="pill">' + done + ' de ' + total + ' lecciones</span></div>' +
      '<div class="progress" aria-label="Progreso"><i style="width:' + (done / total * 100) + '%"></i></div>' +
      '<div class="box mine"><h4>Tu PC, el caso práctico de toda la app</h4><p class="small">' + h(pc.cpu) + ' · ' + h(pc.gpu) + ' (6 GB) · ' + h(pc.ram) + ' · ' + h(pc.storage) + ' · ' + h(pc.os) + '</p><p class="small">Placa: ' + (pc.chip ? 'chipset ' + h(pc.chip) : 'por averiguar') + ' · Fuente: ' + (pc.psuW ? pc.psuW + ' W' : 'por averiguar') + '</p><div class="row"><button class="btn sm" data-act="goTool" data-t="mipc">Completar datos de mi PC</button></div></div>' +
      '<div class="chips" role="group" aria-label="Nivel">' + ['', 'Básico', 'Intermedio', 'Avanzado', 'Experto'].map(function (l) { return '<button class="chip" data-act="lvl" data-l="' + l + '" aria-pressed="' + (HW.ui.lvl === l) + '">' + (l || 'Todas') + '</button>'; }).join('') + '</div>' +
      lv.filter(function (l) { return !HW.ui.lvl || HW.ui.lvl === l; }).map(function (l) {
        var ls = HW.lessons.filter(function (x) { return x.lvl === l; });
        return '<h2>' + l + '</h2><div class="lesson-list">' + ls.map(function (x) { var d = HW.S.done[x.id], q = HW.S.quiz[x.id]; return '<button class="lesson-item' + (d ? ' done' : '') + '" data-act="openL" data-id="' + x.id + '"><span class="letter">' + x.id + '</span><span class="meta"><b>' + h(x.t) + '</b><span class="small muted">' + h(x.sum) + '</span>' + (q != null ? '<span class="tiny muted"> · Test: ' + q + ' %</span>' : '') + '</span></button>'; }).join('') + '</div>';
      }).join('') + '</section>';
  };
  HW.A.lvl = function (el) { HW.ui.lvl = el.dataset.l; HW.rerender(); };
  HW.A.openL = function (el) { HW.go('leccion-' + el.dataset.id); };
  HW.A.goTool = function (el) { HW.ui.tool = el.dataset.t; HW.go('herramientas'); };

  HW.V.leccion = function (id) {
    var L = HW.lesson(id); if (!L) return HW.V.aprender();
    var idx = HW.lessons.indexOf(L), prev = HW.lessons[idx - 1], next = HW.lessons[idx + 1];
    var qs = (L.quiz || []).map(function (q, i) { return Object.assign({ id: L.id + '-' + i, l: L.id, lvl: L.lvl }, q); });
    return '<article class="lesson-body"><div class="row"><button class="btn sm ghost" data-act="back">← Lecciones</button><span class="pill a">' + L.lvl + '</span>' + (HW.S.done[L.id] ? '<span class="pill ok">Hecha</span>' : '') + '</div>' +
      '<h1>' + L.id + ') ' + h(L.t) + '</h1><p class="muted">' + h(L.sum) + '</p>' + L.body.map(block).join('') +
      '<h2>Comprueba lo que has aprendido</h2>' + HW.quizHtml('L' + L.id, qs, { onEnd: function (pct) { HW.S.quiz[L.id] = Math.max(HW.S.quiz[L.id] || 0, pct); HW.S.done[L.id] = true; HW.save(); return '<p class="small">Lección marcada como hecha.</p>'; } }) +
      '<div class="row"><button class="btn" data-act="markDone" data-id="' + L.id + '">' + (HW.S.done[L.id] ? 'Marcar como pendiente' : 'Marcar como leída') + '</button></div>' +
      '<div class="grid2">' + (prev ? '<button class="btn" data-act="openL" data-id="' + prev.id + '">← ' + prev.id + ') ' + h(prev.t) + '</button>' : '<span></span>') + (next ? '<button class="btn primary" data-act="openL" data-id="' + next.id + '">' + next.id + ') ' + h(next.t) + ' →</button>' : '<span></span>') + '</div></article>';
  };
  HW.V.leccion.after = function (root) { root.querySelectorAll('.hot').forEach(function (g) { g.addEventListener('click', function () { var s = HW.boardSpots[+g.dataset.spot - 1]; HW.toast(s.n + ' · ' + s.k); }); }); };
  HW.A.back = function () { HW.go('aprender'); };
  HW.A.markDone = function (el) { var id = el.dataset.id; HW.S.done[id] = !HW.S.done[id]; HW.save(); HW.rerender(); };

  /* ---------------- Catálogo ---------------- */
  HW.ui.cat = { kind: 'cpu', brand: '', seg: 'desktop', q: '', sort: 'year', open: null, sub: 'list' };
  function cpuCard(c) {
    var C = HW.ui.cat, open = C.open === c.id, gi = E.gameIdx(c), pr = E.cpuPrice(c);
    return '<div class="spec-item' + (c.mine ? ' mine' : '') + '" data-act="openSpec" data-id="' + c.id + '" role="button" tabindex="0" aria-expanded="' + open + '"><div class="spec-head"><b>' + h(c.brand + ' ' + c.n) + '</b><span class="tiny muted mono">' + c.y + '</span></div>' +
      '<div class="row">' + (c.mine ? '<span class="pill me">Mi PC</span>' : '') + '<span class="pill">' + h(E.arch(c).name.split(' (')[0]) + '</span><span class="pill">' + h(c.socket) + '</span><span class="pill">' + c.c + (c.e ? 'P+' + (c.e + c.lpe) + 'E' : '') + ' / ' + c.t + ' hilos</span>' + (c.x3d ? '<span class="pill a">X3D</span>' : '') + '</div>' +
      (c.seg === 'desktop' ? HW.bar('Juegos', gi.v, 105) : '') + HW.bar('Multinúcleo', c.m, 105, true) +
      (open ? '<div class="kv" style="margin-top:6px">' + [
        ['Arquitectura', E.arch(c).name + ' (' + E.arch(c).y + ')'], ['Nombre en clave', c.code], ['Nodo', c.node], ['Zócalo', c.socket], ['Núcleos', c.c + ' P' + (c.e ? ' + ' + c.e + ' E' : '') + (c.lpe ? ' + ' + c.lpe + ' LP-E' : '') + ' · ' + c.t + ' hilos'],
        ['Frecuencia', E.fmt(c.b) + ' GHz base · ' + E.fmt(c.bo) + ' GHz turbo'], ['Caché', 'L2 ' + E.fmt(c.l2) + ' MB · L3 ' + c.l3 + ' MB'], ['Consumo', c.tdp + ' W (TDP/PBP) · ' + c.pmax + ' W máx. (PL2/PPT)'], ['Gráfica integrada', c.igpu || 'No'],
        ['Memoria', c.mem], ['PCIe', c.pcie], ['Chipsets', chipsetsFor(c)], ['Índice juegos', c.seg === 'desktop' ? gi.v + ' (9800X3D = 100; aprox., TechPowerUp/HUB)' : 'No aplica (portátil)'], ['Índice multinúcleo', c.m + ' (9950X = 100; aprox., tipo Cinebench)'],
        ['Fiabilidad del dato', HW.confPill(c.conf)], ['Precio', pr ? pr.v + ' ' + pr.cur + ' (' + pr.note + ')' : 'No disponible'], ['Rival', c.riv || '—'], ['Notas', c.note || '—']
      ].map(function (r) { return '<div>' + r[0] + '</div><div>' + r[1] + '</div>'; }).join('') + '</div><div class="row"><button class="btn sm" data-act="toCmp" data-id="' + c.id + '">Comparar</button><button class="btn sm" data-act="decodeThis" data-n="' + h(c.n) + '">Descomponer el nombre</button></div>' : '') + '</div>';
  }
  function chipsetsFor(c) { if (c.seg !== 'desktop') return 'Soldado en el portátil'; var l = HW.chipsets.filter(function (x) { return x.sup[c.plat] && x.sup[c.plat] !== 'no'; }); return l.map(function (x) { return x.id + (x.sup[c.plat] === 'bios' ? ' (BIOS)' : ''); }).join(', ') || '—'; }
  function gpuCard(g) {
    var C = HW.ui.cat, open = C.open === g.id, pr = E.gpuPrice(g);
    return '<div class="spec-item' + (g.mine ? ' mine' : '') + '" data-act="openSpec" data-id="' + g.id + '" role="button" tabindex="0" aria-expanded="' + open + '"><div class="spec-head"><b>' + h(g.brand + ' ' + g.n) + '</b><span class="tiny muted mono">' + g.y + '</span></div>' +
      '<div class="row">' + (g.mine ? '<span class="pill me">Mi PC</span>' : '') + '<span class="pill">' + h(g.arch) + '</span><span class="pill">' + g.vram + ' GB ' + h(g.vt) + '</span><span class="pill">' + g.tbp + ' W</span>' + (g.lanes < 16 ? '<span class="pill warn">PCIe x' + g.lanes + '</span>' : '') + '</div>' +
      HW.bar('1080p', E.gpuPerf(g, '1080'), 100) + HW.bar('1440p', g.p, 100, true) + HW.bar('4K', E.gpuPerf(g, '4k'), 100) +
      (open ? '<div class="kv" style="margin-top:6px">' + [
        ['Arquitectura', g.arch], ['Chip', g.code], ['Nodo', g.node], ['VRAM', g.vram + ' GB ' + g.vt + ' · bus ' + g.bus + ' bits · ' + E.fmt(g.bw, 0) + ' GB/s'], ['Shaders', E.fmt(g.sh, 0)], ['Núcleos RT', g.rt ? g.rt + '.ª generación' : 'No tiene'], ['Núcleos de IA', g.ai],
        ['Consumo', g.tbp + ' W'], ['Conector', g.conn], ['Fuente recomendada', g.psu + ' W (fabricante)'], ['PCIe', g.pcie + ' x' + g.lanes], ['Escalado', g.up], ['Codificador', E.encoder(g)], ['Longitud típica', '≈' + g.len + ' mm (mira tu modelo)'],
        ['Índices', '1080p ' + E.gpuPerf(g, '1080') + ' (est.) · 1440p ' + g.p + ' · 4K ' + E.gpuPerf(g, '4k') + ' (est.). RTX 5090 = 100; aprox., TechPowerUp/HUB'], ['Fiabilidad del dato', HW.confPill(g.conf)], ['Precio', pr ? pr.v + ' ' + pr.cur + ' (' + pr.note + ')' : 'No disponible'], ['Rival', g.riv || '—'], ['Notas', g.note || '—']
      ].map(function (r) { return '<div>' + r[0] + '</div><div>' + r[1] + '</div>'; }).join('') + '</div><div class="row"><button class="btn sm" data-act="toCmp" data-id="' + g.id + '">Comparar</button><button class="btn sm" data-act="decodeThis" data-n="' + h(g.n) + '">Descomponer el nombre</button></div>' : '') + '</div>';
  }
  function timelineSvg() {
    var lanes = Object.keys(HW.timeline), x0 = 110, y0 = 30, W = 1100, lh = 92, min = 2016, max = 2027.5;
    function X(y) { return x0 + (y - min) / (max - min) * (W - x0 - 30); }
    var s = '<svg width="' + W + '" viewBox="0 0 ' + W + ' ' + (y0 + lanes.length * lh + 10) + '" role="img" aria-label="Línea de tiempo de generaciones">';
    for (var yr = 2016; yr <= 2027; yr++) s += '<line x1="' + X(yr) + '" y1="18" x2="' + X(yr) + '" y2="' + (y0 + lanes.length * lh) + '" stroke="var(--line)"/><text x="' + X(yr) + '" y="14" text-anchor="middle" font-size="11" font-family="var(--font-mono)" fill="var(--muted)">' + yr + '</text>';
    lanes.forEach(function (ln, i) {
      var y = y0 + i * lh + 40;
      s += '<text x="8" y="' + (y + 4) + '" font-size="12" font-weight="700" font-family="var(--font-display)" fill="var(--fg)">' + ln + '</text><line x1="' + x0 + '" y1="' + y + '" x2="' + (W - 20) + '" y2="' + y + '" stroke="var(--muted)" stroke-width="2"/>';
      HW.timeline[ln].forEach(function (ev, j) {
        var x = X(ev.y), up = j % 2 === 0;
        s += '<circle cx="' + x + '" cy="' + y + '" r="6" fill="' + (ev.future ? 'var(--surface)' : 'var(--accent)') + '" stroke="var(--accent)" stroke-width="2"' + (ev.future ? ' stroke-dasharray="2 2"' : '') + '/>' +
          '<text x="' + x + '" y="' + (up ? y - 22 : y + 22) + '" text-anchor="middle" font-size="11" font-weight="700" font-family="var(--font-body)" fill="var(--fg)">' + h(ev.t) + '</text>' +
          '<text x="' + x + '" y="' + (up ? y - 10 : y + 34) + '" text-anchor="middle" font-size="10" font-family="var(--font-body)" fill="var(--muted)">' + h([ev.a, ev.s].filter(Boolean).join(' · ')) + '</text>';
      });
    });
    return s + '</svg>';
  }
  HW.V.catalogo = function () {
    var C = HW.ui.cat;
    var head = '<section class="stack"><div class="section-title"><h1>Catálogo</h1><span class="pill">Datos: ' + HW.DATA_DATE + '</span></div>' +
      '<div class="chips" role="group" aria-label="Sección">' + [['cpu', 'Procesadores'], ['gpu', 'Gráficas'], ['time', 'Línea de tiempo']].map(function (k) { return '<button class="chip" data-act="catKind" data-k="' + k[0] + '" aria-pressed="' + (C.kind === k[0]) + '">' + k[1] + '</button>'; }).join('') + '</div>';
    if (C.kind === 'time') return head + '<p class="small muted">Desliza hacia los lados. Los círculos vacíos son generaciones aún no lanzadas a ' + HW.DATA_DATE + ' (por verificar).</p><div class="timeline card">' + timelineSvg() + '</div>' + HW.dyn.sockets() + '</section>';
    var list = C.kind === 'cpu' ? HW.cpus : HW.gpus;
    var brands = C.kind === 'cpu' ? ['AMD', 'Intel'] : ['NVIDIA', 'AMD', 'Intel'];
    list = list.filter(function (x) {
      if (C.brand && x.brand !== C.brand) return false;
      if (C.kind === 'cpu' && C.seg && x.seg !== C.seg) return false;
      if (C.q && E.norm(x.brand + x.n + (x.code || '') + (x.socket || '') + (x.arch || '')).indexOf(E.norm(C.q)) < 0) return false;
      return true;
    }).slice();
    var sorts = { year: function (a, b) { return b.y - a.y; }, perf: function (a, b) { return C.kind === 'cpu' ? E.gameIdx(b).v - E.gameIdx(a).v : b.p - a.p; }, multi: function (a, b) { return C.kind === 'cpu' ? b.m - a.m : b.vram - a.vram; }, price: function (a, b) { return (a.msrp || 99999) - (b.msrp || 99999); } };
    list.sort(sorts[C.sort] || sorts.year);
    return head + '<div class="stack card"><label class="field">Buscar<input type="search" id="catQ" placeholder="Modelo, arquitectura, zócalo…" value="' + h(C.q) + '" data-chg="catQ"></label>' +
      '<div class="chips">' + ['', ].concat(brands).map(function (b) { return '<button class="chip" data-act="catBrand" data-b="' + b + '" aria-pressed="' + (C.brand === b) + '">' + (b || 'Todas las marcas') + '</button>'; }).join('') + '</div>' +
      (C.kind === 'cpu' ? '<div class="chips">' + [['desktop', 'Sobremesa'], ['laptop', 'Portátil'], ['', 'Todos']].map(function (s) { return '<button class="chip" data-act="catSeg" data-s="' + s[0] + '" aria-pressed="' + (C.seg === s[0]) + '">' + s[1] + '</button>'; }).join('') + '</div>' : '') +
      '<label class="field">Ordenar<select id="catSort" data-chg="catSort">' + [['year', 'Más nuevos'], ['perf', C.kind === 'cpu' ? 'Índice de juegos' : 'Rendimiento 1440p'], ['multi', C.kind === 'cpu' ? 'Multinúcleo' : 'VRAM'], ['price', 'Precio de salida']].map(function (o) { return '<option value="' + o[0] + '"' + (C.sort === o[0] ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('') + '</select></label></div>' +
      '<p class="small muted">' + list.length + ' modelos. Índices aproximados a partir de análisis de TechPowerUp y Hardware Unboxed (' + (C.kind === 'cpu' ? 'juegos: Ryzen 7 9800X3D = 100 a 1080p; multinúcleo: Ryzen 9 9950X = 100' : 'RTX 5090 = 100 a 1440p; 1080p y 4K estimados') + '). No uses estos números como cifras exactas.</p>' +
      '<div class="spec-list">' + list.map(C.kind === 'cpu' ? cpuCard : gpuCard).join('') + '</div></section>';
  };
  HW.A.catKind = function (el) { HW.ui.cat.kind = el.dataset.k; HW.ui.cat.open = null; HW.ui.cat.brand = ''; HW.rerender(); };
  HW.A.catBrand = function (el) { HW.ui.cat.brand = el.dataset.b; HW.rerender(); };
  HW.A.catSeg = function (el) { HW.ui.cat.seg = el.dataset.s; HW.rerender(); };
  HW.A.catQ = function (el) { HW.ui.cat.q = el.value; HW.rerender(); };
  HW.A.catSort = function (el) { HW.ui.cat.sort = el.value; HW.rerender(); };
  HW.A.openSpec = function (el, ev) { if (ev.target.closest('button')) return; HW.ui.cat.open = HW.ui.cat.open === el.dataset.id ? null : el.dataset.id; HW.rerender(); };
  HW.A.toCmp = function (el) { var x = E.byId(el.dataset.id), C = HW.ui.cmp; if (C.kind !== x.kind) { C.kind = x.kind; C.b = x.kind === 'cpu' ? HW.myCpu().id : HW.myGpu().id; } C.a = x.id; C.prac = null; HW.go('comparar'); };
  HW.A.decodeThis = function (el) { HW.ui.dec = el.dataset.n; HW.go('nombres'); };

  /* ---------------- Comparador ---------------- */
  HW.ui.cmp = { kind: 'cpu', a: 'cpu-ryzen-7-7800x3d', b: 'cpu-core-i7-14700k', use: 'g1080', pcie3: false, practice: false, prac: null };
  var USE_LIST = [['g1080', 'Juegos 1080p'], ['g1440', 'Juegos 1440p'], ['g4k', 'Juegos 4K'], ['stream', 'Streaming'], ['edit', 'Edición y render'], ['prog', 'Programación'], ['ai', 'IA local'], ['eff', 'Eficiencia / silencio'], ['value', 'Calidad-precio']];
  HW.runCompare = function () { var C = HW.ui.cmp, a = E.byId(C.a), b = E.byId(C.b); return C.kind === 'cpu' ? E.compareCpu(a, b, C.use) : E.compareGpu(a, b, C.use, { pcie3: C.pcie3 }); };
  HW.V.comparar = function () {
    var C = HW.ui.cmp, a = E.byId(C.a), b = E.byId(C.b);
    if (!a || a.kind !== C.kind) { a = C.kind === 'cpu' ? E.findCpu('Ryzen 7 7800X3D') : E.findGpu('RTX 5070'); C.a = a.id; }
    if (!b || b.kind !== C.kind) { b = C.kind === 'cpu' ? E.findCpu('Core i7-14700K') : E.findGpu('RX 9070'); C.b = b.id; }
    var R = HW.runCompare(), opt = C.kind === 'cpu' ? HW.cpuOptions : HW.gpuOptions;
    var html = '<section class="stack"><div class="section-title"><h1>¿Cuál es mejor?</h1><span class="pill">Reglas a partir de los datos</span></div>' +
      '<div class="chips">' + [['cpu', 'Procesadores'], ['gpu', 'Gráficas']].map(function (k) { return '<button class="chip" data-act="cmpKind" data-k="' + k[0] + '" aria-pressed="' + (C.kind === k[0]) + '">' + k[1] + '</button>'; }).join('') + '</div>' +
      '<div class="card"><div class="vs"><label class="field"><span class="side-a">A</span><select id="cmpA" data-chg="cmpSel">' + opt(C.a) + '</select></label><span class="vsmark">vs</span><label class="field"><span class="side-b">B</span><select id="cmpB" data-chg="cmpSel">' + opt(C.b) + '</select></label></div>' +
      '<div class="row"><button class="btn sm" data-act="cmpMine" data-s="a">A = mi pieza</button><button class="btn sm" data-act="cmpMine" data-s="b">B = mi pieza</button><button class="btn sm" data-act="cmpSwap">Intercambiar</button><button class="btn sm" data-act="cmpRandom">Pareja al azar</button></div>' +
      '<div class="eyebrow">Uso</div><div class="chips">' + USE_LIST.map(function (u) { return '<button class="chip" data-act="cmpUse" data-u="' + u[0] + '" aria-pressed="' + (C.use === u[0]) + '">' + u[1] + '</button>'; }).join('') + '</div>' +
      (C.kind === 'gpu' ? '<label class="row small"><input type="checkbox" id="pcie3" data-chg="cmpPcie"' + (C.pcie3 ? ' checked' : '') + '> Mi placa es PCIe 3.0</label>' : '') +
      '<div class="row"><button class="btn ' + (C.practice ? 'primary' : '') + '" data-act="cmpPractice">' + (C.practice ? 'Modo práctica: activado' : 'Practicar: escóndeme el veredicto') + '</button></div></div>';
    if (C.practice && !(C.prac && C.prac.done)) html += practiceBlock(R, a, b);
    else html += resultBlock(R, a, b);
    html += '<h3>Fichas lado a lado</h3><div class="table-wrap"><table class="cmp-table"><thead><tr><th>Dato</th><th class="side-a">' + h(a.n) + '</th><th class="side-b">' + h(b.n) + '</th></tr></thead><tbody>' + R.rows.map(function (r) { return '<tr><td class="lbl">' + r.l + '</td><td class="' + (r.w === 'a' ? 'wa' : '') + '">' + h(r.a) + '</td><td class="' + (r.w === 'b' ? 'wb' : '') + '">' + h(r.b) + '</td></tr>'; }).join('') + '</tbody></table></div><p class="tiny muted">En color, quién gana cada dato. * = índice estimado. Índices aproximados (TechPowerUp, Hardware Unboxed). Precios orientativos ' + HW.PRICE_DATE + '.</p></section>';
    return html;
  };
  function resultBlock(R, a, b) {
    var cls = R.win === 'a' ? ' a' : R.win === 'b' ? ' b' : '';
    return (C_prac_feedback()) + '<div class="verdict' + cls + '"><div class="eyebrow">Veredicto para ' + h(R.use) + '</div><h2>' + h(R.verdict) + '</h2><div class="eyebrow">Frase para decirlo</div><p class="say">«' + h(R.say) + '»</p></div>' +
      '<div class="card"><h3>El razonamiento, paso a paso</h3><ol class="reasons">' + R.reasons.map(function (r) { return '<li class="' + (r.s === 'a' ? 'ra' : r.s === 'b' ? 'rb' : '') + '">' + (r.s ? '<span class="' + (r.s === 'a' ? 'side-a' : 'side-b') + '">[' + (r.s === 'a' ? 'A' : 'B') + ']</span> ' : '') + h(r.t) + '</li>'; }).join('') + '</ol></div>' +
      (R.traps.length ? '<div class="box bad"><h4>Ojo con estas trampas</h4><ul>' + R.traps.map(function (t) { return '<li>' + h(t) + '</li>'; }).join('') + '</ul></div>' : '');
  }
  function C_prac_feedback() { var P = HW.ui.cmp.prac; return P && P.done ? '<div class="box ' + (P.score >= 70 ? 'ok' : 'warn') + '"><h4>Tu razonamiento: ' + P.score + ' %</h4>' + P.fb + '</div>' : ''; }
  function swapNames(t, a, b) { return t.split(a.n).join('§§').split(b.n).join(a.n).split('§§').join(b.n); }
  function practiceBlock(R, a, b) {
    var C = HW.ui.cmp;
    if (!C.prac || C.prac.key !== C.a + C.b + C.use) {
      var real = R.reasons.filter(function (r) { return r.s; });
      var stm = [];
      real.forEach(function (r, i) { var flip = i % 2 === 1 && r.t.indexOf(a.n) >= 0; stm.push({ t: flip ? swapNames(r.t, a, b) : r.t, ok: !flip, k: r.k }); });
      if (stm.length < 3) stm.push({ t: 'El que tenga el número de modelo más alto siempre gana.', ok: false, k: 'x' });
      stm.push({ t: C.kind === 'cpu' ? 'Los nm del nodo son la medida exacta del rendimiento.' : 'La gráfica con más shaders gana siempre, aunque sean de marcas distintas.', ok: false, k: 'x' });
      C.prac = { key: C.a + C.b + C.use, stm: HW.shuffle(stm), pick: null, done: false };
    }
    var P = C.prac;
    return '<div class="card"><h3>Practica: ¿cuál es mejor para ' + h(R.use) + '?</h3><div class="eyebrow">1. Elige</div><div class="grid2"><button class="btn' + (P.pick === 'a' ? ' primary' : '') + '" data-act="pracPick" data-p="a">A · ' + h(a.n) + '</button><button class="btn' + (P.pick === 'b' ? ' b' : '') + '" data-act="pracPick" data-p="b">B · ' + h(b.n) + '</button></div><button class="btn' + (P.pick === 'tie' ? ' primary' : '') + '" data-act="pracPick" data-p="tie">Empate práctico</button>' +
      '<div class="eyebrow">2. Marca las afirmaciones verdaderas</div>' + P.stm.map(function (s, i) { return '<label class="row small" style="align-items:flex-start;flex-wrap:nowrap"><input type="checkbox" id="st' + i + '" style="margin-top:4px"> <span>' + h(s.t) + '</span></label>'; }).join('') +
      '<div class="eyebrow">3. Escribe cómo se lo dirías a un amigo</div><textarea id="pracTxt" placeholder="Para jugar, el … porque …"></textarea><button class="btn primary full" data-act="pracCheck">Corregir</button></div>';
  }
  HW.A.pracPick = function (el) { HW.ui.cmp.prac.pick = el.dataset.p; document.querySelectorAll('[data-act="pracPick"]').forEach(function (b) { b.classList.remove('primary', 'b'); }); el.classList.add(el.dataset.p === 'b' ? 'b' : 'primary'); };
  HW.A.pracCheck = function () {
    var C = HW.ui.cmp, P = C.prac, R = HW.runCompare(), a = E.byId(C.a), b = E.byId(C.b);
    if (!P.pick) { HW.toast('Elige primero A, B o empate'); return; }
    var win = R.win || 'tie', okWin = P.pick === win, okSt = 0, fb = [];
    P.stm.forEach(function (s, i) { var ch = document.getElementById('st' + i).checked; if (ch === s.ok) okSt++; else fb.push((s.ok ? 'Era verdadera: ' : 'Era falsa: ') + s.t); });
    var txt = (document.getElementById('pracTxt').value || '').toLowerCase(), keys = [];
    var kw = { cache: ['caché', 'cache', 'l3', 'v-cache', 'bandeja'], arch: ['arquitectura', 'ipc', 'generación', 'nuev'], cores: ['núcleo', 'nucleo', 'hilo'], core: ['ghz', 'por núcleo', 'frecuencia'], eff: ['gasta', 'consumo', 'vatios', ' w'], price: ['precio', 'barat', 'cuesta', '€'], vram: ['vram', 'gb', 'memoria'], perf: ['rápid', 'fps', 'rinde', 'rendimiento'], up: ['dlss', 'fsr', 'xess', 'escalado'], cuda: ['cuda'], bench: ['fps', 'índice', 'benchmark', 'rinde'], plat: ['plataforma', 'zócalo', 'am5', 'futuro'] };
    R.reasons.filter(function (r) { return r.s === R.win && R.win; }).forEach(function (r) { if (kw[r.k] && keys.indexOf(r.k) < 0) keys.push(r.k); });
    var hit = keys.filter(function (k) { return kw[k].some(function (w) { return txt.indexOf(w) >= 0; }); });
    var score = Math.round((okWin ? 40 : 0) + okSt / P.stm.length * 35 + (keys.length ? hit.length / keys.length : (txt.length > 20 ? 1 : 0)) * 25);
    HW.stat('duelos', okWin);
    if (okWin) HW.S.duel.ok++; else HW.S.duel.ko++; HW.save();
    P.done = true; P.score = score;
    P.fb = '<p>' + (okWin ? 'Has acertado el ganador.' : 'El ganador no era ese: ' + (R.win ? (R.win === 'a' ? a.n : b.n) : 'era un empate práctico') + '.') + ' Afirmaciones bien valoradas: ' + okSt + ' de ' + P.stm.length + '.</p>' +
      (fb.length ? '<ul class="small">' + fb.map(function (x) { return '<li>' + h(x) + '</li>'; }).join('') + '</ul>' : '') +
      (keys.length ? '<p class="small">En tu frase ' + (hit.length ? 'has usado: ' + hit.join(', ') + '. ' : '') + (hit.length < keys.length ? 'Te ha faltado mencionar: ' + keys.filter(function (k) { return hit.indexOf(k) < 0; }).map(function (k) { return { cache: 'la caché', arch: 'la arquitectura/IPC', cores: 'los núcleos', core: 'el rendimiento por núcleo', eff: 'el consumo', price: 'el precio', vram: 'la VRAM', perf: 'el rendimiento', up: 'el escalado', cuda: 'CUDA', bench: 'los benchmarks', plat: 'la plataforma' }[k]; }).join(', ') + '.' : '¡Bien argumentado!') + '</p>' : '') +
      '<button class="btn sm" data-act="pracAgain">Otra pareja al azar</button>';
    HW.rerender();
  };
  HW.A.pracAgain = function () { HW.A.cmpRandom(); };
  HW.A.cmpKind = function (el) { HW.ui.cmp.kind = el.dataset.k; HW.ui.cmp.a = null; HW.ui.cmp.b = null; HW.ui.cmp.prac = null; HW.rerender(); };
  HW.A.cmpSel = function () { HW.ui.cmp.a = document.getElementById('cmpA').value; HW.ui.cmp.b = document.getElementById('cmpB').value; HW.ui.cmp.prac = null; HW.rerender(); };
  HW.A.cmpUse = function (el) { HW.ui.cmp.use = el.dataset.u; HW.ui.cmp.prac = null; HW.rerender(); };
  HW.A.cmpPcie = function (el) { HW.ui.cmp.pcie3 = el.checked; HW.rerender(); };
  HW.A.cmpSwap = function () { var C = HW.ui.cmp, t = C.a; C.a = C.b; C.b = t; C.prac = null; HW.rerender(); };
  HW.A.cmpMine = function (el) { var C = HW.ui.cmp, id = C.kind === 'cpu' ? HW.myCpu().id : HW.myGpu().id; C[el.dataset.s] = id; C.prac = null; HW.rerender(); };
  HW.A.cmpPractice = function () { var C = HW.ui.cmp; C.practice = !C.practice; C.prac = null; HW.rerender(); };
  HW.randomPair = function (kind) {
    var list = kind === 'cpu' ? HW.cpus.filter(function (c) { return c.seg === 'desktop' && c.y >= 2019; }) : HW.gpus.filter(function (g) { return g.y >= 2019; });
    var a = HW.pick(list), close = list.filter(function (x) { return x !== a && Math.abs((kind === 'cpu' ? E.gameIdx(x).v - E.gameIdx(a).v : x.p - a.p)) < (kind === 'cpu' ? 18 : 15); });
    var b = HW.pick(close.length ? close : list.filter(function (x) { return x !== a; }));
    return [a, b];
  };
  HW.A.cmpRandom = function () { var C = HW.ui.cmp, p = HW.randomPair(C.kind); C.a = p[0].id; C.b = p[1].id; C.use = HW.pick(USE_LIST)[0]; C.prac = null; HW.rerender(); };

  /* ---------------- Descodificador ---------------- */
  HW.ui.dec = 'Ryzen 7 9800X3D';
  var EX = ['i5-12400F', 'Core Ultra 7 265K', 'Ryzen 7 9800X3D', 'Ryzen 5 7520U', 'RTX 4070 Ti SUPER', 'RX 7900 GRE', 'Core Ultra X9 388H', 'Ryzen AI 9 HX 370', 'Core 5 120U', 'Ryzen 7 8700G', 'Arc B580', 'GTX 1660 SUPER', 'Core Ultra 7 270K Plus', 'i9-14900HX', 'RX 9060 XT 16GB'];
  function decodeOut(s) {
    var D = E.decode(s);
    if (!D) return '<p class="muted">Escribe un modelo.</p>';
    if (!D.meta) return '<div class="box warn"><p>No reconozco ese formato. Prueba con algo como «i5-12400F», «Ryzen 7 7800X3D», «RTX 5070» o «RX 9070 XT».</p></div>';
    var M = D.meta, m = D.match;
    return '<div class="card"><div class="decoded">' + D.parts.map(function (p) { return '<span class="' + p.k + '">' + h(p.t) + '</span>'; }).join('') + '</div>' +
      '<div class="row"><span class="pill">' + (M.type === 'cpu' ? 'Procesador' : 'Tarjeta gráfica') + '</span><span class="pill">' + M.brand + '</span><span class="pill ' + (M.seg === 'laptop' ? 'warn' : 'ok') + '">' + (M.seg === 'laptop' ? 'Portátil' : 'Sobremesa') + '</span>' + (M.year ? '<span class="pill">≈ ' + M.year + '</span>' : '') + (m && m.mine ? '<span class="pill me">Mi PC</span>' : '') + '</div>' +
      '<div class="legend-list">' + D.parts.map(function (p) { return '<div class="' + p.k + '"><span class="sw"></span><div style="color:var(--fg)"><b>' + h(p.lbl) + ' · ' + h(p.t) + '</b><div class="small">' + h(p.exp) + '</div></div></div>'; }).join('') + '</div>' +
      (m ? '<div class="box ok"><p><b>Está en el catálogo:</b> ' + h(m.brand + ' ' + m.n) + ', ' + m.y + ', ' + h(m.kind === 'cpu' ? E.arch(m).name + ' · ' + m.socket + ' · ' + m.c + (m.e ? 'P+' + m.e + 'E' : '') + ' núcleos' : m.arch + ' · ' + m.vram + ' GB') + '.</p><div class="row"><button class="btn sm" data-act="toCmp" data-id="' + m.id + '">Comparar</button><button class="btn sm" data-act="toCat" data-id="' + m.id + '">Ver ficha</button></div></div>' : '<p class="small muted">No está en el catálogo (o no lo he encontrado con ese nombre exacto). La lectura del nombre sigue siendo válida.</p>') + '</div>';
  }
  HW.V.nombres = function () {
    return '<section class="stack"><h1>Descodificador de nombres</h1><p class="muted">Escribe cualquier procesador o gráfica y lo separo por partes.</p>' +
      '<label class="field">Modelo<input type="text" id="decIn" value="' + h(HW.ui.dec) + '" autocomplete="off" autocapitalize="off" spellcheck="false" data-inp="decode"></label>' +
      '<div class="chips">' + EX.map(function (x) { return '<button class="chip" data-act="decEx" data-n="' + h(x) + '">' + h(x) + '</button>'; }).join('') + '</div>' +
      '<div id="decOut">' + decodeOut(HW.ui.dec) + '</div>' +
      '<details class="more"><summary>Leyenda de colores</summary><div><div class="legend-list">' + [['k1', 'Marca y familia'], ['k2', 'Gama'], ['k3', 'Generación o serie'], ['k4', 'Posición dentro de la gama'], ['k5', 'Sufijo o variante'], ['k6', 'Sin letra / extra']].map(function (x) { return '<div class="' + x[0] + '"><span class="sw"></span><span style="color:var(--fg)">' + x[1] + '</span></div>'; }).join('') + '</div></div></details></section>';
  };
  HW.A.decode = function (el) { HW.ui.dec = el.value; document.getElementById('decOut').innerHTML = decodeOut(el.value); };
  HW.A.decEx = function (el) { HW.ui.dec = el.dataset.n; document.getElementById('decIn').value = el.dataset.n; document.getElementById('decOut').innerHTML = decodeOut(el.dataset.n); };
  HW.A.toCat = function (el) { var x = E.byId(el.dataset.id); HW.ui.cat.kind = x.kind; HW.ui.cat.open = x.id; HW.ui.cat.q = x.n; HW.ui.cat.brand = ''; HW.ui.cat.seg = x.seg || ''; HW.go('catalogo'); };

  /* ---------------- Glosario ---------------- */
  HW.ui.gq = '';
  function glossList(q) {
    var n = E.norm(q), items = HW.glossary.slice().sort(function (a, b) { return a[0].localeCompare(b[0], 'es'); }).filter(function (g) { return !n || E.norm(g[0] + g[1] + g[2]).indexOf(n) >= 0; });
    var last = '';
    return '<p class="small muted">' + items.length + ' términos</p>' + items.map(function (g) {
      var L = HW.lesson(g[3]), first = g[0].charAt(0).toUpperCase().normalize('NFD').replace(/[̀-ͯ]/g, ''), anchor = '';
      if (/[0-9]/.test(first)) first = '#';
      if (first !== last) { anchor = ' id="gl-' + (first === '#' ? 'num' : first) + '"'; last = first; }
      return '<div class="gl-item"' + anchor + '><b>' + h(g[0]) + '</b><span>' + h(g[1]) + '</span><span class="ana">En la cocina: ' + h(g[2]) + '</span>' + (L ? '<a class="small" href="#leccion-' + L.id + '">Lección ' + L.id + ') ' + h(L.t) + '</a>' : '') + '</div>';
    }).join('');
  }
  HW.V.glosario = function () {
    var letters = '#ABCDEFGHIJLMNOPQRSTUVXZ'.split('');
    return '<section class="stack"><div class="section-title"><h1>Glosario</h1><span class="pill">' + HW.glossary.length + ' términos</span></div>' +
      '<label class="field">Buscar<input type="search" id="glQ" value="' + h(HW.ui.gq) + '" placeholder="VRM, caché, 12V-2x6…" data-inp="glq"></label>' +
      '<div class="letter-jump">' + letters.map(function (l) { return '<button data-act="glJump" data-l="' + (l === '#' ? 'num' : l) + '">' + l + '</button>'; }).join('') + '</div>' +
      '<div class="stack" id="glList">' + glossList(HW.ui.gq) + '</div></section>';
  };
  HW.A.glq = function (el) { HW.ui.gq = el.value; document.getElementById('glList').innerHTML = glossList(el.value); };
  HW.A.glJump = function (el) { var t = document.getElementById('gl-' + el.dataset.l); if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
})();
