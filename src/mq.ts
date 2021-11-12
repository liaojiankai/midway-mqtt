import mqtt = require('mqtt');
import { EventEmitter } from 'events';

import { IMqttApplication } from './interface';

// type OnMessageFunc = (topic: string, payload: Buffer) => void;

declare class Topic {
  public topic: string;
  public qos: 0 | 1 | 2;
}

// export function matchTopic(filter: string, topic: string) {
//   const filterArray = filter.split('/');
//   const length = filterArray.length;
//   const topicArray = topic.split('/');

//   for (let i = 0; i < length; ++i) {
//     const left = filterArray[i];
//     const right = topicArray[i];
//     if (left === '#') return topicArray.length >= length - 1;
//     if (left !== '+' && left !== right) return false;
//   }

//   return length === topicArray.length;
// }


function validateTopic(topic, filter) {
  const parts = topic.split('/');
  const vparts = filter.split('/');
  const len = vparts.length;

  let left = '';
  let right = '';

  for (let i = 0; i < len; i++) {
    left = parts[i];
    right = vparts[i];
    if (left === '+' && right) {
      continue;
    }
    if (right === '+' && left) {
      continue;
    }

    if (left === '#' || right === '#') {
      return true;
    }

    if (parts[i] !== vparts[i]) {
      return false;
    }
  }

  return true;
}

export class MqttServer extends EventEmitter implements IMqttApplication {
  public mqclient: mqtt.MqttClient & any;
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
      const topicKey = topic.replace(/^\$queue/i, '');
      this.subscribeTopics.push(topicKey);
      this.subscribeCallbacks.set(topicKey, callback);
    } catch (error) {
      console.log(error);
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setMessageCallback(topicPatten: string, cb: any) {}

  async connect(url?: string | any, opts?: any) {
    this.mqclient = await mqtt.connect(url, opts);

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
  publish(topic: string, message: string, opts: any = {}) {
    return new Promise((resolve, reject) => {
      this.mqclient.publish(topic, message, opts, (error, packet) => {
        if (error) reject(error);
        resolve(packet);
      });
    });
  }
  async close() {
    // this.mqclient?.close();
  }
}
