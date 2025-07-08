const isImage = require('is-image');
const address = require('address');

const { repository } = require('../../package.json');

const serverIP = address.ip();

/**
 * Privacy middleware.
 * Only url with matched token is accessible.
 *
 * @param {string} token
 */
module.exports.privatize = (token) => {
  return async (ctx, next) => {
    const { url } = ctx;

    const clientIP = ctx.ip;
    // console.log("clientIP:", clientIP);
    // console.log("serverIP:", serverIP);

    /** Request is from the owner no need to validate the token */
    const isOwnerRequest = clientIP === '127.0.0.1' || clientIP === serverIP;
    const isFaviconReq = '/favicon.ico' === url;

    if (isOwnerRequest || !token || isFaviconReq) {
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
          message:
            'Forbidden. `token` required. Please redirect to ' +
            `${repository.url}#faq for more information.`,
        };

        return;
      }
    }

    await next();
  };
};
