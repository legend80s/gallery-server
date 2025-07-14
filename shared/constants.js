// ! 请勿改成 ts
// ! 只能是 js 后缀，因为 nestjs 编译并不会将其编译为 js

export const DEFAULT_PORT = Number(
  (typeof process !== 'undefined' ? process.env.PORT : import.meta.env.PORT) ??
    3000,
);
export const HOST = `http://localhost:${DEFAULT_PORT}`;
export const PHOTOS_API_PREFIX = '/photos/';
export const VIDEOS_API_PREFIX = '/videos/';
