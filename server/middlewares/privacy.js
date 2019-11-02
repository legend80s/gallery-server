const isImage = require('is-image');
const { repository } = require('../../package.json');

/**
 * Privacy middleware.
 * Only url with matched token is accessible.
 *
 * @param {string} token
 */
module.exports.privatize = token => {
  return async (ctx, next) => {
    const { url } = ctx;

    // console.log('url:', url);

    const isFaviconReq = '/favicon.ico' === url;

    if (!token || isFaviconReq) {
      return await next();
    }

    const isApiReq = /^\/api\//.test(url);
    const isIndexReq = url === '/' || /^\/\?/.test(url);
    const isImageReq = isImage(url.split('?')[0]);

    if (isIndexReq || isApiReq || isImageReq) {
      const { token: clientToken } = ctx.query;

      // console.log(ctx.query, 'clientToken:', clientToken, token);

      if (clientToken !== token) {
        ctx.status = 403;
        ctx.body = {
          code: 403,
          message: '403 forbidden. Please redirect to ' +
            `${repository.url}#faq for more information.`,
        };

        return;
      }
    }

    await next();
  };
};
