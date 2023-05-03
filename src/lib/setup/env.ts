// Unless explicitly defined, set NODE_ENV as development:
process.env.NODE_ENV ??= 'development';

import { srcFolder } from '#utils/constants';
import { setup } from '@skyra/env-utilities';

setup(new URL('.env', srcFolder));
