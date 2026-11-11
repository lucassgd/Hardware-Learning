/* =========================================================================
   DATOS · ARQUITECTURAS, ZÓCALOS, CHIPSETS Y PIEZAS PARA EL MONTADOR
   ipc: IPC relativo aproximado (Zen 1 = 100), sacado de las mejoras que publican
   AMD/Intel contrastadas con reseñas (TechPowerUp, Tom's Hardware). Orden de magnitud, no cifra exacta.
   ========================================================================= */
window.HW = window.HW || {};
HW.archs = {
  zen1:      { name: 'Zen', v: 'AMD', y: 2017, ipc: 100, gen: 1, note: 'La que resucitó a AMD. Latencia de memoria alta.' },
  zenplus:   { name: 'Zen+', v: 'AMD', y: 2018, ipc: 103, gen: 2, note: 'Zen pulido en 12 nm: +3 % IPC y algo más de frecuencia.' },
  zen2:      { name: 'Zen 2', v: 'AMD', y: 2019, ipc: 118, gen: 3, note: 'Chiplets y 7 nm. +15 % IPC y el doble de L3.' },
  zen3:      { name: 'Zen 3', v: 'AMD', y: 2020, ipc: 140, gen: 4, note: '+19 % IPC. 8 núcleos comparten la misma L3: gran salto en juegos.' },
  zen4:      { name: 'Zen 4', v: 'AMD', y: 2022, ipc: 154, gen: 5, note: '+13 % IPC, DDR5, PCIe 5.0 y AM5.' },
  zen5:      { name: 'Zen 5', v: 'AMD', y: 2024, ipc: 168, gen: 6, note: '+16 % IPC según AMD; en juegos la mejora real fue menor (~5 %).' },
  skylake:   { name: 'Skylake (Coffee/Comet Lake)', v: 'Intel', y: 2015, ipc: 107, gen: 1, note: 'Intel repitió esta arquitectura de 6.ª a 10.ª gen: subía núcleos y GHz, no IPC.' },
  cypress:   { name: 'Cypress Cove (Rocket Lake)', v: 'Intel', y: 2021, ipc: 125, gen: 2, note: 'Arquitectura nueva forzada en 14 nm: +19 % IPC pero gasta mucho.' },
  goldencove:{ name: 'Golden Cove + Gracemont (Alder Lake)', v: 'Intel', y: 2021, ipc: 145, gen: 3, note: 'Primeros núcleos híbridos P + E en sobremesa. Intel 7, DDR5 y PCIe 5.0.' },
  raptorcove:{ name: 'Raptor Cove (Raptor Lake)', v: 'Intel', y: 2022, ipc: 148, gen: 4, note: 'Alder Lake con más L2, más E-cores y más GHz. Problema de degradación (13.ª/14.ª).' },
  redwood:   { name: 'Redwood Cove (Meteor Lake)', v: 'Intel', y: 2023, ipc: 148, gen: 4, note: 'Solo portátiles. Primer diseño de Intel por "tiles".' },
  lioncove:  { name: 'Lion Cove + Skymont (Arrow/Lunar Lake)', v: 'Intel', y: 2024, ipc: 160, gen: 5, note: 'Sin Hyper-Threading. E-cores mucho mejores. Fabricado por TSMC. En juegos, latencia de memoria alta.' },
  cougar:    { name: 'Cougar Cove + Darkmont (Panther Lake)', v: 'Intel', y: 2026, ipc: 165, gen: 6, note: 'Primer chip en Intel 18A. De momento solo portátiles. IPC por verificar.' }
};

