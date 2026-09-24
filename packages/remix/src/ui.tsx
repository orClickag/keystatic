import { Config } from '@orclickag/keystatic-core';
import { Keystatic } from '@orclickag/keystatic-core/ui';

export function makePage(config: Config<any, any>) {
  return function Page() {
    return <Keystatic config={config} />;
  };
}
