export function tryTrimPrefix(path: string, prefix: string): string {
  // console.log('process.env.NODE_ENV:', process.env.NODE_ENV);
  // @ts-expect-error it works
  const isDev = process.env.NODE_ENV === 'development';

  if (isDev) {
    return path;
  }

  return trimPrefix(path, prefix);
}

function trimPrefix(path: string, prefix: string) {
  return path.startsWith(prefix) ? path.slice(prefix.length) : path;
}
