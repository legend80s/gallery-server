import React, { useState, useEffect } from 'react';
import Carousel, { Modal, ModalGateway } from 'react-images';
import PhotoWall from "react-photo-gallery";

import './Gallery.css';
import fetch from '../utils/fetch'
import token from '../utils/token';

export function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const path = '/api/images';
    // const path = 'https://pixabay.com/api/?key=11039936-6e77e51408504e6821e3c708b&q=yosemite&image_type=photo&per_page=22';
    fetchPhotos(path).then(photos => {
      // console.log('urls:', urls);

      // setPhotos(urls.hits.map(url => {
      setPhotos(photos.map(({ src, caption, width, height }) => {
        // console.log('url:', url);
        // extract the photo name from src

        return {
          // caption: url.tags + '. Downloads ' + url.downloads,
          caption,
          // src: url.webformatURL,
          src: src + (src.includes('?') ? '&' : '?') + `token=${token}`,

          width,
          height,
        };
      }));
    });
  }, []);

  // console.log('photos:', photos, 'selectedIndex', selectedIndex, 'modalIsOpen', modalIsOpen);

  const toggleModal = (index) => {
    setSelectedIndex(index);
    setModalIsOpen(!modalIsOpen);
  };

  return (<div className="gallery">
    {modalIsOpen && <ModalGateway>
        <Modal onClose={() => setModalIsOpen(!modalIsOpen)}>
          <Carousel views={photos} currentIndex={selectedIndex} />
        </Modal>
    </ModalGateway>}

    {photos.length && <PhotoWall
      photos={photos}
      direction={'row'}
      onClick={(_, { index }) => toggleModal(index)}
    />}
  </div>);
}

/**
 * Fetch photos from remote.
 *
 * @returns {Promise<string[]>}
 */
async function fetchPhotos(path) {
  try {
    return await fetch(path);
  } catch (error) {
    console.error('fetchPhotos', error);

    return [];
  }
}
