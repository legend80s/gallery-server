import { YELLOW, EOS } from './colors.js';

// @ts-check
export const warn = (...args) => console.warn(`${YELLOW}[WARN]`, ...args, EOS);
