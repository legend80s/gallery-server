/**
 * This is a singleton to resolve cli options.
 * It should only be run once (but can be imported multiple times due to Node.js module caching)
 */
import { BOLD, ITALIC, EOS, RED, GREEN } from './colors';

// @ts-check
import fs from 'node:fs';
import boxen from 'boxen';
import program from 'commander';
import { version, description, name, repository } from '../../../package.json';
import { isIntegerString } from './lite-lodash';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
const REPO = repository.url;

console.info(
  boxen(`${BOLD}${ITALIC}gallery-server@${version}\ngithub: ${REPO}${EOS}`, {
    margin: 1,
    padding: { top: 1, right: 1, bottom: 1, left: 1 },
  }),
);

program
  .version(version, '-v, --version', 'output the version number')
  .description(description)
  .name(name)
  .usage('-f <folder>')
  .option('-f, --folder <folder>', 'photos folder to serve')
  .option('-d, --directory <directory>', 'photos folder to serve')
  .option('-c, --column', 'use column layout')
  .option('-p, --port <port>', 'server port')
  .option('-t, --token <token>', 'secret token to prevent eavesdropping')
  .option('--no-footer', 'hide the footer bar');

program.parse(process.argv);
// console.log('program:', program, Date.now());

type IArgs = {
  folder: string;
  directory: string;
  column: boolean;
  footer: boolean;
  token: string;
  port: string;
};

const {
  folder,
  directory,
  column: isColumnLayout,
  footer: isFooterVisible,
  token: tokenFromCli,
  port: portFromCli,
} = program as unknown as IArgs;

if (portFromCli && !isIntegerString(portFromCli)) {
  console.error(`${RED}port "${portFromCli}" not an integer.${EOS}`);

  process.exit(1);
}

const mediaFolder: string = folder || directory;

if (!validateFolder(mediaFolder)) {
  process.exit(1);
}

/**
 * validate folder from cli
 * @param {string} folder
 * @returns {boolean}
 */
function validateFolder(folder: string): boolean {
  let stat: fs.Stats;
  const CMD_EXAMPLE = '`$ npx gallery-server --folder /path/to/images`';

  try {
    stat = fs.lstatSync(folder);
  } catch {
    console.error(
      `${RED}folder "${folder}" not exists. ${EOS}Right example: ${GREEN}${CMD_EXAMPLE}${EOS}\n`,
    );

    return false;
  }

  if (stat && !stat.isDirectory()) {
    console.error(
      `${RED}"${folder}" not a directory. ${EOS}Right example: ${GREEN}${CMD_EXAMPLE}${EOS}\n`,
    );

    return false;
  }

  return true;
}

export { isColumnLayout, isFooterVisible, tokenFromCli, mediaFolder };
