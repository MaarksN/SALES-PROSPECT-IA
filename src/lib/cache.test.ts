import { describe, it, expect } from "vitest";
import { SimpleLRUCache } from "./cache";

describe("SimpleLRUCache", () => {
  it("should store and retrieve items", () => {
    const cache = new SimpleLRUCache<string, number>(10);
    cache.set("a", 1);
    expect(cache.get("a")).toBe(1);
  });

  it("should return undefined for non-existent items", () => {
    const cache = new SimpleLRUCache<string, number>(10);
    expect(cache.get("b")).toBe(undefined);
  });

  it("should evict the least recently used item when capacity is reached", () => {
    const cache = new SimpleLRUCache<string, number>(2);
    cache.set("a", 1);
    cache.set("b", 2);
    cache.set("c", 3); // "a" should be evicted

    expect(cache.has("a")).toBe(false);
    expect(cache.get("b")).toBe(2);
    expect(cache.get("c")).toBe(3);
  });

  it("should update LRU status on get", () => {
    const cache = new SimpleLRUCache<string, number>(2);
    cache.set("a", 1);
    cache.set("b", 2);

    cache.get("a"); // "a" is now most recent, "b" is least recent

    cache.set("c", 3); // "b" should be evicted

    expect(cache.has("b")).toBe(false);
    expect(cache.has("a")).toBe(true);
    expect(cache.get("c")).toBe(3);
  });

  it("should update existing keys without evicting if within capacity", () => {
    const cache = new SimpleLRUCache<string, number>(2);
    cache.set("a", 1);
    cache.set("b", 2);
    cache.set("a", 10); // Update "a"

    expect(cache.size()).toBe(2);
    expect(cache.get("a")).toBe(10);
    expect(cache.get("b")).toBe(2);
  });

  it("should clear the cache", () => {
    const cache = new SimpleLRUCache<string, number>(10);
    cache.set("a", 1);
    cache.set("b", 2);
    cache.clear();
    expect(cache.size()).toBe(0);
    expect(cache.get("a")).toBe(undefined);
  });
});
