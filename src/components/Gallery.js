import React, { useState } from 'react';
import ImageGallery from 'react-image-gallery';
import './Gallery.css';
 
export default function Gallery() {
  const [showNav, setShowNav] = useState(true);
  const [showThumbnails, setShowThumbnails] = useState(true);
  
  const onScreenChange = (fullscreenElement) => {
    // console.log('fullscreenElement:', fullscreenElement);
    const isFullscreen = !!fullscreenElement;

    if (isFullscreen) {
      setShowNav(false);
      setShowThumbnails(false);
    } else {
      setShowNav(true);
      setShowThumbnails(true);
    }
  };

  const images = [
    {
      original: 'https://picsum.photos/id/1018/1000/600/',
      thumbnail: 'https://picsum.photos/id/1018/250/150/',
    },
    {
      original: 'https://picsum.photos/id/1015/1000/600/',
      thumbnail: 'https://picsum.photos/id/1015/250/150/',
    },
    {
      original: 'https://picsum.photos/id/1019/1000/600/',
      thumbnail: 'https://picsum.photos/id/1019/250/150/',
    },
  ];

  return (
    <ImageGallery
      items={images}
      showBullets={true}
      showIndex={true}
      slideOnThumbnailOver={true}
      useBrowserFullscreen={true}
      showNav={showNav}
      showThumbnails={showThumbnails}
      onScreenChange={onScreenChange}
    />
  );
}
