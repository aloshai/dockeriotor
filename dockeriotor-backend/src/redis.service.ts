import { Injectable } from '@nestjs/common';
import { createClient } from 'redis';
import { config } from './config';

@Injectable()
export class RedisService {
  public readonly client = createClient({
    url: config().redis,
    disableOfflineQueue: false,
  });

  constructor() {
    this.client.on('error', (error) => {
      console.error(error);
    });

    this.client.connect();
  }
}
