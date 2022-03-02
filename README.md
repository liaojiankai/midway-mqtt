# midway framework for mqtt

this is a sub package for midway.

this module use [mqtt](https://github.com/mqttjs/MQTT.js)

## 消费者（Consumer）使用方法

提供了订阅 mqtt 的能力，并能够独立部署和使用。安装 @ernan2/midway-mqtt 模块及其定义。

``` bash
 npm i @ernan2/midway-mqtt@2 --save
 npm i mqtt --save
```

### 入口函数

和 Web 一样，创建一个入口文件，指定 Framework 即可。

``` js
// server.js
const { Bootstrap } = require('@midwayjs/bootstrap');
const Framework = require('@ernan2/midway-mqtt').Framework;

const Framework = new Framework().configure({
  url: 'mqtt://localhost',
  options: {
    username: '',
    password: '',
    clientId: '',
    // clean: true,
    // will: { retain: false },
  },
});
Bootstrap.load(Framework).run();
```

整个启动的配置为：

``` ts
export type IMidwayMqttConfigurationOptions = {
  url: string;
  options?: mqtt.IClientOptions
}
```

### 订阅 mqtt

我们一般把能力分为生产者和消费者，而订阅正是消费者的能力。

我们一般把消费者放在 consumer 目录。比如 src/consumer/userConsumer.ts

``` text
➜  my_midway_app tree
.
├── src
│   ├── consumer
│   │   └── userConsumer.ts
│   └── interface.ts
├── test
├── package.json
└── tsconfig.json
```

代码示例如下。

``` ts
import {
  Provide,
  Consumer,
  MSListenerType,
  Inject,
  Logger,
} from '@midwayjs/decorator';

import { MqttListener, Context } from '@ernan2/midway-mqtt';

@Provide()
@Consumer(MSListenerType.MQTT)
export class MqttConsumer {
  @Inject() logger: ILogger;
  @Inject() ctx: Context;

  @MqttListener('reply-to/queue', { qos: 0 })
  async reply(topic: string, payload: Buffer) {
    // producer
    this.ctx.mqttClient.publish('receive/queue', JSON.stringify({msg: 'hello receive'}))
  }

  @MqttListener('receive/queue', { qos: 0 })
  async receive(topic: string, payload: Buffer) {
    // payload.toString() === '{"msg":"hello receive"}'
  }

  @MqttListener('hello/#', { qos: 0 })
  async gotData(topic: string, payload: Buffer) {
  }

  @MqttListener('hello/+/post', { qos: 0 })
  async gotWildcardData(topic: string, payload: Buffer) {
  }

  @MqttListener('$queue/hello/+/post')
  async gotQueueData(topic: string, payload: Buffer) {
  }

  @MqttListener('$share/group/hello/+/post')
  async gotShareData(topic: string, payload: Buffer) {
  }
}
```

@Consumer 装饰器，提供消费者标识，并且它的参数，指定了某种消费框架的类型，比如，我们这里指定了 MSListenerType.MQTT
 这个类型，指的就是 mqtt 类型。

标识了 @Consumer 的类，对方法使用 @MqttListener
 装饰器后，可订阅一个 mqtt 的 Topic。

方法的参数为订阅收到的 topic 和 payload

### mqtt 订阅上下文

订阅 mqtt topic的上下文，其中包含每次接收消息的数据。
从 ctx 上可以取到 mqttClient ，整个 ctx 的定义为：

```ts
export type Context = {
  mqttClient: mqtt.MqttClient;
};
```

可以从框架获取定义

```ts
import { Context } from '@ernan2/midway-mqtt';
```

### MqttListener 装饰器参数

@MqttListener 装饰器的第一个参数为 topic，代表需要订阅的 topic。​
第二个参数是一个 mqtt.IClientSubscribeOptions 对象， 默认值

```json
  { qos: 0 }
```

mqtt.IClientSubscribeOptions 详细定义如下：

```ts
export interface IClientSubscribeOptions {
  /**
   * the QoS
   */
  qos: QoS,
  /*
  * no local flag
  * */
  nl?: boolean,
  /*
  * Retain As Published flag
  * */
  rap?: boolean,
  /*
  * Retain Handling option
  * */
  rh?: number
}
```

## 生产者（ Publish ）使用方法

生产者（ Publish ）也就是第一节中的消息产生者，简单的来说就是会创建一个客户端，将消息发送到 mqtt 服务。​

注意：当前 Midway 并没有使用组件来支持消息发送，这里展示的示例只是使用纯 SDK 在 Midway 中的写法。​

### 安装依赖

```bash
 npm i @ernan2/midway-mqtt@2 --save
 npm i mqtt --save

 // or
 yarn add @ernan2/midway-mqtt@2
 yarn add mqtt

```

### 调用服务发送消息

比如，我们在 service 文件下，新增一个 mqtt.ts 文件。

```ts
import {
  Provide,
  Scope,
  ScopeEnum,
  Init,
  Config,
  Autoload,
  Destroy,
  Logger,
} from '@midwayjs/decorator';
import { MqttServer as Mqtt, IClientSubscribeOptions, } from '@ernan2/midway-mqtt';
import { ILogger } from '@midwayjs/logger';
import * as mqtt from 'mqtt';

@Autoload()
@Scope(ScopeEnum.Singleton)
@Provide('mqttService')
export class MqttService {
  @Logger() logger: ILogger;
  private client: Mqtt;

  @Init()
  async connect() {
    this.client = new Mqtt({logger: this.logger});
    await this.client.connect({
      url: 'mqtt://localhost',
      options: {
        username: '',
        password: '',
        clientId: '',
        // clean: true,
        // will: { retain: false },
      },
    });
  }

  // 发送消息
  public async publish(
    topic: string,
    data: string | Buffer,
    opts?: mqtt.IClientPublishOptions
  ) {
    return this.client.publish(topic, data, opts);
  }

  @Destroy()
  async close() {
    this.client.close();
  }
}
```

大概就是创建了一个用来封装消息通信的 service，同时他是全局唯一的 Singleton 单例。由于增加了 @AutoLoad 装饰器，可以自执行初始化。​

这样基础的调用服务就抽象好了，我们只需要在用到的地方，调用 publish 方法即可。​

比如：​

```ts
@Provide()
export class UserService {
  @Inject()
  mqttService: MqttService;

  async invoke() {
    // TODO

    // 发送消息
    await this.mqttService.publish('topic', JSON.stringify({ hello: 'world' }), { qos: 0 });
  }
}
```

## 参考文档

[mqtt.js](https://www.npmjs.com/package/mqtt)

[Midwayjs rabbitmq](http://www.midwayjs.org/docs/extensions/rabbitmq)

## 联系我(欢迎交流)

<img src="https://user-images.githubusercontent.com/18132383/156308667-458a7672-2e13-4002-b439-eb8978b8b53f.jpg" width="150px">
