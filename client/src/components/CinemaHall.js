import React, { useState, useEffect } from 'react';
import token from '../utils/token';
import fetch from '../utils/fetch';

import './CinemaHall.css';

export function CinemaHall({ theme }) {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    showVideos(setVideos);
  }, []);

  return (
    <ul className={ `video-list ${theme}` }>
      {videos.map(({ src, caption }, index) => {
        return <li key={src}>
         <a href={src}>{caption}</a>
        </li>
      })}
    </ul>
  );
}

function showVideos(setVideos) {
  const path = '/api/videos';

  return fetch(path)
    .then(videos => {
      // console.log('urls:', urls);

      setVideos(videos.map(video => {
        const { src } = video;

        return {
          ...video,
          src: src + (src.includes('?') ? '&' : '?') + `token=${token}`,
        };
      }));
    })
    .catch(error => {
      console.error('fetch videos', error);
    });
}
