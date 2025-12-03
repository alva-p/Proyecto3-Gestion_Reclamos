# 📮 Guía Completa de Postman - Gestión de Reclamos

Esta guía te enseña cómo usar Postman para probar y trabajar con la API del proyecto.

---

## 📥 ¿Qué es Postman?

**Postman** es una herramienta que te permite:
- Hacer peticiones HTTP a tu API (GET, POST, PATCH, DELETE)
- Ver las respuestas en tiempo real
- Guardar colecciones de endpoints para reutilizarlos
- Compartir configuraciones con tu equipo

**Descargar**: https://www.postman.com/downloads/

---

## 🚀 Configuración Inicial

### **1. Importar la Colección del Proyecto**

Tu compañero compartió una colección con todos los endpoints configurados:

1. Abrir Postman
2. Click en **"Import"** (arriba a la izquierda)
3. Opciones:
   - **Link**: Si tenés un link, pegarlo y click en "Continue"
   - **File**: Si tenés un archivo `.json`, arrastrarlo o seleccionarlo
4. Click en **"Import"**
5. ✅ La colección aparecerá en el panel izquierdo

### **2. Configurar Variables de Entorno** (Opcional pero recomendado)

Para no tener que escribir `http://localhost:3000` en cada request:

1. Click en **"Environments"** (panel izquierdo)
2. Click en **"+"** para crear un nuevo entorno
3. Nombre: `Local`
4. Agregar variable:
   - **Variable**: `base_url`
   - **Initial Value**: `http://localhost:3000`
   - **Current Value**: `http://localhost:3000`
5. **Save**
6. Seleccionar el entorno "Local" en el dropdown de arriba a la derecha

Ahora en tus requests podés usar: `{{base_url}}/areas` en lugar de `http://localhost:3000/areas`

---

## 📚 Endpoints Principales

### **🏢 ÁREAS**

#### **Listar todas las áreas**
```http
GET {{base_url}}/areas
```

**Respuesta exitosa** (200):
```json
[
  {
    "_id": "674a1b2c3d4e5f6789012345",
    "nombre": "Soporte Técnico",
    "fechaCreacion": "2024-11-30T10:00:00.000Z"
  },
  {
    "_id": "674a1b2c3d4e5f6789012346",
    "nombre": "Desarrollo",
    "fechaCreacion": "2024-11-30T10:05:00.000Z"
  }
]
```

---

#### **Crear una nueva área**
```http
POST {{base_url}}/areas
Content-Type: application/json

{
  "nombre": "Soporte Técnico"
}
```

**Respuesta exitosa** (201):
```json
{
  "_id": "674a1b2c3d4e5f6789012345",
  "nombre": "Soporte Técnico",
  "fechaCreacion": "2024-11-30T10:00:00.000Z"
}
```

**Posibles errores**:
- `400 Bad Request`: Falta el campo "nombre"
- `500 Internal Server Error`: Problema con MongoDB

---

#### **Obtener un área por ID**
```http
GET {{base_url}}/areas/674a1b2c3d4e5f6789012345
```

---

#### **Actualizar un área**
```http
PATCH {{base_url}}/areas/674a1b2c3d4e5f6789012345
Content-Type: application/json

{
  "nombre": "Soporte Técnico Avanzado"
}
```

---

#### **Eliminar un área**
```http
DELETE {{base_url}}/areas/674a1b2c3d4e5f6789012345
```

**Respuesta exitosa** (204): No Content

---

### **📋 RECLAMOS**

#### **Listar todos los reclamos**
```http
GET {{base_url}}/reclamos
```

**Respuesta** (ejemplo simplificado):
```json
[
  {
    "_id": "674a1b2c3d4e5f6789012347",
    "numeroReclamo": "REC-2024-00001",
    "titulo": "Error en login",
    "descripcion": "Al intentar iniciar sesión aparece error 500",
    "estado": {
      "_id": "...",
      "nombre": "Enviado"
    },
    "area": {
      "_id": "...",
      "nombre": "Soporte Técnico"
    },
    "prioridad": {
      "_id": "...",
      "nombre": "Alta"
    },
    "fechaCreacion": "2024-11-30T11:00:00.000Z"
  }
]
```

