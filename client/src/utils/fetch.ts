import getURLToken from './token';

export default async function fetch(api: string) {
  const token = getURLToken();

  const resp = await window.fetch(!token ? api : `${api}?token=${token}`);

  if (resp.status !== 200) {
    throw new Error(resp.status + ' ' + resp.statusText);
  }

  return await resp.json();
}
