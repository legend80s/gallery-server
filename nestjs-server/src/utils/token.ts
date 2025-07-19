/**
 * Generate private token.
 * @returns {string}
 */
export function genToken(): string {
  const num = genRandomNumber(100 * 10000, 1000 * 10000);

  return num.toString(16);
}

/**
 * Generate an number between [start, stop].
 * @param {number} start
 * @param {number} stop
 * @returns {number} [start, stop]
 */
function genRandomNumber(start: number, stop: number): number {
  return start + Math.floor(Math.random() * (stop - start + 1));
}
