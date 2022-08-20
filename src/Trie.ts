import { TrieNode } from './TrieNode';
import { FuzzyMatch } from './types';

export class Trie {
  private readonly keys: string[];
  private readonly root: TrieNode;

  constructor (words: string[]) {
    this.keys = [...words].sort();
    this.root = new TrieNode();

    this.keys.forEach((key, i) => {
      this.root.insertKey(key, i);
    });
  }

  has (word: string) {
    return this.root.traverse(word, node => Boolean(node?.match));
  }

  * search (prefix: string) {
    const [startRange, endRange] = this.root.traverse(prefix, node => node?.wordRange ?? [0, -1]);

    for (let i = startRange; i <= endRange; i++) {
      yield this.keys[i];
    }
  }

  * fuzzySearch (word: string, distance: number = 1) {
    const x: FuzzyMatch = { key: 'HEY!', distance: 0 };
    yield x;
  }
}
