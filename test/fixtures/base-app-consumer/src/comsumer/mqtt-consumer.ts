import {
  Provide,
  Consumer,
  MSListenerType,
  Inject,
  Logger,
} from '@midwayjs/decorator';

import { MqttListener, Context } from '../../../../../src';

@Provide()
@Consumer(MSListenerType.MQTT)
export class MqttConsumer {
  @Inject() logger: ILogger;
  @Inject() ctx: Context;

  @MqttListener('reply-to/queue', { qos: 0 })
  async reply(topic: string, payload: Buffer) {
    // producer
    this.ctx.mqttClient.publish('receive/queue', JSON.stringify({msg: 'hello receive'}))
  }

  @MqttListener('receive/queue', { qos: 0 })
  async receive(topic: string, payload: Buffer) {
    // payload.toString() === '{"msg":"hello receive"}'
  }

  @MqttListener('hello/#', { qos: 0 })
  async gotData(topic: string, payload: Buffer) {
  }

  @MqttListener('hello/+/post', { qos: 0 })
  async gotWildcardData(topic: string, payload: Buffer) {
  }

  @MqttListener('$queue/hello/+/post')
  async gotQueueData(topic: string, payload: Buffer) {
  }

  @MqttListener('$share/group/hello/+/post')
  async gotShareData(topic: string, payload: Buffer) {
  }
}