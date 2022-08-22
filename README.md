# trie-fuzzy

A TS implementation of the [Trie](https://en.wikipedia.org/wiki/Trie) data structure, including fuzzy (approximate) string matching.

Powered by [DTS](https://weiran-zsd.github.io/dts-cli/).

## Features

* Exact string search
* Prefix search
* Fuzzy search
* Generator interfaces - no need to store all results in memory all at once
* Runs in both NodeJS and in browsers
* No dependencies

## Usage

```typescript
import { Trie } from 'trie-fuzzy';

const trie = new Trie([
  'armor',
  'armadillo',
  'armageddon',
  'artisan',
  'timer',
  'time',
  'tier',
  'dime',
  'fiber',
  'mime',
  'miner',
]);

trie.has('armor'); // true
trie.has('arm'); // false

for (const result of trie.search('arm')) {
  console.log(result);
}
/*
armadillo
armarmageddon
armor
*/

for (const { key, distance } of trie.fuzzySearch('timer', 2)) {
  console.log(key, distance);
}
/*
dime 2
fiber 2
mime 2
miner 2
tier 1
time 1
timer 0
*/

```

## API
***
### _Constructor_
```typescript
constructor(words: string[])
```
Builds a new `Trie` indexing all words in `words`.

`words`: a list of words that will be inserted in the Trie.
***

### _has_ - exact string matching
```typescript
has(word: string) => boolean
```
Verifies if a given word is contained in the Trie's word set.

`word`: the word to be queried in the Trie.

_Returns:_ `true` if `word` exists in the Trie, `false` otherwise.
***

### _search_ - prefix search
```typescript
*search(prefix: string) => Generator<string>
```
Searches for all words in the Trie's set with a given prefix.

`prefix`: the prefix to be queried.

_Returns:_ A Generator that iterates through all words in the Trie's set that start with `prefix`.
***

### _fuzzySearch_ - approximate string matching
```typescript
*fuzzySearch(word: string, maxDistance: number = 1) => Generator<{ key: string, distance: number }>
```
Searches for all words in the Trie's set that are similar to a given word. Uses the [Levenshtein distance](https://en.wikipedia.org/wiki/Levenshtein_distance) (or edit distance) to measure similarity.

`word`: the word to be queried.

`maxDistance`: the threshold that defines the maximal edit distance between `word` and the returned results.

_Returns:_ A Generator that iterates through all words in the Trie's set where the edit distance to `word` is lower than or equal to `maxDistance`. Each result is an object containing two keys: `key` holds the word from the Trie set that was matched, and `distance` holds the edit distance between the result and `word`.
***

## Implementation Details

* `Trie` is an immutable class - after a trie is built, no other words can be added to it nor removed from it. It was designed like this to speed up prefix search and also to leverage the benefits of [immutability](https://en.wikipedia.org/wiki/Immutable_object).

* Every query operation in `Trie` is case sensitive - meaning that a `Trie` that contains the word `KERFUFFLE` will __not__ return it if the user searches for `kerfuffle` (either through `has`, `search` or `fuzzySearch`). It was designed like this for the sake of simplicity and to avoid the many edge cases that might arise - it's up to the user to clean up the keys before building a Trie and querying it. The code below is an example of how to perform case-insensitive queries in a Trie:
```typescript
import { Trie } from 'trie-fuzzy';

const keys = [
  'Timer',
  'Time',
  'Tier',
  'Dime',
  'Fiber',
  'Mime',
  'Miner',
];

const cleanKey = (key: string) => key.toUpperCase();

const trie = new Trie(keys.map(cleanKey));

trie.has('timer'); // false
trie.has(cleanKey('timer')); // true
trie.has(cleanKey('TiMeR')); // true
```

***
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
