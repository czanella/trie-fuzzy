import { Trie } from '../src/Trie';

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

    it('returns false when looking for a prefix of a key that isn\'t a key itself', () => {
      const trie = new Trie([
        'armadura',
        'armadilha',
      ]);

      expect(trie.has('arma')).toBe(false);
    });
  })
});
