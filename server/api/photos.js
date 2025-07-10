// @ts-check
/** @typedef {import('../../lib/request.types').IPhotosResp} IPhotosResp */
const isImage = require('is-image');
const { promisify } = require('node:util');
const size = require('image-size');

// @ts-expect-error
const sizeOf = promisify(size);

const { getRelativeFiles, normalizePath } = require('../utils/file.js');

/**
 *
 * @param {string} mediaFolder
 * @returns {Promise<IPhotosResp>}
 */
exports.getPhotos = async function getPhotos(mediaFolder) {
  const photoPaths = getRelativeFiles(mediaFolder, isImage);

  /** @type {IPhotosResp} */
  const photos = await Promise.all(
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
        ...normalizePath(src, { prefix: '/photos/' }),
        width: isVertical ? height : width,
        height: isVertical ? width : height,
      };
    })
  );

  console.log('photos:', photos.slice(0, 3));

  return photos;
};
