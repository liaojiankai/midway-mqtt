"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MidwayMqttFramework = void 0;
const core_1 = require("@midwayjs/core");
const decorator_1 = require("@midwayjs/decorator");
const mqtt_1 = require("./mqtt");
class MidwayMqttFramework extends core_1.BaseFramework {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async applicationInitialize(options) {
        // Create a connection manager
        this.app = new mqtt_1.MqttServer({
            logger: this.logger,
        });
    }
    // protected async afterContainerReady(
    //   options: Partial<IMidwayBootstrapOptions>
    // ): Promise<void> {
    //   // await this.loadSubscriber();
    // }
    async run() {
        // init connection
        await this.app.connect(this.configurationOptions.url, this.configurationOptions.options);
        await this.loadSubscriber();
        this.logger.info('[@midwayjs/mqtt] mqtt server start success');
    }
    async beforeStop() {
        await this.app.close();
    }
    getFrameworkType() {
        // return '@midwayjs/mqtt';
        return core_1.MidwayFrameworkType.CUSTOM;
    }
    async loadSubscriber() {
        const subscriberModules = core_1.listModule(decorator_1.MS_CONSUMER_KEY, module => {
            const metadata = core_1.getClassMetadata(decorator_1.MS_CONSUMER_KEY, module);
            return metadata.type === decorator_1.MSListenerType.MQTT;
        });
        for (const module of subscriberModules) {
            const providerId = core_1.getProviderId(module);
            const data = core_1.listPropertyDataFromClass(decorator_1.MS_CONSUMER_KEY, module);
            for (const methodBindListeners of data) {
                // 循环绑定的方法和监听的配置信息
                // console.log('methodBindListeners: ', methodBindListeners)
                for (const listenerOptions of methodBindListeners) {
                    const { propertyKey, options } = listenerOptions;
                    const ctx = { mqttClient: this.app };
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
    getFrameworkName() {
        return 'midway:mqtt';
    }
}
exports.MidwayMqttFramework = MidwayMqttFramework;
