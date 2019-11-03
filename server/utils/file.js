const { basename, extname } = require('path');

/**
 * Extract file name from its path
 * @param {string} path file path including extension
 * @returns {string}
 *
 * @example
 * extractName('~/Alice\'s Adventures in Wonderland.txt');
 * // => 'Alice's Adventures in Wonderland'
 */
module.exports.extractName = function extractName(filePath) {
  return basename(filePath, extname(filePath));
}
