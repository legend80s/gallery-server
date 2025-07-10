// https://github.com/jossmac/react-images
import { useState, useEffect } from 'react';
import PhotoWall from 'react-photo-gallery';
import Carousel, { Modal, ModalGateway } from 'react-images';

import fetch from '../utils/fetch';
import getURLToken from '../utils/token';
// import { showDemoPhotos } from './gallery-from-demo-api';

import './Gallery.css';

export const THEME_LIGHT = 'light';
export const THEME_DARK = 'dark';

/**
 * @typedef {import('../../../lib/request.typings').IPhotosResp} IPhotosResp
 */

export function Gallery({ theme, direction }) {
  const [photos, setPhotos] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // TODO: refactor into hooks
  useEffect(() => {
    showPhotos().then((photosWithToken) => {
      // console.log('photosWithToken:', JSON.stringify(photosWithToken));
      setPhotos(photosWithToken);
    });

    // showDemoPhotos(setPhotos);
  }, []);

  // console.log(
  //   'photos2:',
  //   photos,
  //   'selectedIndex',
  //   selectedIndex,
  //   'modalIsOpen',
  //   modalIsOpen
  // );

  const toggleModal = (index) => {
    console.log('index:', index);
    setSelectedIndex(index);
    setModalIsOpen(!modalIsOpen);
  };

  return (
    <div className={`gallery ${theme}`}>
      {modalIsOpen && (
        <ModalGateway>
          <Modal onClose={() => setModalIsOpen(!modalIsOpen)}>
            <Carousel views={photos} currentIndex={selectedIndex} />
          </Modal>
        </ModalGateway>
      )}

      {photos.length ? (
        <PhotoWall
          photos={photos}
          onClick={(_, { index }) => toggleModal(index)}
          margin={2}
          direction='row'
          targetRowHeight={300}
        />
      ) : null}
    </div>
  );
}

/**
 * Fetch photos from remote.
 * @param {string} path
 * @returns {Promise<IPhotosResp>}
 */
export async function fetchPhotos(path) {
  try {
    return await fetch(path);
  } catch (error) {
    console.error('fetchPhotos', error);

    return [];
  }
}

/**
 *
 * @returns {Promise<IPhotosResp>}
 */
async function showPhotos() {
  const path = '/api/images';

  return fetchPhotos(path).then((photos) => {
    // console.log('photos1:', photos);
    const token = getURLToken();

    const photosWithToken = photos.map((photo) => {
      const { src } = photo;

      return {
        ...photo,
        src: `${src + (src.includes('?') ? '&' : '?')}token=${token}`,
      };
    });

    return photosWithToken;
  });
}
