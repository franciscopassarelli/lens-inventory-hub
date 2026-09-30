# Optical Stock Master

Construye una aplicación web V1 completa para gestionar el stock de armazones de una óptica. Antes de implementar, analiza la estructura del proyecto y aplica una organización mantenible. No uses backend, base de datos, autenticación ni servicios externos: todo debe funcionar 100% frontend y persistir con localStorage o IndexedDB.

Objetivo: herramienta real de trabajo, rápida y simple para registrar armazones, consultar stock, buscar/filtrar, registrar movimientos, ver historial y exportar CSV. Desktop-first, responsive a tablet y móvil.

ARQUITECTURA OBLIGATORIA
- Separar claramente UI, tipos/modelos, hooks, servicios, repositorios y utilidades. Organización sugerida: src/pages, src/components, src/features, src/hooks, src/services, src/repositories, src/types (o models), src/utils, src/data.
- La UI NO debe leer/escribir localStorage directamente.
- Crear contratos de repositorio: FrameRepository, MovementRepository, BrandRepository (y SupplierRepository solo si resulta útil, no es necesario exponer proveedores en V1).
- Implementaciones iniciales LocalFrameRepository, LocalMovementRepository, LocalBrandRepository usando localStorage. Incluir una abstracción de almacenamiento si ayuda.
- Servicios frameService, movementService, brandService encapsulan reglas de negocio y llaman a los repositorios. Los componentes consumen hooks/servicios, nunca repositorios ni localStorage.
- Diseñar interfaces para que en V2 se puedan implementar ApiFrameRepository / ApiMovementRepository / ApiBrandRepository mediante REST sin rehacer la UI. Dejar comentarios breves donde sea útil, no backend falso ni mocks de HTTP complejos.
- Modelos claros: Frame, Movement, Brand. Agregar tipos de estado: en stock, vendido, devuelto, en reparación. Movimientos: ingreso, venta, devolución, reparación, otro egreso.

DATOS Y PERSISTENCIA
- Sembrar automáticamente datos demo solo la primera vez: 10-15 armazones ficticios, diferentes marcas/modelos/precios/estados/fechas/números de sobre y movimientos coherentes. Marcas iniciales al menos Ray-Ban, Vogue, Oakley, Vulk.
- Persistir los datos tras cerrar/reabrir navegador.
- Configuración debe tener “Restaurar datos demo” y “Limpiar todos los datos locales”, ambas con confirmación explícita y toast. Al limpiar, mostrar estados vacíos apropiados.

LAYOUT Y DISEÑO
- Interfaz profesional, limpia, moderna, minimalista, en español, con sidebar lateral, header y área principal. Sidebar: Dashboard, Armazones, Movimientos, Marcas, Exportar, Configuración. En móvil usar menú responsive.
- Estética óptica profesional: paleta sobria con acento azul/índigo o verde petróleo, buena jerarquía tipográfica, contrastes accesibles. No sobrecargar con gráficos innecesarios.
- Tablas desktop y cards/listas legibles en móvil. Añadir toasts, diálogos de confirmación, estados vacíos, mensajes de error y skeletons/loading breves donde corresponda.

PANTALLAS Y FUNCIONALIDAD
1. Dashboard
- Indicadores: total de armazones, actualmente en stock, vendidos/egresados, ingresos registrados, egresos registrados, valor estimado de stock actual (basado en precio de compra y/o venta, indicar claramente qué representa).
- Últimos movimientos.
- Indicadores útiles: ingresos recientes, egresos recientes y armazones con mucho tiempo en stock (por ejemplo 90+ días).

2. Armazones
- Listado con crear, editar, eliminar (confirmación), ver detalle, búsqueda, filtros y ordenamiento.
- Campos mínimos: id interno, código, marca, modelo, color, precio de compra, precio de venta, número de sobre, fecha de ingreso, fecha de egreso, estado, observaciones.
- Búsqueda por código, marca, modelo y número de sobre. Filtros por marca, estado, rango de precios y fecha de ingreso, además interruptor “Solo mostrar stock actual”. Ordenar por columnas relevantes.
- Validar campos obligatorios: código, marca, fecha de ingreso. Código único. Mensajes claros.
- Crear/editar con formulario bien diseñado (modal/drawer o página) que gestione las marcas existentes.

3. Detalle del armazón
- Vista/panel con información completa, estado, precios, sobre, fechas y el historial de movimientos del armazón.

4. Movimientos
- Pantalla para registrar movimientos: armazón, tipo, fecha, número de sobre, observaciones.
- Reglas: Venta solo si el armazón está en stock (u otra condición coherente); no permitir venta de ya vendido. Ingreso pone estado “En stock” y actualiza fecha de ingreso. Venta pone “Vendido” y fecha de egreso. Devolución vuelve a “En stock” y limpia/ajusta fecha de egreso de modo coherente. Reparación pone “En reparación”. Otro egreso debe llevar a un estado coherente, idealmente vendido/egresado no disponible; explica el resultado con etiqueta/nota. Centralizar reglas en movementService.
- Al crear un armazón, generar movimiento inicial de ingreso o asegurar historial coherente.

5. Historial
- Incluir historial global de todos los movimientos, accesible desde Movimientos (en tabs o sección visible), con fecha, código, marca, modelo, tipo, sobre y observaciones. Filtros fecha, tipo, marca, código.

6. Marcas
- CRUD sencillo: crear, editar, eliminar con validaciones y confirmación. Mostrar cantidad de armazones asociados. No permitir eliminar una marca con armazones asociados sin explicación clara.

7. Exportar
- Página o menú Exportar para descargar CSVs con columnas útiles de: stock actual, todos los armazones e historial de movimientos. Priorizar CSV correctamente escapado, con fecha en nombre. Si Excel no es sencillo, no hace falta. Mostrar descripción de cada exportación.

DEMO/USABILIDAD
- Funciones principales deben ser claramente accesibles: buscar código para saber stock; nuevo armazón; registrar venta; filtrar solo stock actual; exportar CSV.
- No añadir clientes, recetas, obras sociales, laboratorios ni flujo completo de ventas.
- Implementa todo el flujo de principio a fin y verifica que compile sin errores. Usa librerías ya disponibles en el proyecto si corresponde y evita dependencias innecesarias.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/936d823b-026e-461f-9828-5089d92db79b).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
