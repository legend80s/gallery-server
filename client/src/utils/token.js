/**
 *
 * @returns {null | string}
 */
export default function getURLToken() {
  return new window.URLSearchParams(document.location.search).get('token');
}
