import { makeAPIRouteHandler } from '@orclickag/keystatic-next/api';
import keystaticConfig from '../../../../next-app/keystatic.config';

export default makeAPIRouteHandler({ config: keystaticConfig });
