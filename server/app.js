#!/usr/bin/env node

const Koa = require('koa');
const serve = require('koa-static');
const path = require('path');
const fs = require('fs');
const isImage = require('is-image');
const address = require('address');
const boxen = require('boxen');
const detect = require('detect-port');
const program = require('commander');

const { version, description, name } = require('../package.json');
const { DEFAULT_PORT } = require('../lib/constants');

const app = new Koa();

const YELLOW = '\x1b[1;33m';
const RED = '\x1b[0;31m';
const GREEN = '\x1b[0;32m';
const GRAY = '\x1b[0;37m';
const UNDERLINED = '\x1b[4m';
const BOLD = '\x1b[1m';
const ITALIC = '\x1b[3m';
const EOS = '\x1b[0m';

const ip = address.ip();
const REPO = 'https://github.com/legend80s/gallery-server';

console.info(
  boxen(
    `${BOLD}${ITALIC}gallery-server@${version}\ngithub: ${REPO}${EOS}`,
    { margin: 1, padding: { top: 1, right: 1, bottom: 1, left: 1 }, },
  ),
);

program
  .version(version, '-v, --version', 'output the version number')
  .description(description)
  .name(name)
  .usage('-f <folder>')
  .option('-f, --folder <folder>', 'photos folder to serve')
  .option('-d, --directory <directory>', 'photos folder to serve')
  .option('--no-footer', 'hide the footer bar')

program.parse(process.argv);
// console.log('program:', program);

const { folder, directory, footer: isFooterVisible } = program;

const imageFolder = folder || directory;

if (!validateFolder(imageFolder)) { process.exit(1); }

const buildFolder = path.resolve(__dirname, '../client/build');

// console.log('serve index folder:', path.resolve(__dirname, '../client/build'));

app.use(serve(imageFolder));
app.use(serve(buildFolder));

// logger
app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get('X-Response-Time');
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

// x-response-time
// middleware extract to file
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

app.use(async ctx => {
  if (ctx.method === 'GET') {
    if (ctx.path === '/api/images') {
      return sendImages(ctx);
    }

    if (ctx.path === '/api/view') {
      return sendViewInfo(ctx);
    }
  }

  ctx.redirect(REPO);
});

function sendImages(ctx) {
  ctx.set('Access-Control-Allow-Origin', '*');

  ctx.body = getImageSrcs(imageFolder);
}

function sendViewInfo(ctx) {
  ctx.set('Access-Control-Allow-Origin', '*');

  ctx.body = {
    isFooterVisible,
  };
}

choosePort(DEFAULT_PORT).then((port) => {
  app.listen(port, () => {
    console.log(
      `Local images served from ${GREEN}${UNDERLINED}${imageFolder}${EOS}.`,
      `You can now enjoy the gallery in the browser.`,
    );
    console.log();
    console.log(`  PC:     ${GREEN}${UNDERLINED}http://localhost:${port}/${EOS}`);
    ip && console.log(`  Mobile: ${GREEN}${UNDERLINED}http://${ip}:${port}/${EOS}`);
    console.log();
  });
}).catch(error => {
  console.error('choosePort', error);
});

async function choosePort(defaultPort) {
  const port = await detect(defaultPort);

  if (defaultPort !== port) {
    console.log(`Port#${defaultPort} was occupied, change to ${port}.\n`);
  }

  return port;
}

function getImageSrcs(folder) {
  return findAllFiles(folder)
    .map(filePath => path.relative(folder, filePath))
    .filter(filename => isImage(filename))
    .map(filename => `/${filename.replace(/ /g, '%20')}`);
}

/**
 * Find all the files in the target folder recursively.
 * @param {string} folder directory
 * @param {string} excludedFolder directory ignored
 * @returns {string[]} file paths
 */
function findAllFiles(folder, excludedFolder = 'node_modules') {
  return fs.readdirSync(folder).reduce((acc, cur) => {
    // console.log('folder', folder, 'cur:', cur);

    if (folder.endsWith(`/${excludedFolder}`)) {
      return acc;
    }

    const filePath = path.join(folder, cur);

    if (fs.statSync(filePath).isDirectory()) {
      acc.push(...findAllFiles(filePath));
    } else {
      acc.push(filePath);
    }

    return acc;
  }, []);
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
  } catch (error) {
    console.error(`${RED}folder "${folder}" not exists. ${EOS}Right example: ${GREEN}${CMD_EXAMPLE}${EOS}\n`);

    return false;
  }

  if (stat && !stat.isDirectory()) {
    console.error(`${RED}"${folder}" is not a directory. ${EOS}Right example: ${GREEN}${CMD_EXAMPLE}${EOS}\n`);

    return false;
  }

  return true;
}