HW.sockets = [
  { id: 'AM4', v: 'AMD', from: 2017, to: 2022, ddr: 'DDR4', pins: 'PGA (pines en el procesador)', gens: 'Ryzen 1000, 2000, 3000, 4000G, 5000', note: 'Récord de vida: de un Ryzen 5 1600 a un 5800X3D en la misma placa (con BIOS). Ya no recibe arquitecturas nuevas.' },
  { id: 'AM5', v: 'AMD', from: 2022, to: 2027, ddr: 'DDR5', pins: 'LGA (pines en la placa)', gens: 'Ryzen 7000, 8000G, 9000 (y Zen 6, por verificar)', note: 'AMD prometió soporte "hasta 2027 o más". Los documentos apuntan a que Zen 6 (2027) seguirá en AM5; por verificar.' },
  { id: 'LGA1151 (v2)', v: 'Intel', from: 2017, to: 2019, ddr: 'DDR4', pins: 'LGA', gens: 'Core 8.ª y 9.ª gen', note: 'Mismo tamaño que el LGA1151 de 6.ª/7.ª, pero eléctricamente incompatible.' },
  { id: 'LGA1200', v: 'Intel', from: 2020, to: 2021, ddr: 'DDR4', pins: 'LGA', gens: 'Core 10.ª y 11.ª gen', note: 'Dos generaciones y fuera.' },
  { id: 'LGA1700', v: 'Intel', from: 2021, to: 2024, ddr: 'DDR4 o DDR5 (según placa)', pins: 'LGA', gens: 'Core 12.ª, 13.ª, 14.ª (y Core 5 120F)', note: 'Plataforma terminada: tu techo es un i9-14900K.' },
  { id: 'LGA1851', v: 'Intel', from: 2024, to: 2026, ddr: 'DDR5', pins: 'LGA', gens: 'Core Ultra 200S y 200S Plus', note: 'Plataforma corta: Nova Lake (Core Ultra 400) cambia de zócalo.' },
  { id: 'LGA1954', v: 'Intel', from: 2027, to: null, ddr: 'DDR5', pins: 'LGA', gens: 'Core Ultra 400 "Nova Lake" (por verificar)', note: 'Aún no ha salido (fecha de los datos: 11/11/2026). Intel dijo "finales de 2026"; las filtraciones apuntan al CES 2027. Chipsets serie 900.' }
];

/* Soporte de cada chipset por familia de CPU: ok · bios (necesita actualización) · no
   oc: overclock de CPU · moc: overclock de memoria / XMP-EXPO · gpu: PCIe de la ranura principal · m2: PCIe del M.2 principal */
