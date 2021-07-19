import {
  MS_CONSUMER_KEY,
  attachPropertyDataToClass,
} from '@midwayjs/decorator';

import { IClientSubscribeOptions, ISubscriptionMap } from './interface';

export function MqttListener(
  topic: string | string[] | ISubscriptionMap,
  opts: IClientSubscribeOptions = { qos: 0 }
) {
  const data: any = {};
  return (target: any, propertyKey: string) => {
    data.propertyKey = propertyKey;
    data.options = typeof topic === 'string' ? { [topic]: opts } : topic;
    attachPropertyDataToClass(MS_CONSUMER_KEY, data, target, propertyKey);
  };
}
