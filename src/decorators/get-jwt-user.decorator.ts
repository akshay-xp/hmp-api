import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { JwtUser } from 'src/auth/types';

export const GetUser = createParamDecorator(
  (data: keyof JwtUser | undefined, ctx: ExecutionContext) => {
    const request: Express.Request = ctx.switchToHttp().getRequest();
    const user = request.user as JwtUser;
    if (data) {
      return user[data];
    }
    return request.user;
  },
);
