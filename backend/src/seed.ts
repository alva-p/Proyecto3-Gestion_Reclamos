import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RolesService } from './roles/roles.service';
import { EstadoSolicitudService } from './estado-solicitud/estado-solicitud.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const rolesService = app.get(RolesService);
  const estadoSolicitudService = app.get(EstadoSolicitudService);

  console.log('🌱 Iniciando seed de datos...');

  // Crear roles
  try {
    const adminRol = await rolesService.findByName('ADMIN');
    if (!adminRol) {
      await rolesService.create({
        nombre: 'ADMIN',
        descripcion: 'Administrador del sistema con acceso completo',
        permisos: [],
      });
      console.log('✅ Rol ADMIN creado');
    } else {
      console.log('ℹ️  Rol ADMIN ya existe');
    }
  } catch (error) {
    console.error('❌ Error creando rol ADMIN:', error.message);
  }

  try {
    const empleadoRol = await rolesService.findByName('EMPLEADO');
    if (!empleadoRol) {
      await rolesService.create({
        nombre: 'EMPLEADO',
        descripcion: 'Empleado con acceso limitado',
        permisos: [],
      });
      console.log('✅ Rol EMPLEADO creado');
    } else {
      console.log('ℹ️  Rol EMPLEADO ya existe');
    }
  } catch (error) {
    console.error('❌ Error creando rol EMPLEADO:', error.message);
  }

  try {
    const clienteRol = await rolesService.findByName('CLIENTE');
    if (!clienteRol) {
      await rolesService.create({
        nombre: 'CLIENTE',
        descripcion: 'Cliente externo',
        permisos: [],
      });
      console.log('✅ Rol CLIENTE creado');
    } else {
      console.log('ℹ️  Rol CLIENTE ya existe');
    }
  } catch (error) {
    console.error('❌ Error creando rol CLIENTE:', error.message);
  }

  // Crear estados de solicitud
  try {
    const pendiente = await estadoSolicitudService.findByName('PENDIENTE');
    if (!pendiente) {
      await estadoSolicitudService.create({
        nombre: 'PENDIENTE',
        descripcion: 'Solicitud de registro pendiente de aprobación',
      });
      console.log('✅ Estado PENDIENTE creado');
    } else {
      console.log('ℹ️  Estado PENDIENTE ya existe');
    }
  } catch (error) {
    console.error('❌ Error creando estado PENDIENTE:', error.message);
  }

  try {
    const aprobado = await estadoSolicitudService.findByName('APROBADO');
    if (!aprobado) {
      await estadoSolicitudService.create({
        nombre: 'APROBADO',
        descripcion: 'Solicitud de registro aprobada',
      });
      console.log('✅ Estado APROBADO creado');
    } else {
      console.log('ℹ️  Estado APROBADO ya existe');
    }
  } catch (error) {
    console.error('❌ Error creando estado APROBADO:', error.message);
  }

  try {
    const rechazado = await estadoSolicitudService.findByName('RECHAZADO');
    if (!rechazado) {
      await estadoSolicitudService.create({
        nombre: 'RECHAZADO',
        descripcion: 'Solicitud de registro rechazada',
      });
      console.log('✅ Estado RECHAZADO creado');
    } else {
      console.log('ℹ️  Estado RECHAZADO ya existe');
    }
  } catch (error) {
    console.error('❌ Error creando estado RECHAZADO:', error.message);
  }

  console.log('🎉 Seed completado exitosamente');
  await app.close();
}

bootstrap();
