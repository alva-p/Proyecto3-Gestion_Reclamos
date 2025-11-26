import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterEmpleadoDto } from './dto/register-empleado.dto';
import { RegisterClienteDto } from './dto/register-cliente.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register/empleado')
  @HttpCode(HttpStatus.CREATED)
  async registerEmpleado(@Body() registerDto: RegisterEmpleadoDto) {
    return this.authService.registerEmpleado(registerDto);
  }

  @Post('register/cliente')
  @HttpCode(HttpStatus.CREATED)
  async registerCliente(@Body() registerDto: RegisterClienteDto) {
    return this.authService.registerCliente(registerDto);
  }
}
