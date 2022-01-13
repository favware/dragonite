import { envParseString } from '#lib/env';
// import { InMemoryCache, type NormalizedCacheObject } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import fetch from 'cross-fetch';
import os from 'node:os';
import { EmptyInMemoryCache } from './EmptyInMemoryCache';

export class DragoniteApolloClient extends ApolloClient<never> {
  public constructor() {
    super({
      link: new HttpLink({
        uri: envParseString('POKEMON_API_URL'),
        fetchOptions: {
          headers: {
            'User-Agent': `Favware Dragonite/1.0.0 (apollo-client) ${os.platform()}/${os.release()}`
          }
        },
        fetch
      }),
      // cache: new InMemoryCache({
      //   resultCaching: false
      // }),
      cache: new EmptyInMemoryCache(),
      defaultOptions: {
        watchQuery: {
          fetchPolicy: 'no-cache',
          errorPolicy: 'ignore'
        },
        query: {
          fetchPolicy: 'no-cache',
          errorPolicy: 'all'
        }
      }
    });
  }
}
