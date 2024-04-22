import { AuthMethod } from '@/enums/auth-method.enum';
import { UseGuards, applyDecorators } from '@nestjs/common';
import { AllowedAuthMethods } from './allowed-auth-methods.decorator';
import { AuthGuard } from '@/modules/auth/guards/auth.guard';

export function Auth(...authMethods: AuthMethod[]) {
  return applyDecorators(
    AllowedAuthMethods(...authMethods),
    UseGuards(AuthGuard),
  );
}
