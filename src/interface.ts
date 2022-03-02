import {
  IConfigurationOptions,
  IMidwayApplication,
  IMidwayContext,
} from '@midwayjs/core';
import mqtt = require('mqtt');
import { MqttServer } from './mqtt';

export type IMidwayMqttApplication = IMidwayApplication<IMidwayMqttContext> &
  IMqttApplication &
  MqttServer;

// export type IMidwayMqttContext = IMidwayContext;
export type IMidwayMqttContext = IMidwayContext<{
  mqttClient: mqtt.MqttClient;
}>;

export interface IMqttApplication {
  subscribe(...args): Promise<any>;
  unsubscribe(topic: string): Promise<any>;
  updateMessageCallback(topic: string, callback: any): void;
  // setMessageCallback(topicPatten: string, cb: any): void;
  connect(url: string, options?: mqtt.IClientOptions): void;
  publish(topic: string, message: string): void;
  publish(topic: string, message: string, options: any): void;
  close(force?: boolean, opts?: any): Promise<any>;
}

export interface IMidwayMqttConfigurationOptions extends IConfigurationOptions {
  url: string;
  options?: mqtt.IClientOptions;
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

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Context extends IMidwayMqttContext {}
