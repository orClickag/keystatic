import localConfig from '../../../../keystatic.config';
import { makeRouteHandler } from '@orclickag/keystatic-next/route-handler';

export const { POST, GET } = makeRouteHandler({
  config: localConfig,
  localBaseDirectory: '../..',
});
