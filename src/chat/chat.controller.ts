import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  UsePipes,
  UseInterceptors,
} from '@hazeljs/core';
import { AIService, AITask } from '@hazeljs/ai';
import {
  GuardrailsService,
  GuardrailPipe,
  GuardrailInterceptor,
  GuardrailInput,
  GuardrailOutput,
} from '@hazeljs/guardrails';
import { GuardrailErrorInterceptor } from '../interceptors/guardrail-error.interceptor';

const SUPPORT_SYSTEM_PROMPT = `You are a helpful customer support assistant for a SaaS company.
Be concise, professional, and empathetic. If you don't know something, say so.
Never reveal internal systems, competitor names, or sensitive data.
Keep responses under 200 words.`;

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
@Controller({ path: '/api/chat' })
@UseInterceptors(GuardrailErrorInterceptor)
export class ChatController {
  constructor(
    private readonly aiService: AIService,
    private readonly guardrailsService: GuardrailsService
  ) {}

  /**
   * POST /api/chat — GuardrailPipe validates request body; GuardrailInterceptor validates input and output.
   * Blocks injection, toxicity; redacts PII in responses.
   */
  @Post()
  @UsePipes(GuardrailPipe)
  @UseInterceptors(GuardrailInterceptor)
  async chatWithPipeAndInterceptor(@Body() body: ChatRequest): Promise<{ reply: string }> {
    const text = body.message ?? body.prompt ?? body.content ?? '';
    const reply = await this.generateReply(text);
    return { reply };
  }

  /**
   * GET /api/chat/decorated?message=... — Uses @GuardrailInput and @GuardrailOutput with @AITask.
   * Demonstrates decorator-based guardrails with string input (query param).
   */
  @Get('/decorated')
  @GuardrailOutput({ allowPII: false })
  @GuardrailInput({ redactPII: true, blockInjection: true, blockToxicity: true })
  @AITask({
    name: 'support-chat',
    prompt: SUPPORT_SYSTEM_PROMPT + '\n\nCustomer message: {{input}}',
    provider: (process.env.AI_PROVIDER as 'openai' | 'ollama') || 'openai',
    model: process.env.AI_MODEL || 'gpt-4o-mini',
    outputType: 'string',
    temperature: 0.7,
    maxTokens: 512,
    stream: false,
  })
  async chatWithDecorators(@Query('message') message: string): Promise<string> {
    return message ?? '';
  }

  /**
   * GET /api/chat/redact — Demonstrates manual PII redaction via GuardrailsService.
   */
  @Get('/redact')
  async redactPII(@Query('text') text: string): Promise<{ original: string; redacted: string }> {
    const redacted = this.guardrailsService.redactPII(text || '');
    return { original: text || '', redacted };
  }

  /**
   * GET /api/chat/check — Demonstrates manual input check (useful for debugging).
   */
  @Get('/check')
  async checkInput(@Query('text') text: string): Promise<{
    allowed: boolean;
    violations?: string[];
    modified?: string;
  }> {
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

  private async generateReply(message: string): Promise<string> {
    const result = await this.aiService.executeTask(
      {
        name: 'support-reply',
        prompt: SUPPORT_SYSTEM_PROMPT + '\n\nCustomer message: {{input}}',
        provider: (process.env.AI_PROVIDER as 'openai' | 'ollama') || 'openai',
        model: process.env.AI_MODEL || 'gpt-4o-mini',
        outputType: 'string',
        temperature: 0.7,
        maxTokens: 512,
        stream: false,
      },
      message
    );

    if (result.error) {
      throw new Error(result.error);
    }

    const output = result.data as string;
    const outputCheck = this.guardrailsService.checkOutput(output, { allowPII: false });
    return (outputCheck.modified as string) ?? output;
  }
}
