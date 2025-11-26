# 📋 Referencia de Schemas - MongoDB

Este documento lista todas las entidades (schemas) que se crearon o modificaron para el sistema de autenticación y autorización, junto con sus atributos y relaciones.

---

## 🔐 **Usuario** (`usuarios`)

**Archivo:** `src/usuarios/Entidad/usuario.schema.ts`

### Atributos:

| Campo | Tipo | Requerido | Único | Default | Descripción |
|-------|------|-----------|-------|---------|-------------|
| `nombre` | `String` | ✅ | ❌ | - | Nombre completo del usuario |
| `correo` | `String` | ✅ | ✅ | - | Email único (lowercase, trim) |
| `contraseña` | `String` | ✅ | ❌ | - | Contraseña encriptada (select: false) |
| `activo` | `Boolean` | ❌ | ❌ | `true` | Estado del usuario |
| `rol` | `ObjectId` | ✅ | ❌ | - | Referencia a Rol |
| `refreshToken` | `String` | ❌ | ❌ | - | Token de refresco (opcional) |
| `createdAt` | `Date` | ❌ | ❌ | auto | Fecha de creación |
| `updatedAt` | `Date` | ❌ | ❌ | auto | Fecha de actualización |

### Relaciones:
- **`rol`** → Referencia a colección `roles` (ObjectId)

### Índices:
- `correo`: único
- `rol`: referencia

---

## 👤 **Empleado** (`empleados`)

**Archivo:** `src/empleados/Entidad/empleado.schema.ts`

### Atributos:

| Campo | Tipo | Requerido | Único | Default | Descripción |
|-------|------|-----------|-------|---------|-------------|
| `puesto` | `String` | ✅ | ❌ | - | Cargo del empleado |
| `subarea` | `ObjectId` | ❌ | ❌ | - | Referencia a Subarea |
| `usuarioId` | `ObjectId` | ✅ | ❌ | - | Referencia a Usuario |
| `createdAt` | `Date` | ❌ | ❌ | auto | Fecha de creación |
| `updatedAt` | `Date` | ❌ | ❌ | auto | Fecha de actualización |

### Relaciones:
- **`usuarioId`** → Referencia a colección `usuarios` (ObjectId)
- **`subarea`** → Referencia a colección `subareas` (ObjectId, opcional)

---

## 🏢 **Cliente** (`clientes`)

**Archivo:** `src/clientes/Entidad/cliente.schema.ts`

### Atributos:

| Campo | Tipo | Requerido | Único | Default | Descripción |
|-------|------|-----------|-------|---------|-------------|
| `empresa` | `String` | ✅ | ❌ | - | Nombre de la empresa |
| `telefono` | `String` | ✅ | ❌ | - | Teléfono de contacto |
| `direccion` | `String` | ✅ | ❌ | - | Dirección física |
| `estadoSolicitud` | `ObjectId` | ❌ | ❌ | `null` | Referencia a EstadoSolicitud |
| `usuarioId` | `ObjectId` | ✅ | ❌ | - | Referencia a Usuario |
| `createdAt` | `Date` | ❌ | ❌ | auto | Fecha de creación |
| `updatedAt` | `Date` | ❌ | ❌ | auto | Fecha de actualización |

### Relaciones:
- **`usuarioId`** → Referencia a colección `usuarios` (ObjectId)
- **`estadoSolicitud`** → Referencia a colección `estadosolicituds` (ObjectId, opcional)

---

## 🎭 **Rol** (`roles`)

**Archivo:** `src/roles/Entidad/rol.schema.ts`

### Atributos:

| Campo | Tipo | Requerido | Único | Default | Descripción |
|-------|------|-----------|-------|---------|-------------|
| `nombre` | `String` | ✅ | ✅ | - | Nombre del rol (ej: ADMIN) |
| `descripcion` | `String` | ❌ | ❌ | - | Descripción del rol |
| `permisos` | `[ObjectId]` | ❌ | ❌ | `[]` | Array de referencias a Permiso |
| `createdAt` | `Date` | ❌ | ❌ | auto | Fecha de creación |
| `updatedAt` | `Date` | ❌ | ❌ | auto | Fecha de actualización |

### Relaciones:
- **`permisos`** → Array de referencias a colección `permisos` (muchos a muchos)

### Índices:
- `nombre`: único

### Valores predefinidos (seed):
- `ADMIN` - Administrador del sistema
- `EMPLEADO` - Empleado interno
- `CLIENTE` - Cliente externo

---

## 🔑 **Permiso** (`permisos`)

**Archivo:** `src/permisos/Entidad/permiso.schema.ts`

### Atributos:

| Campo | Tipo | Requerido | Único | Default | Descripción |
|-------|------|-----------|-------|---------|-------------|
| `nombre` | `String` | ✅ | ✅ | - | Nombre del permiso |
| `descripcion` | `String` | ❌ | ❌ | - | Descripción del permiso |
| `recurso` | `String` | ✅ | ❌ | - | Recurso afectado (ej: 'reclamos') |
| `accion` | `String` | ✅ | ❌ | - | Acción permitida (ej: 'crear') |
| `createdAt` | `Date` | ❌ | ❌ | auto | Fecha de creación |
| `updatedAt` | `Date` | ❌ | ❌ | auto | Fecha de actualización |

