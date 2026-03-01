"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuardrailErrorInterceptor = void 0;
const core_1 = require("@hazeljs/core");
const core_2 = require("@hazeljs/core");
const guardrails_1 = require("@hazeljs/guardrails");
/**
 * Converts GuardrailViolationError to BadRequestError (400) so the router
 * returns a proper client error instead of 500.
 */
let GuardrailErrorInterceptor = class GuardrailErrorInterceptor {
    async intercept(context, next) {
        try {
            return await next();
        }
        catch (error) {
            if (error instanceof guardrails_1.GuardrailViolationError) {
                throw new core_2.BadRequestError(error.blockedReason ?? error.message, error.violations);
            }
            throw error;
        }
    }
};
exports.GuardrailErrorInterceptor = GuardrailErrorInterceptor;
exports.GuardrailErrorInterceptor = GuardrailErrorInterceptor = __decorate([
    (0, core_1.Injectable)()
], GuardrailErrorInterceptor);
//# sourceMappingURL=guardrail-error.interceptor.js.map