#!/usr/bin/env node
// @ts-check
// ! 注意这个文件不能改成 ts，因为需要被 node.js 运行，目前 node.js v22 并不支持 node_modules 内的 ts。
const Koa = require('koa');
const serve = require('koa-static');
const path = require('node:path');
const address = require('address');
const detect = require('detect-port');

const { DEFAULT_PORT } = require('../lib/constants');
const { privatize } = require('./middlewares/privacy');
const { genToken } = require('./utils/token');
const { getPhotos } = require('./api/photos');
const { getVideos } = require('./api/videos');
const { gen404 } = require('./api/404');

const { args } = require('./program');
const { warn } = require('./utils/logger.js');
const { GREEN, UNDERLINED, EOS, BOLD } = require('./utils/colors.js');
const {
  tokenFromCli,
  mediaFolder,
  isColumnLayout,
  isFooterVisible,
  portFromCli,
} = args;

const ip = address.ip();

const app = new Koa();

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
    `${ctx.method} ${ctx.path} not implemented. \`client:dev\` may not be running.`,
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
        `You can now enjoy the gallery in the browser.`,
      );
      console.log();
      console.log(
        `  Secret token:         ${GREEN}${token}${EOS},`,
        `${BOLD}ONLY SHARE WITH YOUR TRUSTED FRIENDS!${EOS}`,
      );
      console.log(
        '  PC:                   ' +
          `${GREEN}${UNDERLINED}http://localhost:${availablePort}/${EOS}`,
      );
      ip &&
        console.log(
          '  Mobile and Shareable: ' +
            `${GREEN}${UNDERLINED}http://${ip}:${availablePort}/?token=${token}${EOS}`,
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
