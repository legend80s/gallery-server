import { Injectable } from '@nestjs/common';

import { isColumnLayout, isFooterVisible } from '../utils/program';
import type { ITheme } from '@shared/request.types';
import { PrismaService } from '../prisma.service';
import { UIConfig, Prisma } from 'generated/prisma';

@Injectable()
export class UIService {
  constructor(private prisma: PrismaService) {}

  async uiConfig(
    uiConfigWhereUniqueInput: Prisma.UIConfigWhereUniqueInput,
  ): Promise<UIConfig | null> {
    return this.prisma.uIConfig.findUnique({
      where: uiConfigWhereUniqueInput,
    });
  }

  async updateUIConfig(params: {
    where: Prisma.UIConfigWhereUniqueInput;
    data: Prisma.UIConfigUpdateInput;
  }): Promise<UIConfig> {
    const { data, where } = params;
    return this.prisma.uIConfig.update({
      data,
      where,
    });
  }

  getConfig() {
    return {
      isColumnLayout,
      isFooterVisible,
    };
  }

  updateTheme(theme: ITheme) {
    // TODO: update theme
    console.log('theme updated:', theme);
    return {
      theme,
    };
  }
}
