// @ts-nocheck
import { fetchPhotos } from './Gallery';

export function showDemoPhotos(setPhotos) {
  const path =
    'https://pixabay.com/api/?key=11039936-6e77e51408504e6821e3c708b&q=yosemite&image_type=photo&per_page=22';

  fetchPhotos(path).then((photos) => {
    setPhotos(
      photos.hits.map((photo) => {
        const {
          tags,
          downloads,
          // previewURL: thumbnail,
          webformatURL: regular,
          largeImageURL: fullscreen,
          webformatWidth,
          webformatHeight,
          // previewWidth,
          // previewHeight,
        } = photo;

        return {
          caption: tags + '. Downloads ' + downloads,

          // Warning: Failed prop type: The prop `photos[0].src` is marked as required in `Gallery`, but its value is `undefined`.
          src: regular,

          source: {
            thumbnail: regular,
            regular: fullscreen,
            fullscreen,
          },

          width: webformatWidth,
          height: webformatHeight,
        };
      })
    );
  });
}
