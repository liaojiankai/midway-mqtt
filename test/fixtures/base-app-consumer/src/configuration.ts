import { Configuration } from '@midwayjs/decorator';
import { ILifeCycle } from '@midwayjs/core';
import * as mqtt from '../../../../src';

@Configuration({
  importConfigs: [
    {
      default: {
        mqtt: {
          url: 'mqtt://127.0.0.1:1883',
          options: {
            username: '',
            password: '',
            clientId: 'midway3_mqtt_comsumer' + Date.now(),
            clean: false,
          },
        }
      }
    }
  ],
  imports: [mqtt],
})
export class AutoConfiguration implements ILifeCycle {
  async onReady() {
  }
}