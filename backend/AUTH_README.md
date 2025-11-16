# Sistema de Autenticación y Autorización - Backend

## 📋 Descripción

Este backend implementa un sistema completo de autenticación y autorización con JWT, incluyendo:

- ✅ Registro de usuarios internos (empleados y administradores)
- ✅ Validación de correo único
- ✅ Encriptación de contraseñas con bcrypt
- ✅ Login con JWT (tokens válidos por 24 horas)
- ✅ Sistema de roles y permisos
- ✅ Guards para protección de rutas
- ✅ Gestión de solicitudes de registro de clientes (pendiente/aprobado/rechazado)

## 🚀 Instalación

### 1. Instalar dependencias

```bash
npm install
```

### 2. Instalar dependencias adicionales necesarias

```bash
npm install @nestjs/jwt @nestjs/passport @nestjs/config passport passport-jwt bcrypt class-validator class-transformer
npm install -D @types/bcrypt @types/passport-jwt
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto backend basándote en `.env.example`:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus configuraciones:

```env
MONGO_URI=mongodb://localhost:27017/gestion_reclamos
JWT_SECRET=tu-clave-secreta-muy-segura
JWT_EXPIRATION=24h
PORT=3000
NODE_ENV=development
```

### 4. Inicializar datos base (Seed)

Ejecuta el seed para crear los roles y estados de solicitud iniciales:

```bash
npm run build
node dist/seed.js
```

Esto creará:
- **Roles**: ADMIN, EMPLEADO, CLIENTE
- **Estados de solicitud**: PENDIENTE, APROBADO, RECHAZADO

## 📡 Endpoints de la API

### Autenticación

#### POST /auth/login
Iniciar sesión

**Body:**
```json
{
  "correo": "usuario@example.com",
  "contraseña": "password123"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": "64f1234567890abcdef12345",
    "nombre": "Usuario Ejemplo",
    "correo": "usuario@example.com",
    "rol": "EMPLEADO"
  }
}
```

#### POST /auth/register/empleado
Registrar un nuevo empleado o administrador

**Body:**
```json
{
  "nombre": "Juan Pérez",
  "correo": "juan@empresa.com",
  "contraseña": "password123",
  "puesto": "Desarrollador",
  "subareaId": "64f1234567890abcdef12345" // opcional
}
```

#### POST /auth/register/cliente
Registrar solicitud de cliente (queda en estado PENDIENTE)

**Body:**
```json
{
  "nombre": "María García",
  "correo": "maria@cliente.com",
  "contraseña": "password123",
  "empresa": "Tech Solutions SA",
  "telefono": "+54 11 1234-5678",
  "direccion": "Av. Principal 123, CABA"
}
```

### Gestión de Clientes (Requiere autenticación)

#### GET /clientes/solicitudes/pendientes
Listar solicitudes de registro pendientes (Solo ADMIN)

**Headers:**
```
Authorization: Bearer {token}
```

#### PUT /clientes/:id/aprobar
Aprobar solicitud de cliente (Solo ADMIN)

**Headers:**
```
Authorization: Bearer {token}
```

#### PUT /clientes/:id/rechazar
Rechazar solicitud de cliente (Solo ADMIN)

**Headers:**
```
Authorization: Bearer {token}
```

## 🔐 Sistema de Roles

### Roles disponibles:

1. **ADMIN**: Acceso completo al sistema
   - Puede aprobar/rechazar solicitudes de clientes
   - Puede gestionar todos los recursos

2. **EMPLEADO**: Acceso limitado
   - Puede ver información
   - No puede aprobar solicitudes

3. **CLIENTE**: Acceso básico
   - Solo puede acceder a sus propios datos
   - Debe ser aprobado antes de poder acceder

### Uso de Guards en controladores

```typescript
@Controller('ruta')
@UseGuards(JwtAuthGuard, RolesGuard) // Requiere autenticación y roles
export class MiController {
  
  @Get()
  @Roles('ADMIN', 'EMPLEADO') // Solo estos roles pueden acceder
  async metodo() {
    // ...
  }
}
```

## 🏗️ Estructura del Proyecto

```
src/
├── auth/
│   ├── guards/
│   │   ├── jwt-auth.guard.ts      # Guard de autenticación JWT
│   │   └── roles.guard.ts          # Guard de autorización por roles
│   ├── strategies/
│   │   └── jwt.strategy.ts         # Estrategia de validación JWT
│   ├── decorators/
│   │   ├── roles.decorator.ts      # Decorador @Roles()
│   │   └── current-user.decorator.ts # Decorador @CurrentUser()
│   ├── dto/
│   │   ├── login.dto.ts
│   │   ├── register-empleado.dto.ts
│   │   └── register-cliente.dto.ts
│   ├── auth.service.ts
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   ├── auth.service.spec.ts
│   └── auth.controller.spec.ts
├── usuarios/
│   ├── repository/
│   │   └── usuarios.repository.ts
│   ├── Entidad/
│   │   └── usuario.schema.ts
│   ├── dto/
│   ├── usuarios.service.ts
│   └── usuarios.module.ts
├── empleados/
├── clientes/
├── roles/
├── permisos/
├── estado-solicitud/
└── seed.ts                          # Script para inicializar datos
```

## 🧪 Testing

Ejecutar tests:

```bash
npm run test
```

Ejecutar tests con coverage:

```bash
npm run test:cov
```

## 📝 Flujo de Registro de Clientes

1. Cliente se registra usando `POST /auth/register/cliente`
2. Se crea el usuario con `activo: false`
3. Se crea el cliente con `estadoSolicitud: PENDIENTE`
4. Admin revisa solicitudes con `GET /clientes/solicitudes/pendientes`
5. Admin aprueba con `PUT /clientes/:id/aprobar`:
   - Cambia estado a APROBADO
   - Activa el usuario (`activo: true`)
6. Cliente puede hacer login

## 🔧 Desarrollo

Ejecutar en modo desarrollo:

```bash
npm run start:dev
```

Build:

```bash
npm run build
```

Ejecutar en producción:

```bash
npm run start:prod
```

## 📦 Dependencias Principales

- `@nestjs/jwt`: Manejo de JWT
- `@nestjs/passport`: Integración con Passport.js
- `passport-jwt`: Estrategia JWT para Passport
- `bcrypt`: Encriptación de contraseñas
- `class-validator`: Validación de DTOs
- `@nestjs/mongoose`: ORM para MongoDB

## 🤝 Contribución

Para contribuir al proyecto, sigue estos pasos:

1. Crea una rama para tu feature
2. Implementa los cambios
3. Escribe tests
4. Crea un Pull Request

## ⚠️ Notas Importantes

- **Seguridad**: Cambia el `JWT_SECRET` en producción por un valor seguro y único
- **Passwords**: Todas las contraseñas se encriptan con bcrypt (10 salt rounds)
- **Tokens**: Los tokens JWT expiran en 24 horas por defecto
- **Correos**: Los correos se convierten a minúsculas y se eliminan espacios

## 📄 Licencia

UNLICENSED
