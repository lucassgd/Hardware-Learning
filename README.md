# La Cocina del PC

App móvil (HTML + JS en un solo fichero, sin conexión) para aprender hardware de PC desde cero hasta nivel experto, en español. Toda la app usa la misma analogía: **un PC es la cocina de un restaurante**.

**Abrir:** `dist/la-cocina-del-pc.html` (en el móvil o en el PC; no necesita servidor ni conexión, salvo para las fuentes tipográficas, que tienen alternativa del sistema).

Datos verificados a **11/11/2026**. Precios orientativos de 11/2026.

## Pestañas
1. **Aprender**: 18 lecciones (a–r) en 4 niveles, con concepto → analogía → ejemplo real → trampa, dibujos SVG, «Con tu PC» y test final.
2. **Catálogo**: procesadores AMD (Ryzen 1000 → 9950X3D2 y portátiles) e Intel (8.ª gen → Core Ultra 200S Plus, Panther Lake) y gráficas NVIDIA (GTX 10 → RTX 50), AMD (RX 5000 → RX 9000) e Intel Arc (A y B). Filtros, fichas, índices con su fuente y línea de tiempo.
3. **Comparar**: dos procesadores o dos gráficas + un uso → fichas lado a lado, razonamiento generado por reglas, trampas, veredicto, «frase para decirlo» y modo práctica.
4. **Nombres**: descodificador de modelos por partes y colores.
5. **Herramientas**: calculadora de fuente, comprobador de compatibilidad, «¿puedo cambiar X por Y?», montador por presupuesto, cuello de botella y Mi PC (con copia del progreso).
6. **Practicar**: tests por tema y nivel, duelos, ordenar por generación, reconocer conectores, tarjetas con repetición espaciada, examen final y estadísticas.
7. **Glosario**: 160+ términos con analogía y enlace a la lección.

## Estructura (datos separados de la lógica)
```
src/data/   cpus.js · gpus.js · platform.js (arquitecturas, zócalos, chipsets, piezas genéricas, precios)
            lessons1.js · lessons2.js · questions.js · glossary.js · svg.js
src/js/     engine.js (reglas: comparador, descodificador, fuente, cuello de botella, compatibilidad)
            core.js · ui.js · tools.js · practice.js · main.js (interfaz)
build.mjs   junta todo en dist/la-cocina-del-pc.html (documento completo) y dist/artifact.html
```
Construir: `node build.mjs`

### Añadir un modelo
Copia una línea de su familia en `src/data/cpus.js` o `src/data/gpus.js` y cambia los campos. El comparador, el comprobador y el resto de herramientas trabajan con reglas sobre los campos, así que el modelo nuevo funciona en todas partes sin tocar la lógica. Si es una arquitectura nueva, añádela a `HW.archs` (con su IPC relativo aproximado); si es un zócalo o chipset nuevo, a `HW.sockets` / `HW.chipsets` en `platform.js`.

## Sobre los números
- Los índices de rendimiento son **aproximados**, recopilados de las tablas de rendimiento relativo de TechPowerUp y de Hardware Unboxed (no de UserBenchmark). Cada ficha indica si el dato sale de reseñas, es estimado o está por verificar.
- Juegos de CPU: Ryzen 7 9800X3D = 100 a 1080p. Multinúcleo: Ryzen 9 9950X = 100. Gráficas: RTX 5090 = 100 a 1440p; 1080p y 4K se estiman a partir de ese índice.
- No han salido (a 11/11/2026): Zen 6 de sobremesa, Core Ultra 400 «Nova Lake» (LGA1954), RTX 50 SUPER y Arc B770. Aparecen como «por verificar».
