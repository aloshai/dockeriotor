import { User } from '@/schemas/user.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async getUserByUId(id: string) {
    return this.userModel.findOne({ id }).exec();
  }

  async getUserByDiscordId(discordId: string) {
    return this.userModel
      .findOne({
        discordId,
      })
      .exec();
  }

  async getUserByTelegramId(telegramId: string) {
    return this.userModel
      .findOne({
        telegramId,
      })
      .exec();
  }

  async telegramUserExists(telegramId: string) {
    return this.userModel.exists({
      telegramId,
    });
  }

  async discordUserExists(discordId: string) {
    return this.userModel.exists({
      discordId,
    });
  }

  async registerDiscordUser(discordId: string) {
    return this.userModel.create({
      discordId,
    });
  }

  async registerTelegramUser(telegramId: string) {
    return this.userModel.create({
      telegramId,
    });
  }
}
