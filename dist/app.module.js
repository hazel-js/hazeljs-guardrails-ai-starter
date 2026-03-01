"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const core_1 = require("@hazeljs/core");
const config_1 = require("@hazeljs/config");
const ai_1 = require("@hazeljs/ai");
const guardrails_1 = require("@hazeljs/guardrails");
const chat_controller_1 = require("./chat/chat.controller");
const health_controller_1 = require("./health/health.controller");
const guardrail_error_interceptor_1 = require("./interceptors/guardrail-error.interceptor");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, core_1.HazelModule)({
        imports: [
            config_1.ConfigModule.forRoot({ envFilePath: ['.env', '.env.local'] }),
            guardrails_1.GuardrailsModule.forRoot({
                redactPIIByDefault: true,
                blockInjectionByDefault: true,
                blockToxicityByDefault: true,
                piiEntities: ['email', 'phone', 'ssn', 'credit_card'],
                toxicityBlocklist: ['competitor-name', 'internal-system'],
            }),
            ai_1.AIModule.register({}),
        ],
        controllers: [chat_controller_1.ChatController, health_controller_1.HealthController],
        providers: [guardrail_error_interceptor_1.GuardrailErrorInterceptor],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map