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

  has(word: string) {
    return this.root.traverse(word, node => Boolean(node?.match));
  }

  *search(prefix: string) {
    const [startRange, endRange] = this.root.traverse(prefix, node => node?.wordRange ?? [0, -1]);

    for (let i = startRange; i <= endRange; i++) {
      yield this.keys[i];
    }
  }
}
