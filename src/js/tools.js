/* =========================================================================
   HERRAMIENTAS: fuente, compatibilidad, ¿puedo cambiar?, montador, cuello de botella, mi PC
   ========================================================================= */
(function () {
  var h = HW.h, E = HW.E;
  HW.ui.tool = 'psu';
  var TOOLS = [['psu', 'Fuente'], ['compat', 'Compatibilidad'], ['swap', '¿Puedo cambiar…?'], ['build', 'Montador'], ['bott', 'Cuello de botella'], ['mipc', 'Mi PC y progreso']];
  function lvlBox(items) {
    return '<div class="stack">' + items.map(function (i) { var c = { ok: 'ok', warn: 'warn', bad: 'bad', info: 'mine' }[i.lv]; var t = { ok: 'Bien', warn: 'Atención', bad: 'Problema', info: 'Información' }[i.lv]; return '<div class="box ' + c + '"><p><b>' + t + ':</b> ' + h(i.t) + '</p></div>'; }).join('') + '</div>';
  }
  function sel(id, opts, chg) { return '<select id="' + id + '" data-chg="' + (chg || 'toolChg') + '">' + opts + '</select>'; }
  HW.V.herramientas = function () {
    var T = HW.ui.tool;
    return '<section class="stack"><h1>Herramientas</h1><div class="chips">' + TOOLS.map(function (t) { return '<button class="chip" data-act="tool" data-t="' + t[0] + '" aria-pressed="' + (T === t[0]) + '">' + t[1] + '</button>'; }).join('') + '</div>' + (VIEWS[T] || VIEWS.psu)() + '</section>';
  };
  HW.A.tool = function (el) { HW.ui.tool = el.dataset.t; HW.rerender(); };
  HW.A.toolChg = function () { readForm(); HW.rerender(); };

  /* Estado de cada herramienta */
  var st = HW.ui.tools = {
    psu: { cpu: null, gpu: null, extra: 0 },
    compat: { cpu: 'cpu-ryzen-7-9800x3d', board: 'b-b650', ram: 'r-d5-32', gpu: 'gpu-rtx-5070-ti', psu: 'p-750g', cas: 'c-atx', cooler: 'k-dual', st: ['s-g4'] },
    swap: { what: 'cpu', cpu: 'cpu-core-i7-14700k', gpu: 'gpu-rtx-5070', ddr: 'DDR5', res: '1440' },
    build: { budget: 1300, use: 'g1440', parts: null, key: '' },
    bott: { cpu: null, gpu: null, res: '1080' }
  };
  function v(id) { var e = document.getElementById(id); return e ? e.value : null; }
  function readForm() {
    var T = HW.ui.tool;
    if (T === 'psu') { st.psu.cpu = v('pCpu'); st.psu.gpu = v('pGpu'); st.psu.extra = +v('pExtra') || 0; }
    if (T === 'compat') { var c = st.compat; c.cpu = v('cCpu'); c.board = v('cBoard'); c.ram = v('cRam'); c.gpu = v('cGpu'); c.psu = v('cPsu'); c.cas = v('cCase'); c.cooler = v('cCool'); c.st = HW.storages.filter(function (s) { var n = document.getElementById('cSt-' + s.id); return n && +n.value > 0; }).reduce(function (acc, s) { for (var i = 0; i < +document.getElementById('cSt-' + s.id).value; i++) acc.push(s.id); return acc; }, []); }
    if (T === 'swap') { var s = st.swap; s.what = v('sWhat') || s.what; if (v('sCpu')) s.cpu = v('sCpu'); if (v('sGpu')) s.gpu = v('sGpu'); if (v('sDdr')) s.ddr = v('sDdr'); if (v('sRes')) s.res = v('sRes'); }
    if (T === 'bott') { st.bott.cpu = v('bCpu'); st.bott.gpu = v('bGpu'); st.bott.res = v('bRes'); }
    if (T === 'mipc') { var p = HW.S.myPc; p.chip = v('mChip') || ''; p.psuW = +v('mPsu') || 0; p.ramMods = +v('mMods') || 0; p.caseLen = +v('mLen') || 0; p.ram = '16 GB DDR4 (' + (p.ramMods === 1 ? '1 módulo: un canal' : p.ramMods === 2 ? '2 módulos: doble canal' : 'módulos: no lo sé') + ')'; HW.save(); }
  }

  var VIEWS = {};
  /* ---------- Calculadora de fuente ---------- */
  VIEWS.psu = function () {
    var S = st.psu, cpu = E.byId(S.cpu) || HW.myCpu(), gpu = E.byId(S.gpu) || HW.myGpu(), c = E.psuCalc(cpu, gpu, S.extra);
    var max = c.rec;
    return '<div class="card"><h2>Calculadora de fuente</h2><label class="field">Procesador' + sel('pCpu', HW.cpuOptions(cpu.id, { desktop: true })) + '</label><label class="field">Gráfica' + sel('pGpu', HW.gpuOptions(gpu.id)) + '</label>' +
      '<label class="field">Extras (HDD, muchos ventiladores, RGB…)<select id="pExtra" data-chg="toolChg">' + [[0, 'Nada especial'], [25, 'Algunos ventiladores y RGB (+25 W)'], [50, 'HDD y muchos ventiladores (+50 W)'], [100, 'Varios discos, AIO, RGB a tope (+100 W)']].map(function (o) { return '<option value="' + o[0] + '"' + (S.extra === o[0] ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('') + '</select></label></div>' +
      '<div class="card"><h3>Consumo máximo estimado: ' + c.total + ' W</h3>' + HW.bar('CPU', c.cpuW, max) + HW.bar('Gráfica', c.gpuW, max, true) + HW.bar('Resto', c.rest, max) +
      '<div class="grid2"><div class="box warn"><div class="eyebrow">Mínima</div><h2 class="num">' + c.min + ' W</h2><p class="small">Total × 1,1</p></div><div class="box ok"><div class="eyebrow">Recomendada</div><h2 class="num">' + c.rec + ' W</h2><p class="small">Total × ' + E.fmt(c.spike, 2) + ' por los picos' + (c.maker ? '; el fabricante pide ' + c.maker + ' W' : '') + '</p></div></div>' +
      '<p class="small muted">De dónde salen los números: CPU = su PL2/PPT (' + cpu.pmax + ' W, el máximo en carga total; jugando suele gastar bastante menos), gráfica = su TGP/TBP (' + gpu.tbp + ' W), resto ≈ 100 W. Es una estimación conservadora.</p>' +
      '<h4>Conectores que necesitas</h4><ul>' + c.conns.map(function (x) { return '<li>' + h(x) + '</li>'; }).join('') + '</ul>' +
      (/12V-2x6|12VHPWR/.test(gpu.conn) ? '<div class="box tip"><p>Para esta gráfica, lo ideal es una fuente ATX 3.1 con cable 12V-2x6 nativo. Encájalo hasta el fondo.</p></div>' : '') +
      '<div class="box mine"><p>Calidad antes que vatios: una buena fuente de ' + c.rec + ' W es mejor que una genérica de ' + (c.rec + 250) + ' W. Comprueba el modelo exacto en una lista de calidad (lección i).</p></div></div>';
  };

  /* ---------- Comprobador de compatibilidad ---------- */
  VIEWS.compat = function () {
    var S = st.compat, cpu = E.byId(S.cpu), b = HW.boards.find(function (x) { return x.id === S.board; }), ram = HW.rams.find(function (x) { return x.id === S.ram; }), gpu = S.gpu ? E.byId(S.gpu) : null,
      psu = HW.psus.find(function (x) { return x.id === S.psu; }), cs = HW.cases.find(function (x) { return x.id === S.cas; }), k = HW.coolers.find(function (x) { return x.id === S.cooler; });
    var stor = S.st.map(function (id) { return HW.storages.find(function (s) { return s.id === id; }); });
    var res = E.check({ cpu: cpu, board: b, ram: ram, gpu: gpu, psu: psu, case: cs, cooler: k, storage: stor });
    var bad = res.filter(function (r) { return r.lv === 'bad'; }).length, warn = res.filter(function (r) { return r.lv === 'warn'; }).length;
    return '<div class="card"><h2>Comprobador de compatibilidad</h2><p class="small muted">Elige las piezas. Las placas, fuentes, cajas y disipadores son tipos genéricos con medidas típicas: comprueba siempre las del modelo exacto.</p>' +
      '<label class="field">Procesador' + sel('cCpu', HW.cpuOptions(S.cpu, { desktop: true })) + '</label><label class="field">Placa base' + sel('cBoard', HW.listOptions(HW.boards, S.board)) + '</label>' +
      '<label class="field">RAM' + sel('cRam', HW.listOptions(HW.rams, S.ram)) + '</label><label class="field">Gráfica' + sel('cGpu', HW.gpuOptions(S.gpu, { empty: 'Sin gráfica dedicada' })) + '</label>' +
      '<label class="field">Fuente' + sel('cPsu', HW.listOptions(HW.psus, S.psu)) + '</label><label class="field">Caja' + sel('cCase', HW.listOptions(HW.cases, S.cas)) + '</label><label class="field">Refrigeración' + sel('cCool', HW.listOptions(HW.coolers, S.cooler)) + '</label>' +
      '<div class="eyebrow">Almacenamiento (cantidad)</div><div class="grid2 collapse">' + HW.storages.map(function (s) { var n = S.st.filter(function (x) { return x === s.id; }).length; return '<label class="field">' + h(s.n) + '<select id="cSt-' + s.id + '" data-chg="toolChg">' + [0, 1, 2, 3, 4].map(function (i) { return '<option' + (i === n ? ' selected' : '') + '>' + i + '</option>'; }).join('') + '</select></label>'; }).join('') + '</div></div>' +
      '<div class="card"><div class="row"><h3>Resultado</h3>' + (bad ? '<span class="pill bad">' + bad + ' problemas</span>' : '<span class="pill ok">Sin problemas graves</span>') + (warn ? '<span class="pill warn">' + warn + ' avisos</span>' : '') + '</div>' + lvlBox(res) + '</div>';
  };

  /* ---------- ¿Puedo cambiar X por Y? ---------- */
  function swapAnswer() {
    var S = st.swap, pc = HW.S.myPc, mc = HW.myCpu(), mg = HW.myGpu(), out = [], verdict = 'ok', extra = [];
    var ch = pc.chip ? HW.chipset(pc.chip) : null;
    function add(lv, t) { out.push({ lv: lv, t: t }); if (lv === 'bad') verdict = 'bad'; else if (lv === 'warn' && verdict === 'ok') verdict = 'warn'; }
    if (S.what === 'cpu') {
      var c = E.byId(S.cpu);
      if (c.seg !== 'desktop') { add('bad', 'El ' + c.n + ' es de portátil: va soldado y no existe para tu placa.'); }
      else if (HW.platSocket[c.plat] !== mc.socket.replace(' (v2)', '') && HW.platSocket[c.plat] !== mc.socket) {
        add('bad', 'Zócalo distinto: tu placa es ' + mc.socket + ' y el ' + c.n + ' es ' + c.socket + '. No entra.');
        extra.push('Placa base ' + c.socket + ' nueva');
        if (c.ddr.indexOf(pc.ddr) < 0) extra.push('RAM ' + c.ddr.join('/') + ' (la tuya es ' + pc.ddr + '; con los precios de 2026 es un gasto importante)');
        extra.push('Comprobar que tu disipador trae anclaje para ' + c.socket + ' (AM4 y AM5 comparten anclaje; Intel LGA1700 y LGA1851 también)');
        extra.push('Reinstalar o al menos actualizar drivers de chipset');
      } else {
        add('ok', 'Mismo zócalo (' + c.socket + '): entra físicamente.');
        if (!ch) {
          add('warn', 'Depende del chipset de tu placa, que aún no sabemos. Míralo en Mi PC (msinfo32 o CPU-Z).');
          var lst = HW.chipsets.filter(function (x) { return x.s === c.socket; });
          add('info', 'En ' + c.socket + ': ' + lst.map(function (x) { return x.id + ' → ' + ({ ok: 'sí', bios: 'sí, con BIOS actualizada', no: 'no' }[x.sup[c.plat]] || '?'); }).join(' · ') + '.');
        } else {
          var s = ch.sup[c.plat];
          if (s === 'ok') add('ok', 'Tu chipset ' + ch.id + ' lo admite sin tocar nada.');
          else if (s === 'bios') add('warn', 'Tu chipset ' + ch.id + ' lo admite con BIOS actualizada. Actualízala ANTES de quitar tu procesador actual (o usa BIOS Flashback si tu placa lo tiene).');
          else add('bad', 'Tu chipset ' + ch.id + ' no lo admite.');
          if (ch.tier <= 1 && c.pmax > 150) add('warn', 'VRM: una ' + ch.id + ' de gama baja con un ' + c.n + ' (hasta ' + c.pmax + ' W) probablemente se calentará y bajará el rendimiento. Para un i5/i7 sin K va mejor.');
          if (/K/.test(c.n) && !ch.oc) add('info', 'Tu ' + ch.id + ' no permite overclock: un modelo sin K (o un KF) te da casi lo mismo por menos.');
        }
        if (c.degr) add('warn', 'Es Intel 13.ª/14.ª: necesitas BIOS con microcódigo 0x12B o posterior para evitar la degradación.');
        if (!c.igpu && !mg) add('bad', 'Sin gráfica integrada ni dedicada.');
        if (c.pmax > 150) extra.push('Un disipador mejor que el de serie (torre doble o AIO de 240-360 mm): puede consumir ' + c.pmax + ' W');
        if (c.ddr.indexOf(pc.ddr) < 0) add('bad', 'No admite tu ' + pc.ddr + '.');
        var fsrc = E.psuCalc(c, mg);
        if (pc.psuW && pc.psuW < fsrc.min) { add('warn', 'Tu fuente (' + pc.psuW + ' W) se queda justa: estimo ' + fsrc.total + ' W de máximo.'); extra.push('Fuente de ' + fsrc.rec + ' W'); }
        var g0 = E.gameIdx(mc).v, g1 = E.gameIdx(c).v;
        add('info', 'Rendimiento: en juegos ≈' + (g1 >= g0 ? '+' : '') + E.pct(g1, g0) + ' % y en multinúcleo ≈' + (c.m >= mc.m ? '+' : '') + E.pct(c.m, mc.m) + ' % frente a tu ' + mc.n + ' (índices aproximados). Con tu ' + mg.n + ' la mejora en juegos casi no se notará: manda la gráfica.');
      }
    }
    if (S.what === 'gpu') {
      var g = E.byId(S.gpu), calc = E.psuCalc(mc, g);
      add('ok', 'Ranura: cualquier gráfica PCIe moderna entra en tu ranura PCIe x16 (tu i5-12400F da PCIe 4.0/5.0 a la gráfica según la placa).');
      if (!pc.psuW) add('warn', 'Fuente: no sabemos la tuya. Esta gráfica pide ' + g.psu + ' W según el fabricante; yo pondría ' + calc.rec + ' W. Abre la caja y mira la pegatina.');
      else if (pc.psuW < calc.min) { add('bad', 'Fuente: tu ' + pc.psuW + ' W se queda corta (estimo ' + calc.total + ' W de máximo).'); extra.push('Fuente de ' + calc.rec + ' W de calidad'); }
      else if (pc.psuW < calc.rec) add('warn', 'Fuente: ' + pc.psuW + ' W va justa (recomendado ' + calc.rec + ' W). Depende mucho de la calidad de tu fuente.');
      else add('ok', 'Fuente: ' + pc.psuW + ' W es suficiente en vatios. Revisa que sea de calidad.');
      add(/12V-2x6|12VHPWR/.test(g.conn) ? 'warn' : 'info', 'Conector: ' + g.conn + '. ' + (/12V-2x6|12VHPWR/.test(g.conn) ? 'Si tu fuente no lo trae, usarás el adaptador de la gráfica: necesitas tantos cables de 8 pines como pida el adaptador.' : 'Comprueba que tu fuente tiene esos cables PCIe 6+2.'));
      if (pc.caseLen) { if (g.len > pc.caseLen) { add('bad', 'Longitud: una ' + g.n + ' típica mide ≈' + g.len + ' mm y tu caja admite ' + pc.caseLen + ' mm.'); extra.push('Caja más grande o modelo de gráfica más corto'); } else add('ok', 'Longitud: ≈' + g.len + ' mm de ' + pc.caseLen + ' mm.'); }
      else add('warn', 'Longitud: una ' + g.n + ' típica mide ≈' + g.len + ' mm. Mide tu caja (Mi PC).');
      if (g.lanes < 16 && ch && /^3/.test(ch.gpu)) add('warn', 'Tu placa da PCIe 3.0 y esta gráfica es x' + g.lanes + ': perderás algo.');
      var b0 = E.bottleneck(mc, mg, S.res), b1 = E.bottleneck(mc, g, S.res), gain = Math.round((Math.min(b1.cpu, b1.gpu) / Math.min(b0.cpu, b0.gpu) - 1) * 100);
      add('info', 'Rendimiento a ' + (S.res === '4k' ? '4K' : S.res + 'p') + ': ≈+' + gain + ' % frente a tu ' + mg.n + ' (estimación con los índices del catálogo y tu procesador). ' + b1.t);
      if (g.rebar) add('warn', 'Intel Arc: activa Resizable BAR en la BIOS (tu plataforma lo admite).');
      if (g.vram < 8) add('warn', 'Solo ' + g.vram + ' GB de VRAM: no la compraría en 2026.');
    }
    if (S.what === 'ram') {
      if (S.ddr !== pc.ddr) { add('bad', 'No: tu placa es ' + pc.ddr + ' y la ' + S.ddr + ' tiene la muesca en otro sitio. No entra físicamente ni funcionaría.'); extra.push('Placa base ' + S.ddr + ' (en LGA1700 existen placas DDR5)'); extra.push('Módulos ' + S.ddr); }
      else {
        add('ok', 'Sí: mismo tipo (' + pc.ddr + ').');
        add('info', 'Para doble canal: dos módulos iguales en A2 y B2. Si añades a uno que ya tienes, mejor que sea de la misma capacidad, velocidad y latencia (idealmente el mismo modelo).');
        if (ch && !ch.moc) add('warn', 'Tu ' + ch.id + ' no deja subir la RAM de su velocidad base: no pagues por RAM muy rápida.');
      }
    }
    return { out: out, verdict: verdict, extra: extra };
  }
  VIEWS.swap = function () {
    var S = st.swap, R = swapAnswer();
    var vt = { ok: ['ok', 'Sí, se puede'], warn: ['warn', 'Se puede, con condiciones'], bad: ['bad', 'No, o no sin cambiar más cosas'] }[R.verdict];
    return '<div class="card"><h2>¿Puedo cambiar X por Y?</h2><p class="small muted">Parto de tu PC (' + h(HW.S.myPc.cpu) + ', ' + h(HW.S.myPc.gpu) + ', ' + h(HW.S.myPc.ddr) + (HW.S.myPc.chip ? ', chipset ' + h(HW.S.myPc.chip) : '') + (HW.S.myPc.psuW ? ', fuente ' + HW.S.myPc.psuW + ' W' : '') + '). Cambia esos datos en "Mi PC".</p>' +
      '<div class="chips">' + [['Q1', '¿Un i7-14700K en mi placa?'], ['Q2', '¿DDR5 en mi placa DDR4?'], ['Q3', '¿Una RTX 5070 en mi PC?'], ['Q4', '¿Un Ryzen 7 9800X3D en mi placa?'], ['Q5', '¿Un i5-14400F en mi placa?']].map(function (q) { return '<button class="chip" data-act="swapQ" data-q="' + q[0] + '">' + q[1] + '</button>'; }).join('') + '</div>' +
      '<label class="field">Quiero cambiar' + sel('sWhat', [['cpu', 'El procesador'], ['gpu', 'La gráfica'], ['ram', 'La RAM']].map(function (o) { return '<option value="' + o[0] + '"' + (S.what === o[0] ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('')) + '</label>' +
      (S.what === 'cpu' ? '<label class="field">Por' + sel('sCpu', HW.cpuOptions(S.cpu)) + '</label>' : '') +
      (S.what === 'gpu' ? '<label class="field">Por' + sel('sGpu', HW.gpuOptions(S.gpu)) + '</label><label class="field">Resolución' + sel('sRes', [['1080', '1080p'], ['1440', '1440p'], ['4k', '4K']].map(function (o) { return '<option value="' + o[0] + '"' + (S.res === o[0] ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('')) + '</label>' : '') +
      (S.what === 'ram' ? '<label class="field">Por RAM' + sel('sDdr', ['DDR4', 'DDR5'].map(function (o) { return '<option' + (S.ddr === o ? ' selected' : '') + '>' + o + '</option>'; }).join('')) + '</label>' : '') + '</div>' +
      '<div class="verdict ' + (R.verdict === 'ok' ? 'a' : R.verdict === 'bad' ? '' : 'b') + '"><h2>' + vt[1] + '</h2>' + lvlBox(R.out) + (R.extra.length ? '<h4>Qué más tendrías que cambiar</h4><ul>' + R.extra.map(function (x) { return '<li>' + h(x) + '</li>'; }).join('') + '</ul>' : '') + '</div>';
  };
  HW.A.swapQ = function (el) {
    var S = st.swap, q = el.dataset.q;
    if (q === 'Q1') { S.what = 'cpu'; S.cpu = 'cpu-core-i7-14700k'; }
    if (q === 'Q2') { S.what = 'ram'; S.ddr = 'DDR5'; }
    if (q === 'Q3') { S.what = 'gpu'; S.gpu = 'gpu-rtx-5070'; }
    if (q === 'Q4') { S.what = 'cpu'; S.cpu = 'cpu-ryzen-7-9800x3d'; }
    if (q === 'Q5') { S.what = 'cpu'; S.cpu = 'cpu-core-i5-14400f'; }
    HW.rerender();
  };

  /* ---------- Montador por presupuesto ---------- */
  var BUSES = [['g1080', 'Juegos 1080p'], ['g1440', 'Juegos 1440p'], ['g4k', 'Juegos 4K'], ['edit', 'Edición / render'], ['mix', 'Mixto: juegos + trabajo']];
  function priced(list, kind) { return list.filter(function (x) { return HW.prices[kind][x.n] != null; }); }
  /* Prueba todas las parejas CPU + GPU con precio, completa el resto de piezas y se queda con la mejor que cabe en el presupuesto */
  function partsFor(cpu, gpu, budget, work) {
    var boards = HW.boards.filter(function (b) { var ch = HW.chipset(b.chip); return ch.s === HW.platSocket[cpu.plat] && ch.sup[cpu.plat] === 'ok'; });
    if (!boards.length) boards = HW.boards.filter(function (b) { var ch = HW.chipset(b.chip); return ch.s === HW.platSocket[cpu.plat] && ch.sup[cpu.plat] !== 'no'; });
    var minTier = budget >= 1300 ? 2 : 1;
    var cand = boards.filter(function (b) { return b.ff !== 'Mini-ITX' && b.vrm >= (cpu.pmax > 180 ? 2 : 1) && HW.chipset(b.chip).tier >= minTier && (b.ddr === 'DDR5' || cpu.ddr.indexOf('DDR5') < 0 || budget < 1100); });
    var board = (cand.length ? cand : boards).slice().sort(function (a, b) { return a.price - b.price; })[0];
    var gb = budget >= 1400 || work ? 32 : 16;
    var ram = HW.rams.filter(function (r) { return r.ddr === board.ddr && r.gb >= gb && r.mods === 2; }).sort(function (a, b) { return a.price - b.price; })[0] || HW.rams.find(function (r) { return r.ddr === board.ddr; });
    var stor = HW.storages.find(function (s) { return s.id === (budget >= 1600 ? 's-g4-2' : 's-g4'); });
    var calc = E.psuCalc(cpu, gpu), psu = HW.psus.filter(function (p) { return p.tier !== 'F' && p.real >= calc.rec; }).sort(function (a, b) { return a.price - b.price; })[0] || HW.psus[HW.psus.length - 1];
    var cooler = HW.coolers.find(function (k) { return k.id === (cpu.pmax > 200 ? 'k-aio360' : cpu.pmax > 150 ? 'k-dual' : 'k-tower'); });
    var cs = HW.cases.filter(function (c) { return c.ff.indexOf(board.ff) >= 0 && c.gpuMax >= gpu.len + 15 && c.air >= 3 && (!cooler.rad || c.rad >= cooler.rad); }).sort(function (a, b) { return a.price - b.price; })[0] || HW.cases[3];
    var total = HW.prices.cpu[cpu.n] + HW.prices.gpu[gpu.n] + board.price + ram.price + stor.price + psu.price + cooler.price + cs.price;
    return { p: { cpu: cpu.id, gpu: gpu.id, board: board.id, ram: ram.id, st: [stor.id], psu: psu.id, cooler: cooler.id, cas: cs.id }, total: total };
  }
  function autoBuild(budget, use) {
    var res = use === 'g4k' ? '4k' : use === 'g1080' ? '1080' : '1440', work = use === 'edit' || use === 'mix';
    var gpus = priced(HW.gpus, 'gpu'), cpus = priced(HW.cpus, 'cpu');
    var minV = res === '4k' ? 16 : res === '1440' ? 12 : 8;
    var best = null, cheapest = null;
    cpus.forEach(function (c) {
      gpus.forEach(function (g) {
        var r = partsFor(c, g, budget, work), bt = E.bottleneck(c, g, res), fps = Math.min(bt.cpu, bt.gpu) + .05 * (bt.cpu + bt.gpu);
        if (g.vram < minV) fps *= .85;
        var obj = use === 'edit' ? c.m + E.gpuPerf(g, '1440') * .4 + g.vram * .5 : use === 'mix' ? fps * .7 + c.m * .5 : fps;
        obj -= r.total / 1e4; // a igualdad, el más barato
        if (!cheapest || r.total < cheapest.total) cheapest = r;
        if (r.total <= budget * 1.02 && (!best || obj > best.obj)) best = { obj: obj, p: r.p, total: r.total };
      });
    });
    return (best || cheapest).p;
  }
  VIEWS.build = function () {
    var S = st.build, key = S.budget + S.use;
    if (!S.parts || S.key !== key) { S.parts = autoBuild(S.budget, S.use); S.key = key; }
    var P = S.parts, cpu = E.byId(P.cpu), gpu = E.byId(P.gpu), b = HW.boards.find(function (x) { return x.id === P.board; }), ram = HW.rams.find(function (x) { return x.id === P.ram; }),
      psu = HW.psus.find(function (x) { return x.id === P.psu; }), k = HW.coolers.find(function (x) { return x.id === P.cooler; }), cs = HW.cases.find(function (x) { return x.id === P.cas; }), stor = P.st.map(function (id) { return HW.storages.find(function (s) { return s.id === id; }); });
    var price = (HW.prices.cpu[cpu.n] || cpu.msrp || 0) + (HW.prices.gpu[gpu.n] || gpu.msrp || 0) + b.price + ram.price + psu.price + k.price + cs.price + stor.reduce(function (a, s) { return a + s.price; }, 0);
    var res = S.use === 'g4k' ? '4k' : S.use === 'g1080' ? '1080' : '1440', bt = E.bottleneck(cpu, gpu, res), chk = E.check({ cpu: cpu, board: b, ram: ram, gpu: gpu, psu: psu, case: cs, cooler: k, storage: stor }).filter(function (x) { return x.lv !== 'ok'; });
    var cpuP = HW.cpus.filter(function (c) { return HW.prices.cpu[c.n] != null; }), gpuP = HW.gpus.filter(function (g) { return HW.prices.gpu[g.n] != null; });
    function o(list, cur, pf) { return list.map(function (x) { return '<option value="' + x.id + '"' + (x.id === cur ? ' selected' : '') + '>' + h(x.n) + ' · ' + pf(x) + ' €</option>'; }).join(''); }
    var why = [
      ['Procesador', 'bCpuS', o(cpuP, cpu.id, function (x) { return HW.prices.cpu[x.n]; }), (S.use === 'edit' ? 'Para editar y renderizar priorizo el multinúcleo (' + cpu.m + ').' : 'Para jugar priorizo el índice de juegos (' + E.gameIdx(cpu).v + ') dentro de ≈' + (S.use === 'mix' ? 24 : 17) + ' % del presupuesto.') + ' ' + E.alive(cpu).t],
      ['Gráfica', 'bGpuS', o(gpuP, gpu.id, function (x) { return HW.prices.gpu[x.n]; }), 'La pieza que más FPS da: ≈' + Math.round((HW.prices.gpu[gpu.n] / price) * 100) + ' % del total. ' + gpu.vram + ' GB de VRAM para ' + (res === '4k' ? '4K' : res + 'p') + '.'],
      ['Placa base', 'bBoardS', o(HW.boards.filter(function (x) { return HW.chipset(x.chip).s === HW.platSocket[cpu.plat]; }), b.id, function (x) { return x.price; }), 'Chipset ' + b.chip + ': lo justo para este procesador sin pagar extras que no usas.'],
      ['RAM', 'bRamS', o(HW.rams.filter(function (x) { return x.ddr === b.ddr; }), ram.id, function (x) { return x.price; }), ram.gb + ' GB en doble canal. La RAM está muy cara en 2026: no pongo más de la necesaria.'],
      ['Almacenamiento', 'bStS', o(HW.storages, stor[0].id, function (x) { return x.price; }), 'NVMe PCIe 4.0: el punto dulce. El 5.0 no da FPS.'],
      ['Fuente', 'bPsuS', o(HW.psus, psu.id, function (x) { return x.price; }), 'Estimo ' + E.psuCalc(cpu, gpu).total + ' W de máximo; recomendada ' + E.psuCalc(cpu, gpu).rec + ' W. Nunca genérica.'],
      ['Refrigeración', 'bCoolS', o(HW.coolers, k.id, function (x) { return x.price; }), 'Disipa ≈' + k.w + ' W para un procesador de hasta ' + cpu.pmax + ' W.'],
      ['Caja', 'bCaseS', o(HW.cases, cs.id, function (x) { return x.price; }), 'Frontal de malla y espacio para una gráfica de ≈' + gpu.len + ' mm.']
    ];
    return '<div class="card"><h2>Montador por presupuesto</h2><label class="field">Presupuesto: <span class="num" id="bBudOut">' + S.budget + ' €</span><input type="range" id="bBud" min="700" max="5000" step="50" value="' + S.budget + '" data-inp="budOut" data-chg="budChg" style="width:100%"></label>' +
      '<div class="chips">' + BUSES.map(function (u) { return '<button class="chip" data-act="bUse" data-u="' + u[0] + '" aria-pressed="' + (S.use === u[0]) + '">' + u[1] + '</button>'; }).join('') + '</div>' +
      '<p class="small muted">' + h(HW.PRICE_NOTE) + '</p></div>' +
      '<div class="card"><div class="section-title"><h3>Total: <span class="num">' + price + ' €</span></h3><span class="pill ' + (price > S.budget * 1.05 ? 'bad' : 'ok') + '">' + (price > S.budget * 1.05 ? 'Te pasas ' + (price - S.budget) + ' €' : 'Dentro del presupuesto') + '</span></div>' +
      '<p class="small">' + h(bt.t) + '</p>' + why.map(function (w) { return '<label class="field">' + w[0] + '<select id="' + w[1] + '" data-chg="bPart">' + w[2] + '</select><span class="small" style="font-weight:400;color:var(--fg)">' + h(w[3]) + '</span></label>'; }).join('') +
      '<button class="btn" data-act="bReset">Volver a la propuesta automática</button></div>' +
      (chk.length ? '<div class="card"><h3>Avisos del comprobador</h3>' + lvlBox(chk) + '</div>' : '<div class="box ok"><p>El comprobador no encuentra conflictos.</p></div>');
  };
  HW.A.budOut = function (el) { document.getElementById('bBudOut').textContent = el.value + ' €'; };
  HW.A.budChg = function (el) { st.build.budget = +el.value; HW.rerender(); };
  HW.A.bUse = function (el) { st.build.use = el.dataset.u; HW.rerender(); };
  HW.A.bReset = function () { st.build.parts = null; HW.rerender(); };
  HW.A.bPart = function () {
    var P = st.build.parts, nc = v('bCpuS');
    P.cpu = nc; P.gpu = v('bGpuS'); P.board = v('bBoardS'); P.ram = v('bRamS'); P.st = [v('bStS')]; P.psu = v('bPsuS'); P.cooler = v('bCoolS'); P.cas = v('bCaseS');
    var cpu = E.byId(P.cpu), b = HW.boards.find(function (x) { return x.id === P.board; });
    if (HW.chipset(b.chip).s !== HW.platSocket[cpu.plat]) { var nb = HW.boards.filter(function (x) { return HW.chipset(x.chip).s === HW.platSocket[cpu.plat]; }).sort(function (a, c) { return a.price - c.price; })[0]; if (nb) { P.board = nb.id; b = nb; HW.toast('He cambiado la placa a ' + nb.chip + ' para este zócalo'); } }
    var r = HW.rams.find(function (x) { return x.id === P.ram; }); if (r.ddr !== b.ddr) { var nr = HW.rams.find(function (x) { return x.ddr === b.ddr && x.gb >= r.gb && x.mods === 2; }) || HW.rams.find(function (x) { return x.ddr === b.ddr; }); P.ram = nr.id; }
    HW.rerender();
  };

  /* ---------- Cuello de botella ---------- */
  VIEWS.bott = function () {
    var S = st.bott, cpu = E.byId(S.cpu) || HW.myCpu(), gpu = E.byId(S.gpu) || HW.myGpu(), r = E.bottleneck(cpu, gpu, S.res), max = Math.max(r.cpu, r.gpu) * 1.05;
    var all = ['1080', '1440', '4k'].map(function (x) { var b = E.bottleneck(cpu, gpu, x); return '<tr><td>' + (x === '4k' ? '4K' : x + 'p') + '</td><td>' + ({ gpu: 'Gráfica', cpu: 'Procesador', eq: 'Equilibrado' }[b.who]) + '</td><td class="num">' + E.fmt(b.ratio, 2) + '</td></tr>'; }).join('');
    return '<div class="card"><h2>Detector de cuello de botella</h2><label class="field">Procesador' + sel('bCpu', HW.cpuOptions(cpu.id, { desktop: true })) + '</label><label class="field">Gráfica' + sel('bGpu', HW.gpuOptions(gpu.id)) + '</label>' +
      '<label class="field">Resolución' + sel('bRes', [['1080', '1080p'], ['1440', '1440p'], ['4k', '4K']].map(function (o) { return '<option value="' + o[0] + '"' + (S.res === o[0] ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('')) + '</label></div>' +
      '<div class="card"><h3>' + ({ gpu: 'Manda la gráfica', cpu: 'Manda el procesador', eq: 'Equilibrado' }[r.who]) + '</h3>' + HW.bar('Jefe (CPU)', r.cpu, max) + HW.bar('Pinches (GPU)', r.gpu, max, true) + '<p>' + h(r.t) + '</p>' +
      '<div class="table-wrap"><table><thead><tr><th>Resolución</th><th>Manda</th><th class="num">CPU ÷ GPU</th></tr></thead><tbody>' + all + '</tbody></table></div>' +
      '<p class="small muted">Orientativo: compara el índice de juegos del procesador con el índice de la gráfica a esa resolución, calibrado para que un Ryzen 7 9800X3D con una RTX 5090 quede casi equilibrado a 1080p. Cada juego es distinto (los de estrategia y simulación cargan mucho más la CPU).</p></div>';
  };

  /* ---------- Mi PC y progreso ---------- */
  VIEWS.mipc = function () {
    var p = HW.S.myPc, chips = HW.chipsets.filter(function (c) { return c.s === HW.myCpu().socket; });
    return '<div class="card"><h2>Mi PC</h2><p class="small">' + h(p.cpu) + ' · ' + h(p.gpu) + ' · 16 GB DDR4 · ' + h(p.storage) + ' · ' + h(p.os) + '</p>' +
      '<label class="field">Chipset de la placa (msinfo32 o CPU-Z → Mainboard)<select id="mChip" data-chg="toolChg"><option value="">No lo sé todavía</option>' + chips.map(function (c) { return '<option' + (p.chip === c.id ? ' selected' : '') + '>' + c.id + '</option>'; }).join('') + '</select></label>' +
      '<label class="field">Módulos de RAM (Administrador de tareas → Memoria → Ranuras usadas)<select id="mMods" data-chg="toolChg">' + [[0, 'No lo sé'], [1, '1 módulo (1 × 16 GB)'], [2, '2 módulos (2 × 8 GB)']].map(function (o) { return '<option value="' + o[0] + '"' + (p.ramMods === o[0] ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('') + '</select></label>' +
      '<label class="field">Fuente: vatios de la pegatina (0 = no lo sé)<input type="number" id="mPsu" inputmode="numeric" value="' + (p.psuW || 0) + '" data-chg="toolChg"></label>' +
      '<label class="field">Caja: longitud máxima de gráfica en mm (0 = no lo sé)<input type="number" id="mLen" inputmode="numeric" value="' + (p.caseLen || 0) + '" data-chg="toolChg"></label>' +
      (p.ramMods === 1 ? '<div class="box tip"><p>Tienes un solo módulo: añadir otro igual te da doble canal (encimera completa) y 32 GB.</p></div>' : '') +
      (p.chip === 'H610' ? '<div class="box warn"><p>H610: sin overclock de memoria y con VRM básico. Para cambiar de procesador, un i5-13400F/14400F encaja bien; un i7 K no.</p></div>' : '') + '</div>' +
      '<div class="card"><h2>Copia de seguridad del progreso</h2><p class="small">' + (HW.storageOk ? 'El progreso se guarda en este navegador. Para pasarlo a otro dispositivo, copia este código y pégalo allí.' : 'Este navegador no deja guardar datos: copia el código para no perder el progreso.') + '</p>' +
      '<textarea id="expCode" readonly>' + h(HW.exportCode()) + '</textarea><button class="btn" data-act="copyCode">Copiar código</button>' +
      '<label class="field">Pegar un código para importar<textarea id="impCode" placeholder="CPC1.…"></textarea></label><button class="btn primary" data-act="importCode">Importar progreso</button>' +
      '<hr class="sep"><div class="row"><button class="btn ghost" data-act="askReset">Borrar todo el progreso</button><span id="resetConfirm"></span></div></div>';
  };
  HW.A.copyCode = function () { var t = document.getElementById('expCode'); HW.copy(t.value, t); };
  HW.A.importCode = function () { try { HW.importCode(document.getElementById('impCode').value); HW.applyTheme(); HW.toast('Progreso importado'); HW.rerender(); } catch (e) { HW.toast('Ese código no es válido. Cópialo entero, empieza por CPC1.'); } };
  HW.A.askReset = function () { document.getElementById('resetConfirm').innerHTML = '<button class="btn sm" data-act="doReset" style="border-color:var(--bad);color:var(--bad)">Sí, borrar</button>'; };
  HW.A.doReset = function () { HW.resetAll(); HW.toast('Progreso borrado'); HW.rerender(); };
})();
