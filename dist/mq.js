"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MqttServer = void 0;
const mqtt = require("mqtt");
const events_1 = require("events");
function validateTopic(topic, vTopic) {
    const parts = topic.split('/');
    const vparts = vTopic.split('/');
    const len = vparts.length;
    let cv = '';
    let cpv = '';
    for (let i = 0; i < len; i++) {
        cv = parts[i];
        cpv = vparts[i];
        if (cv === '+' && cpv) {
            continue;
        }
        if (cpv === '+' && cv) {
            continue;
        }
        if (cv === '#' || cpv === '#') {
            return true;
        }
        if (parts[i] !== vparts[i]) {
            return false;
        }
    }
    return true;
}
class MqttServer extends events_1.EventEmitter {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(options = {}) {
        super();
        this.subscribeTopics = new Array();
        this.subscribeCallbacks = new Map();
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    subscribe(topic, opts, callback) {
        this.mqclient.subscribe(topic, opts);
        try {
            const topicKey = topic.replace(/^\$queue\//i, '');
            this.subscribeTopics.push(topicKey);
            this.subscribeCallbacks.set(topicKey, callback);
        }
        catch (error) {
            console.log(error);
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setMessageCallback(topicPatten, cb) { }
    async connect(brokerUrl, opts) {
        this.mqclient = await mqtt.connect(brokerUrl, opts);
        this.mqclient.on('connect', () => {
            console.log('[mqtt] 成功连接到服务器 ');
        });
        this.mqclient.on('message', (topic, payload) => {
            console.log('[mqtt] on message >>>>> ', topic, ': ', payload.toString());
            this.subscribeCallbacks.forEach((callback, ctopic) => {
                const current = validateTopic(topic, ctopic);
                if (current) {
                    callback.call(null, topic, payload);
                }
            });
        });
        this.mqclient.on('error', err => {
            console.log('[mqtt] err: ', err);
        });
        this.mqclient.on('offline', () => {
            console.log('[mqtt] client offline');
        });
        this.mqclient.on('close', () => {
            console.log('[mqtt] client disconnected');
        });
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    publish(topic, message, qos) { }
}
exports.MqttServer = MqttServer;
//# sourceMappingURL=mq.js.map