export type IRespPhoto = {
  width: number;
  height: number;
  caption: string;
  src: string;
};

export type IPhotosResp = IRespPhoto[];

export type IRespVideo = Pick<IRespPhoto, 'caption' | 'src'>;
