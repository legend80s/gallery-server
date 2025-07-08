/**
 * @param {string} str
 * @returns {boolean}
 */
module.exports = function isIntegerString(str) {
  return typeof str === 'string' && /^\d+$/.test(str);
}
