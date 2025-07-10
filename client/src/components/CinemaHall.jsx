import { useState, useEffect } from 'react';
import getURLToken from '../utils/token';
import fetch from '../utils/fetch';

import './CinemaHall.css';

export function CinemaHall({ theme }) {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    showVideos(setVideos);
  }, []);

  return (
    <>
      {videos.length ? <hr /> : null}

      <ul className={`video-list ${theme}`}>
        {videos.map(({ src, caption }, index) => {
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

function showVideos(setVideos) {
  const path = '/api/videos';

  return fetch(path)
    .then((videos) => {
      // console.log('urls:', urls);

      setVideos(
        videos.map((video) => {
          const { src } = video;

          return {
            ...video,
            src:
              src + (src.includes('?') ? '&' : '?') + `token=${getURLToken()}`,
          };
        })
      );
    })
    .catch((error) => {
      console.error('fetch videos', error);
    });
}
