"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MidwayMqttFramework = void 0;
const core_1 = require("@midwayjs/core");
const decorator_1 = require("@midwayjs/decorator");
const mq_1 = require("./mq");
class MidwayMqttFramework extends core_1.BaseFramework {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async applicationInitialize(options) {
        // Create a connection manager
        this.app = new mq_1.MqttServer();
    }
    async run() {
        // init connection
        await this.app.connect(this.configurationOptions.mqttUrl, this.configurationOptions.mqttOptions);
        await this.loadSubscriber();
    }
    async beforeStop() { }
    getFrameworkType() {
        return core_1.MidwayFrameworkType.EMPTY;
    }
    async loadSubscriber() {
        console.log('======== loadSubscriber ========');
        const subscriberModules = core_1.listModule(decorator_1.MS_CONSUMER_KEY, module => {
            const metadata = core_1.getClassMetadata(decorator_1.MS_CONSUMER_KEY, module);
            return metadata.type === decorator_1.MSListenerType.MQTT;
        });
        for (const module of subscriberModules) {
            const providerId = core_1.getProviderId(module);
            const data = core_1.listPropertyDataFromClass(decorator_1.MS_CONSUMER_KEY, module);
            console.log('providerId: ', providerId);
            for (const methodBindListeners of data) {
                // 循环绑定的方法和监听的配置信息
                // console.log('methodBindListeners: ', methodBindListeners)
                for (const listenerOptions of methodBindListeners) {
                    const { propertyKey, options } = listenerOptions;
                    const ctx = {};
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
exports.MidwayMqttFramework = MidwayMqttFramework;
//# sourceMappingURL=framework.js.map