import {
  IConfigurationOptions,
  IMidwayApplication,
  IMidwayContext,
} from '@midwayjs/core';

export type IMidwayMqttApplication = IMidwayApplication<IMidwayMqttContext> &
  IMqttApplication;

// eslint-disable-next-line @typescript-eslint/ban-types
export type IMidwayMqttContext = IMidwayContext<{}>;

export interface IMqttApplication {
  subscribe(...args): void;
  setMessageCallback(topicPatten: string, cb: any): void;
  connect(...args): void;
  publish(topic: string, message: string, qos: 0 | 1 | 2): void;
}

export interface IMidwayMqttConfigurationOptions extends IConfigurationOptions {
  mqttUrl: string;
  mqttOptions?: any;
}

export type Application = IMidwayMqttApplication;

export type QoS = 0 | 1 | 2;

export interface IClientSubscribeOptions {
  /**
   * the QoS
   */
  qos: QoS;
  /*
   * no local flag
   * */
  nl?: boolean;
  /*
   * Retain As Published flag
   * */
  rap?: boolean;
  /*
   * Retain Handling option
   * */
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
