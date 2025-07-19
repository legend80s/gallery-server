import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import type { Observable } from 'rxjs';
import type { Request } from 'express';
import address from 'address';
import isImage from 'is-image';
import { repository } from '../../../../../package.json';

@Injectable()
export class PrivacyGuard implements CanActivate {
  constructor(private readonly token: string) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    return validateToken(request, this.token);
  }
}

export function validateToken(
  { path, ip: clientIP, query }: Request,
  token: string,
  { whitelist = ['/favicon.ico'] } = {},
): boolean {
  // const { url, ip: clientIP } = request;
  // const ctx = request;
  const serverIP = address.ip();

  // console.log('clientIP:', clientIP);
  // console.log('serverIP:', serverIP);

  /** Request is from the owner no need to validate the token */
  const isOwnerRequest =
    clientIP === '127.0.0.1' || clientIP === '::1' || clientIP === serverIP;
  const isFaviconReq = whitelist.includes(path);

  if (isOwnerRequest || !token || isFaviconReq) {
    return true;
  }

  const isApiReq = path.startsWith('/api/');
  const isIndexReq = path === '/';
  const isImageReq = isImage(path);

  if (isIndexReq || isApiReq || isImageReq) {
    const { token: clientToken } = query;

    // console.log(query, 'clientToken:', clientToken, token);

    if (clientToken !== token) {
      throw new ForbiddenException(
        'Forbidden. `token` required. Please redirect to ' +
          `${repository.url}#faq for more information.`,
      );
    }
  }

  return true;
}