HW.chipsets = [
  // AM4
  { id: 'A320', s: 'AM4', y: 2017, oc: false, moc: false, gpu: '3.0', m2: '3.0', ddr: ['DDR4'], tier: 1, sup: { zen1: 'ok', zen1apu: 'ok', zenplus: 'bios', zenplusapu: 'bios', zen2: 'bios', zen2apu: 'bios', zen3: 'bios', zen3apu: 'bios' }, note: 'Placas muy básicas. Sin overclock. Los Ryzen 5000 llegaron con BIOS beta a solo algunos modelos: comprueba la lista de CPU de tu placa.' },
  { id: 'B350', s: 'AM4', y: 2017, oc: true, moc: true, gpu: '3.0', m2: '3.0', ddr: ['DDR4'], tier: 2, sup: { zen1: 'ok', zen1apu: 'ok', zenplus: 'bios', zenplusapu: 'bios', zen2: 'bios', zen2apu: 'bios', zen3: 'bios', zen3apu: 'bios' }, note: 'Ryzen 5000 con BIOS de 2022 en la mayoría de modelos.' },
  { id: 'X370', s: 'AM4', y: 2017, oc: true, moc: true, gpu: '3.0', m2: '3.0', ddr: ['DDR4'], tier: 3, sup: { zen1: 'ok', zen1apu: 'ok', zenplus: 'bios', zenplusapu: 'bios', zen2: 'bios', zen2apu: 'bios', zen3: 'bios', zen3apu: 'bios' }, note: '' },
  { id: 'B450', s: 'AM4', y: 2018, oc: true, moc: true, gpu: '3.0', m2: '3.0', ddr: ['DDR4'], tier: 2, sup: { zen1: 'ok', zen1apu: 'ok', zenplus: 'ok', zenplusapu: 'ok', zen2: 'bios', zen2apu: 'bios', zen3: 'bios', zen3apu: 'bios' }, note: 'Muy común. Con BIOS acepta un 5800X3D, pero cuidado con el VRM de placas baratas con un 5950X.' },
  { id: 'X470', s: 'AM4', y: 2018, oc: true, moc: true, gpu: '3.0', m2: '3.0', ddr: ['DDR4'], tier: 3, sup: { zen1: 'ok', zen1apu: 'ok', zenplus: 'ok', zenplusapu: 'ok', zen2: 'bios', zen2apu: 'bios', zen3: 'bios', zen3apu: 'bios' }, note: '' },
  { id: 'A520', s: 'AM4', y: 2020, oc: false, moc: true, gpu: '3.0', m2: '3.0', ddr: ['DDR4'], tier: 1, sup: { zen1: 'no', zen1apu: 'no', zenplus: 'no', zenplusapu: 'no', zen2: 'ok', zen2apu: 'ok', zen3: 'ok', zen3apu: 'ok' }, note: 'Sin overclock de CPU, pero sí de memoria.' },
  { id: 'B550', s: 'AM4', y: 2020, oc: true, moc: true, gpu: '4.0', m2: '4.0', ddr: ['DDR4'], tier: 2, sup: { zen1: 'no', zen1apu: 'no', zenplus: 'no', zenplusapu: 'no', zen2: 'ok', zen2apu: 'ok', zen3: 'ok', zen3apu: 'ok' }, note: 'PCIe 4.0 solo con Ryzen 3000/5000 "no G". Con un 5600G/5700G baja a PCIe 3.0.' },
  { id: 'X570', s: 'AM4', y: 2019, oc: true, moc: true, gpu: '4.0', m2: '4.0', ddr: ['DDR4'], tier: 3, sup: { zen1: 'no', zen1apu: 'no', zenplus: 'ok', zenplusapu: 'ok', zen2: 'ok', zen2apu: 'ok', zen3: 'bios', zen3apu: 'bios' }, note: 'Las primeras traían ventilador en el chipset.' },
  // AM5
  { id: 'A620', s: 'AM5', y: 2023, oc: false, moc: true, gpu: '4.0', m2: '4.0', ddr: ['DDR5'], tier: 1, sup: { zen4: 'ok', zen4apu: 'ok', zen5: 'bios' }, note: 'Sin overclock. Muchas A620 tienen VRM justos: con CPU de 170 W (7950X, 9950X) pueden bajar el rendimiento. Mira la lista de CPU de la placa.' },
  { id: 'B650', s: 'AM5', y: 2022, oc: true, moc: true, gpu: '4.0', m2: '5.0 (algunas 4.0)', ddr: ['DDR5'], tier: 2, sup: { zen4: 'ok', zen4apu: 'bios', zen5: 'bios' }, note: 'La más equilibrada de AM5. Ryzen 9000 necesita BIOS AGESA 1.2 o posterior (las placas fabricadas desde 2024 ya la traen).' },
  { id: 'B650E', s: 'AM5', y: 2022, oc: true, moc: true, gpu: '5.0', m2: '5.0', ddr: ['DDR5'], tier: 2, sup: { zen4: 'ok', zen4apu: 'bios', zen5: 'bios' }, note: 'B650 con PCIe 5.0 también en la gráfica.' },
  { id: 'X670', s: 'AM5', y: 2022, oc: true, moc: true, gpu: '4.0', m2: '5.0', ddr: ['DDR5'], tier: 3, sup: { zen4: 'ok', zen4apu: 'bios', zen5: 'bios' }, note: 'Dos chips de chipset: más puertos y más M.2.' },
  { id: 'X670E', s: 'AM5', y: 2022, oc: true, moc: true, gpu: '5.0', m2: '5.0', ddr: ['DDR5'], tier: 4, sup: { zen4: 'ok', zen4apu: 'bios', zen5: 'bios' }, note: '' },
  { id: 'B840', s: 'AM5', y: 2025, oc: false, moc: true, gpu: '3.0', m2: '3.0', ddr: ['DDR5'], tier: 1, sup: { zen4: 'ok', zen4apu: 'ok', zen5: 'ok' }, note: 'Trampa: el nombre suena a "B850 barata", pero es PCIe 3.0 y sin overclock de CPU. Ojo con gráficas x8.' },
  { id: 'B850', s: 'AM5', y: 2025, oc: true, moc: true, gpu: '4.0 (5.0 opcional)', m2: '5.0', ddr: ['DDR5'], tier: 2, sup: { zen4: 'ok', zen4apu: 'ok', zen5: 'ok' }, note: 'Sucesora de B650 con M.2 PCIe 5.0 obligatorio.' },
  { id: 'X870', s: 'AM5', y: 2024, oc: true, moc: true, gpu: '5.0', m2: '5.0', ddr: ['DDR5'], tier: 3, sup: { zen4: 'ok', zen4apu: 'ok', zen5: 'ok' }, note: 'USB4 obligatorio.' },
  { id: 'X870E', s: 'AM5', y: 2024, oc: true, moc: true, gpu: '5.0', m2: '5.0', ddr: ['DDR5'], tier: 4, sup: { zen4: 'ok', zen4apu: 'ok', zen5: 'ok' }, note: 'Gama entusiasta.' },
  // LGA1151 v2
  { id: 'H310', s: 'LGA1151 (v2)', y: 2018, oc: false, moc: false, gpu: '3.0', m2: 'No suele tener', ddr: ['DDR4'], tier: 1, sup: { cfl: 'ok', cfr: 'bios' }, note: '' },
  { id: 'B360', s: 'LGA1151 (v2)', y: 2018, oc: false, moc: false, gpu: '3.0', m2: '3.0', ddr: ['DDR4'], tier: 2, sup: { cfl: 'ok', cfr: 'bios' }, note: 'En Intel, solo los chipset Z permiten overclock de CPU.' },
  { id: 'Z370', s: 'LGA1151 (v2)', y: 2017, oc: true, moc: true, gpu: '3.0', m2: '3.0', ddr: ['DDR4'], tier: 3, sup: { cfl: 'ok', cfr: 'bios' }, note: '' },
  { id: 'Z390', s: 'LGA1151 (v2)', y: 2018, oc: true, moc: true, gpu: '3.0', m2: '3.0', ddr: ['DDR4'], tier: 3, sup: { cfl: 'ok', cfr: 'ok' }, note: '' },
  // LGA1200
  { id: 'H410', s: 'LGA1200', y: 2020, oc: false, moc: false, gpu: '3.0', m2: 'Depende', ddr: ['DDR4'], tier: 1, sup: { cml: 'ok', rkl: 'no' }, note: 'No admite 11.ª generación.' },
  { id: 'B460', s: 'LGA1200', y: 2020, oc: false, moc: false, gpu: '3.0', m2: '3.0', ddr: ['DDR4'], tier: 2, sup: { cml: 'ok', rkl: 'no' }, note: 'No admite 11.ª generación.' },
  { id: 'Z490', s: 'LGA1200', y: 2020, oc: true, moc: true, gpu: '3.0 (4.0 con 11.ª en algunas)', m2: '3.0', ddr: ['DDR4'], tier: 3, sup: { cml: 'ok', rkl: 'bios' }, note: '' },
  { id: 'H510', s: 'LGA1200', y: 2021, oc: false, moc: false, gpu: '4.0 con 11.ª', m2: '3.0', ddr: ['DDR4'], tier: 1, sup: { cml: 'ok', rkl: 'ok' }, note: '' },
  { id: 'B560', s: 'LGA1200', y: 2021, oc: false, moc: true, gpu: '4.0 con 11.ª', m2: '4.0 con 11.ª', ddr: ['DDR4'], tier: 2, sup: { cml: 'ok', rkl: 'ok' }, note: 'Primera B de Intel con overclock de memoria.' },
  { id: 'Z590', s: 'LGA1200', y: 2021, oc: true, moc: true, gpu: '4.0 con 11.ª', m2: '4.0 con 11.ª', ddr: ['DDR4'], tier: 3, sup: { cml: 'ok', rkl: 'ok' }, note: '' },
  // LGA1700
  { id: 'H610', s: 'LGA1700', y: 2022, oc: false, moc: false, gpu: '4.0', m2: '4.0 (a veces 3.0)', ddr: ['DDR4', 'DDR5'], tier: 1, sup: { adl: 'ok', rpl: 'bios' }, note: 'La típica de PC de tienda barato. Sin overclock de memoria oficial: la RAM puede quedarse en la velocidad base aunque sea más rápida. VRM muy justos: no le pongas un i7/i9 K.' },
  { id: 'B660', s: 'LGA1700', y: 2022, oc: false, moc: true, gpu: '4.0 (5.0 en pocas)', m2: '4.0', ddr: ['DDR4', 'DDR5'], tier: 2, sup: { adl: 'ok', rpl: 'bios' }, note: 'Con BIOS acepta 13.ª/14.ª. El VRM decide si un i7 rinde al 100 %.' },
  { id: 'H670', s: 'LGA1700', y: 2022, oc: false, moc: true, gpu: '4.0', m2: '4.0', ddr: ['DDR4', 'DDR5'], tier: 2, sup: { adl: 'ok', rpl: 'bios' }, note: '' },
  { id: 'Z690', s: 'LGA1700', y: 2021, oc: true, moc: true, gpu: '5.0', m2: '4.0', ddr: ['DDR4', 'DDR5'], tier: 3, sup: { adl: 'ok', rpl: 'bios' }, note: '' },
  { id: 'B760', s: 'LGA1700', y: 2023, oc: false, moc: true, gpu: '4.0', m2: '4.0', ddr: ['DDR4', 'DDR5'], tier: 2, sup: { adl: 'ok', rpl: 'ok' }, note: 'Muy común. Revisa la BIOS por el microcódigo 0x12B si usas 13.ª/14.ª.' },
  { id: 'Z790', s: 'LGA1700', y: 2022, oc: true, moc: true, gpu: '5.0', m2: '4.0 (5.0 en algunas)', ddr: ['DDR4', 'DDR5'], tier: 3, sup: { adl: 'ok', rpl: 'ok' }, note: '' },
  // LGA1851
  { id: 'H810', s: 'LGA1851', y: 2025, oc: false, moc: false, gpu: '4.0', m2: '4.0', ddr: ['DDR5'], tier: 1, sup: { arl: 'ok', arlr: 'bios' }, note: '' },
  { id: 'B860', s: 'LGA1851', y: 2025, oc: false, moc: true, gpu: '5.0', m2: '4.0 (5.0 en algunas)', ddr: ['DDR5'], tier: 2, sup: { arl: 'ok', arlr: 'bios' }, note: 'Las 200S Plus necesitan BIOS actualizada.' },
  { id: 'Z890', s: 'LGA1851', y: 2024, oc: true, moc: true, gpu: '5.0', m2: '5.0', ddr: ['DDR5'], tier: 3, sup: { arl: 'ok', arlr: 'bios' }, note: '' }
];
HW.chipset = function (id) { return HW.chipsets.find(function (c) { return c.id === id; }); };

