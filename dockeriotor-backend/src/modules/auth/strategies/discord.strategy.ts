import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {
  Strategy,
  Scope,
  VerifyCallback,
} from '@oauth-everything/passport-discord';
import { AuthService } from '../auth.service';
import { config } from '@/config';
import { User } from '@/schemas';
import { StrategyFailure } from 'passport';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      clientID: config().auth.discord.clientId,
      clientSecret: config().auth.discord.clientSecret,
      callbackURL: config().auth.discord.redirectUri,
      scope: [Scope.IDENTIFY],
    });
  }

  fail(challenge?: string | number | StrategyFailure, status?: number): void {
    console.error('fail');
  }

  error(err: any): void {
    console.error('err');
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback<User>,
  ) {
    if (!profile) {
      done(null, null);
    }

    const { id } = profile;
    const user = await this.authService.validateUserByDiscordId(id);

    done(null, user);
  }
}
