import { config } from '@/config';
import { AllowedAuthMethods } from '@/decorators/allowed-auth-methods.decorator';
import { IgnoreUser } from '@/decorators/ignore-user';
import { UserService } from '@/modules/user/user.service';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard extends PassportAuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private readonly userService: UserService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<any> {
    const request = context.switchToHttp().getRequest();

    const allowAuthMethods = this.reflector.get<string[]>(
      'allowedAuthMethods',
      context.getHandler(),
    );

    const ignoreUser = this.reflector.get<boolean>(
      IgnoreUser,
      context.getHandler(),
    );

    if (allowAuthMethods && allowAuthMethods.includes('api-key')) {
      const apiKey = request.headers['x-api-key'];

      if (apiKey === config().discordBotApiKey) {
        request.integration = 'discord';

        if (!ignoreUser) {
          const discordId = request.headers['x-discord-id'];
          const user = await this.userService.getUserByDiscordId(discordId);

          if (!user) {
            return false;
          }

          request.user = user;
        }

        return true;
      }

      if (apiKey === config().telegramBotApiKey) {
        request.integration = 'telegram';

        if (!ignoreUser) {
          const telegramId = request.headers['x-telegram-id'];
          const user = await this.userService.getUserByTelegramId(telegramId);

          if (!user) {
            return false;
          }

          request.user = user;
        }

        return true;
      }

      if (!allowAuthMethods.includes('jwt')) {
        return false;
      }
    }

    if (allowAuthMethods && allowAuthMethods.includes('jwt')) {
      return super.canActivate(context);
    }

    return false;
  }
}
