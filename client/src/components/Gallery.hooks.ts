import { useEffect, useState } from 'react';

import { get } from '../utils/fetch';
import { tryTrimPrefix } from '../utils/path';
import getURLToken from '../utils/token';

import { PHOTOS_API_PREFIX } from '../../../shared/constants';

import type { IPhotosResp } from '../../../shared/request.types';

type IPhoto = IPhotosResp[number];

type IUIPhoto = IPhoto & {
  source: {
    download: string;
    fullscreen: string;
    regular: string;
    thumbnail: string;
  };
};

export function usePhotos(): { photos: IUIPhoto[] } {
  const [photos, setPhotos] = useState<IUIPhoto[]>([]);

  useEffect(() => {
    queryPhotos().then((photosWithToken) => {
      // console.log("photosWithToken:", JSON.stringify(photosWithToken));
      setPhotos(photosWithToken);
    });

    // showDemoPhotos(setPhotos);
  }, []);

  return {
    photos,
  };
}

async function queryPhotos(): Promise<IUIPhoto[]> {
  const path = '/api/images';

  return fetchPhotos(path).then((photos) => {
    // console.log('photos1:', photos);
    const token = getURLToken();

    const photosWithToken = photos.map((photo) => {
      const { src: srcRaw, ...rest } = photo;

      const src = tryTrimPrefix(srcRaw, PHOTOS_API_PREFIX);
      const highQualitySrc = `${
        src + (src.includes('?') ? '&' : '?')
      }token=${token}`;
      const thumbnail = highQualitySrc;

      const result: IUIPhoto = {
        ...rest,
        src: highQualitySrc,
        // @ts-expect-error it works
        loading: 'lazy',

        source: {
          download: highQualitySrc,
          fullscreen: highQualitySrc,
          regular: highQualitySrc,
          thumbnail: thumbnail,
        },
      };

      return result;
    });

    return photosWithToken;
  });
}

/**
 * Fetch photos from remote.
 * @param {string} path
 * @returns {Promise<IPhotosResp>}
 */
export async function fetchPhotos(path: string): Promise<IPhotosResp> {
  try {
    return await get(path);
  } catch (error) {
    console.error('fetchPhotos', error);

    return [];
  }
}
