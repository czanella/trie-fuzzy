import { TrieNode } from './TrieNode';

export interface FuzzyMatch {
  key: string;
  distance: number;
}

export class Trie {
  private readonly keys: string[];
  private readonly root: TrieNode;

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

  *prefixSearch(prefix: string) {
    const [startRange, endRange] = this.root.traverse(
      prefix,
      node => node?.wordRange ?? [0, -1],
    );

    for (let i = startRange; i <= endRange; i++) {
      yield this.keys[i];
    }
  }

  *fuzzySearch(word: string, maxDistance: number = 1) {
    const intDistance = Math.floor(maxDistance);

    if (intDistance < 0) {
      throw new Error('maxDistance must be positive or zero');
    }

    for (
      const [keyIndex, distance]
      of
      this.root.fuzzyTraverse(word, intDistance)
    ) {
      const result: FuzzyMatch = { key: this.keys[keyIndex], distance };
      yield result;
    }
  }
}
