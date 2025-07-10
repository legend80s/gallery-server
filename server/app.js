#!/usr/bin/env node
// @ts-check
// ! 注意这个文件不能改成 ts，因为需要被 node.js 运行，目前 node.js v22 并不支持 node_modules 内的 ts。
const Koa = require('koa');
const serve = require('koa-static');
const path = require('node:path');
const fs = require('node:fs');
const address = require('address');
const boxen = require('boxen');
const detect = require('detect-port');
const program = require('commander');

const { version, description, name, repository } = require('../package.json');
const { DEFAULT_PORT } = require('../lib/constants');
const { privatize } = require('./middlewares/privacy');
const { genToken } = require('./utils/token');
const isIntegerString = require('./utils/is-integer-string');
const { getPhotos } = require('./api/photos');
const { getVideos } = require('./api/videos');
const { gen404 } = require('./api/404');

const app = new Koa();

const YELLOW = '\x1b[1;33m';
const RED = '\x1b[0;31m';
const GREEN = '\x1b[0;32m';
const UNDERLINED = '\x1b[4m';
const BOLD = '\x1b[1m';
const ITALIC = '\x1b[3m';
// End Of Style
const EOS = '\x1b[0m';

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

const buildFolder = path.resolve(__dirname, '../client/dist');

// console.log('serve index folder:', path.resolve(__dirname, '../client/dist'));

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
      ctx.body = await getPhotos(mediaFolder);
      return;
    }

    if (ctx.path === '/api/videos') {
      ctx.body = await getVideos(mediaFolder);
      return;
    }

    if (ctx.path === '/api/view') {
      return sendViewInfo(ctx);
    }
  }

  // 404 - file or path not found in build or api
  warn(
    `API (${ctx.method} ${ctx.path}) not implemented. Make sure \`client:dev\` has been run.`
  );

  ctx.body = gen404(ctx);
});

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
      ip &&
        console.log(
          '  Mobile and Shareable: ' +
            `${GREEN}${UNDERLINED}http://${ip}:${availablePort}/?token=${token}${EOS}`
        );
      console.log();
    });
  })
  .catch((error) => {
    console.error('choosePort', error);
  });

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
