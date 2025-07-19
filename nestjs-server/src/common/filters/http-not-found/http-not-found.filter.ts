import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  NotFoundException,
  Logger,
} from '@nestjs/common';

import type { Request, Response } from 'express';

@Catch(NotFoundException)
export class HttpNotFoundFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpNotFoundFilter.name);

  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    this.logger.log(exception);

    response.status(404).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Page Not Found</title>
      </head>
      <body style="
        max-width: 1024px;
        display: flex;
        padding-inline: 1rem;
        padding-block: 0;
        flex-direction: column;
        border: 1px solid #80808070;
        border-block: none;
        align-items: center;
        margin-inline: auto;
        margin-block: 0;
        height: 100vh;
      ">
        <div style="margin-block-start: 20vh;">
          <h1>Page Not Found</h1>
          <p>Sorry, the page you are looking for does not exist.</p>
          <p>URL: <code>${request.originalUrl}</code></p>
          <p>Method: <code>${request.method}</code></p>
          <p>Referrer: ${request.headers.referer}</p>
          <p>Timestamp: ${new Date().toISOString()}</p>
        </div>
      </body>
      </html>
      `);
  }
}
