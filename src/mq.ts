import mqtt = require('mqtt');
import { EventEmitter } from 'events';

import { IMqttApplication } from './interface';

// type OnMessageFunc = (topic: string, payload: Buffer) => void;

declare class Topic {
  public topic: string;
  public qos: 0 | 1 | 2;
}

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

export class MqttServer extends EventEmitter implements IMqttApplication {
  public mqclient: mqtt.MqttClient;
  public subscribeTopics: Array<Topic>;
  public subscribeCallbacks: Map<string, any>;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: any = {}) {
    super();
    this.subscribeTopics = new Array<Topic>();
    this.subscribeCallbacks = new Map<string, void>();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  subscribe(topic: any, opts: any, callback: void) {
    this.mqclient.subscribe(topic, opts);

    try {
      const topicKey = topic.replace(/^\$queue\//i, '');
      this.subscribeTopics.push(topicKey);
      this.subscribeCallbacks.set(topicKey, callback);
    } catch (error) {
      console.log(error);
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setMessageCallback(topicPatten: string, cb: any) {}

  async connect(brokerUrl?: string | any, opts?: any) {
    this.mqclient = await mqtt.connect(brokerUrl, opts);

    this.mqclient.on('connect', () => {
      console.log('[mqtt] 成功连接到服务器 ');
    });

    this.mqclient.on('message', (topic, payload) => {
      console.log('[mqtt] on message >>>>> ', topic, ': ', payload.toString());
      this.subscribeCallbacks.forEach((callback: any, ctopic: string) => {
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
  publish(topic: string, message: string, qos: 0 | 1 | 2) {}
}
