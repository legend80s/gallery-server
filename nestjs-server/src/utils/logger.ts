import { YELLOW, EOS } from './colors.js';

export const warn = (...args: unknown[]) =>
  console.warn(`${YELLOW}[WARN]`, ...args, EOS);
