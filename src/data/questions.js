/* =========================================================================
   DATOS · PREGUNTAS EXTRA PARA PRACTICAR (además de las de cada lección)
   l: lección a la que pertenece (sirve de tema) · lvl: nivel
   ========================================================================= */
window.HW = window.HW || {};
HW.questions = [
  { l: 'a', lvl: 'Básico', q: 'El jefe de cocina de la analogía es…', o: ['La GPU', 'La CPU', 'La RAM', 'La fuente'], a: 1, x: 'CPU = jefe de cocina; núcleos = chefs.' },
  { l: 'a', lvl: 'Básico', q: 'Al cargar un nivel, los datos pasan primero de…', o: ['La VRAM a la RAM', 'El SSD a la RAM', 'La GPU a la CPU', 'El monitor a la GPU'], a: 1, x: 'De la despensa a la encimera.' },
  { l: 'a', lvl: 'Intermedio', q: 'Windows se queda sin RAM. ¿Qué usa?', o: ['La VRAM', 'El archivo de paginación en el SSD', 'La caché L3', 'Nada, se apaga'], a: 1, x: 'El pagefile: lento pero evita cierres.' },
  { l: 'b', lvl: 'Intermedio', q: 'Rendimiento por núcleo ≈ …', o: ['Núcleos × hilos', 'IPC × GHz', 'Caché × TDP', 'nm × GHz'], a: 1, x: 'IPC (experiencia) por velocidad de manos.' },
  { l: 'b', lvl: 'Intermedio', q: '¿Cuántos núcleos aprovechan bien la mayoría de juegos de 2026?', o: ['2', '6-8', '16', '32'], a: 1, x: 'Más allá de 8 el beneficio es pequeño.' },
  { l: 'b', lvl: 'Avanzado', q: 'El PPT de un Ryzen con TDP de 120 W es aproximadamente…', o: ['120 W', '162 W', '230 W', '65 W'], a: 1, x: 'PPT ≈ 1,35 × TDP.' },
  { l: 'b', lvl: 'Avanzado', q: '¿Qué Ryzen lleva 3D V-Cache en los dos chiplets?', o: ['7950X3D', '9950X3D', '9950X3D2', '9800X3D'], a: 2, x: 'El 9950X3D2 (abril de 2026) es el primero.' },
  { l: 'b', lvl: 'Experto', q: '¿Por qué el 9800X3D sube más de frecuencia que el 7800X3D?', o: ['Por el nodo de 3 nm', 'Porque la caché va debajo de los núcleos y disipan mejor', 'Por tener más núcleos', 'Por usar DDR4'], a: 1, x: 'La 2.ª generación de 3D V-Cache pone la caché debajo.' },
  { l: 'b', lvl: 'Experto', q: 'Los Core Ultra 200S no tienen…', o: ['E-cores', 'Hyper-Threading', 'Caché L3', 'PCIe 5.0'], a: 1, x: 'Arrow Lake eliminó el Hyper-Threading.' },
  { l: 'c', lvl: 'Básico', q: 'Sufijo K en Intel:', o: ['Sin gráfica', 'Desbloqueado para overclock', 'Portátil', 'Bajo consumo'], a: 1, x: 'K = desbloqueado.' },
  { l: 'c', lvl: 'Básico', q: 'Ryzen 5 7600 frente a Ryzen 5 7600X:', o: ['Distinta arquitectura', 'La X tiene más GHz y consumo; misma arquitectura', 'La X no tiene gráfica', 'La X es de portátil'], a: 1, x: 'X = más frecuencia.' },
  { l: 'c', lvl: 'Intermedio', q: '¿A qué generación pertenece un Core Ultra 7 265K?', o: ['Meteor Lake', 'Arrow Lake (200S)', 'Raptor Lake', 'Panther Lake'], a: 1, x: 'Serie 2, sobremesa S: Arrow Lake.' },
  { l: 'c', lvl: 'Intermedio', q: 'Ryzen 7 7840U frente a Ryzen 5 7520U: ¿cuál es Zen 4?', o: ['7520U', '7840U', 'Los dos', 'Ninguno'], a: 1, x: 'Tercer dígito 4 = Zen 4; 2 = Zen 2.' },
  { l: 'c', lvl: 'Avanzado', q: 'Un Ryzen 5 3400G usa la arquitectura…', o: ['Zen 2', 'Zen+', 'Zen 3', 'Zen 4'], a: 1, x: 'Las APU 3000G son Zen+.' },
  { l: 'c', lvl: 'Avanzado', q: 'Core Ultra 7 270K Plus pertenece a…', o: ['Nova Lake', 'Arrow Lake Refresh (200S Plus)', 'Raptor Lake', 'Lunar Lake'], a: 1, x: 'Marzo de 2026, LGA1851.' },
  { l: 'd', lvl: 'Intermedio', q: '¿Qué fuente consultarías para ver la ficha completa con el nombre en clave?', o: ['UserBenchmark', 'Base de datos de TechPowerUp', 'Un foro', 'Instagram'], a: 1, x: 'TechPowerUp, Intel ARK o amd.com.' },
  { l: 'e', lvl: 'Básico', q: 'RTX frente a GTX:', o: ['RTX tiene núcleos RT y Tensor (DLSS)', 'GTX es más nueva', 'Son iguales', 'GTX tiene más VRAM'], a: 0, x: 'RTX = trazado de rayos y DLSS.' },
  { l: 'e', lvl: 'Intermedio', q: 'Ancho de banda de 128 bits a 28 Gbps:', o: ['128 GB/s', '448 GB/s', '896 GB/s', '28 GB/s'], a: 1, x: '128 × 28 / 8 = 448 GB/s.' },
  { l: 'e', lvl: 'Intermedio', q: 'FSR 4 funciona en…', o: ['Todas las gráficas', 'Solo RX 9000 (oficialmente)', 'Solo NVIDIA', 'Solo Intel'], a: 1, x: 'Necesita los aceleradores de IA de RDNA 4.' },
  { l: 'e', lvl: 'Avanzado', q: 'Multi Frame Generation (×4) existe en…', o: ['RTX 30', 'RTX 40', 'RTX 50', 'GTX 16'], a: 2, x: 'Exclusivo de Blackwell (RTX 50).' },
  { l: 'e', lvl: 'Avanzado', q: 'La RTX 5060 Ti usa la ranura en modo…', o: ['x16', 'x8', 'x4', 'x1'], a: 1, x: 'PCIe 5.0 x8.' },
  { l: 'e', lvl: 'Experto', q: 'A 11/2026, ¿han salido las RTX 50 SUPER?', o: ['Sí, en 2025', 'No; se retrasaron por la escasez de GDDR7', 'Sí, en 2026', 'Se llaman RTX 60'], a: 1, x: 'No han salido; hay informaciones de retraso o cancelación (por verificar).' },
  { l: 'e', lvl: 'Experto', q: '¿Por qué la RX 6950 XT con bus de 256 bits competía con la RTX 3090 de 384 bits?', o: ['Por usar GDDR7', 'Por sus 128 MB de Infinity Cache', 'Por tener más VRAM', 'Por ser PCIe 5.0'], a: 1, x: 'La caché grande compensa el bus.' },
  { l: 'f', lvl: 'Intermedio', q: '¿Puedes poner un Ryzen 7 9800X3D en una placa B450?', o: ['Sí, con BIOS', 'No: B450 es AM4 y el 9800X3D es AM5', 'Sí, sin nada', 'Solo con DDR5'], a: 1, x: 'Zócalos distintos.' },
  { l: 'f', lvl: 'Avanzado', q: 'B840 es…', o: ['Una B850 mejor', 'Un chipset AM5 básico con PCIe 3.0 y sin OC de CPU', 'Un chipset Intel', 'Un X870 barato'], a: 1, x: 'Trampa de nombre.' },
  { l: 'f', lvl: 'Avanzado', q: 'En la notación de VRM 16+2+1, el 16 es…', o: ['Fases para la RAM', 'Fases para los núcleos (Vcore)', 'Puertos USB', 'Ranuras M.2'], a: 1, x: 'Vcore + SoC/GT + auxiliar.' },
  { l: 'g', lvl: 'Intermedio', q: 'DDR5-6000 CL30 tiene una latencia real de…', o: ['30 ns', '10 ns', '6 ns', '20 ns'], a: 1, x: '30 × 2000 / 6000 = 10 ns.' },
  { l: 'g', lvl: 'Avanzado', q: '¿Por qué en AM5 no compensa DDR5-8000 frente a 6000 CL30?', o: ['Porque no existe', 'Porque rompe la relación 1:1 con la controladora', 'Porque gasta más', 'Porque es DDR4'], a: 1, x: 'Por encima de ≈6000-6400 se pasa a 2:1.' },
  { l: 'h', lvl: 'Básico', q: 'Un HDD es adecuado para…', o: ['Juegos modernos', 'Fotos, vídeos y copias de seguridad', 'Windows', 'Pagefile'], a: 1, x: 'Almacén grande y lento.' },
  { l: 'i', lvl: 'Intermedio', q: 'RTX 5070 (250 W) + i5-12400F (117 W). Fuente recomendada:', o: ['450 W', '650 W', '1200 W', '300 W'], a: 1, x: '117 + 250 + 100 ≈ 467 W × 1,3 ≈ 600-650 W. NVIDIA recomienda 650 W.' },
  { l: 'i', lvl: 'Avanzado', q: 'La norma que exige aguantar picos del 200 % durante 100 µs es…', o: ['80 Plus', 'ATX 3.0 / 3.1', 'SATA III', 'PCIe 3.0'], a: 1, x: 'ATX 3.x.' },
  { l: 'i', lvl: 'Avanzado', q: 'OCP significa protección contra…', o: ['Sobretensión', 'Sobrecorriente', 'Sobretemperatura', 'Cortocircuito'], a: 1, x: 'Over Current Protection.' },
  { l: 'j', lvl: 'Básico', q: 'Cantidad de pasta térmica:', o: ['Toda la jeringa', 'Un guisante en el centro', 'Nada', 'Una capa de 2 mm'], a: 1, x: 'La presión la reparte.' },
  { l: 'k', lvl: 'Básico', q: 'Antes de comprar gráfica hay que mirar de la caja…', o: ['El color', 'La longitud máxima de gráfica', 'El peso', 'La marca'], a: 1, x: 'En mm.' },
  { l: 'l', lvl: 'Intermedio', q: 'El cabezal de 19 pines azul es…', o: ['USB 2.0', 'USB 3.0 frontal', 'HD_AUDIO', 'ARGB'], a: 1, x: 'USB 3.0 interno.' },
  { l: 'l', lvl: 'Avanzado', q: 'Una gráfica de 300 W con dos conectores 8 pines. ¿Cómo la conectas?', o: ['Con un solo cable con dos conectores en cadena siempre', 'Mejor con dos cables PCIe separados', 'Con un SATA', 'Con el EPS'], a: 1, x: 'Reparte la carga entre cables.' },
  { l: 'm', lvl: 'Avanzado', q: 'Luz de diagnóstico "DRAM" encendida:', o: ['Problema de RAM: encaje, ranura o compatibilidad', 'La gráfica', 'El SSD', 'El monitor'], a: 0, x: 'Revisa la memoria.' },
  { l: 'n', lvl: 'Avanzado', q: 'Para detectar cuello de botella de CPU, ¿qué miras?', o: ['El uso de la GPU por debajo del 90 %', 'La temperatura del SSD', 'La velocidad del ratón', 'El RGB'], a: 0, x: 'Si la GPU no va a tope, espera a la CPU (u otro límite).' },
  { l: 'o', lvl: 'Avanzado', q: '¿Qué mejora es menos útil para FPS en tu PC?', o: ['Gráfica', 'Doble canal', 'SSD PCIe 5.0', 'Ninguna'], a: 2, x: 'El SSD no da FPS.' },
  { l: 'p', lvl: 'Experto', q: 'Una gráfica de minería…', o: ['Siempre está rota', 'Puede estar bien, pero revisa ventiladores, pads y precio', 'Es mejor que una nueva', 'No se puede usar para jugar'], a: 1, x: 'Pide pruebas y precio acorde.' },
  { l: 'q', lvl: 'Experto', q: 'Los tres grandes fabricantes de DRAM son…', o: ['Intel, AMD y NVIDIA', 'Samsung, SK Hynix y Micron', 'TSMC, ASML y SMIC', 'Corsair, Kingston y G.Skill'], a: 1, x: 'Corsair y compañía montan módulos con chips de estos tres.' },
  { l: 'q', lvl: 'Experto', q: 'Rapidus es…', o: ['Una marca de RAM', 'Una fundición japonesa que prepara 2 nm', 'Una gráfica', 'Un chipset'], a: 1, x: 'Proyecto japonés de fabricación avanzada.' },
  { l: 'r', lvl: 'Avanzado', q: 'Sufijo HX en un procesador de portátil:', o: ['Ultrafino', 'El más potente, casi de sobremesa', 'Sin gráfica', 'Chromebook'], a: 1, x: '55 W o más.' }
];

