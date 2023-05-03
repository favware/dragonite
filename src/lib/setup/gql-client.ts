import { GqlClient } from '#gql/GqlClient';
import { container } from '@sapphire/framework';

container.gqlClient = new GqlClient();
