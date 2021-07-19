import {
  BaseFramework,
  MidwayFrameworkType,
  listModule,
  getClassMetadata,
  listPropertyDataFromClass,
  getProviderId,
} from '@midwayjs/core';

import {
  MS_CONSUMER_KEY,
  ConsumerMetadata,
  MSListenerType,
} from '@midwayjs/decorator';

import {
  IMidwayMqttApplication,
  IMidwayMqttContext,
  IMidwayMqttConfigurationOptions,
} from './interface';

import { MqttServer } from './mq';

export class MidwayMqttFramework extends BaseFramework<
  IMidwayMqttApplication,
  IMidwayMqttContext,
  IMidwayMqttConfigurationOptions
> {
  public app: IMidwayMqttApplication;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async applicationInitialize(options) {
    // Create a connection manager
    this.app = new MqttServer() as unknown as IMidwayMqttApplication;
  }

  public async run(): Promise<void> {
    // init connection

    await this.app.connect(
      this.configurationOptions.mqttUrl,
      this.configurationOptions.mqttOptions
    );
    await this.loadSubscriber();
  }

  protected async beforeStop(): Promise<void> {}

  public getFrameworkType(): MidwayFrameworkType {
    return MidwayFrameworkType.EMPTY;
  }
  private async loadSubscriber() {
    console.log('======== loadSubscriber ========');
    const subscriberModules = listModule(MS_CONSUMER_KEY, module => {
      const metadata: ConsumerMetadata.ConsumerMetadata = getClassMetadata(
        MS_CONSUMER_KEY,
        module
      );
      return metadata.type === MSListenerType.MQTT;
    });

    for (const module of subscriberModules) {
      const providerId = getProviderId(module);
      const data = listPropertyDataFromClass(MS_CONSUMER_KEY, module);

      console.log('providerId: ', providerId);

      for (const methodBindListeners of data) {
        // 循环绑定的方法和监听的配置信息
        // console.log('methodBindListeners: ', methodBindListeners)
        for (const listenerOptions of methodBindListeners) {
          const { propertyKey, options } = listenerOptions;
          const ctx: any = {};
          this.app.createAnonymousContext(ctx);
          const ins = await ctx.requestContext.getAsync(providerId);
          const callback = ins[propertyKey];
          Object.keys(options).forEach(topic => {
            const opts = options[topic];
            this.app.subscribe(topic, opts, callback);
          });
        }
      }
    }
  }
}
