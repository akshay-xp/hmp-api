import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const Cookies = createParamDecorator(
  (
    data: string | undefined,
    ctx: ExecutionContext,
  ): string | Record<string, string> | undefined => {
    const request = ctx.switchToHttp().getRequest<Request>();

    const cookies: Record<string, string> | undefined = request.cookies;
    return data ? cookies[data] : cookies;
  },
);
