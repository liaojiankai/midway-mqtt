/// <reference types="node" />
import mqtt = require('mqtt');
import { EventEmitter } from 'events';
import { ILogger } from '@midwayjs/logger';
export declare class MqttServer extends EventEmitter {
    mqttClient: mqtt.MqttClient;
    protected subscribeCallbacks: Map<string, any>;
    protected logger: ILogger;
    ctx: any;
    constructor(options?: any);
    subscribe(topic: string, opts: mqtt.IClientSubscribeOptions, callback: void): Promise<any>;
    unsubscribe(topic: string): Promise<any>;
    connect(url?: string | any, opts?: mqtt.IClientOptions): Promise<void>;
    publish(topic: string, message: string | Buffer, opts?: mqtt.IClientPublishOptions): Promise<null>;
    close(force?: boolean, opts?: any): Promise<any>;
}
//# sourceMappingURL=mqtt.d.ts.map