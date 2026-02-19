/**
 * A simple Least Recently Used (LRU) cache implementation using Map.
 * In JavaScript, Map preserves the insertion order of its elements.
 * By deleting and re-inserting an element, we can move it to the "most recently used" position.
 */
export class SimpleLRUCache<K, V> {
  private cache: Map<K, V>;
  private maxEntries: number;

  constructor(maxEntries: number = 50) {
    this.cache = new Map<K, V>();
    this.maxEntries = maxEntries;
  }

  /**
   * Retrieves an item from the cache.
   * If found, the item is moved to the most recently used position.
   */
  get(key: K): V | undefined {
    const value = this.cache.get(key);
    if (value !== undefined) {
      // Move to end (most recently used)
      this.cache.delete(key);
      this.cache.set(key, value);
    }
    return value;
  }

  /**
   * Adds or updates an item in the cache.
   * If the cache exceeds maxEntries, the least recently used item is evicted.
   */
  set(key: K, value: V): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxEntries) {
      // Remove least recently used (first item in the Map)
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }
    this.cache.set(key, value);
  }

  /**
   * Checks if a key exists in the cache without updating its LRU status.
   */
  has(key: K): boolean {
    return this.cache.has(key);
  }

  /**
   * Returns the current number of items in the cache.
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Clears all items from the cache.
   */
  clear(): void {
    this.cache.clear();
  }
}
