const assert = require('assert');
const file = require('../server/utils/file');

describe('file', () => {
  const { extractName } = file;

  describe('#extractName()', () => {
    it('path without separator', () => {
      const input = "Alice's Adventures in Wonderland.txt";
      const expected = "Alice's Adventures in Wonderland";

      const actual = extractName(input);

      assert.strictEqual(actual, expected);
    });

    it('path with separator', () => {
      const input = "~/Alice's Adventures in Wonderland.txt";
      const expected = "Alice's Adventures in Wonderland";

      const actual = extractName(input);

      assert.strictEqual(actual, expected);
    });

    it('name with separator', () => {
      const input = "~/Alice\'s Adventures\ in Wonder\\land.txt";
      const expected = "Alice's Adventures in Wonder\\land";

      const actual = extractName(input);

      assert.strictEqual(actual, expected);
    });

  });
});
