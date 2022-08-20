import { TrieNode } from './TrieNode'

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
    return this.root.has(word);
  }
}
