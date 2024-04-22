import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AllowedAuthMethods } from '@/decorators/allowed-auth-methods.decorator';
import { IgnoreUser } from '@/decorators/ignore-user';
import { AuthMethod } from '@/enums/auth-method.enum';
import { Auth } from '@/decorators/auth.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('discord/:id')
  @IgnoreUser()
  @Auth(AuthMethod.ApiKey)
  async getUserByDiscordId(@Param('id') id: string) {
    return this.userService.getUserByDiscordId(id);
  }

  @Get('telegram/:id')
  @IgnoreUser()
  @Auth(AuthMethod.ApiKey)
  async getUserByTelegramId(@Param('id') id: string) {
    return this.userService.getUserByTelegramId(id);
  }

  @Post('discord')
  @IgnoreUser()
  @Auth(AuthMethod.ApiKey)
  async registerDiscordUser(@Body('discordId') id: string) {
    if (await this.userService.discordUserExists(id)) {
      throw new BadRequestException('Discord user already exists');
    }

    return this.userService.registerDiscordUser(id);
  }

  @Post('telegram')
  @IgnoreUser()
  @Auth(AuthMethod.ApiKey)
  async registerTelegramUser(@Body('telegramId') id: string) {
    if (await this.userService.telegramUserExists(id)) {
      throw new BadRequestException('Telegram user already exists');
    }

    return this.userService.registerTelegramUser(id);
  }
}
