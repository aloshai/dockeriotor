import { Reflector } from '@nestjs/core';

export const IgnoreUser = Reflector.createDecorator<boolean>();
