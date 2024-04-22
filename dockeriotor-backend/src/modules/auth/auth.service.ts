import { User, UserDocument } from '@/schemas';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,

    private jwtService: JwtService,
  ) {}

  async validateUserByTelegramId(telegramId: any): Promise<User> {
    let user = await this.userModel.findOne({ telegramId: telegramId });
    if (!user) {
      user = await this.userModel.create({ telegramId: telegramId });
    }

    return user;
  }

  async validateUserByDiscordId(discordId: any): Promise<User> {
    let user = await this.userModel.findOne({ discordId: discordId });
    if (!user) {
      user = await this.userModel.create({ discordId: discordId });
    }

    return user;
  }

  async login(user: UserDocument) {
    const payload = {
      discordId: user.discordId,
      sub: user._id,
      id: user.id,
      _id: user._id,
      telegramId: user.telegramId,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
