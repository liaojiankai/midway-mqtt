import { App, Configuration } from '@midwayjs/decorator';
import { ILifeCycle } from '@midwayjs/core';
import { IMqttApplication } from '../../../../src'

@Configuration({
})
export class AutoConfiguration implements ILifeCycle {

  @App()
  app: IMqttApplication;

  async onReady() {
  }
}