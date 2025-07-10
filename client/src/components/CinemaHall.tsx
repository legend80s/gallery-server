import { useState, useEffect } from 'react';
import getURLToken from '../utils/token';
import fetch from '../utils/fetch';

import './CinemaHall.css';
import type { ITheme } from './Gallery';
import type { IRespVideo } from '../../../lib/request.types';

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
    const videos = await fetch(path);

    return (videos as IRespVideo[]).map(({ src, ...rest }) => ({
      ...rest,
      src: `${src + (src.includes('?') ? '&' : '?')}token=${getURLToken()}`,
    }));
  } catch (error) {
    console.error('fetch videos', error);

    return [];
  }
}
