/// <reference types="node" />
import mqtt = require('mqtt');
import { EventEmitter } from 'events';
declare class Topic {
    topic: string;
    qos: 0 | 1 | 2;
}
export declare class MqttServer extends EventEmitter {
    mqclient: mqtt.MqttClient & any;
    subscribeTopics: Array<Topic>;
    subscribeCallbacks: Map<string, any>;
    constructor(options?: any);
    subscribe(topic: any, opts: any, callback: void): void;
    setMessageCallback(topicPatten: string, cb: any): void;
    connect(url?: string | any, opts?: any): Promise<void>;
    publish(topic: string, message: string, opts?: any): Promise<unknown>;
    close(force?: boolean, opts?: any): Promise<unknown>;
}
export {};
//# sourceMappingURL=mq.d.ts.map