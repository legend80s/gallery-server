import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PhotosModule } from './photos/photos.module';
import { VideosModule } from './videos/videos.module';
import { ClientAppModule } from './serve-static.module';
import { UIModule } from './ui-config/ui.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from './common/interceptors/success.interceptor';

@Module({
  imports: [PhotosModule, VideosModule, ClientAppModule, UIModule],
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
