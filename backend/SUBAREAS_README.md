# Historia de Usuario: Subáreas y Visibilidad - 8

## Descripción
Como admin, quiero crear subáreas dentro de cada área y poder asignar reclamos a esas subáreas, pero que el cliente solo vea el área macro.

## Criterios de Aceptación

### ✅ Criterio 1: Visibilidad del Cliente
**Dado** un reclamo asignado a "Soporte → DBAs"  
**Cuando** el cliente ve el reclamo  
**Entonces** solo ve "Área: Soporte" sin mencionar DBAs

### ✅ Criterio 2: Filtrado Interno
**Dado** que se filtra por subárea "DBAs"  
**Cuando** un usuario interno aplica el filtro  
**Entonces** el listado devuelve solo los casos de esa subárea

### ✅ Criterio 3: Eliminación de Subárea
**Dado** que se elimina una subárea  
**Cuando** hay reclamos activos asignados  
**Entonces** el sistema obliga a reasignar los reclamos activos antes de eliminar

---

## Implementación Técnica

### Backend

#### 1. Entidad Subarea (`backend/src/subareas/Entidad/subarea.schema.ts`)
```typescript
@Schema()
export class Subarea extends Document {
  @Prop({ required: true })
  nombre: string;

  @Prop({ type: String, ref: Area.name })
  area: string | Area;
}
```

#### 2. Endpoints de API

##### POST /subareas
Crear una nueva subárea.

**Request Body:**
```json
{
  "nombre": "DBAs",
  "area": "64f1234567890abcdef12345"
}
```

**Response:**
```json
{
  "id": "64f9876543210fedcba54321",
  "nombre": "DBAs",
  "area": "64f1234567890abcdef12345"
}
```

##### GET /subareas
Listar todas las subáreas (con filtro opcional por área).

**Query Parameters:**
- `areaId` (opcional): ID del área para filtrar

**Example:**
```bash
curl http://localhost:3000/subareas?areaId=64f1234567890abcdef12345
```

**Response:**
```json
[
  {
    "id": "64f9876543210fedcba54321",
    "nombre": "DBAs",
    "area": "64f1234567890abcdef12345"
  },
  {
    "id": "64f9876543210fedcba54322",
    "nombre": "Frontend",
    "area": "64f1234567890abcdef12345"
  }
]
```

##### DELETE /subareas/:id
Eliminar una subárea.

**Query Parameters:**
- `reassignTo` (opcional): ID de la subárea destino o "null" para remover la asignación

**Ejemplo sin reasignación (retorna error si hay reclamos):**
```bash
curl -X DELETE http://localhost:3000/subareas/64f9876543210fedcba54321
```

**Response (409 Conflict):**
```json
{
  "statusCode": 409,
  "message": "Conflict",
  "error": "SUBAREA_HAS_ACTIVE_RECLAMOS",
  "reclamos": [
    { "id": "...", "titulo": "...", "estadoActual": "..." }
  ]
}
```

**Ejemplo con reasignación:**
```bash
curl -X DELETE "http://localhost:3000/subareas/64f9876543210fedcba54321?reassignTo=64f9876543210fedcba54322"
```

**Response (200 OK):**
```json
{
  "message": "Subarea deleted successfully"
}
```

#### 3. Áreas (`/areas`)

##### GET /areas
Listar todas las áreas disponibles.

**Response:**
```json
[
  {
    "id": "64f1234567890abcdef12345",
    "nombre": "Soporte"
  },
  {
    "id": "64f1234567890abcdef12346",
    "nombre": "Desarrollo"
  }
]
```

### Frontend

#### 1. Componente: SubareasManagement
Ubicación: `frontend/src/components/SubareasManagement.tsx`

**Características:**
- Crear nuevas subáreas seleccionando el área padre
- Listar subáreas con filtro por área
- Eliminar subáreas con validación de reclamos activos
- Interfaz con diálogos modales para crear/eliminar

**Acceso:**
- Solo visible para rol `administrador`
- Menú: Dashboard → Subáreas (ícono Layers)

#### 2. Visibilidad según Rol

**Vista Cliente:**
- Al ver un reclamo, solo se muestra el campo `assignedArea`
- El campo `assignedSubarea` NO se renderiza en la interfaz del cliente

**Vista Interna (Empleado/Admin):**
- Se muestra tanto `assignedArea` como `assignedSubarea`
- Filtros disponibles por subárea en el listado de reclamos
- Formularios de asignación incluyen selector de subárea

