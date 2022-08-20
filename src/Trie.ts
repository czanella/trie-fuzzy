import { TrieNode } from './TrieNode';

export class Trie {
  private keys: string[];
  private root: TrieNode;

  constructor(words: string[]) {
    this.keys = [...words].sort();
    this.root = new TrieNode();

    this.keys.forEach((key, i) => {
      this.root.insertKey(key, i);
    });
  }

  private *keysInRange(range: [number, number] = [0, -1]) {
    for (let i = range[0]; i <= range[1]; i++) {
      yield this.keys[i];
    }
  }

  has(word: string) {
    return this.root.traverse(word, node => Boolean(node?.match));
  }

  search(prefix: string) {
    const range = this.root.traverse(prefix, node => node?.wordRange);

    return this.keysInRange(range);
  }
}
