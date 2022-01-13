import { envParseString } from '#lib/env';
import { ApolloClient, InMemoryCache, type NormalizedCacheObject } from '@apollo/client';

export class DragoniteApolloClient extends ApolloClient<NormalizedCacheObject> {
  public constructor() {
    super({
      uri: envParseString('POKEMON_API_URL'),
      cache: new InMemoryCache(),
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
