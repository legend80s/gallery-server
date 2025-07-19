/**
 * @param {string} str
 * @returns {boolean}
 */
export function isIntegerString(str: string): boolean {
  return typeof str === 'string' && /^\d+$/.test(str);
}