/* Ordenar por generación: grupos de modelos con su año (para el juego de arrastrar) */
HW.orderSets = [
  { t: 'Procesadores AMD de sobremesa', items: [ ['Ryzen 7 1700', 2017], ['Ryzen 7 2700X', 2018], ['Ryzen 7 3700X', 2019], ['Ryzen 7 5800X', 2020], ['Ryzen 7 7700X', 2022], ['Ryzen 7 9700X', 2024] ] },
  { t: 'Procesadores Intel de sobremesa', items: [ ['Core i7-8700K', 2017], ['Core i9-9900K', 2018], ['Core i9-10900K', 2020], ['Core i9-11900K', 2021], ['Core i9-12900K', 2021.9], ['Core i9-13900K', 2022.8], ['Core Ultra 9 285K', 2024.8] ] },
  { t: 'Gráficas NVIDIA', items: [ ['GTX 1070', 2016], ['RTX 2070', 2018], ['GTX 1660 SUPER', 2019], ['RTX 3070', 2020], ['RTX 4070', 2023], ['RTX 5070', 2025] ] },
  { t: 'Gráficas AMD', items: [ ['RX 5700 XT', 2019], ['RX 6700 XT', 2021], ['RX 7800 XT', 2023], ['RX 9070 XT', 2025] ] },
  { t: 'Los X3D de AMD', items: [ ['Ryzen 7 5800X3D', 2022.3], ['Ryzen 7 7800X3D', 2023.3], ['Ryzen 7 5700X3D', 2024.0], ['Ryzen 7 9800X3D', 2024.85], ['Ryzen 9 9950X3D', 2025.2], ['Ryzen 7 9850X3D', 2026.1], ['Ryzen 9 9950X3D2', 2026.3] ] },
  { t: 'Zócalos', items: [ ['LGA1151 (v2)', 2017.8], ['AM4', 2017], ['LGA1200', 2020], ['LGA1700', 2021.9], ['AM5', 2022.7], ['LGA1851', 2024.8] ] }
];
