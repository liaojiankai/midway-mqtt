// import { Configuration, Inject } from '@midwayjs/decorator';
// import { MidwayMqttFramework } from './framework';


// @Configuration({
//   namespace: 'mqtt',
// })
// export class MqttConfiguration {
//   @Inject()
//   framework: MidwayMqttFramework;

//   async onReady() {}
// }

import { Configuration, Inject } from '@midwayjs/decorator';
import { MidwayMqttFramework } from './framework';

@Configuration({
  namespace: 'mqtt',
  // importConfigs: [
  //   {
  //     default: {
  //       mqttServer: {},
  //     },
  //   },
  // ],
})
export class MqttConfiguration {
  @Inject()
  framework: MidwayMqttFramework;

  async onReady() {}
}