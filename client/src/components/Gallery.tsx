// https://github.com/jossmac/react-images
import PhotoWall from 'react-photo-gallery';
import { useState, useEffect } from 'react';
import Carousel, { Modal, ModalGateway } from 'react-images';

import fetch from '../utils/fetch';
import getURLToken from '../utils/token';
// import { showDemoPhotos } from './gallery-from-demo-api';

import type { IPhotosResp } from '../../../lib/request.types';

import './Gallery.css';

export type ITheme = 'light' | 'dark';
export type IDirection = 'row' | 'column';

export const THEME_LIGHT: ITheme = 'light';
export const THEME_DARK: ITheme = 'dark';

export function Gallery({
  theme,
  direction,
}: {
  theme: ITheme;
  direction: IDirection;
}) {
  const [photos, setPhotos] = useState<IUIPhoto[]>([]);
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

  const toggleModal = (index: number) => {
    // console.log('index:', index);
    setSelectedIndex(index);
    setModalIsOpen(!modalIsOpen);
  };

  return (
    <div className={`gallery ${theme}`}>
      {modalIsOpen && (
        // @ts-expect-error it works
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
          direction={direction}
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
export async function fetchPhotos(path: string): Promise<IPhotosResp> {
  try {
    return await fetch(path);
  } catch (error) {
    console.error('fetchPhotos', error);

    return [];
  }
}

type IPhoto = IPhotosResp[number];

type IUIPhoto = IPhoto & {
  source: string;
};

async function showPhotos(): Promise<IUIPhoto[]> {
  const path = '/api/images';

  return fetchPhotos(path).then((photos) => {
    // console.log('photos1:', photos);
    const token = getURLToken();

    const photosWithToken = photos.map((photo) => {
      const { src } = photo;

      return {
        ...photo,
        source: `${src + (src.includes('?') ? '&' : '?')}token=${token}`,
      };
    });

    return photosWithToken;
  });
}
