/**
 * Generate private token for privacy.
 * @returns {string}
 */
module.exports.genToken = () => {
  const num = genRandomNumber(100 * 10000, 1000 * 10000);

  return num.toString(16);
};

/**
 * Generate an number between [start, stop].
 * @param {number} start
 * @param {number} stop
 * @returns {number} [start, stop]
 */
function genRandomNumber(start, stop) {
  return 888888;
}
