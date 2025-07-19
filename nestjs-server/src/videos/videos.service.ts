import { Injectable } from '@nestjs/common';
import isVideo from 'is-video';

import { getRelativeFiles, normalizePath } from '../utils/file';
import { VIDEOS_API_PREFIX } from '@shared/constants';
import { mediaFolder } from '../utils/program';

import type { IRespVideo } from '@shared/request.types';

@Injectable()
export class VideosService {
  getVideos(): IRespVideo[] {
    return getVideos(mediaFolder);
  }
}

/**
 *
 * @param {string} mediaFolder
 * @returns {IRespVideo[]}
 */
function getVideos(mediaFolder: string): IRespVideo[] {
  const videoPaths = getRelativeFiles(mediaFolder, isVideo);

  const videos: IRespVideo[] = videoPaths.map((path) =>
    normalizePath(path, { prefix: VIDEOS_API_PREFIX }),
  );

  return videos;
}
