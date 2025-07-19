import path from 'node:path';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { mediaFolder } from './utils/program';

const buildFolder = path.resolve(__dirname, '../../client/dist');

@Module({
  imports: [
    // js css HTML 静态资源
    ServeStaticModule.forRoot({
      rootPath: buildFolder,
      renderPath: '/',
    }),

    // 图片资源
    ServeStaticModule.forRoot({
      rootPath: mediaFolder,

      serveStaticOptions: {
        dotfiles: 'ignore',
        // 让 nestjs-server\src\http-not-found\http-not-found.filter.ts 能捕获 404
        fallthrough: false,
        index: false,
      },
    }),
  ],
})
export class ClientAppModule {}