---

#### **Crear un reclamo**
```http
POST {{base_url}}/reclamos
Content-Type: application/json

{
  "titulo": "Error en el módulo de login",
  "descripcion": "Cuando intento iniciar sesión con mi usuario, el sistema devuelve un error 500 y no me permite acceder a la plataforma",
  "tipoReclamo": "674a1b2c3d4e5f6789012348",
  "prioridad": "674a1b2c3d4e5f6789012349",
  "criticidad": "674a1b2c3d4e5f678901234a",
  "area": "674a1b2c3d4e5f6789012345",
  "proyectoId": "674a1b2c3d4e5f678901234b"
}
```

**⚠️ IMPORTANTE**: Todos los campos con ID deben ser ObjectIds válidos de MongoDB (24 caracteres hexadecimales).

**Validaciones**:
- `titulo`: Mínimo 3, máximo 100 caracteres
- `descripcion`: Mínimo 20, máximo 2000 caracteres
- Todos los campos son obligatorios excepto `subarea`

**Respuesta exitosa** (201):
```json
{
  "_id": "674a1b2c3d4e5f6789012347",
  "numeroReclamo": "REC-2024-00001",
  "titulo": "Error en el módulo de login",
  "descripcion": "Cuando intento iniciar sesión...",
  "estado": {
    "_id": "...",
    "nombre": "Enviado"
  },
  // ... resto de los campos poblados
}
```

---

#### **Obtener un reclamo por ID**
```http
GET {{base_url}}/reclamos/674a1b2c3d4e5f6789012347
```

---

#### **Actualizar un reclamo**
```http
PATCH {{base_url}}/reclamos/674a1b2c3d4e5f6789012347
Content-Type: application/json

{
  "titulo": "Error crítico en el módulo de login",
  "descripcion": "Actualización: El error afecta a todos los usuarios"
}
```

---

### **🏷️ TIPOS DE RECLAMO**

```http
GET {{base_url}}/tipo-reclamo
```

**Respuesta**:
```json
[
  {
    "_id": "674a1b2c3d4e5f6789012348",
    "nombre": "Error"
  },
  {
    "_id": "674a1b2c3d4e5f6789012349",
    "nombre": "Mejora"
  }
]
```

---

### **⚡ PRIORIDADES**

```http
GET {{base_url}}/prioridad
```

**Valores comunes**: Baja, Media, Alta, Crítica

---

### **🔴 CRITICIDADES**

```http
GET {{base_url}}/criticidad
```

**Valores comunes**: Baja, Media, Alta, Crítica

---

### **📁 PROYECTOS**

```http
GET {{base_url}}/proyectos
```

---

## 🎯 Flujo Completo de Prueba

### **Escenario: Crear un reclamo desde cero**

#### **Paso 1: Obtener IDs necesarios**

Ejecutar estos requests y copiar un `_id` de cada uno:

1. **Áreas**
   ```http
   GET {{base_url}}/areas
   ```
   📋 Copiar un `_id` de área

2. **Tipos de Reclamo**
   ```http
   GET {{base_url}}/tipo-reclamo
   ```
   📋 Copiar un `_id` de tipo

3. **Prioridades**
   ```http
   GET {{base_url}}/prioridad
   ```
   📋 Copiar un `_id` de prioridad

4. **Criticidades**
   ```http
   GET {{base_url}}/criticidad
   ```
   📋 Copiar un `_id` de criticidad

5. **Proyectos**
   ```http
   GET {{base_url}}/proyectos
   ```
   📋 Copiar un `_id` de proyecto

#### **Paso 2: Crear el reclamo**