/* Familias que entran en cada zócalo (para "¿puedo cambiar…?") */
HW.platSocket = { zen1: 'AM4', zen1apu: 'AM4', zenplus: 'AM4', zenplusapu: 'AM4', zen2: 'AM4', zen2apu: 'AM4', zen3: 'AM4', zen3apu: 'AM4', zen4: 'AM5', zen4apu: 'AM5', zen5: 'AM5', cfl: 'LGA1151 (v2)', cfr: 'LGA1151 (v2)', cml: 'LGA1200', rkl: 'LGA1200', adl: 'LGA1700', rpl: 'LGA1700', arl: 'LGA1851', arlr: 'LGA1851' };

/* ---------- Piezas genéricas para el montador y el comprobador (precios orientativos en €, 11/2026) ---------- */
HW.PRICE_DATE = '11/2026';
HW.PRICE_NOTE = 'Precios orientativos de tienda española en noviembre de 2026. El mercado está muy alterado: la RAM DDR5 ha multiplicado su precio desde 2025 por la demanda de la IA (TrendForce, Team Group) y las gráficas también han subido. Compruébalos antes de comprar.';
HW.prices = {
  cpu: { 'Core i3-12100F': 75, 'Core i5-12400F': 100, 'Core i5-13400F': 150, 'Core i5-14400F': 160, 'Core i5-14600K': 220, 'Core i7-14700K': 330, 'Core i9-14900K': 450, 'Ryzen 5 5600': 95, 'Ryzen 7 5700X3D': 230, 'Ryzen 7 5800X3D': 330, 'Ryzen 5 7500F': 140, 'Ryzen 5 7600': 180, 'Ryzen 5 9600X': 210, 'Ryzen 7 7700': 250, 'Ryzen 7 9700X': 290, 'Ryzen 7 7800X3D': 380, 'Ryzen 7 9800X3D': 460, 'Ryzen 7 9850X3D': 510, 'Ryzen 9 9900X': 380, 'Ryzen 9 9950X': 560, 'Ryzen 9 9950X3D': 680, 'Ryzen 9 9950X3D2': 900, 'Core Ultra 5 225': 210, 'Core Ultra 5 245K': 250, 'Core Ultra 5 250K Plus': 220, 'Core Ultra 7 265K': 300, 'Core Ultra 7 270K Plus': 320, 'Core Ultra 9 285K': 560, 'Ryzen 5 8600G': 200, 'Ryzen 7 8700G': 290 },
  gpu: { 'Arc B570': 230, 'Arc B580': 290, 'RTX 5050': 270, 'RTX 5060': 330, 'RX 9060 XT 8GB': 320, 'RX 9060 XT 16GB': 420, 'RTX 5060 Ti 8GB': 410, 'RTX 5060 Ti 16GB': 500, 'RX 9070 GRE': 560, 'RTX 5070': 650, 'RX 9070': 640, 'RX 9070 XT': 760, 'RTX 5070 Ti': 950, 'RTX 5080': 1350, 'RTX 5090': 3300, 'RX 7600': 260, 'RTX 4060': 300 }
};
HW.boards = [
  { id: 'b-h610', n: 'Placa H610 DDR4 (Micro-ATX básica)', chip: 'H610', ddr: 'DDR4', ff: 'Micro-ATX', m2: 1, sata: 4, vrm: 1, price: 85, share: 'Un solo M.2. Sin overclock de memoria.' },
  { id: 'b-b760d4', n: 'Placa B760 DDR4 (Micro-ATX)', chip: 'B760', ddr: 'DDR4', ff: 'Micro-ATX', m2: 2, sata: 4, vrm: 2, price: 115, share: 'El 2.º M.2 suele ir por el chipset.' },
  { id: 'b-b760d5', n: 'Placa B760 DDR5 (ATX)', chip: 'B760', ddr: 'DDR5', ff: 'ATX', m2: 3, sata: 4, vrm: 2, price: 150, share: 'El M.2_3 puede desactivar el SATA_4 (mira el manual).' },
  { id: 'b-z790', n: 'Placa Z790 DDR5 (ATX)', chip: 'Z790', ddr: 'DDR5', ff: 'ATX', m2: 4, sata: 6, vrm: 3, price: 240, share: 'Usar el M.2 de PCIe 5.0 puede bajar la gráfica a x8 en algunos modelos.' },
  { id: 'b-b550', n: 'Placa B550 (ATX)', chip: 'B550', ddr: 'DDR4', ff: 'ATX', m2: 2, sata: 6, vrm: 2, price: 120, share: 'El M.2_2 comparte carriles con SATA 5/6 en muchos modelos.' },
  { id: 'b-a520', n: 'Placa A520 (Micro-ATX)', chip: 'A520', ddr: 'DDR4', ff: 'Micro-ATX', m2: 1, sata: 4, vrm: 1, price: 75, share: '' },
  { id: 'b-b450', n: 'Placa B450 (Micro-ATX)', chip: 'B450', ddr: 'DDR4', ff: 'Micro-ATX', m2: 1, sata: 4, vrm: 1, price: 70, share: 'Usar el M.2 SATA desactiva un puerto SATA.' },
  { id: 'b-a620', n: 'Placa A620 (Micro-ATX)', chip: 'A620', ddr: 'DDR5', ff: 'Micro-ATX', m2: 1, sata: 4, vrm: 1, price: 95, share: '' },
  { id: 'b-b840', n: 'Placa B840 (Micro-ATX)', chip: 'B840', ddr: 'DDR5', ff: 'Micro-ATX', m2: 1, sata: 4, vrm: 1, price: 100, share: 'PCIe 3.0 en gráfica y M.2.' },
  { id: 'b-b650', n: 'Placa B650 (ATX)', chip: 'B650', ddr: 'DDR5', ff: 'ATX', m2: 2, sata: 4, vrm: 2, price: 150, share: '' },
  { id: 'b-b850', n: 'Placa B850 (ATX)', chip: 'B850', ddr: 'DDR5', ff: 'ATX', m2: 3, sata: 4, vrm: 2, price: 185, share: 'En algunos modelos, el M.2_2 PCIe 5.0 baja la gráfica a x8.' },
  { id: 'b-b850itx', n: 'Placa B850 (Mini-ITX)', chip: 'B850', ddr: 'DDR5', ff: 'Mini-ITX', m2: 2, sata: 2, vrm: 2, price: 230, share: 'Solo 2 ranuras de RAM y un M.2 detrás de la placa.' },
  { id: 'b-x870', n: 'Placa X870 (ATX)', chip: 'X870', ddr: 'DDR5', ff: 'ATX', m2: 3, sata: 4, vrm: 3, price: 260, share: 'Usar el M.2_2 PCIe 5.0 suele bajar la gráfica a x8 (USB4 también comparte carriles).' },
  { id: 'b-b860', n: 'Placa B860 (ATX)', chip: 'B860', ddr: 'DDR5', ff: 'ATX', m2: 3, sata: 4, vrm: 2, price: 160, share: '' },
  { id: 'b-z890', n: 'Placa Z890 (ATX)', chip: 'Z890', ddr: 'DDR5', ff: 'ATX', m2: 4, sata: 4, vrm: 3, price: 260, share: 'El M.2 PCIe 5.0 de la CPU comparte carriles con la gráfica en algunos modelos.' }
];
HW.rams = [
  { id: 'r-d4-16', n: '16 GB (2×8) DDR4-3200 CL16', ddr: 'DDR4', gb: 16, mods: 2, mts: 3200, cl: 16, price: 90 },
  { id: 'r-d4-32', n: '32 GB (2×16) DDR4-3600 CL18', ddr: 'DDR4', gb: 32, mods: 2, mts: 3600, cl: 18, price: 170 },
  { id: 'r-d4-16s', n: '16 GB (1×16) DDR4-3200 CL22', ddr: 'DDR4', gb: 16, mods: 1, mts: 3200, cl: 22, price: 70 },
  { id: 'r-d5-16', n: '16 GB (2×8) DDR5-5600 CL40', ddr: 'DDR5', gb: 16, mods: 2, mts: 5600, cl: 40, price: 160 },
  { id: 'r-d5-32', n: '32 GB (2×16) DDR5-6000 CL30', ddr: 'DDR5', gb: 32, mods: 2, mts: 6000, cl: 30, price: 330 },
  { id: 'r-d5-64', n: '64 GB (2×32) DDR5-6000 CL30', ddr: 'DDR5', gb: 64, mods: 2, mts: 6000, cl: 30, price: 650 },
  { id: 'r-d5-32-72', n: '32 GB (2×16) DDR5-7200 CL34 (CUDIMM)', ddr: 'DDR5', gb: 32, mods: 2, mts: 7200, cl: 34, price: 400 }
];
HW.storages = [
  { id: 's-sata', n: 'SSD SATA 1 TB', type: 'SATA', iface: 'SATA III (≈550 MB/s)', price: 85, m2: false },
  { id: 's-g3', n: 'SSD NVMe PCIe 3.0 1 TB', type: 'NVMe 3.0', iface: '≈3.500 MB/s', price: 85, m2: true },
  { id: 's-g4', n: 'SSD NVMe PCIe 4.0 1 TB (con DRAM)', type: 'NVMe 4.0', iface: '≈7.000 MB/s', price: 115, m2: true },
  { id: 's-g4-2', n: 'SSD NVMe PCIe 4.0 2 TB', type: 'NVMe 4.0', iface: '≈7.000 MB/s', price: 200, m2: true },
  { id: 's-g5', n: 'SSD NVMe PCIe 5.0 2 TB', type: 'NVMe 5.0', iface: '≈14.000 MB/s', price: 320, m2: true },
  { id: 's-hdd', n: 'Disco duro (HDD) 4 TB', type: 'HDD', iface: '≈200 MB/s', price: 110, m2: false }
];
HW.psus = [
  { id: 'p-gen500', n: 'Fuente genérica "500 W" sin certificación fiable', w: 500, real: 300, tier: 'F', atx: '2.x', native: false, pcie8: 1, price: 25, note: 'Las cifras de la etiqueta suelen ser picos o mentira. No protege bien a tus piezas.' },
  { id: 'p-550b', n: '550 W 80 Plus Bronze de marca (gama de entrada)', w: 550, real: 550, tier: 'C', atx: '2.x', native: false, pcie8: 2, price: 55, note: '' },
  { id: 'p-650g', n: '650 W 80 Plus Gold ATX 3.1', w: 650, real: 650, tier: 'B', atx: '3.1', native: true, pcie8: 2, price: 85, note: '' },
  { id: 'p-750g', n: '750 W 80 Plus Gold ATX 3.1 (12V-2x6 nativo)', w: 750, real: 750, tier: 'A', atx: '3.1', native: true, pcie8: 3, price: 105, note: '' },
  { id: 'p-850g', n: '850 W 80 Plus Gold ATX 3.1 (12V-2x6 nativo)', w: 850, real: 850, tier: 'A', atx: '3.1', native: true, pcie8: 4, price: 130, note: '' },
  { id: 'p-1000g', n: '1000 W 80 Plus Gold/Platinum ATX 3.1', w: 1000, real: 1000, tier: 'A', atx: '3.1', native: true, pcie8: 4, price: 180, note: '' },
  { id: 'p-1200p', n: '1200 W 80 Plus Platinum ATX 3.1', w: 1200, real: 1200, tier: 'A', atx: '3.1', native: true, pcie8: 6, price: 260, note: '' }
];
HW.cases = [
  { id: 'c-mini', n: 'Caja Mini-ITX compacta', ff: ['Mini-ITX'], gpuMax: 320, coolerMax: 70, rad: 240, air: 2, price: 110 },
  { id: 'c-matx', n: 'Caja Micro-ATX de tienda (frontal cerrado)', ff: ['Micro-ATX', 'Mini-ITX'], gpuMax: 280, coolerMax: 150, rad: 120, air: 1, price: 45 },
  { id: 'c-matx-m', n: 'Caja Micro-ATX con frontal de malla', ff: ['Micro-ATX', 'Mini-ITX'], gpuMax: 340, coolerMax: 165, rad: 240, air: 3, price: 65 },
  { id: 'c-atx', n: 'Caja ATX media torre con frontal de malla', ff: ['ATX', 'Micro-ATX', 'Mini-ITX'], gpuMax: 380, coolerMax: 170, rad: 360, air: 3, price: 90 },
  { id: 'c-atx-big', n: 'Caja ATX grande (flujo alto)', ff: ['E-ATX', 'ATX', 'Micro-ATX', 'Mini-ITX'], gpuMax: 420, coolerMax: 185, rad: 420, air: 3, price: 150 }
];
HW.coolers = [
  { id: 'k-stock', n: 'Disipador de serie (Intel Laminar / AMD Wraith)', h: 60, w: 95, type: 'aire', price: 0 },
  { id: 'k-low', n: 'Disipador de perfil bajo (≈ 47 mm)', h: 47, w: 100, type: 'aire', price: 45 },
  { id: 'k-tower', n: 'Torre de 1 ventilador (≈ 155 mm)', h: 155, w: 200, type: 'aire', price: 35 },
  { id: 'k-dual', n: 'Torre doble (≈ 160 mm)', h: 160, w: 260, type: 'aire', price: 70 },
  { id: 'k-aio240', n: 'Líquida AIO de 240 mm', h: 55, w: 250, type: 'aio', rad: 240, price: 90 },
  { id: 'k-aio360', n: 'Líquida AIO de 360 mm', h: 55, w: 300, type: 'aio', rad: 360, price: 120 }
];

