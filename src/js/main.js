/* Arranque: cabecera, barra de pestañas y navegación */
(function () {
  HW.applyTheme();
  var nav = document.getElementById('tabs');
  nav.innerHTML = HW.TABS.map(function (t) {
    return '<button data-act="tab" data-tab="' + t[0] + '" aria-label="' + t[1] + '"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + HW.icons[t[0]] + '</svg><span>' + t[1] + '</span></button>';
  }).join('');
  document.getElementById('logo').innerHTML = HW.svg.logo;
  document.getElementById('dataDate').textContent = 'Datos verificados a ' + HW.DATA_DATE + ' · precios orientativos';
  HW.A.tab = function (el) { if (el.dataset.tab === 'practicar' && location.hash === '#practicar') HW.ui.pr = { mode: 'menu' }; HW.go(el.dataset.tab); };
  HW.A.theme = function () { HW.toggleTheme(); };
  window.addEventListener('hashchange', HW.route);
  HW.route();
})();
