import { Injectable } from '@nestjs/common';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';

import isImage from 'is-image';
import { promisify } from 'node:util';
import size from 'image-size';

// @ts-expect-error no types
const sizeOf = promisify(size);

import { getRelativeFiles, normalizePath } from '../utils/file';
import { PHOTOS_API_PREFIX } from '@shared/constants';
import type { IPhotosResp } from '@shared/request.types';

import { mediaFolder } from '../utils/program';

@Injectable()
export class PhotosService {
  create(_createPhotoDto: CreatePhotoDto) {
    return 'This action adds a new photo';
  }

  async findAll() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const list = await getPhotos(mediaFolder);

    // return list.slice(0, 1);
    return list;
  }

  findOne(id: number) {
    return `This action returns a #${id} photo`;
  }

  update(id: number, _updatePhotoDto: UpdatePhotoDto) {
    return `This action updates a #${id} photo`;
  }

  remove(id: number) {
    return `This action removes a #${id} photo`;
  }
}

async function getPhotos(mediaFolder: string): Promise<IPhotosResp> {
  const photoPaths = getRelativeFiles(mediaFolder, isImage);

  const photos: IPhotosResp = await Promise.all(
    photoPaths.map(async (src) => {
      let dimensions = { width: 1, height: 1, orientation: 1 };

      try {
        dimensions = await sizeOf(`${mediaFolder}/${src}`);
      } catch (error) {
        console.error(error);
      }
      const { width, height, orientation } = dimensions;
      const isVertical = orientation === 6;

      return {
        ...normalizePath(src, { prefix: PHOTOS_API_PREFIX }),
        width: isVertical ? height : width,
        height: isVertical ? width : height,
      };
    }),
  );

  // console.log('photos:', photos.slice(0, 3));

  return photos;
}
