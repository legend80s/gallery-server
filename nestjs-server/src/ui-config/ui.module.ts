import { Module } from '@nestjs/common';
import { UIController } from './ui.controller';
import { UIService } from './ui.service';

@Module({
  controllers: [UIController],
  providers: [UIService],
})
export class UIModule {}
