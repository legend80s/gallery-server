import type { ForbiddenException } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';
import { validateToken } from 'src/common/guards/privacy/privacy.guard';

export function makePrivacyMiddleWare(token: string) {
  return function privacyMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    // console.log(`Request...`, req.path, req.method, req.query);
    try {
      validateToken(req, token, {
        whitelist: ['/vite.svg'],
      });
    } catch (_err) {
      const err = _err as ForbiddenException;
      res.statusCode = err.getStatus();
      res.send(err.getResponse());

      return;
    }

    next();
  };
}