/* Mi PC (caso práctico). Lo que no sé lo marco como desconocido. */
HW.myPcDefault = { cpu: 'Core i5-12400F', gpu: 'GTX 1660 SUPER', ram: '16 GB DDR4 (módulos: no lo sé)', ddr: 'DDR4', ramGb: 16, ramMods: 0, storage: 'SSD 512 GB', board: 'desconocida', chip: '', psuW: 0, os: 'Windows 11' };

/* Línea de tiempo por marca para el catálogo */
HW.timeline = {
  AMD: [
    { y: 2017, t: 'Ryzen 1000', s: 'AM4', a: 'Zen' }, { y: 2018, t: 'Ryzen 2000', s: 'AM4', a: 'Zen+' }, { y: 2019, t: 'Ryzen 3000', s: 'AM4', a: 'Zen 2' },
    { y: 2020, t: 'Ryzen 5000', s: 'AM4', a: 'Zen 3' }, { y: 2022, t: '5800X3D', s: 'AM4', a: 'Zen 3 + V-Cache' }, { y: 2022.8, t: 'Ryzen 7000', s: 'AM5', a: 'Zen 4' },
    { y: 2024, t: '8000G', s: 'AM5', a: 'Zen 4 APU' }, { y: 2024.6, t: 'Ryzen 9000', s: 'AM5', a: 'Zen 5' }, { y: 2026, t: '9850X3D / X3D2', s: 'AM5', a: 'Zen 5 + V-Cache' }, { y: 2027, t: 'Zen 6 (por verificar)', s: 'AM5', a: 'Zen 6', future: true }
  ],
  Intel: [
    { y: 2017.8, t: '8.ª gen', s: '1151 v2', a: 'Coffee Lake' }, { y: 2018.8, t: '9.ª gen', s: '1151 v2', a: 'Coffee Lake R' }, { y: 2020.3, t: '10.ª gen', s: '1200', a: 'Comet Lake' },
    { y: 2021.2, t: '11.ª gen', s: '1200', a: 'Rocket Lake' }, { y: 2021.85, t: '12.ª gen', s: '1700', a: 'Alder Lake' }, { y: 2022.8, t: '13.ª gen', s: '1700', a: 'Raptor Lake' },
    { y: 2023.8, t: '14.ª gen', s: '1700', a: 'Raptor Lake R' }, { y: 2024.8, t: 'Core Ultra 200S', s: '1851', a: 'Arrow Lake' }, { y: 2026.2, t: '200S Plus', s: '1851', a: 'Arrow Lake R' }, { y: 2027, t: 'Core Ultra 400 (por verificar)', s: '1954', a: 'Nova Lake', future: true }
  ],
  NVIDIA: [
    { y: 2016.4, t: 'GTX 10', s: 'PCIe 3.0', a: 'Pascal' }, { y: 2018.7, t: 'RTX 20', s: 'PCIe 3.0', a: 'Turing' }, { y: 2019.2, t: 'GTX 16', s: 'PCIe 3.0', a: 'Turing sin RT' },
    { y: 2020.7, t: 'RTX 30', s: 'PCIe 4.0', a: 'Ampere' }, { y: 2022.8, t: 'RTX 40', s: 'PCIe 4.0', a: 'Ada' }, { y: 2025.1, t: 'RTX 50', s: 'PCIe 5.0', a: 'Blackwell' }, { y: 2027, t: 'RTX 50 SUPER / RTX 60 (sin confirmar)', s: '', a: '', future: true }
  ],
  'AMD GPU': [
    { y: 2019.5, t: 'RX 5000', s: 'PCIe 4.0', a: 'RDNA 1' }, { y: 2020.9, t: 'RX 6000', s: 'PCIe 4.0', a: 'RDNA 2' }, { y: 2022.95, t: 'RX 7000', s: 'PCIe 4.0', a: 'RDNA 3' }, { y: 2025.2, t: 'RX 9000', s: 'PCIe 5.0', a: 'RDNA 4' }
  ],
  'Intel Arc': [ { y: 2022.6, t: 'Arc A', s: 'PCIe 4.0', a: 'Alchemist' }, { y: 2024.95, t: 'Arc B', s: 'PCIe 4.0 x8', a: 'Battlemage' } ]
};
