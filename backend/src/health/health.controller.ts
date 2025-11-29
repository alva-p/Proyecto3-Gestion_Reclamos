// src/health/health.controller.ts
import { Controller, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Controller('health')
export class HealthController {
  constructor(
    @InjectConnection() private readonly connection: Connection
  ) {}

  @Get()
  async check() {
    const mongoStatus = this.connection.readyState === 1 ? 'connected' : 'disconnected';

    return {
      status: 'ok',
      mongo: mongoStatus,
      timestamp: new Date().toISOString(),
    };
  }
}
