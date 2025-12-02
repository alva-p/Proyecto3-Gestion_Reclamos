# 🎯 Guía de Testing - Gestión de Reclamos y Áreas

Esta guía te ayudará a probar las nuevas funcionalidades implementadas en el proyecto.

---

## ✅ Funcionalidades Implementadas

### 1. **Crear Reclamos desde el Frontend**
- ✅ Formulario con validación completa
- ✅ Selección dinámica de áreas, tipos, prioridades y criticidades
- ✅ Conexión con la API del backend
- ✅ Feedback visual (loading, errores, éxito)

### 2. **Gestión de Áreas**
- ✅ Crear nuevas áreas
- ✅ Listar todas las áreas
- ✅ Eliminar áreas
- ✅ Actualización automática en el formulario de reclamos

### 3. **API Services**
- ✅ Servicio completo de reclamos (crear, listar, obtener por ID, actualizar)
- ✅ Servicio completo de áreas (CRUD completo)
- ✅ Servicios auxiliares (tipos de reclamo, prioridades, criticidades, proyectos)

---

## 🚀 Cómo Probar la Aplicación

### **Paso 1: Levantar el Backend**

```powershell
cd backend
docker compose up -d
npm run start:dev
```

Verifica que el backend esté corriendo en: http://localhost:3000/health

### **Paso 2: Levantar el Frontend**

En otra terminal:

```powershell
cd frontend
npm run dev
```

El frontend estará en: http://localhost:5173

### **Paso 3: Crear Datos de Prueba**

Antes de crear reclamos, necesitás tener datos básicos en la BD. Hay dos formas:

#### Opción A: Usar el Seed del Backend

```powershell
cd backend
npm run seed
```

Esto creará automáticamente:
- Áreas
- Tipos de reclamo
- Prioridades
- Criticidades
- Clientes y proyectos de ejemplo

#### Opción B: Crear manualmente desde el frontend

1. **Iniciar sesión** como administrador
2. Ir a **"Áreas"** en el menú lateral
3. Crear las áreas necesarias (ej: Soporte Técnico, Desarrollo, RRHH)
4. Las demás entidades (tipos, prioridades) deben crearse desde Postman o MongoDB

---

## 🧪 Escenarios de Prueba

### **Prueba 1: Crear un Área**

1. Iniciar sesión como **administrador**
2. Ir a **"Áreas"**
3. Click en **"Nueva Área"**
4. Ingresar un nombre (ej: "Soporte Técnico")
5. Click en **"Crear Área"**
6. ✅ Verificar que aparece en la lista

### **Prueba 2: Crear un Reclamo**

1. Iniciar sesión como **cliente**
2. Ir a **"Nuevo Reclamo"**
3. Completar el formulario:
   - **Proyecto**: Seleccionar uno de la lista
   - **Título**: "Error en login del sistema"
   - **Descripción**: Mínimo 20 caracteres describiendo el problema
   - **Área**: Seleccionar "Soporte Técnico"
   - **Tipo**: Seleccionar tipo de reclamo
   - **Prioridad**: Alta
   - **Criticidad**: Media
4. Click en **"Registrar Reclamo"**
5. ✅ Verificar mensaje de éxito
6. ✅ Ir a "Mis Reclamos" y verificar que aparece

### **Prueba 3: Verificar que las Áreas se actualizan en tiempo real**

1. Como **administrador**, ir a **"Áreas"**
2. Crear una nueva área (ej: "Infraestructura")
3. Abrir otra pestaña del navegador
4. Como **cliente**, ir a **"Nuevo Reclamo"**
5. ✅ Verificar que la nueva área aparece en el select

### **Prueba 4: Validaciones del Formulario**

Probar que las validaciones funcionan:

- ❌ Intentar enviar sin completar campos obligatorios
- ❌ Título con menos de 3 caracteres
- ❌ Descripción con menos de 20 caracteres
- ✅ Todos los campos deben mostrar error antes de enviar

---

## 📮 Testing con Postman

### **Importar la Colección**

Tu compañero te pasó un link de Postman con los endpoints configurados. Para usarlo:

1. Abrir Postman
2. Click en **"Import"**
3. Pegar el link compartido o importar el archivo JSON
4. La colección incluirá todos los endpoints con ejemplos

### **Endpoints Principales**

#### **Áreas**

```http
# Crear área
POST http://localhost:3000/areas
Content-Type: application/json

{
  "nombre": "Soporte Técnico"
}

# Listar áreas
GET http://localhost:3000/areas

# Obtener área por ID
GET http://localhost:3000/areas/{id}

# Eliminar área
DELETE http://localhost:3000/areas/{id}
```

#### **Reclamos**

```http
# Crear reclamo
POST http://localhost:3000/reclamos
Content-Type: application/json

{
  "titulo": "Error en login",
  "descripcion": "Al intentar iniciar sesión aparece error 500",
  "tipoReclamo": "6789abc123def456...",
  "prioridad": "6789abc123def456...",
  "criticidad": "6789abc123def456...",
  "area": "6789abc123def456...",
  "proyectoId": "6789abc123def456..."
}

# Listar todos los reclamos
GET http://localhost:3000/reclamos

# Obtener reclamo por ID
GET http://localhost:3000/reclamos/{id}

# Actualizar reclamo
PATCH http://localhost:3000/reclamos/{id}
```

**⚠️ IMPORTANTE**: Los IDs (tipoReclamo, prioridad, etc.) deben ser ObjectIds válidos de MongoDB. Los obtenés listando primero esas entidades.

### **Flujo de Testing con Postman**

1. **Listar áreas**: `GET /areas`
   - Si está vacía, crear algunas con `POST /areas`

2. **Listar tipos de reclamo**: `GET /tipo-reclamo`
   - Copiar un `_id` para usar en el reclamo

3. **Listar prioridades**: `GET /prioridad`
   - Copiar un `_id`

4. **Listar criticidades**: `GET /criticidad`
   - Copiar un `_id`

5. **Listar proyectos**: `GET /proyectos`
   - Copiar un `_id`

6. **Crear reclamo**: `POST /reclamos`
   - Usar los IDs copiados anteriormente

7. **Verificar en el frontend**: Los cambios deben aparecer automáticamente

---

## 🔍 Verificar en MongoDB

Podés ver los datos directamente en MongoDB usando **Mongo Express**:

1. Abrir: http://localhost:8081
2. Usuario: `admin`
3. Password: `admin123`
4. Seleccionar la base de datos
5. Ver las colecciones: `areas`, `reclamos`, `prioridades`, etc.

---

## 🐛 Solución de Problemas

### **Error: "Error al cargar los datos del formulario"**

- Verificar que el backend esté corriendo
- Verificar que MongoDB esté activo: `docker ps`
- Verificar que haya datos en las colecciones (tipos, prioridades, etc.)

### **Error: "CORS"**

- Ya está configurado en el backend para permitir `localhost:5173`
- Si usás otro puerto, agregalo en `backend/src/main.ts`

### **No aparecen proyectos al crear reclamo**

- Ejecutar el seed: `npm run seed` en el backend
- O crear proyectos manualmente usando Postman

### **El área que creé no aparece en el select de reclamos**

- Refrescar la página del formulario
- O navegar a otra vista y volver

---

## 📊 Datos de Ejemplo con Postman

Si no querés usar el seed, podés crear datos manualmente en este orden:

1. **Áreas** → Crear: Soporte, Desarrollo, RRHH
2. **Tipos de Reclamo** → Crear: Error, Mejora, Consulta
3. **Prioridades** → Crear: Baja, Media, Alta, Crítica
4. **Criticidades** → Crear: Baja, Media, Alta, Crítica
5. **Clientes** → Crear al menos uno
6. **Proyectos** → Crear al menos uno asociado al cliente
7. **Reclamos** → Ya podés crear reclamos!

---

## 🎉 ¡Todo Listo!

Ahora tenés un sistema completo para:
- ✅ Crear reclamos desde el frontend
- ✅ Gestionar áreas dinámicamente
- ✅ Ver actualizaciones en tiempo real
- ✅ Probar todo con Postman

Si tenés dudas o encontrás algún bug, revisá la consola del navegador (F12) y la terminal del backend para ver los logs detallados.
