import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PhotosModule } from './photos/photos.module';
import { VideosModule } from './videos/videos.module';
import { ClientAppModule } from './serve-static.module';
import { UIModule } from './ui-config/ui.module';
import { TransformInterceptor } from './common/interceptors/success.interceptor';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PhotosModule,
    VideosModule,
    ClientAppModule,
    UIModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}
