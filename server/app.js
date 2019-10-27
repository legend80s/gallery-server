const Koa = require('koa');
const serve = require('koa-static');
const path = require('path');
const fs = require('fs');
const isImage = require('is-image');

const app = new Koa();

const cmdExample = '`npm start -- --folder=/Users/xiaoming/Downloads/images`';
const imageFolder = getImageFolderFromCli();

app.use(serve(imageFolder));
app.use(serve('client/build'));

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
  if (ctx.method === 'GET' && ctx.path === '/api/images') {
    ctx.set('Access-Control-Allow-Origin', '*')
    ctx.body = getImageSrcs(imageFolder);

    return;
  }

  ctx.body = 'TODO: github address';
});

const PORT = 7001;

app.listen(PORT, () => {
  const YELLOW = '\x1b[1;33m';
  const GREEN = '\x1b[0;32m';
  const UNDERLINED = '\x1b[4m';
  const EOS = '\x1b[0m';

  console.log(
    `${YELLOW}[gallery-server]${EOS}`,
    `open ${GREEN}${UNDERLINED}http://localhost:${PORT}/${EOS}`,
    'to enjoy your local image gallery served from',
    `${GREEN}${UNDERLINED}${imageFolder}${EOS}`,
  );
});

function getImageSrcs(folder) {
  return findAllFiles(folder)
    .map(filePath => path.relative(folder, filePath))
    .filter(filename => isImage(filename))
    .map(filename => `http://localhost:${PORT}/${filename.replace(/ /g, '%20')}`);
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

function getImageFolderFromCli() {
  let folder = '';

  // console.log('process.argv:', process.argv);

  process.argv.slice(2).some((arg) => {
    const matches = arg.match(/--folder=(\S+)/);

    if (matches) {
      folder = matches[1];

      return true;
    }

    return false;
  });

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
