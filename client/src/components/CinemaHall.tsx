import { useState, useEffect } from 'react';
import getURLToken from '../utils/token';
import { get } from '../utils/fetch';

import './CinemaHall.css';
import type { ITheme } from './Gallery';
import type { IRespVideo } from '../../../lib/request.types';
import { VIDEOS_API_PREFIX } from '../../../lib/constants';
import { tryTrimPrefix } from '../utils/path';

export function CinemaHall({ theme }: { theme: ITheme }) {
  const [videos, setVideos] = useState<IRespVideo[]>([]);

  useEffect(() => {
    showVideos().then(setVideos);
  }, []);

  return (
    <>
      {videos.length ? <hr /> : null}

      <ul className={`video-list ${theme}`}>
        {videos.map(({ src, caption }) => {
          return (
            <li key={src}>
              <a href={src}>{caption}</a>
            </li>
          );
        })}
      </ul>
    </>
  );
}

async function showVideos(): Promise<IRespVideo[]> {
  const path = '/api/videos';

  try {
    const videos = await get(path);

    return (videos as IRespVideo[]).map(({ src, ...rest }) => {
      src = tryTrimPrefix(src, VIDEOS_API_PREFIX);

      return {
        ...rest,
        src: `${src + (src.includes('?') ? '&' : '?')}token=${getURLToken()}`,
      };
    });
  } catch (error) {
    console.error('fetch videos', error);

    return [];
  }
}
