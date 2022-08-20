export class TrieNode {
  readonly character: string;
  readonly wordRange: [number, number];
  readonly children: Record<string, TrieNode>;
  match?: true;

  constructor (character: string = '', startRange: number = 0, endRange: number = -1) {
    this.character = character;
    this.wordRange = [startRange, endRange];
    this.children = {};
  }

  insertKey (word: string, wordIndex: number, prefix: number = 0) {
    this.wordRange[1] = wordIndex;

    if (prefix >= word.length) {
      this.match = true;
      return;
    }

    const character = word[prefix];
    if (this.children[character] === undefined) {
      this.children[character] = new TrieNode(character, wordIndex, wordIndex);
    }

    this.children[character].insertKey(word, wordIndex, prefix + 1);
  }

  traverse<T>(
    word: string,
    resultCallback: (trieNode?: TrieNode) => T,
    prefix: number = 0
  ): T {
    if (prefix >= word.length) {
      return resultCallback(this);
    }

    const character = word[prefix];
    if (this.children[character] === undefined) {
      return resultCallback();
    }

    return this.children[character].traverse(word, resultCallback, prefix + 1);
  }
}
