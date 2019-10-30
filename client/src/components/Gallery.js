import React, { useState, useEffect } from 'react';
import Carousel, { Modal, ModalGateway } from 'react-images';
import './Gallery.css';

export function Gallery() {
  const [images, setPhotos] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    fetchPhotos().then(urls => {
      setPhotos(urls.map(url => {
        console.log('url:', url);
        const matches = url.match(/\/([^\s/]+)\.[a-z]+$/);

        return {
          caption: matches ? matches[1] : '',
          src: url,
        };
      }));
    });
  }, []);

  const toggleLightbox = (index) => {
    setSelectedIndex(index);
    setModalIsOpen(!modalIsOpen);
  };

  return !modalIsOpen ? <Album>
      {images.map(({ author, caption, src }, j) => (
        <Image onClick={() => toggleLightbox(j)} key={src}>
          <img
            alt={caption}
            src={src}
            style={{
              cursor: 'pointer',
              width: '97%',
              // height: '94%',
              // objectFit: 'cover',
            }}
          />
        </Image>
      ))}
    </Album> : <ModalGateway>
    {modalIsOpen ? (
      <Modal onClose={() => setModalIsOpen(!modalIsOpen)}>
        <Carousel views={images} currentIndex={selectedIndex} />
      </Modal>
    ) : null}
  </ModalGateway>;
}

const gutter = 4;

const Album = (props) => (
  <div
    style={{
      overflow: 'hidden',
      marginLeft: gutter,
      marginRight: gutter,
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
    }}
    {...props}
  />
);

const Image = (props) => (
  <div
    className="image-wrapper"
    {...props}
  />
);

/**
 * Fetch photos from remote.
 *
 * @returns {Promise<string[]>}
 */
async function fetchPhotos() {
  try {
    const resp = await window.fetch('/api/images');
    const urls = await resp.json();

    return urls;
  } catch (error) {
    console.error('fetchPhotos', error);

    return [];
  }
}
