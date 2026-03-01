"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuardrailViolationFilter = void 0;
const core_1 = require("@hazeljs/core");
const guardrails_1 = require("@hazeljs/guardrails");
/**
 * Maps GuardrailViolationError to HTTP 400 with structured error body.
 * Use this so clients receive clear feedback when content is blocked.
 */
let GuardrailViolationFilter = class GuardrailViolationFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const body = {
            statusCode: 400,
            error: 'Bad Request',
            message: exception.message,
            violations: exception.violations,
            blockedReason: exception.blockedReason,
            timestamp: new Date().toISOString(),
            path: request.url,
        };
        response.status(400).json(body);
    }
};
exports.GuardrailViolationFilter = GuardrailViolationFilter;
exports.GuardrailViolationFilter = GuardrailViolationFilter = __decorate([
    (0, core_1.Catch)(guardrails_1.GuardrailViolationError)
], GuardrailViolationFilter);
//# sourceMappingURL=guardrail-violation.filter.js.map