// https://github.com/jossmac/react-images
import { useState } from 'react';
import Carousel, { Modal, ModalGateway } from 'react-images';
import PhotoWall from 'react-photo-gallery';

import { usePhotos } from './Gallery.hooks';

// import { showDemoPhotos } from './gallery-from-demo-api';
// console.log('PHOTOS_API_PREFIX:', PHOTOS_API_PREFIX);

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
  const { photos } = usePhotos();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // console.log(
  //   "photos2:",
  //   photos,
  //   "selectedIndex",
  //   selectedIndex,
  //   "modalIsOpen",
  //   modalIsOpen,
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
