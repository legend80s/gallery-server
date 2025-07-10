// @ts-check
const path = require('node:path');
const fs = require('node:fs');

exports.extractName = extractName;

/**
 * Extract file name from its path
 * @param {string} filePath file path including extension
 * @returns {string}
 *
 * @example
 * extractName('~/Alice\'s Adventures in Wonderland.txt');
 * // => 'Alice's Adventures in Wonderland'
 */
function extractName(filePath) {
  return path.basename(filePath, path.extname(filePath));
}

/**
 *
 * @param {string} path
 * @param {{ prefix: string }} opts
 * @returns
 */
exports.normalizePath = function normalizePath(path, { prefix }) {
  prefix = process.env.NODE_ENV === 'development' ? prefix : '/';

  return {
    caption: extractName(path),
    src: `${prefix}${path.replace(/ /g, '%20').replace(/#/g, '%23')}`,
  };
};

exports.getRelativeFiles = function getRelativeFiles(folder, predicate) {
  return findAllFiles(folder, predicate).map((filePath) =>
    path.relative(folder, filePath)
  );
};

/**
 * Find all the files in the target folder recursively.
 * @param {string} folder directory
 * @param {(path: string) => boolean} predicate directory ignored
 * @param {string} excludedFolder directory ignored
 * @returns {string[]} file paths
 */
function findAllFiles(
  folder,
  predicate = () => true,
  excludedFolder = 'node_modules'
) {
  return fs.readdirSync(folder).reduce((/** @type {string[]} */ acc, cur) => {
    // console.log('folder', folder, 'cur:', cur);

    if (folder.endsWith(`/${excludedFolder}`)) {
      return acc;
    }

    const filePath = path.join(folder, cur);

    if (fs.statSync(filePath).isDirectory()) {
      acc.push(...findAllFiles(filePath, predicate));
    } else {
      predicate(filePath) && acc.push(filePath);
    }

    return acc;
  }, []);
}
