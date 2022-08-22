export class InfiniteArray<T> {
  private cache: T[];
  private readonly startRange: number;
  private readonly endRange: number;
  private readonly defaultValue: T;

  constructor(
    startRange: number,
    endRange: number,
    defaultValue: T,
  ) {
    this.cache = new Array<T>(endRange - startRange + 1);
    this.startRange = startRange;
    this.endRange = endRange;
    this.defaultValue = defaultValue;
  }

  set(index: number, value: T) {
    if (index >= this.startRange && index <= this.endRange) {
      this.cache[index - this.startRange] = value;
    }
  }

  get(index: number) {
    if (index >= this.startRange && index <= this.endRange) {
      return this.cache[index - this.startRange];
    }

    return this.defaultValue;
  }

  * indexes() {
    for (let i = this.startRange; i <= this.endRange; i++) {
      yield i;
    }
  }
}
