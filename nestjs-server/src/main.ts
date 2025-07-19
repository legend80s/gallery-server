import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpNotFoundFilter } from './common/filters/http-not-found/http-not-found.filter';
import { ip } from 'address';
import { GREEN, UNDERLINED, EOS, BOLD } from './utils/colors';
import { mediaFolder, tokenFromCli } from './utils/program';
import { genToken } from './utils/token';
// import { PrivacyGuard } from './common/guards/privacy/privacy.guard';
import { makePrivacyMiddleWare } from './common/middlewares/privacy/privacy.middleware';
import { DEFAULT_PORT } from '@shared/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'fatal'],
  });
  const token = tokenFromCli || genToken();

  app.setGlobalPrefix('api');
  app.useGlobalFilters(new HttpNotFoundFilter());
  // app.useGlobalGuards(new PrivacyGuard(token));
  app.use(makePrivacyMiddleWare(token));

  const availablePort = DEFAULT_PORT;

  // console.log('availablePort:', availablePort);

  await app.listen(availablePort);

  showLocalhostWithToken(availablePort, token);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();

function showLocalhostWithToken(availablePort: number, token: string) {
  console.log(
    `Local images served from ${GREEN}${UNDERLINED}${mediaFolder}${EOS}.`,
    `You can now enjoy the gallery in the browser.`,
  );
  console.log();
  console.log(
    `  Secret token:         ${GREEN}${token}${EOS},`,
    `${BOLD}ONLY SHARE WITH YOUR TRUSTED FRIENDS!${EOS}`,
  );
  console.log(
    '  PC:                   ' +
      `${GREEN}${UNDERLINED}http://localhost:${availablePort}/${EOS}`,
  );
  ip &&
    console.log(
      '  Mobile and Shareable: ' +
        `${GREEN}${UNDERLINED}http://${ip()}:${availablePort}/?token=${token}${EOS}`,
    );
  console.log();
}
