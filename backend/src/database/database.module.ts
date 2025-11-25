import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/gestion_reclamos';

@Module({
  imports: [
    MongooseModule.forRoot(mongoUri),
  ],
})
export class DatabaseModule {}
