/// <reference types="node" />
import mqtt = require('mqtt');
import { EventEmitter } from 'events';
import { IMqttApplication } from './interface';
declare class Topic {
    topic: string;
    qos: 0 | 1 | 2;
}
export declare class MqttServer extends EventEmitter implements IMqttApplication {
    mqclient: mqtt.MqttClient;
    subscribeTopics: Array<Topic>;
    subscribeCallbacks: Map<string, any>;
    constructor(options?: any);
    subscribe(topic: any, opts: any, callback: void): void;
    setMessageCallback(topicPatten: string, cb: any): void;
    connect(brokerUrl?: string | any, opts?: any): Promise<void>;
    publish(topic: string, message: string, qos: 0 | 1 | 2): void;
}
export {};
//# sourceMappingURL=mq.d.ts.map