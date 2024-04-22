import { Worker } from '@/schemas';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserService } from '../user/user.service';

const REQUIRED_ENV_VARIABLES = [
  'DEVICE_ID',
  'DEVICE_NAME',
  'USER_ID',
  'OPERATING_SYSTEM',
  'USEGPUS',
];

export class WorkerService {
  constructor(
    @InjectModel(Worker.name)
    private readonly workerModel: Model<Worker>,

    private readonly userService: UserService,
  ) {}

  checkEnvironmentVariables(envVariables) {
    const missingVariables = REQUIRED_ENV_VARIABLES.filter(
      (key) => !envVariables[key],
    );

    if (missingVariables.length > 0) {
      return false;
    }

    return true;
  }

  extractEnvVariables(command: string) {
    const platform = command.includes('"Windows"')
      ? 'Windows'
      : command.includes('"Linux"')
        ? 'Linux'
        : 'macOS';

    const envVariables =
      platform == 'Windows'
        ? this.extractWindowsEnvVariables(command)
        : this.extractOtherEnvVariables(command);

    return envVariables;
  }

  async createWorker(userId: Types.ObjectId, tag: string, command: string) {
    const envVariables = await this.extractEnvVariables(command);

    const isValid = this.checkEnvironmentVariables(envVariables);

    if (!isValid) {
      throw new Error('Missing required environment variables');
    }

    const worker = new this.workerModel({
      owner: userId,
      tag,
      command,
      environment: envVariables,
    });

    await worker.save();

    return worker;
  }

  async extractWindowsEnvVariables(dockerCommand) {
    const envPattern = /-e\s*([^=]+)=["']?([^'"\s]+)["']?/g;
    let matches;
    const envVariables = {};

    while ((matches = envPattern.exec(dockerCommand)) !== null) {
      const key = matches[1];
      const value = matches[2];
      envVariables[key] = value;
    }

    return envVariables;
  }

  async extractOtherEnvVariables(command: string) {
    const regex = /--(.*?)=(?:\"(.*?)\"|[\w-]+)/g;

    let environments = {};

    const debianCommands = command.match(regex);

    if (!debianCommands) {
      return environments;
    }

    debianCommands.forEach((command) => {
      const [key, value] = command.split('=');

      const sanitizedKey = key.replace('--', '').toUpperCase();
      const sanitizedValue = value.replace(/"/g, '');

      environments[sanitizedKey] = sanitizedValue;
    });

    return environments;
  }

  async updateWorker(userId: Types.ObjectId, tag: string, command: string) {
    const envVariables = await this.extractEnvVariables(command);

    const isValid = this.checkEnvironmentVariables(envVariables);

    if (!isValid) {
      throw new Error('Missing required environment variables');
    }

    const result = await this.workerModel.updateOne(
      { owner: userId, tag },
      {
        $set: {
          command,
          environment: envVariables,
        },
      },
    );

    return result.modifiedCount > 0;
  }

  async deleteWorker(userId: Types.ObjectId, tag: string) {
    const result = await this.workerModel.deleteOne({ owner: userId, tag });

    return result.deletedCount > 0;
  }

  async workerExists(userId: Types.ObjectId, tag: string) {
    return this.workerModel.exists({ owner: userId, tag });
  }

  async getWorkersByUserId(userId: Types.ObjectId) {
    return this.workerModel.find({ owner: userId });
  }

  async getWorkerByUserUID(userUID: string, tag: string) {
    const user = await this.userService.getUserByUId(userUID);

    return this.workerModel.findOne({
      owner: user._id,
      tag,
    });
  }
}
