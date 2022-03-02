import { IConfigurationOptions, IMidwayApplication, IMidwayContext } from '@midwayjs/core';
import mqtt = require('mqtt');
import { MqttServer } from './mqtt';
export declare type IMidwayMqttApplication = IMidwayApplication<IMidwayMqttContext> & IMqttApplication & MqttServer;
export declare type IMidwayMqttContext = IMidwayContext<{
    mqttClient: mqtt.MqttClient;
}>;
export interface IMqttApplication {
    subscribe(...args: any[]): Promise<any>;
    unsubscribe(topic: string): Promise<any>;
    updateMessageCallback(topic: string, callback: any): void;
    connect(url: string, options?: mqtt.IClientOptions): void;
    publish(topic: string, message: string): void;
    publish(topic: string, message: string, options: any): void;
    close(force?: boolean, opts?: any): Promise<any>;
}
export interface IMidwayMqttConfigurationOptions extends IConfigurationOptions {
    url: string;
    options?: mqtt.IClientOptions;
}
export declare type Application = IMidwayMqttApplication;
export declare type QoS = 0 | 1 | 2;
export interface IClientSubscribeOptions {
    /**
     * the QoS
     */
    qos: QoS;
    nl?: boolean;
    rap?: boolean;
    rh?: number;
}
export interface ISubscriptionMap {
    /**
     * object which has topic names as object keys and as value the options, like {'test1': {qos: 0}, 'test2': {qos: 2}}.
     */
    [topic: string]: {
        qos: QoS;
        nl?: boolean;
        rap?: boolean;
        rh?: number;
    };
}
export interface Context extends IMidwayMqttContext {
}
//# sourceMappingURL=interface.d.ts.map