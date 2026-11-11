/* =========================================================================
   DATOS · PROCESADORES
   Campos: n nombre · y año · arch (clave de HW.archs) · code nombre en clave · node · socket
   plat (clave de compatibilidad con chipsets) · c núcleos P (o todos en AMD) · e núcleos E · lpe LP-E
   t hilos · b base GHz · bo turbo GHz · l2/l3 MB · tdp W (TDP o PBP) · pmax W (PL2 / PPT)
   igpu texto o null · mem memoria oficial · ddr tipos · pcie versión · msrp USD de salida
   g índice juegos 1080p (Ryzen 7 9800X3D = 100) · m índice multinúcleo (Ryzen 9 9950X = 100)
   conf: 'rev' = sacado de reseñas · 'est' = estimado/extrapolado · 'pv' = por verificar
   Para añadir un modelo: copia una línea de su familia y cambia los campos.
   ========================================================================= */
window.HW = window.HW || {};
HW.DATA_DATE = '11/11/2026';
HW.fam = function (def, rows) { return rows.map(function (r) { return Object.assign({}, def, r); }); };

HW.cpus = [].concat(
/* ---------------- AMD · AM4 ---------------- */
HW.fam({ brand: 'AMD', seg: 'desktop', y: 2017, arch: 'zen1', code: 'Summit Ridge', node: 'GlobalFoundries 14 nm', socket: 'AM4', plat: 'zen1', igpu: null, mem: 'DDR4-2666', ddr: ['DDR4'], pcie: '3.0', conf: 'est' }, [
  { n: 'Ryzen 7 1800X', c: 8, t: 16, b: 3.6, bo: 4.0, l2: 4, l3: 16, tdp: 95, pmax: 128, msrp: 499, g: 38, m: 21, riv: 'Core i7-7700K' },
  { n: 'Ryzen 7 1700X', c: 8, t: 16, b: 3.4, bo: 3.8, l2: 4, l3: 16, tdp: 95, pmax: 128, msrp: 399, g: 36, m: 20, riv: 'Core i7-7700K' },
  { n: 'Ryzen 7 1700', c: 8, t: 16, b: 3.0, bo: 3.7, l2: 4, l3: 16, tdp: 65, pmax: 88, msrp: 329, g: 34, m: 19, riv: 'Core i7-7700' },
  { n: 'Ryzen 5 1600X', c: 6, t: 12, b: 3.6, bo: 4.0, l2: 3, l3: 16, tdp: 95, pmax: 128, msrp: 249, g: 36, m: 16, riv: 'Core i5-7600K' },
  { n: 'Ryzen 5 1600', c: 6, t: 12, b: 3.2, bo: 3.6, l2: 3, l3: 16, tdp: 65, pmax: 88, msrp: 219, g: 34, m: 15, riv: 'Core i5-7500' },
  { n: 'Ryzen 5 1500X', c: 4, t: 8, b: 3.5, bo: 3.7, l2: 2, l3: 16, tdp: 65, pmax: 88, msrp: 189, g: 30, m: 10, riv: 'Core i5-7400' },
  { n: 'Ryzen 3 1300X', c: 4, t: 4, b: 3.5, bo: 3.7, l2: 2, l3: 8, tdp: 65, pmax: 88, msrp: 129, g: 27, m: 8, riv: 'Core i3-7100' }
]),
HW.fam({ brand: 'AMD', seg: 'desktop', y: 2018, arch: 'zen1', code: 'Raven Ridge (APU)', node: 'GlobalFoundries 14 nm', socket: 'AM4', plat: 'zen1apu', mem: 'DDR4-2933', ddr: ['DDR4'], pcie: '3.0 (x8 para la gráfica)', conf: 'est' }, [
  { n: 'Ryzen 5 2400G', c: 4, t: 8, b: 3.6, bo: 3.9, l2: 2, l3: 4, tdp: 65, pmax: 88, igpu: 'Radeon Vega 11', msrp: 169, g: 28, m: 9, riv: 'Core i5-8400' },
  { n: 'Ryzen 3 2200G', c: 4, t: 4, b: 3.5, bo: 3.7, l2: 2, l3: 4, tdp: 65, pmax: 88, igpu: 'Radeon Vega 8', msrp: 99, g: 24, m: 7, riv: 'Core i3-8100' }
]),
HW.fam({ brand: 'AMD', seg: 'desktop', y: 2018, arch: 'zenplus', code: 'Pinnacle Ridge', node: 'GlobalFoundries 12 nm', socket: 'AM4', plat: 'zenplus', igpu: null, mem: 'DDR4-2933', ddr: ['DDR4'], pcie: '3.0', conf: 'est' }, [
  { n: 'Ryzen 7 2700X', c: 8, t: 16, b: 3.7, bo: 4.3, l2: 4, l3: 16, tdp: 105, pmax: 142, msrp: 329, g: 42, m: 24, riv: 'Core i7-8700K' },
  { n: 'Ryzen 7 2700', c: 8, t: 16, b: 3.2, bo: 4.1, l2: 4, l3: 16, tdp: 65, pmax: 88, msrp: 299, g: 40, m: 22, riv: 'Core i7-8700' },
  { n: 'Ryzen 5 2600X', c: 6, t: 12, b: 3.6, bo: 4.2, l2: 3, l3: 16, tdp: 95, pmax: 128, msrp: 229, g: 41, m: 18, riv: 'Core i5-8600K' },
  { n: 'Ryzen 5 2600', c: 6, t: 12, b: 3.4, bo: 3.9, l2: 3, l3: 16, tdp: 65, pmax: 88, msrp: 199, g: 39, m: 17, riv: 'Core i5-8400' }
]),
HW.fam({ brand: 'AMD', seg: 'desktop', y: 2019, arch: 'zenplus', code: 'Picasso (APU)', node: 'GlobalFoundries 12 nm', socket: 'AM4', plat: 'zenplusapu', mem: 'DDR4-2933', ddr: ['DDR4'], pcie: '3.0 (x8 para la gráfica)', conf: 'est' }, [
  { n: 'Ryzen 5 3400G', c: 4, t: 8, b: 3.7, bo: 4.2, l2: 2, l3: 4, tdp: 65, pmax: 88, igpu: 'Radeon Vega 11', msrp: 149, g: 30, m: 10, riv: 'Core i3-9100', note: 'Es una 3000 pero con arquitectura Zen+, la de la serie 2000. Trampa de nombres.' },
  { n: 'Ryzen 3 3200G', c: 4, t: 4, b: 3.6, bo: 4.0, l2: 2, l3: 4, tdp: 65, pmax: 88, igpu: 'Radeon Vega 8', msrp: 99, g: 26, m: 7.5, riv: 'Core i3-9100F', note: 'Zen+ aunque se llame 3000.' }
]),
HW.fam({ brand: 'AMD', seg: 'desktop', y: 2019, arch: 'zen2', code: 'Matisse', node: 'TSMC 7 nm + GF 12 nm (E/S)', socket: 'AM4', plat: 'zen2', igpu: null, mem: 'DDR4-3200', ddr: ['DDR4'], pcie: '4.0', conf: 'rev' }, [
  { n: 'Ryzen 9 3950X', c: 16, t: 32, b: 3.5, bo: 4.7, l2: 8, l3: 64, tdp: 105, pmax: 142, msrp: 749, g: 50, m: 57, riv: 'Core i9-9900K' },
  { n: 'Ryzen 9 3900X', c: 12, t: 24, b: 3.8, bo: 4.6, l2: 6, l3: 64, tdp: 105, pmax: 142, msrp: 499, g: 50, m: 44, riv: 'Core i9-9900K' },
  { n: 'Ryzen 7 3800X', c: 8, t: 16, b: 3.9, bo: 4.5, l2: 4, l3: 32, tdp: 105, pmax: 142, msrp: 399, g: 49, m: 31, riv: 'Core i7-9700K' },
  { n: 'Ryzen 7 3700X', c: 8, t: 16, b: 3.6, bo: 4.4, l2: 4, l3: 32, tdp: 65, pmax: 88, msrp: 329, g: 48, m: 29, riv: 'Core i7-9700K' },
  { n: 'Ryzen 5 3600X', c: 6, t: 12, b: 3.8, bo: 4.4, l2: 3, l3: 32, tdp: 95, pmax: 128, msrp: 249, g: 47, m: 22, riv: 'Core i5-9600K' },
  { n: 'Ryzen 5 3600', c: 6, t: 12, b: 3.6, bo: 4.2, l2: 3, l3: 32, tdp: 65, pmax: 88, msrp: 199, g: 45, m: 21, riv: 'Core i5-9400F' },
  { n: 'Ryzen 3 3300X', y: 2020, c: 4, t: 8, b: 3.8, bo: 4.3, l2: 2, l3: 16, tdp: 65, pmax: 88, msrp: 120, g: 43, m: 13, riv: 'Core i3-10100' },
  { n: 'Ryzen 3 3100', y: 2020, c: 4, t: 8, b: 3.6, bo: 3.9, l2: 2, l3: 16, tdp: 65, pmax: 88, msrp: 99, g: 37, m: 11, riv: 'Core i3-10100F' }
]),
HW.fam({ brand: 'AMD', seg: 'desktop', y: 2022, arch: 'zen2', code: 'Renoir', node: 'TSMC 7 nm', socket: 'AM4', plat: 'zen2apu', mem: 'DDR4-3200', ddr: ['DDR4'], pcie: '3.0', conf: 'est' }, [
  { n: 'Ryzen 5 4600G', c: 6, t: 12, b: 3.7, bo: 4.2, l2: 3, l3: 8, tdp: 65, pmax: 88, igpu: 'Radeon Vega 7', msrp: 154, g: 44, m: 22, riv: 'Core i3-12100', note: 'Salió a tienda en 2022 aunque la arquitectura es de 2020.' },
  { n: 'Ryzen 5 4500', c: 6, t: 12, b: 3.6, bo: 4.1, l2: 3, l3: 8, tdp: 65, pmax: 88, igpu: null, msrp: 129, g: 42, m: 21, riv: 'Core i3-12100F', note: 'Solo PCIe 3.0 y 8 MB de L3: peor de lo que sugiere el nombre.' }
]),
HW.fam({ brand: 'AMD', seg: 'desktop', y: 2020, arch: 'zen3', code: 'Vermeer', node: 'TSMC 7 nm + GF 12 nm (E/S)', socket: 'AM4', plat: 'zen3', igpu: null, mem: 'DDR4-3200', ddr: ['DDR4'], pcie: '4.0', conf: 'rev' }, [
  { n: 'Ryzen 9 5950X', c: 16, t: 32, b: 3.4, bo: 4.9, l2: 8, l3: 64, tdp: 105, pmax: 142, msrp: 799, g: 62, m: 68, riv: 'Core i9-10900K' },
  { n: 'Ryzen 9 5900X', c: 12, t: 24, b: 3.7, bo: 4.8, l2: 6, l3: 64, tdp: 105, pmax: 142, msrp: 549, g: 62, m: 53, riv: 'Core i9-11900K' },
  { n: 'Ryzen 7 5800X', c: 8, t: 16, b: 3.8, bo: 4.7, l2: 4, l3: 32, tdp: 105, pmax: 142, msrp: 449, g: 61, m: 37, riv: 'Core i7-11700K' },
  { n: 'Ryzen 7 5700X', y: 2022, c: 8, t: 16, b: 3.4, bo: 4.6, l2: 4, l3: 32, tdp: 65, pmax: 76, msrp: 299, g: 59, m: 34, riv: 'Core i5-12600K' },
  { n: 'Ryzen 5 5600X', c: 6, t: 12, b: 3.7, bo: 4.6, l2: 3, l3: 32, tdp: 65, pmax: 76, msrp: 299, g: 58, m: 27, riv: 'Core i5-11600K' },
  { n: 'Ryzen 5 5600', y: 2022, c: 6, t: 12, b: 3.5, bo: 4.4, l2: 3, l3: 32, tdp: 65, pmax: 76, msrp: 199, g: 56, m: 26, riv: 'Core i5-12400F' },
  { n: 'Ryzen 7 5800X3D', y: 2022, c: 8, t: 16, b: 3.4, bo: 4.5, l2: 4, l3: 96, tdp: 105, pmax: 142, msrp: 449, g: 72, m: 34, riv: 'Core i9-12900K', x3d: true },
  { n: 'Ryzen 7 5700X3D', y: 2024, c: 8, t: 16, b: 3.0, bo: 4.1, l2: 4, l3: 96, tdp: 105, pmax: 142, msrp: 249, g: 68, m: 31, riv: 'Core i5-13600K', x3d: true },
  { n: 'Ryzen 5 5600X3D', y: 2023, c: 6, t: 12, b: 3.3, bo: 4.4, l2: 3, l3: 96, tdp: 105, pmax: 142, msrp: 229, g: 66, m: 25, riv: 'Core i5-13400F', x3d: true, conf: 'est', note: 'Se vendió casi solo en Micro Center (EE. UU.).' }
]),
HW.fam({ brand: 'AMD', seg: 'desktop', y: 2021, arch: 'zen3', code: 'Cezanne (APU)', node: 'TSMC 7 nm', socket: 'AM4', plat: 'zen3apu', mem: 'DDR4-3200', ddr: ['DDR4'], pcie: '3.0', conf: 'rev' }, [
  { n: 'Ryzen 7 5700G', c: 8, t: 16, b: 3.8, bo: 4.6, l2: 4, l3: 16, tdp: 65, pmax: 88, igpu: 'Radeon Vega 8', msrp: 359, g: 52, m: 33, riv: 'Core i7-11700' },
  { n: 'Ryzen 5 5600G', c: 6, t: 12, b: 3.9, bo: 4.4, l2: 3, l3: 16, tdp: 65, pmax: 88, igpu: 'Radeon Vega 7', msrp: 259, g: 50, m: 26, riv: 'Core i5-11400' },
  { n: 'Ryzen 5 5500', y: 2022, c: 6, t: 12, b: 3.6, bo: 4.2, l2: 3, l3: 16, tdp: 65, pmax: 88, igpu: null, msrp: 159, g: 48, m: 24, riv: 'Core i3-12100F', note: 'Es un 5600G sin gráfica: solo 16 MB de L3 y PCIe 3.0. Más flojo que el 5600 en juegos.' },
  { n: 'Ryzen 7 5700', y: 2023, c: 8, t: 16, b: 3.7, bo: 4.6, l2: 4, l3: 16, tdp: 65, pmax: 88, igpu: null, msrp: null, g: 52, m: 33, riv: 'Core i5-12400F', conf: 'est', note: 'Trampa: no es un 5700X. Es un 5700G sin gráfica (16 MB de L3, PCIe 3.0).' }
]),
/* ---------------- AMD · AM5 ---------------- */
HW.fam({ brand: 'AMD', seg: 'desktop', y: 2022, arch: 'zen4', code: 'Raphael', node: 'TSMC 5 nm + 6 nm (E/S)', socket: 'AM5', plat: 'zen4', igpu: 'Radeon (2 CU, solo para escritorio)', mem: 'DDR5-5200', ddr: ['DDR5'], pcie: '5.0', conf: 'rev' }, [
  { n: 'Ryzen 9 7950X', c: 16, t: 32, b: 4.5, bo: 5.7, l2: 16, l3: 64, tdp: 170, pmax: 230, msrp: 699, g: 80, m: 90, riv: 'Core i9-13900K' },
  { n: 'Ryzen 9 7900X', c: 12, t: 24, b: 4.7, bo: 5.6, l2: 12, l3: 64, tdp: 170, pmax: 230, msrp: 549, g: 79, m: 70, riv: 'Core i7-13700K' },
  { n: 'Ryzen 7 7700X', c: 8, t: 16, b: 4.5, bo: 5.4, l2: 8, l3: 32, tdp: 105, pmax: 142, msrp: 399, g: 77, m: 46, riv: 'Core i5-13600K' },
  { n: 'Ryzen 5 7600X', c: 6, t: 12, b: 4.7, bo: 5.3, l2: 6, l3: 32, tdp: 105, pmax: 142, msrp: 299, g: 75, m: 36, riv: 'Core i5-13600K' },
  { n: 'Ryzen 9 7900', y: 2023, c: 12, t: 24, b: 3.7, bo: 5.4, l2: 12, l3: 64, tdp: 65, pmax: 88, msrp: 429, g: 76, m: 63, riv: 'Core i7-13700' },
  { n: 'Ryzen 7 7700', y: 2023, c: 8, t: 16, b: 3.8, bo: 5.3, l2: 8, l3: 32, tdp: 65, pmax: 88, msrp: 329, g: 76, m: 44, riv: 'Core i5-13600K' },
  { n: 'Ryzen 5 7600', y: 2023, c: 6, t: 12, b: 3.8, bo: 5.1, l2: 6, l3: 32, tdp: 65, pmax: 88, msrp: 229, g: 73, m: 34, riv: 'Core i5-13400F' },
  { n: 'Ryzen 5 7500F', y: 2023, c: 6, t: 12, b: 3.7, bo: 5.0, l2: 6, l3: 32, tdp: 65, pmax: 88, igpu: null, msrp: 179, g: 72, m: 33, riv: 'Core i5-13400F', note: 'Como un 7600 sin gráfica integrada.' },
  { n: 'Ryzen 9 7950X3D', y: 2023, c: 16, t: 32, b: 4.2, bo: 5.7, l2: 16, l3: 128, tdp: 120, pmax: 162, msrp: 699, g: 88, m: 84, riv: 'Core i9-13900KS', x3d: true, note: 'Solo uno de sus dos chiplets lleva 3D V-Cache; el sistema debe mandar los juegos a ese.' },
  { n: 'Ryzen 9 7900X3D', y: 2023, c: 12, t: 24, b: 4.4, bo: 5.6, l2: 12, l3: 128, tdp: 120, pmax: 162, msrp: 599, g: 84, m: 64, riv: 'Core i7-13700K', x3d: true, note: 'Para juegos solo usa 6 núcleos con caché extra (6+6). Peor compra para jugar que el 7800X3D.' },
  { n: 'Ryzen 7 7800X3D', y: 2023, c: 8, t: 16, b: 4.2, bo: 5.0, l2: 8, l3: 96, tdp: 120, pmax: 162, msrp: 449, g: 89, m: 43, riv: 'Core i7-14700K', x3d: true },
  { n: 'Ryzen 5 7600X3D', y: 2024, c: 6, t: 12, b: 4.1, bo: 4.7, l2: 6, l3: 96, tdp: 65, pmax: 88, msrp: 299, g: 83, m: 33, riv: 'Core i5-14600K', x3d: true, conf: 'est', note: 'Distribución limitada (Micro Center y algunas tiendas europeas).' }
]),
HW.fam({ brand: 'AMD', seg: 'desktop', y: 2024, arch: 'zen4', code: 'Phoenix (APU)', node: 'TSMC 4 nm', socket: 'AM5', plat: 'zen4apu', mem: 'DDR5-5200', ddr: ['DDR5'], pcie: '4.0 (menos carriles que un Ryzen 7000; por verificar en amd.com)', conf: 'rev' }, [
  { n: 'Ryzen 7 8700G', c: 8, t: 16, b: 4.2, bo: 5.1, l2: 8, l3: 16, tdp: 65, pmax: 88, igpu: 'Radeon 780M (12 CU, RDNA 3)', msrp: 329, g: 62, m: 42, riv: 'Core i5-14400', note: 'Trampa: 8000 no es más nueva que 9000. Es un portátil Zen 4 con 16 MB de L3, por eso juega peor que un 7700.' },
  { n: 'Ryzen 5 8600G', c: 6, t: 12, b: 4.3, bo: 5.0, l2: 6, l3: 16, tdp: 65, pmax: 88, igpu: 'Radeon 760M (8 CU, RDNA 3)', msrp: 229, g: 60, m: 33, riv: 'Core i5-14400' },
  { n: 'Ryzen 5 8500G', c: 6, t: 12, b: 3.5, bo: 5.0, l2: 6, l3: 16, tdp: 65, pmax: 88, igpu: 'Radeon 740M (4 CU)', msrp: 179, g: 52, m: 28, riv: 'Core i3-14100', note: '2 núcleos Zen 4 + 4 Zen 4c (compactos, más lentos). La gráfica dedicada solo va a PCIe 4.0 x4 (por verificar).', conf: 'est' },
  { n: 'Ryzen 5 8400F', c: 6, t: 12, b: 4.2, bo: 4.7, l2: 6, l3: 16, tdp: 65, pmax: 88, igpu: null, msrp: 169, g: 58, m: 31, riv: 'Core i5-13400F', conf: 'est' }
]),
HW.fam({ brand: 'AMD', seg: 'desktop', y: 2024, arch: 'zen5', code: 'Granite Ridge', node: 'TSMC N4P + 6 nm (E/S)', socket: 'AM5', plat: 'zen5', igpu: 'Radeon (2 CU, solo para escritorio)', mem: 'DDR5-5600', ddr: ['DDR5'], pcie: '5.0', conf: 'rev' }, [
  { n: 'Ryzen 9 9950X', c: 16, t: 32, b: 4.3, bo: 5.7, l2: 16, l3: 64, tdp: 170, pmax: 230, msrp: 649, g: 81, m: 100, riv: 'Core Ultra 9 285K' },
  { n: 'Ryzen 9 9900X', c: 12, t: 24, b: 4.4, bo: 5.6, l2: 12, l3: 64, tdp: 120, pmax: 162, msrp: 499, g: 80, m: 78, riv: 'Core Ultra 7 265K' },
  { n: 'Ryzen 7 9700X', c: 8, t: 16, b: 3.8, bo: 5.5, l2: 8, l3: 32, tdp: 65, pmax: 88, msrp: 359, g: 79, m: 50, riv: 'Core Ultra 5 245K', note: 'Salió a 65 W; una BIOS posterior permite modo de 105 W (algo más rápido en multinúcleo).' },
  { n: 'Ryzen 5 9600X', c: 6, t: 12, b: 3.9, bo: 5.4, l2: 6, l3: 32, tdp: 65, pmax: 88, msrp: 279, g: 77, m: 39, riv: 'Core Ultra 5 245K' },
  { n: 'Ryzen 5 9600', y: 2025, c: 6, t: 12, b: 3.8, bo: 5.2, l2: 6, l3: 32, tdp: 65, pmax: 88, msrp: null, g: 75, m: 37, riv: 'Core Ultra 5 225', conf: 'est' },
  { n: 'Ryzen 7 9800X3D', c: 8, t: 16, b: 4.7, bo: 5.2, l2: 8, l3: 96, tdp: 120, pmax: 162, msrp: 479, g: 100, m: 55, riv: 'Core Ultra 9 285K', x3d: true, note: 'Segunda generación de 3D V-Cache: la caché va debajo de los núcleos, así que sube más de frecuencia y admite overclock. Referencia de este índice (= 100).' },
  { n: 'Ryzen 9 9950X3D', y: 2025, c: 16, t: 32, b: 4.3, bo: 5.7, l2: 16, l3: 128, tdp: 170, pmax: 230, msrp: 699, g: 99, m: 98, riv: 'Core Ultra 9 285K', x3d: true, note: 'Lo mejor de los dos mundos: juega como un 9800X3D y renderiza como un 9950X. Caché extra solo en un chiplet.' },
  { n: 'Ryzen 9 9900X3D', y: 2025, c: 12, t: 24, b: 4.4, bo: 5.5, l2: 12, l3: 128, tdp: 120, pmax: 162, msrp: 599, g: 95, m: 76, riv: 'Core Ultra 7 265K', x3d: true, note: 'Igual que con el 7900X3D: para jugar solo cuenta con 6 núcleos con caché extra.' },
  { n: 'Ryzen 7 9850X3D', y: 2026, c: 8, t: 16, b: 4.7, bo: 5.6, l2: 8, l3: 96, tdp: 120, pmax: 162, msrp: 499, g: 103, m: 57, riv: 'Core Ultra 7 270K Plus', x3d: true, note: 'Salió el 29/01/2026. Un 9800X3D con más frecuencia: +2-3 % en juegos según Tom\'s Hardware, con más consumo.' },
  { n: 'Ryzen 9 9950X3D2', y: 2026, c: 16, t: 32, b: 4.3, bo: 5.6, l2: 16, l3: 192, tdp: 200, pmax: 250, msrp: 899, g: 100, m: 102, riv: 'Core Ultra 9 285K', x3d: true, conf: 'pv', note: 'Salió el 22/04/2026. Primer Ryzen con 3D V-Cache en los dos chiplets (208 MB de L2+L3). Índices por verificar: AMD habla de +5-10 % sobre el 9950X3D en algunas cargas. PPT por verificar.' }
]),
/* ---------------- Intel · LGA1151 ---------------- */
HW.fam({ brand: 'Intel', seg: 'desktop', y: 2017, arch: 'skylake', code: 'Coffee Lake', node: 'Intel 14 nm++', socket: 'LGA1151 (v2)', plat: 'cfl', igpu: 'UHD 630', mem: 'DDR4-2666', ddr: ['DDR4'], pcie: '3.0', conf: 'est' }, [
  { n: 'Core i7-8700K', c: 6, t: 12, b: 3.7, bo: 4.7, l2: 1.5, l3: 12, tdp: 95, pmax: 130, msrp: 359, g: 48, m: 24, riv: 'Ryzen 7 2700X' },
  { n: 'Core i7-8700', c: 6, t: 12, b: 3.2, bo: 4.6, l2: 1.5, l3: 12, tdp: 65, pmax: 100, msrp: 303, g: 46, m: 22, riv: 'Ryzen 7 2700' },
  { n: 'Core i5-8600K', c: 6, t: 6, b: 3.6, bo: 4.3, l2: 1.5, l3: 9, tdp: 95, pmax: 120, msrp: 257, g: 44, m: 16, riv: 'Ryzen 5 2600X' },
  { n: 'Core i5-8400', c: 6, t: 6, b: 2.8, bo: 4.0, l2: 1.5, l3: 9, tdp: 65, pmax: 90, msrp: 182, g: 40, m: 14, riv: 'Ryzen 5 2600' },
  { n: 'Core i3-8100', c: 4, t: 4, b: 3.6, bo: 3.6, l2: 1, l3: 6, tdp: 65, pmax: 70, msrp: 117, g: 32, m: 9, riv: 'Ryzen 3 2200G' }
]),
HW.fam({ brand: 'Intel', seg: 'desktop', y: 2018, arch: 'skylake', code: 'Coffee Lake Refresh', node: 'Intel 14 nm++', socket: 'LGA1151 (v2)', plat: 'cfr', igpu: 'UHD 630', mem: 'DDR4-2666', ddr: ['DDR4'], pcie: '3.0', conf: 'est' }, [
  { n: 'Core i9-9900K', c: 8, t: 16, b: 3.6, bo: 5.0, l2: 2, l3: 16, tdp: 95, pmax: 210, msrp: 488, g: 55, m: 30, riv: 'Ryzen 7 2700X', note: 'Existe la versión KF (sin gráfica).' },
  { n: 'Core i7-9700K', c: 8, t: 8, b: 3.6, bo: 4.9, l2: 2, l3: 12, tdp: 95, pmax: 180, msrp: 374, g: 53, m: 24, riv: 'Ryzen 7 2700X' },
  { n: 'Core i5-9600K', c: 6, t: 6, b: 3.7, bo: 4.6, l2: 1.5, l3: 9, tdp: 95, pmax: 130, msrp: 262, g: 47, m: 17, riv: 'Ryzen 5 3600' },
  { n: 'Core i5-9400F', y: 2019, c: 6, t: 6, b: 2.9, bo: 4.1, l2: 1.5, l3: 9, tdp: 65, pmax: 90, igpu: null, msrp: 182, g: 41, m: 14, riv: 'Ryzen 5 2600' },
  { n: 'Core i3-9100F', y: 2019, c: 4, t: 4, b: 3.6, bo: 4.2, l2: 1, l3: 6, tdp: 65, pmax: 70, igpu: null, msrp: 122, g: 33, m: 9, riv: 'Ryzen 3 3200G' }
]),
/* ---------------- Intel · LGA1200 ---------------- */
HW.fam({ brand: 'Intel', seg: 'desktop', y: 2020, arch: 'skylake', code: 'Comet Lake', node: 'Intel 14 nm', socket: 'LGA1200', plat: 'cml', igpu: 'UHD 630', mem: 'DDR4-2933', ddr: ['DDR4'], pcie: '3.0', conf: 'est' }, [
  { n: 'Core i9-10900K', c: 10, t: 20, b: 3.7, bo: 5.3, l2: 2.5, l3: 20, tdp: 125, pmax: 250, msrp: 488, g: 57, m: 36, riv: 'Ryzen 9 3900X' },
  { n: 'Core i7-10700K', c: 8, t: 16, b: 3.8, bo: 5.1, l2: 2, l3: 16, tdp: 125, pmax: 229, msrp: 374, g: 56, m: 30, riv: 'Ryzen 7 3800X' },
  { n: 'Core i7-10700', c: 8, t: 16, b: 2.9, bo: 4.8, l2: 2, l3: 16, tdp: 65, pmax: 224, msrp: 323, g: 53, m: 27, riv: 'Ryzen 7 3700X' },
  { n: 'Core i5-10600K', c: 6, t: 12, b: 4.1, bo: 4.8, l2: 1.5, l3: 12, tdp: 125, pmax: 182, mem: 'DDR4-2666', msrp: 262, g: 53, m: 23, riv: 'Ryzen 5 3600X' },
  { n: 'Core i5-10400F', c: 6, t: 12, b: 2.9, bo: 4.3, l2: 1.5, l3: 12, tdp: 65, pmax: 134, mem: 'DDR4-2666', igpu: null, msrp: 155, g: 47, m: 20, riv: 'Ryzen 5 3600' },
  { n: 'Core i3-10100F', c: 4, t: 8, b: 3.6, bo: 4.3, l2: 1, l3: 6, tdp: 65, pmax: 90, mem: 'DDR4-2666', igpu: null, msrp: 79, g: 40, m: 12, riv: 'Ryzen 3 3100' }
]),
HW.fam({ brand: 'Intel', seg: 'desktop', y: 2021, arch: 'cypress', code: 'Rocket Lake', node: 'Intel 14 nm', socket: 'LGA1200', plat: 'rkl', igpu: 'UHD 750', mem: 'DDR4-3200', ddr: ['DDR4'], pcie: '4.0', conf: 'est' }, [
  { n: 'Core i9-11900K', c: 8, t: 16, b: 3.5, bo: 5.3, l2: 4, l3: 16, tdp: 125, pmax: 251, msrp: 539, g: 60, m: 33, riv: 'Ryzen 7 5800X', note: 'Tiene 2 núcleos menos que el i9-10900K: a veces rinde menos en multinúcleo.' },
  { n: 'Core i7-11700K', c: 8, t: 16, b: 3.6, bo: 5.0, l2: 4, l3: 16, tdp: 125, pmax: 251, msrp: 399, g: 59, m: 32, riv: 'Ryzen 7 5800X' },
  { n: 'Core i5-11600K', c: 6, t: 12, b: 3.9, bo: 4.9, l2: 3, l3: 12, tdp: 125, pmax: 251, msrp: 262, g: 57, m: 25, riv: 'Ryzen 5 5600X' },
  { n: 'Core i5-11400F', c: 6, t: 12, b: 2.6, bo: 4.4, l2: 3, l3: 12, tdp: 65, pmax: 154, igpu: null, msrp: 157, g: 53, m: 22, riv: 'Ryzen 5 3600' }
]),
/* ---------------- Intel · LGA1700 ---------------- */
HW.fam({ brand: 'Intel', seg: 'desktop', y: 2021, arch: 'goldencove', code: 'Alder Lake', node: 'Intel 7', socket: 'LGA1700', plat: 'adl', igpu: 'UHD 770', mem: 'DDR4-3200 / DDR5-4800', ddr: ['DDR4', 'DDR5'], pcie: '5.0 (gráfica) + 4.0', conf: 'rev' }, [
  { n: 'Core i9-12900K', c: 8, e: 8, t: 24, b: 3.2, bo: 5.2, l2: 14, l3: 30, tdp: 125, pmax: 241, msrp: 589, g: 73, m: 64, riv: 'Ryzen 9 5950X' },
  { n: 'Core i7-12700K', c: 8, e: 4, t: 20, b: 3.6, bo: 5.0, l2: 12, l3: 25, tdp: 125, pmax: 190, msrp: 409, g: 71, m: 55, riv: 'Ryzen 9 5900X' },
  { n: 'Core i5-12600K', c: 6, e: 4, t: 16, b: 3.7, bo: 4.9, l2: 9.5, l3: 20, tdp: 125, pmax: 150, msrp: 289, g: 68, m: 42, riv: 'Ryzen 7 5800X' },
  { n: 'Core i5-12400F', y: 2022, c: 6, t: 12, b: 2.5, bo: 4.4, l2: 7.5, l3: 18, tdp: 65, pmax: 117, igpu: null, msrp: 167, g: 62, m: 29, riv: 'Ryzen 5 5600', mine: true, note: 'Tu procesador. Solo núcleos P (6). La F significa sin gráfica integrada: necesitas gráfica dedicada para tener imagen.' },
  { n: 'Core i5-12400', y: 2022, c: 6, t: 12, b: 2.5, bo: 4.4, l2: 7.5, l3: 18, tdp: 65, pmax: 117, igpu: 'UHD 730', msrp: 192, g: 62, m: 29, riv: 'Ryzen 5 5600G' },
  { n: 'Core i3-12100F', y: 2022, c: 4, t: 8, b: 3.3, bo: 4.3, l2: 5, l3: 12, tdp: 58, pmax: 89, igpu: null, msrp: 97, g: 55, m: 18, riv: 'Ryzen 5 5500' }
]),
HW.fam({ brand: 'Intel', seg: 'desktop', y: 2022, arch: 'raptorcove', code: 'Raptor Lake', node: 'Intel 7', socket: 'LGA1700', plat: 'rpl', igpu: 'UHD 770', mem: 'DDR4-3200 / DDR5-5600', ddr: ['DDR4', 'DDR5'], pcie: '5.0 (gráfica) + 4.0', conf: 'rev', degr: true }, [
  { n: 'Core i9-13900K', c: 8, e: 16, t: 32, b: 3.0, bo: 5.8, l2: 32, l3: 36, tdp: 125, pmax: 253, msrp: 589, g: 84, m: 90, riv: 'Ryzen 9 7950X' },
  { n: 'Core i7-13700K', c: 8, e: 8, t: 24, b: 3.4, bo: 5.4, l2: 24, l3: 30, tdp: 125, pmax: 253, msrp: 409, g: 81, m: 72, riv: 'Ryzen 9 7900X' },
  { n: 'Core i5-13600K', c: 6, e: 8, t: 20, b: 3.5, bo: 5.1, l2: 20, l3: 24, tdp: 125, pmax: 181, msrp: 319, g: 77, m: 57, riv: 'Ryzen 5 7600X' },
  { n: 'Core i5-13400F', y: 2023, c: 6, e: 4, t: 16, b: 2.5, bo: 4.6, l2: 9.5, l3: 20, tdp: 65, pmax: 148, mem: 'DDR4-3200 / DDR5-4800', igpu: null, msrp: 196, g: 64, m: 37, riv: 'Ryzen 5 7600', degr: false, note: 'Muchos 13400F usan el chip de Alder Lake (12.ª): no le afecta la degradación de Raptor Lake.' },
  { n: 'Core i3-13100F', y: 2023, c: 4, t: 8, b: 3.4, bo: 4.5, l2: 5, l3: 12, tdp: 58, pmax: 89, mem: 'DDR4-3200 / DDR5-4800', igpu: null, msrp: 109, g: 57, m: 19, riv: 'Ryzen 5 5500', degr: false }
]),
HW.fam({ brand: 'Intel', seg: 'desktop', y: 2023, arch: 'raptorcove', code: 'Raptor Lake Refresh', node: 'Intel 7', socket: 'LGA1700', plat: 'rpl', igpu: 'UHD 770', mem: 'DDR4-3200 / DDR5-5600', ddr: ['DDR4', 'DDR5'], pcie: '5.0 (gráfica) + 4.0', conf: 'rev', degr: true }, [
  { n: 'Core i9-14900K', c: 8, e: 16, t: 32, b: 3.2, bo: 6.0, l2: 32, l3: 36, tdp: 125, pmax: 253, msrp: 589, g: 86, m: 92, riv: 'Ryzen 9 7950X3D' },
  { n: 'Core i7-14700K', c: 8, e: 12, t: 28, b: 3.4, bo: 5.6, l2: 28, l3: 33, tdp: 125, pmax: 253, msrp: 409, g: 84, m: 83, riv: 'Ryzen 7 7800X3D' },
  { n: 'Core i5-14600K', c: 6, e: 8, t: 20, b: 3.5, bo: 5.3, l2: 20, l3: 24, tdp: 125, pmax: 181, msrp: 319, g: 79, m: 59, riv: 'Ryzen 7 7700X' },
  { n: 'Core i5-14400F', y: 2024, c: 6, e: 4, t: 16, b: 2.5, bo: 4.7, l2: 9.5, l3: 20, tdp: 65, pmax: 148, mem: 'DDR4-3200 / DDR5-5200', igpu: null, msrp: 196, g: 65, m: 38, riv: 'Ryzen 5 7600', degr: false },
  { n: 'Core i3-14100F', y: 2024, c: 4, t: 8, b: 3.5, bo: 4.7, l2: 5, l3: 12, tdp: 58, pmax: 110, mem: 'DDR4-3200 / DDR5-4800', igpu: null, msrp: 109, g: 58, m: 20, riv: 'Ryzen 5 5500', degr: false }
]),
HW.fam({ brand: 'Intel', seg: 'desktop', y: 2025, arch: 'raptorcove', code: 'Raptor Lake (renombrado, "Core" sin Ultra)', node: 'Intel 7', socket: 'LGA1700', plat: 'rpl', igpu: null, mem: 'DDR4-3200 / DDR5-4800', ddr: ['DDR4', 'DDR5'], pcie: '5.0 + 4.0', conf: 'pv' }, [
  { n: 'Core 5 120F', c: 6, e: 4, t: 16, b: 2.5, bo: 4.5, l2: 9.5, l3: 18, tdp: 65, pmax: 148, msrp: null, g: 63, m: 35, riv: 'Ryzen 5 7500F', note: 'Trampa: "Core 5" sin "Ultra" = arquitectura antigua (Raptor/Alder Lake) con nombre nuevo. Lanzamiento limitado; ficha por verificar.' }
]),
/* ---------------- Intel · LGA1851 ---------------- */
HW.fam({ brand: 'Intel', seg: 'desktop', y: 2024, arch: 'lioncove', code: 'Arrow Lake-S', node: 'TSMC N3B (tile de CPU)', socket: 'LGA1851', plat: 'arl', igpu: 'Xe-LPG (4 núcleos Xe)', mem: 'DDR5-6400', ddr: ['DDR5'], pcie: '5.0', conf: 'rev' }, [
  { n: 'Core Ultra 9 285K', c: 8, e: 16, t: 24, b: 3.7, bo: 5.7, l2: 40, l3: 36, tdp: 125, pmax: 250, msrp: 589, g: 80, m: 99, riv: 'Ryzen 9 9950X', note: 'Sin Hyper-Threading: 24 núcleos = 24 hilos. Gasta mucho menos que el i9-14900K pero no juega mejor.' },
  { n: 'Core Ultra 7 265K', c: 8, e: 12, t: 20, b: 3.9, bo: 5.5, l2: 36, l3: 30, tdp: 125, pmax: 250, msrp: 394, g: 78, m: 87, riv: 'Ryzen 9 9900X' },
  { n: 'Core Ultra 5 245K', c: 6, e: 8, t: 14, b: 4.2, bo: 5.2, l2: 26, l3: 24, tdp: 125, pmax: 159, msrp: 309, g: 74, m: 58, riv: 'Ryzen 5 9600X' },
  { n: 'Core Ultra 5 225', y: 2025, c: 6, e: 4, t: 10, b: 3.3, bo: 4.9, l2: 22, l3: 20, tdp: 65, pmax: 121, msrp: 236, g: 68, m: 45, riv: 'Ryzen 5 7600', conf: 'est' }
]),
HW.fam({ brand: 'Intel', seg: 'desktop', y: 2026, arch: 'lioncove', code: 'Arrow Lake Refresh (200S Plus)', node: 'TSMC N3B (tile de CPU)', socket: 'LGA1851', plat: 'arlr', igpu: 'Xe-LPG (4 núcleos Xe)', mem: 'DDR5-7200', ddr: ['DDR5'], pcie: '5.0', conf: 'rev' }, [
  { n: 'Core Ultra 7 270K Plus', c: 8, e: 16, t: 24, b: 3.7, bo: 5.5, l2: 40, l3: 36, tdp: 125, pmax: 250, msrp: 299, g: 82, m: 100, riv: 'Ryzen 7 9850X3D', conf: 'est', note: 'Salió en marzo de 2026 a 299 $. Muy fuerte en multinúcleo por su precio; en juegos sigue por detrás de los X3D. Frecuencia base por verificar.' },
  { n: 'Core Ultra 5 250K Plus', c: 6, e: 12, t: 18, b: 4.2, bo: 5.3, l2: 32, l3: 30, tdp: 125, pmax: 159, msrp: 199, g: 76, m: 72, riv: 'Ryzen 5 9600X', conf: 'est', note: 'Salió en marzo de 2026 a 199 $. 30 MB de L3 (el 245K tiene 24).' }
]),
/* ---------------- Portátiles AMD ---------------- */
HW.fam({ brand: 'AMD', seg: 'laptop', socket: 'BGA (soldado)', plat: 'laptop', ddr: ['DDR5', 'LPDDR5X'], pcie: '4.0', conf: 'est', g: null }, [
  { n: 'Ryzen 5 5500U', y: 2021, arch: 'zen2', code: 'Lucienne', node: 'TSMC 7 nm', c: 6, t: 12, b: 2.1, bo: 4.0, l2: 3, l3: 8, tdp: 15, pmax: 25, igpu: 'Radeon Vega 7', mem: 'DDR4-3200 / LPDDR4X', ddr: ['DDR4'], pcie: '3.0', msrp: null, m: 18, riv: 'Core i5-1135G7', note: 'Trampa: la serie 5000 de portátil mezcla Zen 2 (5500U, 5700U) y Zen 3 (5600U, 5800U).' },
  { n: 'Ryzen 7 5800H', y: 2021, arch: 'zen3', code: 'Cezanne', node: 'TSMC 7 nm', c: 8, t: 16, b: 3.2, bo: 4.4, l2: 4, l3: 16, tdp: 45, pmax: 54, igpu: 'Radeon Vega 8', mem: 'DDR4-3200', ddr: ['DDR4'], pcie: '3.0', msrp: null, m: 32, riv: 'Core i7-11800H' },
  { n: 'Ryzen 5 7520U', y: 2022, arch: 'zen2', code: 'Mendocino', node: 'TSMC 6 nm', c: 4, t: 8, b: 2.8, bo: 4.3, l2: 2, l3: 4, tdp: 15, pmax: 15, igpu: 'Radeon 610M (2 CU)', mem: 'LPDDR5-5500', ddr: ['LPDDR5'], pcie: '3.0', msrp: null, m: 12, riv: 'Core i3-1215U', note: 'Trampa: tercer dígito 2 = Zen 2 (arquitectura de 2019). Es un portátil básico aunque se llame 7000.' },
  { n: 'Ryzen 7 7735HS', y: 2023, arch: 'zen3', code: 'Rembrandt-R (Zen 3+)', node: 'TSMC 6 nm', c: 8, t: 16, b: 3.2, bo: 4.75, l2: 4, l3: 16, tdp: 35, pmax: 54, igpu: 'Radeon 680M (12 CU)', mem: 'DDR5-4800', msrp: null, m: 33, riv: 'Core i7-12650H', note: 'Tercer dígito 3 = Zen 3+.' },
  { n: 'Ryzen 7 7840HS', y: 2023, arch: 'zen4', code: 'Phoenix', node: 'TSMC 4 nm', c: 8, t: 16, b: 3.8, bo: 5.1, l2: 8, l3: 16, tdp: 35, pmax: 54, igpu: 'Radeon 780M (12 CU)', mem: 'DDR5-5600 / LPDDR5X-7500', msrp: null, m: 42, riv: 'Core i7-13700H', note: 'Tercer dígito 4 = Zen 4.' },
  { n: 'Ryzen 7 8845HS', y: 2024, arch: 'zen4', code: 'Hawk Point', node: 'TSMC 4 nm', c: 8, t: 16, b: 3.8, bo: 5.1, l2: 8, l3: 16, tdp: 35, pmax: 54, igpu: 'Radeon 780M (12 CU)', mem: 'DDR5-5600 / LPDDR5X-7500', msrp: null, m: 42, riv: 'Core Ultra 7 155H', note: 'Casi igual que el 7840HS con un NPU algo más rápido.' },
  { n: 'Ryzen 9 7945HX', y: 2023, arch: 'zen4', code: 'Dragon Range', node: 'TSMC 5 nm + 6 nm', c: 16, t: 32, b: 2.5, bo: 5.4, l2: 16, l3: 64, tdp: 55, pmax: 75, igpu: 'Radeon 610M (2 CU)', mem: 'DDR5-5200', pcie: '5.0', msrp: null, m: 78, riv: 'Core i9-13980HX', note: 'Es un Ryzen 9 7950X de sobremesa a menos consumo.' },
  { n: 'Ryzen 9 9955HX3D', y: 2025, arch: 'zen5', code: 'Fire Range', node: 'TSMC N4P + 6 nm', c: 16, t: 32, b: 2.5, bo: 5.4, l2: 16, l3: 128, tdp: 55, pmax: 75, igpu: 'Radeon 610M (2 CU)', mem: 'DDR5-5600', pcie: '5.0', msrp: null, m: 85, riv: 'Core Ultra 9 275HX', x3d: true },
  { n: 'Ryzen AI 9 HX 370', y: 2024, arch: 'zen5', code: 'Strix Point', node: 'TSMC N4P', c: 12, t: 24, b: 2.0, bo: 5.1, l2: 12, l3: 24, tdp: 28, pmax: 54, igpu: 'Radeon 890M (16 CU, RDNA 3.5)', mem: 'DDR5-5600 / LPDDR5X-7500', msrp: null, m: 55, riv: 'Core Ultra 9 288V', note: '4 núcleos Zen 5 + 8 Zen 5c. NPU de 50 TOPS.' },
  { n: 'Ryzen AI 7 350', y: 2025, arch: 'zen5', code: 'Krackan Point', node: 'TSMC N4P', c: 8, t: 16, b: 2.0, bo: 5.0, l2: 8, l3: 16, tdp: 28, pmax: 54, igpu: 'Radeon 860M (8 CU)', mem: 'DDR5-5600 / LPDDR5X-8000', msrp: null, m: 40, riv: 'Core Ultra 7 255H', note: '4 Zen 5 + 4 Zen 5c.' },
  { n: 'Ryzen AI Max+ 395', y: 2025, arch: 'zen5', code: 'Strix Halo', node: 'TSMC N4P + 6 nm', c: 16, t: 32, b: 3.0, bo: 5.1, l2: 16, l3: 64, tdp: 55, pmax: 120, igpu: 'Radeon 8060S (40 CU, RDNA 3.5)', mem: 'LPDDR5X-8000 (hasta 128 GB)', ddr: ['LPDDR5X'], msrp: null, m: 80, riv: 'Core Ultra 9 285H', note: 'Gráfica integrada al nivel de una RTX 4060 de portátil. Muy buscado para IA local por su RAM compartida de hasta 128 GB.' },
  { n: 'Ryzen AI 9 HX 470', y: 2026, arch: 'zen5', code: 'Gorgon Point', node: 'TSMC N4P', c: 12, t: 24, b: 2.0, bo: 5.2, l2: 12, l3: 24, tdp: 28, pmax: 54, igpu: 'Radeon 890M (16 CU)', mem: 'DDR5-5600 / LPDDR5X-8533', msrp: null, m: 57, riv: 'Core Ultra X9 388H', conf: 'pv', note: 'Ryzen AI 400 (2026): actualización de Strix Point. Ficha por verificar.' }
]),
/* ---------------- Portátiles Intel ---------------- */
HW.fam({ brand: 'Intel', seg: 'laptop', socket: 'BGA (soldado)', plat: 'laptop', ddr: ['DDR5', 'LPDDR5X'], pcie: '4.0', conf: 'est', g: null }, [
  { n: 'Core i5-1235U', y: 2022, arch: 'goldencove', code: 'Alder Lake-U', node: 'Intel 7', c: 2, e: 8, t: 12, b: 1.3, bo: 4.4, l2: 6.5, l3: 12, tdp: 15, pmax: 55, igpu: 'Iris Xe (80 EU)', mem: 'DDR4-3200 / DDR5-4800', ddr: ['DDR4', 'DDR5'], msrp: null, m: 20, riv: 'Ryzen 5 5625U', note: 'U = bajo consumo: solo 2 núcleos P.' },
  { n: 'Core i7-12700H', y: 2022, arch: 'goldencove', code: 'Alder Lake-H', node: 'Intel 7', c: 6, e: 8, t: 20, b: 2.3, bo: 4.7, l2: 11.5, l3: 24, tdp: 45, pmax: 115, igpu: 'Iris Xe (96 EU)', mem: 'DDR4-3200 / DDR5-4800', ddr: ['DDR4', 'DDR5'], msrp: null, m: 41, riv: 'Ryzen 7 6800H', note: 'Trampa: un i7 de portátil H tiene 6 núcleos P; el i7-12700K de sobremesa tiene 8.' },
  { n: 'Core i7-13620H', y: 2023, arch: 'raptorcove', code: 'Raptor Lake-H', node: 'Intel 7', c: 6, e: 4, t: 16, b: 2.4, bo: 4.9, l2: 9.5, l3: 24, tdp: 45, pmax: 115, igpu: 'UHD (64 EU)', mem: 'DDR5-5200', msrp: null, m: 36, riv: 'Ryzen 7 7735HS' },
  { n: 'Core i9-13980HX', y: 2023, arch: 'raptorcove', code: 'Raptor Lake-HX', node: 'Intel 7', c: 8, e: 16, t: 32, b: 2.2, bo: 5.6, l2: 32, l3: 36, tdp: 55, pmax: 157, igpu: 'UHD (32 EU)', mem: 'DDR5-5600', pcie: '5.0', msrp: null, m: 76, riv: 'Ryzen 9 7945HX' },
  { n: 'Core i9-14900HX', y: 2024, arch: 'raptorcove', code: 'Raptor Lake-HX Refresh', node: 'Intel 7', c: 8, e: 16, t: 32, b: 2.2, bo: 5.8, l2: 32, l3: 36, tdp: 55, pmax: 157, igpu: 'UHD (32 EU)', mem: 'DDR5-5600', pcie: '5.0', msrp: null, m: 78, riv: 'Ryzen 9 7945HX', degr: true },
  { n: 'Core 5 120U', y: 2024, arch: 'raptorcove', code: 'Raptor Lake-U Refresh ("Core" serie 1)', node: 'Intel 7', c: 2, e: 8, t: 12, b: 1.4, bo: 5.0, l2: 6.5, l3: 12, tdp: 15, pmax: 55, igpu: 'Intel Graphics (80 EU)', mem: 'DDR5-5200', msrp: null, m: 22, riv: 'Ryzen 5 7530U', note: 'Trampa: "Core 5" sin "Ultra" es arquitectura antigua renombrada.' },
  { n: 'Core 7 150U', y: 2024, arch: 'raptorcove', code: 'Raptor Lake-U Refresh ("Core" serie 1)', node: 'Intel 7', c: 2, e: 8, t: 12, b: 1.8, bo: 5.4, l2: 6.5, l3: 12, tdp: 15, pmax: 55, igpu: 'Intel Graphics (96 EU)', mem: 'DDR5-5200', msrp: null, m: 23, riv: 'Ryzen 7 7730U' },
  { n: 'Core Ultra 7 155H', y: 2023, arch: 'redwood', code: 'Meteor Lake', node: 'Intel 4', c: 6, e: 8, lpe: 2, t: 22, b: 1.4, bo: 4.8, l2: 18, l3: 24, tdp: 28, pmax: 115, igpu: 'Arc (8 núcleos Xe)', mem: 'DDR5-5600 / LPDDR5X-7467', msrp: null, m: 42, riv: 'Ryzen 7 8845HS', note: 'Primer Core Ultra (serie 100). Incluye NPU.' },
  { n: 'Core Ultra 7 258V', y: 2024, arch: 'lioncove', code: 'Lunar Lake', node: 'TSMC N3B', c: 4, e: 0, lpe: 4, t: 8, b: 2.2, bo: 4.8, l2: 14, l3: 12, tdp: 17, pmax: 37, igpu: 'Arc 140V (8 núcleos Xe2)', mem: 'LPDDR5X-8533 en el encapsulado (32 GB, no ampliable)', ddr: ['LPDDR5X'], msrp: null, m: 25, riv: 'Ryzen AI 7 350', note: 'Serie 200V: la RAM va dentro del procesador. Mucha autonomía, poco multinúcleo.' },
  { n: 'Core Ultra 7 255H', y: 2025, arch: 'lioncove', code: 'Arrow Lake-H', node: 'TSMC N3B', c: 6, e: 8, lpe: 2, t: 16, b: 2.0, bo: 5.1, l2: 26, l3: 24, tdp: 28, pmax: 115, igpu: 'Arc 140T (8 núcleos Xe)', mem: 'DDR5-6400 / LPDDR5X-8400', msrp: null, m: 50, riv: 'Ryzen AI 9 365' },
  { n: 'Core Ultra 9 275HX', y: 2025, arch: 'lioncove', code: 'Arrow Lake-HX', node: 'TSMC N3B', c: 8, e: 16, t: 24, b: 2.7, bo: 5.4, l2: 40, l3: 36, tdp: 55, pmax: 160, igpu: 'Xe (4 núcleos)', mem: 'DDR5-6400', pcie: '5.0', msrp: null, m: 90, riv: 'Ryzen 9 9955HX3D' },
  { n: 'Core Ultra X9 388H', y: 2026, arch: 'cougar', code: 'Panther Lake', node: 'Intel 18A', c: 4, e: 8, lpe: 4, t: 16, b: 2.1, bo: 5.1, l2: 20, l3: 18, tdp: 25, pmax: 80, igpu: 'Arc B390 (12 núcleos Xe3)', mem: 'LPDDR5X-9600 / DDR5-7200', msrp: null, m: 58, riv: 'Ryzen AI 9 HX 470', conf: 'pv', note: 'Core Ultra serie 3 (300), enero de 2026. Primer chip fabricado en Intel 18A. Su gráfica integrada se acerca a una RTX 4050 de portátil según PCWorld. Consumo y base por verificar.' }
])
);

/* Identificador único y búsqueda rápida */
HW.slug = function (s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); };
HW.cpus.forEach(function (c) { c.id = 'cpu-' + HW.slug(c.n); c.kind = 'cpu'; if (c.e == null) c.e = 0; if (c.lpe == null) c.lpe = 0; });
