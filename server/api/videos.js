// @ts-check
import isVideo from 'is-video';

import { getRelativeFiles, normalizePath } from '../utils/file.js';

/** @typedef {import('../../lib/request.types').IRespVideo} IRespVideo */

/**
 *
 * @param {string} mediaFolder
 * @returns {IRespVideo[]}
 */
export function getVideos(mediaFolder) {
  const videoPaths = getRelativeFiles(mediaFolder, isVideo);

  /** @type {IRespVideo[]} */
  const videos = videoPaths.map((path) =>
    normalizePath(path, { prefix: '/videos/' })
  );

  return videos;
}
