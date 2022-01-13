import { ApolloCache, Cache } from 'apollo-cache';
import type { DocumentNode } from 'graphql';

export class EmptyInMemoryCache extends ApolloCache<never> {
  public constructor() {
    super();
  }

  public restore(): this {
    return this;
  }

  public extract(): never {
    return {} as never;
  }

  public read<T>(): T | null {
    return null;
  }

  public write(): void {
    return undefined;
  }

  public diff<T>(): Cache.DiffResult<T> {
    return {
      complete: true,
      result: undefined
    };
  }

  public watch(): () => void {
    return () => undefined;
  }

  public evict(): Cache.EvictionResult {
    throw new Error('Kaboom!');
  }

  public reset(): Promise<void> {
    return Promise.resolve(undefined);
  }

  public removeOptimistic() {
    return undefined;
  }

  public performTransaction() {
    return undefined;
  }

  public recordOptimisticTransaction() {
    return undefined;
  }

  public override transformDocument(document: DocumentNode): DocumentNode {
    return document;
  }

  protected broadcastWatches() {
    return undefined;
  }
}
