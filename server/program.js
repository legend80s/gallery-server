const { BOLD, ITALIC, EOS, RED, GREEN } = require('./utils/colors.js');

// @ts-check
const fs = require('node:fs');
const boxen = require('boxen');
const program = require('commander');
const { version, description, name, repository } = require('../package.json');
const isIntegerString = require('./utils/is-integer-string');

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
// console.log('program:', program);

const {
  folder,
  directory,
  column: isColumnLayout,
  footer: isFooterVisible,
  token: tokenFromCli,
  port: portFromCli,
} = program;

if (portFromCli && !isIntegerString(portFromCli)) {
  console.error(`${RED}port "${portFromCli}" not an integer.${EOS}`);

  process.exit(1);
}

/** @type {string} */
const mediaFolder = folder || directory;

if (!validateFolder(mediaFolder)) {
  process.exit(1);
}

/**
 * validate folder from cli
 * @param {string} folder
 * @returns {boolean}
 */
function validateFolder(folder) {
  let stat;
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

exports.args = {
  isColumnLayout,
  isFooterVisible,
  tokenFromCli,
  mediaFolder,
};
