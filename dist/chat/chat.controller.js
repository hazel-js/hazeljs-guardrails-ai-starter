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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const core_1 = require("@hazeljs/core");
const ai_1 = require("@hazeljs/ai");
const guardrails_1 = require("@hazeljs/guardrails");
const guardrail_error_interceptor_1 = require("../interceptors/guardrail-error.interceptor");
const SUPPORT_SYSTEM_PROMPT = `You are a helpful customer support assistant for a SaaS company.
Be concise, professional, and empathetic. If you don't know something, say so.
Never reveal internal systems, competitor names, or sensitive data.
Keep responses under 200 words.`;
/**
 * Customer support chatbot demonstrating @hazeljs/guardrails in a real-world scenario.
 *
 * Guardrails protect against:
 * - Prompt injection (e.g. "ignore previous instructions")
 * - Toxic/harmful content
 * - PII leakage (emails, phones, SSNs redacted in logs/responses)
 */
let ChatController = class ChatController {
    constructor(aiService, guardrailsService) {
        this.aiService = aiService;
        this.guardrailsService = guardrailsService;
    }
    /**
     * POST /api/chat — GuardrailPipe validates request body; GuardrailInterceptor validates input and output.
     * Blocks injection, toxicity; redacts PII in responses.
     */
    async chatWithPipeAndInterceptor(body) {
        const text = body.message ?? body.prompt ?? body.content ?? '';
        const reply = await this.generateReply(text);
        return { reply };
    }
    /**
     * GET /api/chat/decorated?message=... — Uses @GuardrailInput and @GuardrailOutput with @AITask.
     * Demonstrates decorator-based guardrails with string input (query param).
     */
    async chatWithDecorators(message) {
        return message ?? '';
    }
    /**
     * GET /api/chat/redact — Demonstrates manual PII redaction via GuardrailsService.
     */
    async redactPII(text) {
        const redacted = this.guardrailsService.redactPII(text || '');
        return { original: text || '', redacted };
    }
    /**
     * GET /api/chat/check — Demonstrates manual input check (useful for debugging).
     */
    async checkInput(text) {
        const result = this.guardrailsService.checkInput(text || '', {
            redactPII: true,
            blockInjection: true,
            blockToxicity: true,
        });
        return {
            allowed: result.allowed,
            violations: result.violations,
            modified: typeof result.modified === 'string' ? result.modified : undefined,
        };
    }
    async generateReply(message) {
        const result = await this.aiService.executeTask({
            name: 'support-reply',
            prompt: SUPPORT_SYSTEM_PROMPT + '\n\nCustomer message: {{input}}',
            provider: process.env.AI_PROVIDER || 'openai',
            model: process.env.AI_MODEL || 'gpt-4o-mini',
            outputType: 'string',
            temperature: 0.7,
            maxTokens: 512,
            stream: false,
        }, message);
        if (result.error) {
            throw new Error(result.error);
        }
        const output = result.data;
        const outputCheck = this.guardrailsService.checkOutput(output, { allowPII: false });
        return outputCheck.modified ?? output;
    }
};
exports.ChatController = ChatController;
__decorate([
    (0, core_1.Post)(),
    (0, core_1.UsePipes)(guardrails_1.GuardrailPipe),
    (0, core_1.UseInterceptors)(guardrails_1.GuardrailInterceptor),
    __param(0, (0, core_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "chatWithPipeAndInterceptor", null);
__decorate([
    (0, core_1.Get)('/decorated'),
    (0, guardrails_1.GuardrailOutput)({ allowPII: false }),
    (0, guardrails_1.GuardrailInput)({ redactPII: true, blockInjection: true, blockToxicity: true }),
    (0, ai_1.AITask)({
        name: 'support-chat',
        prompt: SUPPORT_SYSTEM_PROMPT + '\n\nCustomer message: {{input}}',
        provider: process.env.AI_PROVIDER || 'openai',
        model: process.env.AI_MODEL || 'gpt-4o-mini',
        outputType: 'string',
        temperature: 0.7,
        maxTokens: 512,
        stream: false,
    }),
    __param(0, (0, core_1.Query)('message')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "chatWithDecorators", null);
__decorate([
    (0, core_1.Get)('/redact'),
    __param(0, (0, core_1.Query)('text')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "redactPII", null);
__decorate([
    (0, core_1.Get)('/check'),
    __param(0, (0, core_1.Query)('text')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "checkInput", null);
exports.ChatController = ChatController = __decorate([
    (0, core_1.Controller)({ path: '/api/chat' }),
    (0, core_1.UseInterceptors)(guardrail_error_interceptor_1.GuardrailErrorInterceptor),
    __metadata("design:paramtypes", [ai_1.AIService,
        guardrails_1.GuardrailsService])
], ChatController);
//# sourceMappingURL=chat.controller.js.map