Usar los IDs copiados:

```http
POST {{base_url}}/reclamos
Content-Type: application/json

{
  "titulo": "Error en reporte de ventas",
  "descripcion": "El sistema no genera el reporte de ventas del mes actual, aparece una pantalla en blanco",
  "tipoReclamo": "ID_COPIADO_PASO_2",
  "prioridad": "ID_COPIADO_PASO_3",
  "criticidad": "ID_COPIADO_PASO_4",
  "area": "ID_COPIADO_PASO_1",
  "proyectoId": "ID_COPIADO_PASO_5"
}
```

#### **Paso 3: Verificar**

```http
GET {{base_url}}/reclamos
```

Deberías ver tu reclamo en la lista.

---

## 💡 Tips y Trucos de Postman

### **1. Guardar Respuestas como Ejemplos**

Después de hacer un request exitoso:
1. Click en **"Save Response"** → **"Save as Example"**
2. Esto guarda el request y la respuesta como referencia
3. Útil para documentar y compartir con el equipo

### **2. Tests Automáticos**

Podés agregar tests a tus requests. Ejemplo:

En la pestaña **"Tests"** del request:

```javascript
// Verificar que el status code sea 200
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

// Verificar que la respuesta tenga un campo _id
pm.test("Response has _id field", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('_id');
});
```

### **3. Pre-request Scripts**

Para generar datos dinámicos antes de enviar el request:

```javascript
// Generar un título único para cada reclamo
pm.variables.set("timestamp", Date.now());
```

Luego en el body usar:
```json
{
  "titulo": "Reclamo de prueba {{timestamp}}"
}
```

### **4. Colecciones Runner**

Para ejecutar múltiples requests en secuencia:
1. Click derecho en la colección → **"Run collection"**
2. Seleccionar los requests a ejecutar
3. **Run**
4. Ver resultados de todos los tests

---

## 🐛 Errores Comunes

### **Error: "Cannot POST /reclamos"**
- ✅ Verificar que el backend esté corriendo
- ✅ Verificar la URL: debe ser `http://localhost:3000/reclamos`

### **Error: "Cast to ObjectId failed"**
- ❌ Estás enviando un ID inválido
- ✅ Los IDs deben ser strings de 24 caracteres hexadecimales
- ✅ Ejemplo válido: `"674a1b2c3d4e5f6789012345"`

### **Error: "Validation failed"**
- ❌ Falta un campo requerido o no cumple las validaciones
- ✅ Revisar el mensaje de error, indica qué campo tiene problemas

### **Error: "CORS"** (si probás desde el navegador)
- Ya está configurado en el backend
- Solo afecta cuando hacés requests desde el frontend, no desde Postman

---

## 📤 Compartir con el Equipo

### **Exportar tu colección**

1. Click derecho en la colección
2. **"Export"**
3. Seleccionar formato: **Collection v2.1** (recomendado)
4. **Export**
5. Compartir el archivo `.json` con tu equipo

### **Compartir con link**

1. Click derecho en la colección
2. **"Share collection"**
3. **"Get public link"**
4. Copiar y compartir el link

---

## 🎓 Recursos Adicionales

- **Documentación oficial**: https://learning.postman.com/docs/
- **Videos tutoriales**: https://www.youtube.com/postman
- **Postman Academy**: Cursos gratis para aprender más

---

## ✅ Checklist de Testing

Antes de dar por terminado un endpoint, verificar:

- [ ] El request se ejecuta exitosamente
- [ ] La respuesta tiene el status code correcto (200, 201, 204, etc.)
- [ ] Los datos se guardan correctamente en MongoDB
- [ ] Los errores devuelven mensajes claros
- [ ] Las validaciones funcionan (campos requeridos, tipos, longitudes)
- [ ] El endpoint aparece correctamente en el frontend

---

¡Con esta guía ya podés usar Postman como un pro! 🚀
