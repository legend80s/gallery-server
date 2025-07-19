import { Injectable } from '@nestjs/common';

import { isColumnLayout, isFooterVisible } from '../utils/program';
import type { ITheme } from '@shared/request.types';

@Injectable()
export class UIService {
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
