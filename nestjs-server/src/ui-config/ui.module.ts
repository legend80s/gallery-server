import { Module } from '@nestjs/common';
import { UIController } from './ui.controller';
import { UIService } from './ui.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [UIController],
  providers: [UIService, PrismaService],
})
export class UIModule {}
