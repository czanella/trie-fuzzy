import { InfiniteArray } from './InfiniteArray';

export class TrieNode {
  readonly character: string;
  readonly wordRange: [number, number];
  readonly children: Record<string, TrieNode>;
  match?: true;

  constructor (
    character: string = '',
    startRange: number = 0,
    endRange: number = -1,
  ) {
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
      this.children[character] = new TrieNode(
        character,
        wordIndex,
        wordIndex,
      );
    }

    this.children[character].insertKey(word, wordIndex, prefix + 1);
  }

  traverse<T>(
    word: string,
    resultCallback: (trieNode?: TrieNode) => T,
    prefix: number = 0,
  ): T {
    if (prefix >= word.length) {
      return resultCallback(this);
    }

    const character = word[prefix];
    if (this.children[character] === undefined) {
      return resultCallback();
    }

    return this.children[character].traverse(
      word,
      resultCallback,
      prefix + 1,
    );
  }

  * fuzzyTraverse (
    word: string,
    distance: number,
    parentCosts?: InfiniteArray<number>,
    height: number = 0,
  ): Generator<[number, number]> {
    // Calculate costs array for this node and minimum cost
    const costs = new InfiniteArray(
      Math.max(0, height - distance),
      Math.min(word.length, height + distance),
      Infinity,
    );
    let minCost = Infinity;

    for (const index of costs.indexes()) {
      let cost: number;
      if (parentCosts == null) {
        cost = index;
      } else {
        const character = word[index - 1] ?? '';
        const replacementCost = this.character === character ? 0 : 1;
        cost = Math.min(
          costs.get(index - 1) + 1,
          parentCosts.get(index) + 1,
          parentCosts.get(index - 1) + replacementCost,
        );
      }
      costs.set(index, cost);
      minCost = Math.min(minCost, cost);
    }

    // If it's a match, yields it
    if (this.match && costs.get(word.length) <= distance) {
      yield [this.wordRange[0], costs.get(word.length)];
    }

    // Checks minmum cost to see if it can continue traversing
    if (minCost <= distance) {
      for (const childNode of Object.values(this.children)) {
        for (const result of childNode.fuzzyTraverse(
          word,
          distance,
          costs,
          height + 1,
        )) {
          yield result;
        }
      }
    }
  }
}
