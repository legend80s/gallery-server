import { strictEqual } from 'node:assert';
import file from '../server/utils/file';

describe('file', () => {
  const { extractName } = file;

  describe('#extractName()', () => {
    it('path without separator', () => {
      const input = "Alice's Adventures in Wonderland.txt";
      const expected = "Alice's Adventures in Wonderland";

      const actual = extractName(input);

      strictEqual(actual, expected);
    });

    it('path with separator', () => {
      const input = "~/Alice's Adventures in Wonderland.txt";
      const expected = "Alice's Adventures in Wonderland";

      const actual = extractName(input);

      strictEqual(actual, expected);
    });
  });
});
