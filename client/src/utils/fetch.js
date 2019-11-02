import token from './token';

export default async function fetch(api) {
  const resp = await window.fetch(`${api}?token=${token}`);

  if (resp.status !== 200) {
    throw new Error(resp.status + ' ' + resp.statusText);
  }

  return await resp.json();
}