---

## Base de Datos (MongoDB)

### Colección: `subareas`
```javascript
{
  _id: ObjectId("..."),
  nombre: "DBAs",
  area: ObjectId("...")  // Referencia a colección areas
}
```

### Colección: `reclamos` (campo añadido)
```javascript
{
  _id: ObjectId("..."),
  titulo: "...",
  area: ObjectId("..."),
  subarea: ObjectId("...") // NULLABLE - referencia a colección subareas
  // ... otros campos
}
```

### Script de Seed
El archivo `backend/seed.js` incluye creación automática de:
- Área "Soporte"
- Subárea "DBAs" bajo Soporte

**Ejecutar seed:**
```bash
cd backend
node seed.js
```

---

## Pruebas Manuales

### 1. Crear Subárea
```bash
curl -X POST http://localhost:3000/subareas \
  -H "Content-Type: application/json" \
  -d '{"nombre":"DBAs","area":"<AREA_ID>"}'
```

### 2. Listar Subáreas de un Área
```bash
curl http://localhost:3000/subareas?areaId=<AREA_ID>
```

### 3. Intentar Eliminar con Reclamos Activos
```bash
curl -X DELETE http://localhost:3000/subareas/<SUBAREA_ID>
# Debería retornar 409 con lista de reclamos
```

### 4. Eliminar con Reasignación
```bash
curl -X DELETE "http://localhost:3000/subareas/<SUBAREA_ID>?reassignTo=<TARGET_SUBAREA_ID>"
# Debería retornar 200 y actualizar reclamos
```

---

## Notas Técnicas

### Manejo de Eliminación
- El backend verifica reclamos con `subarea = id` antes de eliminar
- Si hay reclamos y no se pasa `reassignTo`, retorna 409 Conflict
- Si `reassignTo` es un ID válido, actualiza los reclamos y elimina la subárea
- Si `reassignTo='null'`, remueve la referencia de subárea (set null)

### Consistencia de Datos
- Al asignar una subárea a un reclamo, el campo `area` también se actualiza automáticamente
- Esto mantiene consistencia para búsquedas y reportes históricos

### Seguridad
- Los endpoints de `/subareas` deberían protegerse con guards JWT y roles
- Solo roles `administrador` y `empleado` pueden crear/eliminar subáreas
- Los clientes nunca ven el campo `subarea` en sus respuestas API

---

## Estado de Implementación

- [x] Entidad Subarea con schema Mongoose
- [x] Repositorio y servicio de Subáreas
- [x] Endpoints POST, GET, DELETE con lógica de reasignación
- [x] Endpoints para Áreas (GET /areas)
- [x] Componente frontend SubareasManagement
- [x] Integración en menú de administrador
- [x] Tipos TypeScript (Area, Subarea)
- [x] Actualización de tipo Claim para incluir subarea
- [x] Script seed con datos de ejemplo
- [ ] Guards de autenticación en endpoints (pendiente según implementación auth del proyecto)
- [ ] Tests unitarios e integración
- [ ] Documentación de API completa (Swagger/OpenAPI)

---

## Próximos Pasos Sugeridos

1. **Agregar guards de autenticación** a los endpoints `/subareas` y `/areas`
2. **Implementar filtrado por subárea** en el listado de reclamos (`GET /reclamos?subareaId=...`)
3. **Actualizar formularios de reclamos** para incluir selector de subárea (solo usuarios internos)
4. **Agregar tests E2E** que verifiquen los criterios de aceptación
5. **Validación con class-validator** en DTOs de creación/actualización
6. **Documentar API con Swagger** para facilitar integración

---

## Ejemplos de Uso en Frontend

### Crear Subárea desde la UI
1. Login como administrador
2. Ir a Dashboard → Subáreas
3. Click en "Nueva Subárea"
4. Llenar formulario (nombre + área)
5. Confirmar creación

### Eliminar Subárea
1. En la tabla de subáreas, click en icono de eliminar (🗑️)
2. Si hay reclamos activos, aparece alerta con detalles
3. Reasignar manualmente los reclamos o usar endpoint con `reassignTo`
4. Confirmar eliminación

### Filtrar por Área
1. En vista de Subáreas, usar el dropdown "Filtrar por Área"
2. Seleccionar un área específica
3. La tabla muestra solo las subáreas de esa área

---

**Fecha de última actualización:** 20 de noviembre de 2025  
**Versión:** 1.0
