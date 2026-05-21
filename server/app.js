#!/usr/bin/env node

// @ts-check
const Koa = require('koa');
const serve = require('koa-static');
const path = require('path');
const fs = require('fs');
const isImage = require('is-image');
const isVideo = require('is-video');
const address = require('address');
const boxen = require('boxen');
const detect = require('detect-port');
const program = require('commander');
const qrcode = require('qrcode-terminal');
const { promisify } = require('util');
// @ts-expect-error
const sizeOf = promisify(require('image-size'));

const { version, description, name, repository } = require('../package.json');
const { DEFAULT_PORT } = require('../lib/constants');
const { privatize } = require('./middlewares/privacy');
const { genToken } = require('./utils/token');
const isIntegerString = require('./utils/is-integer-string');
const { extractName } = require('../server/utils/file');

const app = new Koa();

const YELLOW = '\x1b[1;33m';
const RED = '\x1b[0;31m';
const GREEN = '\x1b[0;32m';
const UNDERLINED = '\x1b[4m';
const BOLD = '\x1b[1m';
const ITALIC = '\x1b[3m';
// End Of Style
const EOS = '\x1b[0m';

// @ts-expect-error
const warn = (...args) => console.warn(`${YELLOW}[WARN]`, ...args, EOS);

const ip = address.ip();
const REPO = repository.url;

