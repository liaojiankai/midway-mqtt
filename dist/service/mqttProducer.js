"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MQTTProducer = void 0;
const decorator_1 = require("@midwayjs/decorator");
const mq_1 = require("../mq");
// import mqtt = require('mqtt');
let MQTTProducer = class MQTTProducer {
    getClient() {
        return this.client;
    }
    async connect() {
        console.log('options: ', this.options);
        this.client = new mq_1.MqttServer();
        await this.client.connect(this.options);
    }
};
__decorate([
    decorator_1.Config('rabbitmq'),
    __metadata("design:type", Object)
], MQTTProducer.prototype, "options", void 0);
__decorate([
    decorator_1.Init(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MQTTProducer.prototype, "connect", null);
MQTTProducer = __decorate([
    decorator_1.Scope(decorator_1.ScopeEnum.Singleton),
    decorator_1.Provide()
], MQTTProducer);
exports.MQTTProducer = MQTTProducer;
