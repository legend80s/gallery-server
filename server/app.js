#!/usr/bin/env node

const Koa = require('koa');
const serve = require('koa-static');
const path = require('path');
const fs = require('fs');
const isImage = require('is-image');

const app = new Koa();

const cmdExample = '`npx gallery-server --folder /path/to/images`';
const imageFolder = getImageFolderFromCli();

// console.log('serve index folder:', path.resolve(__dirname, '../client/build'));

app.use(serve(imageFolder));
app.use(serve(path.resolve(__dirname, '../client/build')));

// logger
app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get('X-Response-Time');
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

// x-response-time
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

  ctx.redirect('https://github.com/legend80s/gallery-server');
});

function sendImages(ctx) {
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.body = getImageSrcs(imageFolder);
}

function sendViewInfo(ctx) {
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.body = {
    showFooter: extractArg('view-footer', 'true') === 'true',
  };
}

/** unique port to avoid conflicts */
const DEFAULT_PORT = 6834;
const port = DEFAULT_PORT;

app.listen(port, () => {
  const YELLOW = '\x1b[1;33m';
  const GREEN = '\x1b[0;32m';
  const UNDERLINED = '\x1b[4m';
  const EOS = '\x1b[0m';

  console.log(
    `${YELLOW}[gallery-server]${EOS}`,
    `open ${GREEN}${UNDERLINED}http://localhost:${port}/${EOS}`,
    'to enjoy your local image gallery served from',
    `${GREEN}${UNDERLINED}${imageFolder}${EOS}`,
  );
});

function getImageSrcs(folder) {
  return findAllFiles(folder)
    .map(filePath => path.relative(folder, filePath))
    .filter(filename => isImage(filename))
    .map(filename => `http://localhost:${port}/${filename.replace(/ /g, '%20')}`);
}

/**
 * Find all the files in the target folder recursively.
 * @param {string} folder directory
 * @returns {string[]} file paths
 */
function findAllFiles(folder) {
  return fs.readdirSync(folder).reduce((acc, cur) => {
    // console.log('folder', folder, 'cur:', cur);
    const filePath = path.join(folder, cur);

    if (fs.statSync(filePath).isFile()) {
      acc.push(filePath);
    } else {
      acc.push(...findAllFiles(filePath));
    }

    return acc;
  }, []);
}

function extractArg(arg, defaultVal = '') {
  // console.log('process.argv.slice(2):', process.argv.slice(2));

  const argString = process.argv.slice(2).join(' ');
  // console.log('argString:', argString);
  // match `--folder /path/to/images` or `--folder=/path/to/images`
  const matches = argString.match(new RegExp(`--${arg}\\s(\\S+)`)) ||
    argString.match(new RegExp(`--${arg}=(\\S+)`));

  return matches && matches[1] || defaultVal;
}

function getImageFolderFromCli() {
  const folder = extractArg('folder');

  if (!folder) {
    throw new TypeError('folder required. Right example: ' + cmdExample);
  }

  if (folder) {
    validateFolder(folder);
  }

  return folder;
}

function validateFolder(folder) {
  let stat;

  try {
    stat = fs.lstatSync(folder);
  } catch (error) {
    throw new TypeError(`folder (${folder}) not exists. Right example: ${cmdExample}`);
  }

  if (stat && !stat.isDirectory()) {
    throw new TypeError('folder is not a directory. Right example: ' + cmdExample);
  }
}
