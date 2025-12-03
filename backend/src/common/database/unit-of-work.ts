import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, ClientSession } from 'mongoose';

@Injectable()
export class UnitOfWork {
  constructor(
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async withTransaction<T>(
    work: (session: ClientSession) => Promise<T>,
  ): Promise<T> {
    const session = await this.connection.startSession();

    try {
      // 👇 Ejecutamos el trabajo usando la sesión, pero SIN startTransaction()
      const result = await work(session);
      return result;
    } catch (error) {
      // ya no hay abortTransaction porque no hay transacción
      throw error;
    } finally {
      session.endSession();
    }
  }
}
