// @ts-check
import path from 'node:path';
import fs from 'node:fs';

/**
 * Extract file name from its path
 * @param {string} filePath file path including extension
 * @returns {string}
 *
 * @example
 * extractName('~/Alice\'s Adventures in Wonderland.txt');
 * // => 'Alice's Adventures in Wonderland'
 */
export function extractName(filePath: string): string {
  return path.basename(filePath, path.extname(filePath));
}

export function normalizePath(path: string, { prefix }: { prefix: string }) {
  return {
    caption: extractName(path),
    src: `${prefix}${path.replace(/ /g, '%20').replace(/#/g, '%23')}`,
  };
}

export function getRelativeFiles(
  folder: string,
  predicate: (filePath?: string) => boolean,
) {
  return findAllFiles(folder, predicate).map((filePath) =>
    path.relative(folder, filePath),
  );
}

/**
 * Find all the files in the target folder recursively.
 * @param folder directory
 * @param predicate directory ignored
 * @param excludedFolder directory ignored
 * @returns file paths
 */
function findAllFiles(
  folder: string,
  predicate: (path?: string) => boolean = () => true,
  excludedFolder: string = 'node_modules',
): string[] {
  return fs.readdirSync(folder).reduce<string[]>((acc, cur) => {
    // console.log('folder', folder, 'cur:', cur);

    if (folder.endsWith(`/${excludedFolder}`)) {
      return acc;
    }

    const filePath = path.join(folder, cur);

    if (fs.statSync(filePath).isDirectory()) {
      acc.push(...findAllFiles(filePath, predicate));
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      predicate(filePath) && acc.push(filePath);
    }

    return acc;
  }, []);
}
