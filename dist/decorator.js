"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MqttListener = void 0;
const decorator_1 = require("@midwayjs/decorator");
function MqttListener(topic, opts = { qos: 0 }) {
    const data = {};
    return (target, propertyKey) => {
        data.propertyKey = propertyKey;
        data.options = typeof topic === 'string' ? { [topic]: opts } : topic;
        decorator_1.attachPropertyDataToClass(decorator_1.MS_CONSUMER_KEY, data, target, propertyKey);
    };
}
exports.MqttListener = MqttListener;
//# sourceMappingURL=decorator.js.map