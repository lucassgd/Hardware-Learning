/* =========================================================================
   PRACTICAR: tests, duelos, ordenar, reconocer conectores, tarjetas, examen y estadísticas
   ========================================================================= */
(function () {
  var h = HW.h, E = HW.E;
  HW.ui.pr = { mode: 'menu' };
  var MODES = [['test', 'Test por temas', 'Elige tema y nivel. Explicación tras cada respuesta.'], ['duel', 'Duelos rápidos', '¿Cuál es mejor para X? Con el razonamiento después.'], ['order', 'Ordenar por generación', 'Arrastra los modelos en orden cronológico.'], ['spot', 'Reconocer conectores', 'Toca en la placa el conector que te pido.'], ['cards', 'Tarjetas de repaso', 'Repetición espaciada: lo que fallas vuelve antes.'], ['exam', 'Examen final: nivel experto', 'Mezcla de todo: 25 preguntas.'], ['stats', 'Estadísticas', 'Lo que dominas y lo que no.']];
  HW.V.practicar = function () {
    var P = HW.ui.pr;
    if (P.mode === 'menu') {
      var due = dueCards().length;
      return '<section class="stack"><h1>Practicar</h1><div class="lesson-list">' + MODES.map(function (m, i) { return '<button class="lesson-item" data-act="prMode" data-m="' + m[0] + '"><span class="letter">' + (i + 1) + '</span><span class="meta"><b>' + m[1] + (m[0] === 'cards' && due ? ' · ' + due + ' pendientes' : '') + '</b><span class="small muted">' + m[2] + '</span></span></button>'; }).join('') + '</div></section>';
    }
    return '<section class="stack"><div class="row"><button class="btn sm ghost" data-act="prMode" data-m="menu">← Practicar</button></div>' + (R[P.mode] || R.test)() + '</section>';
  };
  HW.A.prMode = function (el) { HW.ui.pr = { mode: el.dataset.m }; HW.rerender(); };
  var R = {};

  /* ---------- Test por temas ---------- */
  R.test = function () {
    var P = HW.ui.pr;
    if (!P.qs) {
      return '<h2>Test por temas</h2><div class="card"><label class="field">Tema<select id="tTopic"><option value="">Todos los temas</option>' + HW.lessons.map(function (l) { return '<option value="' + l.id + '">' + l.id + ') ' + h(l.t) + '</option>'; }).join('') + '</select></label>' +
        '<label class="field">Nivel<select id="tLvl"><option value="">Todos</option><option>Básico</option><option>Intermedio</option><option>Avanzado</option><option>Experto</option></select></label><button class="btn primary full" data-act="tStart">Empezar (hasta 10 preguntas)</button></div>';
    }
    return '<h2>Test' + (P.topic ? ': ' + h(HW.lesson(P.topic).t) : '') + '</h2>' + HW.quizHtml('test', P.qs) + '<button class="btn full" data-act="tNew">Otro test</button>';
  };
  HW.A.tStart = function () {
    var t = document.getElementById('tTopic').value, l = document.getElementById('tLvl').value;
    var pool = HW.allQuestions().filter(function (q) { return (!t || q.l === t) && (!l || q.lvl === l); });
    if (!pool.length) { HW.toast('No hay preguntas con ese filtro; prueba otro nivel'); return; }
    HW.ui.pr = { mode: 'test', topic: t, qs: HW.shuffle(pool).slice(0, 10) }; HW.rerender();
  };
  HW.A.tNew = function () { HW.ui.pr = { mode: 'test' }; HW.rerender(); };

  /* ---------- Duelos ---------- */
  var DUSES = [['g1080', 'juegos a 1080p'], ['g1440', 'juegos a 1440p'], ['g4k', 'juegos a 4K'], ['edit', 'edición y render'], ['eff', 'eficiencia'], ['value', 'calidad-precio'], ['ai', 'IA local'], ['stream', 'streaming']];
  function newDuel() {
    var kind = Math.random() < .5 ? 'cpu' : 'gpu', p = HW.randomPair(kind), use = HW.pick(kind === 'cpu' ? DUSES.filter(function (u) { return u[0] !== 'ai'; }) : DUSES);
    var res = kind === 'cpu' ? E.compareCpu(p[0], p[1], use[0]) : E.compareGpu(p[0], p[1], use[0]);
    return { kind: kind, a: p[0], b: p[1], use: use, res: res, ans: null };
  }
  R.duel = function () {
    var P = HW.ui.pr; if (!P.d) P.d = newDuel();
    var D = P.d, r = D.res;
    var s = '<h2>Duelo rápido</h2><div class="card"><div class="eyebrow">¿Cuál es mejor para ' + h(D.use[1]) + '?</div>' +
      '<div class="grid2"><button class="btn" data-act="dAns" data-p="a">' + h(D.a.brand + ' ' + D.a.n) + '</button><button class="btn" data-act="dAns" data-p="b">' + h(D.b.brand + ' ' + D.b.n) + '</button></div><button class="btn" data-act="dAns" data-p="tie">Empate práctico</button>' +
      '<p class="small muted">Aciertos acumulados: ' + HW.S.duel.ok + ' · fallos: ' + HW.S.duel.ko + '</p></div>';
    if (D.ans) {
      var win = r.win || 'tie', ok = D.ans === win;
      s += '<div class="verdict ' + (r.win === 'a' ? 'a' : r.win === 'b' ? 'b' : '') + '"><h3>' + (ok ? 'Correcto. ' : 'No. ') + h(r.verdict) + '</h3><p class="say">«' + h(r.say) + '»</p><ol class="reasons small">' + r.reasons.map(function (x) { return '<li class="' + (x.s === 'a' ? 'ra' : x.s === 'b' ? 'rb' : '') + '">' + h(x.t) + '</li>'; }).join('') + '</ol>' +
        (r.traps.length ? '<div class="box bad"><ul class="small">' + r.traps.map(function (t) { return '<li>' + h(t) + '</li>'; }).join('') + '</ul></div>' : '') + '<div class="row"><button class="btn primary" data-act="dNext">Siguiente duelo</button><button class="btn" data-act="dOpen">Abrir en el comparador</button></div></div>';
    }
    return s;
  };
  HW.A.dAns = function (el) {
    var D = HW.ui.pr.d; if (D.ans) return; D.ans = el.dataset.p;
    var ok = D.ans === (D.res.win || 'tie'); if (ok) HW.S.duel.ok++; else HW.S.duel.ko++; HW.stat('duelos', ok); HW.rerender();
  };
  HW.A.dNext = function () { HW.ui.pr.d = newDuel(); HW.rerender(); };
  HW.A.dOpen = function () { var D = HW.ui.pr.d, C = HW.ui.cmp; C.kind = D.kind; C.a = D.a.id; C.b = D.b.id; C.use = D.use[0]; C.prac = null; HW.go('comparar'); };

  /* ---------- Ordenar por generación (arrastrar o con flechas) ---------- */
  R.order = function () {
    var P = HW.ui.pr;
    if (P.set == null) P.set = 0;
    var set = HW.orderSets[P.set];
    if (!P.items || P.items.setIdx !== P.set) { P.items = HW.shuffle(set.items); P.items.setIdx = P.set; P.checked = false; }
    return '<h2>Ordenar por generación</h2><div class="chips">' + HW.orderSets.map(function (s, i) { return '<button class="chip" data-act="oSet" data-i="' + i + '" aria-pressed="' + (i === P.set) + '">' + h(s.t) + '</button>'; }).join('') + '</div>' +
      '<p class="small muted">Del más antiguo (arriba) al más nuevo (abajo). Arrastra con el asa o usa las flechas.</p><div class="sortable" id="sortList">' + P.items.map(function (it, i) {
        var cls = P.checked ? (correctOrder(P.items)[i] ? ' right' : ' wrong') : '';
        return '<div class="sort-item' + cls + '" data-i="' + i + '"><span class="grip" aria-hidden="true">⠿</span><span class="lbl">' + h(it[0]) + (P.checked ? ' <span class="tiny muted mono">' + Math.floor(it[1]) + '</span>' : '') + '</span><button class="btn sm" data-act="oMove" data-i="' + i + '" data-d="-1" aria-label="Subir">↑</button><button class="btn sm" data-act="oMove" data-i="' + i + '" data-d="1" aria-label="Bajar">↓</button></div>';
      }).join('') + '</div><div class="row"><button class="btn primary" data-act="oCheck">Comprobar</button><button class="btn" data-act="oShuffle">Barajar otra vez</button></div>' +
      (P.checked ? '<div class="box ' + (correctOrder(P.items).every(Boolean) ? 'ok' : 'warn') + '"><p>' + (correctOrder(P.items).every(Boolean) ? '¡Perfecto!' : 'Los marcados en rojo no están en su sitio. Orden correcto: ' + set.items.slice().sort(function (a, b) { return a[1] - b[1]; }).map(function (x) { return x[0]; }).join(' → ')) + '</p></div>' : '');
  };
  function correctOrder(items) { var s = items.slice().sort(function (a, b) { return a[1] - b[1]; }); return items.map(function (it, i) { return it[1] === s[i][1]; }); }
  HW.A.oSet = function (el) { HW.ui.pr.set = +el.dataset.i; HW.ui.pr.items = null; HW.rerender(); };
  HW.A.oShuffle = function () { HW.ui.pr.items = null; HW.rerender(); };
  HW.A.oMove = function (el) { var P = HW.ui.pr, i = +el.dataset.i, j = i + +el.dataset.d; if (j < 0 || j >= P.items.length) return; var t = P.items[i]; P.items[i] = P.items[j]; P.items[j] = t; P.checked = false; HW.rerender(); };
  HW.A.oCheck = function () { var P = HW.ui.pr; P.checked = true; var ok = correctOrder(P.items).every(Boolean); HW.stat('orden', ok); HW.rerender(); };
  function bindSort(root) {
    var list = root.querySelector('#sortList'); if (!list) return;
    var drag = null;
    list.querySelectorAll('.grip').forEach(function (g) {
      g.addEventListener('pointerdown', function (e) { drag = g.closest('.sort-item'); drag.classList.add('dragging'); g.setPointerCapture(e.pointerId); e.preventDefault(); });
      g.addEventListener('pointermove', function (e) {
        if (!drag) return;
        var over = document.elementFromPoint(e.clientX, e.clientY); over = over && over.closest('.sort-item');
        if (over && over !== drag && over.parentNode === list) { var r = over.getBoundingClientRect(); list.insertBefore(drag, e.clientY > r.top + r.height / 2 ? over.nextSibling : over); }
      });
      g.addEventListener('pointerup', function () {
        if (!drag) return; drag.classList.remove('dragging');
        var P = HW.ui.pr, idx = Array.prototype.map.call(list.children, function (c) { return +c.dataset.i; }), setIdx = P.items.setIdx;
        P.items = idx.map(function (i) { return P.items[i]; }); P.items.setIdx = setIdx; P.checked = false; drag = null; HW.rerender();
      });
    });
  }

  /* ---------- Reconocer conectores ---------- */
  R.spot = function () {
    var P = HW.ui.pr; if (!P.target) { P.target = HW.pick(HW.boardSpots); P.ok = P.ok || 0; P.n = P.n || 0; P.msg = ''; }
    return '<h2>Reconocer conectores</h2><div class="card"><div class="eyebrow">Toca en la placa:</div><h3>' + h(P.target.k) + '</h3><p class="small muted">Aciertos: ' + P.ok + ' de ' + P.n + '</p>' + (P.msg ? '<div class="box ' + (P.last ? 'ok' : 'bad') + '"><p>' + P.msg + '</p></div>' : '') + '</div><figure class="figure" id="spotFig">' + HW.svg.board() + '</figure>';
  };
  function bindSpots(root) {
    root.querySelectorAll('#spotFig .hot').forEach(function (g) {
      g.addEventListener('click', function () {
        var P = HW.ui.pr, n = +g.dataset.spot, ok = n === P.target.n, s = HW.boardSpots[n - 1];
        P.n++; if (ok) P.ok++; P.last = ok; HW.stat('conectores', ok);
        P.msg = ok ? 'Correcto: ' + h(P.target.k) + '. ' + h(P.target.d) : 'Has tocado el ' + n + ' (' + h(s.k) + '). El que buscabas es el ' + P.target.n + '. ' + h(P.target.d);
        if (!ok) HW.cardFail('spot:' + P.target.n);
        P.target = HW.pick(HW.boardSpots.filter(function (x) { return x !== P.target; })); HW.rerender();
      });
    });
  }

  /* ---------- Tarjetas de repaso (repetición espaciada) ---------- */
  function allCards() {
    var c = HW.glossary.map(function (g) { return { id: 'g:' + g[0], front: g[0], back: g[1], ana: g[2], l: g[3] }; });
    HW.allQuestions().forEach(function (q) { if (HW.S.cards['q:' + q.id]) c.push({ id: 'q:' + q.id, front: q.q, back: q.o[q.a], ana: q.x, l: q.l }); });
    HW.boardSpots.forEach(function (s) { if (HW.S.cards['spot:' + s.n]) c.push({ id: 'spot:' + s.n, front: 'Conector n.º ' + s.n + ' del dibujo de la placa', back: s.k, ana: s.d, l: 'l' }); });
    return c;
  }
  function dueCards() { var now = Date.now(); return allCards().filter(function (c) { var s = HW.S.cards[c.id]; return s && s.box > 0 && s.due <= now; }); }
  R.cards = function () {
    var P = HW.ui.pr;
    if (!P.deck) {
      var due = dueCards().sort(function (a, b) { return HW.S.cards[a.id].box - HW.S.cards[b.id].box; });
      var fresh = HW.shuffle(allCards().filter(function (c) { return !HW.S.cards[c.id] || HW.S.cards[c.id].box === 0; })).slice(0, Math.max(0, 12 - due.length));
      P.deck = due.concat(fresh); P.i = 0; P.flip = false;
    }
    if (P.i >= P.deck.length) return '<h2>Tarjetas de repaso</h2><div class="box ok"><p>Sesión terminada. Las que has fallado volverán mañana o antes; las que sabías, dentro de más días.</p></div><button class="btn primary" data-act="cNew">Otra sesión</button>' + boxSummary();
    var c = P.deck[P.i], s = HW.S.cards[c.id];
    return '<h2>Tarjetas de repaso</h2><p class="small muted">Tarjeta ' + (P.i + 1) + ' de ' + P.deck.length + ' · caja ' + (s ? s.box : 0) + ' de 5 · ' + (s && s.box ? 'repaso' : 'nueva') + '</p>' +
      '<div class="flash" data-act="cFlip" role="button" tabindex="0">' + (P.flip ? '<div class="front">' + h(c.back) + '</div><div class="small">' + h(c.ana || '') + '</div>' + (c.l ? '<div class="tiny muted">Lección ' + c.l + '</div>' : '') : '<div class="front">' + h(c.front) + '</div><div class="small muted">Toca para ver la respuesta</div>') + '</div>' +
      (P.flip ? '<div class="grid2"><button class="btn" data-act="cAns" data-ok="0" style="border-color:var(--bad)">No lo sabía</button><button class="btn primary" data-act="cAns" data-ok="1">Lo sabía</button></div>' : '') + boxSummary();
  };
  function boxSummary() { var cnt = [0, 0, 0, 0, 0, 0]; Object.keys(HW.S.cards).forEach(function (k) { cnt[HW.S.cards[k].box]++; }); return '<div class="card"><div class="eyebrow">Tus cajas</div><div class="row">' + [1, 2, 3, 4, 5].map(function (b) { return '<span class="pill' + (b === 5 ? ' ok' : b === 1 ? ' bad' : '') + '">Caja ' + b + ': ' + cnt[b] + '</span>'; }).join('') + '</div><p class="tiny muted">Caja 1 = vuelve hoy; 2 = mañana; 3 = en 3 días; 4 = en 7; 5 = en 16. Fallar devuelve la tarjeta a la caja 1.</p></div>'; }
  HW.A.cFlip = function () { HW.ui.pr.flip = !HW.ui.pr.flip; HW.rerender(); };
  HW.A.cAns = function (el) { var P = HW.ui.pr, c = P.deck[P.i], ok = el.dataset.ok === '1'; HW.cardAnswer(c.id, ok); HW.stat('tarjetas', ok); P.i++; P.flip = false; HW.rerender(); };
  HW.A.cNew = function () { HW.ui.pr = { mode: 'cards' }; HW.rerender(); };

  /* ---------- Examen final ---------- */
  function duelQuestion() {
    var d = newDuel(), r = d.res, opts = [d.a.n, d.b.n, 'Empate práctico'], a = r.win === 'a' ? 0 : r.win === 'b' ? 1 : 2;
    return { q: '¿Qué es mejor para ' + d.use[1] + ': ' + d.a.n + ' o ' + d.b.n + '?', o: opts, a: a, x: r.say, l: d.kind === 'cpu' ? 'd' : 'e', lvl: 'Experto' };
  }
  R.exam = function () {
    var P = HW.ui.pr;
    if (!P.qs) {
      var pool = HW.allQuestions(), hard = HW.shuffle(pool.filter(function (q) { return q.lvl === 'Avanzado' || q.lvl === 'Experto'; })).slice(0, 12), mid = HW.shuffle(pool.filter(function (q) { return q.lvl === 'Intermedio' || q.lvl === 'Básico'; })).slice(0, 8);
      var duels = []; for (var i = 0; i < 5; i++) duels.push(duelQuestion());
      P.qs = HW.shuffle(hard.concat(mid).concat(duels));
    }
    return '<h2>Examen final: nivel experto</h2><p class="muted">25 preguntas: 20 de teoría (12 avanzadas o expertas) y 5 duelos generados del catálogo. Aprobado con 80 %.</p>' +
      HW.quizHtml('exam', P.qs, { noShuffle: false, onEnd: function (pct) { HW.S.exam.push({ d: Date.now(), pct: pct }); HW.save(); return pct >= 80 ? '<div class="box ok"><h4>Nivel experto conseguido</h4><p>Ya puedes contestar con argumentos propios.</p></div>' : '<div class="box warn"><p>Aún no. Mira en Estadísticas qué temas fallas más.</p></div>'; } }) + '<button class="btn full" data-act="eNew">Nuevo examen</button>';
  };
  HW.A.eNew = function () { HW.ui.pr = { mode: 'exam' }; HW.rerender(); };

  /* ---------- Estadísticas ---------- */
  R.stats = function () {
    var S = HW.S.stats, rows = HW.lessons.map(function (l) { var s = S[l.id] || { ok: 0, ko: 0 }; return { k: l.id + ') ' + l.t, ok: s.ok, ko: s.ko, l: l.id }; });
    ['duelos', 'orden', 'conectores', 'tarjetas'].forEach(function (k) { var s = S[k] || { ok: 0, ko: 0 }; rows.push({ k: { duelos: 'Duelos y práctica del comparador', orden: 'Ordenar por generación', conectores: 'Reconocer conectores', tarjetas: 'Tarjetas de repaso' }[k], ok: s.ok, ko: s.ko }); });
    var tried = rows.filter(function (r) { return r.ok + r.ko > 0; }), weak = tried.filter(function (r) { return r.ok / (r.ok + r.ko) < .6; }).sort(function (a, b) { return a.ok / (a.ok + a.ko) - b.ok / (b.ok + b.ko); });
    var done = HW.lessons.filter(function (l) { return HW.S.done[l.id]; }).length, ex = HW.S.exam, best = ex.reduce(function (m, e) { return Math.max(m, e.pct); }, 0);
    return '<h2>Estadísticas</h2><div class="grid2"><div class="card"><div class="eyebrow">Lecciones</div><h2 class="num">' + done + '/' + HW.lessons.length + '</h2></div><div class="card"><div class="eyebrow">Mejor examen</div><h2 class="num">' + (ex.length ? best + ' %' : '—') + '</h2></div></div>' +
      (weak.length ? '<div class="box warn"><h4>Te cuesta</h4><ul>' + weak.slice(0, 5).map(function (w) { return '<li>' + h(w.k) + ' (' + Math.round(w.ok / (w.ok + w.ko) * 100) + ' %)' + (w.l ? ' · <a href="#leccion-' + w.l + '">repasar</a>' : '') + '</li>'; }).join('') + '</ul></div>' : '') +
      '<div class="card"><h3>Aciertos por tema</h3>' + rows.map(function (r) { var t = r.ok + r.ko, p = t ? r.ok / t : 0; return '<div class="stat-row"><span>' + h(r.k) + '</span><span class="track"><i style="width:' + (p * 100) + '%;background:' + (!t ? 'var(--line)' : p >= .8 ? 'var(--ok)' : p >= .6 ? 'var(--warn)' : 'var(--bad)') + '"></i></span><span class="num tiny">' + (t ? Math.round(p * 100) + '%' : '—') + '</span></div>'; }).join('') + '</div>' + boxSummary();
  };

  HW.V.practicar.after = function (root) { bindSort(root); bindSpots(root); };
})();
