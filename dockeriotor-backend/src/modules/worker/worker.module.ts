import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Worker, WorkerSchema } from '@/schemas';
import { UserModule } from '../user/user.module';
import { WorkerGateway } from './worker.gateway';
import { WorkerService } from './worker.service';
import { WorkerController } from './worker.controller';
import { RedisService } from '@/redis.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Worker.name,
        schema: WorkerSchema,
      },
    ]),
    UserModule,
  ],
  controllers: [WorkerController],
  providers: [WorkerService, WorkerGateway, RedisService],
})
export class WorkerModule {}
