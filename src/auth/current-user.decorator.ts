import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { UserToken } from './jwt.strategy';

export const CurrentUser = createParamDecorator(
  (_, context: ExecutionContext) => {
    return context.switchToHttp().getRequest().user as UserToken;
  },
);
