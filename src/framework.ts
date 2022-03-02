import {
  BaseFramework,
  MidwayFrameworkType,
  listModule,
  getClassMetadata,
  listPropertyDataFromClass,
  // IMidwayBootstrapOptions,
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

import { MqttServer } from './mqtt';

export class MidwayMqttFramework extends BaseFramework<
  IMidwayMqttApplication,
  IMidwayMqttContext,
  IMidwayMqttConfigurationOptions
> {
  public app: IMidwayMqttApplication;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async applicationInitialize(options) {
    // Create a connection manager
    this.app = new MqttServer({
      logger: this.logger,
    }) as unknown as IMidwayMqttApplication;
  }

  // protected async afterContainerReady(
  //   options: Partial<IMidwayBootstrapOptions>
  // ): Promise<void> {
  //   // await this.loadSubscriber();
  // }

  public async run(): Promise<void> {
    // init connection
    await this.app.connect(
      this.configurationOptions.url,
      this.configurationOptions.options
    );
    await this.loadSubscriber();
    this.logger.info('[@midwayjs/mqtt] mqtt server start success');
  }

  protected async beforeStop(): Promise<void> {
    await this.app.close();
  }

  public getFrameworkType(): MidwayFrameworkType {
    // return '@midwayjs/mqtt';
    return MidwayFrameworkType.CUSTOM;
  }
  private async loadSubscriber() {
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

      for (const methodBindListeners of data) {
        // 循环绑定的方法和监听的配置信息
        // console.log('methodBindListeners: ', methodBindListeners)
        for (const listenerOptions of methodBindListeners) {
          const { propertyKey, options } = listenerOptions;

          const ctx = { mqttClient: this.app } as Pick<IMidwayMqttContext, any>;
          this.app.createAnonymousContext(ctx);
          const ins = await ctx.requestContext.getAsync(providerId);
          const callback = ins[propertyKey];
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const fn = async (topic, payload) => {
            callback.call(ins, topic, payload);
          };
          Object.keys(options).forEach(topic => {
            const opts = options[topic];
            this.app.subscribe(topic, opts, fn);
          });
        }
      }
    }
  }

  public getFrameworkName() {
    return 'midway:mqtt';
  }
}
