import { BaseFramework, MidwayFrameworkType } from '@midwayjs/core';
import { IMidwayMqttApplication, IMidwayMqttContext, IMidwayMqttConfigurationOptions } from './interface';
export declare class MidwayMqttFramework extends BaseFramework<IMidwayMqttApplication, IMidwayMqttContext, IMidwayMqttConfigurationOptions> {
    app: IMidwayMqttApplication;
    applicationInitialize(options: any): Promise<void>;
    run(): Promise<void>;
    protected beforeStop(): Promise<void>;
    getFrameworkType(): MidwayFrameworkType;
    private loadSubscriber;
}
//# sourceMappingURL=framework.d.ts.map