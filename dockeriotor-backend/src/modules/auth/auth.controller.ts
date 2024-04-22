import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { DiscordAuthGuard } from './guards/discord-auth.guard';
import { AuthGuard } from './guards/auth.guard';
import { TelegramAuthGuard } from './guards/telegram-auth.guard';
import { AllowedAuthMethods } from '@/decorators/allowed-auth-methods.decorator';
import { AuthMethod } from '@/enums/auth-method.enum';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('discord')
  @UseGuards(DiscordAuthGuard)
  async discordLogin(@Req() req: any) {
    return this.authService.login(req.user);
  }

  @Get('telegram')
  @UseGuards(TelegramAuthGuard)
  async telegramLogin(@Req() req: any) {
    return this.authService.login(req.user);
  }

  @Get('profile')
  @AllowedAuthMethods(AuthMethod.Jwt)
  @UseGuards(AuthGuard)
  getProfile(@Req() req: any) {
    return req.user;
  }
}
