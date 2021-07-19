import { IConfigurationOptions, IMidwayApplication, IMidwayContext } from '@midwayjs/core';
export declare type IMidwayMqttApplication = IMidwayApplication<IMidwayMqttContext> & IMqttApplication;
export declare type IMidwayMqttContext = IMidwayContext<{}>;
export interface IMqttApplication {
    subscribe(...args: any[]): void;
    setMessageCallback(topicPatten: string, cb: any): void;
    connect(...args: any[]): void;
    publish(topic: string, message: string, qos: 0 | 1 | 2): void;
}
export interface IMidwayMqttConfigurationOptions extends IConfigurationOptions {
    mqttUrl: string;
    mqttOptions?: any;
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
//# sourceMappingURL=interface.d.ts.map