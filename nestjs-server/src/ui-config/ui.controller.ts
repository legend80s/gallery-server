import { Body, Controller, Get, Param, Patch, UsePipes } from '@nestjs/common';
import { UIService } from './ui.service';
import { ZodPipe } from 'src/common/pipes/zod.pipe';
import {
  updateUIConfigSchema,
  type UpdateUIConfigDto,
} from './dto/update-ui-config.dto';
import { User as UserModel, UIConfig as PostModel } from 'generated/prisma';

@Controller('view')
export class UIController {
  constructor(private readonly service: UIService) {}

  @Get('post/:id')
  async getUIConfigById(@Param('id') id: string): Promise<PostModel> {
    return this.service.uiConfig({ id: Number(id) });
  }

  @Patch('config/:id')
  async updateUIConfig(@Param('id') id: string): Promise<PostModel> {
    return this.service.updateUIConfig({
      where: { id: Number(id) },
      data: { published: true },
    });
  }

  @Get()
  getUIConfig() {
    return this.service.getConfig();
  }

  @Patch()
  @UsePipes(new ZodPipe(updateUIConfigSchema))
  updateTheme(@Body() updateUIConfigDto: UpdateUIConfigDto) {
    console.log('updateUIConfigDto:', updateUIConfigDto);
    return this.service.updateTheme(updateUIConfigDto.theme);
  }
}
