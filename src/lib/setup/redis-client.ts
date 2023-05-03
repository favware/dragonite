import { RedisCacheClient } from '#lib/redis-cache/RedisCacheClient';
import { container } from '@sapphire/framework';

container.gqlRedisCache = new RedisCacheClient();
