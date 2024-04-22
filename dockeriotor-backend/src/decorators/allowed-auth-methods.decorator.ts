import { AuthMethod } from '@/enums/auth-method.enum';
import { SetMetadata, applyDecorators } from '@nestjs/common';

export function AllowedAuthMethods(...authMethods: AuthMethod[]) {
  return applyDecorators(SetMetadata('allowedAuthMethods', authMethods));
}
