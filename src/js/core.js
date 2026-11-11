/* =========================================================================
   NÚCLEO DE LA INTERFAZ: estado guardado, utilidades, navegación y acciones
   ========================================================================= */
window.HW = window.HW || {};
(function () {
  var KEY = 'cocina-del-pc-v1';
  var DEF = { theme: null, done: {}, quiz: {}, stats: {}, duel: { ok: 0, ko: 0 }, cards: {}, myPc: null, exam: [] };
  HW.S = JSON.parse(JSON.stringify(DEF));
  HW.storageOk = false;
  try {
    var raw = localStorage.getItem(KEY);
    if (raw) Object.assign(HW.S, JSON.parse(raw));
    localStorage.setItem(KEY + '-test', '1'); localStorage.removeItem(KEY + '-test');
    HW.storageOk = true;
  } catch (e) { HW.storageOk = false; }
  if (!HW.S.myPc) HW.S.myPc = Object.assign({}, HW.myPcDefault);
  HW.save = function () { try { localStorage.setItem(KEY, JSON.stringify(HW.S)); } catch (e) {} };
  HW.exportCode = function () { return 'CPC1.' + btoa(unescape(encodeURIComponent(JSON.stringify(HW.S)))); };
  HW.importCode = function (code) {
    var c = String(code || '').trim().replace(/^CPC1\./, '');
    var obj = JSON.parse(decodeURIComponent(escape(atob(c))));
    if (typeof obj !== 'object' || !obj) throw new Error('Código no válido');
    HW.S = Object.assign(JSON.parse(JSON.stringify(DEF)), obj); HW.save();
  };
  HW.resetAll = function () { HW.S = JSON.parse(JSON.stringify(DEF)); HW.S.myPc = Object.assign({}, HW.myPcDefault); HW.save(); };

  /* Estadísticas por tema */
  HW.stat = function (topic, ok) { var s = HW.S.stats[topic] || (HW.S.stats[topic] = { ok: 0, ko: 0 }); if (ok) s.ok++; else s.ko++; HW.save(); };

  /* Repetición espaciada (sistema Leitner de 5 cajas). Lo que fallas vuelve a la caja 1 y sale antes. */
  var DAY = 86400000, GAP = [0, 0, 1, 3, 7, 16];
  HW.card = function (id) { return HW.S.cards[id] || (HW.S.cards[id] = { box: 0, due: 0 }); };
  HW.cardAnswer = function (id, ok) { var c = HW.card(id); c.box = ok ? Math.min(5, Math.max(1, c.box) + 1) : 1; c.due = Date.now() + GAP[c.box] * DAY; HW.save(); };
  HW.cardFail = function (id) { var c = HW.card(id); c.box = 1; c.due = Date.now(); HW.save(); };

  /* Utilidades */
  HW.h = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  HW.shuffle = function (a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
  HW.pick = function (a) { return a[Math.floor(Math.random() * a.length)]; };
  HW.toast = function (t) { var d = document.createElement('div'); d.className = 'toast'; d.setAttribute('role', 'status'); d.textContent = t; document.body.appendChild(d); setTimeout(function () { d.remove(); }, 2200); };
  HW.copy = function (text, el) {
    function fallback() { if (el) { el.focus(); el.select(); } HW.toast('Selecciona el texto y cópialo'); }
    try { navigator.clipboard.writeText(text).then(function () { HW.toast('Copiado'); }, fallback); } catch (e) { fallback(); }
  };

  /* Tema claro / oscuro */
  HW.applyTheme = function () { var t = HW.S.theme; if (t) document.documentElement.setAttribute('data-theme', t); else document.documentElement.removeAttribute('data-theme'); };
  HW.toggleTheme = function () {
    var dark = HW.S.theme ? HW.S.theme === 'dark' : window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    HW.S.theme = dark ? 'light' : 'dark'; HW.save(); HW.applyTheme();
  };

  /* Navegación por pestañas (#vista) */
  HW.V = {}; HW.A = {}; HW.ui = {};
  HW.TABS = [['aprender', 'Aprender'], ['catalogo', 'Catálogo'], ['comparar', 'Comparar'], ['nombres', 'Nombres'], ['herramientas', 'Herram.'], ['practicar', 'Practicar'], ['glosario', 'Glosario']];
  HW.route = function () {
    var hsh = (location.hash || '').replace('#', '') || 'aprender', view = hsh, arg = null;
    var m = hsh.match(/^leccion-([a-r])$/); if (m) { view = 'leccion'; arg = m[1]; }
    if (!HW.V[view]) view = 'aprender';
    var tab = view === 'leccion' ? 'aprender' : view;
    document.querySelectorAll('nav.tabs button').forEach(function (b) { if (b.dataset.tab === tab) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); });
    var main = document.getElementById('view');
    main.innerHTML = HW.V[view](arg);
    if (HW.V[view].after) HW.V[view].after(main, arg);
    if (!HW._keepScroll) window.scrollTo(0, 0);
    HW._keepScroll = false;
  };
  HW.go = function (v) { if (location.hash === '#' + v) HW.route(); else location.hash = v; };
  HW.rerender = function () { HW._keepScroll = true; HW.route(); };

  /* Delegación de eventos: data-act="nombre" */
  document.addEventListener('click', function (ev) {
    var el = ev.target.closest('[data-act]');
    if (el && HW.A[el.dataset.act]) { ev.preventDefault(); HW.A[el.dataset.act](el, ev); }
  });
  document.addEventListener('change', function (ev) {
    var el = ev.target.closest('[data-chg]');
    if (el && HW.A[el.dataset.chg]) HW.A[el.dataset.chg](el, ev);
  });
  document.addEventListener('input', function (ev) {
    var el = ev.target.closest('[data-inp]');
    if (el && HW.A[el.dataset.inp]) HW.A[el.dataset.inp](el, ev);
  });
  document.addEventListener('keydown', function (ev) {
    if ((ev.key === 'Enter' || ev.key === ' ') && ev.target.matches('[data-act]:not(button):not(a)')) { ev.preventDefault(); ev.target.click(); }
  });

  /* Selectores de piezas con grupos */
  HW.cpuOptions = function (sel, opt) {
    opt = opt || {};
    var groups = {};
    HW.cpus.forEach(function (c) {
      if (opt.desktop && c.seg !== 'desktop') return;
      if (opt.socket && c.socket !== opt.socket) return;
      var g = c.brand + ' · ' + (c.seg === 'laptop' ? 'Portátil' : c.socket);
      (groups[g] = groups[g] || []).push(c);
    });
    return (opt.empty ? '<option value="">' + opt.empty + '</option>' : '') + Object.keys(groups).map(function (g) {
      return '<optgroup label="' + HW.h(g) + '">' + groups[g].map(function (c) { return '<option value="' + c.id + '"' + (c.id === sel ? ' selected' : '') + '>' + HW.h(c.n) + (c.mine ? ' (mi PC)' : '') + '</option>'; }).join('') + '</optgroup>';
    }).join('');
  };
  HW.gpuOptions = function (sel, opt) {
    opt = opt || {};
    var groups = {};
    HW.gpus.forEach(function (g) { var k = g.brand + ' · ' + g.arch; (groups[k] = groups[k] || []).push(g); });
    return (opt.empty ? '<option value="">' + opt.empty + '</option>' : '') + Object.keys(groups).map(function (k) {
      return '<optgroup label="' + HW.h(k) + '">' + groups[k].map(function (g) { return '<option value="' + g.id + '"' + (g.id === sel ? ' selected' : '') + '>' + HW.h(g.n) + (g.mine ? ' (mi PC)' : '') + '</option>'; }).join('') + '</optgroup>';
    }).join('');
  };
  HW.listOptions = function (list, sel, empty) { return (empty ? '<option value="">' + empty + '</option>' : '') + list.map(function (x) { return '<option value="' + x.id + '"' + (x.id === sel ? ' selected' : '') + '>' + HW.h(x.n) + (x.price != null ? ' · ' + x.price + ' €' : '') + '</option>'; }).join(''); };
  HW.myCpu = function () { return HW.E.findCpu(HW.S.myPc.cpu); };
  HW.myGpu = function () { return HW.E.findGpu(HW.S.myPc.gpu); };

  /* Pastillas y barras */
  HW.bar = function (label, v, max, alt) { var w = Math.max(2, Math.min(100, v / max * 100)); return '<div class="bar' + (alt ? ' alt' : '') + '"><span>' + label + '</span><span class="track"><i style="width:' + w + '%"></i></span><span class="num">' + HW.E.fmt(v, 0) + '</span></div>'; };
  HW.confPill = function (c) { return c === 'rev' ? '<span class="pill ok">De reseñas</span>' : c === 'pv' ? '<span class="pill warn">Por verificar</span>' : '<span class="pill">Estimado</span>'; };
})();
