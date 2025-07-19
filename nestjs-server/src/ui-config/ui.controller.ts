import { Body, Controller, Get, Patch, UsePipes } from '@nestjs/common';
import { UIService } from './ui.service';
import { ZodPipe } from 'src/common/pipes/zod.pipe';
import {
  updateUIConfigSchema,
  type UpdateUIConfigDto,
} from './dto/update-ui-config.dto';

@Controller('view')
export class UIController {
  constructor(private readonly service: UIService) {}

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
