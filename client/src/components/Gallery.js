import React, { useState, useEffect, useRef } from 'react';
import ImageGallery from 'react-image-gallery';
import './Gallery.css';
import { HOST } from '../constants';

export default function Gallery() {
  const [showNav, setShowNav] = useState(true);
  const [showThumbnails, setShowThumbnails] = useState(true);
  const [images, setImages] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const galleryRef = useRef(null);

  useEffect(() => {
    fetchImages(setImages);
  }, [])

  // let isFullscreen = false;
  const onScreenChange = (fullscreenElement) => {
    // console.log('fullscreenElement:', fullscreenElement);
    const isFullscreen = !!fullscreenElement;
    // console.log('isFullscreen onScreenChange:', isFullscreen);
    setIsFullscreen(isFullscreen);

    if (isFullscreen) {
      setShowNav(false);
      setShowThumbnails(false);
    } else {
      setShowNav(true);
      setShowThumbnails(true);
    }
  };

  const onClick = () => {
    if (ismimicDbClick('ImageGallery')) {
      // console.log('isFullscreen onClick:', isFullscreen);
      isFullscreen ? galleryRef.current.exitFullScreen() : galleryRef.current.fullScreen();
    }
  };

  return (
    <ImageGallery
      ref={galleryRef}
      items={images}
      showBullets={true}
      showIndex={true}
      slideOnThumbnailOver={false}
      useBrowserFullscreen={true}
      showNav={showNav}
      showThumbnails={showThumbnails}
      onScreenChange={onScreenChange}
      onClick={onClick}
    />
  );
}

function ismimicDbClick(key) {
  /** 两次点击间隔时间。单位 ms */
  const now = Date.now();

  const prevClickTimestamp = ismimicDbClick.prevClickTimestamps[key] || 0;
  const gap = now - prevClickTimestamp;
  console.log({ now, prevClickTimestamp, gap });

  const isdbClick = gap >= 100 && gap <= 500;

  // save previous click timestamp
  ismimicDbClick.prevClickTimestamps[key] = now;

  return isdbClick;
}

ismimicDbClick.prevClickTimestamps = {};

async function fetchImages(setImages) {
  let srcs;

  try {
    srcs = await window.fetch(`${HOST}/api/images`)
      .then(resp => resp.json());
  } catch (error) {
    return console.error('fetchImages', error);
  }

  srcs && setImages(srcs.map(src => ({ original: src, thumbnail: src })));
}
