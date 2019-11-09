import React, { useState, useEffect } from 'react';
// https://github.com/jossmac/react-images
import Carousel, { Modal, ModalGateway } from 'react-images';
import PhotoWall from "react-photo-gallery";

import fetch from '../utils/fetch'
import token from '../utils/token';
// import { showDemoPhotos } from './gallery-from-demo-api';

import './Gallery.css';

export const THEME_LIGHT = 'light';
export const THEME_DARK = 'dark';

export function Gallery({ theme }) {
  const [photos, setPhotos] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    showPhotos(setPhotos);
    // showDemoPhotos(setPhotos);
  }, []);

  // console.log('photos:', photos, 'selectedIndex', selectedIndex, 'modalIsOpen', modalIsOpen);

  const toggleModal = (index) => {
    setSelectedIndex(index);
    setModalIsOpen(!modalIsOpen);
  };

  return (<div className={'gallery ' + theme}>
    {modalIsOpen && <ModalGateway>
        <Modal onClose={() => setModalIsOpen(!modalIsOpen)}>
          <Carousel views={photos} currentIndex={selectedIndex} />
        </Modal>
    </ModalGateway>}

    {photos.length ? <PhotoWall
      photos={photos}
      direction={'row'}
      onClick={(_, { index }) => toggleModal(index)}
    /> : null}
  </div>);
}

/**
 * Fetch photos from remote.
 *
 * @returns {Promise<string[]>}
 */
export async function fetchPhotos(path) {
  try {
    return await fetch(path);
  } catch (error) {
    console.error('fetchPhotos', error);

    return [];
  }
}

function showPhotos(setPhotos) {
  const path = '/api/images';
  fetchPhotos(path).then(photos => {
    // console.log('urls:', urls);

    setPhotos(photos.map(photo => {
      const { src } = photo;

      return {
        ...photo,
        src: src + (src.includes('?') ? '&' : '?') + `token=${token}`,
      };
    }));
  });
}