console.info(
  boxen(`${BOLD}${ITALIC}gallery-server@${version}\ngithub: ${REPO}${EOS}`, {
    margin: 1,
    padding: { top: 1, right: 1, bottom: 1, left: 1 },
  })
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
  .option('--no-footer', 'hide the footer bar')
  .option('--no-qr', 'hide the QR code on startup')
  .option('--no-qr-color', 'disable color output in console');

program.parse(process.argv);
// console.log('program:', program);

const {
  folder,
  directory,
  column: isColumnLayout,
  footer: isFooterVisible,
  qr: isQrVisible,
  qrColor: isQrColorful,
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

const buildFolder = path.resolve(__dirname, '../client/build');

// console.log('serve index folder:', path.resolve(__dirname, '../client/build'));

const token = tokenFromCli || genToken();

// add privacy middleware
app.use(privatize(token));

app.use(serve(mediaFolder));
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

app.use(async (ctx) => {
  if (ctx.method === 'GET') {
    if (ctx.path.startsWith('/api/')) {
      ctx.set('Access-Control-Allow-Origin', '*');
    }

    if (ctx.path === '/api/images') {
      const photos = getRelativeFiles(mediaFolder, isImage);

      return sendPhotos(ctx, photos);
    }

    if (ctx.path === '/api/videos') {
      const videos = getRelativeFiles(mediaFolder, isVideo);

      return sendVideos(ctx, videos);
    }

    if (ctx.path === '/api/view') {
      return sendViewInfo(ctx);
    }
  }

  // file or path not found in build or api will be redirected to github repo
  warn(
    `Path not implemented redirect to github repo (${REPO}). Make sure \`client:dev\` has been run.`
  );
  ctx.redirect(REPO);
});

// @ts-expect-error
async function sendPhotos(ctx, photoPaths) {
  const photos = await Promise.all(
    // @ts-expect-error
    photoPaths.map(async (src) => {
      let dimensions = { width: 1, height: 1, orientation: 1 };

      try {
        dimensions = await sizeOf(mediaFolder + '/' + src);
      } catch (error) {
        console.error(error);
      }
      const { width, height, orientation } = dimensions;
      const isVertical = orientation === 6;

      return {
        ...normalizePath(src),
        width: isVertical ? height : width,
        height: isVertical ? width : height,
      };
    })
  );

  ctx.body = photos;
}

/**
 *
 * @param {any} ctx
 * @param {string[]} videoPaths
 */
function sendVideos(ctx, videoPaths) {
  const videos = videoPaths.map(normalizePath);

  ctx.body = videos;
}

// @ts-expect-error
function normalizePath(path) {
  return {
    caption: extractName(path),
    src: `/${path.replace(/ /g, '%20').replace(/#/g, '%23')}`,
  };
}

// @ts-expect-error
function sendViewInfo(ctx) {
  ctx.body = {
    isColumnLayout,
    isFooterVisible,
  };
}

// console.log('portFromCli:', portFromCli);

const port = Number(portFromCli) || DEFAULT_PORT;

choosePort(port)
  .then((availablePort) => {
    app.listen(availablePort, '0.0.0.0', () => {
      console.log(
        `Local images served from ${GREEN}${UNDERLINED}${mediaFolder}${EOS}.`,
        `You can now enjoy the gallery in the browser.`
      );
      console.log();
      console.log(
        `  Secret token:         ${GREEN}${token}${EOS},`,
        `${BOLD}ONLY SHARE WITH YOUR TRUSTED FRIENDS!${EOS}`
      );
      console.log(
        '  PC:                   ' +
          `${GREEN}${UNDERLINED}http://localhost:${availablePort}/${EOS}`
      );

      if (ip) {
        const ipUrlWithToken = `http://${ip}:${availablePort}/?token=${token}`;
        console.log(
          `  Mobile and Shareable: ${GREEN}${UNDERLINED}${ipUrlWithToken}${EOS}`
        );

        isQrVisible && printQrCode(ipUrlWithToken, { leftPadding: 27 });
      }

      console.log();
    });
  })
  .catch((error) => {
    console.error('choosePort', error);
  });

/**
 *
 * @param {string} url
 * @param {{ center?: boolean, leftPadding?: number }} options
 */
function printQrCode(url, { center, leftPadding = 0 } = {}) {
  qrcode.generate(url, { small: true }, (qrcodeStr) => {
    isQrColorful ? console.log(GREEN) : console.log(BOLD);
    const lines = qrcodeStr.split('\n');

    // console.log(qrcodeStr);

    if (center) {
      const terminalWidth = getTerminalWidth();
      // 获取二维码的最大宽度
      const qrMaxWidth = Math.max(...lines.map((line) => line.length));
      leftPadding = Math.max(0, Math.floor((terminalWidth - qrMaxWidth) / 2));
    }

    // 为每一行添加左侧 N 个空格
    const paddedQRCode = lines
      .map((line) => ' '.repeat(leftPadding) + line)
      .join('\n');

    console.log(paddedQRCode);

    isQrColorful && console.log(EOS);
  });
}
function getTerminalWidth() {
  return process.stdout.columns || 80;
}
/**
 * @param {number} port
 */
async function choosePort(port) {
  const availablePort = await detect(port);
  // console.log({ port, availablePort });

  if (port !== availablePort) {
    console.log(`Port#${port} was occupied, change to ${availablePort}.\n`);
  }

  return availablePort;
}

// @ts-expect-error
function getRelativeFiles(folder, predicate) {
  return findAllFiles(folder, predicate).map((filePath) =>
    path.relative(folder, filePath)
  );
}

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
  return fs.readdirSync(folder).reduce((acc, cur) => {
    // console.log('folder', folder, 'cur:', cur);

    if (folder.endsWith(`/${excludedFolder}`)) {
      return acc;
    }

    const filePath = path.join(folder, cur);

    if (fs.statSync(filePath).isDirectory()) {
      // @ts-expect-error
      acc.push(...findAllFiles(filePath, predicate));
    } else {
      predicate(filePath) &&
        // @ts-expect-error
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
  } catch (_error) {
    console.error(
      `${RED}folder "${folder}" not exists. ${EOS}Right example: ${GREEN}${CMD_EXAMPLE}${EOS}\n`
    );

    return false;
  }

  if (stat && !stat.isDirectory()) {
    console.error(
      `${RED}"${folder}" not a directory. ${EOS}Right example: ${GREEN}${CMD_EXAMPLE}${EOS}\n`
    );

    return false;
  }

  return true;
}
