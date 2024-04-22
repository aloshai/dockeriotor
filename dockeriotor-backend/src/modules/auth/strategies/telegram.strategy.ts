import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { config } from '@/config';
import * as passport from 'passport';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import * as crypto from 'crypto';
import { AuthService } from '../auth.service';

export class Strategy extends passport.Strategy {
  name = 'telegram';

  authenticate(
    this: passport.StrategyCreated<this, this & passport.StrategyCreatedStatic>,
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    options?: any,
  ) {
    const telegramBotToken = config().telegramBotToken;
    const data = req.query;

    if (!data) {
      return this.fail(new Error('Telegram data not provided'), 400);
    }

    const secret_key = crypto
      .createHash('sha256')
      .update(telegramBotToken)
      .digest();

    const dataCheckString = Object.keys(data)
      .filter((key) => key !== 'hash')
      .sort()
      .map((key) => `${key}=${data[key]}`)
      .join('\n');

    const hash = crypto
      .createHmac('sha256', secret_key)
      .update(dataCheckString)
      .digest('hex');

    if (hash !== data.hash) {
      return this.fail(new Error('Invalid hash'), 400);
    }

    this.validate(data, (err, user, info) => {
      if (err) {
        return this.error(err);
      }

      if (!user) {
        return this.fail(info);
      }

      this.success(user, info);
    });
  }

  validate(data: any, done: (error: any, user?: any, info?: any) => void) {
    done(null, data, null);
  }
}

@Injectable()
export class TelegramStrategy extends PassportStrategy(Strategy, 'telegram') {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(
    payload: any,
    done: (error: any, user: any, info?: any) => void,
  ) {
    const { id } = payload;

    if (!id) {
      return null;
    }

    const user = await this.authService.validateUserByTelegramId(id);

    if (!user) {
      return done(new Error('User not found'), null);
    }

    done(null, user);
  }
}
