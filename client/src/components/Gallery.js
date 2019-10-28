import React, { useState, useEffect, useRef } from 'react';
import ImageGallery from 'react-image-gallery';
import './Gallery.css';

export default function Gallery() {
  const [showNav, setShowNav] = useState(true);
  const [showThumbnails, setShowThumbnails] = useState(true);
  const [images, setImages] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const galleryRef = useRef(null);

  useEffect(() => {
    collect(setImages);
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
  const now = Date.now();
  const prevClickTimestamp = ismimicDbClick.prevClickTimestamps[key] || 0;

  /** time gap in milliseconds between two clicks */
  const gap = now - prevClickTimestamp;

  // console.log({ now, prevClickTimestamp, gap });

  const isdbClick = gap >= 100 && gap <= 500;

  // save previous click timestamp
  ismimicDbClick.prevClickTimestamps[key] = now;

  return isdbClick;
}

ismimicDbClick.prevClickTimestamps = {};

/**
 * Collect images from API.
 *
 * @param {(images: GalleryImage[]) => void} setImages
 * @returns {Promise<void>}
 */
async function collect(setImages) {
  try {
    const resp = await window.fetch('/api/images');
    const srcs = await resp.json();

    return setImages(srcs.map(src => ({ original: src, thumbnail: src })));
  } catch (error) {
    console.error('collect', error);
  }
}
