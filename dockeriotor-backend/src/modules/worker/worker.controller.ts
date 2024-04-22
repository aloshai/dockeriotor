import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { WorkerGateway } from './worker.gateway';
import { WorkerService } from './worker.service';
import { ActionWorkerDto, CreateWorkerDto } from './dto';
import { DeleteWorkerDto } from './dto/delete-worker.dto';
import { AuthMethod } from '@/enums/auth-method.enum';
import { Auth } from '@/decorators/auth.decorator';

@Controller('worker')
export class WorkerController {
  constructor(
    private readonly workerGateway: WorkerGateway,
    private readonly workerService: WorkerService,
  ) {}

  @Get()
  @Auth(AuthMethod.ApiKey)
  async getWorkersByUserId(@Req() req: any) {
    const user = req.user;

    const mappedWorkers = await this.getWorkersByUserUID(user);

    return mappedWorkers;
  }

  async getWorkersByUserUID(user: any) {
    const workers = await this.workerService.getWorkersByUserId(user._id);

    const activeWorkers = await this.workerGateway.getActiveWorkersByUserUID(
      user.id,
      true,
    );

    const mappedWorkers = workers.map((worker) => {
      const activeWorker = activeWorkers.find(
        (activeWorker) => activeWorker.tag === worker.tag,
      );

      return {
        ...worker.toJSON(),
        isActive: !!activeWorker,
        stats: activeWorker?.stats || null,
      };
    });

    return mappedWorkers;
  }

  @Get('my')
  @Auth(AuthMethod.Jwt)
  async getMyWorkers(@Req() req: any) {
    const user = req.user;

    const mappedWorkers = await this.getWorkersByUserUID(user);

    return mappedWorkers;
  }

  @Post('create')
  @Auth(AuthMethod.Jwt, AuthMethod.ApiKey)
  async createWorker(@Req() req: any, @Body() body: CreateWorkerDto) {
    const user = req.user;

    const workerExists = await this.workerService.workerExists(
      user._id,
      body.tag,
    );

    if (workerExists) {
      throw new BadRequestException('Worker already exists');
    }

    const worker = await this.workerService.createWorker(
      user._id,
      body.tag,
      body.command,
    );

    return worker;
  }

  @Patch('update')
  @Auth(AuthMethod.Jwt, AuthMethod.ApiKey)
  async updateWorker(@Req() req: any, @Body() body: CreateWorkerDto) {
    const user = req.user;

    const worker = await this.workerService.workerExists(user._id, body.tag);

    if (!worker) {
      throw new NotFoundException('Worker not found');
    }

    const updatedWorker = await this.workerService.updateWorker(
      user._id,
      body.tag,
      body.command,
    );

    return updatedWorker;
  }

  @Delete('delete')
  @Auth(AuthMethod.Jwt, AuthMethod.ApiKey)
  async deleteWorker(@Req() req: any, @Body() body: DeleteWorkerDto) {
    const user = req.user;

    const worker = await this.workerService.workerExists(user._id, body.tag);

    if (!worker) {
      throw new NotFoundException('Worker not found');
    }

    const isDeleted = await this.workerService.deleteWorker(user._id, body.tag);

    return {
      isDeleted,
    };
  }

  @Post('action')
  @Auth(AuthMethod.Jwt, AuthMethod.ApiKey)
  async workerAction(@Req() req: any, @Body() body: ActionWorkerDto) {
    const user = req.user;

    const isExistingWorker = await this.workerGateway.isWorkerExists(
      user.id,
      body.tag,
    );

    if (!isExistingWorker) {
      throw new NotFoundException('Worker not found');
    }

    try {
      await this.workerGateway.sendWorkerAction(user.id, body.tag, body.action);

      return 'Action sent';
    } catch (e) {
      return e.message;
    }
  }
}