### Índices:
- `nombre`: único

### Ejemplo de permisos:
```javascript
{
  nombre: "crear_reclamos",
  descripcion: "Permite crear nuevos reclamos",
  recurso: "reclamos",
  accion: "crear"
}
```

---

## 📊 **EstadoSolicitud** (`estadosolicituds`)

**Archivo:** `src/estado-solicitud/Entidad/estado-solicitud.schema.ts`

### Atributos:

| Campo | Tipo | Requerido | Único | Default | Descripción |
|-------|------|-----------|-------|---------|-------------|
| `nombre` | `String` | ✅ | ✅ | - | Nombre del estado |
| `descripcion` | `String` | ❌ | ❌ | - | Descripción del estado |
| `createdAt` | `Date` | ❌ | ❌ | auto | Fecha de creación |
| `updatedAt` | `Date` | ❌ | ❌ | auto | Fecha de actualización |

### Índices:
- `nombre`: único

### Valores predefinidos (seed):
- `PENDIENTE` - Solicitud pendiente de aprobación
- `APROBADO` - Solicitud aprobada
- `RECHAZADO` - Solicitud rechazada

---

## 🔗 Diagrama de Relaciones

```
┌─────────────┐
│   Usuario   │
│             │
│ - nombre    │
│ - correo    │◄────────┐
│ - contraseña│         │
│ - activo    │         │
│ - rol ────────────┐   │
└─────────────┘     │   │
       ▲            │   │
       │            │   │
       │            ▼   │
       │      ┌─────────────┐
       │      │     Rol     │
       │      │             │
       │      │ - nombre    │
       │      │ - permisos ─────┐
       │      └─────────────┘    │
       │                         │
       │                         ▼
       │                  ┌─────────────┐
       │                  │   Permiso   │
       │                  │             │
       │                  │ - nombre    │
       │                  │ - recurso   │
       │                  │ - accion    │
       │                  └─────────────┘
       │
       ├────────────┐
       │            │
       ▼            ▼
┌─────────────┐  ┌─────────────┐
│  Empleado   │  │   Cliente   │
│             │  │             │
│ - puesto    │  │ - empresa   │
│ - subarea   │  │ - telefono  │
│ - usuarioId │  │ - direccion │
└─────────────┘  │ - estadoSolicitud ─┐
                 │ - usuarioId │      │
                 └─────────────┘      │
                                      │
                                      ▼
                              ┌──────────────────┐
                              │ EstadoSolicitud  │
                              │                  │
                              │ - nombre         │
                              │ - descripcion    │
                              └──────────────────┘
```

---

## 📝 Notas de Implementación

### Timestamps
Todos los schemas tienen `timestamps: true`, lo que automáticamente agrega:
- `createdAt`: Fecha de creación del documento
- `updatedAt`: Fecha de última actualización

### Contraseñas
- El campo `contraseña` en Usuario tiene `select: false`
- Esto significa que NO se incluye automáticamente en las queries
- Debe solicitarse explícitamente con `.select('+contraseña')`
- Siempre se encripta con bcrypt (10 salt rounds)

### Correos
- Se convierten a minúsculas automáticamente (`lowercase: true`)
- Se eliminan espacios (`trim: true`)
- Son únicos en el sistema

### ObjectIds
- Todos los IDs de referencia son `Types.ObjectId` de Mongoose
- Se pueden poblar con `.populate()` para obtener el objeto completo

---

## 🚀 Comandos MongoDB útiles

### Ver todos los usuarios:
```javascript
db.usuarios.find().pretty()
```

### Ver usuarios con sus roles:
```javascript
db.usuarios.aggregate([
  {
    $lookup: {
      from: "roles",
      localField: "rol",
      foreignField: "_id",
      as: "rolInfo"
    }
  }
])
```

### Ver clientes pendientes:
```javascript
db.clientes.aggregate([
  {
    $lookup: {
      from: "estadosolicituds",
      localField: "estadoSolicitud",
      foreignField: "_id",
      as: "estado"
    }
  },
  {
    $match: { "estado.nombre": "PENDIENTE" }
  }
])
```

### Crear índices manualmente (si es necesario):
```javascript
db.usuarios.createIndex({ correo: 1 }, { unique: true })
db.roles.createIndex({ nombre: 1 }, { unique: true })
db.permisos.createIndex({ nombre: 1 }, { unique: true })
db.estadosolicituds.createIndex({ nombre: 1 }, { unique: true })
```

---

## ✅ Checklist de Migración

- [ ] Ejecutar seed para crear roles: `npm run seed`
- [ ] Verificar que se crearon los 3 roles (ADMIN, EMPLEADO, CLIENTE)
- [ ] Verificar que se crearon los 3 estados (PENDIENTE, APROBADO, RECHAZADO)
- [ ] Crear al menos un usuario ADMIN para gestión inicial
- [ ] Verificar índices únicos en correos y nombres

---

**Última actualización:** 16 de noviembre de 2025
