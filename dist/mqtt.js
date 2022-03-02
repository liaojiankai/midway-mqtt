"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MqttServer = void 0;
const mqtt = require("mqtt");
const events_1 = require("events");
// eslint-disable-next-line node/no-extraneous-require
const debug = require('debug')('midway-mqtt');
const matchTopic_1 = require("./matchTopic");
class MqttServer extends events_1.EventEmitter {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(options = {}) {
        super();
        this.logger = (options === null || options === void 0 ? void 0 : options.logger) || console;
        this.subscribeCallbacks = new Map();
    }
    subscribe(topic, opts, callback) {
        return new Promise((resolve, reject) => {
            this.mqttClient.subscribe(topic, opts, (error) => {
                if (error)
                    reject(error);
                this.subscribeCallbacks.set(topic, callback);
                resolve(null);
            });
        });
    }
    unsubscribe(topic) {
        return new Promise((resolve, reject) => {
            this.mqttClient.unsubscribe(topic, error => {
                if (error)
                    reject(error);
                if (this.subscribeCallbacks.has(topic)) {
                    this.subscribeCallbacks.delete(topic);
                }
                resolve(null);
            });
        });
    }
    // updateMessageCallback(topic: string, callback: any) {
    //   const subscribTopic = this.handeSubscribTopic(topic);
    //   if (this.subscribeCallbacks.has(subscribTopic)) {
    //     this.subscribeCallbacks.set(subscribTopic, callback);
    //   }
    // }
    async connect(url, opts) {
        this.mqttClient = await mqtt.connect(url, opts);
        this.mqttClient.once('connect', () => {
            this.logger.info('[@midwayjs/mqtt] 成功连接到服务器');
        });
        this.mqttClient.on('message', (topic, payload) => {
            debug(`[mqtt/onmessage] topic:${topic} payload: ${payload.toString()}`);
            this.subscribeCallbacks.forEach((callback, verifyTopic) => {
                const current = matchTopic_1.default(topic, verifyTopic);
                if (current && callback) {
                    callback.call(this, topic, payload);
                }
            });
        });
        this.mqttClient.on('error', err => {
            this.logger.error('[@midwayjs/mqtt] err: ', err);
        });
        this.mqttClient.on('offline', () => {
            this.logger.info('[@midwayjs/mqtt] client offline');
        });
        this.mqttClient.on('close', () => {
            this.logger.info('[@midwayjs/mqtt] client disconnected');
        });
    }
    async publish(topic, message, opts) {
        return new Promise((resolve, reject) => {
            this.mqttClient.publish(topic, message, opts, (error) => {
                if (error)
                    reject(error);
                resolve(null);
            });
        });
    }
    async close(force, opts) {
        return new Promise((resolve, reject) => {
            this.mqttClient.end(force, opts, err => {
                if (err)
                    reject(err);
                resolve(null);
            });
        });
    }
}
exports.MqttServer = MqttServer;
