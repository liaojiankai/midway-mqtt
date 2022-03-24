import mqtt = require('mqtt');
import { EventEmitter } from 'events';
import { ILogger } from '@midwayjs/logger';
// eslint-disable-next-line node/no-extraneous-require
import debug = require('debug')('midway-mqtt');
import matchTopic from './matchTopic';

export class MqttServer extends EventEmitter {
  public mqttClient: mqtt.MqttClient;
  protected subscribeCallbacks: Map<string, any>;
  protected logger: ILogger;

  ctx: any;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: any = {}) {
    super();
    this.logger = options?.logger || console;
    this.subscribeCallbacks = new Map<string, void>();
  }

  subscribe(topic: string, opts: mqtt.IClientSubscribeOptions, callback: void): Promise<any> {
    return new Promise((resolve, reject) => {
      this.mqttClient.subscribe(topic, opts, (error: Error) => {
        if (error) reject(error);
        this.subscribeCallbacks.set(topic, callback);
        resolve(null);
      });
    });
  }

  unsubscribe(topic: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.mqttClient.unsubscribe(topic, error => {
        if (error) reject(error);
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

  async connect(url?: string | any, opts?: mqtt.IClientOptions) {
    this.mqttClient = await mqtt.connect(url, opts);

    this.mqttClient.once('connect', () => {
      this.logger.info('[@midwayjs/mqtt] 成功连接到服务器');
    });

    this.mqttClient.on('message', (topic: string, payload: Buffer) => {
      debug(`[mqtt/onmessage] topic:${topic} payload: ${payload.toString()}`);
      this.subscribeCallbacks.forEach((callback: any, verifyTopic: string) => {
        const current = matchTopic(topic, verifyTopic);
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

  async publish(
    topic: string,
    message: string | Buffer,
    opts?: mqtt.IClientPublishOptions
  ): Promise<null> {
    return new Promise((resolve, reject) => {
      this.mqttClient.publish(topic, message, opts, (error) => {
        if (error) reject(error);
        resolve(null);
      });
    });
  }

  async close(force?: boolean, opts?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.mqttClient.end(force, opts, err => {
        if (err) reject(err);
        resolve(null)
      });
    });
  }
}
