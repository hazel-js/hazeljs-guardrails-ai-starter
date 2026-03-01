import { AIService } from '@hazeljs/ai';
import { GuardrailsService } from '@hazeljs/guardrails';
interface ChatRequest {
    message?: string;
    prompt?: string;
    content?: string;
}
/**
 * Customer support chatbot demonstrating @hazeljs/guardrails in a real-world scenario.
 *
 * Guardrails protect against:
 * - Prompt injection (e.g. "ignore previous instructions")
 * - Toxic/harmful content
 * - PII leakage (emails, phones, SSNs redacted in logs/responses)
 */
export declare class ChatController {
    private readonly aiService;
    private readonly guardrailsService;
    constructor(aiService: AIService, guardrailsService: GuardrailsService);
    /**
     * POST /api/chat — GuardrailPipe validates request body; GuardrailInterceptor validates input and output.
     * Blocks injection, toxicity; redacts PII in responses.
     */
    chatWithPipeAndInterceptor(body: ChatRequest): Promise<{
        reply: string;
    }>;
    /**
     * GET /api/chat/decorated?message=... — Uses @GuardrailInput and @GuardrailOutput with @AITask.
     * Demonstrates decorator-based guardrails with string input (query param).
     */
    chatWithDecorators(message: string): Promise<string>;
    /**
     * GET /api/chat/redact — Demonstrates manual PII redaction via GuardrailsService.
     */
    redactPII(text: string): Promise<{
        original: string;
        redacted: string;
    }>;
    /**
     * GET /api/chat/check — Demonstrates manual input check (useful for debugging).
     */
    checkInput(text: string): Promise<{
        allowed: boolean;
        violations?: string[];
        modified?: string;
    }>;
    private generateReply;
}
export {};
