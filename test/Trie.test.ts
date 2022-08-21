import { Trie } from '../src/Trie';
import { FuzzyMatch } from '../src/types';

describe('trie', () => {
  describe('has', () => {
    it('returns true if word exists in trie', () => {
      const trie = new Trie([
        'carro',
        'arma',
        'baleia',
        'armadura',
        'armadilha',
        'artesanato',
        'balela',
      ]);

      expect(trie.has('armadura')).toBe(true);
    });

    it('returns false if word doesn\'t exist in trie', () => {
      const trie = new Trie([
        'carro',
        'arma',
        'baleia',
        'armadura',
        'armadilha',
        'artesanato',
        'balela',
      ]);

      expect(trie.has('foo')).toBe(false);
    });

    it('returns false when looking for a prefix of a key', () => {
      const trie = new Trie([
        'armadura',
        'armadilha',
      ]);

      expect(trie.has('arma')).toBe(false);
    });
  });

  describe('search', () => {
    it('must return all words that share a prefix', () => {
      const trie = new Trie([
        'carro',
        'arma',
        'baleia',
        'armadura',
        'armadilha',
        'artesanato',
        'balela',
      ]);

      const result = [...trie.search('arma')].sort();
      expect(result).toEqual(['arma', 'armadilha', 'armadura']);
    });

    it('must return nothing if no key has the passed prefix', () => {
      const trie = new Trie([
        'carro',
        'arma',
        'baleia',
        'armadura',
        'armadilha',
        'artesanato',
        'balela',
      ]);

      const result = [...trie.search('dados')].sort();
      expect(result).toEqual([]);
    });
  });

  describe('fuzzySearch', () => {
    const compareFuzzyResult = (a: FuzzyMatch, b: FuzzyMatch) => {
      const d = a.distance - b.distance;
      if (d !== 0) {
        return d;
      }

      if (a.key !== b.key) {
        return a.key > b.key ? 1 : -1;
      }

      return 0;
    };

    it('must find only exact matches when distance is 0', () => {
      const trie = new Trie([
        'AAAA',
        'AAAB',
        'CAAA',
        'CAAB',
        'AAA',
        'AAAAA',
      ]);

      const result = [...trie.fuzzySearch('AAAA', 0)];

      expect(result).toEqual([{ key: 'AAAA', distance: 0 }]);
    });

    it('must find matches based on replacement', () => {
      const trie = new Trie([
        'AAAA',
        'AAAB',
        'CAAA',
        'CAAB',
        'AABB',
        'ABBB',
        'BBBB',
      ]);

      const result = [...trie.fuzzySearch('AAAA', 1)].sort(
        compareFuzzyResult,
      );

      expect(result).toEqual([
        { key: 'AAAA', distance: 0 },
        { key: 'AAAB', distance: 1 },
        { key: 'CAAA', distance: 1 },
      ]);

      const result2 = [...trie.fuzzySearch('AAAA', 2)].sort(
        compareFuzzyResult,
      );

      expect(result2).toEqual([
        { key: 'AAAA', distance: 0 },
        { key: 'AAAB', distance: 1 },
        { key: 'CAAA', distance: 1 },
        { key: 'AABB', distance: 2 },
        { key: 'CAAB', distance: 2 },
      ]);
    });

    it('must find matches based on removal', () => {
      const trie = new Trie([
        'ABCD',
        'ABC',
        'ABD',
        'ACD',
        'BCD',
        'AB',
        'AD',
        'A',
        'Z',
      ]);

      const result = [...trie.fuzzySearch('ABCD', 1)].sort(
        compareFuzzyResult,
      );

      expect(result).toEqual([
        { key: 'ABCD', distance: 0 },
        { key: 'ABC', distance: 1 },
        { key: 'ABD', distance: 1 },
        { key: 'ACD', distance: 1 },
        { key: 'BCD', distance: 1 },
      ]);

      const result2 = [...trie.fuzzySearch('ABCD', 2)].sort(
        compareFuzzyResult,
      );

      expect(result2).toEqual([
        { key: 'ABCD', distance: 0 },
        { key: 'ABC', distance: 1 },
        { key: 'ABD', distance: 1 },
        { key: 'ACD', distance: 1 },
        { key: 'BCD', distance: 1 },
        { key: 'AB', distance: 2 },
        { key: 'AD', distance: 2 },
      ]);
    });

    it('must find matches based on addition', () => {
      const trie = new Trie([
        'AAAA',
        'BAAAA',
        'CAAAA',
        'AACAA',
        'AAAAB',
        'BAAAAF',
        'CAAFAA',
        'AACEAA',
        'AAEAAB',
        'ABBBAAA',
        'ABBBBBBAAA',
      ]);

      const result = [...trie.fuzzySearch('AAAA', 1)].sort(
        compareFuzzyResult,
      );

      expect(result).toEqual([
        { key: 'AAAA', distance: 0 },
        { key: 'AAAAB', distance: 1 },
        { key: 'AACAA', distance: 1 },
        { key: 'BAAAA', distance: 1 },
        { key: 'CAAAA', distance: 1 },
      ]);

      const result2 = [...trie.fuzzySearch('AAAA', 2)].sort(
        compareFuzzyResult,
      );

      expect(result2).toEqual([
        { key: 'AAAA', distance: 0 },
        { key: 'AAAAB', distance: 1 },
        { key: 'AACAA', distance: 1 },
        { key: 'BAAAA', distance: 1 },
        { key: 'CAAAA', distance: 1 },
        { key: 'AACEAA', distance: 2 },
        { key: 'AAEAAB', distance: 2 },
        { key: 'BAAAAF', distance: 2 },
        { key: 'CAAFAA', distance: 2 },
      ]);
    });

    it('must find matches based on combined edit types', () => {
      const trie = new Trie(['ARTES', 'FOOBAR']);

      const result = [...trie.fuzzySearch('PORTE', 3)];

      expect(result).toEqual([{ key: 'ARTES', distance: 3 }]);
    });
  });
});
