import { fetchPhotos } from './Gallery';

export function showDemoPhotos(setPhotos) {
  const path =
    'https://pixabay.com/api/?key=11039936-6e77e51408504e6821e3c708b&q=yosemite&image_type=photo&per_page=22';

  fetchPhotos(path).then(photos => {
    setPhotos(photos.hits.map(({ tags, downloads, webformatURL, webformatWidth, webformatHeight }) => {
      return {
        caption: tags + '. Downloads ' + downloads,
        src: webformatURL,

        width: webformatWidth,
        height: webformatHeight,
      };
    }));
  });
}
