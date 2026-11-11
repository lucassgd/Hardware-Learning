/* =========================================================================
   DATOS · TARJETAS GRÁFICAS
   Campos: n nombre · y año · arch · code chip · node · vram GB · vt tipo · bus bits · bw GB/s
   sh shaders (CUDA / Stream Processors / unidades Xe×128) · rt generación RT (0 = no tiene)
   ai núcleos de IA (texto) · tbp W · conn conector de corriente · psu W recomendada por el fabricante
   lanes 16/8/4 · pcie versión · up escalado y generación de fotogramas que admite
   p índice de rendimiento a 1440p (RTX 5090 = 100) recopilado de forma aproximada de las tablas de
     "rendimiento relativo" de TechPowerUp y de Hardware Unboxed. 1080p y 4K se estiman en la lógica.
   len longitud típica en mm (varía mucho según el modelo de cada marca; mira el tuyo)
   msrp precio de salida en USD · conf 'rev' / 'est' / 'pv'
   ========================================================================= */
window.HW = window.HW || {};
HW.gpus = [].concat(
/* ---------------- NVIDIA ---------------- */
HW.fam({ brand: 'NVIDIA', y: 2016, arch: 'Pascal', node: 'TSMC 16 nm', rt: 0, ai: 'No', pcie: '3.0', lanes: 16, up: 'Sin DLSS. Puede usar FSR 1-3 y XeSS (modo genérico).', conf: 'est' }, [
  { n: 'GTX 1080 Ti', y: 2017, code: 'GP102', vram: 11, vt: 'GDDR5X', bus: 352, bw: 484, sh: 3584, tbp: 250, conn: '8 + 6 pines', psu: 600, len: 270, msrp: 699, p: 20, riv: 'RX Vega 64' },
  { n: 'GTX 1080', code: 'GP104', vram: 8, vt: 'GDDR5X', bus: 256, bw: 320, sh: 2560, tbp: 180, conn: '1 × 8 pines', psu: 500, len: 267, msrp: 599, p: 15, riv: 'RX Vega 64' },
  { n: 'GTX 1070 Ti', y: 2017, code: 'GP104', vram: 8, vt: 'GDDR5', bus: 256, bw: 256, sh: 2432, tbp: 180, conn: '1 × 8 pines', psu: 500, len: 267, msrp: 449, p: 14, riv: 'RX Vega 56' },
  { n: 'GTX 1070', code: 'GP104', vram: 8, vt: 'GDDR5', bus: 256, bw: 256, sh: 1920, tbp: 150, conn: '1 × 8 pines', psu: 500, len: 267, msrp: 379, p: 12.5, riv: 'RX Vega 56' },
  { n: 'GTX 1060 6GB', code: 'GP106', vram: 6, vt: 'GDDR5', bus: 192, bw: 192, sh: 1280, tbp: 120, conn: '1 × 6 pines', psu: 400, len: 250, msrp: 249, p: 9, riv: 'RX 580' },
  { n: 'GTX 1060 3GB', code: 'GP106', vram: 3, vt: 'GDDR5', bus: 192, bw: 192, sh: 1152, tbp: 120, conn: '1 × 6 pines', psu: 400, len: 250, msrp: 199, p: 8, riv: 'RX 570' },
  { n: 'GTX 1050 Ti', node: 'Samsung 14 nm', code: 'GP107', vram: 4, vt: 'GDDR5', bus: 128, bw: 112, sh: 768, tbp: 75, conn: 'Ninguno (75 W por la ranura)', psu: 300, len: 190, msrp: 139, p: 5, riv: 'RX 560' },
  { n: 'GTX 1050', node: 'Samsung 14 nm', code: 'GP107', vram: 2, vt: 'GDDR5', bus: 128, bw: 112, sh: 640, tbp: 75, conn: 'Ninguno', psu: 300, len: 190, msrp: 109, p: 3.8, riv: 'RX 560' },
  { n: 'GT 1030', y: 2017, node: 'Samsung 14 nm', code: 'GP108', vram: 2, vt: 'GDDR5', bus: 64, bw: 48, sh: 384, tbp: 30, conn: 'Ninguno', psu: 300, len: 150, msrp: 79, lanes: 4, p: 2, riv: 'RX 550', note: 'Solo sirve para dar imagen. Existe una versión DDR4 aún peor.' }
]),
HW.fam({ brand: 'NVIDIA', y: 2019, arch: 'Turing (sin RT)', node: 'TSMC 12 nm', rt: 0, ai: 'No', pcie: '3.0', lanes: 16, up: 'Sin DLSS. FSR 1-3 y XeSS (modo genérico). FSR 3 Frame Generation funciona.', conf: 'rev' }, [
  { n: 'GTX 1660 Ti', code: 'TU116', vram: 6, vt: 'GDDR6', bus: 192, bw: 288, sh: 1536, tbp: 120, conn: '1 × 8 pines', psu: 450, len: 230, msrp: 279, p: 12.5, riv: 'RX 5600 XT' },
  { n: 'GTX 1660 SUPER', code: 'TU116', vram: 6, vt: 'GDDR6', bus: 192, bw: 336, sh: 1408, tbp: 125, conn: '1 × 8 pines', psu: 450, len: 230, msrp: 229, p: 12, riv: 'RX 5500 XT 8GB', mine: true, note: 'Tu gráfica. Rinde casi como la 1660 Ti gracias a su memoria GDDR6 rápida. 6 GB se quedan cortos en juegos de 2024-2026.' },
  { n: 'GTX 1660', code: 'TU116', vram: 6, vt: 'GDDR5', bus: 192, bw: 192, sh: 1408, tbp: 120, conn: '1 × 8 pines', psu: 450, len: 230, msrp: 219, p: 11, riv: 'RX 590' },
  { n: 'GTX 1650 SUPER', code: 'TU116', vram: 4, vt: 'GDDR6', bus: 128, bw: 192, sh: 1280, tbp: 100, conn: '1 × 6 pines', psu: 350, len: 200, msrp: 159, p: 9, riv: 'RX 5500 XT 4GB' },
  { n: 'GTX 1650', code: 'TU117', vram: 4, vt: 'GDDR5 / GDDR6', bus: 128, bw: 128, sh: 896, tbp: 75, conn: 'Ninguno (la mayoría)', psu: 300, len: 170, msrp: 149, p: 7, riv: 'RX 570' }
]),
HW.fam({ brand: 'NVIDIA', y: 2018, arch: 'Turing', node: 'TSMC 12 nm', rt: 1, ai: 'Tensor 2.ª gen', pcie: '3.0', lanes: 16, up: 'DLSS 4 (superresolución con modelo transformer). Sin generación de fotogramas de NVIDIA.', conf: 'rev' }, [
  { n: 'RTX 2080 Ti', code: 'TU102', vram: 11, vt: 'GDDR6', bus: 352, bw: 616, sh: 4352, tbp: 250, conn: '2 × 8 pines', psu: 650, len: 270, msrp: 999, p: 28.5, riv: 'Radeon VII' },
  { n: 'RTX 2080 SUPER', y: 2019, code: 'TU104', vram: 8, vt: 'GDDR6', bus: 256, bw: 496, sh: 3072, tbp: 250, conn: '8 + 6 pines', psu: 650, len: 267, msrp: 699, p: 23, riv: 'RX 5700 XT' },
  { n: 'RTX 2080', code: 'TU104', vram: 8, vt: 'GDDR6', bus: 256, bw: 448, sh: 2944, tbp: 215, conn: '8 + 6 pines', psu: 650, len: 267, msrp: 699, p: 22, riv: 'RX Vega 64' },
  { n: 'RTX 2070 SUPER', y: 2019, code: 'TU104', vram: 8, vt: 'GDDR6', bus: 256, bw: 448, sh: 2560, tbp: 215, conn: '8 + 6 pines', psu: 650, len: 267, msrp: 499, p: 21, riv: 'RX 5700 XT' },
  { n: 'RTX 2070', code: 'TU106', vram: 8, vt: 'GDDR6', bus: 256, bw: 448, sh: 2304, tbp: 175, conn: '1 × 8 pines', psu: 550, len: 267, msrp: 499, p: 18.5, riv: 'RX 5700' },
  { n: 'RTX 2060 SUPER', y: 2019, code: 'TU106', vram: 8, vt: 'GDDR6', bus: 256, bw: 448, sh: 2176, tbp: 175, conn: '1 × 8 pines', psu: 550, len: 230, msrp: 399, p: 17, riv: 'RX 5700' },
  { n: 'RTX 2060 12GB', y: 2021, code: 'TU106', vram: 12, vt: 'GDDR6', bus: 192, bw: 336, sh: 2176, tbp: 184, conn: '1 × 8 pines', psu: 550, len: 230, msrp: null, p: 16, riv: 'RX 6600' },
  { n: 'RTX 2060', y: 2019, code: 'TU106', vram: 6, vt: 'GDDR6', bus: 192, bw: 336, sh: 1920, tbp: 160, conn: '1 × 8 pines', psu: 500, len: 230, msrp: 349, p: 15, riv: 'RX 5600 XT' }
]),
HW.fam({ brand: 'NVIDIA', y: 2020, arch: 'Ampere', node: 'Samsung 8 nm', rt: 2, ai: 'Tensor 3.ª gen', pcie: '4.0', lanes: 16, up: 'DLSS 4 (superresolución con modelo transformer). Sin Frame Generation de NVIDIA (sí con FSR 3).', conf: 'rev' }, [
  { n: 'RTX 3090 Ti', y: 2022, code: 'GA102', vram: 24, vt: 'GDDR6X', bus: 384, bw: 1008, sh: 10752, tbp: 450, conn: '12VHPWR (16 pines)', psu: 850, len: 313, msrp: 1999, p: 47, riv: 'RX 6950 XT' },
  { n: 'RTX 3090', code: 'GA102', vram: 24, vt: 'GDDR6X', bus: 384, bw: 936, sh: 10496, tbp: 350, conn: '2 × 8 pines / 12 pines (FE)', psu: 750, len: 313, msrp: 1499, p: 43, riv: 'RX 6900 XT', note: 'Con 24 GB sigue siendo muy buscada de segunda mano para IA local.' },
  { n: 'RTX 3080 Ti', y: 2021, code: 'GA102', vram: 12, vt: 'GDDR6X', bus: 384, bw: 912, sh: 10240, tbp: 350, conn: '2 × 8 pines', psu: 750, len: 300, msrp: 1199, p: 41, riv: 'RX 6900 XT' },
  { n: 'RTX 3080', code: 'GA102', vram: 10, vt: 'GDDR6X', bus: 320, bw: 760, sh: 8704, tbp: 320, conn: '2 × 8 pines', psu: 750, len: 300, msrp: 699, p: 38, riv: 'RX 6800 XT' },
  { n: 'RTX 3070 Ti', y: 2021, code: 'GA104', vram: 8, vt: 'GDDR6X', bus: 256, bw: 608, sh: 6144, tbp: 290, conn: '2 × 8 pines', psu: 750, len: 270, msrp: 599, p: 31, riv: 'RX 6800' },
  { n: 'RTX 3070', code: 'GA104', vram: 8, vt: 'GDDR6', bus: 256, bw: 448, sh: 5888, tbp: 220, conn: '1 × 8 o 2 × 8 pines', psu: 650, len: 242, msrp: 499, p: 29, riv: 'RX 6700 XT' },
  { n: 'RTX 3060 Ti', code: 'GA104', vram: 8, vt: 'GDDR6', bus: 256, bw: 448, sh: 4864, tbp: 200, conn: '1 × 8 pines', psu: 600, len: 242, msrp: 399, p: 25, riv: 'RX 6700 XT' },
  { n: 'RTX 3060', y: 2021, code: 'GA106', vram: 12, vt: 'GDDR6', bus: 192, bw: 360, sh: 3584, tbp: 170, conn: '1 × 8 pines', psu: 550, len: 242, msrp: 329, p: 19, riv: 'RX 6600 XT', note: 'Existe una versión de 8 GB con bus de 128 bits, bastante peor. Mira bien la caja.' },
  { n: 'RTX 3050', y: 2022, code: 'GA106', vram: 8, vt: 'GDDR6', bus: 128, bw: 224, sh: 2560, tbp: 130, conn: '1 × 8 pines', psu: 550, len: 200, msrp: 249, lanes: 8, p: 12.5, riv: 'RX 6600' },
  { n: 'RTX 3050 6GB', y: 2024, code: 'GA107', vram: 6, vt: 'GDDR6', bus: 96, bw: 168, sh: 2304, tbp: 70, conn: 'Ninguno', psu: 300, len: 180, msrp: 169, lanes: 8, p: 9, riv: 'RX 6400', note: 'Trampa: mismo nombre que la 3050 de 8 GB, pero bastante más lenta.' }
]),
HW.fam({ brand: 'NVIDIA', y: 2022, arch: 'Ada Lovelace', node: 'TSMC 4N (5 nm)', rt: 3, ai: 'Tensor 4.ª gen', pcie: '4.0', lanes: 16, up: 'DLSS 4: superresolución + Frame Generation ×2 (sin Multi Frame Generation).', conf: 'rev' }, [
  { n: 'RTX 4090', code: 'AD102', vram: 24, vt: 'GDDR6X', bus: 384, bw: 1008, sh: 16384, tbp: 450, conn: '12VHPWR (16 pines)', psu: 850, len: 340, msrp: 1599, p: 77, riv: 'RX 7900 XTX' },
  { n: 'RTX 4080 SUPER', y: 2024, code: 'AD103', vram: 16, vt: 'GDDR6X', bus: 256, bw: 736, sh: 10240, tbp: 320, conn: '12VHPWR (16 pines)', psu: 750, len: 320, msrp: 999, p: 61, riv: 'RX 7900 XTX' },
  { n: 'RTX 4080', code: 'AD103', vram: 16, vt: 'GDDR6X', bus: 256, bw: 717, sh: 9728, tbp: 320, conn: '12VHPWR (16 pines)', psu: 750, len: 320, msrp: 1199, p: 59, riv: 'RX 7900 XTX' },
  { n: 'RTX 4070 Ti SUPER', y: 2024, code: 'AD103', vram: 16, vt: 'GDDR6X', bus: 256, bw: 672, sh: 8448, tbp: 285, conn: '12VHPWR (16 pines)', psu: 700, len: 300, msrp: 799, p: 52, riv: 'RX 7900 XT' },
  { n: 'RTX 4070 Ti', y: 2023, code: 'AD104', vram: 12, vt: 'GDDR6X', bus: 192, bw: 504, sh: 7680, tbp: 285, conn: '12VHPWR (16 pines)', psu: 700, len: 290, msrp: 799, p: 47, riv: 'RX 7900 XT' },
  { n: 'RTX 4070 SUPER', y: 2024, code: 'AD104', vram: 12, vt: 'GDDR6X', bus: 192, bw: 504, sh: 7168, tbp: 220, conn: '12VHPWR o 1 × 8 pines (según modelo)', psu: 650, len: 270, msrp: 599, p: 44, riv: 'RX 7900 GRE' },
  { n: 'RTX 4070', y: 2023, code: 'AD104', vram: 12, vt: 'GDDR6X', bus: 192, bw: 504, sh: 5888, tbp: 200, conn: '1 × 8 pines o 12VHPWR', psu: 650, len: 250, msrp: 599, p: 38, riv: 'RX 7800 XT' },
  { n: 'RTX 4060 Ti 16GB', y: 2023, code: 'AD106', vram: 16, vt: 'GDDR6', bus: 128, bw: 288, sh: 4352, tbp: 165, conn: '1 × 8 pines', psu: 550, len: 240, msrp: 499, lanes: 8, p: 29, riv: 'RX 7600 XT' },
  { n: 'RTX 4060 Ti', y: 2023, code: 'AD106', vram: 8, vt: 'GDDR6', bus: 128, bw: 288, sh: 4352, tbp: 160, conn: '1 × 8 pines', psu: 550, len: 240, msrp: 399, lanes: 8, p: 28, riv: 'RX 7700 XT' },
  { n: 'RTX 4060', y: 2023, code: 'AD107', vram: 8, vt: 'GDDR6', bus: 128, bw: 272, sh: 3072, tbp: 115, conn: '1 × 8 pines', psu: 550, len: 220, msrp: 299, lanes: 8, p: 22.5, riv: 'RX 7600' }
]),
HW.fam({ brand: 'NVIDIA', y: 2025, arch: 'Blackwell', node: 'TSMC 4NP (5 nm)', rt: 4, ai: 'Tensor 5.ª gen (FP4)', pcie: '5.0', lanes: 16, up: 'DLSS 4: superresolución + Multi Frame Generation (hasta ×4).', conf: 'rev' }, [
  { n: 'RTX 5090', code: 'GB202', vram: 32, vt: 'GDDR7', bus: 512, bw: 1792, sh: 21760, tbp: 575, conn: '12V-2x6 (16 pines)', psu: 1000, len: 340, msrp: 1999, p: 100, riv: 'Sin rival directo', note: 'Referencia del índice (= 100). Llévala con fuente ATX 3.1 y cable 12V-2x6 nativo bien encajado.' },
  { n: 'RTX 5080', code: 'GB203', vram: 16, vt: 'GDDR7', bus: 256, bw: 960, sh: 10752, tbp: 360, conn: '12V-2x6 (16 pines)', psu: 850, len: 330, msrp: 999, p: 66, riv: 'RX 9070 XT' },
  { n: 'RTX 5070 Ti', code: 'GB203', vram: 16, vt: 'GDDR7', bus: 256, bw: 896, sh: 8960, tbp: 300, conn: '12V-2x6 (16 pines)', psu: 750, len: 320, msrp: 749, p: 58, riv: 'RX 9070 XT' },
  { n: 'RTX 5070', code: 'GB205', vram: 12, vt: 'GDDR7', bus: 192, bw: 672, sh: 6144, tbp: 250, conn: '12V-2x6 o 1-2 × 8 pines (según modelo)', psu: 650, len: 290, msrp: 549, p: 46, riv: 'RX 9070' },
  { n: 'RTX 5060 Ti 16GB', code: 'GB206', vram: 16, vt: 'GDDR7', bus: 128, bw: 448, sh: 4608, tbp: 180, conn: '1 × 8 pines (la mayoría)', psu: 600, len: 240, msrp: 429, lanes: 8, p: 34, riv: 'RX 9060 XT 16GB' },
  { n: 'RTX 5060 Ti 8GB', code: 'GB206', vram: 8, vt: 'GDDR7', bus: 128, bw: 448, sh: 4608, tbp: 180, conn: '1 × 8 pines', psu: 600, len: 240, msrp: 379, lanes: 8, p: 32, riv: 'RX 9060 XT 8GB', note: 'Mismo chip que la de 16 GB, pero los 8 GB lastran a 1440p/4K y en juegos nuevos.' },
  { n: 'RTX 5060', code: 'GB206', vram: 8, vt: 'GDDR7', bus: 128, bw: 448, sh: 3840, tbp: 145, conn: '1 × 8 pines', psu: 550, len: 230, msrp: 299, lanes: 8, p: 27, riv: 'RX 9060 XT 8GB' },
  { n: 'RTX 5050', code: 'GB207', vram: 8, vt: 'GDDR6', bus: 128, bw: 320, sh: 2560, tbp: 130, conn: '1 × 8 pines', psu: 550, len: 220, msrp: 249, lanes: 8, p: 18, riv: 'Arc B570', conf: 'est' }
]),
/* ---------------- AMD ---------------- */
HW.fam({ brand: 'AMD', y: 2019, arch: 'RDNA 1', node: 'TSMC 7 nm', rt: 0, ai: 'No', pcie: '4.0', lanes: 16, up: 'FSR 1-3 (incluida generación de fotogramas FSR 3). Sin FSR 4.', conf: 'est' }, [
  { n: 'RX 5700 XT', code: 'Navi 10', vram: 8, vt: 'GDDR6', bus: 256, bw: 448, sh: 2560, tbp: 225, conn: '8 + 6 pines', psu: 600, len: 270, msrp: 399, p: 19.5, riv: 'RTX 2070 SUPER' },
  { n: 'RX 5700', code: 'Navi 10', vram: 8, vt: 'GDDR6', bus: 256, bw: 448, sh: 2304, tbp: 180, conn: '8 + 6 pines', psu: 600, len: 270, msrp: 349, p: 17.5, riv: 'RTX 2060 SUPER' },
  { n: 'RX 5600 XT', y: 2020, code: 'Navi 10', vram: 6, vt: 'GDDR6', bus: 192, bw: 336, sh: 2304, tbp: 150, conn: '1 × 8 pines', psu: 550, len: 250, msrp: 279, p: 15, riv: 'RTX 2060' },
  { n: 'RX 5500 XT 8GB', code: 'Navi 14', vram: 8, vt: 'GDDR6', bus: 128, bw: 224, sh: 1408, tbp: 130, conn: '1 × 8 pines', psu: 450, len: 230, msrp: 199, lanes: 8, p: 10, riv: 'GTX 1650 SUPER' }
]),
HW.fam({ brand: 'AMD', y: 2020, arch: 'RDNA 2', node: 'TSMC 7 nm (6 nm en 6500/6400)', rt: 1, ai: 'No', pcie: '4.0', lanes: 16, up: 'FSR 1-3 (con Frame Generation). Sin FSR 4 oficial.', conf: 'rev' }, [
  { n: 'RX 6950 XT', y: 2022, code: 'Navi 21', vram: 16, vt: 'GDDR6', bus: 256, bw: 576, sh: 5120, tbp: 335, conn: '2 × 8 pines', psu: 850, len: 320, msrp: 1099, p: 43, riv: 'RTX 3090 Ti', note: 'Tiene 128 MB de Infinity Cache, que compensa su bus de 256 bits.' },
  { n: 'RX 6900 XT', code: 'Navi 21', vram: 16, vt: 'GDDR6', bus: 256, bw: 512, sh: 5120, tbp: 300, conn: '2 × 8 pines', psu: 850, len: 300, msrp: 999, p: 40, riv: 'RTX 3090' },
  { n: 'RX 6800 XT', code: 'Navi 21', vram: 16, vt: 'GDDR6', bus: 256, bw: 512, sh: 4608, tbp: 300, conn: '2 × 8 pines', psu: 750, len: 300, msrp: 649, p: 37, riv: 'RTX 3080' },
  { n: 'RX 6800', code: 'Navi 21', vram: 16, vt: 'GDDR6', bus: 256, bw: 512, sh: 3840, tbp: 250, conn: '2 × 8 pines', psu: 650, len: 267, msrp: 579, p: 32, riv: 'RTX 3070 Ti' },
  { n: 'RX 6750 XT', y: 2022, code: 'Navi 22', vram: 12, vt: 'GDDR6', bus: 192, bw: 432, sh: 2560, tbp: 250, conn: '8 + 6 pines', psu: 650, len: 267, msrp: 549, p: 28.5, riv: 'RTX 3070' },
  { n: 'RX 6700 XT', y: 2021, code: 'Navi 22', vram: 12, vt: 'GDDR6', bus: 192, bw: 384, sh: 2560, tbp: 230, conn: '8 + 6 pines', psu: 650, len: 267, msrp: 479, p: 27, riv: 'RTX 3060 Ti' },
  { n: 'RX 6650 XT', y: 2022, code: 'Navi 23', vram: 8, vt: 'GDDR6', bus: 128, bw: 280, sh: 2048, tbp: 180, conn: '1 × 8 pines', psu: 500, len: 240, msrp: 399, lanes: 8, p: 21, riv: 'RTX 3060' },
  { n: 'RX 6600 XT', y: 2021, code: 'Navi 23', vram: 8, vt: 'GDDR6', bus: 128, bw: 256, sh: 2048, tbp: 160, conn: '1 × 8 pines', psu: 500, len: 240, msrp: 379, lanes: 8, p: 19, riv: 'RTX 3060' },
  { n: 'RX 6600', y: 2021, code: 'Navi 23', vram: 8, vt: 'GDDR6', bus: 128, bw: 224, sh: 1792, tbp: 132, conn: '1 × 8 pines', psu: 450, len: 230, msrp: 329, lanes: 8, p: 17, riv: 'RTX 3050' },
  { n: 'RX 6500 XT', y: 2022, code: 'Navi 24', vram: 4, vt: 'GDDR6', bus: 64, bw: 144, sh: 1024, tbp: 107, conn: '1 × 6 pines', psu: 400, len: 190, msrp: 199, lanes: 4, p: 7.5, riv: 'GTX 1650', note: 'Trampa gorda: PCIe x4 y 4 GB. En placa PCIe 3.0 pierde mucho rendimiento. Sin codificador de vídeo.' },
  { n: 'RX 6400', y: 2022, code: 'Navi 24', vram: 4, vt: 'GDDR6', bus: 64, bw: 128, sh: 768, tbp: 53, conn: 'Ninguno', psu: 300, len: 170, msrp: 159, lanes: 4, p: 6, riv: 'GTX 1650' }
]),
HW.fam({ brand: 'AMD', y: 2022, arch: 'RDNA 3', node: 'TSMC 5 nm + 6 nm (chiplets)', rt: 2, ai: 'Aceleradores de IA (WMMA)', pcie: '4.0', lanes: 16, up: 'FSR 3.1 (superresolución + Frame Generation). FSR 4 no oficial.', conf: 'rev' }, [
  { n: 'RX 7900 XTX', code: 'Navi 31', vram: 24, vt: 'GDDR6', bus: 384, bw: 960, sh: 6144, tbp: 355, conn: '2 × 8 pines (3 en muchos modelos)', psu: 800, len: 320, msrp: 999, p: 59, riv: 'RTX 4080' },
  { n: 'RX 7900 XT', code: 'Navi 31', vram: 20, vt: 'GDDR6', bus: 320, bw: 800, sh: 5376, tbp: 315, conn: '2 × 8 pines', psu: 750, len: 310, msrp: 899, p: 50, riv: 'RTX 4070 Ti' },
  { n: 'RX 7900 GRE', y: 2024, code: 'Navi 31', vram: 16, vt: 'GDDR6', bus: 256, bw: 576, sh: 5120, tbp: 260, conn: '2 × 8 pines', psu: 700, len: 290, msrp: 549, p: 44, riv: 'RTX 4070 SUPER' },
  { n: 'RX 7800 XT', y: 2023, code: 'Navi 32', vram: 16, vt: 'GDDR6', bus: 256, bw: 624, sh: 3840, tbp: 263, conn: '2 × 8 pines', psu: 700, len: 290, msrp: 499, p: 40, riv: 'RTX 4070' },
  { n: 'RX 7700 XT', y: 2023, code: 'Navi 32', vram: 12, vt: 'GDDR6', bus: 192, bw: 432, sh: 3456, tbp: 245, conn: '2 × 8 pines', psu: 700, len: 280, msrp: 449, p: 34, riv: 'RTX 4060 Ti' },
  { n: 'RX 7600 XT', y: 2024, node: 'TSMC 6 nm', code: 'Navi 33', vram: 16, vt: 'GDDR6', bus: 128, bw: 288, sh: 2048, tbp: 190, conn: '2 × 8 pines', psu: 600, len: 250, msrp: 329, lanes: 8, p: 22.5, riv: 'RTX 4060' },
  { n: 'RX 7600', y: 2023, node: 'TSMC 6 nm', code: 'Navi 33', vram: 8, vt: 'GDDR6', bus: 128, bw: 288, sh: 2048, tbp: 165, conn: '1 × 8 pines', psu: 550, len: 230, msrp: 269, lanes: 8, p: 21.5, riv: 'RTX 4060' }
]),
HW.fam({ brand: 'AMD', y: 2025, arch: 'RDNA 4', node: 'TSMC N4P', rt: 3, ai: 'Aceleradores de IA 2.ª gen (FP8)', pcie: '5.0', lanes: 16, up: 'FSR 4 (superresolución por IA) + Frame Generation. Compatible con juegos FSR 3.1.', conf: 'rev' }, [
  { n: 'RX 9070 XT', code: 'Navi 48', vram: 16, vt: 'GDDR6', bus: 256, bw: 640, sh: 4096, tbp: 304, conn: '2 × 8 pines (algunos 12V-2x6)', psu: 750, len: 320, msrp: 599, p: 55, riv: 'RTX 5070 Ti' },
  { n: 'RX 9070', code: 'Navi 48', vram: 16, vt: 'GDDR6', bus: 256, bw: 640, sh: 3584, tbp: 220, conn: '2 × 8 pines', psu: 650, len: 290, msrp: 549, p: 49, riv: 'RTX 5070' },
  { n: 'RX 9070 GRE', y: 2026, code: 'Navi 48', vram: 12, vt: 'GDDR6', bus: 192, bw: 432, sh: 3072, tbp: 220, conn: '2 × 8 pines', psu: 650, len: 280, msrp: 549, p: 41, riv: 'RTX 5060 Ti 16GB', conf: 'est', note: 'En China desde mayo de 2025; global desde el 2/6/2026 a 549 $. AMD afirma +21 % sobre la RTX 5060 Ti 16GB a 1440p (dato del fabricante). TBP por verificar.' },
  { n: 'RX 9060 XT 16GB', code: 'Navi 44', vram: 16, vt: 'GDDR6', bus: 128, bw: 320, sh: 2048, tbp: 160, conn: '1 × 8 pines', psu: 500, len: 240, msrp: 349, p: 33, riv: 'RTX 5060 Ti 16GB' },
  { n: 'RX 9060 XT 8GB', code: 'Navi 44', vram: 8, vt: 'GDDR6', bus: 128, bw: 320, sh: 2048, tbp: 150, conn: '1 × 8 pines', psu: 500, len: 240, msrp: 299, p: 31, riv: 'RTX 5060', note: 'Mismo chip que la de 16 GB: la diferencia es la VRAM, que se nota a 1440p y en juegos exigentes.' }
]),
/* ---------------- Intel Arc ---------------- */
HW.fam({ brand: 'Intel', y: 2022, arch: 'Xe-HPG (Alchemist)', node: 'TSMC N6', rt: 1, ai: 'XMX (núcleos matriciales)', pcie: '4.0', lanes: 16, up: 'XeSS (con XMX) + FSR. XeSS 2 con Frame Generation en juegos compatibles.', conf: 'rev', rebar: true }, [
  { n: 'Arc A770 16GB', code: 'ACM-G10', vram: 16, vt: 'GDDR6', bus: 256, bw: 560, sh: 4096, tbp: 225, conn: '8 + 6 pines', psu: 650, len: 270, msrp: 349, p: 20, riv: 'RTX 3060', note: 'Necesita Resizable BAR activado o pierde mucho rendimiento.' },
  { n: 'Arc A750', code: 'ACM-G10', vram: 8, vt: 'GDDR6', bus: 256, bw: 512, sh: 3584, tbp: 225, conn: '8 + 6 pines', psu: 600, len: 270, msrp: 289, p: 18, riv: 'RTX 3060' },
  { n: 'Arc A580', y: 2023, code: 'ACM-G10', vram: 8, vt: 'GDDR6', bus: 256, bw: 512, sh: 3072, tbp: 185, conn: '2 × 8 pines', psu: 550, len: 250, msrp: 179, p: 16, riv: 'RX 6600' },
  { n: 'Arc A380', code: 'ACM-G11', vram: 6, vt: 'GDDR6', bus: 96, bw: 186, sh: 1024, tbp: 75, conn: 'Ninguno o 1 × 8 (según modelo)', psu: 300, len: 190, msrp: 139, lanes: 8, p: 6.5, riv: 'GTX 1650', note: 'Muy usada para codificar AV1 en servidores multimedia.' }
]),
HW.fam({ brand: 'Intel', y: 2024, arch: 'Xe2 (Battlemage)', node: 'TSMC N5', rt: 2, ai: 'XMX 2.ª gen', pcie: '4.0', lanes: 8, up: 'XeSS 2 (superresolución + Frame Generation + Low Latency).', conf: 'rev', rebar: true }, [
  { n: 'Arc B580', code: 'BMG-G21', vram: 12, vt: 'GDDR6', bus: 192, bw: 456, sh: 2560, tbp: 190, conn: '1 × 8 pines', psu: 600, len: 272, msrp: 249, p: 25, riv: 'RTX 4060', note: 'Trampa: con procesadores antiguos (Ryzen 5 2600, i5-9400F…) pierde bastante por la sobrecarga de su driver. Usa PCIe 4.0 x8 y necesita Resizable BAR.' },
  { n: 'Arc B570', y: 2025, code: 'BMG-G21', vram: 10, vt: 'GDDR6', bus: 160, bw: 380, sh: 2304, tbp: 150, conn: '1 × 8 pines', psu: 500, len: 250, msrp: 219, p: 21.5, riv: 'RTX 5050' }
])
);
HW.gpus.forEach(function (g) {
  g.id = 'gpu-' + HW.slug(g.n); g.kind = 'gpu';
  g.code = g.code || ''; if (!g.node) g.node = '';
});
