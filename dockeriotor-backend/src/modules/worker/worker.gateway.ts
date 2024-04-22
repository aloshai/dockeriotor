import {
  WebSocketGateway,
  OnGatewayConnection,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { UserService } from '../user/user.service';
import { WorkerService } from './worker.service';
import { RedisService } from '@/redis.service';
import { WorkerActionType } from '@/enums/worker-action-type.enum';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { NotFoundException } from '@nestjs/common';

@WebSocketGateway()
export class WorkerGateway
  implements OnGatewayConnection<Socket>, OnGatewayDisconnect<Socket>
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly userService: UserService,
    private readonly workerService: WorkerService,
    private readonly redisService: RedisService,
  ) {}

  async handleDisconnect(
    client: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  ) {
    const { user, tag } = client.data;

    if (!user || !tag) {
      return;
    }
  }

  async handleConnection(client: Socket) {
    const { user_id, tag } = client.handshake.auth;

    if (!user_id || !tag) {
      console.debug('Invalid connection');
      return client.disconnect();
    }

    const user = await this.userService.getUserByUId(user_id as string);

    if (!user) {
      console.debug('User not found');
      return client.disconnect();
    }

    const oldSockets = await this.server.fetchSockets();

    for (const socket of oldSockets) {
      if (socket.data?.user?.id === user.id && socket.data?.tag === tag) {
        console.log('Disconnecting old socket');
        socket.disconnect();
      }
    }

    console.debug('Worker connected', user.id, tag);

    const workerIsExists = await this.workerService.workerExists(
      user._id,
      tag as string,
    );

    if (!workerIsExists) {
      console.debug('Worker not found');
      return client.disconnect();
    }

    client.data = { user, tag };
    await client.join(user.id);

    const workerData = await this.workerService.getWorkerByUserUID(
      user.id,
      tag,
    );

    if (!workerData) {
      console.debug('Worker data not found');
      return client.disconnect();
    }

    client.emit('update_worker_data', workerData);
  }

  @SubscribeMessage('stats')
  async handleStatus(client: Socket, data: any) {
    const { stats } = data;

    if (!stats) {
      return;
    }

    const { user, tag } = client.data;

    if (!user || !tag) {
      client.disconnect();
      return;
    }

    await this.redisService.client.set(
      `worker:${user.id}:${tag}`,
      JSON.stringify(stats),
      {
        EX: 60,
      },
    );
  }

  async sendWorkerData(userUID: string, workerTag: string) {
    console.log('Sending worker data', userUID, workerTag);
    const worker = await this.getActiveWorker(userUID, workerTag);

    if (!worker) {
      throw new NotFoundException('Worker not found');
    }

    const workerData = await this.workerService.getWorkerByUserUID(
      userUID,
      workerTag,
    );

    if (!workerData) {
      throw new NotFoundException('Worker Data not found');
    }

    worker.emit('update_worker_data', workerData);
  }

  async getActiveWorkers() {
    const sockets = await this.server.fetchSockets();

    return sockets.map((socket) => {
      return {
        user: socket.data?.user,
        tag: socket.data?.tag,
      };
    });
  }

  async getActiveWorkersByUserUID(userUID: string, withStats = false) {
    const sockets = await this.server.fetchSockets();

    const workers = sockets
      .filter((socket) => socket.data?.user?.id === userUID)
      .map((socket) => {
        return {
          user: socket.data?.user,
          tag: socket.data?.tag,
          stats: null,
        };
      });

    if (withStats) {
      for (const worker of workers) {
        const stats = await this.redisService.client.get(
          `worker:${userUID}:${worker.tag}`,
        );

        worker.stats = JSON.parse(stats);
      }
    }

    return workers;
  }

  async isWorkerExists(userUID: string, workerTag: string) {
    const sockets = await this.server.fetchSockets();

    return sockets.some(
      (socket) =>
        socket.data?.user?.id === userUID && socket.data?.tag === workerTag,
    );
  }

  async getActiveWorker(userUID: string, workerTag: string) {
    const sockets = await this.server.fetchSockets();

    return sockets.find(
      (socket) =>
        socket.data?.user?.id === userUID && socket.data?.tag === workerTag,
    );
  }

  async sendWorkerAction(
    userUID: string,
    workerTag: string,
    workerActionType: WorkerActionType,
  ) {
    const worker = await this.getActiveWorker(userUID, workerTag);

    if (!worker) {
      throw new NotFoundException('Worker not found');
    }

    worker.emit('action', { action: workerActionType });

    return {
      success: true,
    };
  }
}
